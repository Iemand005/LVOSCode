import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('lvos.open', () => {
		openLVOS();
	});

	context.subscriptions.push(disposable);
}

function openLVOS() {
	const windowApi = vscode.window as any;
	if (typeof windowApi.createWebviewPanel === 'function') {
		openWebviewPanel();
	} else {
		openPreviewHtml();
	}
}

function openWebviewPanel() {
	const panel = (vscode.window as any).createWebviewPanel(
		'LVOSWebView',
		'LVOS',
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
	);

	panel.webview.html = getWebviewContent();
}

function openPreviewHtml() {
	const htmlPath = path.join(os.tmpdir(), 'lvos-preview.html');
	fs.writeFileSync(htmlPath, getWebviewContent(), 'utf8');

	vscode.commands.executeCommand(
		'vscode.previewHtml',
		vscode.Uri.file(htmlPath),
		vscode.ViewColumn.One
	).then(
		undefined,
		() => openExternal()
	);
}

function openExternal() {
	vscode.commands.executeCommand(
		'vscode.open',
		vscode.Uri.parse('https://iemand005.github.io/LVOS')
	).then(
		undefined,
		(err) => vscode.window.showErrorMessage(
			`LVOS: could not open LVOS (needs VS Code 1.0+). ${err.message || err}`)
	);
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

export function deactivate() {}