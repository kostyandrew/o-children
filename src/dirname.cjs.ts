import { ModuleSystem } from '#internal/detectTypeSystem';

const getDirname = (moduleSystem?: ModuleSystem) => {
	if (moduleSystem === 'module') {
		return __dirname.replace('dist/cjs', 'dist/esm');
	}
	return __dirname;
};

export const fileExt = 'cjs' as string;
export const fileExtRegexp = new RegExp(`\\.(${fileExt}|js)$`);

export default getDirname;
