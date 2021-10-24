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


keyDecoder : State -> (String -> msg) -> (State -> msg) -> Json.Decode.Decoder { message : msg, stopPropagation : Bool, preventDefault : Bool }
keyDecoder state acceptMsg selectMsg =
    let
        -- https://thoughtbot.com/blog/advanced-dom-event-handlers-in-elm
        suppressedEvent =
            Json.Decode.fail "suppressed event"

        handledWith msg =
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
                        handledWith <| selectMsg (next state)

                    ( Opened _ _, "ArrowUp" ) ->
                        handledWith <| selectMsg (prev state)

                    ( Opened _ _, "Enter" ) ->
                        case selection state of
                            Just text ->
                                handledWith <| acceptMsg text

                            Nothing ->
                                suppressedEvent

                    ( Opened _ _, "Escape" ) ->
                        handledWith <| selectMsg Closed

                    _ ->
                        suppressedEvent
            )


render : State -> String -> (String -> msg) -> (String -> msg) -> (State -> msg) -> Html msg
render state query updateMsg acceptMsg selectMsg =
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
            , onInput updateMsg
            , onBlur (selectMsg Closed)
            , autofocus True
            , placeholder "keywords..."
            , autocomplete False
            , custom "keydown" (keyDecoder state acceptMsg selectMsg)
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
                            -- onClick <| acceptMsg suggestion
                            li
                                [ -- to prevent blur
                                  preventDefaultOn "mousedown" (Json.Decode.succeed ( acceptMsg suggestion, True ))
                                , attribute "aria-selected" (boolean <| i == selectedIndex)
                                ]
                                [ text suggestion ]
                        )
                        suggestions
                    )
        ]
