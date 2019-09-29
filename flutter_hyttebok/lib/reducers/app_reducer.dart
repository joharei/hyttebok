import 'package:flutter_hyttebok/models/app_state.dart';
import 'package:flutter_hyttebok/reducers/loading_trips_reducer.dart';
import 'package:flutter_hyttebok/reducers/selected_trip_reducer.dart';
import 'package:flutter_hyttebok/reducers/trips_reducer.dart';

AppState appReducer(AppState state, action) {
  return AppState(
    trips: tripsReducer(state.trips, action),
    loadingTrips: loadingTripsReducer(state.loadingTrips, action),
    selectedTrip: selectedTripReducer(state.selectedTrip, action),
  );
}
