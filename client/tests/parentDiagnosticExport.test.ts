import { beforeEach, describe, expect, it, vi } from 'vitest';

const filesystem = vi.hoisted(() => ({ writeFile: vi.fn(), getUri: vi.fn(), deleteFile: vi.fn() }));
const share = vi.hoisted(() => ({ share: vi.fn() }));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));
vi.mock('@capacitor/filesystem', () => ({ Directory: { Cache: 'CACHE' }, Encoding: { UTF8: 'utf8' }, Filesystem: filesystem }));
vi.mock('@capacitor/share', () => ({ Share: share }));

describe('native local diagnostic export', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    filesystem.writeFile.mockResolvedValue(undefined);
    filesystem.getUri.mockResolvedValue({ uri: 'content://novastars/diagnostics.json' });
    filesystem.deleteFile.mockResolvedValue(undefined);
    share.share.mockResolvedValue({ activityType: 'saved' });
  });

  it('shares from app cache and always removes the temporary report', async () => {
    const { exportParentDiagnosticReport } = await import('../src/services/parentDiagnosticExport');
    await expect(exportParentDiagnosticReport(new Blob(['aggregate-json']), 'diagnostics.json')).resolves.toBe('shared');
    expect(filesystem.writeFile).toHaveBeenCalledWith(expect.objectContaining({ directory: 'CACHE', data: 'aggregate-json', recursive: true }));
    expect(share.share).toHaveBeenCalledWith(expect.objectContaining({ files: ['content://novastars/diagnostics.json'] }));
    expect(filesystem.deleteFile).toHaveBeenCalledOnce();
  });

  it('removes the temporary report when the share sheet is cancelled', async () => {
    share.share.mockRejectedValue(new Error('cancelled'));
    const { exportParentDiagnosticReport } = await import('../src/services/parentDiagnosticExport');
    await expect(exportParentDiagnosticReport(new Blob(['aggregate-json']), 'diagnostics.json')).rejects.toThrow('cancelled');
    expect(filesystem.deleteFile).toHaveBeenCalledOnce();
  });
});
