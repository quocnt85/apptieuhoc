import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ShipMeshProps {
  shipId: string;
  shipColor?: string;
  hasVnFlag?: boolean;
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
  length = 5.0,
  radius = 1.3,
  count = 42,
  speed = 6.5,
}) => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const [positions] = React.useMemo(() => {
    const pos = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const r = radius * (0.35 + Math.random() * 0.65);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * (r * 0.6);
      const zOffset = (Math.random() - 0.5) * length;

      const idx = i * 6;
      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = zOffset - 0.5;
      pos[idx + 3] = x;
      pos[idx + 4] = y;
      pos[idx + 5] = zOffset + 0.5;
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
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.6} linewidth={1.5} />
    </lineSegments>
  );
};

// =========================================================================
// 1. STAR WARS X-WING STYLE: NOVA X-EXPLORER (Cánh kép S-Foil, 4 Động cơ Tuabin)
// =========================================================================
export const NovaXWingShip: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const enginesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (enginesRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.15;
      enginesRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 22) * 0.2);
    }
  });

  return (
    <group>
      {/* 1. Main Tapered Fuselage (Thân thon dài đa giác 3 tầng) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.22, 1.6, 8]} />
        <meshPhysicalMaterial color="#f1f5f9" roughness={0.25} metalness={0.7} clearcoat={0.6} />
      </mesh>

      {/* Nose Cone Sharp Chined Tip */}
      <mesh position={[0, 0, -0.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.35, 8]} />
        <meshPhysicalMaterial color="#e2e8f0" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Cockpit Canopy with Faceted Golden Frame */}
      <mesh position={[0, 0.12, -0.22]} rotation={[0.28, 0, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.42]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={0.6}
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Astromech Droid Dome Socket behind Cockpit */}
      <group position={[0, 0.13, 0.12]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.02, 0.035, -0.04]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* 2. S-FOIL 4-WING SCISSOR MECHANISM (4 Cánh mở chéo chữ X) */}
      {/* Top Left Wing (Góc nâng +14°) */}
      <group position={[-0.1, 0.04, 0.3]} rotation={[0, 0, 0.24]}>
        <mesh position={[-0.55, 0, -0.1]} rotation={[0, -0.12, 0]}>
          <boxGeometry args={[0.85, 0.022, 0.42]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Red Rebel Chevron Stripe */}
        <mesh position={[-0.6, 0.012, -0.1]}>
          <boxGeometry args={[0.2, 0.005, 0.38]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        {/* Wingtip Scientific Sensor Probe (Cột cảm biến đầu cánh) */}
        <mesh position={[-0.98, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.1, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.95} />
        </mesh>
        <mesh position={[-0.98, 0, -1.02]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Top Right Wing (Góc nâng -14°) */}
      <group position={[0.1, 0.04, 0.3]} rotation={[0, 0, -0.24]}>
        <mesh position={[0.55, 0, -0.1]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[0.85, 0.022, 0.42]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.6, 0.012, -0.1]}>
          <boxGeometry args={[0.2, 0.005, 0.38]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        <mesh position={[0.98, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.1, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.95} />
        </mesh>
        <mesh position={[0.98, 0, -1.02]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Bottom Left Wing (Góc hạ -14°) */}
      <group position={[-0.1, -0.04, 0.3]} rotation={[0, 0, -0.24]}>
        <mesh position={[-0.55, 0, -0.1]} rotation={[0, -0.12, 0]}>
          <boxGeometry args={[0.85, 0.022, 0.42]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[-0.98, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.1, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.95} />
        </mesh>
        <mesh position={[-0.98, 0, -1.02]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Bottom Right Wing (Góc hạ +14°) */}
      <group position={[0.1, -0.04, 0.3]} rotation={[0, 0, 0.24]}>
        <mesh position={[0.55, 0, -0.1]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[0.85, 0.022, 0.42]} />
          <meshPhysicalMaterial color="#f8fafc" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0.98, 0, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.1, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.95} />
        </mesh>
        <mesh position={[0.98, 0, -1.02]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 3. QUAD FUSIAL THRUST ENGINES (4 Động cơ Tuabin khổng lồ gắn ở gốc cánh) */}
      {[
        [-0.22, 0.1],
        [0.22, 0.1],
        [-0.22, -0.1],
        [0.22, -0.1],
      ].map(([x, y], idx) => (
        <group key={idx} position={[x, y, 0.35]}>
          {/* Intake Cowl & Turbine Fan */}
          <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.12, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, -0.27]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.075, 0.015, 12, 20]} />
            <meshStandardMaterial color="#0f172a" metalness={0.98} />
          </mesh>
          {/* Engine Body with Heat Fins */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.095, 0.55, 20]} />
            <meshPhysicalMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Exhaust Nozzle */}
          <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.075, 0.09, 0.14, 20]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Exhaust Plasma Flames */}
      <group ref={enginesRef}>
        {[
          [-0.22, 0.1],
          [0.22, 0.1],
          [-0.22, -0.1],
          [0.22, -0.1],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0.82]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.07, 0.45, 16]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.88} />
          </mesh>
        ))}
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.11, 0.55]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 2. STAR WARS MILLENNIUM FALCON STYLE: CENTURION FALCON (Đĩa Elip, Móng Kẹp, Buồng Lái Lệch Tâm)
// =========================================================================
export const CenturionFalconShip: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const radarRef = useRef<THREE.Group>(null);
  const engineGlowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (radarRef.current) radarRef.current.rotation.y += delta * 1.2;
    if (engineGlowRef.current) {
      const p = 0.85 + Math.sin(clock.getElapsedTime() * 12) * 0.15;
      engineGlowRef.current.scale.set(1, p, 1);
    }
  });

  return (
    <group scale={[1.1, 1.1, 1.1]}>
      {/* 1. Main Corellian Saucer Hull Disk (Thân đĩa elip đa tầng) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1.2, 0.22, 1.2]}>
        <cylinderGeometry args={[0.75, 0.82, 0.6, 32]} />
        <meshPhysicalMaterial color="#cbd5e1" roughness={0.35} metalness={0.75} />
      </mesh>

      {/* Armor Plating Top Ridge & Central Core */}
      <mesh position={[0, 0.09, 0]} scale={[1.1, 0.1, 1.1]}>
        <cylinderGeometry args={[0.45, 0.65, 0.4, 24]} />
        <meshPhysicalMaterial color="#94a3b8" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 2. Forward Freight-Loading Mandibles (Cặp móng kẹp khoang hàng phía trước) */}
      <group position={[0, 0, -0.75]}>
        {/* Left Mandible Prong */}
        <mesh position={[-0.32, 0, -0.32]}>
          <boxGeometry args={[0.26, 0.14, 0.72]} />
          <meshPhysicalMaterial color="#e2e8f0" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Right Mandible Prong */}
        <mesh position={[0.32, 0, -0.32]}>
          <boxGeometry args={[0.26, 0.14, 0.72]} />
          <meshPhysicalMaterial color="#e2e8f0" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Center Freight Gap Sensor Bay */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.36, 0.11, 0.28]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
      </group>

      {/* 3. Offset Cockpit & Access Corridor Tube on Starboard (Phải) */}
      <group position={[0.78, 0.02, -0.35]}>
        {/* Curved Access Corridor Tube */}
        <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.38, 16]} />
          <meshPhysicalMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Conical Cockpit Nose with Greenhouse Faceted Glass */}
        <mesh position={[0.08, 0, -0.22]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.095, 0.38, 16]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.85}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>
        {/* Cockpit Base Cylinder */}
        <mesh position={[0.08, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.22, 16]} />
          <meshPhysicalMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Giant Rotating Communications Parabolic Radar Dish */}
      <group position={[-0.32, 0.15, -0.15]} ref={radarRef}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.03, 0.05, 24]} />
          <meshPhysicalMaterial color="#f8fafc" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.16, 0.03]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 5. Transverse Curved Sublight Hyperdrive Engine Array (Đuôi sáng Cyan rực rỡ) */}
      <group position={[0, 0, 0.68]}>
        {/* Engine Housing Grille */}
        <mesh scale={[1.2, 0.12, 0.18]}>
          <cylinderGeometry args={[0.74, 0.74, 0.6, 24, 1, false, Math.PI * 0.15, Math.PI * 0.7]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        {/* Intense Cyan Hyperdrive Exhaust Glow */}
        <mesh position={[0, 0, 0.06]} scale={[1.18, 0.09, 0.12]} ref={engineGlowRef}>
          <cylinderGeometry args={[0.72, 0.72, 0.6, 24, 1, false, Math.PI * 0.18, Math.PI * 0.64]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.95} />
        </mesh>
      </group>

      {/* Exposed Mechanical Greebles & Maintenance Pits */}
      {[-0.38, 0.38].map((x, idx) => (
        <mesh key={idx} position={[x, 0.09, 0.28]}>
          <cylinderGeometry args={[0.11, 0.11, 0.06, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>
      ))}

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[-0.32, 0.1, 0.35]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 3. GUNDAM MOTHERSHIP STYLE: PEGASUS STAR-CARRIER (White Base, Sàn Catapult, Tháp Chỉ Huy, V-Fin)
// =========================================================================
export const PegasusMothership: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const bridgeGlowRef = useRef<THREE.Mesh>(null);
  const thrustersRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (bridgeGlowRef.current) {
      const p = 0.8 + Math.sin(clock.getElapsedTime() * 4) * 0.2;
      bridgeGlowRef.current.scale.set(1, p, 1);
    }
    if (thrustersRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 14) * 0.12;
      thrustersRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 18) * 0.2);
    }
  });

  return (
    <group scale={[0.9, 0.9, 0.9]}>
      {/* 1. Central Core Superstructure (Khối thân trung tâm) */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.55, 0.35, 1.55]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.65} />
      </mesh>

      {/* 2. Elevated Bridge Command Tower (Đài chỉ huy nhô cao trên đỉnh) */}
      <group position={[0, 0.42, 0.25]}>
        {/* Tower Neck */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.22, 0.28, 0.32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Command Bridge Crown */}
        <mesh position={[0, 0.18, -0.05]}>
          <boxGeometry args={[0.36, 0.12, 0.36]} />
          <meshPhysicalMaterial color="#2563eb" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Panoramic Bridge Viewport Windows (Cửa kính quan sát xanh ngọc) */}
        <mesh position={[0, 0.18, -0.24]} ref={bridgeGlowRef}>
          <boxGeometry args={[0.28, 0.055, 0.03]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        {/* Iconic Gundam Yellow V-Fin Antenna */}
        <group position={[0, 0.26, -0.16]}>
          <mesh rotation={[0, 0, 0.55]} position={[-0.12, 0.08, 0]}>
            <boxGeometry args={[0.02, 0.22, 0.015]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh rotation={[0, 0, -0.55]} position={[0.12, 0.08, 0]}>
            <boxGeometry args={[0.02, 0.22, 0.015]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.02]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>

      {/* 3. Outstretched Catapult Launch Decks (2 Sàn phóng tàu con hai bên hông) */}
      {/* Left Catapult Deck */}
      <group position={[-0.58, -0.02, -0.22]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.22, 1.1]} />
          <meshPhysicalMaterial color="#2563eb" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Catapult Launch Runway Strip */}
        <mesh position={[0, 0.115, 0]}>
          <boxGeometry args={[0.16, 0.01, 0.98]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.122, -0.45]}>
          <boxGeometry args={[0.14, 0.01, 0.04]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      </group>

      {/* Right Catapult Deck */}
      <group position={[0.58, -0.02, -0.22]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.22, 1.1]} />
          <meshPhysicalMaterial color="#2563eb" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.115, 0]}>
          <boxGeometry args={[0.16, 0.01, 0.98]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.122, -0.45]}>
          <boxGeometry args={[0.14, 0.01, 0.04]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      </group>

      {/* 4. Massive Rear Engine Pods (2 Khối động cơ phản lực khổng lồ phía sau) */}
      {[-0.48, 0.48].map((x, idx) => (
        <group key={idx} position={[x, 0.05, 0.72]}>
          <mesh>
            <boxGeometry args={[0.38, 0.38, 0.75]} />
            <meshPhysicalMaterial color="#dc2626" roughness={0.25} metalness={0.75} />
          </mesh>
          {/* Engine Exhaust Nozzles */}
          <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.15, 0.16, 20]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Exhaust Plasma Flames */}
      <group ref={thrustersRef}>
        {[-0.48, 0.48].map((x, idx) => (
          <mesh key={idx} position={[x, 0.05, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.14, 0.55, 20]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
          </mesh>
        ))}
      </group>

      {/* Vietnam Flag Decal */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.28, -0.45]} scale={[0.22, 0.15, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 4. NASA SPACE SHUTTLE ORBITER (Con Thoi Không Gian: Bụng Gạch Đen, Cánh Delta, 3 Động Cơ RS-25)
// =========================================================================
export const NASASpaceShuttle: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const ssmeEnginesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ssmeEnginesRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 18) * 0.12;
      ssmeEnginesRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 24) * 0.2);
    }
  });

  return (
    <group scale={[1.05, 1.05, 1.05]}>
      {/* 1. Main White Orbiter Fuselage (Thân trên trắng sứ) */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 1.45, 24]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.2} metalness={0.65} clearcoat={0.7} />
      </mesh>

      {/* 2. Black Thermal Protection Tile Underbelly (Bụng dưới gạch đen chống nhiệt) */}
      <mesh position={[0, -0.06, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.185, 0.245, 1.35, 24, 1, false, Math.PI * 0.5, Math.PI]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* 3. Black Carbon-Carbon Reinforced Nose Cap & Cockpit */}
      <mesh position={[0, 0.02, -0.78]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.35, 24]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Flight Deck Cockpit Windows */}
      <mesh position={[0, 0.14, -0.58]} rotation={[0.42, 0, 0]}>
        <boxGeometry args={[0.22, 0.065, 0.14]} />
        <meshPhysicalMaterial
          color="#0284c7"
          emissive="#0369a1"
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* 4. Swept Double-Delta Wings with Black Leading Edges */}
      <group position={[0, -0.03, 0.18]}>
        {/* Left Wing */}
        <mesh position={[-0.58, 0, 0]} rotation={[0, -0.22, 0]}>
          <boxGeometry args={[0.78, 0.028, 0.72]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.6} />
        </mesh>
        <mesh position={[-0.62, -0.015, 0]} rotation={[0, -0.22, 0]}>
          <boxGeometry args={[0.78, 0.01, 0.72]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* Right Wing */}
        <mesh position={[0.58, 0, 0]} rotation={[0, 0.22, 0]}>
          <boxGeometry args={[0.78, 0.028, 0.72]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.6} />
        </mesh>
        <mesh position={[0.62, -0.015, 0]} rotation={[0, 0.22, 0]}>
          <boxGeometry args={[0.78, 0.01, 0.72]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* 5. Prominent Vertical Stabilizer (Vây đuôi đứng khổng lồ) */}
      <mesh position={[0, 0.35, 0.45]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.028, 0.52, 0.45]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.6} />
      </mesh>

      {/* 6. Orbital Maneuvering System (OMS) Pods on Left & Right of Tail */}
      {[-0.16, 0.16].map((x, idx) => (
        <mesh key={idx} position={[x, 0.14, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.07, 0.32, 16, 16]} />
          <meshPhysicalMaterial color="#e2e8f0" metalness={0.7} />
        </mesh>
      ))}

      {/* 7. Triangle Cluster of 3 RS-25 SSME Rocket Engines (Cụm 3 động cơ tên lửa chính) */}
      <group position={[0, 0.04, 0.72]}>
        {[
          [0, 0.12],
          [-0.09, -0.04],
          [0.09, -0.04],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.085, 0.15, 20]} />
            <meshStandardMaterial color="#475569" metalness={0.95} />
          </mesh>
        ))}

        <group ref={ssmeEnginesRef}>
          {[
            [0, 0.12],
            [-0.09, -0.04],
            [0.09, -0.04],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.22]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.06, 0.42, 16]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Vietnam Flag Decal */}
      {hasVnFlag && <VietnamFlagDecal position={[0.48, 0.02, 0.24]} scale={[0.16, 0.11, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 5. NASA SATURN V APOLLO MOON ROCKET (Tên Lửa Mặt Trăng: 3 Tầng, Động Cơ F-1, Tháp Escape Tower)
// =========================================================================
export const NASASaturnVRocket: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const f1EnginesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (f1EnginesRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.14;
      f1EnginesRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.22);
    }
  });

  return (
    <group scale={[0.85, 0.85, 0.85]}>
      {/* 1. Stage 1 (S-IC) Heavy Booster with Black & White Roll Pattern */}
      <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.95, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.7} />
      </mesh>
      {/* Stage 1 Iconic Roll Pattern Black Blocks */}
      <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.222, 0.222, 0.45, 32, 1, false, 0, Math.PI * 0.5]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.222, 0.222, 0.45, 32, 1, false, Math.PI, Math.PI * 0.5]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* 4 Large Base Aerodynamic Fins */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
        <group key={idx} rotation={[0, 0, angle]} position={[0, 0, 0.92]}>
          <mesh position={[0.3, 0, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.28]} />
            <meshPhysicalMaterial color="#ffffff" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* 2. Stage 2 (S-II) & Interstage Ring */}
      <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.65, 32]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* 3. Stage 3 (S-IVB) & Spacecraft Lunar Adapter (SLA) Cone */}
      <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.48, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* 4. Apollo Service Module (SM) & High-Gain Antenna Dish */}
      <mesh position={[0, 0, -0.88]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.32, 32]} />
        <meshPhysicalMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* 5. Apollo Command Module (CM) Capsule Cone (Khoang lái phi hành gia) */}
      <mesh position={[0, 0, -1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.24, 32]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* 6. Launch Escape System (LES) Tower & Jettison Rocket (Tháp cứu hộ khẩn cấp) */}
      <group position={[0, 0, -1.22]}>
        {/* Lattice Truss Tower */}
        <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.055, 0.38, 8]} />
          <meshStandardMaterial color="#cbd5e1" wireframe />
        </mesh>
        {/* Solid Rocket Motor & Nose Cone */}
        <mesh position={[0, 0, -0.48]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.032, 0.22, 16]} />
          <meshPhysicalMaterial color="#dc2626" roughness={0.3} />
        </mesh>
      </group>

      {/* 7. Cluster of 5 Giant Rocketdyne F-1 Rocket Engines (5 Động cơ F-1 uy lực) */}
      <group position={[0, 0, 1.05]}>
        {[
          [0, 0],
          [-0.11, -0.11],
          [0.11, -0.11],
          [-0.11, 0.11],
          [0.11, 0.11],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.095, 0.22, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.95} />
          </mesh>
        ))}

        {/* Roaring F-1 Kerosene Combustion Fire */}
        <group ref={f1EnginesRef}>
          {[
            [0, 0],
            [-0.11, -0.11],
            [0.11, -0.11],
            [-0.11, 0.11],
            [0.11, 0.11],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.08, 0.65, 20]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.23, 0.25]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};

// =========================================================================
// MASTER ICONIC HARD-SURFACE SHIP RENDERER
// =========================================================================
export const AerodynamicShipRenderer: React.FC<ShipMeshProps> = ({
  shipId,
  hasVnFlag = true,
  showStreamlines = true,
  scale = 1.0,
}) => {
  const renderShipModel = () => {
    switch (shipId) {
      case 'falcon_apex':
        return <CenturionFalconShip hasVnFlag={hasVnFlag} />;
      case 'solar_phoenix':
        return <PegasusMothership hasVnFlag={hasVnFlag} />;
      case 'starlight_runner':
        return <NASASpaceShuttle hasVnFlag={hasVnFlag} />;
      case 'astral_shuttle':
        return <NASASaturnVRocket hasVnFlag={hasVnFlag} />;
      case 'explorer_v1':
      default:
        return <NovaXWingShip hasVnFlag={hasVnFlag} />;
    }
  };

  return (
    <group scale={[scale, scale, scale]}>
      {renderShipModel()}
      {showStreamlines && <WindStreamlines length={5.2} radius={1.4} count={42} speed={6.5} />}
    </group>
  );
};
