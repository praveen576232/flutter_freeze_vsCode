

/**
 * @param {String} editor - The string

 */
 module.exports = function getClassInfo(editor) {
  if (editor == null) return
  let promises = new Promise((resolve, rejects) => {
    let generateFileOptions = [{}]
   
    let allImports = editor.match(/^\s*(?:import)\s+(("|')(package:)?((\.*\/)|(\.*\w+\/))*\w+)(\.dart|\.g\.dart)\s*("|')(\s*;|(\s*as\s*(M\$\w+|\$\w+)\s*;))/gm)

    if(allImports !=null && allImports.length > 0){
      let onlyImports = allImports.filter((importStatement)=>{
        importStatement = importStatement.trimEnd()
        if( importStatement.endsWith('";') || importStatement.endsWith("';")){
          return importStatement;
  
        }
      }   )
       
     let customImports = allImports.filter((value)=>{
        let reg =/^\s*(?:import)\s+(("|')(package:)?((\.*\/)|(\.*\w+\/))*\w+)(\.dart|\.g\.dart)\s*("|')(\s*as\s*(M\$\w+|\$\w+)\s*;)/g
        let classImports =   value.match(reg)
        if(classImports!=null && classImports.length > 0) return classImports.flat()
      }) 
  
      console.log(onlyImports);
      console.log(customImports);
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
            parameterOption = {
              required: true,
              dataType: types[1],
              name:types[2]
            }
           }else if(types.length === 2){
            parameterOption = {
              required: false,
              dataType: types[1],
              name:types[2]
            }
           }else {
            rejects("Parameters are Wrong!")
           }
           options = {...options , parameters : [...options.parameters,parameterOption] }
        })
        generateFileOptions.push(options)
    })
     resolve(generateFileOptions)
  })
  return promises;

}
