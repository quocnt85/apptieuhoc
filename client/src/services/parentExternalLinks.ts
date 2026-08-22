import { Browser } from '@capacitor/browser';
import type { ParentGuideExternalSource } from '../content/parentGuides';

const APPROVED_PARENT_SOURCE_URLS = new Set([
  new URL('https://www.unicef.org/parenting/child-care/keep-your-child-safe-online').href,
]);

export const isApprovedParentExternalUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:'
      && !parsed.username
      && !parsed.password
      && APPROVED_PARENT_SOURCE_URLS.has(parsed.href);
  } catch {
    return false;
  }
};
type BrowserOpener = (options: { url: string; windowName: string; toolbarColor: string }) => Promise<void>;

export const openApprovedParentExternalSource = async (
  source: ParentGuideExternalSource,
  reauthenticate: () => Promise<unknown>,
  openBrowser: BrowserOpener = (options) => Browser.open(options),
): Promise<void> => {
  if (!isApprovedParentExternalUrl(source.url)) {
    throw new Error('Liên kết này chưa nằm trong danh sách nguồn được duyệt.');
  }
  await reauthenticate();
  await openBrowser({ url: source.url, windowName: '_blank', toolbarColor: '#0f172a' });
};
