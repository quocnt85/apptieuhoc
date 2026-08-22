import { afterEach, describe, expect, it } from 'vitest';
import { getPlayLimitStatus, useParentZoneStore } from '../src/stores/useParentZoneStore';

describe('screen-time wall-clock rollback guard', () => {
  afterEach(() => useParentZoneStore.getState().resetClockGuard());

  it('blocks new child activity after the device clock moves backwards and requires an explicit parent reset', () => {
    const now = Date.now();
    useParentZoneStore.setState({
      clockGuard: { lastObservedAt: now + 10 * 60_000, rollbackDetected: false },
      usage: {},
    });

    useParentZoneStore.getState().syncUsageClock(false, now);
    expect(useParentZoneStore.getState().clockGuard.rollbackDetected).toBe(true);
    expect(getPlayLimitStatus()).toMatchObject({ blocked: true, reason: 'clock_change' });

    useParentZoneStore.getState().resetClockGuard(now);
    expect(useParentZoneStore.getState().clockGuard).toEqual({ lastObservedAt: now, rollbackDetected: false });
  });
});
