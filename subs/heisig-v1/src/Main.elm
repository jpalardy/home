module Main exposing (main)

import Browser
import Browser.Dom as Dom
import Browser.Events as Events
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (attribute, autofocus, class, classList, id, name, value)
import Html.Events exposing (onInput, onSubmit, stopPropagationOn)
import Http
import Json.Decode exposing (Decoder, keyValuePairs, string)
import Regex
import Starific
import Task
import Url
import Url.Parser
import Url.Parser.Query


type Msg
    = Noop
    | Change String
    | GotKanjis (Result Http.Error (List ( String, String )))
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | KeyPress String


type alias Model =
    { query : String
    , cards : List Card
    , url : Url.Url
    , key : Nav.Key
    , err : Maybe Http.Error
    , sansSerif : Bool
    }


type alias Card =
    { no : Int
    , keyword : String
    , kanji : String
    , tokens : List String
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        unescapeSpace =
            Maybe.map (String.replace "+" "%20")

        query =
            { url | path = "", query = unescapeSpace url.query }
                |> Url.Parser.parse (Url.Parser.query <| Url.Parser.Query.string "q")
                |> Maybe.withDefault Nothing
                |> Maybe.withDefault ""
    in
    ( { query = query, cards = [], url = url, key = key, err = Nothing, sansSerif = False }, getKanjis )


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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        Change query ->
            let
                url =
                    model.url

                urlQuery =
                    if String.trim query == "" then
                        Nothing

                    else
                        Just ("q=" ++ query)

                escapeSpace =
                    Maybe.map (String.replace " " "+")
            in
            ( { model | query = query }
            , Nav.replaceUrl model.key ({ url | query = escapeSpace urlQuery } |> Url.toString)
            )

        GotKanjis (Ok kanjis) ->
            let
                cards =
                    List.indexedMap list2Cards kanjis
            in
            ( { model | cards = cards }, Cmd.none )

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

        KeyPress "f" ->
            ( { model | sansSerif = not model.sansSerif }, Cmd.none )

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
    in
    Card no keyword kanji tokens


view : Model -> Browser.Document Msg
view model =
    let
        trimmedQuery =
            String.trim model.query

        suffixedQuery =
            if
                trimmedQuery
                    == ""
                    || String.endsWith " " model.query
                    || String.endsWith "*" model.query
            then
                trimmedQuery

            else
                trimmedQuery ++ "*"

        filteredCards =
            model.cards
                |> filterWithQuery suffixedQuery

        visibleCards =
            filteredCards
                |> List.take 120

        truncated =
            List.length filteredCards > List.length visibleCards
    in
    { title =
        if trimmedQuery == "" then
            "Heisig lookup"

        else
            "Heisig: " ++ trimmedQuery
    , body =
        [ div []
            [ renderSearchForm model.query
            , span [ class "muted" ] [ text (countKanjis filteredCards) ]
            , div
                [ classList
                    [ ( "cards", True )
                    , ( "sans-serif", model.sansSerif )
                    ]
                ]
                (List.map renderCard visibleCards)
            ]
        , renderTruncatedNotice truncated
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
        keywords =
            query |> String.words

        matcher =
            Starific.any keywords
    in
    if query == "" then
        cards

    else
        cards |> List.filter (\card -> matcher card.tokens)


countKanjis : List Card -> String
countKanjis cards =
    let
        numOfCards =
            List.length cards
    in
    case numOfCards of
        0 ->
            "no kanjis"

        1 ->
            "1 kanji"

        _ ->
            String.fromInt numOfCards ++ " kanjis"


renderSearchForm : String -> Html Msg
renderSearchForm query =
    form [ onSubmit Noop ]
        [ div [ id "glass" ]
            [ input
                [ id "query"
                , name "query"
                , value query
                , onInput Change
                , stopPropagationOn "keypress" (Json.Decode.succeed ( Noop, True ))
                , autofocus True
                , attribute "autocapitalize" "off"
                , attribute "autocorrect" "off"
                ]
                []
            ]
        ]


renderCard : Card -> Html Msg
renderCard card =
    div [ class "card" ]
        [ span [ class "no" ] [ text (String.fromInt card.no) ]
        , span [ class "keyword" ] [ text card.keyword ]
        , span [ class "kanji" ] [ text card.kanji ]
        ]


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
