module Drag exposing (onDrop, onEnd, onOver, onStart)

import Html
import Html.Events as HE
import Json.Decode


onStart : a -> Html.Attribute a
onStart msg =
    HE.on "dragstart" <|
        Json.Decode.succeed msg


onEnd : a -> Html.Attribute a
onEnd msg =
    HE.on "dragend" <|
        Json.Decode.succeed msg


onOver : a -> Html.Attribute a
onOver msg =
    HE.preventDefaultOn "dragover" <|
        Json.Decode.succeed ( msg, True )


onDrop : a -> Html.Attribute a
onDrop msg =
    HE.preventDefaultOn "drop" <|
        Json.Decode.succeed ( msg, True )
