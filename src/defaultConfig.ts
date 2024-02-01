import { Config } from '#framework/defineConfig';

const config = {
	app: {
		dir: 'app',
	},
	server: {
		port: 3000,
	},
} as const;
export default config satisfies Config;

export type DefaultConfig = typeof config;
