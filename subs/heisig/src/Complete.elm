module Complete exposing (State, closed, new, render)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode


{-| opaque

    can create with new / closed

    create new one to update

-}
type State
    = Closed
    | Opened (List String) Int


new : List String -> State
new suggestions =
    case suggestions of
        [] ->
            Closed

        _ ->
            Opened suggestions -1


closed : State
closed =
    Closed


type alias Callbacks msg =
    { updateQuery : String -> msg
    , updateState : State -> msg
    , acceptQuery : String -> msg
    }


{--
-------------------------------------------------
    helpers
-------------------------------------------------
--}


next : State -> State
next state =
    case state of
        Closed ->
            Closed

        Opened suggestions i ->
            Opened suggestions <|
                modBy (List.length suggestions) (i + 1)


prev : State -> State
prev state =
    case state of
        Closed ->
            Closed

        Opened suggestions i ->
            if i == -1 then
                prev (Opened suggestions 0)

            else
                Opened suggestions <|
                    modBy (List.length suggestions) (i - 1)


selection : State -> Maybe String
selection state =
    case state of
        Closed ->
            Nothing

        Opened suggestions i ->
            if i == -1 then
                Nothing

            else
                List.drop i suggestions |> List.head



{--
-------------------------------------------------
    widget
-------------------------------------------------
--}


keyDecoder : State -> Callbacks msg -> Json.Decode.Decoder { message : msg, stopPropagation : Bool, preventDefault : Bool }
keyDecoder state messages =
    let
        -- https://thoughtbot.com/blog/advanced-dom-event-handlers-in-elm
        suppressedEvent =
            Json.Decode.fail "suppressed event"

        handleWith msg =
            Json.Decode.succeed
                { message = msg
                , stopPropagation = True
                , preventDefault = True
                }
    in
    Json.Decode.field "key" Json.Decode.string
        |> Json.Decode.andThen
            (\key ->
                case ( state, key ) of
                    ( Opened _ _, "ArrowDown" ) ->
                        handleWith <| messages.updateState (next state)

                    ( Opened _ _, "ArrowUp" ) ->
                      handleWith <| messages.updateState (prev state)

                    ( Opened _ _, "Enter" ) ->
                        case selection state of
                            Just text ->
                                handleWith <| messages.acceptQuery text

                            Nothing ->
                                suppressedEvent

                    ( Opened _ _, "Escape" ) ->
                        handleWith <| messages.updateState Closed

                    _ ->
                        suppressedEvent
            )



render : State -> String -> Callbacks msg -> Html msg
render state query messages =
    let
        boolean v =
            if v then
                "true"

            else
                "false"
    in
    div [ class "awesomplete" ]
        [ input
            [ id "query"
            , value query
            , onInput messages.updateQuery
            , onBlur (messages.updateState Closed)
            , autofocus True
            , placeholder "keywords..."
            , autocomplete False
            , custom "keydown" (keyDecoder state messages)
            , attribute "autocapitalize" "off"
            , attribute "autocorrect" "off"
            , style "width" "500px"
            ]
            []
        , case state of
            Closed ->
                text ""

            Opened suggestions selectedIndex ->
                ul []
                    (List.indexedMap
                        (\i suggestion ->
                            li
                                -- mousedown (instead of mouseclick) to prevent blur
                                [ preventDefaultOn "mousedown" (Json.Decode.succeed ( messages.acceptQuery suggestion, True ))
                                , attribute "aria-selected" (boolean <| i == selectedIndex)
                                ]
                                [ text suggestion ]
                        )
                        suggestions
                    )
        ]
