import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const distDirectory = path.resolve(process.cwd(), 'dist');
const assetsDirectory = path.join(distDirectory, 'assets');
const deploymentEnvironment = process.env.VITE_DEPLOYMENT_ENV || 'demo';
const demoAccessEnabled = process.env.VITE_PARENT_DEMO_ACCESS !== 'false';
const strictAuthBundle = (deploymentEnvironment === 'staging' || deploymentEnvironment === 'production') && !demoAccessEnabled;

const assetNames = await readdir(assetsDirectory);
const javascriptAssets = assetNames.filter((name) => name.endsWith('.js'));
const files = [path.join(distDirectory, 'index.html'), ...javascriptAssets.map((name) => path.join(assetsDirectory, name))];
const parentChunks = javascriptAssets.filter((name) => /^ParentDashboard-[A-Za-z0-9_-]+\.js$/.test(name));
const observabilityDashboardPath = path.join(distDirectory, 'admin_center', 'parent_zone_observability.html');

const forbiddenInEveryBundle = [
  { label: 'client Neon environment variable', pattern: 'VITE_NEON_DATABASE_URL' },
  { label: 'PostgreSQL connection string', pattern: 'postgresql://' },
];

const forbiddenInStrictAuthBundle = [
  { label: 'Dev God Mode UI', pattern: 'DEV GOD MODE' },
  { label: 'Dev God Mode test entrypoint', pattern: 'dev-god-mode-modal' },
  { label: 'Dev God Mode chunk', pattern: 'DevGodModeModal-' },
  { label: 'debug audio overlay chunk', pattern: 'AudioDebugOverlay-' },
  { label: 'performance overlay chunk', pattern: 'PerformanceOverlay-' },
  { label: 'game store debug entrypoint', pattern: '__gameStore' },
  { label: 'Parent Zone store debug entrypoint', pattern: '__parentZoneStore' },
];

const rules = strictAuthBundle
  ? [...forbiddenInEveryBundle, ...forbiddenInStrictAuthBundle]
  : forbiddenInEveryBundle;

const violations = [];
if (parentChunks.length !== 1) {
  violations.push(`Parent Zone lazy chunk count is ${parentChunks.length}; expected exactly 1`);
} else {
  const parentChunkPath = path.join(assetsDirectory, parentChunks[0]);
  const parentChunk = await readFile(parentChunkPath, 'utf8');
  if (!parentChunk.includes('Dữ liệu & quyền riêng tư')) violations.push('Parent Zone lazy chunk is missing its expected content marker');
  if (Buffer.byteLength(parentChunk, 'utf8') > 100 * 1024) violations.push(`Parent Zone lazy chunk exceeds 100 KiB: ${parentChunks[0]}`);

  const indexHtml = await readFile(path.join(distDirectory, 'index.html'), 'utf8');
  const entryName = indexHtml.match(/<script[^>]+src="\/assets\/(index-[A-Za-z0-9_-]+\.js)"/)?.[1];
  if (!entryName) violations.push('Unable to identify the application entry chunk');
  else {
    const entry = await readFile(path.join(assetsDirectory, entryName), 'utf8');
    if (entry.includes('Dữ liệu & quyền riêng tư')) violations.push(`Parent Zone content leaked back into entry chunk: ${entryName}`);
  }
}
for (const file of files) {
  const content = await readFile(file, 'utf8');
  for (const rule of rules) {
    if (content.includes(rule.pattern)) violations.push(`${rule.label}: ${path.relative(distDirectory, file)}`);
  }
}

const observabilityDashboard = await readFile(observabilityDashboardPath, 'utf8');
for (const marker of [
  "'X-Admin-Secret': adminSecret",
  "credentials: 'omit'",
  "cache: 'no-store'",
  "secretInput.value = ''",
  'message.textContent',
  'Content-Security-Policy',
]) {
  if (!observabilityDashboard.includes(marker)) violations.push(`Admin observability dashboard is missing security marker: ${marker}`);
}
for (const forbidden of ['localStorage.setItem', 'sessionStorage.setItem', '.innerHTML', 'document.write', '?secret=', '?adminSecret=']) {
  if (observabilityDashboard.includes(forbidden)) violations.push(`Admin observability dashboard contains forbidden pattern: ${forbidden}`);
}

if (violations.length > 0) {
  throw new Error(`Parent Zone production-safety check failed:\n- ${violations.join('\n- ')}`);
}

console.log(`Parent Zone production-safety check passed (${strictAuthBundle ? 'strict auth bundle' : 'review/demo bundle'}).`);
