import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Compiler } from 'inkjs/full';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(clientDirectory, 'public', 'content', 'dialogue');

const dialogueEntries = [
  {
    id: 'fire.opening',
    source: path.join(clientDirectory, 'src', 'content', 'dialogue', 'fire-opening.ink'),
    outputFile: 'fire-opening.json',
    entryKnot: 'opening',
  },
];

const formatCompilerMessages = (messages = []) => messages.map(String).join('\n');

await mkdir(outputDirectory, { recursive: true });

const manifestEntries = [];
for (const entry of dialogueEntries) {
  const source = await readFile(entry.source, 'utf8');
  const compiler = new Compiler(source);
  let story;

  try {
    story = compiler.Compile();
  } catch (error) {
    const details = formatCompilerMessages(compiler.errors);
    throw new Error(
      `Không thể biên dịch ${path.relative(clientDirectory, entry.source)}${details ? `:\n${details}` : ''}`,
      { cause: error },
    );
  }

  if (compiler.errors.length > 0) {
    throw new Error(
      `Ink có lỗi trong ${path.relative(clientDirectory, entry.source)}:\n${formatCompilerMessages(compiler.errors)}`,
    );
  }

  if (compiler.warnings.length > 0) {
    console.warn(
      `Ink có cảnh báo trong ${path.relative(clientDirectory, entry.source)}:\n${formatCompilerMessages(compiler.warnings)}`,
    );
  }

  const json = story.ToJson();
  const outputPath = path.join(outputDirectory, entry.outputFile);
  await writeFile(outputPath, `${json}\n`, 'utf8');

  manifestEntries.push({
    id: entry.id,
    file: `/content/dialogue/${entry.outputFile}`,
    entryKnot: entry.entryKnot,
    sourceHash: createHash('sha256').update(source).digest('hex'),
  });

  console.log(`Đã biên dịch ${entry.id} -> ${path.relative(clientDirectory, outputPath)}`);
}

const manifest = {
  schemaVersion: 1,
  dialogues: manifestEntries,
};

await writeFile(
  path.join(outputDirectory, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

console.log(`Đã cập nhật manifest (${manifestEntries.length} dialogue).`);
