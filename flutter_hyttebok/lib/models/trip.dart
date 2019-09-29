import 'package:meta/meta.dart';

@immutable
class Trip {
  final String id;
  final String name;

  Trip(this.id, this.name);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Trip &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name;

  @override
  int get hashCode => id.hashCode ^ name.hashCode;
}
