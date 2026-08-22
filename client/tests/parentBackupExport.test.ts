import { beforeEach, describe, expect, it, vi } from 'vitest';

const filesystem = vi.hoisted(() => ({ writeFile: vi.fn(), getUri: vi.fn(), deleteFile: vi.fn() }));
const share = vi.hoisted(() => ({ share: vi.fn() }));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));
vi.mock('@capacitor/filesystem', () => ({ Directory: { Cache: 'CACHE' }, Encoding: { UTF8: 'utf8' }, Filesystem: filesystem }));
vi.mock('@capacitor/share', () => ({ Share: share }));

describe('native encrypted backup export', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    filesystem.writeFile.mockResolvedValue(undefined);
    filesystem.getUri.mockResolvedValue({ uri: 'content://novastars/backup.json' });
    filesystem.deleteFile.mockResolvedValue(undefined);
    share.share.mockResolvedValue({ activityType: 'saved' });
  });

  it('shares from app cache and removes the temporary encrypted file', async () => {
    const { exportEncryptedParentBackup } = await import('../src/services/parentBackupExport');
    await expect(exportEncryptedParentBackup(new Blob(['encrypted-json']), 'backup.json')).resolves.toBe('shared');

    expect(filesystem.writeFile).toHaveBeenCalledWith(expect.objectContaining({ directory: 'CACHE', data: 'encrypted-json', recursive: true }));
    expect(share.share).toHaveBeenCalledWith(expect.objectContaining({ files: ['content://novastars/backup.json'] }));
    expect(filesystem.deleteFile).toHaveBeenCalledWith(expect.objectContaining({ directory: 'CACHE' }));
  });

  it('still removes the temporary file when the share sheet is cancelled', async () => {
    share.share.mockRejectedValue(new Error('cancelled'));
    const { exportEncryptedParentBackup } = await import('../src/services/parentBackupExport');

    await expect(exportEncryptedParentBackup(new Blob(['encrypted-json']), 'backup.json')).rejects.toThrow('cancelled');
    expect(filesystem.deleteFile).toHaveBeenCalledOnce();
  });
});
