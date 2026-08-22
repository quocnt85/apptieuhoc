import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error The production verifier is intentionally a directly executable Node ESM script.
import { verifyCapacitorAssets } from '../scripts/check-capacitor-assets.mjs';

const roots: string[] = [];

const createFixture = async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'novastars-cap-assets-'));
  roots.push(root);
  const dist = path.join(root, 'dist');
  const android = path.join(root, 'android', 'app', 'src', 'main', 'assets', 'public');
  const ios = path.join(root, 'ios', 'App', 'App', 'public');
  for (const target of [dist, android, ios]) {
    await mkdir(path.join(target, 'assets'), { recursive: true });
    await writeFile(path.join(target, 'index.html'), '<main>Parent Zone</main>');
    await writeFile(path.join(target, 'assets', 'app.js'), 'console.log("review")');
  }
  for (const target of [android, ios]) {
    await writeFile(path.join(target, 'cordova.js'), 'generated');
    await writeFile(path.join(target, 'cordova_plugins.js'), 'generated');
  }
  return { root, android, ios };
};

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('Capacitor asset parity verifier', () => {
  it('accepts byte-identical Android and iOS assets plus generated Cordova shims', async () => {
    const { root } = await createFixture();
    await expect(verifyCapacitorAssets({ root })).resolves.toEqual([
      { platform: 'android', files: 2, generatedExtras: ['cordova.js', 'cordova_plugins.js'] },
      { platform: 'ios', files: 2, generatedExtras: ['cordova.js', 'cordova_plugins.js'] },
    ]);
  });

  it('rejects missing and changed native assets', async () => {
    const { root, android, ios } = await createFixture();
    await rm(path.join(android, 'assets', 'app.js'));
    await writeFile(path.join(ios, 'index.html'), '<main>stale</main>');
    await expect(verifyCapacitorAssets({ root })).rejects.toThrow('missing: assets/app.js');
    await expect(verifyCapacitorAssets({ root, platforms: ['ios'] })).rejects.toThrow(
      'changed: index.html',
    );
  });

  it('rejects unexpected generated files and unknown platform names', async () => {
    const { root, android } = await createFixture();
    await writeFile(path.join(android, 'unexpected.js'), 'not allowlisted');
    await expect(verifyCapacitorAssets({ root, platforms: ['android'] })).rejects.toThrow(
      'unexpected: unexpected.js',
    );
    await expect(verifyCapacitorAssets({ root, platforms: ['windows'] })).rejects.toThrow(
      'Unknown Capacitor platform',
    );
  });
});
