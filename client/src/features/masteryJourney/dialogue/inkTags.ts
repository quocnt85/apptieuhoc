export type DialogueTagMap = Record<string, string>;

export const parseInkTags = (tags: readonly string[] | null | undefined): DialogueTagMap => {
  const parsed: DialogueTagMap = {};
  for (const rawTag of tags ?? []) {
    const separator = rawTag.indexOf(':');
    if (separator < 0) {
      parsed[rawTag.trim()] = 'true';
      continue;
    }

    const key = rawTag.slice(0, separator).trim();
    const value = rawTag.slice(separator + 1).trim();
    if (key) parsed[key] = value;
  }
  return parsed;
};

export interface EditableDialogueLine {
  lineId: string;
  text: string;
  speaker: string;
  emotion: string;
  sourceLine: number;
  tagStartLine: number;
}

const readTag = (line: string): [string, string] | null => {
  const match = line.match(/^\s*#\s*([^:]+):\s*(.*?)\s*$/);
  return match ? [match[1].trim(), match[2].trim()] : null;
};

export const parseEditableDialogueLines = (source: string): EditableDialogueLine[] => {
  const lines = source.split(/\r?\n/);
  const editable: EditableDialogueLine[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const firstTag = readTag(lines[index]);
    if (!firstTag || firstTag[0] !== 'line_id') continue;

    const tags: Record<string, string> = { line_id: firstTag[1] };
    const tagStartLine = index;
    let cursor = index + 1;
    while (cursor < lines.length) {
      const nextTag = readTag(lines[cursor]);
      if (!nextTag) break;
      tags[nextTag[0]] = nextTag[1];
      cursor += 1;
    }

    while (cursor < lines.length && !lines[cursor].trim()) cursor += 1;
    const text = lines[cursor]?.trim() ?? '';
    if (!text || text.startsWith('#') || text.startsWith('~') || text.startsWith('->')) continue;

    editable.push({
      lineId: tags.line_id,
      text,
      speaker: tags.speaker ?? 'narrator',
      emotion: tags.emotion ?? 'neutral',
      sourceLine: cursor,
      tagStartLine,
    });
    index = cursor;
  }

  return editable;
};

export const updateEditableDialogueLine = (
  source: string,
  lineId: string,
  changes: Partial<Pick<EditableDialogueLine, 'text' | 'speaker' | 'emotion'>>,
): string => {
  const lines = source.split(/\r?\n/);
  const entry = parseEditableDialogueLines(source).find((line) => line.lineId === lineId);
  if (!entry) return source;

  if (changes.text !== undefined) lines[entry.sourceLine] = changes.text.replace(/[\r\n]+/g, ' ').trim();

  const updateTag = (key: 'speaker' | 'emotion', value: string | undefined) => {
    if (value === undefined) return;
    for (let index = entry.tagStartLine; index < entry.sourceLine; index += 1) {
      const tag = readTag(lines[index]);
      if (tag?.[0] === key) {
        lines[index] = `# ${key}: ${value}`;
        return;
      }
    }
    lines.splice(entry.sourceLine, 0, `# ${key}: ${value}`);
  };

  updateTag('speaker', changes.speaker);
  updateTag('emotion', changes.emotion);
  return lines.join('\n');
};

export const extractInkVariableNames = (source: string): string[] =>
  [...source.matchAll(/^\s*VAR\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)].map((match) => match[1]);

