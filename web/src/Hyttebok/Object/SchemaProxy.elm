-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Hyttebok.Object.SchemaProxy exposing (directives, mutationType, proxiedSchema, queryType, subscriptionType, types)

import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.Operation exposing (RootMutation, RootQuery, RootSubscription)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Hyttebok.InputObject
import Hyttebok.Interface
import Hyttebok.Object
import Hyttebok.Scalar
import Hyttebok.ScalarCodecs
import Hyttebok.Union
import Json.Decode as Decode


directives : SelectionSet decodesTo Hyttebok.Object.Directive__ -> SelectionSet (List decodesTo) Hyttebok.Object.SchemaProxy
directives object_ =
    Object.selectionForCompositeField "directives" [] object_ (identity >> Decode.list)


mutationType : SelectionSet decodesTo Hyttebok.Object.Type__ -> SelectionSet (Maybe decodesTo) Hyttebok.Object.SchemaProxy
mutationType object_ =
    Object.selectionForCompositeField "mutationType" [] object_ (identity >> Decode.nullable)


proxiedSchema : SelectionSet decodesTo Hyttebok.Interface.LookupSchema -> SelectionSet (Maybe decodesTo) Hyttebok.Object.SchemaProxy
proxiedSchema object_ =
    Object.selectionForCompositeField "proxiedSchema" [] object_ (identity >> Decode.nullable)


queryType : SelectionSet decodesTo Hyttebok.Object.Type__ -> SelectionSet decodesTo Hyttebok.Object.SchemaProxy
queryType object_ =
    Object.selectionForCompositeField "queryType" [] object_ identity


subscriptionType : SelectionSet decodesTo Hyttebok.Object.Type__ -> SelectionSet (Maybe decodesTo) Hyttebok.Object.SchemaProxy
subscriptionType object_ =
    Object.selectionForCompositeField "subscriptionType" [] object_ (identity >> Decode.nullable)


types : SelectionSet decodesTo Hyttebok.Object.Type__ -> SelectionSet (List decodesTo) Hyttebok.Object.SchemaProxy
types object_ =
    Object.selectionForCompositeField "types" [] object_ (identity >> Decode.list)