const fs = require("fs")
const path = require("path")
const generateClass = require("./class/generateClass")
const vscode = require('vscode');

function generateFile(object) {
    return new Promise((resolve, reject) => {
        if (object == null)
            return reject("Something Went Wrong Hear Please Check The Docs What you miss!.")

        let folders;

        let filename = object.filename.match(/(\w+.g.dart)/g)
   
        if (filename != null && filename.length > 0) {
            folders = object.filename.replace(filename[0], "")

            if (folders != null && folders != "") {
                fs.mkdirSync(path.join(vscode.window.activeTextEditor.document.uri.fsPath, `../${folders}`), { recursive: true })
            }
        }

       try {
        fs.writeFileSync(path.join(vscode.window.activeTextEditor.document.uri.fsPath, `../${object.filename}`), generateClass(object))
        resolve("Create File!")
       } catch (error) {
        reject("Something Goes Wrong!, Please Check the Docs or File Again what you miss.")
       }
    })

}


module.exports = generateFile
