import { describe, expect, it } from 'vitest';
import { createParentDiagnosticBlob, createParentDiagnosticReport } from '../src/services/parentDiagnostics';

describe('local Parent Zone diagnostic report', () => {
  const snapshot = {
    schemaVersion: 2,
    profiles: [{ id: 'child-secret-id', name: 'Bé Không Được Lộ', grade: 3 }],
    usage: {
      'child-secret-id:2026-08-21': { date: '2026-08-21', minutes: 12.345, extensionsUsed: 1, byCategory: { lesson: 5, minigame: 4, exploration: 3.345 } },
      'child-secret-id:2026-08-22': { date: '2026-08-22', minutes: 8, extensionsUsed: 0, byCategory: { lesson: 8, minigame: 0, exploration: 0 } },
    },
    activities: [{ id: 'activity-secret', profileId: 'child-secret-id', type: 'quiz' as const, title: 'Điểm bí mật', score: 9, completedAt: 1 }],
    missions: [{ id: 'mission-secret', rewardRequestId: 'reward-secret', profileId: 'child-secret-id', sourceLessonId: 'lesson-secret', contentMissionId: 'content-secret', title: 'Nhiệm vụ bí mật', difficulty: 'medium' as const, fixedCoinReward: 100 as const, status: 'approved' as const, proposedAt: 1, novaCoinsAwarded: 100, diamondsAwarded: 500 }],
    clockGuard: { rollbackDetected: true },
  };

  it('exports only bounded aggregates and explicit consent metadata', () => {
    const report = createParentDiagnosticReport(snapshot, { now: Date.UTC(2026, 7, 22), reportId: 'diagnostic-random', platform: 'android' });
    expect(report).toMatchObject({
      format: 'novastars-parent-local-diagnostics',
      version: 1,
      reportId: 'diagnostic-random',
      consent: { scope: 'LOCAL_DIAGNOSTIC_EXPORT', automaticUpload: false },
      runtime: { platform: 'android', parentZoneSchemaVersion: 2 },
      aggregates: {
        profileCount: 1,
        usage: { recordedDays: 2, totalMinutes: 20.35, extensionsUsed: 1, lessonMinutes: 13, minigameMinutes: 4, explorationMinutes: 3.35, clockRollbackDetected: true },
        activities: { total: 1, lessons: 0, quizzes: 1, minigames: 0 },
        missions: { total: 1, suggested: 0, doneByChild: 0, approved: 1, novaCoinsAwarded: 100, diamondsAwarded: 500 },
      },
    });
  });

  it('does not serialize child identifiers, names, titles, answers or scores', async () => {
    const text = await createParentDiagnosticBlob(createParentDiagnosticReport(snapshot, { reportId: 'diagnostic-random' })).text();
    for (const secret of ['child-secret-id', 'Bé Không Được Lộ', 'activity-secret', 'Điểm bí mật', 'mission-secret', 'Nhiệm vụ bí mật', 'lesson-secret', 'content-secret', 'reward-secret']) {
      expect(text).not.toContain(secret);
    }
    expect(text).not.toContain('"score"');
    expect(text).not.toContain('"name"');
    expect(text).not.toContain('"profileId"');
  });
});
