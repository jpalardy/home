module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Events
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as Events
import Json.Decode as Decode
import Task


type Msg
    = UpdateText String
    | KeyDown String
    | NoOp


type alias Model =
    { inputText : String
    , hidden : Bool
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { inputText = ""
      , hidden = True
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateText text ->
            ( { model | inputText = text }, Cmd.none )

        KeyDown "Escape" ->
            ( { model | hidden = not model.hidden }, Task.attempt (\_ -> NoOp) (Browser.Dom.focus "volume-input") )

        KeyDown _ ->
            ( model, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Browser.Events.onKeyDown (Decode.map KeyDown (Decode.field "key" Decode.string))



{--
-------------------------------------------------
    helpers
-------------------------------------------------
--}


lines : String -> List String
lines =
    String.split "\n"


convertToMl : String -> Maybe Int
convertToMl str =
    let
        numbers =
            str |> String.words |> List.filterMap String.toFloat

        unitAdjust =
            if String.contains "inches" str then
                2.54

            else
                1
    in
    if List.length numbers == 3 then
        numbers |> List.map ((*) unitAdjust) |> List.product |> ceiling |> Just

    else
        Nothing



{--
-------------------------------------------------
    view
-------------------------------------------------
--}


view : Model -> Html Msg
view model =
    let
        outputText =
            model.inputText
                |> lines
                |> List.map (convertToMl >> Maybe.map (\ml -> String.fromInt ml ++ "ml") >> Maybe.withDefault "???")
                |> String.join "\n"
    in
    div [ class "volume", classList [ ( "hide", model.hidden ) ] ]
        [ textarea [ Events.onInput UpdateText, rows 3, id "volume-input" ]
            [ text model.inputText
            ]
        , pre [ style "margin-top" "3px" ]
            [ text outputText
            ]
        ]


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
