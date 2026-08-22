import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Compiler, Story } from 'inkjs/full';
import { describe, expect, it } from 'vitest';
import { DIALOGUE_CHARACTERS } from '../src/features/masteryJourney/dialogue/characterRegistry';
import {
  extractInkVariableNames,
  parseEditableDialogueLines,
  parseInkTags,
  updateEditableDialogueLine,
} from '../src/features/masteryJourney/dialogue/inkTags';

const clientDirectory = process.cwd();
const sourcePath = path.join(clientDirectory, 'src', 'content', 'dialogue', 'fire-opening.ink');
const compiledPath = path.join(clientDirectory, 'public', 'content', 'dialogue', 'fire-opening.json');
const manifestPath = path.join(clientDirectory, 'public', 'content', 'dialogue', 'manifest.json');
const source = readFileSync(sourcePath, 'utf8');

type BranchPath = {
  choices: [number, number];
  approach: 'observe' | 'teamwork';
  readinessStyle: 'solo' | 'together';
  branchLineIds: [string, string];
  choiceIds: [string, string];
};

const branchPaths: BranchPath[] = [
  {
    choices: [0, 0],
    approach: 'observe',
    readinessStyle: 'solo',
    branchLineIds: ['fire.opening.005a', 'fire.opening.008a'],
    choiceIds: ['fire.opening.choice.observe', 'fire.opening.choice.solo'],
  },
  {
    choices: [0, 1],
    approach: 'observe',
    readinessStyle: 'together',
    branchLineIds: ['fire.opening.005a', 'fire.opening.008b'],
    choiceIds: ['fire.opening.choice.observe', 'fire.opening.choice.together'],
  },
  {
    choices: [1, 0],
    approach: 'teamwork',
    readinessStyle: 'solo',
    branchLineIds: ['fire.opening.005b', 'fire.opening.008a'],
    choiceIds: ['fire.opening.choice.team', 'fire.opening.choice.solo'],
  },
  {
    choices: [1, 1],
    approach: 'teamwork',
    readinessStyle: 'together',
    branchLineIds: ['fire.opening.005b', 'fire.opening.008b'],
    choiceIds: ['fire.opening.choice.team', 'fire.opening.choice.together'],
  },
];

const compileSource = () => {
  const compiler = new Compiler(source);
  const story = compiler.Compile();
  expect(compiler.errors).toEqual([]);
  expect(compiler.warnings).toEqual([]);
  return story;
};

const playPath = ({ choices }: BranchPath) => {
  const story = compileSource();
  story.ChoosePathString('opening');

  const visitedTags: ReturnType<typeof parseInkTags>[] = [];
  const selectedChoiceTags: ReturnType<typeof parseInkTags>[] = [];
  const texts: string[] = [];
  const continueUntilChoiceOrEnd = () => {
    while (story.canContinue) {
      const text = story.Continue().trim();
      visitedTags.push(parseInkTags(story.currentTags));
      if (text) texts.push(text);
    }
  };

  for (const choiceIndex of choices) {
    continueUntilChoiceOrEnd();
    expect(story.currentChoices).toHaveLength(2);
    selectedChoiceTags.push(parseInkTags(story.currentChoices[choiceIndex].tags));
    story.ChooseChoiceIndex(choiceIndex);
  }
  continueUntilChoiceOrEnd();

  return { story, texts, visitedTags, selectedChoiceTags };
};

