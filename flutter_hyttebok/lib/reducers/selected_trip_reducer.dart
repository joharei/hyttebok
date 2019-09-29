import 'package:flutter_hyttebok/actions/actions.dart';
import 'package:flutter_hyttebok/models/trip.dart';
import 'package:redux/redux.dart';

final selectedTripReducer = combineReducers<Trip>([
  TypedReducer<Trip, SelectTripAction>(_selectTrip),
]);

Trip _selectTrip(Trip trip, SelectTripAction action) {
  return action.selectedTrip;
}
