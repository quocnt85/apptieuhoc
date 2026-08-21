import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

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
// AESTHETIC 1: NASA / RETRO SPACE SCI-FI EXPLORATION (Nova Falcon V1)
// Clean White Hull + Safety Orange + Rotating Radar Dish + RCS Thruster Pods
// =========================================================================
export const NovaFalconNASAExplorer: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const radarRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.8;
    }
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.15;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.2);
    }
  });

  return (
    <group>
      {/* Aerodynamic White / Primary Hull */}
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.22, 1.3, 24]} />
        <meshStandardMaterial color={shipColor || '#f8fafc'} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Nose Cone with Sensor Probe Mast */}
      <mesh position={[0, 0, -0.78]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.32, 24]} />
        <meshStandardMaterial color="#ea580c" roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.98]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
      </mesh>

      {/* Panoramic Astronaut Observation Cockpit Dome */}
      <mesh position={[0, 0.12, -0.25]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.09, 0.3, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Scientific Delta Swept Wings */}
      <mesh position={[-0.45, -0.02, 0.15]} rotation={[0, -0.2, -0.05]}>
        <boxGeometry args={[0.65, 0.025, 0.45]} />
        <meshStandardMaterial color={shipColor || '#f8fafc'} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0.45, -0.02, 0.15]} rotation={[0, 0.2, 0.05]}>
        <boxGeometry args={[0.65, 0.025, 0.45]} />
        <meshStandardMaterial color={shipColor || '#f8fafc'} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Safety Orange Wing Trim */}
      <mesh position={[-0.78, -0.02, 0.18]}>
        <boxGeometry args={[0.06, 0.03, 0.38]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>
      <mesh position={[0.78, -0.02, 0.18]}>
        <boxGeometry args={[0.06, 0.03, 0.38]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>

      {/* 4 RCS Reaction Control Thruster Blocks at Wingtips */}
      {[-0.78, 0.78].map((x, idx) => (
        <group key={idx} position={[x, -0.02, 0.05]}>
          <mesh>
            <boxGeometry args={[0.05, 0.045, 0.05]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.03, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.015, 0.02, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      ))}

      {/* Rotating Parabolic Space Radar Dish on Spine */}
      <group position={[0, 0.16, 0.08]} ref={radarRef}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.06, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.02, 0.04, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.12, 0.02]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Twin Canted Vertical Stabilizers */}
      <mesh position={[-0.2, 0.18, 0.35]} rotation={[0.1, 0, -0.25]}>
        <boxGeometry args={[0.02, 0.26, 0.3]} />
        <meshStandardMaterial color="#ea580c" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.2, 0.18, 0.35]} rotation={[0.1, 0, 0.25]}>
        <boxGeometry args={[0.02, 0.26, 0.3]} />
        <meshStandardMaterial color="#ea580c" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.38, 0.01, 0.22]} scale={[0.16, 0.11, 0.01]} />}

      {/* Twin Scientific Ion Exploration Engines */}
      <group position={[0, 0, 0.58]}>
        <mesh position={[-0.09, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.085, 0.14, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0.09, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.085, 0.14, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>

        <group ref={thrusterRef}>
          <mesh position={[-0.09, 0, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.065, 0.35, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.88} />
          </mesh>
          <mesh position={[0.09, 0, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.065, 0.35, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.88} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// AESTHETIC 2: CYBERPUNK / SYNTHWAVE HIGH-TECH NEON (Apex Phantom X)
// Obsidian Black Faceted + Cyan/Magenta Circuit Traces + 360 LIDAR Scanner
// =========================================================================
export const ApexPhantomCyberpunk: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const lidarRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (lidarRef.current) {
      lidarRef.current.rotation.y += delta * 4.0;
    }
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.12;
      thrusterRef.current.scale.set(p, p, 1.2 + Math.sin(clock.getElapsedTime() * 24) * 0.25);
    }
  });

  return (
    <group>
      {/* Faceted Stealth Hull with Dark Obsidian / Custom Paint */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.48, 0.12, 1.2]} />
        <meshStandardMaterial color={shipColor || '#090d16'} roughness={0.15} metalness={0.92} />
      </mesh>

      {/* Diamond-Wing Side Panels with Neon Inlay Traces */}
      <mesh position={[-0.45, 0, 0.12]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[0.55, 0.03, 0.65]} />
        <meshStandardMaterial color={shipColor || '#090d16'} roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.45, 0, 0.12]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.55, 0.03, 0.65]} />
        <meshStandardMaterial color={shipColor || '#090d16'} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Cyan & Magenta Neon Circuit Lines */}
      <mesh position={[-0.45, 0.02, 0.12]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[0.52, 0.005, 0.03]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[0.45, 0.02, 0.12]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.52, 0.005, 0.03]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[-0.72, 0.02, 0.12]}>
        <boxGeometry args={[0.02, 0.005, 0.45]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>
      <mesh position={[0.72, 0.02, 0.12]}>
        <boxGeometry args={[0.02, 0.005, 0.45]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>

      {/* Active 360° LIDAR Terrain Scanner Ring on Nose */}
      <group position={[0, 0.08, -0.55]} ref={lidarRef}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0, 0.04]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.025, 0.025, 0.03]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Faceted Neon Cockpit Visor */}
      <mesh position={[0, 0.1, -0.22]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.22, 0.08, 0.38]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7e22ce"
          emissiveIntensity={1.2}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.42, 0.03, 0.18]} scale={[0.16, 0.11, 0.01]} />}

      {/* Hypersonic Violet Plasma Pulse Engine */}
      <group position={[0, 0, 0.6]}>
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[0.38, 0.08, 0.12]} />
          <meshStandardMaterial color="#030712" metalness={0.95} />
        </mesh>
        <group ref={thrusterRef}>
          <mesh position={[0, 0, 0.16]}>
            <boxGeometry args={[0.32, 0.04, 0.3]} />
            <meshBasicMaterial color="#c084fc" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.08]}>
            <boxGeometry args={[0.18, 0.025, 0.15]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.98} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// AESTHETIC 3: SOLARPUNK / BIO-ORGANIC FUTURISTIC (Solar Phoenix S)
