import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  createNASAExplorerPBR,
  createCyberpunkPBR,
  createSolarpunkPBR,
  createIndustrialPBR,
  createGundamMechaPBR,
} from './PhotorealisticShipHullTextures';

interface ShipMeshProps {
  shipId: string;
  shipColor: string;
  hasVnFlag: boolean;
  showStreamlines?: boolean;
  scale?: number;
}

// Vietnam Flag Decal Subcomponent
const VietnamFlagDecal: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}> = ({ position, rotation = [-Math.PI / 2, 0, 0], scale = [0.18, 0.12, 0.01] }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <planeGeometry />
        <meshBasicMaterial color="#da251d" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.01]} scale={[0.48, 0.48, 1]}>
        <circleGeometry args={[0.5, 5]} />
        <meshBasicMaterial color="#ffff00" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Aerodynamic Wind Streamlines Visualizer
export const WindStreamlines: React.FC<{ length?: number; radius?: number; count?: number; speed?: number }> = ({
  length = 4.2,
  radius = 0.9,
  count = 36,
  speed = 5.5,
}) => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const r = radius * (0.3 + Math.random() * 0.7);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * (r * 0.55);
      const zOffset = (Math.random() - 0.5) * length;

      const idx = i * 6;
      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = zOffset - 0.45;
      pos[idx + 3] = x;
      pos[idx + 4] = y;
      pos[idx + 5] = zOffset + 0.45;
    }
    return [pos];
  }, [count, length, radius]);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    const posAttr = linesRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      arr[idx + 2] += delta * speed;
      arr[idx + 5] += delta * speed;
      if (arr[idx + 2] > length / 2) {
        arr[idx + 2] -= length;
        arr[idx + 5] -= length;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.65} linewidth={1.5} />
    </lineSegments>
  );
};

