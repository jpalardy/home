port module Main exposing (Modal, Model, Msg, main)

import Browser
import Browser.Dom
import Browser.Events
import Card exposing (Card)
import Drag
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
    | Edit Card Int
    | UpdateContent String
    | UpdateColor String
    | UpdateCard Card Int
    | DeleteCard Int
    | DragStart Int
    | DragDrop Int
    | NewCard


type Modal
    = Closed
    | ImportError Json.Decode.Error
    | CardEdit Card Int


type alias Model =
    { cards : List Card
    , dragIndex : Maybe Int
    , modal : Modal
    }



-------------------------------------------------


port saveCards : List Card -> Cmd msg



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
    case Json.Decode.decodeString (Json.Decode.list Card.decoder) content of
        -- start with _some_ cards
        Ok [] ->
            let
                initCards =
                    [ Card.blank, Card.blank, Card.blank, Card.blank ]
            in
            ( { cards = initCards, dragIndex = Nothing, modal = Closed }, saveCards initCards )

        Ok cards ->
            ( { cards = cards, dragIndex = Nothing, modal = Closed }, Cmd.none )

        Err err ->
            { cards = [], dragIndex = Nothing, modal = Closed } |> setModal (ImportError err)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        updateCards updatedCards =
            ( { model | cards = updatedCards, dragIndex = Nothing, modal = Closed }, saveCards updatedCards )
    in
    case msg of
        Noop ->
            ( model, Cmd.none )

        DownloadFile ->
            let
                content =
                    Json.Encode.encode 2 (Json.Encode.list Card.encoder model.cards)
            in
            ( model, File.Download.string "board.json" "application.json" content )

        RequestFileOpen ->
            ( model
            , File.Select.file [ "application/json" ] FileSelected
            )

        FileSelected file ->
            ( model
            , Task.perform FileLoaded (File.toString file)
            )

        FileLoaded content ->
            case Json.Decode.decodeString (Json.Decode.list Card.decoder) content of
                Ok cards ->
                    updateCards cards

                Err err ->
                    model |> setModal (ImportError err)

        CloseModal ->
            ( { model | modal = Closed }, Cmd.none )

        Edit card i ->
            model |> setModal (CardEdit card i)

        UpdateContent text ->
            case model.modal of
                CardEdit card i ->
                    ( { model | modal = CardEdit { card | content = text } i }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        UpdateColor color ->
            case model.modal of
                CardEdit card i ->
                    ( { model | modal = CardEdit { card | color = color } i }, Cmd.none )

                _ ->
                    ( model, Cmd.none )

        UpdateCard card i ->
            updateCards <| List.Extra.setAt i card model.cards

        DeleteCard i ->
            updateCards <| List.Extra.removeAt i model.cards

        NewCard ->
            updateCards <| model.cards ++ [ Card.blank ]

        KeyDown "Escape" ->
            ( { model | modal = Closed }, Cmd.none )

        KeyDown _ ->
            ( model, Cmd.none )

        DragStart i ->
            ( { model | dragIndex = Just i }, Cmd.none )

        DragDrop dropIndex ->
            case model.dragIndex of
                Nothing ->
                    ( model, Cmd.none )

                Just dragIndex ->
                    updateCards <| moveItem dragIndex dropIndex model.cards


moveItem : Int -> Int -> List a -> List a
moveItem srcIndex dstIndex list =
    case List.Extra.getAt srcIndex list of
        Nothing ->
            list

        Just item ->
            list
                |> List.Extra.removeAt srcIndex
                |> List.Extra.splitAt dstIndex
                |> (\( before, after ) -> List.concat [ before, [ item ], after ])



-------------------------------------------------


renderCard : Card -> List (Html.Attribute msg) -> Html msg
renderCard card extraAttrs =
    let
        defaults =
            Markdown.defaultOptions

        unsanitized =
            { defaults | sanitize = False }

        background =
            if String.trim card.content == "" then
                "#EEEEEE"

            else
                card.color
    in
    Html.div ([ HA.class "card w-[277px] h-[170px] rounded-md text-white text-xl p-3", HA.style "background" background ] ++ extraAttrs)
        [ Html.div
            [ HA.class "flex size-full items-center justify-center truncate" ]
            [ Markdown.toHtmlWith unsanitized [] card.content ]
        ]


view : Model -> Html Msg
view model =
    let
        cards =
            let
                doubleClickOnly ev =
                    HE.custom "mousedown"
                        (Json.Decode.field "detail" Json.Decode.int
                            |> Json.Decode.andThen
                                (\detail ->
                                    if detail >= 2 then
                                        Json.Decode.succeed
                                            { message = ev
                                            , stopPropagation = True
                                            , preventDefault = True
                                            }

                                    else
                                        Json.Decode.fail "single click"
                                )
                        )
            in
            Html.div
                [ HA.class "flex flex-wrap gap-1 pb-[170px]" ]
                (model.cards
                    |> List.indexedMap
                        (\i card ->
                            renderCard card
                                [ doubleClickOnly <| Edit card i
                                , HA.draggable "true"
                                , Drag.onStart (DragStart i)
                                , Drag.onDrop (DragDrop i)
                                , Drag.onOver Noop
                                ]
                        )
                )

        buttons =
            let
                btnClass =
                    String.join " "
                        [ "border rounded-md py-1 px-3 h-fit hover:text-white hover:bg-blue-400"
                        , "disabled:text-gray-400 disabled:bg-gray-300"
                        ]

                disabled =
                    List.isEmpty model.cards
            in
            Html.div [ HA.class "flex flex-wrap gap-1 text-gray-300 font-bold text-sm items-center justify-end h-[60px]" ]
                [ Html.button [ HA.class btnClass, HE.onClick NewCard ]
                    [ Html.text "+" ]
                , Html.button [ HA.class btnClass, HE.onClick RequestFileOpen ]
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

                CardEdit card i ->
                    modal
                        [ Html.h2 [ HA.class "min-w-[500px] text-lg text-bold" ]
                            [ Html.text "Edit Card" ]
                        , Html.div [ HA.class "flex flex-col" ]
                            [ Html.label [ HA.class "mt-3 mb-1" ]
                                [ Html.text "Content" ]
                            , Html.textarea [ HA.id "modalFocus", HA.class "border px-1 py-2", HA.rows 12, HA.value card.content, HE.onInput UpdateContent ]
                                []
                            , Html.label [ HA.class "mt-3 mb-1" ]
                                [ Html.text "Color" ]
                            , Html.input [ HA.type_ "color", HA.value card.color, HE.onInput UpdateColor ]
                                []
                            , Html.label [ HA.class "mt-3 mb-1" ]
                                [ Html.text "Preview" ]
                            , Html.div [ HA.attribute "inert" "true" ]
                                [ renderCard card []
                                ]
                            ]
                        , Html.div [ HA.class "flex mt-4 flex-row-reverse" ]
                            [ Html.button [ HA.class "border rounded-md mx-[2px] mt-4 py-1 px-5 bg-blue-400 text-white hover:bg-blue-500", HE.onClick (UpdateCard card i) ]
                                [ Html.text "Save" ]
                            , Html.button [ HA.class "border rounded-md mx-[2px] mt-4 py-1 px-5 hover:bg-blue-400 hover:text-white", HE.onClick CloseModal ]
                                [ Html.text "Cancel" ]
                            , Html.button [ HA.class "border rounded-md mr-auto mt-4 py-1 px-5 bg-red-400 text-white hover:bg-red-500 hover:text-white", HE.onClick (DeleteCard i) ]
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
