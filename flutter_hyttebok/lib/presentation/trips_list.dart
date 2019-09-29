import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/models/trip.dart';

class TripsList extends StatelessWidget {
  final List<Trip> trips;
  final Function(Trip) onOpenTrip;
  final Trip selectedTrip;

  TripsList({
    Key key,
    @required this.trips,
    @required this.onOpenTrip,
    @required this.selectedTrip,
  });

  @override
  Widget build(BuildContext context) {
    return Scrollbar(
      child: ListView.builder(
        itemCount: trips.length,
        itemBuilder: (context, index) => ListTile(
          title: Text(trips[index].name),
          selected: selectedTrip == trips[index],
          onTap: () => onOpenTrip(trips[index]),
        ),
      ),
    );
  }
}
