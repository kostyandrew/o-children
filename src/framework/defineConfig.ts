export type AppConfig = {
	dir?: string; // Application directory, default is 'app'
};

export type ServerConfig = {
	port?: number; // Port to listen on
	host?: string; // Host to listen on
};

export type Config = {
	server?: ServerConfig; // Server configuration
	app?: AppConfig; // Application configuration
};
const defineConfig = (config: Config): Config => {
	return config;
};

export default defineConfig;
