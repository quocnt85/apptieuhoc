import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PlanetCoordinateNode } from '../../types';
import { useGameStore } from '../../stores/useGameStore';
import { Lock, Star, Crown } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  node: PlanetCoordinateNode;
  index?: number;
  radius: number;
  onSelectNode: (node: PlanetCoordinateNode) => void;
}

export const LessonCoordinatesMarker: React.FC<Props> = ({ node, index = 1, radius, onSelectNode }) => {
  const { completedNodes, nodeStars, user, selectedCoordinateNode, isLessonRunning } = useGameStore();
  const hasOverlay = Boolean(selectedCoordinateNode || isLessonRunning);
  const markerGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Convert lat/lon to 3D Cartesian vector directly on sphere surface
  const phi = node.lat; // latitude (-PI/2 to PI/2)
  const theta = node.lon; // longitude (-PI to PI)
  const surfaceRadius = radius * 1.008; // Anchored directly on terrain surface

  const x = surfaceRadius * Math.cos(phi) * Math.sin(theta);
  const y = surfaceRadius * Math.sin(phi);
  const z = surfaceRadius * Math.cos(phi) * Math.cos(theta);
  const position: [number, number, number] = [x, y, z];

  // Normal vector for orienting marker upright relative to sphere
  const normal = new THREE.Vector3(x, y, z).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);

  const isCompleted = Boolean(completedNodes[node.id]);
  const starsEarned = nodeStars[node.id] || (isCompleted ? 3 : 0);
  const isUnlocked = user.stars >= (node.starsRequiredToUnlock || 0);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.getElapsedTime() * 3;
      const s = 1 + Math.sin(t) * 0.12;
      ringRef.current.scale.set(s, s, s);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation?.();
    if (!isUnlocked) {
      soundService.playWrong();
      return;
    }
    soundService.playSelect();
    onSelectNode(node);
  };

  const displayText = node.isBoss ? '👑' : `${index}`;

  return (
    <group ref={markerGroupRef} position={position} quaternion={quaternion}>
      {/* Ground Glowing Disc Ring (Sát mặt đất) */}
      <mesh ref={ringRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleClick}>
        <ringGeometry args={[0.06, 0.11, 24]} />
        <meshBasicMaterial
          color={node.isBoss ? '#fb7185' : isCompleted ? '#34d399' : isUnlocked ? '#38bdf8' : '#64748b'}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Minimalist Flat Ground Pin Icon */}
      <Html position={[0, 0.05, 0]} center distanceFactor={7} zIndexRange={[100, 0]}>
        <button
          type="button"
          disabled={hasOverlay}
          onClick={handleClick}
          title={node.title}
          className={`select-none transition-all duration-200 flex flex-col items-center justify-center bg-transparent border-0 p-0 ${
            hasOverlay ? 'pointer-events-none opacity-40' : 'pointer-events-auto cursor-pointer hover:scale-115 active:scale-95'
          } ${
            isUnlocked ? 'opacity-100' : 'opacity-65 grayscale'
          }`}
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {/* Circular Ground Pin Badge */}
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-md border-2 relative transition-all ${
              node.isBoss
                ? 'bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 border-yellow-300 text-yellow-100 shadow-rose-500/60 animate-pulse'
                : isCompleted
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700 border-emerald-200 text-white shadow-emerald-500/50'
                : isUnlocked
                ? 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-white text-white shadow-sky-500/60 animate-bounce-slow'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            {isUnlocked ? (
              <span>{displayText}</span>
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-300" />
            )}

            {/* Tiny Star Rating Badge */}
            {isCompleted && (
              <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 px-1 py-0.2 rounded-full text-[8px] font-black flex items-center border border-white shadow">
                ★{starsEarned}
              </div>
            )}
          </div>
        </button>
      </Html>
    </group>
  );
};

