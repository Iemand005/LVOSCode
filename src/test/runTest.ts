import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		await runTests({
			version: '1.34.0',
			extensionDevelopmentPath: path.resolve(__dirname, '..', '..'),
			extensionTestsPath: path.resolve(__dirname, 'suite', 'index'),
			launchArgs: []
		});
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exitCode = 1;
	}
}

main();