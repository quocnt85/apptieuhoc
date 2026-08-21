import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PlanetData, PlanetCoordinateNode, MoonData } from '../../types';
import { LessonCoordinatesMarker } from './LessonCoordinatesMarker';
import { useGameStore } from '../../stores/useGameStore';
import {
  createBraveryPrimeTexture,
  createAquaNovaTexture,
  createStormGiantTexture,
  createFrostAegisTexture,
  createMagmaIgnisTexture,
  createDiverseAtmosphericClouds,
  createProceduralMoonTexture,
  createRealisticPlanetaryRingTexture,
} from './planets/PhotorealisticPlanetTextures';

import { Spaceship3D } from './Spaceship3D';

interface Props {
  planet: PlanetData;
  radius?: number;
  onSelectNode?: (node: PlanetCoordinateNode) => void;
  onShipArrival?: () => void;
  showNodes?: boolean;
  interactiveSpin?: boolean;
}

// Polar Concentric Ring Geometry with Exact Polar UV Coordinates (0 to 1 radially)
function createPolarRingGeometry(innerRadius: number, outerRadius: number, thetaSegments: number = 128): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= thetaSegments; i++) {
    const theta = (i / thetaSegments) * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const v = i / thetaSegments;

    // Inner ring vertex
    positions.push(innerRadius * cos, innerRadius * sin, 0);
    uvs.push(0, v); // u = 0 at inner edge

    // Outer ring vertex
    positions.push(outerRadius * cos, outerRadius * sin, 0);
    uvs.push(1, v); // u = 1 at outer edge
  }

  for (let i = 0; i < thetaSegments; i++) {
    const i0 = i * 2;
    const i1 = i * 2 + 1;
    const i2 = (i + 1) * 2;
    const i3 = (i + 1) * 2 + 1;

    indices.push(i0, i2, i1);
    indices.push(i1, i2, i3);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Atmospheric Shell Configuration
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

// Single Moon Component with Custom Tilt, Rotation & Orbit Track
const MoonOrbitItem: React.FC<{
  moon: MoonData;
  planetRadius: number;
}> = ({ moon, planetRadius }) => {
  const orbitGroupRef = useRef<THREE.Group>(null);
  const moonTexture = useMemo(
    () => createProceduralMoonTexture(moon.color, moon.textureType),
    [moon.color, moon.textureType]
  );

  const moonDist = moon.distance * planetRadius;

  useFrame(() => {
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += moon.orbitSpeed;
    }
  });

  return (
    <group ref={orbitGroupRef} rotation={moon.orbitTilt}>
      {/* Orbit Guide Track Ring */}
      {moon.hasOrbitTrack && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[moonDist - 0.003, moonDist + 0.003, 64]} />
          <meshBasicMaterial
            color={moon.orbitTrackColor || moon.color}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Textured Moon Sphere */}
      <mesh position={[moonDist, 0, 0]}>
        <sphereGeometry args={[moon.size, 32, 32]} />
        <meshStandardMaterial
          map={moonTexture}
          roughness={moon.textureType === 'crystal' ? 0.4 : 0.88}
          metalness={moon.textureType === 'metallic' ? 0.6 : moon.textureType === 'crystal' ? 0.3 : 0.08}
          emissive={moon.glowColor ? new THREE.Color(moon.glowColor) : undefined}
          emissiveIntensity={moon.glowColor ? 0.3 : 0}
        />
      </mesh>
    </group>
  );
};

