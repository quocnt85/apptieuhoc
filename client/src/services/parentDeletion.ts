import { clearNovaStarsLocalData } from './parentLocalData';

type ParentDeletionDependencies = {
  deleteRemote: () => Promise<unknown>;
  clearMedia: () => Promise<string[]>;
  storage?: Storage;
};

export type ParentDeletionResult = {
  remoteConfirmed: boolean;
  removedLocalKeys: string[];
  mediaFailures: string[];
  warnings: string[];
};

export const deleteParentAccountAndLocalData = async ({
  deleteRemote,
  clearMedia,
  storage = localStorage,
}: ParentDeletionDependencies): Promise<ParentDeletionResult> => {
  let remoteConfirmed = false;
  let mediaFailures: string[] = [];
  const warnings: string[] = [];
  try {
    await deleteRemote();
    remoteConfirmed = true;
  } catch {
    warnings.push('Máy chủ chưa xác nhận xóa tài khoản; bạn có thể đăng nhập lại để thử xóa server sau.');
  }
  try {
    mediaFailures = await clearMedia();
    if (mediaFailures.length) warnings.push(`Còn ${mediaFailures.length} tệp media local chưa xóa được.`);
  } catch {
    warnings.push('Không thể xác nhận đã xóa hết media local.');
  }
  const removedLocalKeys = clearNovaStarsLocalData(storage);
  return { remoteConfirmed, removedLocalKeys, mediaFailures, warnings };
};
