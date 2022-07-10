// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const classInfo = require("./Freezed/class/getClassInfo")
const generateFile = require("./Freezed/freezed")

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('flutter-freezed.flutterFreeze', function () {
		var editor = vscode.window.activeTextEditor

		if (editor != null) {

			classInfo(editor.document.getText())
				.then((res) => {
					generateFile(res).catch((err) => {
						vscode.window.showErrorMessage(err)
					})
				}).catch((err) => {
					vscode.window.showErrorMessage(err)
				})



		} else {
			vscode.window.showErrorMessage('No Editor Found, Please Open a .dart File');
		}


	});

	context.subscriptions.push(disposable);
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}

