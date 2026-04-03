port module Main exposing (Modal, Model, Msg, main)

import Bookmark exposing (Bookmark)
import Browser
import Browser.Dom
import Browser.Events
import File exposing (File)
import File.Download
import File.Select
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode
import Json.Encode
import List.Extra
import Markdown
import Task


type Msg
    = Noop
    | DownloadFile
    | RequestFileOpen
    | FileSelected File
    | FileLoaded String
    | CloseModal
    | KeyDown String
    | Edit Bookmark Int
    | UpdateContent String
    | UpdateColor String
    | UpdateBookmark Bookmark Int
    | DeleteBookmark Int
    | NewBookmark


type Modal
    = Closed
    | ImportError Json.Decode.Error
    | BookmarkEdit Bookmark Int


type alias Model =
    { bookmarks : List Bookmark
    , modal : Modal
    }



-------------------------------------------------


port saveBookmarks : List Bookmark -> Cmd msg



-------------------------------------------------


setModal : Modal -> Model -> ( Model, Cmd Msg )
setModal mdl model =
    let
        focusOnModal =
            Task.attempt (\_ -> Noop) (Browser.Dom.focus "modalFocus")
    in
    ( { model | modal = mdl }, focusOnModal )


init : String -> ( Model, Cmd Msg )
init content =
    case Json.Decode.decodeString (Json.Decode.list Bookmark.decoder) content of
        Ok bookmarks ->
            ( { bookmarks = bookmarks, modal = Closed }, Cmd.none )

        Err err ->
            { bookmarks = [], modal = Closed } |> setModal (ImportError err)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        updateBookmarks updatedBookmarks =
            ( { model | bookmarks = updatedBookmarks, modal = Closed }, saveBookmarks updatedBookmarks )
    in
    case msg of
        Noop ->
            ( model, Cmd.none )

        DownloadFile ->
            let
                content =
                    Json.Encode.encode 2 (Json.Encode.list Bookmark.encoder model.bookmarks)
            in
            ( model, File.Download.string "bookmarks.json" "application.json" content )

        RequestFileOpen ->
            ( model
            , File.Select.file [ "application/json" ] FileSelected
            )

        FileSelected file ->
            ( model
            , Task.perform FileLoaded (File.toString file)
            )

        FileLoaded content ->
            case Json.Decode.decodeString (Json.Decode.list Bookmark.decoder) content of
                Ok bookmarks ->
                    updateBookmarks bookmarks

                Err err ->
                    model |> setModal (ImportError err)

        CloseModal ->
            ( { model | modal = Closed }, Cmd.none )

        Edit bookmark i ->
            model |> setModal (BookmarkEdit bookmark i)

        UpdateContent text ->
            case model.modal of
                BookmarkEdit bookmark i ->
                    ( { model | modal = BookmarkEdit { bookmark | content = text } i }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        UpdateColor color ->
            case model.modal of
                BookmarkEdit bookmark i ->
                    ( { model | modal = BookmarkEdit { bookmark | color = color } i }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        UpdateBookmark bookmark i ->
            updateBookmarks <| List.Extra.setAt i bookmark model.bookmarks

        DeleteBookmark i ->
            updateBookmarks <| List.Extra.removeAt i model.bookmarks

        NewBookmark ->
            let
                newBookmark =
                    Bookmark.blank

                newBookmarks =
                    model.bookmarks ++ [ newBookmark ]

                ( updatedModel1, updateCmd ) =
                    newBookmarks |> updateBookmarks

                ( updatedModel2, focusCmd ) =
                    updatedModel1 |> setModal (BookmarkEdit newBookmark (List.length newBookmarks - 1))
            in
            ( updatedModel2, Cmd.batch [ updateCmd, focusCmd ] )

        KeyDown "Escape" ->
            ( { model | modal = Closed }, Cmd.none )

        KeyDown _ ->
            ( model, Cmd.none )



-------------------------------------------------


renderCard : Bookmark -> List (Html.Attribute msg) -> Html msg
renderCard bookmark extraAttrs =
    let
        defaults =
            Markdown.defaultOptions

        unsanitized =
            { defaults | sanitize = False }

        background =
            if String.trim bookmark.content == "" then
                "#EEEEEE"

            else
                bookmark.color
    in
    Html.div ([ HA.class "card w-[277px] h-[170px] rounded-md text-white text-xl p-3", HA.style "background" background ] ++ extraAttrs)
        [ Html.div
            [ HA.class "flex size-full items-center justify-center" ]
            [ Markdown.toHtmlWith unsanitized [] bookmark.content ]
        ]


view : Model -> Html Msg
view model =
    let
        cards =
            Html.div
                [ HA.class "flex flex-wrap gap-1 pb-[170px]", HE.onDoubleClick NewBookmark ]
                (model.bookmarks
                    |> List.indexedMap
                        (\i bookmark ->
                            renderCard bookmark [ HE.stopPropagationOn "dblclick" (Json.Decode.succeed ( Edit bookmark i, True )) ]
                        )
                )

        buttons =
            let
                btnClass =
                    "border rounded-md py-1 px-2 h-fit hover:bg-blue-400 hover:text-white disabled:opacity-50 hover:disabled:bg-gray-400"

                disabled =
                    List.isEmpty model.bookmarks
            in
            Html.div [ HA.class "flex flex-wrap gap-1 text-gray-300 font-bold text-sm items-center justify-end h-[60px]" ]
                [ Html.button [ HA.class btnClass, HE.onClick RequestFileOpen ]
                    [ Html.text "Import" ]
                , Html.button [ HA.class btnClass, HE.onClick DownloadFile, HA.disabled disabled ]
                    [ Html.text "Export" ]
                ]

        renderModal =
            case model.modal of
                Closed ->
                    Html.text ""

                ImportError err ->
                    modal
                        [ Html.pre [ HA.class "whitespace-pre-wrap max-w-[800px]" ]
                            [ Html.text <| Json.Decode.errorToString err ]
                        , Html.div [ HA.class "flex justify-end" ]
                            [ Html.button [ HA.id "modalFocus", HA.class "border rounded-md mt-4 py-1 px-5 bg-blue-400 text-white hover:bg-blue-500", HE.onClick CloseModal ]
                                [ Html.text "OK" ]
                            ]
                        ]

                BookmarkEdit bookmark i ->
                    modal
                        [ Html.h2 [ HA.class "min-w-[500px] text-lg text-bold" ]
                            [ Html.text "Edit Card" ]
                        , Html.div [ HA.class "flex flex-col" ]
                            [ Html.label [ HA.class "mt-3 mb-1" ]
                                [ Html.text "Content" ]
                            , Html.textarea [ HA.id "modalFocus", HA.class "border px-1 py-2", HA.rows 12, HA.value bookmark.content, HE.onInput UpdateContent ]
                                []
                            , Html.label [ HA.class "mt-3 mb-1" ]
                                [ Html.text "Color" ]
                            , Html.input [ HA.type_ "color", HA.value bookmark.color, HE.onInput UpdateColor ]
                                []
                            , Html.label [ HA.class "mt-3 mb-1" ]
                                [ Html.text "Preview" ]
                            , Html.div [ HA.attribute "inert" "true" ]
                                [ renderCard bookmark []
                                ]
                            ]
                        , Html.div [ HA.class "flex mt-4 flex-row-reverse" ]
                            [ Html.button [ HA.class "border rounded-md mx-[2px] mt-4 py-1 px-5 bg-blue-400 text-white hover:bg-blue-500", HE.onClick (UpdateBookmark bookmark i) ]
                                [ Html.text "Save" ]
                            , Html.button [ HA.class "border rounded-md mx-[2px] mt-4 py-1 px-5 hover:bg-blue-400 hover:text-white", HE.onClick CloseModal ]
                                [ Html.text "Cancel" ]
                            , Html.button [ HA.class "border rounded-md mr-auto mt-4 py-1 px-5 bg-red-400 text-white hover:bg-red-500 hover:text-white", HE.onClick (DeleteBookmark i) ]
                                [ Html.text "Delete" ]
                            ]
                        ]
    in
    Html.div [ HA.class "max-w-6xl mx-auto mt-6 px-4" ]
        [ buttons
        , cards
        , renderModal
        ]



-------------------------------------------------
-- helpers
-------------------------------------------------


modal : List (Html Msg) -> Html Msg
modal content =
    Html.div
        [ HA.class "fixed top-0 left-0 size-full bg-black/80 p-4"
        , HE.onClick CloseModal
        ]
        [ Html.div
            [ HA.class "bg-white rounded p-4 text-sm text-gray-600 mx-auto mt-[5%] w-fit"
            , HE.stopPropagationOn "click" (Json.Decode.succeed ( Noop, True ))
            ]
            content
        ]



-------------------------------------------------


subscriptions : Model -> Sub Msg
subscriptions _ =
    Browser.Events.onKeyUp (Json.Decode.map KeyDown (Json.Decode.field "key" Json.Decode.string))


main : Program String Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
