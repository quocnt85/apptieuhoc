import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import type { MediaStorageArea, MediaTarget, ProcessedImage, StoredMedia } from '../../types/personalization';

const DB_NAME = 'novastars-local-media';
const STORE_NAME = 'media';
const ROOT = 'personalization';
const EXPORT_ROOT = 'personalization-export';

type MediaRecord = { key: string; blob?: Blob; data?: ArrayBuffer; mimeType: string; childId: string; area: MediaStorageArea; createdAt: number };

export interface MediaStorageAdapter {
  write(asset: ProcessedImage, target: MediaTarget): Promise<StoredMedia>;
  read(relativePath: string): Promise<Blob>;
  restore(relativePath: string, blob: Blob, childId: string): Promise<void>;
  getRenderableUri(relativePath: string): Promise<string>;
  delete(relativePath: string): Promise<void>;
  list(childId: string): Promise<string[]>;
  clearChild(childId: string): Promise<{ deleted: string[]; failed: string[] }>;
  clearAll(): Promise<{ deleted: string[]; failed: string[] }>;
  clearExpiredExports(now: number): Promise<void>;
}

const safeSegment = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
const extensionFor = (mimeType: ProcessedImage['mimeType']) => mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
const keyFor = (target: MediaTarget, mimeType: ProcessedImage['mimeType']) => {
  const area = target.area ?? (target.kind === 'CARD_EXPORT' ? 'cache' : 'library');
  const name = `${Date.now()}-${safeSegment(target.assetId)}.${extensionFor(mimeType)}`;
  const path = area === 'cache'
    ? `${EXPORT_ROOT}/${safeSegment(target.childId)}-${name}`
    : `${ROOT}/${safeSegment(target.childId)}/${name}`;
  return `${area}:${path}`;
};

const parseKey = (relativePath: string) => {
  const separator = relativePath.indexOf(':');
  if (separator <= 0) throw new Error('Invalid local media path.');
  const area = relativePath.slice(0, separator) as MediaStorageArea;
  if (area !== 'library' && area !== 'cache') throw new Error('Unsupported local media area.');
  return { area, path: relativePath.slice(separator + 1) };
};

const openDb = () => new Promise<IDBDatabase>((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'key' });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('Cannot open local media database.'));
});

const withStore = async <T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    let result: T;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error ?? new Error('Local media database operation failed.'));
    transaction.oncomplete = () => { db.close(); resolve(result); };
    transaction.onerror = () => { db.close(); reject(transaction.error ?? new Error('Local media transaction failed.')); };
  });
};

export class IndexedDbMediaStorage implements MediaStorageAdapter {
  async write(asset: ProcessedImage, target: MediaTarget) {
    const key = keyFor(target, asset.mimeType);
    const { area } = parseKey(key);
    // ArrayBuffer is used instead of Blob because older WebKit builds cannot
    // structured-clone Blob/File values into IndexedDB reliably.
    const data = await asset.blob.arrayBuffer();
    await withStore('readwrite', (store) => store.put({ key, data, mimeType: asset.mimeType, childId: target.childId, area, createdAt: Date.now() } satisfies MediaRecord));
    return { relativePath: key, area, byteSize: asset.blob.size };
  }

  async read(relativePath: string) {
    const record = await withStore<MediaRecord | undefined>('readonly', (store) => store.get(relativePath));
    if (!record) throw new Error('Local media file is missing.');
    if (record.blob) return record.blob; // Migration support for early Phase 0 records.
    if (record.data) return new Blob([record.data], { type: record.mimeType });
    throw new Error('Local media file is missing.');
  }

  async getRenderableUri(relativePath: string) { return URL.createObjectURL(await this.read(relativePath)); }

  async delete(relativePath: string) { await withStore('readwrite', (store) => store.delete(relativePath)); }

  async records() {
    return withStore<MediaRecord[]>('readonly', (store) => store.getAll());
  }

  async list(childId: string) { return (await this.records()).filter((record) => record.childId === childId).map((record) => record.key); }

  async clearChild(childId: string) {
    const paths = await this.list(childId); const deleted: string[] = []; const failed: string[] = [];
    for (const path of paths) {
      try { await this.delete(path); deleted.push(path); } catch { failed.push(path); }
    }
    return { deleted, failed };
  }

  async restore(relativePath: string, blob: Blob, childId: string) {
    const { area } = parseKey(relativePath);
    if (area !== 'library') throw new Error('Only library media can be restored.');
    const data = await blob.arrayBuffer();
    await withStore('readwrite', (store) => store.put({ key: relativePath, data, mimeType: blob.type, childId, area, createdAt: Date.now() } satisfies MediaRecord));
  }

  async clearAll() {
    const paths = (await this.records()).map((record) => record.key); const deleted: string[] = []; const failed: string[] = [];
    for (const path of paths) { try { await this.delete(path); deleted.push(path); } catch { failed.push(path); } }
    return { deleted, failed };
  }

  async clearExpiredExports(now: number) {
    const expiry = now - 24 * 60 * 60_000;
    for (const record of (await this.records()).filter((item) => item.area === 'cache' && item.createdAt < expiry)) await this.delete(record.key);
  }
}

const blobToBase64 = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return btoa(binary);
};

const base64ToBlob = (value: string, mimeType = 'application/octet-stream') => {
  const binary = atob(value); const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mimeType });
};

const directoryFor = (area: MediaStorageArea) => area === 'cache' ? Directory.Cache : Directory.Library;
const mimeTypeForPath = (path: string) => path.endsWith('.png') ? 'image/png' : path.endsWith('.webp') ? 'image/webp' : path.endsWith('.jpg') || path.endsWith('.jpeg') ? 'image/jpeg' : 'application/octet-stream';

