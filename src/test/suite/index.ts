import * as path from 'path';
import Mocha = require('mocha');

// VS Code 1.0.0 invokes run(extensionTestsPath, callback) and only exits once
// the callback is called; newer versions await the returned Promise instead.
// Accept both contract styles so the same suite runs on every supported build.
export function run(extensionTestsPath?: string, done?: (error: any, failures?: number) => void): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const mocha = new Mocha({
			ui: 'tdd',
			color: true
		});

		mocha.addFile(path.resolve(__dirname, '..', 'extension.test.js'));

		mocha.run((failures: number) => {
			if (done) {
				done(failures > 0 ? new Error(`${failures} tests failed.`) : null, failures);
			}
			if (failures > 0) {
				reject(new Error(`${failures} tests failed.`));
			} else {
				resolve();
			}
		});
	});
}