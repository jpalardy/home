module Volume exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)


type Msg
    = NoOp


type alias Model =
    { value : String }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { value = "nothing yet" }, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


view : Model -> Html Msg
view model =
    text model.value


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }
