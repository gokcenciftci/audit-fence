import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Scanner } from '../src/scanner.js';
import { createTempFixture } from './helpers.js';

describe('AuditFence Scanner Engine', () => {
  const tmpDir = path.join(process.cwd(), 'test-tmp');

  beforeAll(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('scans a directory and returns detected heuristic issues', async () => {
    createTempFixture(
      tmpDir,
      'vulnerable.ts',
      `
      debugger;
      eval('alert(1)');
      `
    );

    const scanner = new Scanner({ paths: [tmpDir], provider: 'heuristic' });
    const issues = await scanner.scan();

    expect(issues.length).toBeGreaterThan(0);
  });

  it('supports mock test provider', async () => {
    createTempFixture(tmpDir, 'mock.ts', 'INSECURE_MOCK_TRIGGER');

    const scanner = new Scanner({ paths: [tmpDir], provider: 'mock' });
    const issues = await scanner.scan();

    expect(issues).toHaveLength(1);
    expect(issues[0]?.ruleId).toBe('mock-test-rule');
  });

  it('falls back to heuristic if ollama endpoint is unavailable', async () => {
    createTempFixture(tmpDir, 'fallback.ts', 'debugger;');

    const scanner = new Scanner({
      paths: [tmpDir],
      provider: 'ollama',
      ollamaEndpoint: 'http://localhost:9999', // Invalid endpoint
    });
    const issues = await scanner.scan();

    expect(issues.length).toBeGreaterThan(0);
  });
});
