const fs = require("fs")
const path = require("path")
const generateClass = require("./class/generateClass") 
function removeQuestion(str){
    if(str.endsWith("?")){
        return str.substring(0,str.length-1)
    }
    return str;
}
  
function generateFile(object) {
    if (object == null) return null
    fs.writeFileSync(path.join(__dirname,"t.dart"),generateClass(object))
}


module.exports = generateFile