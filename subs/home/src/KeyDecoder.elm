module KeyDecoder exposing (combiner, tabCatcher)

import Json.Decode


type alias CustomMsg a =
    { message : a
    , stopPropagation : Bool
    , preventDefault : Bool
    }


combiner : (String -> msg) -> Json.Decode.Decoder msg
combiner msg =
    let
        decodeMaybeKey : String -> Json.Decode.Decoder (Maybe String)
        decodeMaybeKey keyName =
            Json.Decode.bool
                |> Json.Decode.map
                    (\bool ->
                        if bool then
                            Just keyName

                        else
                            Nothing
                    )
    in
    Json.Decode.map4
        (\metaKey ctrlKey shiftKey key ->
            [ metaKey, ctrlKey, shiftKey, Just key ]
                |> List.filterMap identity
                |> String.join "-"
                |> msg
        )
        (Json.Decode.field "metaKey" <| decodeMaybeKey "Meta")
        (Json.Decode.field "ctrlKey" <| decodeMaybeKey "Ctrl")
        (Json.Decode.field "shiftKey" <| decodeMaybeKey "Shift")
        (Json.Decode.field "key" Json.Decode.string)


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
