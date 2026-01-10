module Site exposing (Site, fromJson, fromList, hardcoded, match)

import Dict exposing (Dict)
import Json.Decode
import Url


type alias Site =
    { alias : String
    , visit : String
    , search : String
    }


match : Dict String Site -> String -> Maybe String
match sites text =
    let
        encode words =
            words
                |> String.join " "
                |> Url.percentEncode

        encoderFor url =
            if String.contains "?" url then
                encode >> String.replace "%20" "+"

            else
                encode
    in
    case String.words text of
        [] ->
            Nothing

        [ alias ] ->
            sites |> Dict.get alias |> Maybe.map .visit

        alias :: rest ->
            sites
                |> Dict.get alias
                |> Maybe.map (\site -> site.search |> String.replace "%s" (encoderFor site.search rest))



{-------------------------------------------------}


hardcoded : Dict String Site
hardcoded =
    fromList
        [ { alias = "g"
          , visit = "https://www.google.com/"
          , search = "https://www.google.com/search?q=%s"
          }
        , { alias = "?"
          , search = "sites.json"
          , visit = "sites.json"
          }
        ]


fromList : List Site -> Dict String Site
fromList sites =
    sites
        |> List.map (\site -> ( site.alias, site ))
        |> Dict.fromList


fromJson : Json.Decode.Decoder (List Site)
fromJson =
    let
        siteDecoder =
            Json.Decode.map3 Site
                (Json.Decode.field "alias" Json.Decode.string)
                (Json.Decode.field "visit" Json.Decode.string)
                (Json.Decode.field "search" Json.Decode.string)
    in
    Json.Decode.list siteDecoder
