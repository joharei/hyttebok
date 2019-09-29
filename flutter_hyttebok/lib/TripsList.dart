import 'package:flutter/material.dart';

class TripsList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scrollbar(
      child: ListView.builder(
        itemCount: 100,
        itemBuilder: (context, index) => ListTile(title: Text('$index')),
      ),
    );
  }
}
