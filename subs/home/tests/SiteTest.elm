module SiteTest exposing (..)

import Expect
import List.Extra
import Site
import Sites
import Test exposing (..)
import Url


allMatch : String -> Maybe String
allMatch =
    let
        sites =
            Site.fromList
                [ { alias = "g"
                  , visit = "https://www.google.com/"
                  , search = "https://www.google.com/search?q=%s"
                  }
                , { alias = "gim"
                  , visit = "https://www.google.com/imghp?tbm=isch"
                  , search = "https://www.google.com/search?q=%s&tbm=isch"
                  }
                , { alias = "gmap"
                  , visit = "https://maps.google.com/"
                  , search = "https://maps.google.com/maps?oi=map&q=%s"
                  }
                , { alias = "color-hex"
                  , search = "https://www.color-hex.com/color/%s"
                  , visit = "https://www.color-hex.com"
                  }
                ]
    in
    Site.match sites


suite : Test
suite =
    describe "Site module"
        [ describe "match (happy)"
            [ test "finds site and uses visit URL" <|
                \_ -> Expect.equal (Just "https://www.google.com/imghp?tbm=isch") (allMatch "gim")
            , test "finds site and fills in a one-word query" <|
                \_ -> Expect.equal (Just "https://www.google.com/search?q=muffin&tbm=isch") (allMatch "gim muffin")
            , test "finds site and fills in a multi-word query" <|
                \_ -> Expect.equal (Just "https://www.google.com/search?q=delicious+blueberry+muffin&tbm=isch") (allMatch "gim delicious blueberry muffin")
            , test "finds site and fills in a multi-word query (not in URL query)" <|
                \_ -> Expect.equal (Just "https://www.color-hex.com/color/delicious%20blueberry%20muffin") (allMatch "color-hex delicious blueberry muffin")
            , test "handles worst-case spacing" <|
                \_ -> Expect.equal (Just "https://www.google.com/search?q=delicious+blueberry+muffin&tbm=isch") (allMatch "     gim       delicious      blueberry muffin     ")
            ]
        , describe "match (unhappy)"
            [ test "punts for unknown alias" <|
                \_ -> Expect.equal Nothing (allMatch "muffin")
            , test "punts for empty query" <|
                \_ -> Expect.equal Nothing (allMatch "")
            , test "punts for blank query" <|
                \_ -> Expect.equal Nothing (allMatch "   ")
            ]
        , describe "all"
            (let
                staticTests =
                    [ test "does not contain duplicates aliases" <|
                        \_ ->
                            Sites.all
                                |> List.map .alias
                                |> List.Extra.allDifferent
                                |> Expect.equal True
                    ]

                dynamicTests =
                    Sites.all
                        |> List.concatMap
                            (\site ->
                                [ test ("returns only valid visit URL for alias \"" ++ site.alias ++ "\"") <|
                                    \_ ->
                                        Expect.notEqual Nothing (Url.fromString site.visit)
                                , test ("returns only valid search URL for alias \"" ++ site.alias ++ "\"") <|
                                    \_ ->
                                        Expect.notEqual Nothing (Url.fromString site.search)
                                , test ("returns visit URL without %s for alias \"" ++ site.alias ++ "\"") <|
                                    \_ ->
                                        Expect.equal False (String.contains "%s" site.visit)
                                ]
                            )
             in
             staticTests ++ dynamicTests
            )
        ]