export class NativeMediaStorage implements MediaStorageAdapter {
  async write(asset: ProcessedImage, target: MediaTarget) {
    const relativePath = keyFor(target, asset.mimeType); const { area, path } = parseKey(relativePath);
    await Filesystem.writeFile({ path, directory: directoryFor(area), data: await blobToBase64(asset.blob), recursive: true });
    return { relativePath, area, byteSize: asset.blob.size };
  }

  async read(relativePath: string) {
    const { area, path } = parseKey(relativePath);
    const result = await Filesystem.readFile({ path, directory: directoryFor(area) });
    return result.data instanceof Blob ? result.data : base64ToBlob(result.data, mimeTypeForPath(path));
  }

  async getRenderableUri(relativePath: string) {
    const { area, path } = parseKey(relativePath);
    const { uri } = await Filesystem.getUri({ path, directory: directoryFor(area) });
    return Capacitor.convertFileSrc(uri);
  }

  async delete(relativePath: string) {
    const { area, path } = parseKey(relativePath);
    try { await Filesystem.deleteFile({ path, directory: directoryFor(area) }); }
    catch (error) { if (!String(error).toLowerCase().includes('not found')) throw error; }
  }

  async list(childId: string) {
    const directory = `${ROOT}/${safeSegment(childId)}`;
    try {
      const result = await Filesystem.readdir({ path: directory, directory: Directory.Library });
      return result.files.filter((file) => file.type === 'file').map((file) => `library:${directory}/${file.name}`);
    } catch (error) {
      if (String(error).toLowerCase().includes('not found')) return [];
      throw error;
    }
  }

  async clearChild(childId: string) {
    const paths = await this.list(childId); const deleted: string[] = []; const failed: string[] = [];
    for (const path of paths) { try { await this.delete(path); deleted.push(path); } catch { failed.push(path); } }
    return { deleted, failed };
  }

  async restore(relativePath: string, blob: Blob, childId: string) {
    const { area, path } = parseKey(relativePath);
    const childRoot = `${ROOT}/${safeSegment(childId)}/`;
    if (area !== 'library' || !path.startsWith(childRoot) || path.includes('..')) throw new Error('Invalid media restore path.');
    await Filesystem.writeFile({ path, directory: Directory.Library, data: await blobToBase64(blob), recursive: true });
  }

  async clearAll() {
    const deleted: string[] = []; const failed: string[] = [];
    try {
      const result = await Filesystem.readdir({ path: ROOT, directory: Directory.Library });
      for (const entry of result.files) {
        const path = `${ROOT}/${entry.name}`;
        try {
          if (entry.type === 'directory') await Filesystem.rmdir({ path, directory: Directory.Library, recursive: true });
          else await Filesystem.deleteFile({ path, directory: Directory.Library });
          deleted.push(`library:${path}`);
        } catch { failed.push(`library:${path}`); }
      }
    } catch (error) {
      if (!String(error).toLowerCase().includes('not found')) failed.push(`library:${ROOT}`);
    }
    return { deleted, failed };
  }

  async clearExpiredExports(now: number) {
    try {
      const result = await Filesystem.readdir({ path: EXPORT_ROOT, directory: Directory.Cache });
      for (const file of result.files) if (file.type === 'file' && (file.mtime || 0) < now - 24 * 60 * 60_000) {
        await this.delete(`cache:${EXPORT_ROOT}/${file.name}`);
      }
    } catch (error) {
      if (!String(error).toLowerCase().includes('not found')) throw error;
    }
  }
}

export class MemoryMediaStorage implements MediaStorageAdapter {
  private records = new Map<string, MediaRecord>();
  async write(asset: ProcessedImage, target: MediaTarget) { const key = keyFor(target, asset.mimeType); const { area } = parseKey(key); this.records.set(key, { key, blob: asset.blob, mimeType: asset.mimeType, childId: target.childId, area, createdAt: Date.now() }); return { relativePath: key, area, byteSize: asset.blob.size }; }
  async read(path: string) { const value = this.records.get(path); if (!value?.blob) throw new Error('Local media file is missing.'); return value.blob; }
  async restore(path: string, blob: Blob, childId: string) { const { area } = parseKey(path); if (area !== 'library') throw new Error('Only library media can be restored.'); this.records.set(path, { key: path, blob, mimeType: blob.type, childId, area, createdAt: Date.now() }); }
  async getRenderableUri(path: string) { return `memory://${encodeURIComponent(path)}`; }
  async delete(path: string) { this.records.delete(path); }
  async list(childId: string) { return [...this.records.values()].filter((item) => item.childId === childId).map((item) => item.key); }
  async clearChild(childId: string) { const deleted = await this.list(childId); deleted.forEach((path) => this.records.delete(path)); return { deleted, failed: [] }; }
  async clearAll() { const deleted = [...this.records.keys()]; this.records.clear(); return { deleted, failed: [] }; }
  async clearExpiredExports(now: number) { for (const [key, value] of this.records) if (value.area === 'cache' && value.createdAt < now - 24 * 60 * 60_000) this.records.delete(key); }
}

let adapter: MediaStorageAdapter | null = null;
export const getMediaStorage = () => adapter ??= Capacitor.isNativePlatform() ? new NativeMediaStorage() : new IndexedDbMediaStorage();
export const setMediaStorageForTests = (value: MediaStorageAdapter | null) => { adapter = value; };
