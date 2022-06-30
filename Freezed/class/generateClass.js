module.exports = function generateClass(classInfo) {
  return `// coverage:ignore-file
    // GENERATED CODE - DO NOT MODIFY BY HAND
    // ignore_for_file: type=lint
    // ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target 
    ${classInfo.imports.join("\n")}
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
                    myClass.parameters.map((parameter)=>`'${parameter.name}': ${parameter.name}`).join(",\n")
                }
            };
        }

        ${myClass.className} fromJson(Map<String , Object?> json){
            return ${myClass.className}(
                ${myClass.parameters.map((parameter)=>`${parameter.name}:json['${parameter.name}'] as ${removeQuestion(parameter.dataType)}`).join(",\n")}
            );
        }

        @override
        String toString(){
            return '''${myClass.className}(
                ${myClass.parameters.map((parameter)=>`${parameter.name}: $${parameter.name}`).join(",\n")}
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
  