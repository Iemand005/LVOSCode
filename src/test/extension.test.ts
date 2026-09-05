import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('lvos.open activates and runs without throwing', async () => {
		// Executing a contributed command triggers real activation: the extension
		// host loads dist/extension.js and runs createWebviewPanel.
		await vscode.commands.executeCommand('lvos.open');

		// On builds without the webview API the extension must fall back to the
		// vscode.previewHtml tier, which writes the same HTML to a temp file.
		const windowApi = vscode.window as any;
		if (typeof windowApi.createWebviewPanel !== 'function') {
			const htmlPath = path.join(os.tmpdir(), 'lvos-preview.html');
			assert.ok(fs.existsSync(htmlPath), 'preview html file should be written when webview API is absent');
			assert.ok(
				fs.readFileSync(htmlPath, 'utf8').indexOf('https://iemand005.github.io/LVOS') !== -1,
				'preview html should contain the LVOS page iframe');
		}
	});
});