import { getMediaStorage, type MediaStorageAdapter } from './personalization/mediaStorage';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_BACKUP_BYTES = 10 * 1024 * 1024;
const MAX_BACKUP_KEYS = 10;
const MAX_VALUE_BYTES = 2 * 1024 * 1024;
const MAX_MEDIA_ITEMS = 8;
const MAX_MEDIA_BYTES = 2 * 1024 * 1024;
const PERSONALIZATION_KEY = 'novastars_personalization_v3';

type BackupEnvelope = {
  format: 'novastars-parent-backup';
  version: 1;
  salt: string;
  iv: string;
  ciphertext: string;
};

type BackupPayload = {
  version: 1;
  exportedAt: number;
  parentAccountId: string | null;
  values: Record<string, string>;
  media?: BackupMedia[];
};

type BackupMedia = {
  relativePath: string;
  childId: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  data: string;
};

export type BackupPreview = {
  exportedAt: number;
  keyCount: number;
  keys: string[];
  mediaCount: number;
};

const isBackupKey = (key: string): boolean =>
  key === 'novastars_parent_zone_v1'
  || key === 'novastars_space_state_v3'
  || key === PERSONALIZATION_KEY
  || /^novastars_space_state_profile_[A-Za-z0-9-]{1,128}$/.test(key);

const backupKeys = (storage: Storage): string[] => {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && isBackupKey(key)) keys.push(key);
  }
  return keys.sort();
};

const deriveKey = async (password: string, salt: Uint8Array, usage: KeyUsage[]) => {
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', iterations: 180_000, salt }, material, { name: 'AES-GCM', length: 256 }, false, usage);
};

const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = '';
  const chunkSize = 32_768;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
};

const base64ToBytes = (value: unknown, field: string): Uint8Array => {
  if (typeof value !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(value)) throw new Error(`Trường ${field} không hợp lệ.`);
  try { return Uint8Array.from(atob(value), (char) => char.charCodeAt(0)); }
  catch { throw new Error(`Trường ${field} không hợp lệ.`); }
};

const safeMediaSegment = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
const isMediaPath = (value: string): boolean => /^library:personalization\/[A-Za-z0-9_-]{1,100}\/[A-Za-z0-9_.-]{1,180}\.(?:jpe?g|png|webp)$/.test(value);
const isMediaPathForChild = (value: string, childId: string): boolean => isMediaPath(value) && value.startsWith(`library:personalization/${safeMediaSegment(childId)}/`);
const isMediaMimeType = (value: unknown): value is BackupMedia['mimeType'] => value === 'image/jpeg' || value === 'image/png' || value === 'image/webp';

const mediaReferences = (values: Record<string, string>): Omit<BackupMedia, 'data'>[] => {
  const raw = values[PERSONALIZATION_KEY];
  if (!raw) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { throw new Error('Metadata ảnh local không hợp lệ.'); }
  const state = parsed && typeof parsed === 'object' ? (parsed as { state?: { assets?: unknown } }).state : undefined;
  const assets = state?.assets;
  if (!Array.isArray(assets)) return [];
  const references = assets.filter((asset): asset is Record<string, unknown> => Boolean(asset && typeof asset === 'object')).map((asset) => ({
    relativePath: asset.relativePath,
    childId: asset.childId,
    mimeType: asset.mimeType,
  })).filter((asset): asset is Omit<BackupMedia, 'data'> =>
    typeof asset.relativePath === 'string'
    && typeof asset.childId === 'string' && asset.childId.length > 0 && asset.childId.length <= 128
    && isMediaPathForChild(asset.relativePath, asset.childId)
    && isMediaMimeType(asset.mimeType));
  const unique = [...new Map(references.map((item) => [item.relativePath, item])).values()];
  if (unique.length > MAX_MEDIA_ITEMS) throw new Error('Có quá nhiều ảnh trong một bản sao lưu.');
  return unique;
};

