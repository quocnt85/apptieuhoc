import { describe, expect, it, vi } from 'vitest';
import { MemoryMediaStorage } from '../src/services/personalization/mediaStorage';

const image = (content = 'pixel') => ({
  blob: new Blob([content], { type: 'image/webp' }),
  mimeType: 'image/webp' as const,
  width: 768,
  height: 1024,
});

describe('MemoryMediaStorage', () => {
  it('keeps binary out of metadata paths and isolates child files', async () => {
    const storage = new MemoryMediaStorage();
    const first = await storage.write(image(), { childId: 'child-a', assetId: 'avatar-a', kind: 'AVATAR_SOURCE' });
    await storage.write(image('other'), { childId: 'child-b', assetId: 'avatar-b', kind: 'AVATAR_SOURCE' });

    expect(first.relativePath).not.toContain('base64');
    expect(await storage.list('child-a')).toEqual([first.relativePath]);
    expect(await (await storage.read(first.relativePath)).text()).toBe('pixel');
  });

  it('makes delete and clearChild idempotent', async () => {
    const storage = new MemoryMediaStorage();
    const stored = await storage.write(image(), { childId: 'child-a', assetId: 'flag-a', kind: 'FLAG_SOURCE' });
    await storage.delete(stored.relativePath);
    await storage.delete(stored.relativePath);
    await expect(storage.clearChild('child-a')).resolves.toEqual({ deleted: [], failed: [] });
  });

  it('cleans only expired cache exports', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const storage = new MemoryMediaStorage();
    const oldExport = await storage.write(image(), { childId: 'child-a', assetId: 'export-a', kind: 'CARD_EXPORT' });
    const library = await storage.write(image(), { childId: 'child-a', assetId: 'avatar-a', kind: 'AVATAR_SOURCE' });
    await storage.clearExpiredExports(1_000 + 24 * 60 * 60_000 + 1);
    await expect(storage.read(oldExport.relativePath)).rejects.toThrow('missing');
    await expect(storage.read(library.relativePath)).resolves.toBeInstanceOf(Blob);
    vi.restoreAllMocks();
  });

  it('removes media for every child during account deletion', async () => {
    const storage = new MemoryMediaStorage();
    const first = await storage.write(image(), { childId: 'child-a', assetId: 'avatar-a', kind: 'AVATAR_SOURCE' });
    const second = await storage.write(image(), { childId: 'child-b', assetId: 'flag-b', kind: 'FLAG_SOURCE' });

    await expect(storage.clearAll()).resolves.toEqual({ deleted: [first.relativePath, second.relativePath], failed: [] });
    await expect(storage.read(first.relativePath)).rejects.toThrow('missing');
    await expect(storage.read(second.relativePath)).rejects.toThrow('missing');
  });
});
