

/**
 * @param {String} editor - The string

 */
 module.exports = function getClassInfo(editor) {
  if (editor == null) return
  let promises = new Promise((resolve, rejects) => {
    let generateFileOptions = {}
   
    let allImports = editor.match(/^\s*(?:import)\s+(("|')(package:)?((\.*\/)|(\.*\w+\/))*\w+)(\.dart|\.g\.dart)\s*("|')(\s*;|(\s*as\s*(M\$\w+|\$\w+)\s*;))/gm)

    if(allImports !=null && allImports.length > 0){
       allImports.forEach((imports,index)=>{
        let filename = imports.match(/((\.*\/)|(\.*\w+\/))*\w+(\.g\.dart)\s*/g)
        if(filename !=null && filename.length > 0){
           allImports.splice(index,1)          
           generateFileOptions = {...generateFileOptions,filename:filename[0].replace(".g.dart",".dart")}
        }
       })
       
      generateFileOptions = {...generateFileOptions,'imports':allImports}
    }else {
      console.log("Null Imports");
    }
    


    // get all class in current editor
    let classNamesWithClassKeyWord = editor.match(/class\s*(M)?\$(\w+)/g)
    if (classNamesWithClassKeyWord.length <= 0) rejects("No className or class KeyWord Was Found! (check class Name)")
    // get all parameters
    let allParameters = editor.match(/\{([^}]+)\}/g)
      .map((element) => element.replace("{", "").match(/\{([^}]+)\}/g)).flat()
    if (allParameters.length !== classNamesWithClassKeyWord.length) rejects("No className or class KeyWord Was Found! (check class Name)")

    classNamesWithClassKeyWord.forEach((classNameWithClass, index) => {
      // class
      let className = classNameWithClass.trimStart().replace("class", "").trim()
      let options = {parameters:[]}
      if (className.startsWith("M")) {
        className = className.replace("M$","")
        options = { ...options, mutable: true, className }
      } else {
        className = className.replace("$","")
        options = { ...options, mutable: false, className }
      }

      //parameters
      let parameters = allParameters[index]
        .trimStart().trimEnd()
        .replace(/[!{}\r\n|\n|\r]/g,"")
        .replace(/  +/g, ' ' )
        .split(",")
        parameters.forEach((parameter)=>{
          let parameterOption = {}
           let types =  parameter.trimStart().split(" ")
          
           if(types.length === 3){
            let datatypes = isDataType(types[1])
            if(datatypes == null) rejects("DataType is not proper")
            let className = null;
            if(!datatypes.inbuilt){
              className = datatypes.className
            }
            parameterOption = {
              required: true,
              dataType: datatypes.inbuilt ?  types[1] : datatypes.dataType,
              name:types[2],
              ...{className,inbuilt:datatypes.inbuilt}
            }
           }else if(types.length === 2){
            let datatypes = isDataType(types[0])
            if(datatypes == null) rejects("DataType is not proper")
            let className = null;
            if(datatypes.inbuilt){
              className = datatypes.className
            }
            parameterOption = {
              required: false,
              dataType: datatypes.inbuilt ?  types[0] : datatypes.dataType,
              name:types[1],
              ...{className,inbuilt:datatypes.inbuilt}
            }
           }else {
            rejects("Parameters are Wrong!")
           }
           options = {...options , parameters : [...options.parameters,parameterOption] }
        })
        generateFileOptions = {...generateFileOptions , "class" : [...generateFileOptions['class'] || [],options]}
    })
     resolve(generateFileOptions)
  })
  return promises;

}


const isDataType = (type)=>{
  if(type == null) return null
  let myDataType = type.trim().replace("?","")
  if(myDataType.startsWith("$")){
    myDataType = myDataType.replace("$","")
  }
  let dataTypes = ["int","String","double","num","bool","dynamic"]
  if(dataTypes.filter((dataType)=>dataType == myDataType).length > 0)return  {inbuilt:true,dataType:type}
  if(myDataType.startsWith("List")){
    myDataType = myDataType.replace("List","").replace("<","").replace(">","").replace("$","")
    if(dataTypes.filter((dataType)=>dataType == myDataType).length > 0)return  {inbuilt:true,dataType:type}
    return {inbuilt:false,dataType:`List<${myDataType}>`,className:myDataType}
  }else if(myDataType.startsWith("Map")){
    myDataType = myDataType.replace("Map","").replace("<","").replace(">","").replace("$","")
    let data = myDataType.split(",")
    if(data.length == 2){
      let myDataType = data[1]
      if(dataTypes.filter((dataType)=>dataType == myDataType).length > 0)return  {inbuilt:true,dataType:type}
      // myDataType = getClassName(myDataType)
      return {inbuilt:false,dataType:`Map<${data[0]},${myDataType}>`,className:myDataType}
    }
    return null
  }
  // type = getClassName(type)
  return {inbuilt:false,dataType:type,className:type}
}
// const getClassName = (str)=>{
//   if(str === null) return
//   let classNames =  str.split(".")
//   if(classNames.length == 2) return classNames[1]
//   return null
// }
