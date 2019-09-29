import 'package:flutter/material.dart';
import 'package:flutter_hyttebok/containers/trips_list.dart';
import 'package:flutter_hyttebok/models/app_state.dart';
import 'package:flutter_hyttebok/reducers/app_reducer.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

import 'body.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  final store = Store<AppState>(appReducer, initialState: AppState.initial());

  @override
  Widget build(BuildContext context) {
    return StoreProvider(
      store: store,
      child: MaterialApp(
        title: 'Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.brown,
        ),
        home: MyHomePage(title: 'Hyttebok'),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      drawer: MediaQuery.of(context).size.width < 600
          ? Drawer(child: TripsListContainer())
          : null,
      body: Body(),
    );
  }
}
