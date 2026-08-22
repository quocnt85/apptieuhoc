import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { strToU8, zipSync } from 'fflate';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error The production verifier is intentionally a directly executable Node ESM script.
import { auditAndroidArtifact } from '../scripts/check-android-bundle-safety.mjs';

const roots: string[] = [];

const fixture = async (entries: Record<string, Uint8Array>) => {
  const root = await mkdtemp(path.join(tmpdir(), 'novastars-android-artifact-'));
  roots.push(root);
  const distPath = path.join(root, 'dist');
  const artifactPath = path.join(root, 'app.aab');
  await mkdir(path.join(distPath, 'assets'), { recursive: true });
  await writeFile(path.join(distPath, 'index.html'), '<main>Parent Zone</main>');
  await writeFile(path.join(distPath, 'assets', 'app.js'), 'const passcodes=["1234","123456"]');
  await writeFile(artifactPath, Buffer.from(zipSync(entries)));
  return { artifactPath, distPath };
};

const validEntries = (): Record<string, Uint8Array> => ({
  'base/assets/public/index.html': strToU8('<main>Parent Zone</main>'),
  'base/assets/public/assets/app.js': strToU8('const passcodes=["1234","123456"]'),
  'base/assets/public/cordova.js': strToU8('generated'),
  'base/assets/public/cordova_plugins.js': strToU8('generated'),
});

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('Android artifact safety verifier', () => {
  it('accepts a secret-free artifact with byte-identical web assets', async () => {
    const paths = await fixture(validEntries());
    expect(auditAndroidArtifact(paths)).toMatchObject({
      distFiles: 2,
      generatedExtras: ['cordova.js', 'cordova_plugins.js'],
    });
  });

  it('rejects stale, missing and unexpected packaged web assets', async () => {
    const entries = validEntries();
    entries['base/assets/public/index.html'] = strToU8('<main>stale</main>');
    delete entries['base/assets/public/assets/app.js'];
    entries['base/assets/public/unexpected.js'] = strToU8('unexpected');
    const paths = await fixture(entries);
    expect(() => auditAndroidArtifact(paths)).toThrow(/Stale web asset: index\.html/);
    expect(() => auditAndroidArtifact(paths)).toThrow(/Missing web asset: assets\/app\.js/);
    expect(() => auditAndroidArtifact(paths)).toThrow(/Unexpected web asset: unexpected\.js/);
  });

  it('rejects forbidden secrets and source maps', async () => {
    const entries = validEntries();
    entries['base/secret.txt'] = strToU8('postgres://do-not-package');
    entries['base/assets/public/app.js.map'] = strToU8('{}');
    const paths = await fixture(entries);
    expect(() => auditAndroidArtifact(paths)).toThrow(/Postgres connection URL/);
    expect(() => auditAndroidArtifact(paths)).toThrow(/Source map/);
  });
});
