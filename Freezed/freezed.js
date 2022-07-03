const fs = require("fs")
const path = require("path")
const generateClass = require("./class/generateClass")


function generateFile(object) {
    if (object == null) 
        return null
    
    let folders;
    console.log( object.filename);
    let filename = object.filename.match(/(\w+.g.dart)/g)
    console.log(filename);
    if (filename != null && filename.length > 0) {
        folders = object.filename.replace(filename[0], "")
        console.log(folders);
        if (folders != null && folders != "") {
        let folderpath = folders.match(/((..\/|\/)\w+)*/g)
        if (folderpath != null && folderpath.length > 0) {
            console.log(folderpath[0]);
            fs.mkdirSync(path.join(__dirname, folderpath[0]), {recursive: true})
        }
    }
    }
    
    fs.writeFileSync(path.join(__dirname, object.filename), generateClass(object))
}


module.exports = generateFile
