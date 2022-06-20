const fs = require("fs")

function removeQuestion(str){
    if(str.endsWith("?")){
        return str.substring(0,str.length-1)
    }
    return str;
}
  
function generateFile(object) {
    if (object == null) return null
    const fileLocation = object.filePath
    const className = object.className
    const parameters = object.parameters


    if (fileLocation == null) return
    fs.writeFileSync(fileLocation, `// coverage:ignore-file
    // GENERATED CODE - DO NOT MODIFY BY HAND
    // ignore_for_file: type=lint
    // ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target 
    ${object.imports.join("\n")}
    class ${className} {
    ${parameters.map((parameter) => {
        return `final ${parameter.datatype} ${parameter.name};`
    }).join("\n")
        }
    const ${className}({${parameters.map((parameter) => `${parameter.required ? 'required ' : ''}this.${parameter.name}`).join(", ")}});
    ${className} copyWith({${parameters.map((parameter)=>`${parameter.datatype.endsWith("?") ? parameter.datatype: parameter.datatype+"?"} ${parameter.name}` ).join(", ")}}){
        return ${className}(
            ${
                parameters.map((parameter)=>`${parameter.name}:${parameter.name} ?? this.${parameter.name}`).join(",\n")
            }
        );
        }
        
        Map<String,Object?> toJson(){
            return {
                ${
                    parameters.map((parameter)=>`'${parameter.name}': ${parameter.name}`).join(",\n")
                }
            };
        }

        ${className} fromJson(Map<String , Object?> json){
            return ${className}(
                ${parameters.map((parameter)=>`${parameter.name}:json['${parameter.name}'] as ${removeQuestion(parameter.datatype)}`).join(",\n")}
            );
        }

        @override
        String toString(){
            return '''${className}(
                ${parameters.map((parameter)=>`${parameter.name}: $${parameter.name}`).join(",\n")}
            ) ''';
        }

        @override
        bool operator ==(Object other){
            return other is ${className} && 
            other.runtimeType == runtimeType &&
            ${parameters.map((parameter)=>`other.${parameter.name} == ${parameter.name}`).join(" && \n")};
        }
      
         @override
         int get hashCode {
            return Object.hash(
                runtimeType,
                ${parameters.map((parameter)=>parameter.name).join(", \n")}
            );
         }
    
}
     `)
}


module.exports = generateFile