// Regal Gold + Emerald Green Crystal Solar Wings + Cosmic Dust Scoop Ring
// =========================================================================
export const SolarPhoenixSolarpunk: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const crystalWingRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (crystalWingRef.current) {
      const shimmer = 0.8 + Math.sin(clock.getElapsedTime() * 3) * 0.2;
      crystalWingRef.current.scale.set(1, shimmer, 1);
    }
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 12) * 0.15;
      thrusterRef.current.scale.set(p, p, p * 1.3);
    }
  });

  return (
    <group>
      {/* Elegant Bio-Organic Spindle Fuselage */}
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.16, 1.3, 24]} />
        <meshStandardMaterial color={shipColor || '#ffffff'} roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Cosmic Dust Magnetic Scoop Collector Ring on Front */}
      <mesh position={[0, 0, -0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.025, 16, 24]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.8}
          metalness={0.9}
        />
      </mesh>

      {/* Gold Nano-Coated Anti-Radiation Glass Dome */}
      <mesh position={[0, 0.09, -0.22]} rotation={[0.25, 0, 0]}>
        <capsuleGeometry args={[0.075, 0.32, 16, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.9}
          roughness={0.02}
          metalness={0.98}
        />
      </mesh>

      {/* Bio-Mimetic Crystalline Solar Array Wings (Emerald Green) */}
      <group ref={crystalWingRef}>
        <mesh position={[-0.52, 0, 0.05]} rotation={[0, 0.15, -0.1]}>
          <boxGeometry args={[0.7, 0.02, 0.35]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.7}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0.52, 0, 0.05]} rotation={[0, -0.15, 0.1]}>
          <boxGeometry args={[0.7, 0.02, 0.35]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.7}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Upturned Leaf Winglets */}
        <mesh position={[-0.88, 0.08, 0.08]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[0.03, 0.16, 0.2]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
        <mesh position={[0.88, 0.08, 0.08]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[0.03, 0.16, 0.2]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.42, 0.03, 0.08]} scale={[0.15, 0.1, 0.01]} />}

      {/* Solar Fusion Clean Energy Thruster */}
      <group position={[0, 0, 0.58]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.12, 24]} />
          <meshStandardMaterial color="#d97706" metalness={0.95} />
        </mesh>
        <group ref={thrusterRef}>
          <mesh position={[0, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.11, 0.42, 20]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.055, 0.22, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// AESTHETIC 4: HEAVY INDUSTRIAL / DEEP SPACE SURVEY (Hyperion D-5)
// Gunmetal + Hazard Stripes + Planetary Observatory Telescope + Sampling Arm
// =========================================================================
export const HyperionIndustrialSurvey: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const scopeRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (scopeRef.current) {
      scopeRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.4;
    }
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 10) * 0.14;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 14) * 0.2);
    }
  });

  return (
    <group>
      {/* Heavy Armored Survey Hull */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.62, 0.22, 1.3]} />
        <meshStandardMaterial color={shipColor || '#334155'} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Hazard Yellow/Black Stripes Accent */}
      <mesh position={[0, 0.115, 0.35]}>
        <boxGeometry args={[0.58, 0.005, 0.15]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.115, 0.35]}>
        <boxGeometry args={[0.58, 0.005, 0.15]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>

      {/* Reinforced Chisel Bow */}
      <mesh position={[0, 0, -0.74]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.42, 0.16, 0.28]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>

      {/* Large Planetary Observatory Telescope Dome on Upper Deck */}
      <group position={[0, 0.16, -0.15]} ref={scopeRef}>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.08, -0.06]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.16, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.14, -0.09]}>
          <circleGeometry args={[0.038, 16]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Articulated Mineral Sampling Arm (Left Side) */}
      <group position={[-0.34, 0, -0.3]}>
        <mesh position={[-0.06, 0, 0]}>
          <boxGeometry args={[0.04, 0.04, 0.2]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[-0.06, 0, -0.15]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.06, 0, -0.22]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.03, 0.03, 0.14]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* 4 Heavy-Duty Survey Stabilizer Wings */}
      <mesh position={[-0.42, 0.12, 0.18]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.3, 0.035, 0.55]} />
        <meshStandardMaterial color={shipColor || '#334155'} metalness={0.8} />
      </mesh>
      <mesh position={[0.42, 0.12, 0.18]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.3, 0.035, 0.55]} />
        <meshStandardMaterial color={shipColor || '#334155'} metalness={0.8} />
      </mesh>
      <mesh position={[-0.42, -0.12, 0.18]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.3, 0.035, 0.55]} />
        <meshStandardMaterial color={shipColor || '#334155'} metalness={0.8} />
      </mesh>
      <mesh position={[0.42, -0.12, 0.18]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.3, 0.035, 0.55]} />
        <meshStandardMaterial color={shipColor || '#334155'} metalness={0.8} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.35, 0.12, -0.05]} scale={[0.18, 0.12, 0.01]} />}

      {/* Quad Heavy-Duty Industrial Ion Thrusters */}
      <group position={[0, 0, 0.65]}>
        {[
          [-0.15, 0.06],
          [0.15, 0.06],
          [-0.15, -0.06],
          [0.15, -0.06],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.075, 0.12, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} />
          </mesh>
        ))}

        <group ref={thrusterRef}>
          {[
            [-0.15, 0.06],
            [0.15, 0.06],
            [-0.15, -0.06],
            [0.15, -0.06],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.16]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.05, 0.28, 16]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.88} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// AESTHETIC 5: CLEAN ANIME MECHA / GUNDAM SCI-FI (Astral Shuttle Orbiter)
