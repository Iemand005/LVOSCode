import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('lvos.open', () => {
		openLVOS(context);
	});

	context.subscriptions.push(disposable);
}

function openLVOS(context: vscode.ExtensionContext) {
	const windowApi = vscode.window as any;
	if (typeof windowApi.createWebviewPanel === 'function') {
		openWebviewPanel(context);
	} else {
		openPreviewHtml(context);
	}
}

function previewHtmlPath(context: vscode.ExtensionContext): string {
	return path.join(context.extensionPath, 'preview', 'lvos-preview.html');
}

function openWebviewPanel(context: vscode.ExtensionContext) {
	const panel = (vscode.window as any).createWebviewPanel(
		'LVOSWebView',
		'LVOS',
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
	);

	panel.webview.html = fs.readFileSync(previewHtmlPath(context), 'utf8');
}

function openPreviewHtml(context: vscode.ExtensionContext) {
	vscode.commands.executeCommand(
		'vscode.previewHtml',
		vscode.Uri.file(previewHtmlPath(context)),
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

export function deactivate() {}