import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/models/trip.dart';

class DetailsPage extends StatelessWidget {
  final Trip trip;

  DetailsPage({Key key, @required this.trip});

  @override
  Widget build(BuildContext context) {
    return Center(child: Text(trip?.name ?? 'Velg en tur'));
  }
}
