import { describe, expect, it } from 'vitest';
import { createEncryptedBackup, previewEncryptedBackup, restoreEncryptedBackup } from '../src/services/parentBackup';
import { MemoryMediaStorage } from '../src/services/personalization/mediaStorage';

class MemoryStorage implements Storage {
  protected values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
}

describe('encrypted Parent Zone backup', () => {
  it('exports only approved local keys and restores after an explicit preview', async () => {
    const source = new MemoryStorage();
    source.setItem('novastars_parent_id', 'parent-1');
    source.setItem('novastars_parent_zone_v1', JSON.stringify({ profiles: [{ id: 'local-a' }] }));
    source.setItem('novastars_space_state_profile_local-a', JSON.stringify({ xp: 42 }));
    source.setItem('unrelated_secret', JSON.stringify({ mustNotExport: true }));
    const sourceMedia = new MemoryMediaStorage();
    const image = await sourceMedia.write({ blob: new Blob(['image-bytes'], { type: 'image/webp' }), mimeType: 'image/webp', width: 100, height: 100 }, { childId: 'local-a', assetId: 'avatar-a', kind: 'AVATAR_SOURCE' });
    source.setItem('novastars_personalization_v3', JSON.stringify({ state: { assets: [{ relativePath: image.relativePath, childId: 'local-a', mimeType: 'image/webp' }] }, version: 3 }));

    const backup = await createEncryptedBackup('strong-password', source, sourceMedia);
    const target = new MemoryStorage();
    const targetMedia = new MemoryMediaStorage();
    target.setItem('novastars_parent_id', 'parent-1');
    const preview = await previewEncryptedBackup(backup, 'strong-password', target);

    expect(preview.keyCount).toBe(3);
    expect(preview.mediaCount).toBe(1);
    expect(preview.keys).toEqual(['novastars_parent_zone_v1', 'novastars_personalization_v3', 'novastars_space_state_profile_local-a']);
    await restoreEncryptedBackup(backup, 'strong-password', target, targetMedia);
    expect(target.getItem('novastars_parent_zone_v1')).toContain('local-a');
    expect(target.getItem('novastars_space_state_profile_local-a')).toContain('42');
    expect(target.getItem('unrelated_secret')).toBeNull();
    expect(await (await targetMedia.read(image.relativePath)).text()).toBe('image-bytes');
  });

  it('rejects short passwords, incorrect passwords, malformed files and another account', async () => {
    const source = new MemoryStorage();
    source.setItem('novastars_parent_id', 'parent-1');
    source.setItem('novastars_parent_zone_v1', '{}');

    await expect(createEncryptedBackup('1234567', source)).rejects.toThrow('ít nhất 8');
    const backup = await createEncryptedBackup('strong-password', source);
    await expect(previewEncryptedBackup(backup, 'wrong-password', source)).rejects.toThrow('Không thể giải mã');
    await expect(previewEncryptedBackup(new Blob(['not-json']), 'strong-password', source)).rejects.toThrow('không phải JSON');

    const otherAccount = new MemoryStorage();
    otherAccount.setItem('novastars_parent_id', 'parent-2');
    await expect(restoreEncryptedBackup(backup, 'strong-password', otherAccount)).rejects.toThrow('tài khoản khác');
  });

  it('rejects a structurally valid backup whose encrypted payload was tampered with', async () => {
    const source = new MemoryStorage();
    source.setItem('novastars_parent_id', 'parent-1');
    source.setItem('novastars_parent_zone_v1', JSON.stringify({ profiles: [] }));
    const backup = await createEncryptedBackup('strong-password', source);
    const envelope = JSON.parse(await backup.text()) as { ciphertext: string };
    const replacement = envelope.ciphertext[0] === 'A' ? 'B' : 'A';
    envelope.ciphertext = `${replacement}${envelope.ciphertext.slice(1)}`;

    await expect(previewEncryptedBackup(new Blob([JSON.stringify(envelope)]), 'strong-password', source)).rejects.toThrow('Không thể giải mã');
  });

  it('rejects an oversized local image instead of creating an unusable backup', async () => {
    const source = new MemoryStorage();
    source.setItem('novastars_parent_id', 'parent-1');
    const media = new MemoryMediaStorage();
    const image = await media.write({ blob: new Blob([new Uint8Array(2 * 1024 * 1024 + 1)], { type: 'image/webp' }), mimeType: 'image/webp', width: 768, height: 1024 }, { childId: 'child-a', assetId: 'avatar-a', kind: 'AVATAR_SOURCE' });
    source.setItem('novastars_personalization_v3', JSON.stringify({ state: { assets: [{ relativePath: image.relativePath, childId: 'child-a', mimeType: 'image/webp' }] }, version: 3 }));

    await expect(createEncryptedBackup('strong-password', source, media)).rejects.toThrow('vượt quá giới hạn');
  });

  it('rolls back values already written when storage fails mid-restore', async () => {
    const source = new MemoryStorage();
    source.setItem('novastars_parent_id', 'parent-1');
    source.setItem('novastars_parent_zone_v1', JSON.stringify({ new: 1 }));
    source.setItem('novastars_space_state_v3', JSON.stringify({ new: 2 }));
    const sourceMedia = new MemoryMediaStorage();
    const image = await sourceMedia.write({ blob: new Blob(['new-image'], { type: 'image/webp' }), mimeType: 'image/webp', width: 100, height: 100 }, { childId: 'child-a', assetId: 'avatar-a', kind: 'AVATAR_SOURCE' });
    source.setItem('novastars_personalization_v3', JSON.stringify({ state: { assets: [{ relativePath: image.relativePath, childId: 'child-a', mimeType: 'image/webp' }] }, version: 3 }));
    const backup = await createEncryptedBackup('strong-password', source, sourceMedia);

    class FailingStorage extends MemoryStorage {
      private failed = false;
      override setItem(key: string, value: string) {
        if (key === 'novastars_space_state_v3' && !this.failed) {
          this.failed = true;
          throw new Error('quota exceeded');
        }
        super.setItem(key, value);
      }
    }
    const target = new FailingStorage();
    const targetMedia = new MemoryMediaStorage();
    target.setItem('novastars_parent_id', 'parent-1');
    target.setItem('novastars_parent_zone_v1', JSON.stringify({ old: 1 }));
    await targetMedia.restore(image.relativePath, new Blob(['old-image'], { type: 'image/webp' }), 'child-a');

    await expect(restoreEncryptedBackup(backup, 'strong-password', target, targetMedia)).rejects.toThrow('quota exceeded');
    expect(target.getItem('novastars_parent_zone_v1')).toBe(JSON.stringify({ old: 1 }));
    expect(target.getItem('novastars_space_state_v3')).toBeNull();
    expect(await (await targetMedia.read(image.relativePath)).text()).toBe('old-image');
  });
});
