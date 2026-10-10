module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events as Events
import Browser.Navigation as Nav
import Complete
import Html exposing (Html)
import Html.Attributes as HA
import Html.Events as HE
import Http
import Json.Decode
import Regex
import Set exposing (Set)
import Task
import Url
import Url.Builder
import Url.Parser
import Url.Parser.Query



-------------------------------------------------


type Target
    = Query String
    | State Complete.State


type Msg
    = Noop
    | Update Target
    | Search String
    | DeleteResult Int
    | GotCards (Result Http.Error (List Card))
    | UrlRequested Browser.UrlRequest
    | UrlChanged Url.Url
    | KeyDown String


type RemoteData err a
    = Loading
    | Failure err
    | Success a


type alias Deck =
    { cards : List Card
    , keywords : List String
    }


type alias Model =
    { query : String
    , completeState : Complete.State
    , searchResults : List SearchResult
    , deck : RemoteData Http.Error Deck
    , url : Url.Url
    , key : Nav.Key
    }


type alias SearchResult =
    { query : String
    , cards : List Card
    , count : Int
    }


type alias Card =
    { no : Int
    , keyword : String
    , kanji : String
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
      , deck = Loading
      , searchResults = []
      , url = url
      , key = key
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
            let
                nonalpha =
                    Regex.fromString "[^a-z']" |> Maybe.withDefault Regex.never

                tokenize text =
                    text
                        |> String.toLower
                        |> Regex.replace nonalpha (always " ")
                        |> String.words
            in
            Json.Decode.keyValuePairs Json.Decode.string
                |> Json.Decode.map
                    (List.indexedMap
                        (\i ( kanji, keyword ) ->
                            { no = i + 1
                            , keyword = keyword
                            , kanji = kanji
                            , searchKeywords = Set.fromList ([ String.toLower keyword, String.fromInt (i + 1), kanji ] ++ tokenize keyword)
                            }
                        )
                    )
    in
    Http.get { url = "heisig.min.json", expect = Http.expectJson GotCards cardsDecoder }


subscriptions : Model -> Sub Msg
subscriptions _ =
    Events.onKeyDown (Json.Decode.map KeyDown (Json.Decode.field "key" Json.Decode.string))



-------------------------------------------------


successOrEmpty : RemoteData err Deck -> Deck
successOrEmpty rmtDeck =
    case rmtDeck of
        Success deck ->
            deck

        Loading ->
            Deck [] []

        Failure _ ->
            Deck [] []


withSearchResults : List SearchResult -> Model -> ( Model, Cmd Msg )
withSearchResults searchResults model =
    let
        query =
            searchResults
                |> List.head
                |> Maybe.map .query
                |> Maybe.withDefault ""
    in
    ( { model | searchResults = searchResults }
    , Nav.replaceUrl model.key <| Url.Builder.relative [] [ Url.Builder.string "q" query ]
    )


updateSearch : String -> Model -> ( Model, Cmd Msg )
updateSearch query model =
    let
        searchResult =
            search (model.deck |> successOrEmpty |> .cards) query
    in
    case ( searchResult.count, query == "" ) of
        ( 0, False ) ->
            ( model, Cmd.none )

        ( 0, True ) ->
            { model | query = "", completeState = Complete.closed }
                |> withSearchResults model.searchResults

        _ ->
            { model | query = "", completeState = Complete.closed }
                |> withSearchResults (searchResult :: model.searchResults)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        focusQueryCmd =
            Task.attempt (\_ -> Noop) (Dom.focus "query")
    in
    case msg of
        Noop ->
            ( model, Cmd.none )

        Update (Query query) ->
            let
                completeState =
                    generateSuggestions (model.deck |> successOrEmpty |> .keywords) 10 query
            in
            ( { model | query = query, completeState = completeState }, Cmd.none )

        Update (State completeState) ->
            ( { model | completeState = completeState }, Cmd.none )

        Search query ->
            updateSearch query model

        DeleteResult i ->
            let
                newSearchResults =
                    model.searchResults
                        |> List.indexedMap Tuple.pair
                        |> List.filter (Tuple.first >> (/=) i)
                        |> List.map Tuple.second
            in
            model |> withSearchResults newSearchResults

        GotCards (Ok cards) ->
            let
                keywords =
                    cards
                        |> List.map .searchKeywords
                        |> List.foldl Set.union Set.empty
                        |> Set.toList
            in
            { model | deck = Success (Deck cards keywords) }
                |> updateSearch model.query

        GotCards (Err err) ->
            ( { model | deck = Failure err }, Cmd.none )

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

        -- first ESC: close completion (implicit in Complete widget)
        -- second ESC: clear query
        -- third ESC: clear results
        KeyDown "Escape" ->
            (if model.query == "" then
                model |> withSearchResults []

             else
                model |> updateSearch ""
            )
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
                "Heisig lookup"

            trimmedQuery ->
                "Heisig: " ++ trimmedQuery
    , body =
        [ Html.div [ HA.class "max-w-6xl mx-auto mt-6 px-4" ]
            (case ( model.deck, model.searchResults ) of
                ( Loading, _ ) ->
                    [ renderSearchForm model.query Complete.closed
                    , Html.img [ HA.class "mt-5", HA.src "images/loader.gif" ] []
                    ]

                ( Success _, [] ) ->
                    [ renderSearchForm model.query model.completeState, renderPrompt ]

                ( Success _, _ ) ->
                    renderSearchForm model.query model.completeState
                        :: List.indexedMap renderResult model.searchResults

                ( Failure err, _ ) ->
                    [ renderError err ]
            )
        ]
    }


