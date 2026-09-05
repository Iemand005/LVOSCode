import * as fs from 'fs';
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

const repoRoot = path.resolve(__dirname, '..', '..');

// Old builds predate the @vscode/test-electron download cache, so run the
// tests against a local copy instead. Override the location with:
//   $env:VSCODE_TEST_EXE="path\to\Code.exe"
const defaultExe = 'C:\\Users\\Lasse\\Downloads\\VSCode-win32-stable\\Code.exe';
const profileDir = 'user-data-1.0.0';
const extensionsDir = 'extensions-1.0.0';

async function main() {
	const vscodeExecutablePath = process.env.VSCODE_TEST_EXE ?? defaultExe;

	if (!fs.existsSync(vscodeExecutablePath)) {
		throw new Error(
			`VS Code executable not found at "${vscodeExecutablePath}".\n` +
			'Set the VSCODE_TEST_EXE environment variable to the path of the Code.exe to test against.');
	}

	try {
		await runTests({
			vscodeExecutablePath,
			extensionDevelopmentPath: repoRoot,
			extensionTestsPath: path.resolve(__dirname, 'suite', 'index'),
			launchArgs: [
				// VS Code 1.0.0's old Electron exits immediately on modern Windows
				// without --no-sandbox.
				'--no-sandbox',
				`--user-data-dir=${path.join(repoRoot, '.vscode-test', profileDir)}`,
				`--extensions-dir=${path.join(repoRoot, '.vscode-test', extensionsDir)}`
			]
		});
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exitCode = 1;
	}
}

main();