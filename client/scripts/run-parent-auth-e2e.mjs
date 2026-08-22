import { spawn } from 'node:child_process';
import path from 'node:path';

const cli = path.resolve('node_modules', '@playwright', 'test', 'cli.js');
const child = spawn(process.execPath, [cli, 'test', 'parent-auth-reset.spec.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PARENT_AUTH_E2E: 'true' },
});

child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
