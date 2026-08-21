import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PlanetData, PlanetCoordinateNode } from '../../types';
import { LessonCoordinatesMarker } from './LessonCoordinatesMarker';
import { useGameStore } from '../../stores/useGameStore';
import {
  createBraveryPrimeTexture,
  createAquaNovaTexture,
  createStormGiantTexture,
  createFrostAegisTexture,
  createMagmaIgnisTexture,
  createRealisticAtmosphericClouds,
} from './planets/PhotorealisticPlanetTextures';

interface Props {
  planet: PlanetData;
  radius?: number;
  onSelectNode?: (node: PlanetCoordinateNode) => void;
  showNodes?: boolean;
  interactiveSpin?: boolean;
}

// Procedural Concentric Ring Texture
function generateRingTexture(ringColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.06, ringColor);
  grad.addColorStop(0.22, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.35, 'rgba(0,0,0,0.15)'); // Cassini division
  grad.addColorStop(0.44, ringColor);
  grad.addColorStop(0.70, 'rgba(255,245,180,0.95)');
  grad.addColorStop(0.88, ringColor);
  grad.addColorStop(1, 'transparent');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const PlanetMesh: React.FC<Props> = ({
  planet,
  radius = 1.0,
  onSelectNode,
  showNodes = true,
  interactiveSpin = true,
}) => {
  const { isFlyingToNode, selectedCoordinateNode } = useGameStore();
  const planetGroupRef = useRef<THREE.Group>(null);
  const coreSphereRef = useRef<THREE.Mesh>(null);
  const cloudSphereRef = useRef<THREE.Mesh>(null);
  const moonOrbitGroupRef = useRef<THREE.Group>(null);

  // Manual Drag Rotation State
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: planet.rotationSpeed });
  const autoAligningRef = useRef(false);
  const targetRotationRef = useRef<THREE.Quaternion>(new THREE.Quaternion());

  const { gl } = useThree();

  // Photorealistic Procedural Textures
  const textureData = useMemo(() => {
    switch (planet.type) {
      case 'ocean':
        return { map: createAquaNovaTexture(1024, 512) };
      case 'gas_giant':
        return { map: createStormGiantTexture(1024, 512) };
      case 'ice':
        return { map: createFrostAegisTexture(1024, 512) };
      case 'magma':
        return createMagmaIgnisTexture(1024, 512);
      case 'terrestrial':
      default:
        return createBraveryPrimeTexture(1024, 512);
    }
  }, [planet.id, planet.type]);

  const cloudsTexture = useMemo(
    () => createRealisticAtmosphericClouds(1024, 512),
    [planet.type]
  );

  const ringTexture = useMemo(
    () => generateRingTexture(planet.ringColor || '#fde047'),
    [planet.ringColor]
  );

  // Auto-align when node selected in game mode
  React.useEffect(() => {
    if (selectedCoordinateNode && isFlyingToNode && planetGroupRef.current) {
      autoAligningRef.current = true;
      const lat = selectedCoordinateNode.lat;
      const lon = selectedCoordinateNode.lon;
      const targetQuat = new THREE.Quaternion();
      const euler = new THREE.Euler(-lat, -lon, 0, 'YXZ');
      targetQuat.setFromEuler(euler);
      targetRotationRef.current.copy(targetQuat);
    }
  }, [selectedCoordinateNode, isFlyingToNode]);

  // Pointer / Touch drag handlers for interactive 360 spinning
  React.useEffect(() => {
    if (!interactiveSpin) return;
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
  }, [gl, interactiveSpin]);

  useFrame((_, delta) => {
    if (!planetGroupRef.current) return;

    if (autoAligningRef.current) {
      planetGroupRef.current.quaternion.slerp(targetRotationRef.current, Math.min(1, delta * 3.5));
      if (planetGroupRef.current.quaternion.angleTo(targetRotationRef.current) < 0.03) {
        autoAligningRef.current = false;
        rotationVelocityRef.current = { x: 0, y: 0 };
      }
    } else if (!isDraggingRef.current) {
      planetGroupRef.current.rotation.y += rotationVelocityRef.current.y + planet.rotationSpeed * 0.5;
      planetGroupRef.current.rotation.x += rotationVelocityRef.current.x;
      rotationVelocityRef.current.x *= 0.92;
      rotationVelocityRef.current.y *= 0.92;
    }

    if (cloudSphereRef.current) {
      cloudSphereRef.current.rotation.y += 0.0018;
    }

    if (moonOrbitGroupRef.current) {
      moonOrbitGroupRef.current.rotation.y += 0.012;
    }
  });

  return (
    <group rotation={[planet.tiltAngle, 0, 0]}>
      <group ref={planetGroupRef}>
        {/* Core Planet Sphere */}
        <mesh ref={coreSphereRef}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={textureData.map}
            bumpMap={'bump' in textureData ? textureData.bump : undefined}
            bumpScale={planet.type === 'terrestrial' ? 0.08 : 0.04}
            roughness={planet.type === 'ocean' ? 0.2 : planet.type === 'gas_giant' ? 0.8 : 0.6}
            metalness={planet.type === 'ice' ? 0.4 : 0.1}
            emissive={'emissiveMap' in textureData ? new THREE.Color('#ff3a00') : new THREE.Color('#000000')}
            emissiveMap={'emissiveMap' in textureData ? textureData.emissiveMap : undefined}
            emissiveIntensity={'emissiveMap' in textureData ? 1.4 : 0}
          />
        </mesh>

        {/* Photorealistic Cloud Turbulence Layer */}
        {planet.type !== 'gas_giant' && (
          <mesh ref={cloudSphereRef} scale={[1.025, 1.025, 1.025]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial
              map={cloudsTexture}
              transparent
              opacity={planet.type === 'magma' ? 0.25 : planet.type === 'ocean' ? 0.6 : 0.45}
              roughness={0.9}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Soft Rayleigh Scattering Atmospheric Glow Shell */}
        <mesh scale={[1.07, 1.07, 1.07]}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor || '#38bdf8'}
            transparent
            opacity={0.25}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Planetary Rings */}
        {planet.hasRings && (
          <mesh rotation={[Math.PI / 2 + 0.15, 0, 0]}>
            <ringGeometry args={[radius * 1.4, radius * 2.2, 96]} />
            <meshStandardMaterial
              map={ringTexture}
              color="#ffffff"
              transparent
              opacity={0.88}
              side={THREE.DoubleSide}
              roughness={0.3}
            />
          </mesh>
        )}

        {/* Moon */}
        {planet.hasMoon && (
          <group ref={moonOrbitGroupRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 2.15 - 0.004, radius * 2.15 + 0.004, 64]} />
              <meshBasicMaterial color={planet.atmosphereColor || '#38bdf8'} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>

            <mesh position={[radius * 2.15, 0.15, 0]}>
              <sphereGeometry args={[0.11, 24, 24]} />
              <meshStandardMaterial
                color={planet.moonColor || '#cbd5e1'}
                roughness={0.85}
                metalness={0.1}
              />
            </mesh>
          </group>
        )}

        {/* Coordinate Markers */}
        {showNodes && onSelectNode && planet.nodes.map((node, index) => (
          <LessonCoordinatesMarker
            key={node.id}
            node={node}
            index={index + 1}
            radius={radius}
            onSelectNode={onSelectNode}
          />
        ))}
      </group>
    </group>
  );
};
