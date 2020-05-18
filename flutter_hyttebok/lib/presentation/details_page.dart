import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/models/trip.dart';
import 'package:flutter_hyttebok/shared/custom_cursor.dart';

class DetailsPage extends StatelessWidget {
  final Trip trip;

  DetailsPage({Key key, @required this.trip});

  @override
  Widget build(BuildContext context) {
    return Center(
        child: CustomCursor(
      cursorStyle: CustomCursor.text,
      child: SelectableText(trip?.name ?? 'Velg en tur'),
    ));
  }
}
