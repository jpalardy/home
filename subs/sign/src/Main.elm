module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Dict
import Dict.Extra
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode
import Regex
import Url
import Url.Parser
import Url.Parser.Query



{--
-------------------------------------------------
--}


type Msg
    = Noop
    | UpdateQuery String
    | GotPhrases (Result Http.Error (List Phrase))
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


type alias Model =
    { query : String
    , phrases : List Phrase
    , err : Maybe Http.Error
    , url : Url.Url
    , key : Nav.Key
    }


type alias Phrase =
    { phrase : String
    , id : Int
    , tokens : List String
    }



{--
-------------------------------------------------
--}


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
    ( { query = query
      , phrases = []
      , err = Nothing
      , url = url
      , key = key
      }
    , getPhrases
    )



{--
-------------------------------------------------
--}


getPhrases : Cmd Msg
getPhrases =
    Http.get
        { url = "phrases.json"
        , expect = Http.expectJson GotPhrases phrasesDecoder
        }


phrasesDecoder : Json.Decode.Decoder (List Phrase)
phrasesDecoder =
    let
        punctuations =
            Regex.fromString "[/()]" |> Maybe.withDefault Regex.never

        tokenize text =
            text
                |> String.toLower
                |> Regex.replace punctuations (always " ")
                |> String.words
    in
    Json.Decode.keyValuePairs Json.Decode.int
        |> Json.Decode.andThen
            (\phrases -> Json.Decode.succeed (List.map (\( phrase, id ) -> Phrase phrase id (tokenize phrase)) phrases |> List.sortBy (.phrase >> String.toLower)))


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



{--
-------------------------------------------------
--}


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        UpdateQuery query ->
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

        GotPhrases (Ok phrases) ->
            ( { model | phrases = phrases }, Cmd.none )

        GotPhrases (Err err) ->
            ( { model | err = Just err }, Cmd.none )

        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | url = url }, Cmd.none )



{--
-------------------------------------------------
--}


view : Model -> Browser.Document Msg
view model =
    let
        trimmedQuery =
            String.trim model.query

        matchingPhrases =
            if String.trim model.query == "" then
                model.phrases

            else
                List.filter (.tokens >> List.any (String.startsWith model.query)) model.phrases

        groupedPhrase =
            Dict.Extra.groupBy
                (\phrase ->
                    phrase.phrase
                        |> String.toLower
                        |> String.uncons
                        |> Maybe.withDefault ( '-', "" )
                        |> Tuple.first
                )
                matchingPhrases
    in
    { title =
        if trimmedQuery == "" then
            "ASL lookup"

        else
            trimmedQuery ++ " - ASL lookup"
    , body =
        [ div [ class "ma3" ]
            [ renderSearchForm model.query
            , div []
                (List.map
                    (\( letter, phrases ) ->
                        div []
                            [ h3 [ class "mb1" ] [ text <| String.fromChar letter ]
                            , div [ class "phrases flex flex-wrap", style "gap" "5px" ]
                                (List.map renderPhrase phrases)
                            ]
                    )
                    (Dict.toList groupedPhrase)
                )
            , renderError model.err
            ]
        ]
    }


renderSearchForm : String -> Html Msg
renderSearchForm query =
    Html.form [ onSubmit Noop, class "mb3" ]
        [ input
            [ size 40
            , value query
            , onInput UpdateQuery
            , autofocus True
            , attribute "autocapitalize" "off"
            , attribute "autocorrect" "off"
            ]
            []
        ]


renderPhrase : Phrase -> Html Msg
renderPhrase phrase =
    let
        handspeakURL id =
            "https://www.handspeak.com/word/search/index.php?id=" ++ String.fromInt id
    in
    a [ href <| handspeakURL phrase.id, class "link db pa2 br2 black-70 bg-black-10" ] [ text phrase.phrase ]


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
