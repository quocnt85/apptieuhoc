export const CURRENT_GAME_STATE_KEY = 'novastars_space_state_v3';
export const LEGACY_GAME_STATE_KEY = 'novastars_space_state_v2';
export const GAME_STATE_MIGRATION_BACKUP_KEY = 'novastars_space_state_migration_backup_v3';
export const GAME_STATE_TRANSACTION_LOCK_KEY = 'novastars_space_state_transaction_lock_v3';
export const GAME_STATE_TRANSACTION_JOURNAL_KEY = 'novastars_space_state_transaction_journal_v3';
const PROFILE_STATE_PREFIX = 'novastars_space_state_profile_';
const CURRENT_SCHEMA_VERSION = 3;
const TRANSACTION_LEASE_MS = 10_000;

type JsonRecord = Record<string, unknown>;

export type GameStateReadResult = {
  payload: JsonRecord | null;
  migrated: boolean;
  source: 'v3' | 'v2' | null;
};

const isRecord = (value: unknown): value is JsonRecord => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const finiteNonNegative = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;

const stripSensitiveFields = (value: unknown, depth = 0): unknown => {
  if (depth > 32) throw new Error('Dữ liệu local lồng quá sâu để migration an toàn.');
  if (Array.isArray(value)) return value.map((item) => stripSensitiveFields(item, depth + 1));
  if (!isRecord(value)) return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== 'parentPin' && key !== '__proto__' && key !== 'prototype' && key !== 'constructor')
    .map(([key, item]) => [key, stripSensitiveFields(item, depth + 1)]));
};

const parseRecord = (raw: string | null): JsonRecord | null => {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch { return null; }
};

type TransactionSnapshot = { key: string; value: string | null };
type TransactionJournal = { owner: string; createdAt: number; previous: TransactionSnapshot[] };

const parseTransactionJournal = (raw: string | null): TransactionJournal | null => {
  const parsed = parseRecord(raw);
  if (!parsed || typeof parsed.owner !== 'string' || !Array.isArray(parsed.previous)) return null;
  const previous = parsed.previous.filter((entry): entry is TransactionSnapshot => isRecord(entry)
    && typeof entry.key === 'string'
    && (typeof entry.value === 'string' || entry.value === null));
  if (previous.length !== parsed.previous.length) return null;
  return { owner: parsed.owner, createdAt: finiteNonNegative(parsed.createdAt), previous };
};

const parseTransactionLock = (raw: string | null): { owner: string; expiresAt: number } | null => {
  const parsed = parseRecord(raw);
  return parsed && typeof parsed.owner === 'string' && typeof parsed.expiresAt === 'number'
    ? { owner: parsed.owner, expiresAt: parsed.expiresAt }
    : null;
};

const restoreSnapshots = (storage: Storage, snapshots: TransactionSnapshot[]) => {
  let firstError: unknown;
  for (const snapshot of snapshots) {
    try {
      if (snapshot.value === null) storage.removeItem(snapshot.key);
      else storage.setItem(snapshot.key, snapshot.value);
    } catch (error) {
      firstError ??= error;
    }
  }
  if (firstError) throw firstError;
};

export const recoverPendingGameStateTransaction = (storage: Storage = localStorage, now = Date.now()): boolean => {
  const journal = parseTransactionJournal(storage.getItem(GAME_STATE_TRANSACTION_JOURNAL_KEY));
  if (!journal) {
    if (storage.getItem(GAME_STATE_TRANSACTION_JOURNAL_KEY)) storage.removeItem(GAME_STATE_TRANSACTION_JOURNAL_KEY);
    return false;
  }
  const lock = parseTransactionLock(storage.getItem(GAME_STATE_TRANSACTION_LOCK_KEY));
  if (lock?.owner === journal.owner && lock.expiresAt > now) throw new Error('Dữ liệu local đang được cập nhật ở một phiên khác. Vui lòng thử lại.');
  restoreSnapshots(storage, journal.previous);
  storage.removeItem(GAME_STATE_TRANSACTION_JOURNAL_KEY);
  if (!lock || lock.owner === journal.owner || lock.expiresAt <= now) storage.removeItem(GAME_STATE_TRANSACTION_LOCK_KEY);
  return true;
};

const withGameStateTransaction = <T>(storage: Storage, keys: string[], operation: () => T): T => {
  const now = Date.now();
  recoverPendingGameStateTransaction(storage, now);
  const existingLock = parseTransactionLock(storage.getItem(GAME_STATE_TRANSACTION_LOCK_KEY));
  if (existingLock && existingLock.expiresAt > now) throw new Error('Dữ liệu local đang được cập nhật ở một phiên khác. Vui lòng thử lại.');

  const owner = crypto.randomUUID();
  const lock = JSON.stringify({ owner, expiresAt: now + TRANSACTION_LEASE_MS });
  storage.setItem(GAME_STATE_TRANSACTION_LOCK_KEY, lock);
  if (parseTransactionLock(storage.getItem(GAME_STATE_TRANSACTION_LOCK_KEY))?.owner !== owner) {
    throw new Error('Không thể khóa dữ liệu local để cập nhật an toàn.');
  }

  const previous = [...new Set(keys)].map((key) => ({ key, value: storage.getItem(key) }));
  let journalWritten = false;
  try {
    storage.setItem(GAME_STATE_TRANSACTION_JOURNAL_KEY, JSON.stringify({ owner, createdAt: now, previous } satisfies TransactionJournal));
    journalWritten = true;
    const result = operation();
    storage.removeItem(GAME_STATE_TRANSACTION_JOURNAL_KEY);
    journalWritten = false;
    return result;
  } catch (error) {
    if (journalWritten) {
      try {
        restoreSnapshots(storage, previous);
        storage.removeItem(GAME_STATE_TRANSACTION_JOURNAL_KEY);
        journalWritten = false;
      } catch { /* Leave the journal for recovery on the next access. */ }
    }
    throw error;
  } finally {
    const currentLock = parseTransactionLock(storage.getItem(GAME_STATE_TRANSACTION_LOCK_KEY));
    if (currentLock?.owner === owner && !journalWritten) storage.removeItem(GAME_STATE_TRANSACTION_LOCK_KEY);
  }
};

