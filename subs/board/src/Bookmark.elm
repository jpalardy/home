module Bookmark exposing (Bookmark, blank, decoder, encoder)

import Json.Decode
import Json.Encode


type alias Bookmark =
    { content : String
    , color : String
    }


defaultColor : String
defaultColor =
    "#777777"


blank : Bookmark
blank =
    Bookmark "" defaultColor


encoder : Bookmark -> Json.Encode.Value
encoder bookmark =
    Json.Encode.object
        [ ( "content", Json.Encode.string bookmark.content )
        , ( "color", Json.Encode.string bookmark.color )
        ]


decoder : Json.Decode.Decoder Bookmark
decoder =
    Json.Decode.map2
        (\content maybeColor ->
            Bookmark content (Maybe.withDefault defaultColor maybeColor)
        )
        (Json.Decode.field "content" Json.Decode.string)
        (Json.Decode.maybe (Json.Decode.field "color" Json.Decode.string))
