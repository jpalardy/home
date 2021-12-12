port module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events as Events
import Browser.Navigation as Nav
import Complete
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode
import List.Extra
import Parser exposing (..)
import Regex
import Set
import Task
import Url
import Url.Builder
import Url.Parser
import Url.Parser.Query



{--
-------------------------------------------------
--}


port copyText : String -> Cmd msg



{--
-------------------------------------------------
--}


type Msg
    = Noop
    | UpdateQuery String
    | UpdateState Complete.State
    | Search String
    | GotCards (Result Http.Error (List Card))
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | KeyDown String
    | CopyText String


type alias Model =
    { query : String
    , completeState : Complete.State
    , cards : List Card
    , searchResults : SearchResults
    , sortedTokens : List String
    , url : Url.Url
    , key : Nav.Key
    , err : Maybe Http.Error
    }


type alias SearchResults =
    { query : String
    , cards : List Card
    , count : Int
    , truncated : Bool
    }


type alias Card =
    { no : Int
    , keyword : String
    , kanji : String
    , tokens : Set.Set String
    }



{--
-------------------------------------------------
--}


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        query =
            { url
                | path = ""
                , query = Maybe.map (String.replace "+" "%20") url.query
            }
                |> Url.Parser.parse (Url.Parser.query <| Url.Parser.Query.string "q")
                |> Maybe.andThen identity
                |> Maybe.withDefault ""
    in
    ( { query = query
      , completeState = Complete.closed
      , cards = []
      , searchResults = search [] query
      , sortedTokens = []
      , url = url
      , key = key
      , err = Nothing
      }
    , getKanjis
    )



{--
-------------------------------------------------
--}


generateSuggestions : List String -> Int -> String -> Complete.State
generateSuggestions sortedTokens count query =
    let
        words =
            String.words query

        -- no last word: empty or ends with space
        splitIndex =
            if String.trim query == "" || String.endsWith " " query then
                List.length words

            else
                List.length words - 1

        ( firstWords, lastWord ) =
            List.Extra.splitAt splitIndex words |> Tuple.mapBoth (String.join " ") List.head
    in
    case lastWord of
        Just word ->
            Complete.new
                (sortedTokens
                    |> List.filter (String.startsWith word)
                    |> List.take count
                    |> List.map (\suggestion -> firstWords ++ " " ++ suggestion)
                )

        _ ->
            Complete.closed


getKanjis : Cmd Msg
getKanjis =
    Http.get
        { url = "heisig.min.json"
        , expect = Http.expectJson GotCards kanjiDecoder
        }


kanjiDecoder : Json.Decode.Decoder (List Card)
kanjiDecoder =
    let
        punctuations =
            Regex.fromString "([.()]|^-)" |> Maybe.withDefault Regex.never

        tokenize text =
            text
                |> String.toLower
                |> Regex.replace punctuations (always "")
                |> String.words
                |> Set.fromList
    in
    Json.Decode.keyValuePairs Json.Decode.string
        |> Json.Decode.andThen
            (Json.Decode.succeed
                << List.indexedMap
                    (\i ( kanji, keyword ) ->
                        { no = i + 1
                        , keyword = keyword
                        , kanji = kanji
                        , tokens = tokenize <| String.join " " [ keyword, String.fromInt (i + 1), kanji ]
                        }
                    )
            )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Events.onKeyUp (Json.Decode.map KeyDown (Json.Decode.field "key" Json.Decode.string))



{--
-------------------------------------------------
--}


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        UpdateQuery query ->
            ( { model
                | query = query
                , completeState = generateSuggestions model.sortedTokens 10 query
              }
            , Cmd.none
            )

        UpdateState completeState ->
            ( { model | completeState = completeState }, Cmd.none )

        Search query ->
            let
                searchResults =
                    search model.cards query

                urlQuery =
                    if searchResults.query == "" then
                        []

                    else
                        [ Url.Builder.string "q" query ]
            in
            ( { model
                | searchResults = searchResults
                , query = searchResults.query
                , completeState = Complete.closed
              }
            , Nav.replaceUrl model.key <| Url.Builder.relative [] urlQuery
            )

        GotCards (Ok cards) ->
            ( { model
                | cards = cards
                , searchResults = search cards model.query
                , sortedTokens =
                    List.map .tokens cards
                        |> List.foldl Set.union Set.empty
                        |> Set.toList
              }
            , Cmd.none
            )

        GotCards (Err err) ->
            ( { model | err = Just err }, Cmd.none )

        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | url = url }, Cmd.none )

        KeyDown "/" ->
            ( model, Task.attempt (\_ -> Noop) (Dom.focus "query") )

        KeyDown "?" ->
            ( model, Task.attempt (\_ -> Noop) (Dom.focus "query") )

        KeyDown _ ->
            ( model, Cmd.none )

        CopyText text ->
            ( model, copyText text )


