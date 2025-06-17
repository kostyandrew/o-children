import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import path from 'path';
import { spawn } from 'child_process';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const playground = path.join(repoRoot, 'test', 'playground');
let child;

function waitForOutput(proc, matcher) {
  return new Promise((resolve, reject) => {
    proc.stdout.on('data', (data) => {
      const text = data.toString();
      if (matcher(text)) {
        resolve();
      }
    });
    proc.on('error', reject);
  });
}

describe('o-children CLI', () => {
  beforeAll(async () => {
    child = spawn('node', [path.join(repoRoot, 'src/bin.mjs'), 'start'], { cwd: playground });
    await waitForOutput(child, (txt) => txt.includes('Server started'));
  }, 10000);

  afterAll(() => {
    child.kill();
  });

  it('serves index route', async () => {
    const res = await fetch('http://localhost:8999/products');
    const data = await res.json();
    expect(data).toEqual([{ id: 1 }]);
  });

  it('supports dynamic params', async () => {
    const res = await fetch('http://localhost:8999/products/42');
    const data = await res.json();
    expect(data).toEqual({ id: '42' });
  });

  it('applies middleware', async () => {
    const res = await fetch('http://localhost:8999/meta');
    const data = await res.json();
    expect(data).toEqual({ meta: true });
  });
});
