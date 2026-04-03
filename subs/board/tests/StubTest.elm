module StubTest exposing (..)

import Expect
import Test exposing (..)

suite : Test
suite =
    describe "stub module"
        [ describe "some function"
            [ test "works" <|
                \_ -> Expect.equal 42 42
                ]]