const parseEnvelope = async (file: Blob): Promise<BackupEnvelope> => {
  if (file.size <= 0 || file.size > MAX_BACKUP_BYTES) throw new Error('Kích thước tệp sao lưu không hợp lệ.');
  let value: unknown;
  try { value = JSON.parse(await file.text()); }
  catch { throw new Error('Tệp sao lưu không phải JSON hợp lệ.'); }
  if (!value || typeof value !== 'object') throw new Error('Tệp sao lưu không đúng định dạng.');
  const envelope = value as Partial<BackupEnvelope>;
  if (envelope.format !== 'novastars-parent-backup' || envelope.version !== 1) throw new Error('Tệp sao lưu không đúng định dạng.');
  if (typeof envelope.salt !== 'string' || typeof envelope.iv !== 'string' || typeof envelope.ciphertext !== 'string') throw new Error('Tệp sao lưu thiếu dữ liệu mã hóa.');
  return envelope as BackupEnvelope;
};

const decryptAndValidate = async (file: Blob, password: string, storage: Storage): Promise<BackupPayload> => {
  const envelope = await parseEnvelope(file);
  const salt = base64ToBytes(envelope.salt, 'salt');
  const iv = base64ToBytes(envelope.iv, 'iv');
  const ciphertext = base64ToBytes(envelope.ciphertext, 'ciphertext');
  if (salt.length !== 16 || iv.length !== 12 || ciphertext.length === 0) throw new Error('Thông số mã hóa của tệp không hợp lệ.');
  const key = await deriveKey(password, salt, ['decrypt']);
  let plain: ArrayBuffer;
  try { plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext); }
  catch { throw new Error('Không thể giải mã tệp sao lưu.'); }

  let value: unknown;
  try { value = JSON.parse(decoder.decode(plain)); }
  catch { throw new Error('Nội dung tệp sao lưu không hợp lệ.'); }
  if (!value || typeof value !== 'object') throw new Error('Nội dung tệp sao lưu không hợp lệ.');
  const payload = value as Partial<BackupPayload>;
  if (payload.version !== 1 || !Number.isFinite(payload.exportedAt) || !payload.values || typeof payload.values !== 'object') throw new Error('Nội dung tệp sao lưu không hợp lệ.');
  if (payload.parentAccountId !== storage.getItem('novastars_parent_id')) throw new Error('Tệp sao lưu thuộc tài khoản khác.');

  const entries = Object.entries(payload.values);
  if (entries.length > MAX_BACKUP_KEYS) throw new Error('Tệp sao lưu chứa quá nhiều mục dữ liệu.');
  for (const [name, raw] of entries) {
    if (!isBackupKey(name) || typeof raw !== 'string' || encoder.encode(raw).byteLength > MAX_VALUE_BYTES) throw new Error('Tệp sao lưu chứa mục dữ liệu không hợp lệ.');
    try { JSON.parse(raw); } catch { throw new Error(`Mục dữ liệu ${name} không phải JSON hợp lệ.`); }
  }
  if (payload.media !== undefined && !Array.isArray(payload.media)) throw new Error('Danh sách ảnh sao lưu không hợp lệ.');
  const media = payload.media ?? [];
  if (media.length > MAX_MEDIA_ITEMS) throw new Error('Tệp sao lưu chứa quá nhiều ảnh.');
  const seenPaths = new Set<string>();
  for (const item of media) {
    if (!item || typeof item !== 'object' || typeof item.relativePath !== 'string'
      || typeof item.childId !== 'string' || item.childId.length === 0 || item.childId.length > 128
      || !isMediaPathForChild(item.relativePath, item.childId) || !isMediaMimeType(item.mimeType)
      || seenPaths.has(item.relativePath)) throw new Error('Tệp sao lưu chứa ảnh không hợp lệ.');
    const bytes = base64ToBytes(item.data, 'media.data');
    if (bytes.length === 0 || bytes.length > MAX_MEDIA_BYTES) throw new Error('Kích thước ảnh sao lưu không hợp lệ.');
    seenPaths.add(item.relativePath);
  }
  return payload as BackupPayload;
};

