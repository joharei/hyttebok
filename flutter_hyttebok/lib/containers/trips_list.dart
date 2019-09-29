import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/actions/actions.dart';
import 'package:flutter_hyttebok/models/app_state.dart';
import 'package:flutter_hyttebok/models/trip.dart';
import 'package:flutter_hyttebok/presentation/trips_list.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

class TripsListContainer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ViewModel>(
      converter: _ViewModel.fromStore,
      builder: (context, vm) {
        return TripsList(
          trips: vm.trips,
          onOpenTrip: vm.onOpenTrip,
          selectedTrip: vm.selectedTrip,
        );
      },
    );
  }
}

class _ViewModel {
  final List<Trip> trips;
  final Function(Trip) onOpenTrip;
  final Trip selectedTrip;

  _ViewModel({
    @required this.trips,
    @required this.onOpenTrip,
    @required this.selectedTrip,
  });

  static _ViewModel fromStore(Store<AppState> store) {
    return _ViewModel(
      trips: store.state.trips,
      onOpenTrip: (trip) {
        store.dispatch(SelectTripAction(trip));
      },
      selectedTrip: store.state.selectedTrip,
    );
  }
}
