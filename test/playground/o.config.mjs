import defineConfig from '../../src/framework/defineConfig.mjs';

export default defineConfig({
    server: {
        port: 8999
    },
    app: {
        dir: 'app'
    }
});
