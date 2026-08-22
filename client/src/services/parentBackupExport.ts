import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const safeFilename = (value: string) => {
  const sanitized = value.replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120);
  return sanitized.endsWith('.json') ? sanitized : `${sanitized || 'novastars-backup'}.json`;
};

export const exportEncryptedParentBackup = async (
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

  const path = `parent-backups/${crypto.randomUUID()}-${safeName}`;
  await Filesystem.writeFile({ path, directory: Directory.Cache, data: await blob.text(), encoding: Encoding.UTF8, recursive: true });
  try {
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Cache });
    await Share.share({
      title: 'Sao lưu mã hóa NovaStars',
      text: 'Tệp này được mã hóa bằng mật khẩu bạn vừa đặt.',
      files: [uri],
      dialogTitle: 'Lưu hoặc chia sẻ bản sao lưu',
    });
    return 'shared';
  } finally {
    await Filesystem.deleteFile({ path, directory: Directory.Cache }).catch(() => undefined);
  }
};