export const sanitizeGameState = (input: JsonRecord, allowLocalDiamonds: boolean): JsonRecord => {
  const cleanInput = stripSensitiveFields(input) as JsonRecord;
  const sanitized: JsonRecord = { ...cleanInput, schemaVersion: CURRENT_SCHEMA_VERSION };
  const settings = isRecord(cleanInput.settings) ? { ...cleanInput.settings } : {};
  delete settings.dailyTimeLimitMinutes;
  delete settings.todayPlayedMinutes;
  sanitized.settings = settings;

  if (isRecord(cleanInput.user)) {
    const user: JsonRecord = { ...cleanInput.user };
    user.novaCoins = finiteNonNegative(user.novaCoins);
    user.diamonds = allowLocalDiamonds ? finiteNonNegative(user.diamonds) : 0;
    user.gems = allowLocalDiamonds ? finiteNonNegative(user.gems, finiteNonNegative(user.diamonds)) : 0;
    if (typeof user.grade === 'number') user.grade = Math.min(5, Math.max(1, Math.round(user.grade)));
    sanitized.user = user;
  }
  return sanitized;
};

const writeVerified = (storage: Storage, key: string, payload: JsonRecord) => {
  const serialized = JSON.stringify(payload);
  storage.setItem(key, serialized);
  if (storage.getItem(key) !== serialized) throw new Error('Không thể xác minh dữ liệu vừa ghi vào bộ nhớ local.');
};

export const readGameState = (storage: Storage = localStorage, allowLocalDiamonds = false): GameStateReadResult => {
  recoverPendingGameStateTransaction(storage);
  const current = parseRecord(storage.getItem(CURRENT_GAME_STATE_KEY));
  if (current) {
    const sanitized = sanitizeGameState(current, allowLocalDiamonds);
    if (JSON.stringify(current) !== JSON.stringify(sanitized)) {
      withGameStateTransaction(storage, [CURRENT_GAME_STATE_KEY], () => writeVerified(storage, CURRENT_GAME_STATE_KEY, sanitized));
    }
    return { payload: sanitized, migrated: false, source: 'v3' };
  }

  const legacy = parseRecord(storage.getItem(LEGACY_GAME_STATE_KEY));
  if (!legacy) return { payload: null, migrated: false, source: null };
  const migrated = sanitizeGameState(legacy, allowLocalDiamonds);
  const rollback = { migratedAt: Date.now(), sourceKey: LEGACY_GAME_STATE_KEY, payload: migrated };
  withGameStateTransaction(storage, [GAME_STATE_MIGRATION_BACKUP_KEY, CURRENT_GAME_STATE_KEY, LEGACY_GAME_STATE_KEY], () => {
    writeVerified(storage, GAME_STATE_MIGRATION_BACKUP_KEY, rollback);
    writeVerified(storage, CURRENT_GAME_STATE_KEY, migrated);
    storage.removeItem(LEGACY_GAME_STATE_KEY);
  });
  return { payload: migrated, migrated: true, source: 'v2' };
};

export const writeGameState = (payload: JsonRecord, storage: Storage = localStorage, allowLocalDiamonds = false) => {
  withGameStateTransaction(storage, [CURRENT_GAME_STATE_KEY], () => {
    writeVerified(storage, CURRENT_GAME_STATE_KEY, sanitizeGameState(payload, allowLocalDiamonds));
  });
};

const safeProfileId = (profileId: string) => {
  if (!/^[A-Za-z0-9-]{1,128}$/.test(profileId)) throw new Error('Mã hồ sơ local không hợp lệ.');
  return profileId;
};
export const profileGameStateKey = (profileId: string) => `${PROFILE_STATE_PREFIX}${safeProfileId(profileId)}`;

export const switchProfileGameState = (currentProfileId: string, targetProfileId: string, storage: Storage = localStorage, allowLocalDiamonds = false) => {
  const currentProfileKey = profileGameStateKey(currentProfileId);
  const targetProfileKey = profileGameStateKey(targetProfileId);
  withGameStateTransaction(storage, [CURRENT_GAME_STATE_KEY, currentProfileKey], () => {
    const current = parseRecord(storage.getItem(CURRENT_GAME_STATE_KEY));
    if (current) writeVerified(storage, currentProfileKey, sanitizeGameState(current, allowLocalDiamonds));
    const target = parseRecord(storage.getItem(targetProfileKey));
    if (target) writeVerified(storage, CURRENT_GAME_STATE_KEY, sanitizeGameState(target, allowLocalDiamonds));
    else storage.removeItem(CURRENT_GAME_STATE_KEY);
  });
};

export const deleteProfileGameState = (profileId: string, storage: Storage = localStorage) => {
  const key = profileGameStateKey(profileId);
  withGameStateTransaction(storage, [key], () => storage.removeItem(key));
};

export const clearGameState = (storage: Storage = localStorage) => {
  const profileKeys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(PROFILE_STATE_PREFIX)) profileKeys.push(key);
  }
  const keys = [CURRENT_GAME_STATE_KEY, LEGACY_GAME_STATE_KEY, GAME_STATE_MIGRATION_BACKUP_KEY, ...profileKeys];
  withGameStateTransaction(storage, keys, () => {
    for (const key of keys) storage.removeItem(key);
  });
};
