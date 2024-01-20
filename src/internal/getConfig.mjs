import fs from 'fs/promises';
import defaultConfig from '#internal/defaultConfig.mjs';

import { merge } from 'lodash-es';

const configPath = `${process.cwd()}/o.config.mjs`;

/**
 * @typedef {import('#framework/defineConfig.mjs').Config} Config
 */

/**
 * @returns {Config}
 */

let config = null;
export default async function getConfig() {
	if (config !== null) return config;

	const configData = (await configExist()) ? (await import(configPath)).default : {};

	config = merge(defaultConfig, configData);
	return config;
}

async function configExist() {
	try {
		await fs.access(configPath);
		return true;
	} catch {
		return false;
	}
}
