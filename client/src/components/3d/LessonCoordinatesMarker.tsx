import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PlanetCoordinateNode } from '../../types';
import { useGameStore } from '../../stores/useGameStore';
import { Lock, Star, Crown, Zap } from 'lucide-react';
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
  const beaconRef = useRef<THREE.Mesh>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  // Scratch vectors to avoid garbage collection per frame
  const worldPos = useRef(new THREE.Vector3());
  const normalVec = useRef(new THREE.Vector3());
  const viewVec = useRef(new THREE.Vector3());

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

  useFrame(({ clock, camera }) => {
    if (!markerGroupRef.current) return;

    // Calculate real-time occlusion based on camera direction
    markerGroupRef.current.getWorldPosition(worldPos.current);
    normalVec.current.copy(worldPos.current).normalize();
    viewVec.current.copy(camera.position).sub(worldPos.current).normalize();
    const dot = normalVec.current.dot(viewVec.current);

    const isFrontFacing = dot > 0.08;

    // Dynamic ground glowing disc pulse
    if (ringRef.current) {
      const t = clock.getElapsedTime() * 3;
      const s = 1 + Math.sin(t) * 0.12;
      ringRef.current.scale.set(s, s, s);
      ringRef.current.visible = isFrontFacing;
    }

    if (beaconRef.current) {
      const t = clock.getElapsedTime() * 2;
      beaconRef.current.scale.y = 1 + Math.sin(t) * 0.3;
      beaconRef.current.visible = isFrontFacing;
    }

    // Direct style manipulation for high-performance 60fps occlusion
    if (htmlContainerRef.current) {
      if (isFrontFacing) {
        htmlContainerRef.current.style.opacity = hasOverlay ? '0.35' : '1';
        htmlContainerRef.current.style.transform = 'scale(1) translate3d(0,0,0)';
        htmlContainerRef.current.style.filter = 'none';
        htmlContainerRef.current.style.pointerEvents = hasOverlay ? 'none' : 'auto';
      } else {
        // Back side (Occluded behind the planet sphere)
        htmlContainerRef.current.style.opacity = '0.15';
        htmlContainerRef.current.style.transform = 'scale(0.72) translate3d(0,0,0)';
        htmlContainerRef.current.style.filter = 'blur(1.2px) grayscale(85%)';
        htmlContainerRef.current.style.pointerEvents = 'none';
      }
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
        <ringGeometry args={[0.06, 0.12, 32]} />
        <meshBasicMaterial
          color={node.isBoss ? '#fb7185' : isCompleted ? '#34d399' : isUnlocked ? '#38bdf8' : '#64748b'}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Holographic Light Beacon Pillar */}
      <mesh ref={beaconRef} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.006, 0.025, 0.12, 16, 1, true]} />
        <meshBasicMaterial
          color={node.isBoss ? '#f43f5e' : isCompleted ? '#10b981' : isUnlocked ? '#0284c7' : '#475569'}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sci-Fi Holographic Node Pin Icon */}
      <Html position={[0, 0.08, 0]} center distanceFactor={7} zIndexRange={[100, 0]}>
        <div
          ref={htmlContainerRef}
          className="transition-all duration-300 select-none flex flex-col items-center justify-center"
        >
          <button
            type="button"
            disabled={hasOverlay}
            onClick={handleClick}
            title={node.title}
            className={`select-none flex flex-col items-center justify-center bg-transparent border-0 p-0 transition-transform active:scale-95 ${
              isUnlocked ? 'cursor-pointer hover:scale-115' : 'cursor-not-allowed'
            }`}
          >
            {/* Circular Holographic Pin Badge */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-xl border-2 relative transition-all ${
                node.isBoss
                  ? 'bg-gradient-to-br from-rose-500 via-red-600 to-amber-600 border-amber-300 text-yellow-100 shadow-[0_0_15px_rgba(244,63,94,0.7)] animate-pulse ring-2 ring-rose-400/50'
                  : isCompleted
                  ? 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 border-emerald-200 text-white shadow-[0_0_12px_rgba(16,185,129,0.6)] ring-2 ring-emerald-400/40'
                  : isUnlocked
                  ? 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-white text-white shadow-[0_0_15px_rgba(56,189,248,0.7)] ring-2 ring-sky-300/60 animate-bounce-slow'
                  : 'bg-slate-900/90 border-slate-700 text-slate-400 shadow-md ring-1 ring-slate-700/50'
              }`}
            >
              {isUnlocked ? (
                <span className="drop-shadow-md">{displayText}</span>
              ) : (
                <Lock className="w-4 h-4 text-slate-400" />
              )}

              {/* Star Rating Badge */}
              {isCompleted && (
                <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 px-1 py-0.2 rounded-full text-[8.5px] font-black flex items-center border border-white shadow-md">
                  ★{starsEarned}
                </div>
              )}
            </div>
          </button>
        </div>
      </Html>
    </group>
  );
};


