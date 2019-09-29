import 'package:flutter_hyttebok/models/trip.dart';
import 'package:meta/meta.dart';

@immutable
class AppState {
  final List<Trip> trips;
  final bool loadingTrips;
  final Trip selectedTrip;

  AppState({
    this.trips = const [],
    this.loadingTrips = false,
    this.selectedTrip,
  });

  factory AppState.initial() => AppState(
      trips: List.generate(
          100, (index) => Trip(index.toString(), index.toString())));

  AppState copyWith({
    List<Trip> trips,
    bool loadingTrips,
    Trip selectedTrip,
  }) {
    return AppState(
      trips: trips ?? this.trips,
      loadingTrips: loadingTrips ?? this.loadingTrips,
      selectedTrip: selectedTrip ?? this.selectedTrip,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AppState &&
          runtimeType == other.runtimeType &&
          trips == other.trips &&
          loadingTrips == other.loadingTrips &&
          selectedTrip == other.selectedTrip;

  @override
  int get hashCode =>
      trips.hashCode ^ loadingTrips.hashCode ^ selectedTrip.hashCode;
}
