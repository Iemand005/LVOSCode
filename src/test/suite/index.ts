import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import Mocha = require('mocha');

const PROBE = path.join(os.tmpdir(), 'lvos-suite-probe.txt');
function poke(line: string): void {
	try {
		fs.appendFileSync(PROBE, line + '\n');
	} catch (e) {
		/* ignore */
	}
}
function fail(e: any): void {
	try {
		fs.appendFileSync(PROBE, 'FATAL: ' + (e && e.stack ? e.stack : String(e)) + '\n');
	} catch (e2) {
		/* ignore */
	}
}

// VS Code 1.0.0 invokes run(extensionTestsPath, callback) and only exits once
// the callback is called; newer versions await the returned Promise instead.
// Accept both contract styles so the same suite runs on every supported build.
export function run(extensionTestsPath?: string, done?: (error: any, failures?: number) => void): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		try {
			poke('run-start');
			const mocha = new Mocha({
				ui: 'tdd',
				color: true
			});
			poke('mocha-constructed');

			mocha.addFile(path.resolve(__dirname, '..', 'extension.test.js'));
			poke('file-added');

			mocha.run((failures: number) => {
				poke('mocha-done failures=' + failures);
				if (done) {
					done(failures > 0 ? new Error(`${failures} tests failed.`) : null, failures);
				}
				if (failures > 0) {
					reject(new Error(`${failures} tests failed.`));
				} else {
					resolve();
				}
			});
			poke('run-called-sync');
		} catch (e) {
			fail(e);
			if (done) {
				done(e);
			}
			reject(e);
		}
	});
}