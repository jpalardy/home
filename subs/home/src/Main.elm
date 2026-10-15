port module Main exposing (..)

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
    = HttpError Http.Error
    | DecodeError Json.Decode.Error


type Msg
    = Update String
    | Submit
    | KeyDown String
    | GotSites (Result WrappedError (List Site))
    | Click
    | NoOp


type RemoteData err a
    = Loading
    | Failure err
    | Success a


type InputState
    = Unmodified
    | Modified
    | Submitted


type alias Model =
    { text : String
    , inputState : InputState
    , destination : Maybe String
    , sites : RemoteData WrappedError (Dict String Site)
    , completions : List String
    }



-------------------------------------------------


port redirect : String -> Cmd msg


port addSites : (Json.Decode.Value -> msg) -> Sub msg


port restoredFromBfcache : (Json.Decode.Value -> msg) -> Sub msg



-------------------------------------------------


sitesOrEmpty : RemoteData err (Dict k v) -> Dict k v
sitesOrEmpty rmtSites =
    case rmtSites of
        Loading ->
            Dict.empty

        Failure _ ->
            Dict.empty

        Success sites ->
            sites


withText : String -> Model -> Model
withText text model =
    let
        destination =
            Site.match (model.sites |> sitesOrEmpty) text
    in
    if text == model.text then
        { model
            | destination = destination
        }

    else
        { model
            | text = text
            , inputState = Modified
            , destination = destination
            , completions = []
        }


withCompletions : List String -> Model -> Model
withCompletions completions model =
    { model | completions = completions }


withSites : Dict String Site -> Model -> Model
withSites sites model =
    { model | sites = Success sites }


tabComplete : Model -> Model
tabComplete model =
    let
        completions =
            case model.completions of
                [] ->
                    Completion.init (model.sites |> sitesOrEmpty |> Dict.keys) model.text

                _ ->
                    Completion.cycle model.completions

        newText =
            completions |> List.head |> Maybe.withDefault model.text
    in
    model
        |> withText newText
        |> withCompletions completions



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
    ( { text = initialText
      , inputState = Unmodified
      , destination = Nothing
      , sites = Loading
      , completions = []
      }
        |> withText initialText
    , Cmd.batch [ getSites, focus ]
    )


trySubmit : Model -> ( Model, Cmd Msg )
trySubmit model =
    case model.destination of
        Nothing ->
            ( model, Cmd.none )

        Just url ->
            ( { model | inputState = Submitted }, redirect url )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Update text ->
            ( model |> withText text, Cmd.none )

        Submit ->
            trySubmit model

        GotSites (Err err) ->
            ( { model | sites = Failure err }, Cmd.none )

        GotSites (Ok sites) ->
            let
                inputState =
                    model.inputState

                newSites =
                    sites
                        |> Site.fromList
                        |> Dict.union (model.sites |> sitesOrEmpty)

                newModel =
                    model
                        |> withSites newSites
                        |> withText model.text
            in
            if inputState == Unmodified then
                trySubmit newModel

            else
                ( newModel, Cmd.none )

        KeyDown "Escape" ->
            ( model |> withText "", focus )

        KeyDown "Control-u" ->
            ( model |> withText "", focus )

        KeyDown "Tab" ->
            ( model |> tabComplete, focus )

        KeyDown "Shift-Enter" ->
            ( model |> withText ("g " ++ model.text), focus )

        KeyDown _ ->
            ( model, Cmd.none )

        Click ->
            ( model, focus )

        NoOp ->
            ( model, Cmd.none )



-------------------------------------------------


view : Model -> Html Msg
view model =
    let
        extraStyles =
            if model.inputState == Submitted then
                [ HA.style "opacity" "0.3" ]

            else
                []
    in
    Html.div (HA.style "margin" "30px 15px" :: extraStyles) <|
        case model.sites of
            Failure err ->
                [ renderError err ]

            Loading ->
                []

            Success _ ->
                [ renderForm model.text
                , renderDestination model.destination
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
                [ HA.style "color" "rgb(216, 24, 24)"
                , HA.style "font" "16px monospace"
                , HA.style "margin-top" "20px"
                , HA.style "max-width" "800px"
                ]
                [ Html.text message ]
    in
    case wrappedError of
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
-- helpers
-------------------------------------------------


focus : Cmd Msg
focus =
    Task.attempt (\_ -> NoOp) (Browser.Dom.focus "q")



-------------------------------------------------


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onKeyDown (KeyDecoder.combiner KeyDown)
        , Browser.Events.onClick (Json.Decode.succeed Click)
        , addSites (Json.Decode.decodeValue Site.fromJson >> Result.mapError DecodeError >> GotSites)
        , restoredFromBfcache (always <| Update "")
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