export const PlanetMesh: React.FC<Props> = ({
  planet,
  radius = 1.0,
  onSelectNode,
  onShipArrival,
  showNodes = true,
  interactiveSpin = true,
}) => {
  const { isFlyingToNode, selectedCoordinateNode } = useGameStore();
  const planetGroupRef = useRef<THREE.Group>(null);
  const coreSphereRef = useRef<THREE.Mesh>(null);
  const cloudSphereRef = useRef<THREE.Mesh>(null);

  // Manual Drag Rotation State
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: planet.rotationSpeed });
  const autoAligningRef = useRef(false);
  const targetRotationRef = useRef<THREE.Quaternion>(new THREE.Quaternion());

  const { gl } = useThree();

  // Photorealistic Procedural Surface Textures
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

  // Atmospheric Clouds Layer
  const hasClouds = planet.cloudConfig?.hasClouds ?? (planet.type !== 'gas_giant');
  const cloudsTexture = useMemo(() => {
    if (!hasClouds) return null;
    return createDiverseAtmosphericClouds(
      1024,
      512,
      planet.cloudConfig?.cloudType || 'terrestrial_cumulus',
      planet.cloudConfig?.color || '#ffffff'
    );
  }, [planet.id, hasClouds, planet.cloudConfig?.cloudType, planet.cloudConfig?.color]);

  // Planetary Rings Polar Geometry & Realistic Texture
  const hasRings = planet.hasRings || planet.ringConfig?.hasRings;
  const ringInner = (planet.ringConfig?.innerRadius || planet.ringInnerRadius || 1.5) * radius;
  const ringOuter = (planet.ringConfig?.outerRadius || planet.ringOuterRadius || 2.3) * radius;

  const polarRingGeo = useMemo(() => {
    if (!hasRings) return null;
    return createPolarRingGeometry(ringInner, ringOuter, 128);
  }, [hasRings, ringInner, ringOuter]);

  const ringTexture = useMemo(() => {
    if (!hasRings) return null;
    const col1 = planet.ringConfig?.primaryColor || planet.ringColor || '#fbbf24';
    const col2 = planet.ringConfig?.secondaryColor || '#fef08a';
    return createRealisticPlanetaryRingTexture(col1, col2);
  }, [hasRings, planet.ringConfig, planet.ringColor]);

  // Atmosphere glow shell configuration
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

  // Warp Zoom-In Animation when entering a new planet (30% -> 100% scale)
  const zoomProgressRef = useRef(0);
  const userZoomScaleRef = useRef(1.0);
  const currentZoomScaleRef = useRef(1.0);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistanceRef = useRef<number | null>(null);
  const basePinchZoomRef = useRef<number>(1.0);

  React.useEffect(() => {
    zoomProgressRef.current = 0;
    userZoomScaleRef.current = 1.0;
    currentZoomScaleRef.current = 1.0;
    if (planetGroupRef.current) {
      planetGroupRef.current.scale.set(0.3, 0.3, 0.3);
    }
  }, [planet.id]);

  // Pointer / Multi-touch / Pinch / Wheel zoom handlers for interactive 360 spinning and zoom
  React.useEffect(() => {
    if (!interactiveSpin) return;
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      autoAligningRef.current = false;

      if (activePointersRef.current.size === 1) {
        isDraggingRef.current = true;
        previousPointerRef.current = { x: e.clientX, y: e.clientY };
      } else if (activePointersRef.current.size === 2) {
        // Switch to Pinch to Zoom mode
        isDraggingRef.current = false;
        const pts = Array.from(activePointersRef.current.values());
        initialPinchDistanceRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        basePinchZoomRef.current = userZoomScaleRef.current;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!planetGroupRef.current) return;
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Two fingers: Pinch to zoom
      if (activePointersRef.current.size === 2 && initialPinchDistanceRef.current) {
        const pts = Array.from(activePointersRef.current.values());
        const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (initialPinchDistanceRef.current > 10) {
          const pinchRatio = currentDist / initialPinchDistanceRef.current;
          const targetZoom = basePinchZoomRef.current * pinchRatio;
          userZoomScaleRef.current = Math.min(1.85, Math.max(0.65, targetZoom));
        }
        return;
      }

      // One finger: 360 Drag rotation
      if (activePointersRef.current.size === 1 && isDraggingRef.current) {
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
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      activePointersRef.current.delete(e.pointerId);

      if (activePointersRef.current.size < 2) {
        initialPinchDistanceRef.current = null;
      }
      if (activePointersRef.current.size === 1) {
        const remainingPt = Array.from(activePointersRef.current.values())[0];
        previousPointerRef.current = { x: remainingPt.x, y: remainingPt.y };
        isDraggingRef.current = true;
      } else if (activePointersRef.current.size === 0) {
        isDraggingRef.current = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = -e.deltaY * 0.0015;
      userZoomScaleRef.current = Math.min(1.85, Math.max(0.65, userZoomScaleRef.current + zoomDelta));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [gl, interactiveSpin]);

  useFrame((_, delta) => {
    if (!planetGroupRef.current) return;

    // Smooth Warp Zoom-In from 30% to 100% on enter
    let baseScale = 1.0;
    if (zoomProgressRef.current < 1) {
      zoomProgressRef.current = Math.min(1, zoomProgressRef.current + delta / 1.1);
      const t = zoomProgressRef.current;
      const ease = 1 - Math.pow(1 - t, 3);
      baseScale = 0.3 + 0.7 * ease;
    }

    // Dynamic User Pinch / Wheel Zoom Lerp Damping
    currentZoomScaleRef.current = THREE.MathUtils.lerp(
      currentZoomScaleRef.current,
      userZoomScaleRef.current,
      Math.min(1, delta * 10.0)
    );

    const finalScale = baseScale * currentZoomScaleRef.current;
    planetGroupRef.current.scale.set(finalScale, finalScale, finalScale);

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

    if (cloudSphereRef.current && hasClouds) {
      const speed = planet.cloudConfig?.speed || 0.0016;
      cloudSphereRef.current.rotation.y += speed;
    }
  });

  const ringTilt = (Math.PI / 2) + (planet.ringConfig?.tiltOffset || 0.12);

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

        {/* Photorealistic Cloud Turbulence Layer (Đa dạng độ dày & màu sắc) */}
        {hasClouds && cloudsTexture && (
          <mesh ref={cloudSphereRef} scale={[1.025, 1.025, 1.025]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial
              map={cloudsTexture}
              transparent
              opacity={planet.cloudConfig?.opacity ?? (planet.type === 'magma' ? 0.45 : planet.type === 'ocean' ? 0.65 : 0.5)}
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

        {/* Planetary Rings with Polar Concentric UV & Cassini Division */}
        {hasRings && polarRingGeo && ringTexture && (
          <mesh geometry={polarRingGeo} rotation={[ringTilt, 0, 0]}>
            <meshStandardMaterial
              map={ringTexture}
              transparent
              opacity={0.95}
              side={THREE.DoubleSide}
              roughness={0.35}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Multi-Moon Satellite System */}
        {planet.moons && planet.moons.map((moon) => (
          <MoonOrbitItem
            key={moon.id}
            moon={moon}
            planetRadius={radius}
          />
        ))}

        {/* Coordinate Markers on Planet Surface */}
        {showNodes && onSelectNode && planet.nodes.map((node, index) => (
          <LessonCoordinatesMarker
            key={node.id}
            node={node}
            index={index + 1}
            radius={radius}
            onSelectNode={onSelectNode}
          />
        ))}

        {/* Docked / Orbiting Spaceship */}
        {showNodes && (
          <Spaceship3D
            planetRadius={radius}
            activeNode={selectedCoordinateNode}
            onArrival={onShipArrival || (() => {})}
            planetGroupRef={planetGroupRef}
          />
        )}
      </group>
    </group>
  );
};