export const createEncryptedBackup = async (password: string, storage: Storage = localStorage, mediaStorage?: MediaStorageAdapter): Promise<Blob> => {
  if (password.length < 8) throw new Error('Mật khẩu sao lưu phải có ít nhất 8 ký tự.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ['encrypt']);
  const values = Object.fromEntries(backupKeys(storage).map((name) => [name, storage.getItem(name)]).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
  for (const raw of Object.values(values)) if (encoder.encode(raw).byteLength > MAX_VALUE_BYTES) throw new Error('Một mục dữ liệu vượt quá giới hạn sao lưu.');
  const media: BackupMedia[] = [];
  const references = mediaReferences(values);
  const resolvedMediaStorage = references.length ? (mediaStorage ?? getMediaStorage()) : undefined;
  for (const reference of references) {
    const blob = await resolvedMediaStorage!.read(reference.relativePath);
    if (!isMediaMimeType(blob.type) || blob.size <= 0 || blob.size > MAX_MEDIA_BYTES) throw new Error('Một ảnh local không hợp lệ hoặc vượt quá giới hạn sao lưu.');
    media.push({ ...reference, mimeType: blob.type, data: bytesToBase64(new Uint8Array(await blob.arrayBuffer())) });
  }
  const payload: BackupPayload = { version: 1, exportedAt: Date.now(), parentAccountId: storage.getItem('novastars_parent_id'), values, media };
  const serialized = encoder.encode(JSON.stringify(payload));
  if (serialized.byteLength > Math.floor(MAX_BACKUP_BYTES * 0.7)) throw new Error('Dữ liệu sao lưu vượt quá giới hạn cho phép.');
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, serialized);
  return new Blob([JSON.stringify({ format: 'novastars-parent-backup', version: 1, salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(encrypted)) } satisfies BackupEnvelope)], { type: 'application/json' });
};

export const previewEncryptedBackup = async (file: Blob, password: string, storage: Storage = localStorage): Promise<BackupPreview> => {
  const payload = await decryptAndValidate(file, password, storage);
  const keys = Object.keys(payload.values).sort();
  return { exportedAt: payload.exportedAt, keyCount: keys.length, keys, mediaCount: payload.media?.length ?? 0 };
};

export const restoreEncryptedBackup = async (file: Blob, password: string, storage: Storage = localStorage, mediaStorage?: MediaStorageAdapter): Promise<void> => {
  const payload = await decryptAndValidate(file, password, storage);
  const entries = Object.entries(payload.values);
  const previous = new Map(entries.map(([name]) => [name, storage.getItem(name)]));
  const written: string[] = [];
  const media = payload.media ?? [];
  const resolvedMediaStorage = media.length ? (mediaStorage ?? getMediaStorage()) : undefined;
  const previousMedia = new Map<string, Blob | null>();
  const writtenMedia: BackupMedia[] = [];
  try {
    for (const item of media) {
      previousMedia.set(item.relativePath, await resolvedMediaStorage!.read(item.relativePath).catch(() => null));
      const bytes = base64ToBytes(item.data, 'media.data');
      await resolvedMediaStorage!.restore(item.relativePath, new Blob([bytes], { type: item.mimeType }), item.childId);
      writtenMedia.push(item);
    }
    for (const [name, raw] of entries) {
      storage.setItem(name, raw);
      written.push(name);
    }
  } catch (error) {
    for (const name of written.reverse()) {
      const oldValue = previous.get(name);
      try {
        if (oldValue === null || oldValue === undefined) storage.removeItem(name);
        else storage.setItem(name, oldValue);
      } catch { /* Best effort; preserve the original write error. */ }
    }
    for (const item of writtenMedia.reverse()) {
      try {
        const oldBlob = previousMedia.get(item.relativePath);
        if (oldBlob) await resolvedMediaStorage!.restore(item.relativePath, oldBlob, item.childId);
        else await resolvedMediaStorage!.delete(item.relativePath);
      } catch { /* Best effort; preserve the original write error. */ }
    }
    throw error;
  }
};