// Gundam Tri-Color + Twin Side Nacelles with Glowing Blue Intake Rings
// =========================================================================
export const AstralShuttleMecha: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({
  shipColor,
  hasVnFlag,
}) => {
  const nacelleFanRef = useRef<THREE.Group>(null);
  const thrusterRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (nacelleFanRef.current) {
      nacelleFanRef.current.rotation.z += delta * 6.0;
    }
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.14;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 22) * 0.25);
    }
  });

  return (
    <group>
      {/* Gundam Clean Mecha White Fuselage */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.42, 0.16, 1.25]} />
        <meshStandardMaterial color={shipColor || '#ffffff'} roughness={0.2} metalness={0.65} />
      </mesh>

      {/* Cobalt Blue & Crimson Red Mecha Chest Armor */}
      <mesh position={[0, 0.09, -0.15]}>
        <boxGeometry args={[0.32, 0.04, 0.45]} />
        <meshStandardMaterial color="#2563eb" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.11, -0.4]}>
        <boxGeometry args={[0.16, 0.02, 0.1]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} />
      </mesh>

      {/* Mecha Panoramic Cockpit Visor */}
      <mesh position={[0, 0.12, -0.32]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.24, 0.06, 0.18]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Twin Modular Side Jet Nacelles with Glowing Blue Intake Rings */}
      <group position={[-0.34, 0, 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.85, 20]} />
          <meshStandardMaterial color={shipColor || '#ffffff'} roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Front Glowing Intake Ring */}
        <mesh position={[0, 0, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.015, 12, 20]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      <group position={[0.34, 0, 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.85, 20]} />
          <meshStandardMaterial color={shipColor || '#ffffff'} roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Front Glowing Intake Ring */}
        <mesh position={[0, 0, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.015, 12, 20]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Cobalt Blue Swept Stabilizer Wings */}
      <mesh position={[-0.58, 0, 0.2]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.38, 0.02, 0.35]} />
        <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.7} />
      </mesh>
      <mesh position={[0.58, 0, 0.2]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.38, 0.02, 0.35]} />
        <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* High-Mobility Tall Dorsal Mecha Fin */}
      <mesh position={[0, 0.22, 0.32]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.025, 0.3, 0.35]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.48, 0.02, 0.2]} scale={[0.16, 0.11, 0.01]} />}

      {/* Tri-Engine Rocket Propulsion Cluster */}
      <group position={[0, 0, 0.62]}>
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.12, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[-0.12, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.12, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0.12, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.12, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>

        <group ref={thrusterRef}>
          {[
            [0, 0.07],
            [-0.12, -0.04],
            [0.12, -0.04],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.065, 0.36, 16]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// MASTER SCIENTIFIC EXPLORATION SHIP RENDERER (5 DISTINCT AESTHETICS)
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
        return <ApexPhantomCyberpunk shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'solar_phoenix':
        return <SolarPhoenixSolarpunk shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'starlight_runner':
        return <HyperionIndustrialSurvey shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'astral_shuttle':
        return <AstralShuttleMecha shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'explorer_v1':
      default:
        return <NovaFalconNASAExplorer shipColor={shipColor} hasVnFlag={hasVnFlag} />;
    }
  };

  return (
    <group scale={[scale, scale, scale]}>
      {renderShipModel()}
      {showStreamlines && <WindStreamlines length={4.5} radius={1.1} count={36} speed={6.0} />}
    </group>
  );
};
