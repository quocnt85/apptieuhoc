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
const VietnamFlagDecal: React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; scale?: [number, number, number] }> = ({
  position,
  rotation = [-Math.PI / 2, 0, 0],
  scale = [0.18, 0.12, 0.01],
}) => {
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

// ==========================================
// 1. NOVA FALCON V1 (Supersonic Delta Interceptor with Cambered Airfoils)
// ==========================================
export const NovaFalconV1Mesh: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({ shipColor, hasVnFlag }) => {
  const thrusterRef = useRef<THREE.Group>(null);

  // Curved Aerodynamic Delta Wing Extrusion Shape
  const deltaWingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Start at nose apex
    shape.moveTo(0, -0.75);
    // Left swept leading edge with smooth Bézier curvature
    shape.quadraticCurveTo(-0.35, 0.0, -0.85, 0.38);
    // Left wingtip
    shape.lineTo(-0.85, 0.45);
    // Trailing edge with inboard sweep
    shape.quadraticCurveTo(-0.3, 0.35, -0.15, 0.52);
    // Engine mount base
    shape.lineTo(0.15, 0.52);
    // Right trailing edge
    shape.quadraticCurveTo(0.3, 0.35, 0.85, 0.45);
    // Right wingtip
    shape.lineTo(0.85, 0.38);
    // Right swept leading edge
    shape.quadraticCurveTo(0.35, 0.0, 0, -0.75);

    const extrudeSettings = {
      steps: 1,
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame(({ clock }) => {
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.15;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 22) * 0.25);
    }
  });

  return (
    <group>
      {/* Aerodynamic Cambered Delta Wing */}
      <mesh geometry={deltaWingGeometry} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <meshStandardMaterial color={shipColor} roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Supersonic Spindle Fuselage */}
      <mesh position={[0, 0.02, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.18, 1.35, 24]} />
        <meshStandardMaterial color={shipColor} roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Sharp Supersonic Needle Pitot Tube */}
      <mesh position={[0, 0.02, -0.92]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.025, 0.38, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Bubble Teardrop Canopy Glass */}
      <mesh position={[0, 0.11, -0.22]} rotation={[0.32, 0, 0]}>
        <capsuleGeometry args={[0.08, 0.32, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.85}
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Canopy Titanium Frame Ridge */}
      <mesh position={[0, 0.13, -0.2]} rotation={[0.32, 0, 0]}>
        <torusGeometry args={[0.082, 0.008, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Twin Canted Vertical Stabilizers (Vát 15° ra ngoài) */}
      <mesh position={[-0.22, 0.18, 0.32]} rotation={[0.1, 0, -0.28]}>
        <boxGeometry args={[0.02, 0.28, 0.32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0.22, 0.18, 0.32]} rotation={[0.1, 0, 0.28]}>
        <boxGeometry args={[0.02, 0.28, 0.32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Side Supersonic Air Intakes */}
      <mesh position={[-0.18, -0.04, -0.1]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.08, 0.09, 0.32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0.18, -0.04, -0.1]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.09, 0.32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Wingtip Navigation Strobe Lights */}
      <mesh position={[-0.82, -0.02, 0.38]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.82, -0.02, 0.38]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.42, 0.015, 0.22]} scale={[0.16, 0.11, 0.01]} />}

      {/* Twin Convergent Afterburner Engines */}
      <group position={[0, 0, 0.52]}>
        <mesh position={[-0.09, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.09, 0.16, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0.09, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.09, 0.16, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Pulsing Fire & Plasma Jets */}
        <group ref={thrusterRef}>
          <mesh position={[-0.09, 0, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.07, 0.38, 16]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.88} />
          </mesh>
          <mesh position={[-0.09, 0, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.035, 0.22, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} />
          </mesh>

          <mesh position={[0.09, 0, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.07, 0.38, 16]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.88} />
          </mesh>
          <mesh position={[0.09, 0, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.035, 0.22, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ==========================================
// 2. APEX PHANTOM X (Blended Wing-Body Stealth Diamond Wing)
// ==========================================
export const ApexPhantomXMesh: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({ shipColor, hasVnFlag }) => {
  const thrusterRef = useRef<THREE.Group>(null);

  // Blended Wing Body Extrusion Shape
  const bwbGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Chisel stealth nose
    shape.moveTo(0, -0.85);
    // Left chine leading edge
    shape.lineTo(-0.35, -0.4);
    // Left diamond wing apex
    shape.lineTo(-0.95, 0.12);
    // Left swept trailing edge
    shape.lineTo(-0.55, 0.45);
    // Left nozzle bay
    shape.lineTo(-0.22, 0.55);
    // Center nozzle cutoff
    shape.lineTo(0.22, 0.55);
    // Right nozzle bay
    shape.lineTo(0.55, 0.45);
    // Right diamond wing apex
    shape.lineTo(0.95, 0.12);
    // Right chine leading edge
    shape.lineTo(0.35, -0.4);
    shape.lineTo(0, -0.85);

    const extrudeSettings = {
      steps: 1,
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame(({ clock }) => {
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 18) * 0.12;
      thrusterRef.current.scale.set(1.0 + Math.random() * 0.08, p, 1.2 + Math.random() * 0.18);
    }
  });

  return (
    <group>
      {/* Blended Wing Body */}
      <mesh geometry={bwbGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={shipColor} roughness={0.2} metalness={0.88} />
      </mesh>

      {/* Faceted Stealth Cockpit Canopy */}
      <mesh position={[0, 0.08, -0.28]} rotation={[0.26, 0, 0]}>
        <boxGeometry args={[0.22, 0.09, 0.42]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.9}
          metalness={0.95}
          roughness={0.08}
        />
      </mesh>

      {/* Canted Low-RCS Vertical Stabilizers */}
      <mesh position={[-0.32, 0.14, 0.35]} rotation={[0.08, 0, -0.52]}>
        <boxGeometry args={[0.025, 0.22, 0.38]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.32, 0.14, 0.35]} rotation={[0.08, 0, 0.52]}>
        <boxGeometry args={[0.025, 0.22, 0.38]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Vietnam Flag Decal */}
      {hasVnFlag && <VietnamFlagDecal position={[0.55, 0.05, 0.12]} scale={[0.16, 0.11, 0.01]} />}

      {/* 2D Flat Thrust Vectoring Nozzle */}
      <mesh position={[0, 0, 0.58]}>
        <boxGeometry args={[0.42, 0.08, 0.14]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Hypersonic Violet Plasma Plume */}
      <group ref={thrusterRef} position={[0, 0, 0.68]}>
        <mesh position={[0, 0, 0.14]}>
          <boxGeometry args={[0.36, 0.04, 0.32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.88} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.22, 0.025, 0.18]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} />
        </mesh>
      </group>
    </group>
  );
};

// ==========================================
// 3. SOLAR PHOENIX S (Curved Forward-Swept Wings + Canards)
// ==========================================
export const SolarPhoenixSMesh: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({ shipColor, hasVnFlag }) => {
  const thrusterRef = useRef<THREE.Group>(null);

  // Forward-Swept Wings Extrusion Shape
  const fswGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.65);
    // Canards root
    shape.lineTo(-0.18, -0.38);
    // Canard left wing
    shape.lineTo(-0.45, -0.45);
    shape.lineTo(-0.42, -0.32);
    shape.lineTo(-0.16, -0.22);
    // Fuselage to main forward-swept wing
    shape.lineTo(-0.18, 0.18);
    // Forward-swept wing leading edge (reaches forward to -Z)
    shape.quadraticCurveTo(-0.55, 0.05, -0.92, -0.15);
    // Winglet
    shape.lineTo(-0.95, -0.05);
    // Trailing edge
    shape.quadraticCurveTo(-0.6, 0.22, -0.18, 0.48);
    // Rear engine deck
    shape.lineTo(0.18, 0.48);
    // Right wing trailing edge
    shape.quadraticCurveTo(0.6, 0.22, 0.95, -0.05);
    // Right winglet
    shape.lineTo(0.92, -0.15);
    // Right forward-swept leading edge
    shape.quadraticCurveTo(0.55, 0.05, 0.18, 0.18);
    // Right canard
    shape.lineTo(0.16, -0.22);
    shape.lineTo(0.42, -0.32);
    shape.lineTo(0.45, -0.45);
    shape.lineTo(0.18, -0.38);
    shape.lineTo(0, -0.65);

    const extrudeSettings = {
      steps: 1,
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame(({ clock }) => {
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 14) * 0.18;
      thrusterRef.current.scale.set(p, p, p * 1.35);
    }
  });

  return (
    <group>
      {/* Forward-Swept Curved Wing Body */}
      <mesh geometry={fswGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={shipColor} roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Central Spindle Fuselage */}
      <mesh position={[0, 0.02, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.17, 1.35, 24]} />
        <meshStandardMaterial color={shipColor} roughness={0.2} metalness={0.85} />
      </mesh>

      {/* Gold Radiant Cockpit Dome */}
      <mesh position={[0, 0.1, -0.25]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.075, 0.32, 16, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={0.85}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Upturned 3D Winglets at Wingtips */}
      <mesh position={[-0.88, 0.09, -0.08]} rotation={[0, 0, 0.48]}>
        <boxGeometry args={[0.02, 0.18, 0.22]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.8} />
      </mesh>
      <mesh position={[0.88, 0.09, -0.08]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[0.02, 0.18, 0.22]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Central Vertical Stabilizer */}
      <mesh position={[0, 0.18, 0.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.025, 0.25, 0.35]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.45, 0.03, 0.05]} scale={[0.15, 0.1, 0.01]} />}

      {/* Solar Fusion Core Thruster */}
      <group position={[0, 0, 0.58]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.14, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
        </mesh>
        <group ref={thrusterRef}>
          <mesh position={[0, 0, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.13, 0.45, 20]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.065, 0.24, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.98} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ==========================================
// 4. HYPERION DREADNOUGHT D-5 (Armored Faceted Lifting Body + Quad Ion)
// ==========================================
export const HyperionDreadnoughtMesh: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({ shipColor, hasVnFlag }) => {
  const thrusterRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 12) * 0.15;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.2);
    }
  });

  return (
    <group>
      {/* Heavy Armored Faceted Lifting Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.62, 0.22, 1.35]} />
        <meshStandardMaterial color={shipColor} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Sloped Heavy Armor Chisel Nose */}
      <mesh position={[0, 0.02, -0.78]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.44, 0.15, 0.38]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Armored Command Bridge Visor */}
      <mesh position={[0, 0.16, -0.22]}>
        <boxGeometry args={[0.26, 0.1, 0.42]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.18, -0.42]}>
        <boxGeometry args={[0.2, 0.035, 0.04]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.2} />
      </mesh>

      {/* 4 Heavy X-Fins (4 Cánh ổn định chữ X) */}
      <mesh position={[-0.42, 0.15, 0.18]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.35, 0.04, 0.65]} />
        <meshStandardMaterial color={shipColor} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.42, 0.15, 0.18]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.35, 0.04, 0.65]} />
        <meshStandardMaterial color={shipColor} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[-0.42, -0.15, 0.18]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.35, 0.04, 0.65]} />
        <meshStandardMaterial color={shipColor} metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.42, -0.15, 0.18]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.35, 0.04, 0.65]} />
        <meshStandardMaterial color={shipColor} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.35, 0.12, -0.05]} scale={[0.18, 0.12, 0.01]} />}

      {/* Quad Heavy Ion Engine Nozzles */}
      <group position={[0, 0, 0.68]}>
        {[
          [-0.16, 0.07],
          [0.16, 0.07],
          [-0.16, -0.07],
          [0.16, -0.07],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.08, 0.14, 16]} />
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
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// ==========================================
// 5. ASTRAL SHUTTLE ORBITER (Wave-Rider Lifting Body + Tri-Rocket Cluster)
// ==========================================
export const AstralShuttleMesh: React.FC<{ shipColor: string; hasVnFlag: boolean }> = ({ shipColor, hasVnFlag }) => {
  const thrusterRef = useRef<THREE.Group>(null);

  // Curved Wave-Rider Shuttle Extrusion
  const shuttleGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Thermal rounded blunt nose
    shape.moveTo(0, -0.75);
    shape.quadraticCurveTo(-0.25, -0.55, -0.32, -0.2);
    // Double delta wing root to tip
    shape.quadraticCurveTo(-0.45, 0.05, -0.85, 0.35);
    // Wingtip
    shape.lineTo(-0.85, 0.45);
    // Trailing edge
    shape.lineTo(-0.25, 0.52);
    // Engine mount deck
    shape.lineTo(0.25, 0.52);
    // Right trailing edge
    shape.lineTo(0.85, 0.45);
    // Right wingtip
    shape.lineTo(0.85, 0.35);
    // Right double delta leading edge
    shape.quadraticCurveTo(0.45, 0.05, 0.32, -0.2);
    shape.quadraticCurveTo(0.25, -0.55, 0, -0.75);

    const extrudeSettings = {
      steps: 1,
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame(({ clock }) => {
    if (thrusterRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.14;
      thrusterRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 22) * 0.25);
    }
  });

  return (
    <group>
      {/* Wave Rider Aerodynamic Fuselage */}
      <mesh geometry={shuttleGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={shipColor} roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Black Heat Shield Underside Tiles */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.65, 0.02, 1.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Thermal Blunt Nose Cap */}
      <mesh position={[0, 0, -0.68]}>
        <sphereGeometry args={[0.16, 24, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Wide Panoramic Flight Deck Cockpit */}
      <mesh position={[0, 0.1, -0.38]} rotation={[0.38, 0, 0]}>
        <boxGeometry args={[0.26, 0.07, 0.22]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Tall Central Vertical Stabilizer */}
      <mesh position={[0, 0.22, 0.35]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.03, 0.32, 0.38]} />
        <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Vietnam Flag Decal */}
      {hasVnFlag && <VietnamFlagDecal position={[0.48, 0.04, 0.2]} scale={[0.18, 0.12, 0.01]} />}

      {/* Tri-Engine Rocket Cluster (RS-30 Style) */}
      <group position={[0, 0, 0.62]}>
        {/* Top Center Engine */}
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.1, 0.14, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        {/* Bottom Left Engine */}
        <mesh position={[-0.13, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.1, 0.14, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        {/* Bottom Right Engine */}
        <mesh position={[0.13, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.1, 0.14, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>

        {/* 3 Main Fire Plasma Plumes */}
        <group ref={thrusterRef}>
          {[
            [0, 0.08],
            [-0.13, -0.05],
            [0.13, -0.05],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.085, 0.42, 16]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.88} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// ==========================================
// MASTER AERODYNAMIC SHIP RENDERER
// ==========================================
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
        return <ApexPhantomXMesh shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'solar_phoenix':
        return <SolarPhoenixSMesh shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'starlight_runner':
        return <HyperionDreadnoughtMesh shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'astral_shuttle':
        return <AstralShuttleMesh shipColor={shipColor} hasVnFlag={hasVnFlag} />;
      case 'explorer_v1':
      default:
        return <NovaFalconV1Mesh shipColor={shipColor} hasVnFlag={hasVnFlag} />;
    }
  };

  return (
    <group scale={[scale, scale, scale]}>
      {renderShipModel()}
      {showStreamlines && <WindStreamlines length={4.5} radius={1.1} count={36} speed={6.0} />}
    </group>
  );
};