describe('fire planet Ink dialogue pipeline', () => {
  it('compiles without errors and emits a loadable runtime artifact', () => {
    const compiledStory = compileSource();

    expect(existsSync(compiledPath)).toBe(true);
    const runtimeStory = new Story(readFileSync(compiledPath, 'utf8'));
    runtimeStory.ChoosePathString('opening');
    expect(runtimeStory.canContinue).toBe(true);
    expect(runtimeStory.Continue()).toContain('Trạm Khói Mù');
    expect(JSON.parse(readFileSync(compiledPath, 'utf8'))).toEqual(JSON.parse(compiledStory.ToJson()));
  });

  it('publishes the entry knot and source hash in the manifest', () => {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      schemaVersion: number;
      dialogues: Array<{ id: string; file: string; entryKnot: string; sourceHash: string }>;
    };

    expect(manifest).toEqual({
      schemaVersion: 1,
      dialogues: [
        {
          id: 'fire.opening',
          file: '/content/dialogue/fire-opening.json',
          entryKnot: 'opening',
          sourceHash: createHash('sha256').update(source).digest('hex'),
        },
      ],
    });
  });

  it.each(branchPaths)(
    'plays branch $approach + $readinessStyle through OPEN_CHALLENGE',
    (branchPath) => {
      const { story, texts, visitedTags, selectedChoiceTags } = playPath(branchPath);
      const lineIds = visitedTags.flatMap((tags) => (tags.line_id ? [tags.line_id] : []));
      const choiceIds = selectedChoiceTags.flatMap((tags) =>
        tags.choice_id ? [tags.choice_id] : [],
      );

      expect(lineIds).toEqual(expect.arrayContaining(branchPath.branchLineIds));
      expect(choiceIds).toEqual(branchPath.choiceIds);
      expect(story.variablesState.$('approach')).toBe(branchPath.approach);
      expect(story.variablesState.$('readiness_style')).toBe(branchPath.readinessStyle);
      expect(visitedTags.at(-1)).toMatchObject({
        line_id: 'fire.opening.012',
        speaker: 'bao',
        command: 'OPEN_CHALLENGE',
      });
      expect(texts.at(-1)).toContain('chúng ta bắt đầu');
      expect(story.canContinue).toBe(false);
      expect(story.currentChoices).toHaveLength(0);
    },
  );

  it('keeps every authored line and choice ID stable and unique', () => {
    const lineIds = [...source.matchAll(/^\s*#\s*line_id:\s*(\S+)\s*$/gm)].map((match) => match[1]);
    const choiceIds = [...source.matchAll(/#\s*choice_id:\s*([^\]\s]+)/g)].map((match) => match[1]);

    expect(lineIds).toHaveLength(14);
    expect(new Set(lineIds).size).toBe(lineIds.length);
    expect(choiceIds).toEqual([
      'fire.opening.choice.observe',
      'fire.opening.choice.team',
      'fire.opening.choice.solo',
      'fire.opening.choice.together',
    ]);
    expect(new Set(choiceIds).size).toBe(choiceIds.length);
  });
});

describe('dialogue authoring contract', () => {
  it('places Bơ on the left and Bảo on the right without mirroring their artwork', () => {
    expect(DIALOGUE_CHARACTERS.bo).toMatchObject({
      displayName: 'Bơ',
      side: 'left',
      assetPath: '/assets/dialogue/characters/bo.webp',
    });
    expect(DIALOGUE_CHARACTERS.bao).toMatchObject({
      displayName: 'Bảo',
      side: 'right',
      assetPath: '/assets/dialogue/characters/bao.webp',
    });
    expect(existsSync(path.join(clientDirectory, 'public', DIALOGUE_CHARACTERS.bo.assetPath))).toBe(true);
    expect(existsSync(path.join(clientDirectory, 'public', DIALOGUE_CHARACTERS.bao.assetPath))).toBe(true);
  });

  it('extracts variables and all editable dialogue lines', () => {
    const editableLines = parseEditableDialogueLines(source);

    expect(extractInkVariableNames(source)).toEqual(['approach', 'readiness_style']);
    expect(editableLines).toHaveLength(14);
    expect(editableLines[0]).toMatchObject({
      lineId: 'fire.opening.001',
      speaker: 'bo',
      emotion: 'concerned',
    });
    expect(editableLines.at(-1)).toMatchObject({
      lineId: 'fire.opening.012',
      speaker: 'bao',
      emotion: 'encourage',
    });
  });

  it('updates text and presentation tags while preserving a compilable story', () => {
    const updatedSource = updateEditableDialogueLine(source, 'fire.opening.006', {
      text: 'Mê cung vừa sáng lên.\nHãy cùng quan sát bản đồ!',
      speaker: 'bao',
      emotion: 'curious',
    });
    const updatedLine = parseEditableDialogueLines(updatedSource).find(
      (line) => line.lineId === 'fire.opening.006',
    );
    const compiler = new Compiler(updatedSource);
    compiler.Compile();

    expect(updatedLine).toMatchObject({
      text: 'Mê cung vừa sáng lên. Hãy cùng quan sát bản đồ!',
      speaker: 'bao',
      emotion: 'curious',
    });
    expect(compiler.errors).toEqual([]);
    expect(updatedSource).toContain('# background: smoke_station_map');
  });

  it('does not modify the source when an unknown line ID is requested', () => {
    expect(updateEditableDialogueLine(source, 'fire.opening.missing', { text: 'Không tồn tại' })).toBe(
      source,
    );
  });
});
