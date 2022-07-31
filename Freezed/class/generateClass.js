const vscode = require("vscode")
module.exports = function generateClass(classInfo) {
    let depth = getDepthOfFolder(classInfo.filename)
  return `// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target 
part of '${generateDepthFolder(depth)}${getFileNameOfActiveTab(vscode.window.activeTextEditor.document.fileName)}';


${classInfo.class.map((myClass)=>{
    return   `
class ${myClass.className} {
${myClass.parameters.map((parameter) => {
return `${myClass.mutable ? "":"final"} ${parameter.dataType} ${parameter.name};`
}).join("\n")
}
${myClass.mutable ? "":"const"} ${myClass.className}({${myClass.parameters.map((parameter) => `${parameter.required ? 'required ' : ''}this.${parameter.name} ${parameter.isDefault ? `= ${parameter.defaultValue}` :''}`).join(", ")}});
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
            ${myClass.parameters.map((parameter)=>`${parameter.name}:${parameter.inbuilt ? isOptionalDataType(parameter.dataType) ? parameter.isDefault ? defaultValueParameter(parameter) : nullDataType(parameter) : parameter.isDefault ? defaultValueParameter(parameter) : notOptionalDataType(parameter) : `${fromJsonForClass(parameter)}` }`).join(",\n")}
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
   }else if(parameter.dataType.startsWith("Map")){
    return `${parameter.name}['${parameter.name}'].toJson()`
   }
   return `${parameter.name}.toJson()`
}
function fromJsonForClass(parameter) {
   if(parameter.dataType.startsWith("List")){
      return isOptionalDataType(parameter.dataType)? parameter.isDefault ? defaultValueParameterForClassDataTypeList(parameter):  `json['${parameter.name}'] == null ? null : json['${parameter.name}'].map<${parameter.className}>((data)=> (${parameter.className} as List).fromJson(data  as Map<String,Object?>)).toList()`  :parameter.isDefault ? defaultValueParameterForClassDataTypeList(parameter) : `(json['${parameter.name}'] as List).map<${parameter.className}>((data)=> ${parameter.className}.fromJson(data as Map<String,Object?>)).toList()` 
   }else if(parameter.dataType.startsWith("Map")){
    return isOptionalDataType(parameter.dataType)?  parameter.isDefault ? defaultValueParameterForClassDataTypeMap(parameter) : `${parameter.name}['${parameter.name}'] == null ? null : ${parameter.name}['${parameter.name}']` :parameter.isDefault ? defaultValueParameterForClassDataTypeMap(parameter) : `${parameter.name}['${parameter.name}']`
   }
   return isOptionalDataType(parameter.dataType)?parameter.isDefault ? defaultValueParameterForClassDataTypeDynamic(parameter) : `json['${parameter.name}'] == null ? null : ${parameter.className}.fromJson(json['${parameter.name}'])` :parameter.isDefault ? defaultValueParameterForClassDataTypeDynamic(parameter) :`${parameter.className}.fromJson(json['${parameter.name}']  as Map<String,Object?>)`
}
function defaultValueParameter(parameter){
    return  `json['${parameter.name}'] == null ? ${parameter.defaultValue} : json['${parameter.name}'] as ${removeQuestion(parameter.dataType)}`
}
function defaultValueParameterForClassDataTypeList(parameter){
    return  `json['${parameter.name}'] == null ? ${parameter.defaultValue} : json['${parameter.name}'].map<${parameter.className}>((data)=> (${parameter.className} as List).fromJson(data  as Map<String,Object?>)).toList()`
}
function defaultValueParameterForClassDataTypeMap(parameter){
    return   `${parameter.name}['${parameter.name}'] == null ? ${parameter.defaultValue} : ${parameter.name}['${parameter.name}']`
}
function defaultValueParameterForClassDataTypeDynamic(parameter){
    return   `json['${parameter.name}'] == null ? ${parameter.defaultValue} : ${parameter.className}.fromJson(json['${parameter.name}'])`
}
function notOptionalDataType(parameter){
    return `json['${parameter.name}'] as ${removeQuestion(parameter.dataType)}`
}
function nullDataType(parameter){
    return `json['${parameter.name}'] == null ? null : json['${parameter.name}'] as ${removeQuestion(parameter.dataType)}`
}





// function isDeepEqualImportRequire(myClass){
//   if(myClass == null || myClass.length <= 0) return
//   let importStatement;
//   for (let index = 0; index < myClass.length; index++) {
//     if(myClass[index].parameters != null || myClass[index].parameters.length > 0 ){
//         importStatement =   myClass[index].parameters.map((parameter)=>{
//             if(!parameter.inbuilt && parameter.dataType.startsWith("List")){
//                 return "import 'package:collection/collection.dart';"
//             }
//           }).join("")
//           if(importStatement != null && importStatement!="") return importStatement
//     } 

    
    
// }
// return (importStatement != null && importStatement!="") ?  importStatement :""
// }


function getDepthOfFolder(folderPath){
  if(folderPath == null) return 0;
  let folders  = folderPath.split("/")
  if(folders.length > 2){
    return folders.length - 2
  }
  return 0
}
function generateDepthFolder(depth) {
    if(depth == null) return ''
    let depthString = ""
    for (let index = 0; index < depth; index++) {
        depthString+="../"
        
    }
    return depthString
}
function getFileNameOfActiveTab(path) {
    if(path == null) return null;
    let fileNames = path.match(/(\w+\.dart)\s*/g)
    if(fileNames !=null && fileNames.length > 0){
        return fileNames[0]
    }
    return null
}
function isOptionalDataType(dataType) {
    return dataType.endsWith("?")
}
