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
import Material.Drawer as Drawer exposing (drawerContent, drawerHeader, drawerTitle, permanentDrawer, permanentDrawerConfig)
import Material.List exposing (ListItemConfig, list, listConfig, listItem, listItemConfig)
import Material.TopAppBar as TopAppBar exposing (topAppBar, topAppBarConfig)
import Material.Typography as Typography
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
    , drawerSelectedId : Maybe Int
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
      , drawerSelectedId = Nothing
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
    | SetDrawerSelectedId (Maybe Int)


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

        SetDrawerSelectedId index ->
            ( { model | drawerSelectedId = index }
            , Cmd.none
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
                (drawerBody model.trips SetDrawerSelectedId model.drawerSelectedId)
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
                , div [ TopAppBar.fixedAdjust ]
                    []
                ]
            ]
        ]
    }


viewTrip : (Maybe Int -> ListItemConfig msg) -> Trip -> Html msg
viewTrip listItemConfig_ trip =
    listItem (listItemConfig_ (Maybe.Just trip.id))
        [ text trip.name
        ]


drawerBody : TripModel -> (Maybe Int -> msg) -> Maybe Int -> List (Html msg)
drawerBody tripModel setSelectedId selectedId =
    let
        listItemConfig_ index =
            { listItemConfig
                | activated = selectedId == index
                , onClick = Just (setSelectedId index)
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
