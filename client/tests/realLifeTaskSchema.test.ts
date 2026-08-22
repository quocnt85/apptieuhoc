import { describe, expect, it } from 'vitest';
import { INITIAL_QUESTIONS } from '../src/data/mockQuestions';
import { validateRealLifeTask, validateRealLifeTaskCatalog } from '../src/content/realLifeTaskSchema';

describe('lesson-defined real-life task contract', () => {
  it('keeps every bundled mission stable, unique and reward-aligned', () => {
    expect(validateRealLifeTaskCatalog(INITIAL_QUESTIONS)).toEqual([]);
    expect(INITIAL_QUESTIONS.filter((question) => question.realLifeTask)).toHaveLength(5);
  });

  it('rejects unstable IDs and reward values that do not match difficulty', () => {
    expect(validateRealLifeTask({ contentMissionId: 'temporary id', title: 'Task', difficulty: 'hard', fixedCoinReward: 50 })).toEqual([
      'contentMissionId must be a stable MISSION-* identifier',
      'fixedCoinReward does not match difficulty',
    ]);
  });
});
