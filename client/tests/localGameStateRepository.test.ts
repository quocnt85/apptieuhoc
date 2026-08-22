import { describe, expect, it } from 'vitest';
import {
  CURRENT_GAME_STATE_KEY,
  GAME_STATE_MIGRATION_BACKUP_KEY,
  GAME_STATE_TRANSACTION_JOURNAL_KEY,
  GAME_STATE_TRANSACTION_LOCK_KEY,
  LEGACY_GAME_STATE_KEY,
  clearGameState,
  readGameState,
  recoverPendingGameStateTransaction,
  switchProfileGameState,
  writeGameState,
} from '../src/services/localGameStateRepository';

class MemoryStorage implements Storage {
  protected values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
}

const legacyState = () => ({
  user: { name: 'Bé An', grade: 3, novaCoins: 321, diamonds: 99, gems: 99, xp: 42, customization: { equippedShip: 'explorer_v1' } },
  settings: { parentPin: '1234', dailyTimeLimitMinutes: 30, todayPlayedMinutes: 12, sfxEnabled: true },
  parentPin: '1234',
  nestedLegacy: { parentPin: '1234' },
  completedNodes: { lesson_a: true },
  nodeStars: { lesson_a: 3 },
});

describe('local game-state v3 repository', () => {
  it('migrates v2 atomically, preserves learning/Xu/customization and strips PIN/legacy diamonds', () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_GAME_STATE_KEY, JSON.stringify(legacyState()));

    const result = readGameState(storage, false);
    const user = result.payload?.user as Record<string, unknown>;
    const settings = result.payload?.settings as Record<string, unknown>;
    expect(result).toMatchObject({ migrated: true, source: 'v2' });
    expect(result.payload?.schemaVersion).toBe(3);
    expect(result.payload?.completedNodes).toEqual({ lesson_a: true });
    expect(user).toMatchObject({ name: 'Bé An', novaCoins: 321, xp: 42, diamonds: 0, gems: 0, customization: { equippedShip: 'explorer_v1' } });
    expect(settings.parentPin).toBeUndefined();
    expect(settings.dailyTimeLimitMinutes).toBeUndefined();
    expect(result.payload?.parentPin).toBeUndefined();
    expect(storage.getItem(LEGACY_GAME_STATE_KEY)).toBeNull();
    expect(storage.getItem(CURRENT_GAME_STATE_KEY)).not.toContain('1234');
    expect(storage.getItem(GAME_STATE_MIGRATION_BACKUP_KEY)).not.toContain('1234');
  });

  it('retains prototype diamonds only when demo access explicitly allows it', () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_GAME_STATE_KEY, JSON.stringify(legacyState()));
    const user = readGameState(storage, true).payload?.user as Record<string, unknown>;
    expect(user.diamonds).toBe(99);
    expect(user.gems).toBe(99);
  });

  it('keeps v2 untouched if verified v3 storage fails', () => {
    class FailingStorage extends MemoryStorage {
      override setItem(key: string, value: string) {
        if (key === CURRENT_GAME_STATE_KEY) throw new Error('quota');
        super.setItem(key, value);
      }
    }
    const storage = new FailingStorage();
    storage.setItem(LEGACY_GAME_STATE_KEY, JSON.stringify(legacyState()));
    expect(() => readGameState(storage, false)).toThrow('quota');
    expect(storage.getItem(LEGACY_GAME_STATE_KEY)).not.toBeNull();
  });

  it('isolates profile game states and sanitizes every write', () => {
    const storage = new MemoryStorage();
    writeGameState(legacyState(), storage, false);
    switchProfileGameState('child-a', 'child-b', storage, false);
    expect(storage.getItem('novastars_space_state_profile_child-a')).toContain('"novaCoins":321');
    expect(storage.getItem('novastars_space_state_profile_child-a')).not.toContain('1234');
    expect(storage.getItem(CURRENT_GAME_STATE_KEY)).toBeNull();

    writeGameState({ user: { novaCoins: 7, diamonds: 10, gems: 10 }, settings: {} }, storage, false);
    switchProfileGameState('child-b', 'child-a', storage, false);
    const restored = readGameState(storage, false).payload?.user as Record<string, unknown>;
    expect(restored.novaCoins).toBe(321);
    expect(restored.diamonds).toBe(0);
  });

  it('rolls back every touched key when a profile switch fails midway', () => {
    class FailingSwitchStorage extends MemoryStorage {
      failNextCurrentWrite = false;
      override setItem(key: string, value: string) {
        if (this.failNextCurrentWrite && key === CURRENT_GAME_STATE_KEY) {
          this.failNextCurrentWrite = false;
          throw new Error('quota');
        }
        super.setItem(key, value);
      }
    }
    const storage = new FailingSwitchStorage();
    storage.setItem(CURRENT_GAME_STATE_KEY, JSON.stringify({ schemaVersion: 3, user: { novaCoins: 1 }, settings: {} }));
    storage.setItem('novastars_space_state_profile_child-b', JSON.stringify({ schemaVersion: 3, user: { novaCoins: 2 }, settings: {} }));
    const originalCurrent = storage.getItem(CURRENT_GAME_STATE_KEY);
    storage.failNextCurrentWrite = true;

    expect(() => switchProfileGameState('child-a', 'child-b', storage, false)).toThrow('quota');
    expect(storage.getItem(CURRENT_GAME_STATE_KEY)).toBe(originalCurrent);
    expect(storage.getItem('novastars_space_state_profile_child-a')).toBeNull();
    expect(storage.getItem(GAME_STATE_TRANSACTION_JOURNAL_KEY)).toBeNull();
    expect(storage.getItem(GAME_STATE_TRANSACTION_LOCK_KEY)).toBeNull();
  });

  it('recovers an expired crash journal before returning local state', () => {
    const storage = new MemoryStorage();
    const previous = JSON.stringify({ schemaVersion: 3, user: { novaCoins: 7 }, settings: {} });
    storage.setItem(CURRENT_GAME_STATE_KEY, JSON.stringify({ schemaVersion: 3, user: { novaCoins: 999 }, settings: {} }));
    storage.setItem(GAME_STATE_TRANSACTION_JOURNAL_KEY, JSON.stringify({
      owner: 'crashed-writer', createdAt: 1, previous: [{ key: CURRENT_GAME_STATE_KEY, value: previous }],
    }));
    storage.setItem(GAME_STATE_TRANSACTION_LOCK_KEY, JSON.stringify({ owner: 'crashed-writer', expiresAt: 2 }));

    expect(recoverPendingGameStateTransaction(storage, 3)).toBe(true);
    expect(storage.getItem(CURRENT_GAME_STATE_KEY)).toBe(previous);
    expect(storage.getItem(GAME_STATE_TRANSACTION_JOURNAL_KEY)).toBeNull();
    expect(storage.getItem(GAME_STATE_TRANSACTION_LOCK_KEY)).toBeNull();
  });

  it('does not overwrite a live transaction owned by another app context', () => {
    const storage = new MemoryStorage();
    storage.setItem(GAME_STATE_TRANSACTION_JOURNAL_KEY, JSON.stringify({ owner: 'other-tab', createdAt: Date.now(), previous: [] }));
    storage.setItem(GAME_STATE_TRANSACTION_LOCK_KEY, JSON.stringify({ owner: 'other-tab', expiresAt: Date.now() + 60_000 }));
    expect(() => readGameState(storage, false)).toThrow('đang được cập nhật');
  });

  it('clears both current, legacy and migration rollback keys', () => {
    const storage = new MemoryStorage();
    storage.setItem(CURRENT_GAME_STATE_KEY, '{}');
    storage.setItem(LEGACY_GAME_STATE_KEY, '{}');
    storage.setItem(GAME_STATE_MIGRATION_BACKUP_KEY, '{}');
    storage.setItem('novastars_space_state_profile_child-a', '{}');
    clearGameState(storage);
    expect(storage.length).toBe(0);
  });
});
