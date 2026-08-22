import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const PLATFORM_PATHS = Object.freeze({
  android: path.join('android', 'app', 'src', 'main', 'assets', 'public'),
  ios: path.join('ios', 'App', 'App', 'public'),
});

const ALLOWED_GENERATED_EXTRAS = new Set(['cordova.js', 'cordova_plugins.js']);

const hashFile = async (filePath) =>
  createHash('sha256').update(await readFile(filePath)).digest('hex');

const collectFiles = async (root, current = root, files = new Map()) => {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(current, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Capacitor asset verifier refuses symbolic links: ${absolutePath}`);
    }
    if (entry.isDirectory()) {
      await collectFiles(root, absolutePath, files);
      continue;
    }
    if (!entry.isFile()) continue;
    const relativePath = path.relative(root, absolutePath).split(path.sep).join('/');
    files.set(relativePath, await hashFile(absolutePath));
  }
  return files;
};

const normalizePlatforms = (platforms) => {
  const requested = platforms.length === 0 ? Object.keys(PLATFORM_PATHS) : platforms;
  const unique = [...new Set(requested)];
  const invalid = unique.filter((platform) => !(platform in PLATFORM_PATHS));
  if (invalid.length > 0) {
    throw new Error(`Unknown Capacitor platform: ${invalid.join(', ')}. Expected android and/or ios.`);
  }
  return unique;
};

export const verifyCapacitorAssets = async ({ root = process.cwd(), platforms = [] } = {}) => {
  const normalizedPlatforms = normalizePlatforms(platforms);
  const distRoot = path.join(root, 'dist');
  const distFiles = await collectFiles(distRoot);
  if (distFiles.size === 0) throw new Error('Capacitor asset verifier found an empty dist directory.');

  const summaries = [];
  for (const platform of normalizedPlatforms) {
    const nativeRoot = path.join(root, PLATFORM_PATHS[platform]);
    const nativeFiles = await collectFiles(nativeRoot);
    const missing = [...distFiles.keys()].filter((file) => !nativeFiles.has(file));
    const changed = [...distFiles.keys()].filter(
      (file) => nativeFiles.has(file) && nativeFiles.get(file) !== distFiles.get(file),
    );
    const unexpected = [...nativeFiles.keys()].filter(
      (file) => !distFiles.has(file) && !ALLOWED_GENERATED_EXTRAS.has(file),
    );

    if (missing.length > 0 || changed.length > 0 || unexpected.length > 0) {
      const details = [
        ...missing.map((file) => `missing: ${file}`),
        ...changed.map((file) => `changed: ${file}`),
        ...unexpected.map((file) => `unexpected: ${file}`),
      ];
      throw new Error(
        `Capacitor ${platform} assets do not match dist:\n${details.map((item) => `- ${item}`).join('\n')}`,
      );
    }

    const generatedExtras = [...nativeFiles.keys()].filter((file) => ALLOWED_GENERATED_EXTRAS.has(file));
    summaries.push({ platform, files: distFiles.size, generatedExtras });
  }

  return summaries;
};

const isDirectRun = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirectRun) {
  const summaries = await verifyCapacitorAssets({ platforms: process.argv.slice(2) });
  console.log(
    `Capacitor asset parity check passed (${summaries
      .map(({ platform, files, generatedExtras }) =>
        `${platform}: ${files} dist files + ${generatedExtras.length} generated Cordova shims`,
      )
      .join('; ')}).`,
  );
}
