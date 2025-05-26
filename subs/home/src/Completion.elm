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

        append item list =
            list ++ [ item ]

        startsWith item =
            List.Extra.isPrefixOf [ item ]
    in
    matches
        |> when (List.Extra.notMember newPrefix) (append newPrefix)
        |> when (startsWith text) cycle


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


when : (a -> Bool) -> (a -> a) -> a -> a
when condition transform value =
    if condition value then
        transform value

    else
        value
