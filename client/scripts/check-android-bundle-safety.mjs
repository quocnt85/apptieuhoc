import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path, { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { unzipSync } from 'fflate';

const maxBundleBytes = 500 * 1024 * 1024;
const maxExpandedBytes = 750 * 1024 * 1024;
const allowedGeneratedExtras = new Set(['cordova.js', 'cordova_plugins.js']);

const forbidden = [
  ['Postgres connection URL', /postgres(?:ql)?:\/\//i],
  ['Neon database environment key', /NEON_DATABASE_URL/i],
  ['OTP pepper', /OTP_PEPPER/i],
  ['Admin API token', /ADMIN_API_TOKEN/i],
  ['RevenueCat webhook secret', /REVENUECAT_WEBHOOK_SECRET/i],
  ['Private key', /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/i],
];

const allowedReviewMarkers = [
  ['demo password 1234', /["']1234["']/],
  ['demo password 123456', /["']123456["']/],
  ['staging API', /novastars-api-staging/i],
];

const collectDistFiles = (root, current = root, files = new Map()) => {
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    const absolutePath = path.join(current, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Android artifact verifier refuses symbolic links: ${absolutePath}`);
    if (entry.isDirectory()) {
      collectDistFiles(root, absolutePath, files);
      continue;
    }
    if (!entry.isFile()) continue;
    files.set(path.relative(root, absolutePath).split(path.sep).join('/'), readFileSync(absolutePath));
  }
  return files;
};

export const auditAndroidArtifact = ({ artifactPath, distPath = 'dist' }) => {
  const resolvedArtifactPath = resolve(artifactPath);
  const resolvedDistPath = resolve(distPath);
  if (!existsSync(resolvedArtifactPath)) throw new Error(`Android artifact not found: ${resolvedArtifactPath}`);
  if (!existsSync(resolvedDistPath)) throw new Error(`Web dist not found: ${resolvedDistPath}`);

  const bundleBytes = statSync(resolvedArtifactPath).size;
  if (bundleBytes <= 0 || bundleBytes > maxBundleBytes) {
    throw new Error(`Android artifact size is outside the safety boundary: ${bundleBytes} bytes`);
  }

  const archive = unzipSync(new Uint8Array(readFileSync(resolvedArtifactPath)));
  const archiveEntries = Object.entries(archive);
  const assetPrefix = archiveEntries.some(([entryName]) => entryName.startsWith('base/assets/public/'))
    ? 'base/assets/public/'
    : 'assets/public/';
  const distFiles = collectDistFiles(resolvedDistPath);
  const packagedAssets = new Map(
    archiveEntries
      .filter(([entryName]) => entryName.startsWith(assetPrefix) && !entryName.endsWith('/'))
      .map(([entryName, bytes]) => [entryName.slice(assetPrefix.length), bytes]),
  );

  let expandedBytes = 0;
  const violations = [];
  const reviewMarkerFiles = new Map(allowedReviewMarkers.map(([label]) => [label, new Set()]));

  for (const [entryName, bytes] of archiveEntries) {
    expandedBytes += bytes.byteLength;
    if (expandedBytes > maxExpandedBytes) {
      throw new Error(`Expanded Android artifact exceeds ${maxExpandedBytes} bytes`);
    }
    if (entryName.toLowerCase().endsWith('.map')) violations.push(`Source map: ${entryName}`);

    const text = Buffer.from(bytes).toString('latin1');
    for (const [label, pattern] of forbidden) {
      if (pattern.test(text)) violations.push(`${label}: ${entryName}`);
    }
    for (const [label, pattern] of allowedReviewMarkers) {
      if (pattern.test(text)) reviewMarkerFiles.get(label).add(entryName);
    }
  }

  for (const [relativePath, distBytes] of distFiles) {
    const packagedBytes = packagedAssets.get(relativePath);
    if (!packagedBytes) {
      violations.push(`Missing web asset: ${relativePath}`);
    } else if (!Buffer.from(packagedBytes).equals(distBytes)) {
      violations.push(`Stale web asset: ${relativePath}`);
    }
  }
  for (const relativePath of packagedAssets.keys()) {
    if (!distFiles.has(relativePath) && !allowedGeneratedExtras.has(relativePath)) {
      violations.push(`Unexpected web asset: ${relativePath}`);
    }
  }

  if (violations.length > 0) {
    throw new Error(
      `Android artifact safety check failed:\n${violations.map((item) => `- ${item}`).join('\n')}`,
    );
  }

  const markers = [...reviewMarkerFiles.entries()]
    .filter(([, files]) => files.size > 0)
    .map(([label, files]) => `${label} (${files.size} file${files.size === 1 ? '' : 's'})`);

  return {
    entries: archiveEntries.length,
    expandedBytes,
    distFiles: distFiles.size,
    generatedExtras: [...packagedAssets.keys()].filter((file) => allowedGeneratedExtras.has(file)),
    markers,
  };
};

const isDirectRun = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isDirectRun) {
  const artifactPath = process.argv[2] ?? 'android/app/build/outputs/bundle/release/app-release.aab';
  const distPath = process.argv[3] ?? 'dist';
  const result = auditAndroidArtifact({ artifactPath, distPath });
  console.log(
    `Android artifact safety check passed (${result.entries} entries; ${result.expandedBytes} expanded bytes; ` +
      `${result.distFiles} web assets byte-identical; ${result.generatedExtras.length} generated Cordova shims; ` +
      `no secrets/source maps${result.markers.length > 0 ? `; allowed review markers: ${result.markers.join(', ')}` : ''}).`,
  );
}
