module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Events exposing (onKeyUp)
import Browser.Navigation as Nav
import Dict
import Dict.Extra
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode
import Regex
import Task
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
    | KeyUp String


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


phrasesDecoder : Decode.Decoder (List Phrase)
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
    Decode.keyValuePairs Decode.int
        |> Decode.andThen
            (\phrases -> Decode.succeed (List.map (\( phrase, id ) -> Phrase phrase id (tokenize phrase)) phrases |> List.sortBy (.phrase >> String.toLower)))


focusOn : String -> Cmd Msg
focusOn id =
    Task.attempt (\_ -> Noop) (Browser.Dom.focus id)



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

        KeyUp "Tab" ->
            ( model, Cmd.none )

        KeyUp "Escape" ->
            ( { model | query = "" }, focusOn "input" )

        KeyUp key ->
            let
                ch =
                    if String.length key == 1 then
                        key

                    else
                        ""
            in
            ( { model | query = model.query ++ ch }, focusOn "input" )


subscriptions : Model -> Sub Msg
subscriptions _ =
    onKeyUp (Decode.map KeyUp (Decode.field "key" Decode.string))



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
            , div [ style "display" "grid", style "grid-template-columns" "2rem 1fr", style "row-gap" "0.5rem" ]
                (List.concatMap
                    (\( letter, phrases ) ->
                        [ h3 [ class "ma1" ] [ text <| String.fromChar letter ]
                        , div [ class "flex flex-wrap", style "gap" "0.25rem" ] (List.map renderPhrase phrases)
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
    let
        keyStopper =
            Decode.field "key" Decode.string
                |> Decode.andThen
                    (\key ->
                        case key of
                            "Escape" ->
                                Decode.fail "propagate to update's KeyUp"

                            _ ->
                                Decode.succeed { message = Noop, stopPropagation = True, preventDefault = True }
                    )
    in
    Html.form [ onSubmit Noop, class "mb3" ]
        [ input
            [ id "input"
            , size 40
            , value query
            , onInput UpdateQuery
            , custom "keyup" keyStopper
            , autofocus True
            , autocomplete False
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
    a [ href <| handspeakURL phrase.id, class "link pa2 br2 black-70 bg-black-10" ] [ text phrase.phrase ]


renderError : Maybe Http.Error -> Html msg
renderError httpErr =
    case httpErr of
        Just err ->
            div
                [ class "muted" ]
                [ text <|
                    "⚠️ "
                        ++ (case err of
                                Http.BadUrl msg ->
                                    msg

                                Http.Timeout ->
                                    "timeout"

                                Http.NetworkError ->
                                    "network error"

                                Http.BadStatus code ->
                                    "status: " ++ String.fromInt code

                                Http.BadBody body ->
                                    "error: " ++ body
                           )
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