search : List Card -> String -> SearchResults
search cards query =
    let
        limit =
            120

        -- there are 2200 kanji cards
        withinRange i =
            i >= 1 && i <= 2200

        parseRange =
            Parser.succeed Tuple.pair
                |= Parser.int
                |. Parser.symbol "-"
                |= Parser.int
                |. Parser.end
                |> Parser.andThen
                    (\( s, e ) ->
                        if withinRange s && withinRange e then
                            succeed <| (List.range s e |> List.map String.fromInt)

                        else
                            problem "out of range"
                    )

        expandRange text =
            run parseRange text |> Result.withDefault [ text ]

        tokens =
            query
                |> String.toLower
                |> String.words
                |> List.concatMap expandRange
                |> Set.fromList

        matchingCards =
            if String.trim query |> String.isEmpty then
                cards

            else
                cards |> List.filter (\card -> Set.intersect tokens card.tokens |> (not << Set.isEmpty))

        count =
            List.length matchingCards
    in
    { query = String.trim query
    , cards = List.take limit matchingCards
    , count = count
    , truncated = count > limit
    }



{--
-------------------------------------------------
--}


pluralize : Int -> String -> String -> String -> String
pluralize count zeroCase oneCase manyCase =
    case count of
        0 ->
            zeroCase

        1 ->
            [ "1", oneCase ] |> String.join " "

        _ ->
            [ String.fromInt count, manyCase ] |> String.join " "


view : Model -> Browser.Document Msg
view model =
    { title =
        if model.searchResults.query == "" then
            "Heisig lookup"

        else
            "Heisig: " ++ model.searchResults.query
    , body =
        [ div []
            [ renderSearchForm model.query model.completeState
            , div [ class "summary pale" ] [ text <| pluralize model.searchResults.count "no kanjis" "kanji" "kanjis" ]
            , div [ class "cards" ]
                (List.map renderCard model.searchResults.cards)
            ]
        , renderTruncatedNotice model.searchResults.truncated
        , renderError model.err
        ]
    }


renderError : Maybe Http.Error -> Html msg
renderError httpErr =
    case httpErr of
        Just err ->
            div
                [ class "muted" ]
                [ case err of
                    Http.BadUrl msg ->
                        text ("⚠️ " ++ msg)

                    Http.Timeout ->
                        text "⚠️ timeout"

                    Http.NetworkError ->
                        text "⚠️ network error"

                    Http.BadStatus code ->
                        text ("⚠️ status: " ++ String.fromInt code)

                    Http.BadBody body ->
                        text ("⚠️ error: " ++ body)
                ]

        Nothing ->
            text ""


renderTruncatedNotice : Bool -> Html msg
renderTruncatedNotice truncated =
    if truncated then
        div [ class "muted" ] [ text "⚠️ results truncated" ]

    else
        text ""


renderSearchForm : String -> Complete.State -> Html Msg
renderSearchForm query completeState =
    Html.form [ onSubmit <| Search query ]
        [ Complete.render
            [ id "query"
            , autofocus True
            , spellcheck False
            , style "width" "500px"
            , style "padding-left" "5px"
            ]
            completeState
            query
            { updateQuery = UpdateQuery
            , updateState = UpdateState
            , acceptQuery = Search
            }
        , button [ style "margin-left" "0.3rem" ] [ text "Search" ]
        ]


renderCard : Card -> Html Msg
renderCard card =
    div [ class "card" ]
        [ div [ class "header" ]
            [ span [ class "pale" ] [ text (String.fromInt card.no) ]
            , span [ class "right" ] [ text card.keyword ]
            ]
        , div [ class "content pointer", onClick <| CopyText card.kanji ]
            [ span [ class "kanji1" ] [ text card.kanji ]
            , span [ class "kanji2 pale" ] [ text card.kanji ]
            ]
        ]



{--
-------------------------------------------------
--}


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }
