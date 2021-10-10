module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events as Events
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode exposing (Decoder, keyValuePairs, string)
import List.Extra
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


type Msg
    = Noop
    | UpdateQuery String
    | Search String
    | GotKanjis (Result Http.Error (List ( String, String )))
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | KeyPress String


type alias Model =
    { query : String
    , queryChanged : Bool
    , cards : List Card
    , searchResults : SearchResults
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
      , queryChanged = False
      , cards = []
      , searchResults = search [] query
      , url = url
      , key = key
      , err = Nothing
      }
    , getKanjis
    )



{--
-------------------------------------------------
--}


getKanjis : Cmd Msg
getKanjis =
    Http.get
        { url = "heisig.min.json"
        , expect = Http.expectJson GotKanjis kanjiDecoder
        }


kanjiDecoder : Decoder (List ( String, String ))
kanjiDecoder =
    keyValuePairs string


subscriptions : Model -> Sub Msg
subscriptions _ =
    Events.onKeyPress (Json.Decode.map KeyPress (Json.Decode.field "key" string))



{--
-------------------------------------------------
--}


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        UpdateQuery query ->
            ( { model | query = query, queryChanged = True }, Cmd.none )

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
                , queryChanged = False
              }
            , Nav.replaceUrl model.key <| Url.Builder.absolute [] urlQuery
            )

        GotKanjis (Ok kanjis) ->
            let
                cards =
                    List.indexedMap list2Cards kanjis
            in
            ( { model | cards = cards, searchResults = search cards model.query }, Cmd.none )

        GotKanjis (Err err) ->
            ( { model | err = Just err }, Cmd.none )

        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | url = url }, Cmd.none )

        KeyPress "/" ->
            ( model, Task.attempt (\_ -> Noop) (Dom.focus "query") )

        KeyPress _ ->
            ( model, Cmd.none )


list2Cards : Int -> ( String, String ) -> Card
list2Cards i ( kanji, keyword ) =
    let
        no =
            i + 1

        funnyChars =
            Regex.fromString "[^a-z' ]" |> Maybe.withDefault Regex.never

        tokens =
            keyword
                |> String.toLower
                |> String.replace "-" " "
                |> Regex.replace funnyChars (\_ -> "")
                |> String.words
                |> List.append [ String.fromInt no, kanji ]
                |> Set.fromList
    in
    Card no keyword kanji tokens


search : List Card -> String -> SearchResults
search cards query =
    let
        limit =
            120

        trimmedQuery =
            String.trim query

        matchingCards =
            cards
                |> filterWithQuery trimmedQuery

        count =
            List.length matchingCards
    in
    { query = trimmedQuery
    , cards = List.take limit matchingCards
    , count = count
    , truncated = count > limit
    }



{--
-------------------------------------------------
--}


view : Model -> Browser.Document Msg
view model =
    let
        words =
            String.words model.query

        -- no last word: empty or ends with space
        splitIndex =
            if String.trim model.query == "" || String.endsWith " " model.query then
                List.length words

            else
                List.length words - 1

        ( firstWords, lastWord ) =
            List.Extra.splitAt splitIndex words |> Tuple.mapBoth (String.join " ") List.head

        suggestions =
            case ( model.queryChanged, lastWord ) of
                ( True, Just word ) ->
                    List.concatMap (.tokens >> Set.toList) model.cards
                        |> List.filter (String.startsWith word)
                        |> Set.fromList
                        |> Set.toList
                        |> List.sort
                        |> List.take 10
                        |> List.map (\suggestion -> firstWords ++ " " ++ suggestion)

                _ ->
                    []
    in
    { title =
        if model.searchResults.query == "" then
            "Heisig lookup"

        else
            "Heisig: " ++ model.searchResults.query
    , body =
        [ div []
            [ renderSearchForm model.query suggestions
            , span [ class "muted" ] [ text <| pluralize model.searchResults.count "no kanjis" "kanji" "kanjis" ]
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


filterWithQuery : String -> List Card -> List Card
filterWithQuery query cards =
    let
        tokens =
            query |> String.words |> Set.fromList
    in
    if query == "" then
        cards

    else
        cards |> List.filter (\card -> Set.intersect tokens card.tokens |> (not << Set.isEmpty))


pluralize : Int -> String -> String -> String -> String
pluralize count zeroCase oneCase manyCase =
    case count of
        0 ->
            zeroCase

        1 ->
            [ "1", oneCase ] |> String.join " "

        _ ->
            [ String.fromInt count, manyCase ] |> String.join " "


renderSearchForm : String -> List String -> Html Msg
renderSearchForm query suggestions =
    Html.form [ onSubmit <| Search query ]
        [ div [ class "awesomplete" ]
            [ input
                [ value query
                , onInput UpdateQuery
                , stopPropagationOn "keypress" (Json.Decode.succeed ( Noop, True ))
                , autofocus True
                , attribute "autocapitalize" "off"
                , attribute "autocorrect" "off"
                ]
                []
            , ul []
                (List.map
                    (\suggestion ->
                        li [ onClick <| Search suggestion ] [ text suggestion ]
                    )
                    suggestions
                )
            ]
        ]


renderCard : Card -> Html Msg
renderCard card =
    div [ class "card" ]
        [ span [ class "no" ] [ text (String.fromInt card.no) ]
        , span [ class "keyword" ] [ text card.keyword ]
        , span [ class "kanji" ] [ text card.kanji ]
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
