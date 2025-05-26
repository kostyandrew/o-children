import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { fork } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Dynamically import get-port
let getPort;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // Assuming tests is one level down from root
const serverScriptPath = path.join(projectRoot, 'src', 'internal', 'server.mjs');
const tempConfigPath = path.join(projectRoot, 'o.config.mjs');

describe('POST Request Tests (CLI Mode)', () => {
  let serverProcess;
  let serverPort;
  let serverAddress;

  beforeAll(async () => {
    // Dynamically import get-port as it's an ES module
    const getPortModule = await import('get-port');
    getPort = getPortModule.default; // Or getPortModule.getPort if that's how it's exported

    serverPort = await getPort();
    serverAddress = `http://localhost:${serverPort}`;

    const tempConfigContent = `
// Temporary o.config.mjs for testing
import defineConfig from './src/framework/defineConfig.mjs';

export default defineConfig({
  app: {
    dir: 'tests/sample_handlers' // Point to the sample handlers for these tests
  },
  server: {
    port: ${serverPort},
    host: 'localhost' // Explicitly set host
  }
});
    `;
    await fs.writeFile(tempConfigPath, tempConfigContent);

    serverProcess = fork(serverScriptPath, [], {
      cwd: projectRoot, // Ensure CWD is project root so o.config.mjs and paths in it are correct
      silent: true // Capture stdout/stderr
    });

    await new Promise((resolve, reject) => {
      serverProcess.stdout.on('data', (data) => {
        console.log(`[Test Server STDOUT]: ${data}`);
        if (data.toString().includes(`Server started on localhost:${serverPort}`)) {
          resolve();
        }
      });
      serverProcess.stderr.on('data', (data) => {
        console.error(`[Test Server STDERR]: ${data}`);
        // Potentially reject on specific startup errors if they appear on stderr
      });
      serverProcess.on('error', (err) => {
        console.error('[Test Server Error Event]:', err);
        reject(err);
      });
      serverProcess.on('exit', (code) => {
        // Only reject if server exits prematurely and with an error code
        if (code !== 0 && code !== null) { // exit(null) can happen if killed successfully
          // console.error(`[Test Server Exited Early]: code ${code}`);
          // reject(new Error(`Server exited prematurely with code ${code}`));
        }
      });

      // Timeout to prevent tests hanging indefinitely if server doesn't start
      setTimeout(() => {
        reject(new Error('Server start timed out for POST tests'));
      }, 15000); // 15 seconds timeout
    });
  }, 20000); // Increase beforeAll timeout for server start

  afterAll(async () => {
    if (serverProcess) {
      await new Promise((resolve) => {
        serverProcess.on('exit', resolve);
        serverProcess.kill('SIGINT'); // Send SIGINT for graceful shutdown
      });
    }
    try {
      await fs.unlink(tempConfigPath); // Clean up temp config
    } catch (err) {
      // Log if cleanup fails but don't fail test
      console.warn(`Failed to delete temp config: ${tempConfigPath}`, err.message);
    }
  });

  it('should respond with 200 OK and echo data for POST /postHandler', async () => {
    const postData = { echo: 'hello world' };
    const response = await request(serverAddress)
      .post('/postHandler') // Path based on filename in sample_handlers
      .send(postData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ received_echo: 'hello world' });
  });

  it('should respond with 400 Bad Request if echo field is missing for POST /postHandler', async () => {
    const postData = { message: 'nothing to echo' };
    const response = await request(serverAddress)
      .post('/postHandler')
      .send(postData)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing echo field in POST body' });
  });

  it('should respond with 404 for a non-existent POST route', async () => {
    const response = await request(serverAddress)
      .post('/nonexistentroute_post')
      .send({ data: 'test' });
    expect(response.status).toBe(404);
  });
});
