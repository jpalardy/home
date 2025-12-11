module Main exposing (main)

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
import Parser exposing (..)
import Set exposing (Set)
import Task
import Url
import Url.Builder
import Url.Parser
import Url.Parser.Query



-------------------------------------------------


type Msg
    = Noop
    | UpdateQuery String
    | UpdateState Complete.State
    | Search String
    | GotCards (Result Http.Error (List Card))
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url.Url
    | KeyDown String


type alias Model =
    { query : String
    , completeState : Complete.State
    , cards : List Card
    , searchResults : List SearchResult
    , sortedKeywords : List String
    , url : Url.Url
    , key : Nav.Key
    , err : Maybe Http.Error
    }


type alias SearchResult =
    { query : String
    , cards : List Card
    , count : Int
    }


type alias Card =
    { kanji : String
    , keywords : List String
    , searchKeywords : Set String
    }



-------------------------------------------------


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
      , searchResults = []
      , sortedKeywords = []
      , url = url
      , key = key
      , err = Nothing
      }
    , getCards
    )



-------------------------------------------------


generateSuggestions : List String -> Int -> String -> Complete.State
generateSuggestions sortedKeywords count query =
    case String.trim query of
        "" ->
            Complete.closed

        trimmedQuery ->
            sortedKeywords
                |> List.filter (String.startsWith trimmedQuery)
                |> List.take count
                |> Complete.new


getCards : Cmd Msg
getCards =
    let
        cardsDecoder : Json.Decode.Decoder (List Card)
        cardsDecoder =
            Json.Decode.keyValuePairs (Json.Decode.list Json.Decode.string)
                |> Json.Decode.map
                    (List.map
                        (\( kanji, keywords ) ->
                            { kanji = kanji
                            , keywords = keywords
                            , searchKeywords = Set.fromList (kanji :: keywords)
                            }
                        )
                    )
    in
    Http.get { url = "cards.min.json", expect = Http.expectJson GotCards cardsDecoder }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Events.onKeyUp (Json.Decode.map KeyDown (Json.Decode.field "key" Json.Decode.string))



-------------------------------------------------


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        focusQueryCmd =
            Task.attempt (\_ -> Noop) (Dom.focus "query")
    in
    case msg of
        Noop ->
            ( model, Cmd.none )

        UpdateQuery query ->
            ( { model
                | query = query
                , completeState = generateSuggestions model.sortedKeywords 10 query
              }
            , Cmd.none
            )

        UpdateState completeState ->
            ( { model | completeState = completeState }, Cmd.none )

        Search query ->
            let
                searchResult =
                    search model.cards query

                searchResults =
                    case searchResult.count of
                        0 ->
                            model.searchResults

                        _ ->
                            searchResult :: model.searchResults
            in
            ( { model
                | searchResults = searchResults
                , query = ""
                , completeState = Complete.closed
              }
            , Nav.replaceUrl model.key <| Url.Builder.relative [] [ Url.Builder.string "q" query ]
            )

        GotCards (Ok cards) ->
            { model
                | cards = cards
                , sortedKeywords =
                    List.map .searchKeywords cards
                        |> List.foldl Set.union Set.empty
                        |> Set.toList
            }
                |> update (Search model.query)

        GotCards (Err err) ->
            ( { model | err = Just err }, Cmd.none )

        UrlRequested urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | url = url }, Cmd.none )

        KeyDown "/" ->
            ( model, focusQueryCmd )

        KeyDown "?" ->
            ( model, focusQueryCmd )

        KeyDown "Escape" ->
            { model | searchResults = [] }
                |> update (Search "")
                |> Tuple.mapSecond (\cmd -> Cmd.batch [ cmd, focusQueryCmd ])

        KeyDown _ ->
            ( model, Cmd.none )


search : List Card -> String -> SearchResult
search cards query =
    let
        trimmedQuery =
            String.trim query

        matchingCards =
            cards |> List.filter (.searchKeywords >> Set.member trimmedQuery)
    in
    { query = String.trim query
    , cards = matchingCards
    , count = List.length matchingCards
    }



-------------------------------------------------


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
        case String.trim model.query of
            "" ->
                "Crabi lookup"

            trimmedQuery ->
                "Crabi: " ++ trimmedQuery
    , body =
        [ div
            [ style "width" "1210px"
            , style "margin" "0 auto"
            ]
            (case model.err of
                Nothing ->
                    renderSearchForm model.query model.completeState
                        :: List.map renderResult model.searchResults

                Just err ->
                    [ renderError err ]
            )
        ]
    }


renderResult : SearchResult -> Html Msg
renderResult searchResult =
    div []
        [ div
            [ style "margin" "20px 0 5px 0"
            , style "font-size" "larger"
            ]
            [ span [ style "font-weight" "bold" ]
                [ text searchResult.query ]
            , text ": "
            , span
                [ style "color" "#777"
                ]
                [ text <| pluralize searchResult.count "no cards" "card" "cards"
                ]
            ]
        , div
            [ style "margin" "0"
            , style "display" "flex"
            , style "flex-wrap" "wrap"
            , style "gap" "5px"
            ]
            (List.map renderCard searchResult.cards)
        ]


renderError : Http.Error -> Html msg
renderError httpErr =
    let
        message =
            case httpErr of
                Http.BadUrl msg ->
                    msg

                Http.Timeout ->
                    "HTTP timeout"

                Http.NetworkError ->
                    "Network error"

                Http.BadStatus code ->
                    "HTTP Status " ++ String.fromInt code

                Http.BadBody body ->
                    "Error: " ++ body
    in
    div
        [ style "width" "fit-content"
        , style "border" "3px solid red"
        , style "border-radius" "5px"
        , style "font-family" "sans-serif"
        , style "padding" "30px 20px"
        , style "background" "pink"
        , style "margin" "20px auto"
        ]
        [ text message ]


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
    div
        [ style "width" "230px"
        , style "height" "142px"
        , style "border" "2px solid darkblue"
        , style "border-radius" "5px"
        , style "background" "#d2e8ff"
        , style "display" "grid"
        , style "grid-template-columns" "96px 1fr"
        ]
        [ div
            [ style "margin" "0 auto"
            , style "font-family" "\"ヒラギノ角ゴ Pro W3\", \"Hiragino Kaku Gothic Pro\", Osaka, \"メイリオ\", Meiryo, \"ＭＳ Ｐゴシック\", \"MS PGothic\", sans-serif"
            , style "font-size" "4rem"
            , style "display" "flex"
            , style "align-items" "center"
            ]
            [ text card.kanji ]
        , div
            [ style "display" "flex"
            , style "align-items" "center"
            ]
            [ ul
                [ style "list-style-type" "none"
                , style "text-align" "right"
                , style "font-size" "large"
                , style "color" "#777"
                , style "padding" "0"
                , style "margin" "0 15px 0 auto"
                ]
                (card.keywords |> List.map (\kw -> li [] [ text kw ]))
            ]
        ]



-------------------------------------------------


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = UrlRequested
        }
