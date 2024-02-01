import * as fs from 'fs';
import * as path from 'path';

export type ModuleSystem = 'module' | 'commonjs' | 'error';

export function detectModuleSystem(): ModuleSystem {
	const cwd = process.cwd();
	const packageJsonPath = path.join(cwd, 'package.json');
	const hasMjsConfig = fs.existsSync(path.join(cwd, 'o.config.mjs'));
	const hasCjsConfig = fs.existsSync(path.join(cwd, 'o.config.cjs'));
	const hasJsConfig = fs.existsSync(path.join(cwd, 'o.config.js'));

	let packageType: ModuleSystem | null = null;
	if (fs.existsSync(packageJsonPath)) {
		try {
			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
			if (packageJson.type === 'module' || packageJson.type === 'commonjs') {
				packageType = packageJson.type;
			} else if (packageJson.type != null) {
				console.error(
					"Error: The 'type' field in your package.json file needs to be specified as either 'module' for ES Modules or 'commonjs' for CommonJS modules. Alternatively, configure your project settings using a configuration file named either 'o.config.mjs' (for ES Modules) or 'o.config.cjs' (for CommonJS).",
				);
				return 'error';
			}
		} catch (error) {
			console.error('Error reading package.json:', error);
		}
	}

	if (packageType === 'module' && hasCjsConfig) {
		console.error(
			"Error: Your package.json file specifies 'module' in the 'type' field, indicating ES Module usage. However, an 'o.config.cjs' file is present. For consistency with ES Module configuration, please rename your configuration file to 'o.config.js' and ensure it uses ES Module syntax, or use 'o.config.mjs' for explicit ES Module configuration.",
		);
		return 'error';
	}
	if (packageType === 'commonjs' && hasMjsConfig) {
		console.error(
			"Error: The 'type' field in your package.json file is set to 'commonjs', indicating the use of CommonJS modules. However, an 'o.config.mjs' file has been found. To align with the CommonJS module configuration, please switch to using 'o.config.js' with CommonJS syntax or opt for 'o.config.cjs'",
		);
		return 'error';
	}

	if (hasMjsConfig && packageType !== 'commonjs') {
		return 'module';
	} else if (hasCjsConfig && packageType !== 'module') {
		return 'commonjs';
	} else if (hasJsConfig && !packageType) {
		console.error(
			'Error: o.config.js exists but no "type" field in package.json, we cannot determine module system. Please add "type" field to package.json or rename o.config.js to o.config.cjs or o.config.mjs',
		);
		return 'error';
	}

	return packageType ?? 'error';
}
