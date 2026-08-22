import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PERSONALIZATION_FEATURE_FLAGS } from '../../../config/personalizationFeatureFlags';
import { useParentZoneStore } from '../../../stores/useParentZoneStore';
import { usePersonalizationStore } from '../../../stores/usePersonalizationStore';
import { useLocalMediaTexture } from './useLocalMediaTexture';

export const TerritoryFlag3D: React.FC = () => {
  const childId = useParentZoneStore((state) => state.activeProfileId);
  const child = usePersonalizationStore((state) => state.children[childId]);
  const flagRef = useRef<THREE.Mesh>(null);
  const texture = useLocalMediaTexture(child?.flagReviewStatus === 'APPROVED_LOCAL' ? child.flagAssetId : null);
  const enabled = import.meta.env.DEV || PERSONALIZATION_FEATURE_FLAGS.territoryFlag;
  useFrame(({ clock }) => { if (flagRef.current) flagRef.current.rotation.y = Math.sin(clock.elapsedTime * 1.8) * 0.08; });
  if (!enabled || child?.flagReviewStatus !== 'APPROVED_LOCAL' || !texture) return null;
  return <group position={[0.12, 0.02, 0]} data-testid="territory-flag-3d">
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.006,0.008,0.24,8]}/><meshStandardMaterial color="#dbeafe" metalness={0.6} roughness={0.35}/></mesh>
    <mesh ref={flagRef} position={[0.07,0.19,0]}><planeGeometry args={[0.14,0.09]}/><meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false}/></mesh>
  </group>;
};
