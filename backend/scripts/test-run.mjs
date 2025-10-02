#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { rmSync } from 'node:fs';

const args = process.argv.slice(2);
const require = createRequire(import.meta.url);
const vitestBin = require.resolve('vitest/vitest.mjs');

const vitestResult = spawnSync(process.execPath, [vitestBin, 'run', ...args], {
  stdio: 'inherit'
});

if (vitestResult.status !== 0) {
  process.exit(vitestResult.status ?? 1);
}

try {
  rmSync('temp', { recursive: true, force: true });
} catch (error) {
  if (error?.code !== 'ENOENT') {
    console.error('[clean:temp] Failed to remove temp directory:', error);
    process.exit(1);
  }
}

process.exit(0);
