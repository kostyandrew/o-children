import fs from 'fs/promises';

import defaultConfig, { DefaultConfig } from '#internal/defaultConfig';
import { Config } from '#framework/defineConfig';

const configPath = `${process.cwd()}/o.config`;

type ProcessedConfig = DefaultConfig & Config;

let config: ProcessedConfig | null = null;
export default async function getConfig(): Promise<ProcessedConfig> {
	if (config !== null) return config;

	const configFile = await findConfigFile();
	const configData = (configFile ? (await import(configFile)).default : {}) as Config;
	const merge = (await import('lodash')).default.merge;
	config = merge(defaultConfig, configData);
	return config;
}

async function findConfigFile() {
	const extensions = ['js', 'mjs', 'cjs'];
	for (const ext of extensions) {
		const fullPath = `${configPath}.${ext}`;
		if (await fileExists(fullPath)) {
			return fullPath;
		}
	}
	return null;
}

async function fileExists(filePath: string) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}
