import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { PlanetCoordinateNode } from '../../types';
import { AerodynamicShipRenderer } from './ships/AerodynamicShips';

interface Props {
  planetRadius: number;
  activeNode: PlanetCoordinateNode | null;
  onArrival: () => void;
}

export const Spaceship3D: React.FC<Props> = ({ planetRadius, activeNode, onArrival }) => {
  const { user, isFlyingToNode } = useGameStore();
  const shipGroupRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);
  const smokeParticlesRef = useRef<THREE.Points>(null);

  const shipColor = user.customization?.equippedColor || '#38bdf8';
  const hasVnFlag = user.customization?.hasVietnamFlag ?? true;

  // Animation interpolation state
  const animState = useRef({
    currentPos: new THREE.Vector3(0, 0.15, planetRadius + 0.12),
    startPos: new THREE.Vector3(0, 0.15, planetRadius + 0.12),
    targetPos: new THREE.Vector3(0, 0.15, planetRadius + 0.12),
    progress: 1,
    flightDuration: 3.5,
  });

  // Calculate target 3D Cartesian position on spherical surface
  const getCartesianForNode = (node: PlanetCoordinateNode, radiusOffset = 0.12) => {
    const r = planetRadius + radiusOffset;
    const phi = node.lat;
    const theta = node.lon;
    return new THREE.Vector3(
      r * Math.cos(phi) * Math.sin(theta),
      r * Math.sin(phi),
      r * Math.cos(phi) * Math.cos(theta)
    );
  };

  // Setup flight trajectory when a new node is selected
  React.useEffect(() => {
    if (activeNode && isFlyingToNode) {
      const target = getCartesianForNode(activeNode, 0.12);
      animState.current.startPos.copy(animState.current.currentPos);
      animState.current.targetPos.copy(target);
      
      // Calculate angular distance on sphere to dynamically scale flight duration (3.0s to 5.0s)
      const angle = animState.current.startPos.clone().normalize().angleTo(target.clone().normalize());
      const duration = 3.0 + (angle / Math.PI) * 2.0; // 3.0s (near) to 5.0s (opposite side)
      
      animState.current.flightDuration = Math.max(3.0, Math.min(5.0, duration));
      animState.current.progress = 0;
    }
  }, [activeNode, isFlyingToNode]);

  useFrame(({ clock }, delta) => {
    if (!shipGroupRef.current) return;

    // Flight Interpolation with Altitude Arc & Ease-in-out
    if (animState.current.progress < 1) {
      // Progress increment based on exact flightDuration (3.0s - 5.0s)
      const step = delta / animState.current.flightDuration;
      animState.current.progress = Math.min(1, animState.current.progress + step);
      const t = animState.current.progress;
      
      // Smoothstep ease-in-out curve
      const smoothT = t * t * (3 - 2 * t);

      // Spherical interpolated position
      const interpolated = new THREE.Vector3().lerpVectors(
        animState.current.startPos,
        animState.current.targetPos,
        smoothT
      );

      // Parabolic altitude arc above ground (highest at mid-flight t = 0.5)
      const arcHeight = Math.sin(t * Math.PI) * 0.35;
      const normal = interpolated.clone().normalize();
      interpolated.addScaledVector(normal, arcHeight);

      // Orientation tangent to flight direction
      const nextT = Math.min(1, t + 0.015);
      const nextSmooth = nextT * nextT * (3 - 2 * nextT);
      const nextPos = new THREE.Vector3().lerpVectors(
        animState.current.startPos,
        animState.current.targetPos,
        nextSmooth
      );
      const nextArc = Math.sin(nextT * Math.PI) * 0.35;
      nextPos.addScaledVector(nextPos.clone().normalize(), nextArc);

      const flightDirection = nextPos.clone().sub(interpolated).normalize();
      if (flightDirection.lengthSq() > 0.0001) {
        const matrix = new THREE.Matrix4();
        matrix.lookAt(interpolated, interpolated.clone().add(flightDirection), normal);
        shipGroupRef.current.quaternion.setFromRotationMatrix(matrix);
      }

      animState.current.currentPos.copy(interpolated);
      shipGroupRef.current.position.copy(interpolated);

      // Check arrival
      if (t >= 1) {
        onArrival();
      }
    } else {
      // Idle Hovering Animation when stationary
      const time = clock.getElapsedTime();
      const hoverOffset = Math.sin(time * 2.5) * 0.015;
      const currentNormal = animState.current.currentPos.clone().normalize();
      shipGroupRef.current.position.copy(animState.current.currentPos).addScaledVector(currentNormal, hoverOffset);
    }

    // Dynamic Thruster Flame
    if (thrusterRef.current) {
      const isFlying = animState.current.progress < 1;
      const pulse = isFlying
        ? 1.5 + Math.random() * 0.6
        : 1 + Math.sin(clock.getElapsedTime() * 8) * 0.2;
      thrusterRef.current.scale.set(pulse, pulse * (isFlying ? 2.5 : 1.2), pulse);
    }
  });

  return (
    <group ref={shipGroupRef} scale={[0.22, 0.22, 0.22]}>
      <AerodynamicShipRenderer
        shipId={user.customization?.equippedShip || 'explorer_v1'}
        shipColor={shipColor}
        hasVnFlag={hasVnFlag}
        showStreamlines={animState.current.progress < 1}
      />
    </group>
  );
};
