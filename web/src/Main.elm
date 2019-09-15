module Main exposing (main)

import Browser
import Browser.Navigation as Nav
import Constants
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Html exposing (..)
import Html.Attributes
import Hyttebok.Object
import Hyttebok.Object.Trip as Trip
import Hyttebok.Query as Query
import Markdown
import Material.Drawer as Drawer exposing (drawerContent, drawerHeader, drawerTitle, permanentDrawer, permanentDrawerConfig)
import Material.List exposing (ListItemConfig, list, listConfig, listItem, listItemConfig)
import Material.TopAppBar as TopAppBar exposing (topAppBar, topAppBarConfig)
import Material.Typography as Typography
import RemoteData exposing (RemoteData)
import Url
import Url.Builder
import Url.Parser as Parser exposing ((</>), Parser, int, s)



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
    | TripPage Int


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
            Constants.graphqlUrl
        |> Graphql.Http.send (RemoteData.fromResult >> GotResponse)


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | GotResponse TripModel
    | NavigateToTrip (Maybe Int)


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

        NavigateToTrip id ->
            ( model
            , case id of
                Just idValue ->
                    Nav.pushUrl model.key (Url.Builder.absolute [ "trip", String.fromInt idValue ] [])

                Nothing ->
                    Cmd.none
            )



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "Hyttebok"
    , body =
        [ div
            [ Html.Attributes.style "display" "-ms-flexbox"
            , Html.Attributes.style "display" "flex"
            , Html.Attributes.style "height" "100vh"
            , Typography.typography
            ]
            [ permanentDrawer permanentDrawerConfig
                (drawerBody model.trips
                    (case model.page of
                        TripPage id ->
                            Just id

                        _ ->
                            Nothing
                    )
                )
            , div [ Drawer.appContent ]
                [ topAppBar { topAppBarConfig | fixed = True }
                    [ TopAppBar.row []
                        [ TopAppBar.section
                            [ TopAppBar.alignStart
                            ]
                            [ Html.span [ TopAppBar.title ] [ text "Hyttebok" ]
                            ]
                        ]
                    ]
                , div
                    [ Html.Attributes.style "padding-left" "18px"
                    , Html.Attributes.style "padding-right" "18px"
                    , Html.Attributes.style "overflow" "auto"
                    , Html.Attributes.style "height" "100%"
                    , Html.Attributes.style "box-sizing" "border-box"
                    , TopAppBar.fixedAdjust
                    , Drawer.appContent
                    ]
                    [ case model.page of
                        Main ->
                            mainBody

                        _ ->
                            text ""
                    ]
                ]
            ]
        ]
    }


viewTrip : (Maybe Int -> ListItemConfig msg) -> Trip -> Html msg
viewTrip listItemConfig_ trip =
    listItem (listItemConfig_ (Maybe.Just trip.id))
        [ text trip.name
        ]


drawerBody : TripModel -> Maybe Int -> List (Html Msg)
drawerBody tripModel selectedId =
    let
        listItemConfig_ id =
            { listItemConfig
                | activated = selectedId == id
                , onClick = Just (NavigateToTrip id)
            }
    in
    [ drawerHeader []
        [ Html.h3 [ drawerTitle ] [ text "Turer" ]
        ]
    , drawerContent []
        [ case tripModel of
            RemoteData.NotAsked ->
                text "Vent litt..."

            RemoteData.Loading ->
                text "Vent litt..."

            RemoteData.Failure _ ->
                text "Klarte ikke å hente turer"

            RemoteData.Success trips ->
                list { listConfig | additionalAttributes = [ Html.Attributes.style "max-width" "300px" ] } (List.map (viewTrip listItemConfig_) trips)
        ]
    ]


mainBody : Html msg
mainBody =
    Markdown.toHtml [] """
Fordi vi har glemt å skrive i hytteboka ("analog" / "manuell") fra dag 1 ble denne digitale hytteboka opprinnelig laget hjemme som en oppsummering av bruk av hytta på basis as almanakker, bilder og andre kilder 2 år etter at vi kjøpte den.

Ideen var at dette skulle føres inn i den analoge hytteboka med penn en dag jeg hadde god tid og hadde gått dagens tur.

I ettertid har det vist seg at det aldri vil skje, og at det heller ikke er praktisk. Derfor er denne hytteboka nå blitt til "Faktisk hyttebok", og inneholder alle turene (med et visst etterslep...) vi har hatt på hytta, inkludert bilder og kart over turene.
                """



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
        [ Parser.map Main Parser.top
        , Parser.map TripPage (s "trip" </> int)
        ]


toRoute : Url.Url -> Page
toRoute url =
    Maybe.withDefault NotFound (Parser.parse route url)
