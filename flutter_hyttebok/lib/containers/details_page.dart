import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/models/app_state.dart';
import 'package:flutter_hyttebok/models/trip.dart';
import 'package:flutter_hyttebok/presentation/details_page.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

class DetailsPageContainer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ViewModel>(
      converter: _ViewModel.fromStore,
      builder: (context, vm) {
        return DetailsPage(trip: vm.trip);
      },
    );
  }
}

class _ViewModel {
  final Trip trip;

  _ViewModel({@required this.trip});

  static _ViewModel fromStore(Store<AppState> store) {
    return _ViewModel(trip: store.state.selectedTrip);
  }
}
