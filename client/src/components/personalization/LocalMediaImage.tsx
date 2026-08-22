import React, { useEffect, useState } from 'react';
import { getMediaStorage } from '../../services/personalization/mediaStorage';
import { usePersonalizationStore } from '../../stores/usePersonalizationStore';

export const LocalMediaImage: React.FC<{
  assetId: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}> = ({ assetId, alt, className, fallback = null }) => {
  const asset = usePersonalizationStore((state) => state.assets.find((item) => item.id === assetId));
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true; let current: string | null = null;
    if (!asset) { setSrc(null); return; }
    void getMediaStorage().getRenderableUri(asset.relativePath).then((uri) => {
      current = uri;
      if (active) setSrc(uri); else if (uri.startsWith('blob:')) URL.revokeObjectURL(uri);
    }).catch(() => { if (active) setSrc(null); });
    return () => { active = false; if (current?.startsWith('blob:')) URL.revokeObjectURL(current); };
  }, [asset?.relativePath]);

  return src ? <img src={src} alt={alt} className={className} /> : <>{fallback}</>;
};
