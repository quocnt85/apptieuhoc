import { describe, expect, it } from 'vitest';
import { calculatePlayLimitStatus, isInCurfew, localDateKey, normalizeChildLimits, normalizeDailyUsage, summarizeRecentUsage, usageDeltaMinutes, usageSlicesByLocalDate } from '../src/services/screenTime';

const at = (hour: number, minute: number) => new Date(2026, 7, 22, hour, minute).getTime();
const limits = { dailyMinutes: 30, curfewStart: '21:30', curfewEnd: '06:00' };

describe('screen-time clock', () => {
  it('applies the overnight 21:30–06:00 curfew at exact boundaries', () => {
    expect(isInCurfew(at(21, 29), limits)).toBe(false);
    expect(isInCurfew(at(21, 30), limits)).toBe(true);
    expect(isInCurfew(at(5, 59), limits)).toBe(true);
    expect(isInCurfew(at(6, 0), limits)).toBe(false);
  });

  it('supports daytime curfews and treats equal start/end as disabled', () => {
    expect(isInCurfew(at(12, 0), { ...limits, curfewStart: '10:00', curfewEnd: '14:00' })).toBe(true);
    expect(isInCurfew(at(15, 0), { ...limits, curfewStart: '10:00', curfewEnd: '14:00' })).toBe(false);
    expect(isInCurfew(at(12, 0), { ...limits, curfewStart: '06:00', curfewEnd: '06:00' })).toBe(false);
  });

  it('does not count paused/background/parent time and caps one delayed tick at one minute', () => {
    expect(usageDeltaMinutes(1_000, 61_000, false)).toBe(0);
    expect(usageDeltaMinutes(1_000, 31_000, true)).toBe(0.5);
    expect(usageDeltaMinutes(1_000, 301_000, true)).toBe(1);
    expect(usageDeltaMinutes(61_000, 1_000, true)).toBe(0);
  });

  it('rolls usage keys by device-local calendar day', () => {
    expect(localDateKey(new Date(2026, 7, 22, 23, 59).getTime())).toBe('2026-08-22');
    expect(localDateKey(new Date(2026, 7, 23, 0, 0).getTime())).toBe('2026-08-23');
    expect(usageSlicesByLocalDate(new Date(2026, 7, 22, 23, 59, 45).getTime(), new Date(2026, 7, 23, 0, 0, 15).getTime(), true)).toEqual([
      { date: '2026-08-22', minutes: 0.25 },
      { date: '2026-08-23', minutes: 0.25 },
    ]);
  });

  it('adds at most two 15-minute extensions and blocks at the resulting limit', () => {
    expect(calculatePlayLimitStatus(at(12, 0), limits, { date: '2026-08-22', minutes: 59.9, extensionsUsed: 2 }).blocked).toBe(false);
    expect(calculatePlayLimitStatus(at(12, 0), limits, { date: '2026-08-22', minutes: 60, extensionsUsed: 9 })).toMatchObject({ blocked: true, allowedMinutes: 60, extensionsUsed: 2 });
  });

  it('normalizes tampered persisted limits to supported values', () => {
    expect(normalizeChildLimits({ dailyMinutes: 999, curfewStart: '99:99', curfewEnd: 'bad' })).toEqual({ dailyMinutes: 120, curfewStart: '21:30', curfewEnd: '06:00' });
    expect(normalizeDailyUsage({ date: 'bad', minutes: -50, extensionsUsed: 99 }, '2026-08-22')).toEqual({ date: '2026-08-22', minutes: 0, extensionsUsed: 2, byCategory: { lesson: 0, minigame: 0, exploration: 0 } });
  });

  it('summarizes only the latest seven local calendar days by category', () => {
    const summary = summarizeRecentUsage([
      { date: '2026-08-22', minutes: 20, extensionsUsed: 0, byCategory: { lesson: 10, minigame: 5, exploration: 5 } },
      { date: '2026-08-16', minutes: 7, extensionsUsed: 0, byCategory: { lesson: 7, minigame: 0, exploration: 0 } },
      { date: '2026-08-15', minutes: 99, extensionsUsed: 0, byCategory: { lesson: 99, minigame: 0, exploration: 0 } },
    ], new Date(2026, 7, 22, 12).getTime(), 7);
    expect(summary).toEqual({ minutes: 27, byCategory: { lesson: 17, minigame: 5, exploration: 5 } });
  });
});
