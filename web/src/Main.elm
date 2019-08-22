module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Graphql.Document as Document
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (..)
import Hyttebok.Object
import Hyttebok.Object.Trip as Trip
import Hyttebok.Query as Query
import RemoteData exposing (RemoteData)
import Url
import Url.Parser as Parser exposing (Parser)



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , page : Page
    , trips : TripModel
    }


type alias TripModel =
    RemoteData (Graphql.Http.Error (List Trip)) (List Trip)


type Page
    = NotFound
    | Main


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url key =
    ( { key = key
      , page = toRoute url
      , trips = RemoteData.Loading
      }
    , makeRequest
    )



-- UPDATE


makeRequest : Cmd Msg
makeRequest =
    query
        |> Graphql.Http.queryRequest
            "http://localhost:8080/graphql"
        |> Graphql.Http.send (RemoteData.fromResult >> GotResponse)


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | GotResponse TripModel


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | page = toRoute url }
            , Cmd.none
            )

        GotResponse tripModel ->
            ( { model | trips = tripModel }
            , Cmd.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "Hyttebok"
    , body =
        [ div []
            [ h1 [] [ text "Turer" ]
            , case model.trips of
                RemoteData.NotAsked ->
                    text "Vent litt..."

                RemoteData.Loading ->
                    text "Vent litt..."

                RemoteData.Failure _ ->
                    text "Klarte ikke å hente turer"

                RemoteData.Success trips ->
                    ul [] (List.map viewTrip trips)
            ]
        ]
    }


viewTrip : Trip -> Html msg
viewTrip trip =
    li []
        [ text trip.name
        ]



-- API


query : SelectionSet (List Trip) RootQuery
query =
    Query.trips tripSelection


type alias Trip =
    { id : Int
    , name : String
    }


tripSelection : SelectionSet Trip Hyttebok.Object.Trip
tripSelection =
    SelectionSet.map2 Trip
        Trip.id
        Trip.title



-- ROUTER


route : Parser (Page -> a) a
route =
    Parser.oneOf
        [ Parser.map Main Parser.top ]


toRoute : Url.Url -> Page
toRoute url =
    Maybe.withDefault NotFound (Parser.parse route url)
