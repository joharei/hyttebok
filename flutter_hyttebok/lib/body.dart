import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/containers/details_page.dart';
import 'package:flutter_hyttebok/containers/trips_list.dart';

class Body extends StatelessWidget {
  Widget _buildMobile() => DetailsPageContainer();

  Widget _buildDesktop() {
    return Row(
      children: [
        Expanded(flex: 1, child: TripsListContainer()),
        VerticalDivider(width: 1, thickness: 1),
        Expanded(flex: 3, child: DetailsPageContainer()),
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
