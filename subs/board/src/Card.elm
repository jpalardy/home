module Card exposing (Card, blank, decoder, encoder)

import Json.Decode
import Json.Encode


type alias Card =
    { content : String
    , color : String
    }


defaultColor : String
defaultColor =
    "#777777"


blank : Card
blank =
    Card "" defaultColor


encoder : Card -> Json.Encode.Value
encoder card =
    Json.Encode.object
        [ ( "content", Json.Encode.string card.content )
        , ( "color", Json.Encode.string card.color )
        ]


decoder : Json.Decode.Decoder Card
decoder =
    Json.Decode.map2
        (\content maybeColor ->
            Card content (Maybe.withDefault defaultColor maybeColor)
        )
        (Json.Decode.field "content" Json.Decode.string)
        (Json.Decode.maybe (Json.Decode.field "color" Json.Decode.string))