// =========================================================================
// 1. NOVA FALCON V1 (Aesthetic 1: NASA / Artemis Realism with PBR Hull)
// =========================================================================
export const CinematicNovaFalcon: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const radarRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  const pbr = useMemo(() => createNASAExplorerPBR(shipColor), [shipColor]);

  useFrame(({ clock }, delta) => {
    if (radarRef.current) radarRef.current.rotation.y += delta * 1.6;
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.15;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.2);
    }
  });

  return (
    <group>
      {/* High-Poly PBR Main Fuselage */}
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.23, 1.35, 32]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.06}
          roughnessMap={pbr.roughnessMap}
          emissiveMap={pbr.emissiveMap}
          emissive={new THREE.Color('#38bdf8')}
          emissiveIntensity={0.8}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          metalness={0.7}
        />
      </mesh>

      {/* Nose Cone with Sensor Probe */}
      <mesh position={[0, 0, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.35, 32]} />
        <meshPhysicalMaterial
          color="#ea580c"
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.8}
        />
      </mesh>
      <mesh position={[0, 0, -1.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.24, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
      </mesh>

      {/* Cockpit Canopy with Pilot HUD Glow */}
      <mesh position={[0, 0.13, -0.26]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.095, 0.32, 24, 24]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Cockpit Titanium Ridge Framing */}
      <mesh position={[0, 0.145, -0.24]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.098, 0.009, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Delta Wings with PBR Panel Texture */}
      <mesh position={[-0.48, -0.02, 0.16]} rotation={[0, -0.18, -0.05]}>
        <boxGeometry args={[0.68, 0.028, 0.48]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.08}
          roughnessMap={pbr.roughnessMap}
          clearcoat={0.6}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0.48, -0.02, 0.16]} rotation={[0, 0.18, 0.05]}>
        <boxGeometry args={[0.68, 0.028, 0.48]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.08}
          roughnessMap={pbr.roughnessMap}
          clearcoat={0.6}
          metalness={0.7}
        />
      </mesh>

      {/* 4 RCS Reaction Control Thrusters Blocks */}
      {[-0.82, 0.82].map((x, idx) => (
        <group key={idx} position={[x, -0.02, 0.08]}>
          <mesh>
            <boxGeometry args={[0.06, 0.05, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <cylinderGeometry args={[0.014, 0.018, 0.025, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* Rotating Parabolic Radar Dish on Upper Spine */}
      <group position={[0, 0.18, 0.1]} ref={radarRef}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.07, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.025, 0.045, 24]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.15} metalness={0.9} clearcoat={0.8} />
        </mesh>
        <mesh position={[0, 0.13, 0.025]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Twin Canted Vertical Stabilizers */}
      <mesh position={[-0.22, 0.2, 0.36]} rotation={[0.1, 0, -0.28]}>
        <boxGeometry args={[0.025, 0.28, 0.32]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.06} color="#ea580c" metalness={0.6} />
      </mesh>
      <mesh position={[0.22, 0.2, 0.36]} rotation={[0.1, 0, 0.28]}>
        <boxGeometry args={[0.025, 0.28, 0.32]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.06} color="#ea580c" metalness={0.6} />
      </mesh>

      {/* Vietnam Flag Decal */}
      {hasVnFlag && <VietnamFlagDecal position={[0.42, 0.015, 0.24]} scale={[0.16, 0.11, 0.01]} />}

      {/* Twin Scientific Ion Propulsion Thrusters */}
      <group position={[0, 0, 0.6]}>
        <mesh position={[-0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.09, 0.16, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.09, 0.16, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>

        <group ref={thrusterRef}>
          <mesh position={[-0.1, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.07, 0.38, 20]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.88} />
          </mesh>
          <mesh position={[0.1, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.07, 0.38, 20]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.88} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// 2. APEX PHANTOM X (Aesthetic 2: Cyberpunk / Synthwave Neon PBR Hull)
// =========================================================================
export const CinematicApexPhantom: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const lidarRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  const pbr = useMemo(() => createCyberpunkPBR(shipColor), [shipColor]);

  useFrame(({ clock }, delta) => {
    if (lidarRef.current) lidarRef.current.rotation.y += delta * 4.2;
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.12;
      thrusterRef.current.scale.set(p, p, 1.2 + Math.sin(clock.getElapsedTime() * 24) * 0.25);
    }
  });

  return (
    <group>
      {/* Faceted Stealth Fuselage with PBR Carbon & Circuit Textures */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.13, 1.25]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.08}
          roughnessMap={pbr.roughnessMap}
          emissiveMap={pbr.emissiveMap}
          emissive={new THREE.Color('#06b6d4')}
          emissiveIntensity={1.2}
          clearcoat={0.9}
          metalness={0.9}
        />
      </mesh>

      {/* Diamond Wings with Circuit Inlays */}
      <mesh position={[-0.48, 0, 0.14]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.58, 0.035, 0.68]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.08}
          roughnessMap={pbr.roughnessMap}
          emissiveMap={pbr.emissiveMap}
          emissive={new THREE.Color('#ec4899')}
          emissiveIntensity={1.2}
          clearcoat={0.9}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[0.48, 0, 0.14]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.58, 0.035, 0.68]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.08}
          roughnessMap={pbr.roughnessMap}
          emissiveMap={pbr.emissiveMap}
          emissive={new THREE.Color('#ec4899')}
          emissiveIntensity={1.2}
          clearcoat={0.9}
          metalness={0.9}
        />
      </mesh>

      {/* Active 360° LIDAR Terrain Scanner Ring */}
      <group position={[0, 0.09, -0.58]} ref={lidarRef}>
        <mesh>
          <cylinderGeometry args={[0.065, 0.065, 0.045, 20]} />
          <meshStandardMaterial color="#0284c7" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <boxGeometry args={[0.03, 0.03, 0.035]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Faceted Magenta Cockpit Visor */}
      <mesh position={[0, 0.11, -0.24]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.23, 0.085, 0.4]} />
        <meshPhysicalMaterial
          color="#a855f7"
          emissive="#7e22ce"
          emissiveIntensity={1.3}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.44, 0.03, 0.18]} scale={[0.16, 0.11, 0.01]} />}

      {/* 2D Flat Hypersonic Violet Plasma Pulse Engine */}
      <group position={[0, 0, 0.64]}>
        <mesh>
          <boxGeometry args={[0.4, 0.085, 0.13]} />
          <meshStandardMaterial color="#030712" metalness={0.95} />
        </mesh>
        <group ref={thrusterRef}>
          <mesh position={[0, 0, 0.18]}>
            <boxGeometry args={[0.34, 0.045, 0.34]} />
            <meshBasicMaterial color="#c084fc" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <boxGeometry args={[0.2, 0.03, 0.18]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.98} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// 3. SOLAR PHOENIX S (Aesthetic 3: Solarpunk Bio-Organic PBR Hull)
