import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { getMediaStorage } from './mediaStorage';
import type { ProcessedImage } from '../../types/personalization';

export const shareCaptainId = async (image: ProcessedImage, filename: string) => {
  if (!Capacitor.isNativePlatform()) {
    const file = new File([image.blob], filename, { type: image.mimeType });
    if (navigator.share && navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: 'NovaStars Space ID' }); return 'shared' as const; }
    const uri=URL.createObjectURL(image.blob);const anchor=document.createElement('a');anchor.href=uri;anchor.download=filename;anchor.click();URL.revokeObjectURL(uri);return 'downloaded' as const;
  }
  const storage=getMediaStorage();const assetId=crypto.randomUUID();const stored=await storage.write(image,{childId:'export',assetId,kind:'CARD_EXPORT',area:'cache'});
  try { await Share.share({title:'NovaStars Space ID',files:[await storage.getRenderableUri(stored.relativePath)],dialogTitle:'Lưu hoặc chia sẻ Space ID'}); return 'shared' as const; }
  finally { await storage.delete(stored.relativePath).catch(()=>undefined); }
};
