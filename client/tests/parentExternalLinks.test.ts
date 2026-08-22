import { describe, expect, it, vi } from 'vitest';
import { isApprovedParentExternalUrl, openApprovedParentExternalSource } from '../src/services/parentExternalLinks';

const approvedSource = {
  label: 'Cách giúp trẻ an toàn trên mạng',
  publisher: 'UNICEF',
  url: 'https://www.unicef.org/parenting/child-care/keep-your-child-safe-online',
};

describe('Parent Guide external-link gate', () => {
  it('allows only the exact reviewed HTTPS source without credentials or query data', () => {
    expect(isApprovedParentExternalUrl(approvedSource.url)).toBe(true);
    expect(isApprovedParentExternalUrl('http://www.unicef.org/parenting/child-care/keep-your-child-safe-online')).toBe(false);
    expect(isApprovedParentExternalUrl(`${approvedSource.url}?child=Bé%20An`)).toBe(false);
    expect(isApprovedParentExternalUrl('https://evil.example/redirect?to=unicef.org')).toBe(false);
    expect(isApprovedParentExternalUrl('not-a-url')).toBe(false);
  });

  it('reauthenticates before opening the approved source', async () => {
    const calls: string[] = [];
    await openApprovedParentExternalSource(
      approvedSource,
      async () => { calls.push('reauth'); },
      async ({ url, windowName }) => { calls.push(`open:${url}:${windowName}`); },
    );
    expect(calls).toEqual(['reauth', `open:${approvedSource.url}:_blank`]);
  });

  it('does not reauthenticate or open an unreviewed URL', async () => {
    const reauthenticate = vi.fn(async () => undefined);
    const open = vi.fn(async () => undefined);
    await expect(openApprovedParentExternalSource(
      { ...approvedSource, url: 'https://example.com' },
      reauthenticate,
      open,
    )).rejects.toThrow('chưa nằm trong danh sách');
    expect(reauthenticate).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
  });

  it('does not open when reauthentication fails', async () => {
    const open = vi.fn(async () => undefined);
    await expect(openApprovedParentExternalSource(
      approvedSource,
      async () => { throw new Error('Mật khẩu demo không đúng.'); },
      open,
    )).rejects.toThrow('Mật khẩu demo không đúng');
    expect(open).not.toHaveBeenCalled();
  });
});