// =========================================================================
export const CinematicSolarPhoenix: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const crystalWingRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  const pbr = useMemo(() => createSolarpunkPBR(shipColor), [shipColor]);

  useFrame(({ clock }) => {
    if (crystalWingRef.current) {
      const shimmer = 0.85 + Math.sin(clock.getElapsedTime() * 3) * 0.15;
      crystalWingRef.current.scale.set(1, shimmer, 1);
    }
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 14) * 0.16;
      thrusterRef.current.scale.set(p, p, p * 1.3);
    }
  });

  return (
    <group>
      {/* Pearl White Bio-Organic Fuselage */}
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.18, 1.35, 32]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.06}
          roughnessMap={pbr.roughnessMap}
          clearcoat={0.9}
          metalness={0.8}
        />
      </mesh>

      {/* Front Cosmic Dust Magnetic Scoop Ring */}
      <mesh position={[0, 0, -0.76]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.028, 16, 32]} />
        <meshPhysicalMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.85}
          metalness={0.95}
          clearcoat={0.9}
        />
      </mesh>

      {/* Gold Nano-Coated Cockpit Dome */}
      <mesh position={[0, 0.1, -0.24]} rotation={[0.26, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.34, 20, 20]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.95}
          roughness={0.02}
          metalness={0.98}
        />
      </mesh>

      {/* Shimmering Emerald Solar Collector Wings */}
      <group ref={crystalWingRef}>
        <mesh position={[-0.55, 0, 0.06]} rotation={[0, 0.14, -0.1]}>
          <boxGeometry args={[0.74, 0.025, 0.38]} />
          <meshPhysicalMaterial
            map={pbr.map}
            bumpMap={pbr.bumpMap}
            emissiveMap={pbr.emissiveMap}
            emissive={new THREE.Color('#10b981')}
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.85}
            clearcoat={0.9}
          />
        </mesh>
        <mesh position={[0.55, 0, 0.06]} rotation={[0, -0.14, 0.1]}>
          <boxGeometry args={[0.74, 0.025, 0.38]} />
          <meshPhysicalMaterial
            map={pbr.map}
            bumpMap={pbr.bumpMap}
            emissiveMap={pbr.emissiveMap}
            emissive={new THREE.Color('#10b981')}
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.85}
            clearcoat={0.9}
          />
        </mesh>
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.44, 0.03, 0.08]} scale={[0.15, 0.1, 0.01]} />}

      {/* Solar Fusion Clean Energy Thruster */}
      <group position={[0, 0, 0.62]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.15, 0.14, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.95} />
        </mesh>
        <group ref={thrusterRef}>
          <mesh position={[0, 0, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.12, 0.45, 24]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.11]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.06, 0.24, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// 4. HYPERION DREADNOUGHT D-5 (Aesthetic 4: Heavy Industrial Survey PBR Hull)
// =========================================================================
export const CinematicHyperionIndustrial: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const scopeRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  const pbr = useMemo(() => createIndustrialPBR(shipColor), [shipColor]);

  useFrame(({ clock }) => {
    if (scopeRef.current) scopeRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.4;
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 10) * 0.14;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 14) * 0.2);
    }
  });

  return (
    <group>
      {/* Heavy Steel Armor Plating with Hazard Stripes */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.65, 0.24, 1.35]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.12}
          roughnessMap={pbr.roughnessMap}
          metalness={0.88}
        />
      </mesh>

      {/* Planetary Observatory Telescope Dome */}
      <group position={[0, 0.18, -0.16]} ref={scopeRef}>
        <mesh>
          <sphereGeometry args={[0.13, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, 0.09, -0.07]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.18, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.155, -0.1]}>
          <circleGeometry args={[0.042, 20]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Articulated Mineral Sampling Robotic Arm */}
      <group position={[-0.36, 0, -0.32]}>
        <mesh position={[-0.07, 0, 0]}>
          <boxGeometry args={[0.05, 0.05, 0.22]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[-0.07, 0, -0.16]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.07, 0, -0.24]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.035, 0.035, 0.15]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* 4 Heavy-Duty Survey Stabilizer Fins */}
      <mesh position={[-0.45, 0.13, 0.2]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.32, 0.04, 0.58]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.1} metalness={0.85} />
      </mesh>
      <mesh position={[0.45, 0.13, 0.2]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.32, 0.04, 0.58]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.1} metalness={0.85} />
      </mesh>
      <mesh position={[-0.45, -0.13, 0.2]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.32, 0.04, 0.58]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.1} metalness={0.85} />
      </mesh>
      <mesh position={[0.45, -0.13, 0.2]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.32, 0.04, 0.58]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.1} metalness={0.85} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.36, 0.13, -0.05]} scale={[0.18, 0.12, 0.01]} />}

      {/* Quad Heavy Industrial Ion Thrusters */}
      <group position={[0, 0, 0.7]}>
        {[
          [-0.16, 0.07],
          [0.16, 0.07],
          [-0.16, -0.07],
          [0.16, -0.07],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.08, 0.14, 20]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} />
          </mesh>
        ))}

        <group ref={thrusterRef}>
          {[
            [-0.16, 0.07],
            [0.16, 0.07],
            [-0.16, -0.07],
            [0.16, -0.07],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.055, 0.32, 16]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.88} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// 5. ASTRAL SHUTTLE ORBITER (Aesthetic 5: Clean Anime Mecha PBR Hull)
