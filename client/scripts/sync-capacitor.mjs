import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { verifyCapacitorAssets } from './check-capacitor-assets.mjs';

const root = process.cwd();
const capacitorCli = path.join(root, 'node_modules', '@capacitor', 'cli', 'bin', 'capacitor');
const result = spawnSync(process.execPath, [capacitorCli, 'sync', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Capacitor CLI emits Windows separators in SwiftPM local package paths when
// sync runs on Windows. Swift paths are POSIX on the Mac that compiles iOS, so
// normalize this generated file after every cross-platform sync.
const requestedPlatforms = process.argv.slice(2).filter((value) => value === 'android' || value === 'ios');
const swiftPackagePath = path.join(root, 'ios', 'App', 'CapApp-SPM', 'Package.swift');
try {
  const generated = await readFile(swiftPackagePath, 'utf8');
  const normalized = generated.replaceAll('\\', '/');
  if (normalized !== generated) await writeFile(swiftPackagePath, normalized, 'utf8');
  if (/\.package\([^\n]*path:\s*"[^"]*\\/.test(normalized)) {
    throw new Error('Capacitor SwiftPM package still contains Windows path separators.');
  }
} catch (error) {
  if (!(requestedPlatforms.includes('android') && error?.code === 'ENOENT')) throw error;
}

const summaries = await verifyCapacitorAssets({ root, platforms: requestedPlatforms });
console.log(
  `Capacitor asset parity check passed (${summaries
    .map(({ platform, files, generatedExtras }) =>
      `${platform}: ${files} dist files + ${generatedExtras.length} generated Cordova shims`,
    )
    .join('; ')}).`,
);
