# Flutter_FREEZE_VSCODE 

Welcome to flutter_freeze_vscode, yet another code generator for data-classes.

## Motivation
- override toString, operator ==, hashCode
- implement a copyWith method to clone the object
- handling de/serialization
- define a constructor + the properties
- Im Mutable and Mutable data types

## Usage

## Command to execute is
###  (win or cmd + shift + p)  then enter "Flutter Freeze"

**_NOTE:_**  currently There is no shortcut to execute this command, but you can add your own vscode shortcut. 

## Examples

### Im Mutable 
```dart
part './user.g.dart'; //generate dart file location 
class $User {
  $User({String? name,int? age});
}
```
### Result (user.g.dart)
```dart
// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target
part of 'user.dart';

class User {
  final String? name;
  final int? age;
  const User({this.name, this.age});
  User copyWith({String? name, int? age}) {
    return User(name: name ?? this.name, age: age ?? this.age);
  }

  Map<String, Object?> toJson() {
    return {'name': name, 'age': age};
  }

  static User fromJson(Map<String, Object?> json) {
    return User(
        name: json['name'] == null ? null : json['name'] as String,
        age: json['age'] == null ? null : json['age'] as int);
  }

  @override
  String toString() {
    return '''User(
                name:$name,
age:$age
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is User &&
        other.runtimeType == runtimeType &&
        other.name == name &&
        other.age == age;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, name, age);
  }
}

```
### Mutable 
```dart
part './user.g.dart'; //generate dart file location 
class M$User {
  M$User({String? name,int? age});
}
```
### Result Page (user.g.dart)
```dart

// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target
part of 'user.dart';

class User {
  String? name;
  int? age;
  User({this.name, this.age});
  User copyWith({String? name, int? age}) {
    return User(name: name ?? this.name, age: age ?? this.age);
  }

  Map<String, Object?> toJson() {
    return {'name': name, 'age': age};
  }

  static User fromJson(Map<String, Object?> json) {
    return User(
        name: json['name'] == null ? null : json['name'] as String,
        age: json['age'] == null ? null : json['age'] as int);
  }

  @override
  String toString() {
    return '''User(
                name:$name,
age:$age
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is User &&
        other.runtimeType == runtimeType &&
        other.name == name &&
        other.age == age;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, name, age);
  }
}

```


###  Model as parameter
```dart
import 'package:flutter_project_for_test/modules/user.dart';

part './book.g.dart';
class $Book {
  $Book({required User user,required int id,required String bookName});
}
```

### Result page (book.g.dart)
```dart
// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target
part of 'book.dart';

class Book {
  final User user;
  final int id;
  final String bookName;
  const Book({required this.user, required this.id, required this.bookName});
  Book copyWith({User? user, int? id, String? bookName}) {
    return Book(
        user: user ?? this.user,
        id: id ?? this.id,
        bookName: bookName ?? this.bookName);
  }

  Map<String, Object?> toJson() {
    return {'user': user.toJson(), 'id': id, 'bookName': bookName};
  }

  static Book fromJson(Map<String, Object?> json) {
    return Book(
        user: User.fromJson(json['user'] as Map<String, Object?>),
        id: json['id'] as int,
        bookName: json['bookName'] as String);
  }

  @override
  String toString() {
    return '''Book(
                user:${user.toString()},
id:$id,
bookName:$bookName
    ) ''';
  }

  @override
  bool operator ==(Object other) {
    return other is Book &&
        other.runtimeType == runtimeType &&
        other.user == user &&
        other.id == id &&
        other.bookName == bookName;
  }

  @override
  int get hashCode {
    return Object.hash(runtimeType, user, id, bookName);
  }
}


```
## Demo
### Normal  (Im mutable)
![alt text](https://raw.githubusercontent.com/praveen576232/flutter_freeze_vsCode/main/screenshots/img1.gif)
### add default parameter
![alt text](https://raw.githubusercontent.com/praveen576232/flutter_freeze_vsCode/main/screenshots/img2.gif)
### Mutable
![alt text](https://raw.githubusercontent.com/praveen576232/flutter_freeze_vsCode/main/screenshots/img3.gif)
### optinal parameter
![alt text](https://raw.githubusercontent.com/praveen576232/flutter_freeze_vsCode/main/screenshots/img4.gif)
### use another data model
![alt text](https://raw.githubusercontent.com/praveen576232/flutter_freeze_vsCode/main/screenshots/img5.gif)
