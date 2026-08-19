// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('lvos.open', () => {
        
        const panel = vscode.window.createWebviewPanel(
            'LVOSWebView',
            'LVOS',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        panel.webview.html = getWebviewContent();
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
	return /* HTML */`<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>LVOS</title>
		<style>
			html, body {
				display: flex;
			}
			html, body, iframe {
				width: 100%;
				height: 100%;
			}
		</style>
	</head>
	<body>
		<iframe src="https://iemand005.github.io/LVOS" frameborder="0"></iframe>
	</body>
	</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
