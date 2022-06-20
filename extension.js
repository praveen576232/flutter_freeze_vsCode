// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const generateFile = require('./Freezed/freezed');
const path = require("path")
const fs = require("fs")
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "flutter-freezed" is now active!');
	let disposable = vscode.commands.registerCommand('flutter-freezed.helloWorld', function () {
		var editor = vscode.window.activeTextEditor

		if (editor != null) {
			let imports = []
			let allParameters
			let isFlowerBracketsStarts = false
			let isRoundBracketsStarts = false
			let endOfTheParameterSearch = false;
			var foundClassName = false;
			let generateFileOptions = {
				imports: [],
				parameters: [],

			}
			var docs = editor.document
			let lineCount = docs.lineCount;
			for (let index = 0; index < lineCount; index++) {
				var line = docs.lineAt(index)
				if (!line.isEmptyOrWhitespace) {
					if (line.text.trimStart().startsWith("import") && (line.text.endsWith(".g.dart';") || line.text.endsWith('.g.dart";'))) {
						var filePath = line.text.replace("import", "").replace(";", "").replace("'", "").replace("'", "").replace("./", "").trim()
						const folders = filePath.split("/")
						let realPath;
						if (folders.length >= 2) {
							let localFilePath = '';
							for (let i = 0; i < folders.length; i++) {

								if (folders[i].endsWith(".dart")) {
									break
								}

								else {
									localFilePath += "/"+folders[i].trim()
									 realPath = path.join(vscode.window.activeTextEditor.document.uri.fsPath, `../${localFilePath}`)
									if (!fs.existsSync(realPath))
										fs.mkdirSync(realPath)
								}
							}
						}
						console.log(filePath);

						generateFileOptions = {
							...generateFileOptions,

							filePath: path.join(vscode.window.activeTextEditor.document.uri.fsPath, `../${filePath.trim()}`),
							

						}
					} else if (line.text.trimStart().startsWith("class")) {

						let className = line.text.replace("class", "").replace("{", "")
						className = className.trimStart().replace("$", "")

						generateFileOptions = {
							...generateFileOptions,
							className
						}
						console.log(generateFileOptions);

					} else if (line.text.trimStart().startsWith("const")) {
						let cons = line.text.trimStart().replace("const", "").trimStart()
						console.log("start const " + cons);
						console.log(generateFileOptions.className);
						if (generateFileOptions.className != null && cons.startsWith("$" + generateFileOptions.className.trim())) {
							let parameter = cons.replace("$" + generateFileOptions.className.trim(), "").trimStart()
							console.log("in calss " + parameter);
							foundClassName = true
							if (parameter.trimStart() != "" && parameter.startsWith("(")) {
								console.log("strt ( " + parameter);
								isRoundBracketsStarts = true
								parameter = parameter.replace("(", "").trimStart()
								if (parameter.startsWith("{")) {
									console.log("strt {} " + parameter);
									parameter = parameter.replace("{", "").trimStart().trimEnd()
									isRoundBracketsStarts = true
									console.log(parameter);

									if (parameter.endsWith("});")) {
										parameter = parameter.replace("});", "")
										console.log("ends ", parameter);
										allParameters = parameter
										endOfTheParameterSearch = true
									} else if (parameter.endsWith(")")) {
										parameter = parameter.replace(")", "")
										allParameters = parameter
										endOfTheParameterSearch = true
									}

								}
							}
						}
					} else if (line.text.trimStart().startsWith("import")) {
						generateFileOptions.imports.push(line.text)
					}
				}
			}



			//    generateFileOptions.imports = imports
			console.log(generateFileOptions);
			if(generateFileOptions.filePath ==null){
				generateFileOptions.filePath =  `../${vscode.window.activeTextEditor.document.fileName.replace(".dart",".g.dart")}`
			}
			allParameters = allParameters.replace(/ +(?= )/g, '');
			generateFileOptions.parameters = allParameters.split(",").map((parameter) => {
				parameter = parameter.trimStart().replace(/ +(?= )/g, '');
				const splitParameters = parameter.split(" ")
				if (splitParameters.length < 1) return null
				const isRequired = splitParameters[0].trim() == "required"
				return {
					required: isRequired,
					datatype: isRequired ? splitParameters[1] : splitParameters[0],
					name: isRequired ? splitParameters[2] : splitParameters[1]
				}
			})
			console.log(generateFileOptions);
			generateFile(generateFileOptions)
		} else {
			console.log("No Editor");
		}

		vscode.window.showInformationMessage('Hello World from flutter_freezed!');
	});

	context.subscriptions.push(disposable);
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}
function provideDocumentFormattingEdits(document, TextDocument) {
	throw new Error('Function not implemented.');
}

