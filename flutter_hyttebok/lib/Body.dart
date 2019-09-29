import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/DetailsPage.dart';
import 'package:flutter_hyttebok/TripsList.dart';

class Body extends StatelessWidget {
  Widget _buildMobile() => DetailsPage();

  Widget _buildDesktop() {
    return Row(
      children: [
        Expanded(flex: 1, child: TripsList()),
        Expanded(flex: 3, child: DetailsPage()),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return MediaQuery.of(context).size.width < 600
        ? _buildMobile()
        : _buildDesktop();
  }
}
