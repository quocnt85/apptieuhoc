import React from 'react';
import * as THREE from 'three';
import { PERSONALIZATION_FEATURE_FLAGS } from '../../../config/personalizationFeatureFlags';
import { useParentZoneStore } from '../../../stores/useParentZoneStore';
import { usePersonalizationStore } from '../../../stores/usePersonalizationStore';
import { useLocalMediaTexture } from './useLocalMediaTexture';

export const ExplorerFlagDecal: React.FC<{ shipId: string }> = ({ shipId }) => {
  const childId = useParentZoneStore((state) => state.activeProfileId);
  const child = usePersonalizationStore((state) => state.children[childId]);
  const texture = useLocalMediaTexture(child?.flagReviewStatus === 'APPROVED_LOCAL' ? child.flagAssetId : null);
  const enabled = import.meta.env.DEV || PERSONALIZATION_FEATURE_FLAGS.explorerFlagDecal;
  if (!enabled || shipId !== 'explorer_v1' || child?.flagReviewStatus !== 'APPROVED_LOCAL' || !texture) return null;
  return <group data-testid="explorer-flag-decal">
    <mesh position={[0,0.17,0.16]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[0.46,0.3]}/><meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} toneMapped={false}/></mesh>
  </group>;
};
