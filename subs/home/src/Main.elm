port module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Events
import Completion
import Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Http
import Json.Decode
import KeyDecoder
import Site exposing (Site)
import Task



-------------------------------------------------


type WrappedError
    = None
    | HttpError Http.Error
    | DecodeError Json.Decode.Error


type Msg
    = Update String
    | Submit
    | KeyDown String
    | GotSites (Result WrappedError (List Site))
    | Refocus
    | NoOp


type alias Model =
    { text : String
    , initialText : String
    , destination : Maybe String
    , sites : Dict String Site
    , completions : List String
    , submitted : Bool
    , err : WrappedError
    }



-------------------------------------------------


port redirect : String -> Cmd msg


port addSites : (Json.Decode.Value -> msg) -> Sub msg



-------------------------------------------------


updateText : String -> Model -> Model
updateText text model =
    let
        completions =
            if text == model.text then
                model.completions

            else
                []
    in
    { model
        | text = text
        , destination = Site.match model.sites text
        , completions = completions
        , submitted = False
    }


updateCompletions : List String -> Model -> Model
updateCompletions completions model =
    { model | completions = completions }


updateSites : Dict String Site -> Model -> Model
updateSites sites model =
    { model | sites = sites } |> updateText model.text


tabComplete : Model -> Model
tabComplete model =
    let
        completions =
            case model.completions of
                [] ->
                    Completion.init (model.sites |> Dict.keys) model.text

                _ ->
                    Completion.cycle model.completions

        newText =
            completions |> List.head |> Maybe.withDefault model.text
    in
    model
        |> updateText newText
        |> updateCompletions completions



-------------------------------------------------


getSites : Cmd Msg
getSites =
    Http.get
        { url = "sites.json"
        , expect = Http.expectJson (Result.mapError HttpError >> GotSites) Site.fromJson
        }



-------------------------------------------------


init : String -> ( Model, Cmd Msg )
init initialText =
    ( { text = ""
      , initialText = initialText
      , destination = Nothing
      , sites = Site.hardcoded
      , completions = []
      , submitted = False
      , err = None
      }
        |> updateText initialText
    , getSites
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        focus =
            Task.attempt (\_ -> NoOp) (Browser.Dom.focus "q")
    in
    case msg of
        Update text ->
            ( model |> updateText text, Cmd.none )

        Submit ->
            case model.destination of
                Nothing ->
                    ( model, Cmd.none )

                Just url ->
                    ( { model | submitted = True }, redirect url )

        GotSites (Err err) ->
            ( { model | err = err }, Cmd.none )

        GotSites (Ok sites) ->
            let
                newSites =
                    sites
                        |> Site.fromList
                        |> Dict.union model.sites

                newModel =
                    model |> updateSites newSites
            in
            if newModel.text == newModel.initialText then
                update Submit newModel

            else
                ( newModel, Cmd.none )

        KeyDown "Escape" ->
            ( model |> updateText "", focus )

        KeyDown "Control-u" ->
            ( model |> updateText "", focus )

        KeyDown "Tab" ->
            ( model |> tabComplete, focus )

        KeyDown "Shift-Enter" ->
            ( model |> updateText ("g " ++ model.text), focus )

        KeyDown _ ->
            ( model, focus )

        Refocus ->
            ( model, focus )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------


view : Model -> Html Msg
view model =
    let
        extraStyles =
            if model.submitted then
                [ HA.style "opacity" "0.3" ]

            else
                []
    in
    Html.div (HA.style "margin" "30px 15px" :: extraStyles)
        [ renderForm model.text
        , renderDestination model.destination
        , renderError model.err
        ]


renderForm : String -> Html Msg
renderForm text =
    Html.form
        [ HA.style "display" "grid"
        , HA.style "grid-template-columns" "max-content 1fr"
        , HA.style "grid-gap" "6px"
        , HA.style "align-items" "center"
        , HE.onSubmit Submit
        ]
        [ Html.label [] [ Html.text ">" ]
        , Html.input
            [ HA.id "q"
            , HA.name "q"
            , HA.autofocus True
            , HA.autocomplete False
            , HA.attribute "autocapitalize" "none"
            , HA.attribute "autocorrect" "false"
            , HA.spellcheck False
            , HA.style "color" "#333"
            , HA.style "font" "16px monospace"
            , HA.style "outline" "none"
            , HA.style "border" "0"
            , HA.value text
            , HE.onInput Update
            , HE.onBlur Refocus
            , HE.custom "keydown" (KeyDecoder.tabCatcher (KeyDown "Tab"))
            ]
            []
        ]


renderDestination : Maybe String -> Html Msg
renderDestination destination =
    case destination of
        Nothing ->
            Html.text ""

        Just url ->
            Html.a
                [ HA.href url
                , HA.style "color" "#ddd"
                , HA.style "font" "16px monospace"
                , HA.style "display" "block"
                , HA.style "margin-top" "20px"
                , HA.style "overflow" "hidden"
                , HA.style "text-wrap" "nowrap"
                ]
                [ Html.text url ]


renderError : WrappedError -> Html msg
renderError wrappedError =
    let
        divWrapper message =
            Html.div
                [ HA.style "color" "#faa"
                , HA.style "font" "16px monospace"
                , HA.style "margin-top" "20px"
                , HA.style "max-width" "800px"
                ]
                [ Html.text message ]
    in
    case wrappedError of
        None ->
            Html.text ""

        HttpError (Http.BadUrl msg) ->
            divWrapper msg

        HttpError Http.Timeout ->
            divWrapper "Timeout"

        HttpError Http.NetworkError ->
            divWrapper "Network error"

        HttpError (Http.BadStatus code) ->
            divWrapper <| "Status: " ++ String.fromInt code

        HttpError (Http.BadBody body) ->
            divWrapper <| body

        DecodeError err ->
            divWrapper <| Json.Decode.errorToString err



-------------------------------------------------


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onKeyDown (KeyDecoder.combiner KeyDown)
        , addSites (Json.Decode.decodeValue Site.fromJson >> Result.mapError DecodeError >> GotSites)
        ]



-------------------------------------------------


main : Program String Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
