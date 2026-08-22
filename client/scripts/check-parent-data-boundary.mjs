import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(clientRoot, '..');
const migrationsRoot = join(repositoryRoot, 'server', 'migrations');
const migrationFiles = readdirSync(migrationsRoot).filter((name) => name.endsWith('.sql'));
const migrationSql = migrationFiles.map((name) => readFileSync(join(migrationsRoot, name), 'utf8')).join('\n').toLowerCase();
const parentApi = readFileSync(join(clientRoot, 'src', 'services', 'parentApi.ts'), 'utf8');

const forbiddenServerIdentifiers = [
  'child_name', 'profile_name', 'nickname', 'photo_data', 'photo_url', 'avatar',
  'grade', 'learning_progress', 'quiz_answer', 'mission_title', 'usage_minutes',
];
const forbiddenClientPayloadFields = [
  'name', 'nickname', 'grade', 'avatar', 'photoDataUrl', 'progress', 'answer',
  'missionTitle', 'usageMinutes',
];

const findings = [];
for (const identifier of forbiddenServerIdentifiers) {
  if (new RegExp(`\\b${identifier}\\b`, 'i').test(migrationSql)) findings.push(`server migration contains ${identifier}`);
}
for (const field of forbiddenClientPayloadFields) {
  if (new RegExp(`\\b${field}\\s*:`).test(parentApi)) findings.push(`parentApi sends local-only field ${field}`);
}

if (findings.length) {
  console.error('Parent data-boundary check failed:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}
console.log(`Parent data-boundary check passed (${migrationFiles.length} migrations; no child profile/progress/media payload fields).`);
