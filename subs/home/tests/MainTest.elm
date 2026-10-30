module MainTest exposing (..)

import Expect
import Main exposing (..)
import Test exposing (..)


suite : Test
suite =
    describe "Main" <|
        let
            initModel str =
                { text = str
                , inputState = Unmodified
                , destination = Nothing
                , sites = Loading
                , completions = []
                }
        in
        [ describe "init"
            [ test "returns a sane model" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Main.init "apple"
                    in
                    model
                        |> Expect.equal (initModel "apple")
            , test "cleans up the text, stays Unmodified" <|
                \_ ->
                    let
                        ( model, _ ) =
                            Main.init "   apple   pie   "
                    in
                    model
                        |> Expect.equal (initModel "apple pie")
            ]
        ]
