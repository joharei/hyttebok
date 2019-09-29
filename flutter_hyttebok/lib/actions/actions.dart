import 'package:flutter_hyttebok/models/trip.dart';

class SelectTripAction {
  final Trip selectedTrip;

  SelectTripAction(this.selectedTrip);

  @override
  String toString() {
    return 'SelectTripAction{selectedTrip: $selectedTrip}';
  }
}
