// coverage:ignore-file
    // GENERATED CODE - DO NOT MODIFY BY HAND
    // ignore_for_file: type=lint
    // ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target 
    import "../person/person.dart";
    
        class MyName {
    final List<Person> name;
final int age;
    const MyName({required this.name, required this.age});
    MyName copyWith({List<Person>? name, int? age}){
        return MyName(
            name:name ?? this.name,
age:age ?? this.age
        );
        }
        
        Map<String,Object?> toJson(){
            return {
                'name': name,
'age': age
            };
        }

        MyName fromJson(Map<String , Object?> json){
            return MyName(
                name:json['name'] as List<Person>,
age:json['age'] as int
            );
        }

        @override
        String toString(){
            return '''MyName(
                name: $name,
age: $age
            ) ''';
        }

        @override
        bool operator ==(Object other){
            return other is MyName && 
            other.runtimeType == runtimeType &&
            other.name == name && 
other.age == age;
        }
      
         @override
         int get hashCode {
            return Object.hash(
                runtimeType,
                name, 
age
            );
         }
    
}
      
      

        class Person {
    final List<String> name;
final int age;
    const Person({required this.name, required this.age});
    Person copyWith({List<String>? name, int? age}){
        return Person(
            name:name ?? this.name,
age:age ?? this.age
        );
        }
        
        Map<String,Object?> toJson(){
            return {
                'name': name,
'age': age
            };
        }

        Person fromJson(Map<String , Object?> json){
            return Person(
                name:json['name'] as List<String>,
age:json['age'] as int
            );
        }

        @override
        String toString(){
            return '''Person(
                name: $name,
age: $age
            ) ''';
        }

        @override
        bool operator ==(Object other){
            return other is Person && 
            other.runtimeType == runtimeType &&
            other.name == name && 
other.age == age;
        }
      
         @override
         int get hashCode {
            return Object.hash(
                runtimeType,
                name, 
age
            );
         }
    
}
      
      
  
     