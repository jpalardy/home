module CompletionTest exposing (..)

import Completion
import Expect
import Test exposing (..)


animals : List String
animals =
    [ "bear", "cat", "caterpillar", "chicken", "cow", "deer", "dog", "duck", "eagle", "elephant", "fox", "giraffe", "goldfish", "goose", "gorilla", "hamster", "horse", "lion", "monkey", "mouse", "owl", "pig", "rabbit", "rat", "sheep", "squirrel", "tiger", "turtle", "wolf", "zebra" ]


suite : Test
suite =
    describe "Completion module"
        [ describe "init"
            [ test "returns expected prefix matches (many)" <|
                \_ ->
                    Completion.init animals "d"
                        |> Expect.equal [ "deer", "dog", "duck", "d" ]
            , test "returns expected prefix matches (one)" <|
                \_ ->
                    Completion.init animals "du"
                        |> Expect.equal [ "duck" ]
            , test "returns expected prefix matches (adds common prefix)" <|
                \_ ->
                    Completion.init animals "m"
                        |> Expect.equal [ "monkey", "mouse", "mo" ]
            , test "returns expected prefix matches (skips itself)" <|
                \_ ->
                    Completion.init animals "cat"
                        |> Expect.equal [ "caterpillar", "cat" ]
            , test "returns expected prefix matches (doesn't skip common prefix)" <|
                \_ ->
                    Completion.init animals "ca"
                        |> Expect.equal [ "cat", "caterpillar" ]
            , test "returns itself (without prefix)" <|
                \_ ->
                    Completion.init animals "duck"
                        |> Expect.equal [ "duck" ]
            , test "returns expected substring matches on prefix miss" <|
                \_ ->
                    Completion.init animals "ee"
                        |> Expect.equal [ "deer", "sheep", "ee" ]
            , test "returns nothing, except prefix" <|
                \_ ->
                    Completion.init animals "xx"
                        |> Expect.equal [ "xx" ]
            , test "returns everything on blank" <|
                \_ ->
                    Completion.init animals ""
                        |> Expect.equal (animals ++ [ "" ])
            ]
        , describe "cycle"
            [ test "turns the list" <|
                \_ ->
                    Completion.cycle [ 1, 2, 3 ] |> Expect.equal [ 2, 3, 1 ]
            , test "chains" <|
                \_ ->
                    [ 1, 2, 3 ]
                        |> Completion.cycle
                        |> Completion.cycle
                        |> Completion.cycle
                        |> Completion.cycle
                        |> Completion.cycle
                        |> Expect.equal [ 3, 1, 2 ]
            , test "handles singleton" <|
                \_ ->
                    [ 2 ] |> Completion.cycle |> Expect.equal [ 2 ]
            , test "handles empty" <|
                \_ ->
                    Completion.cycle [] |> Expect.equal []
            ]
        , describe "commonPrefix"
            [ test "handles multiple values, short prefix" <|
                \_ ->
                    Completion.commonPrefix [ "bear", "beaver", "bison", "butterfly", "bullfrog" ] |> Expect.equal (Just "b")
            , test "handles multiple values, longer prefix" <|
                \_ ->
                    Completion.commonPrefix [ "cat", "caterpillar" ] |> Expect.equal (Just "cat")
            , test "handles multiple values, ruined by one value" <|
                \_ ->
                    Completion.commonPrefix [ "bear", "beaver", "bison", "mayfly", "butterfly", "bullfrog" ] |> Expect.equal Nothing
            , test "handles singleton" <|
                \_ ->
                    Completion.commonPrefix [ "cat" ] |> Expect.equal (Just "cat")
            , test "handles empty" <|
                \_ ->
                    Completion.commonPrefix [] |> Expect.equal Nothing
            ]
        ]
