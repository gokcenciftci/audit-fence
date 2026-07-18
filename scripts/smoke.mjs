import { execSync } from 'node:child_process';

console.log('Running AuditFence CLI smoke checks...');

try {
  const output = execSync('node dist/cli.js --help', { encoding: 'utf-8' });
  if (!output.includes('AuditFence')) {
    throw new Error('Help output missing AuditFence banner');
  }

  const versionOutput = execSync('node dist/cli.js --version', { encoding: 'utf-8' });
  if (!versionOutput.includes('0.1.0')) {
    throw new Error('Version output incorrect');
  }

  console.log('CLI smoke checks passed successfully.');
} catch (error) {
  console.error('CLI smoke check failed:', error);
  process.exit(1);
}
