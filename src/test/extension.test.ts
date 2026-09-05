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
		// vscode.previewHtml tier, which previews the extension's own HTML file.
		const windowApi = vscode.window as any;
		if (typeof windowApi.createWebviewPanel !== 'function') {
			// out/test/suite -> repo root — the shipped preview asset lives there.
			const previewPath = path.resolve(__dirname, '..', '..', '..', 'preview', 'lvos-preview.html');
			assert.ok(fs.existsSync(previewPath), 'extension preview file should exist');
			assert.ok(
				fs.readFileSync(previewPath, 'utf8').indexOf('https://iemand005.github.io/LVOS') !== -1,
				'preview html should contain the LVOS page iframe');
			assert.ok(
				!fs.existsSync(path.join(os.tmpdir(), 'lvos-preview.html')),
				'preview html must be shipped with the extension, not written to the temp dir');
		}
	});
});