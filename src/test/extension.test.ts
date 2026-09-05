import * as assert from 'assert';

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
		assert.ok(true);
	});
});
