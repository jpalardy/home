module Completion exposing (commonPrefix, cycle, init)

import List.Extra


init : List String -> String -> List String
init words text =
    let
        matches =
            case List.filter (String.startsWith text) words of
                [] ->
                    List.filter (String.contains text) words

                prefixMatches ->
                    prefixMatches

        newPrefix =
            commonPrefix matches |> Maybe.withDefault text
    in
    matches
        |> List.filter ((/=) newPrefix)
        |> (\matchesWithoutPrefix -> matchesWithoutPrefix ++ [ newPrefix ])


cycle : List a -> List a
cycle words =
    case words of
        [] ->
            []

        first :: rest ->
            rest ++ [ first ]


commonPrefix : List String -> Maybe String
commonPrefix words =
    case words of
        [] ->
            Nothing

        first :: rest ->
            case List.foldl commonPrefix2 first rest of
                "" ->
                    Nothing

                prefix ->
                    Just prefix



-------------------------------------------------


commonPrefix2 : String -> String -> String
commonPrefix2 str1 str2 =
    let
        len =
            List.map2 Tuple.pair (String.toList str1) (String.toList str2)
                |> List.Extra.takeWhile (\( c1, c2 ) -> c1 == c2)
                |> List.length
    in
    String.left len str1
