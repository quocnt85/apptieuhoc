import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PlanetData, PlanetCoordinateNode } from '../../types';
import { LessonCoordinatesMarker } from './LessonCoordinatesMarker';
import { useGameStore } from '../../stores/useGameStore';

interface Props {
  planet: PlanetData;
  radius?: number;
  onSelectNode: (node: PlanetCoordinateNode) => void;
}

export const PlanetMesh: React.FC<Props> = ({ planet, radius = 2.0, onSelectNode }) => {
  const { isFlyingToNode, selectedCoordinateNode } = useGameStore();
  const planetGroupRef = useRef<THREE.Group>(null);
  const coreSphereRef = useRef<THREE.Mesh>(null);
  const cloudSphereRef = useRef<THREE.Mesh>(null);
  const moonGroupRef = useRef<THREE.Group>(null);

  // Manual Drag Rotation State
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: planet.rotationSpeed });
  const autoAligningRef = useRef(false);
  const targetRotationRef = useRef<THREE.Quaternion>(new THREE.Quaternion());

  const { gl } = useThree();

  // Setup auto-align rotation when a target node is selected
  React.useEffect(() => {
    if (selectedCoordinateNode && isFlyingToNode && planetGroupRef.current) {
      autoAligningRef.current = true;

      // Desired orientation: bring (lat, lon) to face towards camera (+Z direction)
      const lat = selectedCoordinateNode.lat;
      const lon = selectedCoordinateNode.lon;

      // Compute required rotation to align (lat, lon) with (0, 0, +1)
      const targetQuat = new THREE.Quaternion();
      const euler = new THREE.Euler(-lat, -lon, 0, 'YXZ');
      targetQuat.setFromEuler(euler);

      targetRotationRef.current.copy(targetQuat);
    }
  }, [selectedCoordinateNode, isFlyingToNode]);

  // Pointer / Touch drag handlers for interactive 360 spinning
  React.useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      autoAligningRef.current = false;
      previousPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !planetGroupRef.current) return;

      const deltaX = e.clientX - previousPointerRef.current.x;
      const deltaY = e.clientY - previousPointerRef.current.y;
      previousPointerRef.current = { x: e.clientX, y: e.clientY };

      const rotateSpeed = 0.005;
      planetGroupRef.current.rotation.y += deltaX * rotateSpeed;
      planetGroupRef.current.rotation.x += deltaY * rotateSpeed;

      rotationVelocityRef.current = {
        x: deltaY * rotateSpeed * 0.5,
        y: deltaX * rotateSpeed * 0.5,
      };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!planetGroupRef.current) return;

    // 1. If auto-aligning to bring node to front:
    if (autoAligningRef.current) {
      planetGroupRef.current.quaternion.slerp(targetRotationRef.current, Math.min(1, delta * 3.5));
      // Check convergence
      if (planetGroupRef.current.quaternion.angleTo(targetRotationRef.current) < 0.03) {
        autoAligningRef.current = false;
        rotationVelocityRef.current = { x: 0, y: 0 };
      }
    } else if (!isDraggingRef.current) {
      // 2. Idle rotation + inertia damping
      planetGroupRef.current.rotation.y += rotationVelocityRef.current.y + planet.rotationSpeed * 0.4;
      planetGroupRef.current.rotation.x += rotationVelocityRef.current.x;

      // Damp velocities
      rotationVelocityRef.current.x *= 0.92;
      rotationVelocityRef.current.y *= 0.92;
    }

    // Independent Cloud layer rotation
    if (cloudSphereRef.current) {
      cloudSphereRef.current.rotation.y += 0.0015;
    }

    // Orbiting Moon / Satellite Revolution
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group rotation={[planet.tiltAngle, 0, 0]}>
      {/* Main Rotatable Planet Group */}
      <group ref={planetGroupRef}>
        {/* Core Terrain Sphere */}
        <mesh ref={coreSphereRef}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshStandardMaterial
            color={planet.color}
            roughness={0.7}
            metalness={0.15}
            emissive={planet.glowColor}
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Mountain / Crystal Ridge Layer */}
        <mesh scale={[1.005, 1.005, 1.005]}>
          <icosahedronGeometry args={[radius, 3]} />
          <meshStandardMaterial
            color={planet.glowColor}
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Atmosphere Cloud Layer (Rotating) */}
        <mesh ref={cloudSphereRef} scale={[1.025, 1.025, 1.025]}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            roughness={0.9}
            depthWrite={false}
          />
        </mesh>

        {/* Atmospheric Glow Shell (Rim Lighting) */}
        <mesh scale={[1.06, 1.06, 1.06]}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor}
            transparent
            opacity={0.18}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Coordinate Markers Pinned to Planet Surface */}
        {planet.nodes.map((node) => (
          <LessonCoordinatesMarker
            key={node.id}
            node={node}
            radius={radius}
            onSelectNode={onSelectNode}
          />
        ))}
      </group>

      {/* Planetary Ring System */}
      {planet.hasRings && (
        <mesh rotation={[Math.PI / 2 + 0.2, 0, 0]}>
          <ringGeometry args={[planet.ringInnerRadius || 2.4, planet.ringOuterRadius || 3.4, 64]} />
          <meshStandardMaterial
            color={planet.ringColor || '#fde047'}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            roughness={0.4}
          />
        </mesh>
      )}

      {/* Orbiting Moon / Satellite */}
      {planet.hasMoon && (
        <group ref={moonGroupRef}>
          <mesh position={[planet.moonDistance || 3.6, 0.4, 0]}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial
              color={planet.moonColor || '#cbd5e1'}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