// =========================================================================
export const CinematicAstralMecha: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const thrusterRef = useRef<THREE.Group>(null);

  const pbr = useMemo(() => createGundamMechaPBR(shipColor), [shipColor]);

  useFrame(({ clock }) => {
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.14;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 22) * 0.25);
    }
  });

  return (
    <group>
      {/* Clean Anime Mecha Tri-Color Fuselage with Sharp Panel Lines */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.45, 0.18, 1.3]} />
        <meshPhysicalMaterial
          map={pbr.map}
          bumpMap={pbr.bumpMap}
          bumpScale={0.08}
          roughnessMap={pbr.roughnessMap}
          clearcoat={0.85}
          metalness={0.7}
        />
      </mesh>

      {/* Mecha Panoramic Cockpit Visor */}
      <mesh position={[0, 0.13, -0.34]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.26, 0.07, 0.2]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.95}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Twin Modular Side Jet Nacelles with Glowing Blue Intake Rings */}
      <group position={[-0.36, 0, 0.06]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.095, 0.105, 0.9, 24]} />
          <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.08} clearcoat={0.8} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0, -0.47]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.016, 16, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      <group position={[0.36, 0, 0.06]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.095, 0.105, 0.9, 24]} />
          <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.08} clearcoat={0.8} metalness={0.75} />
        </mesh>
        <mesh position={[0, 0, -0.47]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.016, 16, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Cobalt Blue Swept Wings */}
      <mesh position={[-0.62, 0, 0.22]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.42, 0.025, 0.38]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.08} clearcoat={0.8} metalness={0.75} />
      </mesh>
      <mesh position={[0.62, 0, 0.22]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.42, 0.025, 0.38]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.08} clearcoat={0.8} metalness={0.75} />
      </mesh>

      {/* High-Mobility Tall Dorsal Mecha Fin */}
      <mesh position={[0, 0.24, 0.35]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.028, 0.32, 0.38]} />
        <meshPhysicalMaterial map={pbr.map} bumpMap={pbr.bumpMap} bumpScale={0.08} color="#ffffff" metalness={0.6} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.5, 0.02, 0.22]} scale={[0.16, 0.11, 0.01]} />}

      {/* Tri-Engine Rocket Propulsion Cluster */}
      <group position={[0, 0, 0.66]}>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.095, 0.13, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[-0.13, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.095, 0.13, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0.13, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.095, 0.13, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>

        <group ref={thrusterRef}>
          {[
            [0, 0.08],
            [-0.13, -0.045],
            [0.13, -0.045],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.19]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.07, 0.38, 20]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// MASTER CINEMATIC SCI-FI PBR SHIP RENDERER
// =========================================================================
export const AerodynamicShipRenderer: React.FC<ShipMeshProps> = ({
  shipId,
  shipColor,
  hasVnFlag,
  showStreamlines = true,
  scale = 1.0,
}) => {
  const renderShipModel = () => {
    switch (shipId) {
      case 'falcon_apex':
        return <CinematicApexPhantom shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'solar_phoenix':
        return <CinematicSolarPhoenix shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'starlight_runner':
        return <CinematicHyperionIndustrial shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'astral_shuttle':
        return <CinematicAstralMecha shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'explorer_v1':
      default:
        return <CinematicNovaFalcon shipColor={shipColor} hasVnFlag={hasVnFlag} />;
    }
  };

  return (
    <group scale={[scale, scale, scale]}>
      {renderShipModel()}
      {showStreamlines && <WindStreamlines length={4.5} radius={1.1} count={36} speed={6.0} />}
    </group>
  );
};
