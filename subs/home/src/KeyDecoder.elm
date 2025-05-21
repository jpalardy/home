module KeyDecoder exposing (combiner, tabCatcher)

import Json.Decode


type alias CustomMsg a =
    { message : a
    , stopPropagation : Bool
    , preventDefault : Bool
    }


combiner : (String -> msg) -> Json.Decode.Decoder msg
combiner msg =
    Json.Decode.map3
        (\key ctrlKey shiftKey ->
            [ ( "Control", ctrlKey ), ( "Shift", shiftKey ), ( key, True ) ]
                |> List.filter Tuple.second
                |> List.map Tuple.first
                |> String.join "-"
                |> msg
        )
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "ctrlKey" Json.Decode.bool)
        (Json.Decode.field "shiftKey" Json.Decode.bool)


tabCatcher : msg -> Json.Decode.Decoder (CustomMsg msg)
tabCatcher msg =
    combiner identity
        |> Json.Decode.andThen
            (\keyCombination ->
                case keyCombination of
                    "Tab" ->
                        Json.Decode.succeed
                            { message = msg
                            , stopPropagation = True
                            , preventDefault = True
                            }

                    _ ->
                        Json.Decode.fail "propagate"
            )
