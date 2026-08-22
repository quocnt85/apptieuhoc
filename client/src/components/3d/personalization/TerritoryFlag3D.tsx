import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PERSONALIZATION_FEATURE_FLAGS } from '../../../config/personalizationFeatureFlags';
import { useParentZoneStore } from '../../../stores/useParentZoneStore';
import { usePersonalizationStore } from '../../../stores/usePersonalizationStore';
import { useGameStore } from '../../../stores/useGameStore';
import { useLocalMediaTexture } from './useLocalMediaTexture';

export const TerritoryFlag3D: React.FC = () => {
  const childId = useParentZoneStore((state) => state.activeProfileId);
  const child = usePersonalizationStore((state) => state.children[childId]);
  const user = useGameStore((state) => state.user);
  const completedCount = useGameStore((state) => Object.keys(state.completedNodes).length);
  const [inspectOpen, setInspectOpen] = useState(false);
  const flagRef = useRef<THREE.Mesh>(null);
  const texture = useLocalMediaTexture(child?.flagReviewStatus === 'APPROVED_LOCAL' ? child.flagAssetId : null);
  const enabled = import.meta.env.DEV || PERSONALIZATION_FEATURE_FLAGS.territoryFlag;
  useFrame(({ clock }) => { if (flagRef.current) flagRef.current.rotation.y = Math.sin(clock.elapsedTime * 1.8) * 0.08; });
  if (!enabled || child?.flagReviewStatus !== 'APPROVED_LOCAL' || !texture) return null;
  return <group position={[0.12, 0.02, 0]} data-testid="territory-flag-3d">
    <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.006,0.008,0.24,8]}/><meshStandardMaterial color="#dbeafe" metalness={0.6} roughness={0.35}/></mesh>
    <mesh ref={flagRef} position={[0.07,0.19,0]} onClick={(event)=>{event.stopPropagation();setInspectOpen((value)=>!value);}}><planeGeometry args={[0.14,0.09]}/><meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false}/></mesh>
    {inspectOpen && <Html position={[0.08,0.31,0]} center distanceFactor={7} zIndexRange={[30,20]}><div data-testid="own-flag-achievement" className="w-40 rounded-xl border border-violet-300/60 bg-slate-950/95 p-2 text-center text-[10px] text-white shadow-xl"><div className="font-black text-violet-200">Cờ của {user.name}</div><div className="mt-1 text-slate-300">{completedCount} tọa độ đã hoàn thành</div><button onClick={()=>setInspectOpen(false)} className="mt-2 rounded-lg bg-violet-500 px-2 py-1 font-bold">Đóng</button></div></Html>}
  </group>;
};
