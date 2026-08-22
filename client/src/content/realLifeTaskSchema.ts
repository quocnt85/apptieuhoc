import type { QuestionItem, RealLifeTaskDefinition } from '../types';

const FIXED_REWARD_BY_DIFFICULTY = Object.freeze({ easy: 50, medium: 100, hard: 150, challenge: 200 } as const);
const MISSION_ID_PATTERN = /^MISSION-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

export const validateRealLifeTask = (task: RealLifeTaskDefinition): string[] => {
  const errors: string[] = [];
  if (!MISSION_ID_PATTERN.test(task.contentMissionId)) errors.push('contentMissionId must be a stable MISSION-* identifier');
  if (!task.title.trim() || task.title.length > 500) errors.push('title must contain 1–500 characters');
  if (!(task.difficulty in FIXED_REWARD_BY_DIFFICULTY)) errors.push('difficulty is unsupported');
  else if (task.fixedCoinReward !== FIXED_REWARD_BY_DIFFICULTY[task.difficulty]) errors.push('fixedCoinReward does not match difficulty');
  return errors;
};

export const validateRealLifeTaskCatalog = (questions: Array<Pick<QuestionItem, 'id' | 'realLifeTask'>>): string[] => {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const question of questions) {
    if (!question.realLifeTask) continue;
    for (const error of validateRealLifeTask(question.realLifeTask)) errors.push(`${question.id}: ${error}`);
    if (seen.has(question.realLifeTask.contentMissionId)) errors.push(`${question.id}: duplicate contentMissionId`);
    seen.add(question.realLifeTask.contentMissionId);
  }
  return errors;
};

export const assertValidRealLifeTaskCatalog = (questions: Array<Pick<QuestionItem, 'id' | 'realLifeTask'>>): void => {
  const errors = validateRealLifeTaskCatalog(questions);
  if (errors.length) throw new Error(`Invalid real-life task catalog:\n${errors.join('\n')}`);
};
