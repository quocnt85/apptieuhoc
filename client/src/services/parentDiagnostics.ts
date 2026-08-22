import { Capacitor } from '@capacitor/core';
import type { DailyUsage, LearningActivity, RealLifeMission } from '../types/parentZone';

type DiagnosticSnapshot = {
  schemaVersion: number;
  profiles: unknown[];
  usage: Record<string, DailyUsage>;
  activities: LearningActivity[];
  missions: RealLifeMission[];
  clockGuard: { rollbackDetected: boolean };
};

type DiagnosticOptions = {
  now?: number;
  reportId?: string;
  platform?: 'web' | 'ios' | 'android';
};

const rounded = (value: number) => Math.round(Math.max(0, Number.isFinite(value) ? value : 0) * 100) / 100;

export const createParentDiagnosticReport = (
  snapshot: DiagnosticSnapshot,
  options: DiagnosticOptions = {},
) => {
  const usageRows = Object.values(snapshot.usage);
  const categories = usageRows.reduce((total, row) => ({
    lessonMinutes: total.lessonMinutes + (row.byCategory?.lesson ?? 0),
    minigameMinutes: total.minigameMinutes + (row.byCategory?.minigame ?? 0),
    explorationMinutes: total.explorationMinutes + (row.byCategory?.exploration ?? 0),
  }), { lessonMinutes: 0, minigameMinutes: 0, explorationMinutes: 0 });
  const missionCount = (status: RealLifeMission['status']) => snapshot.missions.filter((mission) => mission.status === status).length;
  const activityCount = (type: LearningActivity['type']) => snapshot.activities.filter((activity) => activity.type === type).length;
  const now = options.now ?? Date.now();

  return {
    format: 'novastars-parent-local-diagnostics',
    version: 1,
    reportId: options.reportId ?? crypto.randomUUID(),
    generatedAt: new Date(now).toISOString(),
    consent: {
      scope: 'LOCAL_DIAGNOSTIC_EXPORT',
      capturedAt: new Date(now).toISOString(),
      automaticUpload: false,
    },
    runtime: {
      platform: options.platform ?? Capacitor.getPlatform(),
      parentZoneSchemaVersion: snapshot.schemaVersion,
    },
    aggregates: {
      profileCount: snapshot.profiles.length,
      usage: {
        recordedDays: usageRows.length,
        totalMinutes: rounded(usageRows.reduce((sum, row) => sum + row.minutes, 0)),
        extensionsUsed: usageRows.reduce((sum, row) => sum + Math.max(0, Math.floor(row.extensionsUsed)), 0),
        lessonMinutes: rounded(categories.lessonMinutes),
        minigameMinutes: rounded(categories.minigameMinutes),
        explorationMinutes: rounded(categories.explorationMinutes),
        clockRollbackDetected: snapshot.clockGuard.rollbackDetected,
      },
      activities: {
        total: snapshot.activities.length,
        lessons: activityCount('lesson'),
        quizzes: activityCount('quiz'),
        minigames: activityCount('minigame'),
      },
      missions: {
        total: snapshot.missions.length,
        suggested: missionCount('suggested'),
        doneByChild: missionCount('done_by_child'),
        approved: missionCount('approved'),
        novaCoinsAwarded: snapshot.missions.reduce((sum, mission) => sum + (mission.novaCoinsAwarded ?? 0), 0),
        diamondsAwarded: snapshot.missions.reduce((sum, mission) => sum + (mission.diamondsAwarded ?? 0), 0),
      },
    },
    privacy: {
      containsNames: false,
      containsProfileIds: false,
      containsEmail: false,
      containsAnswersOrScores: false,
      containsMedia: false,
      containsRawEvents: false,
    },
  } as const;
};

export type ParentDiagnosticReport = ReturnType<typeof createParentDiagnosticReport>;

export const createParentDiagnosticBlob = (report: ParentDiagnosticReport) => new Blob(
  [JSON.stringify(report, null, 2)],
  { type: 'application/json' },
);
