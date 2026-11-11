module MainTest exposing (suite)

import Expect
import Main
import Set
import Test exposing (..)


suite : Test
suite =
    let
        cardTreeTrunk =
            { kanji = "幹"
            , keywords = [ "kan", "miki", "tree trunk" ]
            , searchKeywords = Set.fromList [ "kan", "miki", "tree", "tree trunk", "trunk", "幹" ]
            , similar = False
            }

        cardTree =
            { kanji = "木"
            , keywords = [ "moku", "tree" ]
            , searchKeywords = Set.fromList [ "moku", "tree", "木" ]
            , similar = False
            }

        cards =
            [ cardTree, cardTreeTrunk ]

        expectResult query list =
            Main.search cards query
                |> .cards
                |> Expect.equal list
    in
    describe "Main"
        [ describe "search"
            [ test "finds one based on keywords" <|
                \_ ->
                    expectResult "trunk" [ cardTreeTrunk ]
            , test "finds many based on keywords" <|
                \_ ->
                    expectResult "tree" [ cardTree, cardTreeTrunk ]
            , test "disregards whitespace in query" <|
                \_ ->
                    expectResult "    tree   " [ cardTree, cardTreeTrunk ]
            , test "finds many based on split query" <|
                \_ ->
                    expectResult "moku,kan" [ cardTree, cardTreeTrunk ]
            , test "finds many based on split query with whitespace" <|
                \_ ->
                    expectResult "   moku,kan   " [ cardTree, cardTreeTrunk ]
            , test "makes results unique" <|
                \_ ->
                    expectResult "tree,tree,tree" [ cardTree, cardTreeTrunk ]
            , test "doesn't match empty queries" <|
                \_ ->
                    expectResult "" []
            ]
        , describe "parseQuery"
            [ test "accepts one-word queries" <|
                \_ ->
                    Main.parseQuery "peach" |> Expect.equal [ "peach" ]
            , test "accepts one-word queries (with spaces)" <|
                \_ ->
                    Main.parseQuery "    peach    " |> Expect.equal [ "peach" ]
            , test "accepts multi-words queries" <|
                \_ ->
                    Main.parseQuery "    peach    tree    " |> Expect.equal [ "peach tree" ]
            , test "accepts multi-part queries" <|
                \_ ->
                    Main.parseQuery "    peach  ,  tree    " |> Expect.equal [ "peach", "tree" ]
            , test "accepts complicated queries" <|
                \_ ->
                    Main.parseQuery "  the ,   tall  peach  ,  tree    " |> Expect.equal [ "the", "tall peach", "tree" ]
            , test "accepts empty" <|
                \_ ->
                    Main.parseQuery "" |> Expect.equal []
            , test "accepts blank" <|
                \_ ->
                    Main.parseQuery "     " |> Expect.equal []
            , test "accepts multi-blank queries" <|
                \_ ->
                    Main.parseQuery "     " |> Expect.equal []
            , test "accepts multi-part blank queries" <|
                \_ ->
                    Main.parseQuery "  ,   ,   " |> Expect.equal []
            ]
        ]
