import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const srcRoot = fileURLToPath(new URL('../src/', import.meta.url));
const allowedToneModules = new Set([
  'services/audioSafety.ts',
  'services/toneAudioEngine.ts',
]);
const violations = [];

function visit(directory) {
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) {
      visit(absolute);
      continue;
    }
    if (!/\.tsx?$/.test(entry)) continue;

    const source = readFileSync(absolute, 'utf8');
    const name = relative(srcRoot, absolute).replaceAll('\\', '/');
    if (/from\s+['"]tone['"]|import\s*\(['"]tone['"]\)/.test(source) && !allowedToneModules.has(name)) {
      violations.push(`${name}: Tone.js must only be used through the central audio service`);
    }
    if (name === 'services/toneAudioEngine.ts' && /\.to(?:Destination|Master)\s*\(|Tone\.(?:Destination|getDestination)|(?:rawContext|context)\.destination/.test(source)) {
      violations.push(`${name}: audio sources must use routeBgm() or routeSfx()`);
    }
  }
}

visit(srcRoot);

const engine = readFileSync(new URL('../src/services/toneAudioEngine.ts', import.meta.url), 'utf8');
for (const requiredRoute of ['routeBgm(', 'routeSfx(']) {
  if (!engine.includes(requiredRoute)) violations.push(`services/toneAudioEngine.ts: missing mandatory ${requiredRoute} routing`);
}

if (violations.length) {
  console.error(`Audio safety check failed:\n- ${violations.join('\n- ')}`);
  process.exit(1);
}

console.log('Audio safety routing check passed.');
