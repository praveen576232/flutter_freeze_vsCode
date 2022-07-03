module.exports = function generateClass(classInfo) {
  return `// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target 

${classInfo.imports.join("\n")}
${isDeepEqualImportRequire(classInfo.class)}
${classInfo.class.map((myClass)=>{
    return   `
class ${myClass.className} {
${myClass.parameters.map((parameter) => {
return `${myClass.mutable ? "":"final"} ${parameter.dataType} ${parameter.name};`
}).join("\n")
}
${myClass.mutable ? "":"const"} ${myClass.className}({${myClass.parameters.map((parameter) => `${parameter.required ? 'required ' : ''}this.${parameter.name}`).join(", ")}});
${myClass.className} copyWith({${myClass.parameters.map((parameter)=>`${parameter.dataType.endsWith("?") ? parameter.dataType: parameter.dataType+"?"} ${parameter.name}` ).join(", ")}}){
return ${myClass.className}(
            ${
                myClass.parameters.map((parameter)=>`${parameter.name}:${parameter.name} ?? this.${parameter.name}`).join(",\n")
            }
        );
        }
        
Map<String,Object?> toJson(){
    return {
            ${
            myClass.parameters.map((parameter)=>`'${parameter.name}': ${parameter.inbuilt ?  parameter.name : toJsonForClass(parameter)}`).join(",\n")
            }
    };
}

static ${myClass.className} fromJson(Map<String , Object?> json){
    return ${myClass.className}(
            ${myClass.parameters.map((parameter)=>`${parameter.name}:${parameter.inbuilt ? `json['${parameter.name}'] as ${removeQuestion(parameter.dataType)}` : fromJsonForClass(parameter)}`).join(",\n")}
    );
}

@override
String toString(){
    return '''${myClass.className}(
                ${myClass.parameters.map((parameter)=>`${parameter.name}:${parameter.inbuilt ? `$${parameter.name}` : `\${${parameter.name}.toString()\}` }`).join(",\n")}
    ) ''';
}

@override
bool operator ==(Object other){
    return other is ${myClass.className} && 
        other.runtimeType == runtimeType &&
        ${myClass.parameters.map((parameter)=>`other.${parameter.name} == ${parameter.name}`).join(" && \n")};
}
      
@override
int get hashCode {
    return Object.hash(
                runtimeType,
                ${myClass.parameters.map((parameter)=>parameter.name).join(", \n")}
    );
}
    
}
      
      `
    }).join("\n")
    }
  
     `
}



function removeQuestion(str){
    if(str.endsWith("?")){
        return str.substring(0,str.length-1)
    }
    return str;
}
  
function toJsonForClass(parameter) {
   if(parameter.dataType.startsWith("List")){
      return `${parameter.name}.map<Map<String,dynamic>>((data)=> data.toJson()).toList()` 
   }else if(parameter.startsWith("Map")){
    return `${parameter.name}['${parameter.name}'].toJson()`
   }
   return `${parameter.name}.toJson()`
}
function fromJsonForClass(parameter) {
   if(parameter.dataType.startsWith("List")){
      return `json['${parameter.name}'].map<${parameter.className}>((data)=> ${parameter.className}.fromJson(data)).toList()` 
   }else if(parameter.startsWith("Map")){
    return `${parameter.name}['${parameter.name}']`
   }
   return `${parameter.className}.fromJson(json['${parameter.name}'])`
}
function isDeepEqualImportRequire(myClass){
  if(myClass == null || myClass.length <= 0) return
  let importStatement;
  for (let index = 0; index < myClass.length; index++) {
    if(myClass[index].parameters != null || myClass[index].parameters.length > 0 ){
        importStatement =   myClass[index].parameters.map((parameter)=>{
            if(!parameter.inbuilt && parameter.dataType.startsWith("List")){
                return "import 'package:collection/collection.dart';"
            }
          }).join("")
          if(importStatement != null && importStatement!="") return importStatement
    } 

    
    
}
return (importStatement != null && importStatement!="") ?  importStatement :""
}
