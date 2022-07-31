

/**
 * @param {String} editor - The string

 */
module.exports = function getClassInfo(editor) {
  if (editor == null) return
  let promises = new Promise((resolve, rejects) => {
    let generateFileOptions = {}

    let allImports = editor.match(/^\s*(part)\s+("|')(((\.*\/)|(\.*\w+\/))*\w+)(\.g\.dart)\s*("|')(\s*;)/gm)

    if (allImports != null && allImports.length > 0) {
      //  allImports.forEach((imports,index)=>{

      // if(RegExp(/^\s*(part)\s+("|')(((\.*\/)|(\.*\w+\/))*\w+)(\.g\.dart)\s*("|')(\s*;)/g).test(imports))
      // {
      let filename = allImports[0].replace(/^\s*(part)\s+("|')(((\.*\/)|(\.*\w+\/))*\w+)(\.g\.dart)\s*("|')(\s*;)/g, "\$3\$7")
      if (filename != null && filename != "") {

        generateFileOptions = { ...generateFileOptions, filename: filename }

      } else {
        rejects("file Name not Found! please Follow the Rules. (Example: part 'fileName.g.dart');")

      }
      // allImports.splice(index,1)  
      // }


      //  })

      // generateFileOptions = {...generateFileOptions,'imports':allImports}
    } else {
      rejects("file Name not Found! please Follow the Rules. (Example: part 'fileName.g.dart');")
    }



    // get all class in current editor
    let classNamesWithClassKeyWord = editor.match(/class\s*(M)?\$(\w+)/g)
    if (classNamesWithClassKeyWord.length <= 0) rejects("No className or class KeyWord Was Found! (check class Name)")
    // get all parameters
    let allParameters = editor.match(/\{([^}]+)\}/g)
      .map((element) => element.replace("{", "").match(/\{([^}]+)\}/g)).flat()
    if (allParameters.length !== classNamesWithClassKeyWord.length) rejects("No className or class KeyWord Was Found! (check class Name)")
    console.log(allParameters);
    classNamesWithClassKeyWord.forEach((classNameWithClass, index) => {
      // class
      let className = classNameWithClass.trimStart().replace("class", "").trim()
      // if filepath is null then class name is the a class name
      if (generateFileOptions.filename == null) {
        generateFileOptions.filename = `${className.replace("$", "").toLowerCase()}.g.dart`
      }
      let options = { parameters: [] }
      if (className.startsWith("M")) {
        className = className.replace("M$", "")
        options = { ...options, mutable: true, className }
      } else {
        className = className.replace("$", "")
        options = { ...options, mutable: false, className }
      }

      //parameters
      let parameters = allParameters[index]
        .trimStart().trimEnd()
        .replace(/[!{}\r\n|\n|\r]/g, "")
        .replace(/  +/g, ' ')
        .split(",")
      parameters.forEach((parameter) => {
        let parameterOption = {}
        let types = parameter.trimStart().split(" ")
        if (parameter.includes("=")) {
          let datatypes = isDataType(types[0])
          if (datatypes == null) rejects("DataType is not proper")
          let className = null;
          if (datatypes.inbuilt) {
            className = datatypes.className
          }
        
          let parameterName;
          let defaultValue;
          if(types.length > 3 && types[2].trim() =="="){
              parameterName = types[1]
             defaultValue = types[3]
          }
          else if(types[1].includes("=")){
            let splittedData = types[1].split("=")
            if(splittedData.length > 0){
              parameterName = splittedData[0]
             
              if(splittedData.length >1 && splittedData[1] !=''){
                defaultValue = splittedData[1];
              }
            }else {
              rejects("Please check the parameter!")
            }
          }else if(types.length > 2 && types[2].includes("=")){
            let splittedData = types[2].split("=")
            if(splittedData.length > 1){
              defaultValue = splittedData[1]
            
             
            }else {
              rejects("Please check the parameter!")
            }
          }
          parameterOption = {
            required: false,
            dataType: datatypes.inbuilt ? types[0] : datatypes.dataType,
            name: types[1],
            isDefault:parameterName,
            defaultValue:defaultValue,
            ...{ className, inbuilt: datatypes.inbuilt }
          }
        }
        else if (types.length === 3) {
          let datatypes = isDataType(types[1])
          if (datatypes == null) rejects("DataType is not proper")
          let className = null;
          if (!datatypes.inbuilt) {
            className = datatypes.className
          }
          parameterOption = {
            required: true,
            dataType: datatypes.inbuilt ? types[1] : datatypes.dataType,
            name: types[2],
            ...{ className, inbuilt: datatypes.inbuilt }
          }
        } else if (types.length === 2) {
          let datatypes = isDataType(types[0])
          if (datatypes == null) rejects("DataType is not proper")
          let className = null;
          if (datatypes.inbuilt) {
            className = datatypes.className
          }
          parameterOption = {
            required: false,
            dataType: datatypes.inbuilt ? types[0] : datatypes.dataType,
            name: types[1],
            ...{ className, inbuilt: datatypes.inbuilt }
          }
        } else {
          rejects("Parameters are Wrong!")
        }
        options = { ...options, parameters: [...options.parameters, parameterOption] }
      })
      generateFileOptions = { ...generateFileOptions, "class": [...generateFileOptions['class'] || [], options] }
    })

    resolve(generateFileOptions)
  })
  return promises;

}


const isDataType = (type) => {
  if (type == null) return null
  let myDataType = type.trim().replace("?", "")
  if (myDataType.startsWith("$")) {
    myDataType = myDataType.replace("$", "")
  }
  let dataTypes = ["int", "String", "double", "num", "bool", "dynamic"]
  if (dataTypes.filter((dataType) => dataType == myDataType).length > 0) return { inbuilt: true, dataType: type }
  if (myDataType.startsWith("List")) {
    myDataType = myDataType.replace("List", "").replace("<", "").replace(">", "").replace("$", "")
    if (dataTypes.filter((dataType) => dataType == myDataType).length > 0) return { inbuilt: true, dataType: type }
    return { inbuilt: false, dataType: `List<${myDataType}>`, className: myDataType }
  } else if (myDataType.startsWith("Map")) {
    myDataType = myDataType.replace("Map", "").replace("<", "").replace(">", "").replace("$", "")
    let data = myDataType.split(",")
    if (data.length == 2) {
      let myDataType = data[1]
      if (dataTypes.filter((dataType) => dataType == myDataType).length > 0) return { inbuilt: true, dataType: type }
      // myDataType = getClassName(myDataType)
      return { inbuilt: false, dataType: `Map<${data[0]},${myDataType}>`, className: myDataType }
    }
    return null
  }
  // type = getClassName(type)
  return { inbuilt: false, dataType: type, className: type }
}
// const getClassName = (str)=>{
//   if(str === null) return
//   let classNames =  str.split(".")
//   if(classNames.length == 2) return classNames[1]
//   return null
// }
