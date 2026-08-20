import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { PlanetCoordinateNode } from '../../types';

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
    currentPos: new THREE.Vector3(0, 0.2, planetRadius + 0.35),
    startPos: new THREE.Vector3(0, 0.2, planetRadius + 0.35),
    targetPos: new THREE.Vector3(0, 0.2, planetRadius + 0.35),
    progress: 1,
    speed: 0.015,
  });

  // Calculate target 3D Cartesian position on spherical surface
  const getCartesianForNode = (node: PlanetCoordinateNode, radiusOffset = 0.25) => {
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
      animState.current.startPos.copy(animState.current.currentPos);
      animState.current.targetPos.copy(getCartesianForNode(activeNode, 0.3));
      animState.current.progress = 0;
    }
  }, [activeNode, isFlyingToNode]);

  // Smoke trail particles buffer
  const particleCount = 25;
  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

  useFrame(({ clock }) => {
    if (!shipGroupRef.current) return;

    // Flight Interpolation with Altitude Arc & Ease-in-out
    if (animState.current.progress < 1) {
      // Ease-in-out curve: Smoothstep (3x^2 - 2x^3)
      animState.current.progress = Math.min(1, animState.current.progress + animState.current.speed);
      const t = animState.current.progress;
      const smoothT = t * t * (3 - 2 * t);

      // Slerp spherical position
      const interpolated = new THREE.Vector3().lerpVectors(
        animState.current.startPos,
        animState.current.targetPos,
        smoothT
      );

      // Altitude arc (highest at mid-flight t = 0.5)
      const arcHeight = Math.sin(t * Math.PI) * 0.45;
      const normal = interpolated.clone().normalize();
      interpolated.addScaledVector(normal, arcHeight);

      // Update orientation to face flight tangent direction
      const nextT = Math.min(1, t + 0.02);
      const nextSmooth = nextT * nextT * (3 - 2 * nextT);
      const nextPos = new THREE.Vector3().lerpVectors(
        animState.current.startPos,
        animState.current.targetPos,
        nextSmooth
      );
      const nextArc = Math.sin(nextT * Math.PI) * 0.45;
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
      // Idle Hovering Animation
      const time = clock.getElapsedTime();
      const hoverOffset = Math.sin(time * 2.5) * 0.03;
      const currentNormal = animState.current.currentPos.clone().normalize();
      shipGroupRef.current.position.copy(animState.current.currentPos).addScaledVector(currentNormal, hoverOffset);
    }

    // Dynamic Thruster Flame & Smoke Trail
    if (thrusterRef.current) {
      const isFlying = animState.current.progress < 1;
      const pulse = 1 + (isFlying ? Math.random() * 0.5 + 0.5 : Math.sin(clock.getElapsedTime() * 8) * 0.2);
      thrusterRef.current.scale.set(pulse, pulse * (isFlying ? 1.8 : 1.2), pulse);
    }
  });

  return (
    <group ref={shipGroupRef} scale={[0.45, 0.45, 0.45]}>
      {/* Spaceship Main Hull / Fuselage */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 0.9, 16]} />
        <meshStandardMaterial color={shipColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Cockpit Windshield (Glowing Glass Cyan) */}
      <mesh position={[0, 0.08, -0.05]} rotation={[Math.PI / 4, 0, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Left Wing */}
      <mesh position={[-0.32, -0.02, 0.2]} rotation={[0, 0, -Math.PI / 12]}>
        <boxGeometry args={[0.42, 0.03, 0.35]} />
        <meshStandardMaterial color={shipColor} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Right Wing */}
      <mesh position={[0.32, -0.02, 0.2]} rotation={[0, 0, Math.PI / 12]}>
        <boxGeometry args={[0.42, 0.03, 0.35]} />
        <meshStandardMaterial color={shipColor} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Vertical Tail Fin */}
      <mesh position={[0, 0.16, 0.3]} rotation={[Math.PI / 12, 0, 0]}>
        <boxGeometry args={[0.03, 0.22, 0.25]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Vietnam Flag Badge (Red with Yellow Star) on Wing */}
      {hasVnFlag && (
        <group position={[0.28, 0.01, 0.18]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.16, 0.11, 0.01]}>
          <mesh>
            <planeGeometry />
            <meshBasicMaterial color="#da251d" />
          </mesh>
          {/* Gold Star Center */}
          <mesh position={[0, 0, 0.02]} scale={[0.45, 0.45, 1]}>
            <circleGeometry args={[0.5, 5]} />
            <meshBasicMaterial color="#ffff00" />
          </mesh>
        </group>
      )}

      {/* Engine Exhaust Ring */}
      <mesh position={[0, 0, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.1, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Thruster Jet Flame (Pulsing Fire & Blue Core) */}
      <mesh ref={thrusterRef} position={[0, 0, 0.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.35, 16]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
      </mesh>

      {/* Inner Blue Plasma Core */}
      <mesh position={[0, 0, 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.06, 0.2, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} />
      </mesh>
    </group>
  );
};
