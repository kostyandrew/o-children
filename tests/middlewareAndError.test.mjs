import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { fork } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

let getPort;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const serverScriptPath = path.join(projectRoot, 'src', 'internal', 'server.mjs');
const tempConfigPath = path.join(projectRoot, 'o.config.mjs');

describe('Middleware Metadata and Error Handling Tests (CLI Mode)', () => {
  let serverProcess;
  let serverPort;
  let serverAddress;

  beforeAll(async () => {
    const getPortModule = await import('get-port');
    getPort = getPortModule.default;

    serverPort = await getPort();
    serverAddress = `http://localhost:${serverPort}`;

    const tempConfigContent = `
// Temporary o.config.mjs for testing
import defineConfig from './src/framework/defineConfig.mjs';

export default defineConfig({
  app: {
    dir: 'tests/sample_handlers' // Point to sample handlers for these tests
  },
  server: {
    port: ${serverPort},
    host: 'localhost'
  }
});
    `;
    await fs.writeFile(tempConfigPath, tempConfigContent);

    serverProcess = fork(serverScriptPath, [], {
      cwd: projectRoot, // Ensure CWD is project root
      silent: true // Capture stdout/stderr
    });

    await new Promise((resolve, reject) => {
      serverProcess.stdout.on('data', (data) => {
        console.log(`[Test Server STDOUT]: ${data}`); // Log server output for debugging
        if (data.toString().includes(`Server started on localhost:${serverPort}`)) {
          resolve();
        }
      });
      serverProcess.stderr.on('data', (data) => {
        console.error(`[Test Server STDERR]: ${data}`); // Log server errors
      });
      serverProcess.on('error', (err) => {
        console.error('[Test Server Error Event]:', err);
        reject(err);
      });
      serverProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) { // exit(null) can happen if killed successfully
          // console.error(`[Test Server Exited Early]: code ${code}`);
          // Only reject if server exits prematurely and with an error code before resolving
          // reject(new Error(`Server exited prematurely with code ${code}`));
        }
      });
      setTimeout(() => {
        reject(new Error('Server start timed out for middleware/error tests'));
      }, 15000); // 15 seconds timeout
    });
  }, 20000); // Increase beforeAll timeout

  afterAll(async () => {
    if (serverProcess) {
      await new Promise(resolve => {
        serverProcess.on('exit', resolve);
        serverProcess.kill('SIGINT'); // Graceful shutdown
      });
    }
    try {
      await fs.unlink(tempConfigPath); // Clean up
    } catch (err) {
      console.warn(`Failed to delete temp config: ${tempConfigPath}`, err.message);
    }
  });

  it('should make metadata from _middleware.mjs available in /middlewareAndErrorTester', async () => {
    const response = await request(serverAddress).get('/middlewareAndErrorTester');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Middleware and metadata test');
    expect(response.body.retrievedMetadata).toBeDefined();
    expect(response.body.retrievedMetadata.customMetadata).toBe('Hello from Middleware');
    expect(typeof response.body.retrievedMetadata.middlewareTimestamp).toBe('number');
  });
  
  it('should also ensure _middleware does not break other handlers like /getHandler', async () => {
    // This test verifies that middleware applied to the directory doesn't negatively impact
    // other handlers that might not use the metadata.
    const responseGet = await request(serverAddress).get('/getHandler');
    expect(responseGet.status).toBe(200); 
    expect(responseGet.body.message).toBe('GET request successful'); 
    // The 'X-Custom-Middleware-Header' is no longer set by the modified _middleware.mjs,
    // as it now returns an object for req.meta instead of setting headers directly.
    // So, we don't check for that header here.
  });

  it('should handle errors thrown in a handler and return 500 for /middlewareAndErrorTester/error', async () => {
    const response = await request(serverAddress).get('/middlewareAndErrorTester/error');
    // The actual server.mjs imports handleWrap from makeRouter.mjs.
    // handleWrap includes a try-catch that sends a 500 status code for errors.
    expect(response.status).toBe(500); 
    // The response body for errors is not standardized by the framework yet,
    // so we primarily check the status code.
  });
});
