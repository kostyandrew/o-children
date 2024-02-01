#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const [_, __, moduleType] = process.argv;

const rootDirectory = `./dist/${moduleType}`;
const extensionMap = {
	module: { '.esm.js': '.mjs', '.js': '.mjs', '.esm.d.ts': '.d.ts' },
	commonjs: { '.cjs.js': '.cjs', '.js': '.cjs', '.cjs.d.ts': '.d.ts' },
};

const renameFiles = async (directory) => {
	try {
		const entries = await fs.readdir(directory, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				await renameFiles(fullPath);
			} else {
				const extMapping = extensionMap[moduleType];
				let newPath = fullPath;

				for (const [oldExt, newExt] of Object.entries(extMapping)) {
					if (fullPath.endsWith(oldExt)) {
						newPath = fullPath.replace(oldExt, newExt);
						break;
					}
				}

				if (newPath !== fullPath) {
					await fs.rename(fullPath, newPath);
				}
			}
		}
	} catch (err) {
		console.error('Could not process the directory.', err);
		process.exit(1);
	}
};

await renameFiles(rootDirectory);
