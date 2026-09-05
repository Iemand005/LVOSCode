import * as fs from 'fs';
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

const repoRoot = path.resolve(__dirname, '..', '..');

// VS Code 1.23.1 predates the @vscode/test-electron download cache, so run the
// tests against a local copy instead. Override the location with:
//   $env:VSCODE_1_23_EXE="path\to\Code.exe"
const defaultExe = 'C:\\Users\\Lasse\\Downloads\\VSCode-win32-x64-1.23.1\\Code.exe';

async function main() {
	const vscodeExecutablePath = process.env.VSCODE_1_23_EXE ?? defaultExe;

	if (!fs.existsSync(vscodeExecutablePath)) {
		throw new Error(
			`VS Code 1.23.1 executable not found at "${vscodeExecutablePath}".\n` +
			'Set the VSCODE_1_23_EXE environment variable to the path of the Code.exe to test against.');
	}

	try {
		await runTests({
			vscodeExecutablePath,
			extensionDevelopmentPath: repoRoot,
			extensionTestsPath: path.resolve(__dirname, 'suite', 'index'),
			launchArgs: [
				// Isolated profile so the test run never touches the user's real settings/extensions.
				`--user-data-dir=${path.join(repoRoot, '.vscode-test', 'user-data-1.23.1')}`,
				`--extensions-dir=${path.join(repoRoot, '.vscode-test', 'extensions-1.23.1')}`
			]
		});
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exitCode = 1;
	}
}

main();