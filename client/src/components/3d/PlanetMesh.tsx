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
import { fbm, voronoi3D } from '../../utils/proceduralNoise';

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
  grad.addColorStop(0.35, 'rgba(0,0,0,0.12)'); // Cassini division
  grad.addColorStop(0.44, ringColor);
  grad.addColorStop(0.70, 'rgba(255,245,180,0.95)');
  grad.addColorStop(0.88, ringColor);
  grad.addColorStop(1, 'transparent');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Procedural Moon Crater Texture Generator
function createCraterMoonTexture(baseColor: string = '#cbd5e1'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(256, 128);
  const data = imgData.data;

  // Base RGB from hex
  const tempColor = new THREE.Color(baseColor);
  const br = Math.floor(tempColor.r * 255);
  const bg = Math.floor(tempColor.g * 255);
  const bb = Math.floor(tempColor.b * 255);

  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 256; x++) {
      const u = x / 255;
      const v = y / 127;
      const theta = (u - 0.5) * 2 * Math.PI;
      const phi = (v - 0.5) * Math.PI;
      const nx = Math.cos(phi) * Math.sin(theta);
      const ny = Math.sin(phi);
      const nz = Math.cos(phi) * Math.cos(theta);

      const noise = fbm(nx * 4, ny * 4, nz * 4, 4);
      const crater = voronoi3D(nx * 6, ny * 6, nz * 6).crack;
      const shade = Math.floor((noise * 0.7 + (1.0 - crater) * 0.3) * 255);

      const r = Math.floor((br * shade) / 255);
      const g = Math.floor((bg * shade) / 255);
      const b = Math.floor((bb * shade) / 255);

      const idx = (y * 256 + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return new THREE.CanvasTexture(canvas);
}

// Atmospheric Configuration Per Planet
interface AtmosphereConfig {
  innerThickness: number;
  innerOpacity: number;
  innerColor: string;
  outerThickness: number;
  outerOpacity: number;
  outerColor: string;
}

function getAtmosphereConfig(type: PlanetData['type']): AtmosphereConfig {
  switch (type) {
    case 'ocean':
      return {
        innerThickness: 1.04,
        innerOpacity: 0.38,
        innerColor: '#0ea5e9',
        outerThickness: 1.09,
        outerOpacity: 0.28,
        outerColor: '#38bdf8',
      };
    case 'gas_giant':
      return {
        innerThickness: 1.06,
        innerOpacity: 0.45,
        innerColor: '#a855f7',
        outerThickness: 1.15,
        outerOpacity: 0.32,
        outerColor: '#ec4899',
      };
    case 'ice':
      return {
        innerThickness: 1.035,
        innerOpacity: 0.32,
        innerColor: '#22d3ee',
        outerThickness: 1.08,
        outerOpacity: 0.22,
        outerColor: '#a7f3d0',
      };
    case 'magma':
      return {
        innerThickness: 1.025,
        innerOpacity: 0.28,
        innerColor: '#ea580c',
        outerThickness: 1.055,
        outerOpacity: 0.18,
        outerColor: '#78350f',
      };
    case 'terrestrial':
    default:
      return {
        innerThickness: 1.03,
        innerOpacity: 0.25,
        innerColor: '#f59e0b',
        outerThickness: 1.07,
        outerOpacity: 0.18,
        outerColor: '#38bdf8',
      };
  }
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
  const moonOrbitGroup1Ref = useRef<THREE.Group>(null);
  const moonOrbitGroup2Ref = useRef<THREE.Group>(null);

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

  const moonTexture1 = useMemo(
    () => createCraterMoonTexture(planet.moonColor || '#cbd5e1'),
    [planet.moonColor]
  );

  const moonTexture2 = useMemo(
    () => createCraterMoonTexture('#94a3b8'),
    []
  );

  const atmos = useMemo(() => getAtmosphereConfig(planet.type), [planet.type]);

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
      cloudSphereRef.current.rotation.y += 0.0016;
    }

    if (moonOrbitGroup1Ref.current) {
      moonOrbitGroup1Ref.current.rotation.y += 0.009;
    }

    if (moonOrbitGroup2Ref.current) {
      moonOrbitGroup2Ref.current.rotation.y -= 0.006;
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

        {/* Layer 1: Dense Inner Atmosphere Shell */}
        <mesh scale={[atmos.innerThickness, atmos.innerThickness, atmos.innerThickness]}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshBasicMaterial
            color={atmos.innerColor}
            transparent
            opacity={atmos.innerOpacity}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Layer 2: Soft Outer Exosphere Rayleigh Glow Shell */}
        <mesh scale={[atmos.outerThickness, atmos.outerThickness, atmos.outerThickness]}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshBasicMaterial
            color={atmos.outerColor}
            transparent
            opacity={atmos.outerOpacity}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Planetary Rings */}
        {planet.hasRings && (
          <mesh rotation={[Math.PI / 2 + 0.12, 0, 0]}>
            <ringGeometry args={[radius * 1.45, radius * 2.35, 96]} />
            <meshStandardMaterial
              map={ringTexture}
              color="#ffffff"
              transparent
              opacity={0.92}
              side={THREE.DoubleSide}
              roughness={0.3}
            />
          </mesh>
        )}

        {/* Primary Moon System */}
        {planet.hasMoon && (
          <group ref={moonOrbitGroup1Ref} rotation={[0.2, 0, 0.15]}>
            {/* Orbit Path Guide Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 2.4 - 0.003, radius * 2.4 + 0.003, 64]} />
              <meshBasicMaterial color={atmos.outerColor} transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Textured Moon with Craters */}
            <mesh position={[radius * 2.4, 0.1, 0]}>
              <sphereGeometry args={[0.13, 32, 32]} />
              <meshStandardMaterial
                map={moonTexture1}
                roughness={0.88}
                metalness={0.08}
              />
            </mesh>
          </group>
        )}

        {/* Secondary Moon System for Gas Giant / Special Planets */}
        {(planet.type === 'gas_giant' || planet.id === 'storm_giant' || planet.id === 'bravery_prime') && (
          <group ref={moonOrbitGroup2Ref} rotation={[-0.35, 0, -0.2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 3.1 - 0.003, radius * 3.1 + 0.003, 64]} />
              <meshBasicMaterial color={atmos.innerColor} transparent opacity={0.12} side={THREE.DoubleSide} />
            </mesh>

            {/* Small Distant Moonlet */}
            <mesh position={[radius * 3.1, -0.15, 0]}>
              <sphereGeometry args={[0.08, 24, 24]} />
              <meshStandardMaterial
                map={moonTexture2}
                roughness={0.92}
                metalness={0.05}
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