renderResult : Int -> SearchResult -> Html Msg
renderResult i searchResult =
    Html.div []
        [ Html.div
            [ HA.class "text-lg mt-5 mb-1 group" ]
            [ Html.span [ HA.class "font-bold" ] [ Html.text searchResult.query ]
            , Html.text ": "
            , Html.span [ HA.class "text-gray-500" ] [ Html.text <| pluralize searchResult.count "no cards" "card" "cards" ]
            , Html.button
                [ HA.class "px-2 text-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                , HE.onClick <| DeleteResult i
                ]
                [ Html.text "❌" ]
            ]
        , Html.div [ HA.class "flex flex-wrap gap-1" ]
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
    Html.div
        [ HA.class "mx-auto my-3 border-3 border-red-500 rounded-md bg-red-200 w-fit p-6" ]
        [ Html.text message ]


renderSearchForm : String -> Complete.State -> Html Msg
renderSearchForm query completeState =
    Html.form [ HA.class "max-w-[700px]", HE.onSubmit <| Search query ]
        [ Complete.render
            [ HA.id "query"
            , HA.autofocus True
            , HA.spellcheck False
            , HA.class "w-full p-1 px-3 border rounded rounded-full"
            , HA.placeholder "search"
            ]
            completeState
            query
            { updateQuery = Query >> Update
            , updateState = State >> Update
            , acceptQuery = Search
            }
        ]


renderCard : Card -> Html Msg
renderCard card =
    Html.div
        [ HA.class "w-[220px] h-[136px] border-2 rounded-md border-gray-300 bg-yellow-50 grid grid-cols-2 relative" ]
        [ Html.div [ HA.class "absolute p-2 font-mono text-xs text-gray-400" ]
            [ Html.text <| String.fromInt card.no ]
        , Html.div [ HA.class "mx-auto text-6xl flex items-center font-japanese text-gray-600" ]
            [ Html.text card.kanji ]
        , Html.div [ HA.class "flex items-center m-auto text-gray-600 text-center px-3" ]
            [ Html.text card.keyword ]
        ]


renderPrompt : Html Msg
renderPrompt =
    Html.div
        [ HA.class "mr-auto mt-10 size-fit" ]
        [ Html.img [ HA.src "images/prompt.jpg" ] [] ]



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
