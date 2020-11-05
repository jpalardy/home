module Starific exposing (any)


type alias Matcher =
    String -> Bool


any : List String -> List String -> Bool
any keywords =
    let
        ( positives, negatives ) =
            keywords2matchers keywords
    in
    \tokens -> matchAny positives tokens && not (matchAny negatives tokens)


matchAny : List Matcher -> List String -> Basics.Bool
matchAny matchers tokens =
    List.any (\token -> List.any (\matcher -> matcher token) matchers) tokens


keywords2matchers : List String -> ( List Matcher, List Matcher )
keywords2matchers keywords =
    keywords
        |> splitKeywords
        |> Tuple.mapBoth (List.map matcherFor) (List.map matcherFor)


splitKeywords : List String -> ( List String, List String )
splitKeywords keywords =
    keywords
        |> List.partition (String.startsWith "-" >> not)
        |> Tuple.mapSecond (List.map (String.dropLeft 1))


matcherFor : String -> Matcher
matcherFor keyword =
    let
        bareKeyword =
            String.replace "*" "" keyword

        starLeft =
            String.startsWith "*" keyword

        starRight =
            String.endsWith "*" keyword
    in
    case ( starLeft, starRight ) of
        ( False, False ) ->
            (==) bareKeyword

        ( False, True ) ->
            String.startsWith bareKeyword

        ( True, False ) ->
            String.endsWith bareKeyword

        ( True, True ) ->
            String.contains bareKeyword
