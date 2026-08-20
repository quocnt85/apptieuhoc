import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PlanetCoordinateNode } from '../../types';
import { useGameStore } from '../../stores/useGameStore';
import { Lock, Star } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  node: PlanetCoordinateNode;
  radius: number;
  onSelectNode: (node: PlanetCoordinateNode) => void;
}

export const LessonCoordinatesMarker: React.FC<Props> = ({ node, radius, onSelectNode }) => {
  const { completedNodes, nodeStars, user, selectedCoordinateNode, isLessonRunning } = useGameStore();
  const hasOverlay = Boolean(selectedCoordinateNode || isLessonRunning);
  const markerGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Convert lat/lon to 3D Cartesian vector on sphere surface
  const phi = node.lat; // latitude (-PI/2 to PI/2)
  const theta = node.lon; // longitude (-PI to PI)
  const surfaceRadius = radius * 1.02; // Slightly above ground

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
      const s = 1 + Math.sin(t) * 0.15;
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

  return (
    <group ref={markerGroupRef} position={position} quaternion={quaternion}>
      {/* 3D Ground Beacon Cylinder */}
      <mesh position={[0, 0.05, 0]} onClick={handleClick}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial
          color={node.isBoss ? '#f43f5e' : isCompleted ? '#10b981' : isUnlocked ? '#38bdf8' : '#64748b'}
          emissive={node.isBoss ? '#e11d48' : isCompleted ? '#059669' : isUnlocked ? '#0284c7' : '#334155'}
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* 3D Pulsing Ground Ring */}
      <mesh ref={ringRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleClick}>
        <ringGeometry args={[0.12, 0.18, 24]} />
        <meshBasicMaterial
          color={node.isBoss ? '#fb7185' : isCompleted ? '#34d399' : isUnlocked ? '#67e8f9' : '#94a3b8'}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interactive HTML UI Tag anchored above marker */}
      <Html position={[0, 0.45, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <button
          type="button"
          disabled={hasOverlay}
          onClick={handleClick}
          className={`select-none transition-all duration-200 flex flex-col items-center gap-0.5 bg-transparent border-0 p-0 ${
            hasOverlay ? 'pointer-events-none opacity-40' : 'pointer-events-auto cursor-pointer hover:scale-110 active:scale-95'
          } ${
            isUnlocked ? 'opacity-100' : 'opacity-70 grayscale'
          }`}
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border-2 relative ${
              node.isBoss
                ? 'bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 border-yellow-300 shadow-red-500/50 animate-pulse'
                : isCompleted
                ? 'bg-gradient-to-br from-emerald-400 to-teal-600 border-emerald-200 shadow-emerald-500/40'
                : isUnlocked
                ? 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-sky-200 shadow-sky-500/50 animate-bounce-slow'
                : 'bg-slate-800 border-slate-600 text-slate-400'
            }`}
          >
            {isUnlocked ? (
              <span>{node.icon}</span>
            ) : (
              <Lock className="w-5 h-5 text-slate-300" />
            )}

            {/* Star Rating Badge */}
            {isCompleted && (
              <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-0.5 border border-white shadow">
                <Star className="w-2.5 h-2.5 fill-amber-950" />
                <span>{starsEarned}</span>
              </div>
            )}
          </div>

          <span className="bg-slate-950/85 backdrop-blur-md text-white font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap shadow-md mt-1">
            {node.title.split(':')[0]}
          </span>
        </button>
      </Html>
    </group>
  );
};
