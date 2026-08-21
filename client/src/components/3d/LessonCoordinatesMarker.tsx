import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { PlanetCoordinateNode } from '../../types';
import { useGameStore } from '../../stores/useGameStore';
import { Lock } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  node: PlanetCoordinateNode;
  index?: number;
  radius: number;
  onSelectNode: (node: PlanetCoordinateNode) => void;
}

export const LessonCoordinatesMarker: React.FC<Props> = ({ node, index = 1, radius, onSelectNode }) => {
  const {
    completedNodes,
    nodeStars,
    selectedCoordinateNode,
    isLessonRunning,
    isNodeUnlocked,
    activePlanetId,
  } = useGameStore();
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
  const isUnlocked = isNodeUnlocked(node, activePlanetId);

  const isSelected = selectedCoordinateNode?.id === node.id;

  useFrame(({ clock, camera }) => {
    if (!markerGroupRef.current) return;

    // Calculate real-time occlusion based on camera direction
    markerGroupRef.current.getWorldPosition(worldPos.current);
    normalVec.current.copy(worldPos.current).normalize();
    viewVec.current.copy(camera.position).sub(worldPos.current).normalize();
    const dot = normalVec.current.dot(viewVec.current);

    const isFrontFacing = dot > 0.05;

    // Dynamic ground glowing disc pulse
    if (ringRef.current) {
      const t = clock.getElapsedTime() * 2.5;
      const s = isSelected ? 1.3 + Math.sin(t * 1.5) * 0.18 : 1 + Math.sin(t) * 0.12;
      ringRef.current.scale.set(s, s, s);
      ringRef.current.visible = isFrontFacing;
    }

    if (beaconRef.current) {
      const t = clock.getElapsedTime() * 2;
      beaconRef.current.scale.y = 1 + Math.sin(t) * 0.25;
      beaconRef.current.visible = isFrontFacing && !isSelected;
    }

    // Dynamic Depth Scaling & Opacity for realistic 3D perspective
    if (htmlContainerRef.current) {
      if (isSelected) {
        // Hide HTML Pin when ship is arriving or docked at this exact node to prevent any clipping/overlap
        htmlContainerRef.current.style.opacity = '0';
        htmlContainerRef.current.style.pointerEvents = 'none';
        htmlContainerRef.current.style.transform = 'scale(0.01) translate3d(0,0,0)';
      } else if (isFrontFacing) {
        // Front side: Smoothly scale from 0.85 up to 1.05 based on facing angle
        const frontFactor = Math.min(1, (dot - 0.05) / 0.7);
        const scale = 0.85 + 0.2 * frontFactor;
        const opacity = hasOverlay ? 0.2 : 0.92;

        htmlContainerRef.current.style.opacity = `${opacity}`;
        htmlContainerRef.current.style.transform = `scale(${scale.toFixed(3)}) translate3d(0,0,0)`;
        htmlContainerRef.current.style.filter = 'none';
        htmlContainerRef.current.style.pointerEvents = hasOverlay ? 'none' : 'auto';
      } else {
        // Back side (Occluded behind planet): Smoothly shrink down to 0.38 - 0.75 and fade into space
        const backFactor = Math.max(-1, Math.min(0, dot));
        const scale = Math.max(0.38, 0.75 + backFactor * 0.45);
        const opacity = Math.max(0.08, 0.38 + backFactor * 0.35);

        htmlContainerRef.current.style.opacity = `${opacity.toFixed(2)}`;
        htmlContainerRef.current.style.transform = `scale(${scale.toFixed(3)}) translate3d(0,0,0)`;
        htmlContainerRef.current.style.filter = 'blur(1px) grayscale(45%)';
        htmlContainerRef.current.style.pointerEvents = 'none';
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation?.();
    soundService.playSelect();
    onSelectNode(node);
  };

  const displayText = node.isBoss ? '👑' : `${index}`;

  return (
    <group ref={markerGroupRef} position={position} quaternion={quaternion}>
      {/* Ground Glowing Disc Ring (Neon Cyan Glow) */}
      <mesh ref={ringRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleClick}>
        <ringGeometry args={[0.06, 0.12, 32]} />
        <meshBasicMaterial
          color={node.isBoss ? '#f43f5e' : isCompleted ? '#2dd4bf' : isUnlocked ? '#00f0ff' : '#64748b'}
          transparent
          opacity={isSelected ? 0.8 : 0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Holographic Light Beacon Pillar */}
      <mesh ref={beaconRef} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.005, 0.02, 0.12, 16, 1, true]} />
        <meshBasicMaterial
          color={node.isBoss ? '#fb7185' : isCompleted ? '#14b8a6' : isUnlocked ? '#00b4d8' : '#475569'}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sci-Fi Holographic Node Pin Icon (Low z-index so 3D spaceship stays on top) */}
      <Html position={[0, 0.08, 0]} center distanceFactor={7} zIndexRange={[5, 0]}>
        <div
          ref={htmlContainerRef}
          className="transition-all duration-300 select-none flex flex-col items-center justify-center"
        >
          <button
            type="button"
            data-testid={`lesson-node-${node.id}`}
            disabled={hasOverlay}
            onClick={handleClick}
            title={node.title}
            className="select-none flex flex-col items-center justify-center bg-transparent border-0 p-0 transition-transform active:scale-95 cursor-pointer hover:scale-110"
          >
            {/* Neon Sky Blue Cyber Pin Badge with subtle background blend */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-xl border-2 relative transition-all ${
                node.isBoss
                  ? 'bg-gradient-to-br from-rose-500/90 via-pink-600/90 to-purple-800/90 border-pink-200/90 text-yellow-100 shadow-[0_0_18px_rgba(244,63,94,0.75)] ring-2 ring-pink-400/60 backdrop-blur-sm animate-pulse'
                  : isCompleted
                  ? 'bg-gradient-to-br from-teal-400/85 via-cyan-600/85 to-blue-800/85 border-teal-200/90 text-white shadow-[0_0_15px_rgba(20,184,166,0.6)] ring-2 ring-teal-300/50 backdrop-blur-sm'
                  : isUnlocked
                  ? 'bg-gradient-to-br from-cyan-400/85 via-sky-500/85 to-blue-700/85 border-cyan-200/90 text-white shadow-[0_0_15px_rgba(6,182,212,0.6)] ring-2 ring-cyan-400/50 backdrop-blur-sm animate-bounce-slow'
                  : 'bg-slate-900/80 border-slate-600/70 text-slate-400 shadow-md ring-1 ring-slate-700/40 backdrop-blur-sm'
              }`}
            >
              {isUnlocked ? (
                <span className="drop-shadow-md text-white font-black">{displayText}</span>
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


