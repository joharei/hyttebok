import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/models/trip.dart';
import 'package:flutter_hyttebok/shared/custom_cursor.dart';

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
        itemBuilder: (context, index) {
          var listTile = ListTile(
            title: Text(trips[index].name),
            selected: selectedTrip == trips[index],
            onTap: () => onOpenTrip(trips[index]),
          );
          return CustomCursor(
            child: selectedTrip == trips[index]
                ? Container(
                    decoration: BoxDecoration(
                        color: Theme.of(context).selectedRowColor),
                    child: listTile,
                  )
                : listTile,
          );
        },
      ),
    );
  }
}
