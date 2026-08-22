import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const safeFilename = (value: string) => {
  const sanitized = value.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120);
  return sanitized.endsWith('.json') ? sanitized : `${sanitized || 'novastars-diagnostics'}.json`;
};

export const exportParentDiagnosticReport = async (
  blob: Blob,
  filename: string,
): Promise<'downloaded' | 'shared'> => {
  const safeName = safeFilename(filename);
  if (!Capacitor.isNativePlatform()) {
    const url = URL.createObjectURL(blob);
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = safeName;
      anchor.click();
      return 'downloaded';
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const path = `parent-diagnostics/${crypto.randomUUID()}-${safeName}`;
  await Filesystem.writeFile({ path, directory: Directory.Cache, data: await blob.text(), encoding: Encoding.UTF8, recursive: true });
  try {
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
    await Share.share({
      title: 'Báo cáo chẩn đoán local NovaStars',
      text: 'Tệp chỉ chứa số liệu tổng hợp đã được phụ huynh đồng ý xuất và không được tự động tải lên.',
      files: [uri],
      dialogTitle: 'Lưu hoặc chia sẻ báo cáo chẩn đoán',
    });
    return 'shared';
  } finally {
    await Filesystem.deleteFile({ path, directory: Directory.Cache }).catch(() => undefined);
  }
};
