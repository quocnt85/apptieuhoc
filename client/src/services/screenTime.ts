import type { ChildLimits, DailyUsage, UsageCategory } from '../types/parentZone';

export const DEFAULT_CHILD_LIMITS: ChildLimits = { dailyMinutes: 30, curfewStart: '21:30', curfewEnd: '06:00' };

export const localDateKey = (timestamp = Date.now()) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const parseClockMinutes = (value: string): number | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]); const minute = Number(match[2]);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 ? hour * 60 + minute : null;
};

export const normalizeChildLimits = (value: Partial<ChildLimits> | undefined): ChildLimits => ({
  dailyMinutes: typeof value?.dailyMinutes === 'number' && Number.isFinite(value.dailyMinutes)
    ? Math.min(120, Math.max(10, Math.round(value.dailyMinutes / 5) * 5))
    : DEFAULT_CHILD_LIMITS.dailyMinutes,
  curfewStart: parseClockMinutes(value?.curfewStart ?? '') === null ? DEFAULT_CHILD_LIMITS.curfewStart : value!.curfewStart!,
  curfewEnd: parseClockMinutes(value?.curfewEnd ?? '') === null ? DEFAULT_CHILD_LIMITS.curfewEnd : value!.curfewEnd!,
});

export const normalizeDailyUsage = (value: Partial<DailyUsage> | undefined, fallbackDate: string): DailyUsage => ({
  date: typeof value?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) ? value.date : fallbackDate,
  minutes: typeof value?.minutes === 'number' && Number.isFinite(value.minutes) ? Math.min(24 * 60, Math.max(0, value.minutes)) : 0,
  extensionsUsed: typeof value?.extensionsUsed === 'number' && Number.isFinite(value.extensionsUsed) ? Math.min(2, Math.max(0, Math.floor(value.extensionsUsed))) : 0,
  byCategory: {
    lesson: typeof value?.byCategory?.lesson === 'number' && Number.isFinite(value.byCategory.lesson) ? Math.min(24 * 60, Math.max(0, value.byCategory.lesson)) : 0,
    minigame: typeof value?.byCategory?.minigame === 'number' && Number.isFinite(value.byCategory.minigame) ? Math.min(24 * 60, Math.max(0, value.byCategory.minigame)) : 0,
    exploration: typeof value?.byCategory?.exploration === 'number' && Number.isFinite(value.byCategory.exploration) ? Math.min(24 * 60, Math.max(0, value.byCategory.exploration)) : 0,
  },
});

export const summarizeRecentUsage = (records: Array<Partial<DailyUsage>>, timestamp = Date.now(), dayCount = 7) => {
  const dates = new Set<string>(); const cursor = new Date(timestamp);
  for (let index = 0; index < Math.max(1, dayCount); index += 1) { dates.add(localDateKey(cursor.getTime())); cursor.setDate(cursor.getDate() - 1); }
  return records.reduce<{ minutes: number; byCategory: Record<UsageCategory, number> }>((summary, record) => {
    if (!record.date || !dates.has(record.date)) return summary;
    const normalized = normalizeDailyUsage(record, record.date);
    summary.minutes += normalized.minutes;
    for (const category of ['lesson', 'minigame', 'exploration'] as UsageCategory[]) summary.byCategory[category] += normalized.byCategory?.[category] ?? 0;
    return summary;
  }, { minutes: 0, byCategory: { lesson: 0, minigame: 0, exploration: 0 } as Record<UsageCategory, number> });
};

export const isInCurfew = (timestamp: number, limits: ChildLimits): boolean => {
  const start = parseClockMinutes(limits.curfewStart);
  const end = parseClockMinutes(limits.curfewEnd);
  if (start === null || end === null || start === end) return false;
  const now = new Date(timestamp); const minutesNow = now.getHours() * 60 + now.getMinutes();
  return start > end ? minutesNow >= start || minutesNow < end : minutesNow >= start && minutesNow < end;
};

export const usageDeltaMinutes = (lastTick: number, now: number, countUsage: boolean): number => {
  if (!countUsage || !Number.isFinite(lastTick) || !Number.isFinite(now) || now <= lastTick) return 0;
  return Math.min(1, (now - lastTick) / 60_000);
};

export const usageSlicesByLocalDate = (lastTick: number, now: number, countUsage: boolean): Array<{ date: string; minutes: number }> => {
  const totalMinutes = usageDeltaMinutes(lastTick, now, countUsage);
  if (totalMinutes <= 0) return [];
  const effectiveStart = now - totalMinutes * 60_000;
  const startDate = localDateKey(effectiveStart); const endDate = localDateKey(now);
  if (startDate === endDate) return [{ date: endDate, minutes: totalMinutes }];
  const end = new Date(now); const midnight = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const previousMinutes = Math.max(0, (midnight - effectiveStart) / 60_000);
  const currentMinutes = Math.max(0, (now - midnight) / 60_000);
  return [
    ...(previousMinutes > 0 ? [{ date: startDate, minutes: previousMinutes }] : []),
    ...(currentMinutes > 0 ? [{ date: endDate, minutes: currentMinutes }] : []),
  ];
};

export const calculatePlayLimitStatus = (timestamp: number, limitsInput: Partial<ChildLimits> | undefined, usageInput: Partial<DailyUsage> | undefined) => {
  const limits = normalizeChildLimits(limitsInput);
  const usageMinutes = typeof usageInput?.minutes === 'number' && Number.isFinite(usageInput.minutes) ? Math.max(0, usageInput.minutes) : 0;
  const extensionsUsed = typeof usageInput?.extensionsUsed === 'number' && Number.isFinite(usageInput.extensionsUsed)
    ? Math.min(2, Math.max(0, Math.floor(usageInput.extensionsUsed))) : 0;
  const allowedMinutes = limits.dailyMinutes + extensionsUsed * 15;
  const inCurfew = isInCurfew(timestamp, limits);
  return {
    blocked: inCurfew || usageMinutes >= allowedMinutes,
    reason: inCurfew ? 'curfew' as const : 'daily_limit' as const,
    usedMinutes: usageMinutes,
    allowedMinutes,
    extensionsUsed,
  };
};
