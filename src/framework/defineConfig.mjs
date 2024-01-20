/**
 * @typedef {Object} Config
 * @property {ServerConfig?} server - Server configuration
 * @property {AppConfig?} app - Application configuration
 */

/**
 * @typedef {Object} AppConfig
 * @property {string?} dir - Application directory, default is 'app'
 */

/**
 * @typedef {Object} ServerConfig
 * @property {number?} port - Port to listen on
 * @property {string?} host - Host to listen on
 */

/**
 * @param {Config} config
 * @returns {Config}
 */
const defineConfig = (config) => {
	return config;
};

export default defineConfig;
