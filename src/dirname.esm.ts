import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ModuleSystem } from '#internal/detectTypeSystem';

const getDirname = (moduleSystem?: ModuleSystem) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	if (moduleSystem === 'commonjs') {
		__dirname.replace('dist/esm', 'dist/cjs');
	}
	return __dirname;
};

export const fileExt = 'mjs' as string;

export const fileExtRegexp = new RegExp(`\\.(${fileExt}|js)$`);

export default getDirname;
