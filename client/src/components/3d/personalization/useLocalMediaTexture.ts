import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { getMediaStorage } from '../../../services/personalization/mediaStorage';
import { usePersonalizationStore } from '../../../stores/usePersonalizationStore';

type TextureEntry = { refs: number; uri: string | null; texture: THREE.Texture | null; promise: Promise<THREE.Texture> };
const registry = new Map<string, TextureEntry>();

const acquireTexture = (relativePath: string) => {
  const existing = registry.get(relativePath);
  if (existing) { existing.refs += 1; return existing.promise; }
  const entry: TextureEntry = { refs: 1, uri: null, texture: null, promise: Promise.resolve(null as unknown as THREE.Texture) };
  entry.promise = getMediaStorage().getRenderableUri(relativePath).then(async (uri) => {
    entry.uri = uri;
    const texture = await new THREE.TextureLoader().loadAsync(uri);
    texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true; entry.texture = texture;
    if (entry.refs === 0) { texture.dispose(); if (uri.startsWith('blob:')) URL.revokeObjectURL(uri); registry.delete(relativePath); }
    return texture;
  }).catch((error) => { registry.delete(relativePath); throw error; });
  registry.set(relativePath, entry);
  return entry.promise;
};

const releaseTexture = (relativePath: string) => {
  const entry = registry.get(relativePath); if (!entry) return;
  entry.refs = Math.max(0, entry.refs - 1);
  if (entry.refs === 0 && entry.texture) {
    entry.texture.dispose(); if (entry.uri?.startsWith('blob:')) URL.revokeObjectURL(entry.uri); registry.delete(relativePath);
  }
};

export const useLocalMediaTexture = (assetId: string | null | undefined) => {
  const asset = usePersonalizationStore((state) => state.assets.find((item) => item.id === assetId));
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let disposed = false;
    if (!asset) { setTexture(null); return; }
    void acquireTexture(asset.relativePath).then((loaded) => {
      if (!disposed) setTexture(loaded);
    }).catch(() => { if (!disposed) setTexture(null); });
    return () => { disposed = true; releaseTexture(asset.relativePath); };
  }, [asset?.id, asset?.relativePath]);
  return texture;
};
