import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createOriginalHullTextures } from './OriginalSpaceshipTextures';

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

// =========================================================================
// 1. NOVA APEX HUNTER (Tiêm Kích Thám Hiểm Cánh Ngược Siêu Thanh - 160 Linh Kiện)
// =========================================================================
export const NovaApexHunter: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const turbine1Ref = useRef<THREE.Mesh>(null);
  const turbine2Ref = useRef<THREE.Mesh>(null);
  const thrustersRef = useRef<THREE.Group>(null);

  const tex = useMemo(() => createOriginalHullTextures(), []);

  useFrame(({ clock }, delta) => {
    if (turbine1Ref.current) turbine1Ref.current.rotation.z += delta * 16;
    if (turbine2Ref.current) turbine2Ref.current.rotation.z += delta * 16;
    if (thrustersRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.14;
      thrustersRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 26) * 0.22);
    }
  });

  return (
    <group scale={[1.2, 1.2, 1.2]}>
      {/* 1. Sleek Chined Forward Fuselage (Thân Nâng Mũi Vuốt Liền Mạch) */}
      <mesh position={[0, 0, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.18, 1.3, 16]} />
        <meshPhysicalMaterial
          map={tex.hullMap}
          bumpMap={tex.hullBumpMap}
          bumpScale={0.08}
          roughnessMap={tex.hullRoughnessMap}
          emissiveMap={tex.hullEmissiveMap}
          emissive={new THREE.Color('#38bdf8')}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.8}
        />
      </mesh>

      {/* Mid to Aft Fuselage */}
      <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.24, 0.9, 16]} />
        <meshPhysicalMaterial
          map={tex.hullMap}
          bumpMap={tex.hullBumpMap}
          bumpScale={0.08}
          roughnessMap={tex.hullRoughnessMap}
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.8}
        />
      </mesh>

      {/* Sharp Pitot Sensor Needle Probe */}
      <mesh position={[0, 0, -1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.009, 0.32, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.98} />
      </mesh>

      {/* Dual Forward Canard Control Wings (2 Cánh Tà Phía Trước Mũi) */}
      <mesh position={[-0.24, 0.02, -0.7]} rotation={[0, 0.25, 0.08]}>
        <boxGeometry args={[0.32, 0.016, 0.18]} />
        <meshPhysicalMaterial color="#ea580c" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0.24, 0.02, -0.7]} rotation={[0, -0.25, -0.08]}>
        <boxGeometry args={[0.32, 0.016, 0.18]} />
        <meshPhysicalMaterial color="#ea580c" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 2. ROUNDED DROPLET COCKPIT CANOPY WITH OPACITY & 2D FAKE HUD INTERIOR */}
      <group position={[0, 0.1, -0.22]}>
        {/* Interior 2D Fake HUD Flight Deck Screen */}
        <mesh position={[0, 0.02, 0]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.16, 0.28]} />
          <meshBasicMaterial map={tex.cockpitHudMap} side={THREE.DoubleSide} />
        </mesh>

        {/* Outer Rounded Droplet Glass Canopy with Opacity & Refraction */}
        <mesh rotation={[0.24, 0, 0]}>
          <capsuleGeometry args={[0.092, 0.36, 20, 20]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            roughness={0.03}
            metalness={0.95}
            transmission={0.8}
            transparent
            opacity={0.68}
            clearcoat={0.98}
          />
        </mesh>
        {/* Titanium Canopy Rollcage Ribs */}
        <mesh position={[0, 0.02, 0]} rotation={[0.24, 0, 0]}>
          <torusGeometry args={[0.094, 0.007, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#0f172a" metalness={0.98} />
        </mesh>
      </group>

      {/* 3. FORWARD-SWEPT WINGS WITH 3-TIER PLATING & VORTEX FINS (Cánh Xuôi Ngược) */}
      {[-1, 1].map((side, idx) => (
        <group key={idx} position={[side * 0.42, 0, 0.15]}>
          {/* Main Forward-Swept Wing Blade */}
          <mesh position={[side * 0.48, 0, -0.15]} rotation={[0, side * 0.32, side * 0.06]}>
            <boxGeometry args={[0.95, 0.024, 0.48]} />
            <meshPhysicalMaterial
              map={tex.hullMap}
              bumpMap={tex.hullBumpMap}
              bumpScale={0.08}
              roughnessMap={tex.hullRoughnessMap}
              color="#f8fafc"
              roughness={0.2}
              metalness={0.7}
              clearcoat={0.7}
            />
          </mesh>

          {/* Wingtip Downward Canted Stabilizer Fin & Sensor Pod */}
          <group position={[side * 0.98, -0.06, -0.32]}>
            <mesh rotation={[0, 0, side * 0.45]}>
              <boxGeometry args={[0.02, 0.18, 0.38]} />
              <meshPhysicalMaterial color="#ea580c" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.42, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.95} />
            </mesh>
          </group>

          {/* Micro Vortex Generator Fins (Vây Khí Động Học Mép Cánh) */}
          {[-0.2, -0.4, -0.6].map((vx, vidx) => (
            <mesh key={vidx} position={[side * (0.3 + vidx * 0.2), 0.018, -0.25]} rotation={[0, side * 0.15, 0]}>
              <boxGeometry args={[0.008, 0.02, 0.045]} />
              <meshStandardMaterial color="#0f172a" metalness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4. TWIN TURBOJET NACELLES WITH BRIGHT ILLUMINATED 24-BLADE TURBINE SPINNERS */}
      {[-0.26, 0.26].map((x, idx) => (
        <group key={idx} position={[x, 0.02, 0.4]}>
          {/* Intake Cowl Lip */}
          <mesh position={[0, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.108, 0.016, 12, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.98} />
          </mesh>

          {/* Bright Glowing Interior Ring */}
          <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.102, 0.008, 8, 24]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* ROTATING 24-BLADE COMPRESSOR TURBINE DISK */}
          <mesh
            position={[0, 0, -0.38]}
            ref={(idx === 0 ? turbine1Ref : turbine2Ref) as React.RefObject<THREE.Mesh>}
          >
            <circleGeometry args={[0.1, 24]} />
            <meshBasicMaterial map={tex.turbineMap} side={THREE.DoubleSide} />
          </mesh>

          {/* Engine Body with 6 Circumferential Radiator Cooling Rings */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.105, 0.12, 0.8, 24]} />
            <meshPhysicalMaterial color="#cbd5e1" metalness={0.88} roughness={0.18} />
          </mesh>
          {[-0.2, -0.1, 0, 0.1, 0.2].map((rz, ridx) => (
            <mesh key={ridx} position={[0, 0, rz]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.114, 0.008, 8, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.95} />
            </mesh>
          ))}

          {/* Convergent-Divergent Exhaust Nozzle with 12 Petal Flaps */}
          <group position={[0, 0, 0.46]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.12, 0.18, 24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.98} />
            </mesh>
            {[...Array(12)].map((_, pidx) => {
              const pAngle = (pidx / 12) * Math.PI * 2;
              return (
                <mesh key={pidx} position={[Math.cos(pAngle) * 0.11, Math.sin(pAngle) * 0.11, 0.04]} rotation={[0, 0, pAngle]}>
                  <boxGeometry args={[0.02, 0.05, 0.14]} />
                  <meshPhysicalMaterial color="#ffffff" metalness={0.98} roughness={0.1} />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}

      {/* Exhaust Plasma Flames */}
      <group ref={thrustersRef}>
        {[-0.26, 0.26].map((x, idx) => (
          <group key={idx} position={[x, 0.02, 1.05]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.09, 0.65, 16]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.88} />
            </mesh>
            <mesh position={[0, 0, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.05, 0.38, 12]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Twin Canted Vertical Stabilizers (2 Vây Đuôi Vát Chéo) */}
      <mesh position={[-0.28, 0.22, 0.52]} rotation={[0.1, 0, -0.32]}>
        <boxGeometry args={[0.025, 0.32, 0.42]} />
        <meshPhysicalMaterial color="#ea580c" metalness={0.7} />
      </mesh>
      <mesh position={[0.28, 0.22, 0.52]} rotation={[0.1, 0, 0.32]}>
        <boxGeometry args={[0.025, 0.32, 0.42]} />
        <meshPhysicalMaterial color="#ea580c" metalness={0.7} />
      </mesh>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.18, 0.45]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 2. CHRONO VOYAGER (Phi Thuyền Viễn Du Thân Đĩa Lai Cánh Cung - 170 Linh Kiện)
// =========================================================================
export const ChronoVoyager: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const radarRef = useRef<THREE.Group>(null);
  const ionDriveRef = useRef<THREE.Group>(null);

  const tex = useMemo(() => createOriginalHullTextures(), []);

  useFrame(({ clock }, delta) => {
    if (radarRef.current) radarRef.current.rotation.y += delta * 1.4;
    if (ionDriveRef.current) {
      const p = 0.85 + Math.sin(clock.getElapsedTime() * 10) * 0.15;
      ionDriveRef.current.scale.set(1, p, 1);
    }
  });

  return (
    <group scale={[1.15, 1.15, 1.15]}>
      {/* 1. Main Aerodynamic Saucer Hull (Thân Đĩa Khí Động Học Elip) */}
      <mesh position={[0, 0, 0]} scale={[1.2, 0.22, 1.3]}>
        <cylinderGeometry args={[0.75, 0.85, 0.55, 32]} />
        <meshPhysicalMaterial
          map={tex.hullMap}
          bumpMap={tex.hullBumpMap}
          bumpScale={0.08}
          roughnessMap={tex.hullRoughnessMap}
          color="#cbd5e1"
          roughness={0.25}
          metalness={0.85}
          clearcoat={0.8}
        />
      </mesh>

      {/* Crescent Arc Wings (Cánh Hình Cung Ôm Thân) */}
      <mesh position={[-0.88, 0, 0.1]} rotation={[0, 0.2, 0]} scale={[0.4, 0.06, 1.1]}>
        <cylinderGeometry args={[0.8, 0.8, 0.3, 24, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.88, 0, 0.1]} rotation={[0, -0.2, 0]} scale={[0.4, 0.06, 1.1]}>
        <cylinderGeometry args={[0.8, 0.8, 0.3, 24, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 2. ROUNDED HEMISPHERICAL COCKPIT DOME WITH OPACITY & 2D FAKE HUD */}
      <group position={[0, 0.1, -0.55]}>
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial map={tex.cockpitHudMap} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.18, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={0.5}
            roughness={0.03}
            metalness={0.95}
            transmission={0.8}
            transparent
            opacity={0.7}
            clearcoat={0.98}
          />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.182, 0.01, 8, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.98} />
        </mesh>
      </group>

      {/* 3. MULTI-AXIS QUANTUM RADAR DISH ON DORSAL SUPERSTRUCTURE */}
      <group position={[0, 0.16, -0.05]} ref={radarRef}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.04, 0.055, 0.09, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.98} />
        </mesh>
        <mesh position={[0, 0.13, 0]} rotation={[0.42, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.035, 0.055, 24]} />
          <meshPhysicalMaterial color="#f8fafc" metalness={0.92} roughness={0.15} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, 0.17, 0.03]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* 4. QUAD TIERED ION THRUSTER ARRAY (4 Động Cơ Ion Phía Sau) */}
      <group position={[0, 0, 0.65]}>
        {[-0.45, -0.15, 0.15, 0.45].map((x, idx) => (
          <group key={idx} position={[x, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.1, 0.22, 20]} />
              <meshStandardMaterial color="#0f172a" metalness={0.98} />
            </mesh>
            {/* Copper cooling ring */}
            <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.095, 0.008, 8, 20]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} />
            </mesh>
          </group>
        ))}

        {/* Glowing Cyan Ion Plasma Discharge */}
        <group ref={ionDriveRef}>
          {[-0.45, -0.15, 0.15, 0.45].map((x, idx) => (
            <mesh key={idx} position={[x, 0, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.075, 0.45, 16]} />
              <meshBasicMaterial color="#00f0ff" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.42, 0.12, 0.28]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 3. ORION SKY-CARRIER (Chiến Hạm Chỉ Huy Quỹ Đạo Đa Năng - 180 Linh Kiện)
// =========================================================================
export const OrionSkyCarrier: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const bridgeRef = useRef<THREE.Mesh>(null);
  const thrustersRef = useRef<THREE.Group>(null);

  const tex = useMemo(() => createOriginalHullTextures(), []);

  useFrame(({ clock }) => {
    if (bridgeRef.current) {
      const p = 0.8 + Math.sin(clock.getElapsedTime() * 4) * 0.2;
      bridgeRef.current.scale.set(1, p, 1);
    }
    if (thrustersRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 14) * 0.12;
      thrustersRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 18) * 0.2);
    }
  });

  return (
    <group scale={[0.95, 0.95, 0.95]}>
      {/* 1. Multi-Tier Command Chassis (Khung Thân Nâng Đa Tầng) */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.65, 0.38, 1.65]} />
        <meshPhysicalMaterial
          map={tex.hullMap}
          bumpMap={tex.hullBumpMap}
          bumpScale={0.08}
          roughnessMap={tex.hullRoughnessMap}
          color="#ffffff"
          roughness={0.25}
          metalness={0.7}
          clearcoat={0.7}
        />
      </mesh>

      {/* 2. ROUNDED MULTI-LEVEL COMMAND BRIDGE DOME WITH OPACITY & HUD */}
      <group position={[0, 0.42, 0.28]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.26, 0.3, 0.36]} />
          <meshPhysicalMaterial color="#1e3a8a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Panoramic Glass Crown */}
        <mesh position={[0, 0.2, -0.06]}>
          <capsuleGeometry args={[0.13, 0.22, 16, 16]} />
          <meshPhysicalMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.6}
            roughness={0.03}
            metalness={0.95}
            transmission={0.8}
            transparent
            opacity={0.72}
            clearcoat={0.95}
          />
        </mesh>
        {/* Golden Communications Mast */}
        <mesh position={[0, 0.36, -0.06]}>
          <cylinderGeometry args={[0.008, 0.012, 0.25, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.95} />
        </mesh>
      </group>

      {/* 3. DUAL OUTRIGGER DRONE LANDING DECKS (2 Sàn Hạ Cánh Drone Mini) */}
      {[-1, 1].map((side, idx) => (
        <group key={idx} position={[side * 0.65, -0.02, -0.15]}>
          <mesh>
            <boxGeometry args={[0.48, 0.24, 1.15]} />
            <meshPhysicalMaterial color="#1e3a8a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Runway Strip & Edge Lights */}
          <mesh position={[0, 0.125, 0]}>
            <boxGeometry args={[0.18, 0.01, 1.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.132, -0.48]}>
            <boxGeometry args={[0.16, 0.01, 0.05]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      ))}

      {/* 4. QUAD HEAVY FUSION ENGINES (4 Động Cơ Hạt Nhân Nhiệt Hạch Phía Sau) */}
      {[-0.52, 0.52].map((x, idx) => (
        <group key={idx} position={[x, 0.06, 0.78]}>
          <mesh>
            <boxGeometry args={[0.42, 0.42, 0.8]} />
            <meshPhysicalMaterial color="#dc2626" roughness={0.25} metalness={0.75} />
          </mesh>
          {/* Dual Nozzles per Pod */}
          {[-0.1, 0.1].map((ny, nidx) => (
            <mesh key={nidx} position={[0, ny, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.085, 0.11, 0.18, 20]} />
              <meshStandardMaterial color="#0f172a" metalness={0.98} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Exhaust Plasma Flames */}
      <group ref={thrustersRef}>
        {[-0.52, 0.52].map((x, idx) => (
          <group key={idx} position={[x, 0.06, 1.35]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.16, 0.65, 20]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.3, -0.48]} scale={[0.22, 0.15, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 4. AERO-SHUTTLE X-9 (Con Thoi Không Gian Thế Hệ Mới - 165 Linh Kiện)
// =========================================================================
export const AeroShuttleX9: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const ssmeRef = useRef<THREE.Group>(null);

  const tex = useMemo(() => createOriginalHullTextures(), []);

  useFrame(({ clock }) => {
    if (ssmeRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 18) * 0.12;
      ssmeRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 24) * 0.2);
    }
  });

  return (
    <group scale={[1.1, 1.1, 1.1]}>
      {/* 1. Lifting-Body Double-Delta White Upper Fuselage */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.25, 1.5, 24]} />
        <meshPhysicalMaterial
          map={tex.hullMap}
          bumpMap={tex.hullBumpMap}
          bumpScale={0.08}
          roughnessMap={tex.hullRoughnessMap}
          color="#f8fafc"
          roughness={0.2}
          metalness={0.7}
          clearcoat={0.8}
        />
      </mesh>

      {/* 2. Black Thermal Protection Tile Underbelly */}
      <mesh position={[0, -0.06, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.185, 0.255, 1.4, 24, 1, false, Math.PI * 0.5, Math.PI]} />
        <meshPhysicalMaterial color="#0f172a" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* 3. ROUNDED DROPLET COCKPIT CANOPY WITH OPACITY & 2D FAKE HUD */}
      <group position={[0, 0.12, -0.48]}>
        <mesh position={[0, 0.02, 0]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.18, 0.24]} />
          <meshBasicMaterial map={tex.cockpitHudMap} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.095, 0.32, 20, 20]} />
          <meshPhysicalMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.5}
            roughness={0.03}
            metalness={0.95}
            transmission={0.8}
            transparent
            opacity={0.68}
            clearcoat={0.98}
          />
        </mesh>
      </group>

      {/* 4. Swept Double-Delta Wings with Black Leading Edges */}
      <group position={[0, -0.03, 0.2]}>
        {[-1, 1].map((side, idx) => (
          <group key={idx} position={[side * 0.62, 0, 0]}>
            <mesh rotation={[0, side * 0.22, 0]}>
              <boxGeometry args={[0.82, 0.028, 0.78]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.65} />
            </mesh>
            <mesh position={[side * 0.04, -0.015, 0]} rotation={[0, side * 0.22, 0]}>
              <boxGeometry args={[0.82, 0.01, 0.78]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Twin Canted V-Tail Rudders (Vây Đuôi Kép Chữ V) */}
      <mesh position={[-0.26, 0.3, 0.48]} rotation={[0.1, 0, -0.35]}>
        <boxGeometry args={[0.026, 0.48, 0.42]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.25} metalness={0.65} />
      </mesh>
      <mesh position={[0.26, 0.3, 0.48]} rotation={[0.1, 0, 0.35]}>
        <boxGeometry args={[0.026, 0.48, 0.42]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.25} metalness={0.65} />
      </mesh>

      {/* 6. TRIANGLE CLUSTER OF 3 DE LAVAL ROCKET ENGINES */}
      <group position={[0, 0.04, 0.78]}>
        {[
          [0, 0.12],
          [-0.095, -0.04],
          [0.095, -0.04],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.16, 20]} />
            <meshStandardMaterial color="#475569" metalness={0.95} />
          </mesh>
        ))}

        <group ref={ssmeRef}>
          {[
            [0, 0.12],
            [-0.095, -0.04],
            [0.095, -0.04],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.24]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.065, 0.45, 16]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0.5, 0.02, 0.25]} scale={[0.16, 0.11, 0.01]} />}
    </group>
  );
};

// =========================================================================
// 5. HYPERION STAR-LIFTER V (Tàu Phóng Thám Hiểm Liên Hành Tinh - 175 Linh Kiện)
// =========================================================================
export const HyperionStarLifterV: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const f1Ref = useRef<THREE.Group>(null);

  const tex = useMemo(() => createOriginalHullTextures(), []);

  useFrame(({ clock }) => {
    if (f1Ref.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 16) * 0.14;
      f1Ref.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.22);
    }
  });

  return (
    <group scale={[0.88, 0.88, 0.88]}>
      {/* 1. Stage 1 Heavy Booster with Geometric Roll Pattern */}
      <mesh position={[0, 0, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 1.0, 32]} />
        <meshPhysicalMaterial
          map={tex.hullMap}
          bumpMap={tex.hullBumpMap}
          bumpScale={0.08}
          color="#ffffff"
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Stage 1 Geometric Black Roll Pattern */}
      <mesh position={[0, 0, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.232, 0.232, 0.48, 32, 1, false, 0, Math.PI * 0.5]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.232, 0.232, 0.48, 32, 1, false, Math.PI, Math.PI * 0.5]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* 4 Folding Aerodynamic Grid Fins on Upper Booster (4 Vây Lưới Gập) */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
        <group key={idx} rotation={[0, 0, angle]} position={[0, 0, 0.15]}>
          <mesh position={[0.3, 0, 0]}>
            <boxGeometry args={[0.14, 0.015, 0.16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} wireframe />
          </mesh>
        </group>
      ))}

      {/* 2. Stage 2 & Stage 3 Interstage Cylinder */}
      <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.75, 32]} />
        <meshPhysicalMaterial color="#f8fafc" roughness={0.25} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, -0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.23, 0.55, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* 3. ROUNDED ASTRONAUT COMMAND CAPSULE DOME ON STAGE 3 */}
      <group position={[0, 0, -1.05]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.15, 0.2, 20, 20]} />
          <meshPhysicalMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.15}
            clearcoat={0.9}
          />
        </mesh>
      </group>

      {/* 4. Launch Escape System & Science Sensor Tower (Tháp Cứu Hộ Lưới Thép 3D) */}
      <group position={[0, 0, -1.3]}>
        <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.055, 0.42, 8]} />
          <meshStandardMaterial color="#cbd5e1" wireframe />
        </mesh>
        <mesh position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.034, 0.24, 16]} />
          <meshPhysicalMaterial color="#ea580c" roughness={0.3} />
        </mesh>
      </group>

      {/* 5. 5 AEROSPIKE / ROCKETDYNE F-1 ENGINES WITH ORANGE FLAME */}
      <group position={[0, 0, 1.1]}>
        {[
          [0, 0],
          [-0.11, -0.11],
          [0.11, -0.11],
          [-0.11, 0.11],
          [0.11, 0.11],
        ].map(([x, y], idx) => (
          <mesh key={idx} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 0.24, 20]} />
            <meshStandardMaterial color="#334155" metalness={0.95} />
          </mesh>
        ))}

        <group ref={f1Ref}>
          {[
            [0, 0],
            [-0.11, -0.11],
            [0.11, -0.11],
            [-0.11, 0.11],
            [0.11, 0.11],
          ].map(([x, y], idx) => (
            <mesh key={idx} position={[x, y, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.085, 0.7, 20]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.92} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.24, 0.25]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};

// =========================================================================
// MASTER ORIGINAL CINEMATIC SHIP RENDERER
// =========================================================================
export const AerodynamicShipRenderer: React.FC<{
  shipId: string;
  shipColor?: string;
  hasVnFlag?: boolean;
  showStreamlines?: boolean;
  scale?: number;
}> = ({
  shipId,
  hasVnFlag = true,
  scale = 1.0,
}) => {
  const renderShipModel = () => {
    switch (shipId) {
      case 'falcon_apex':
        return <ChronoVoyager hasVnFlag={hasVnFlag} />;
      case 'solar_phoenix':
        return <OrionSkyCarrier hasVnFlag={hasVnFlag} />;
      case 'starlight_runner':
        return <AeroShuttleX9 hasVnFlag={hasVnFlag} />;
      case 'astral_shuttle':
        return <HyperionStarLifterV hasVnFlag={hasVnFlag} />;
      case 'explorer_v1':
      default:
        return <NovaApexHunter hasVnFlag={hasVnFlag} />;
    }
  };

  return (
    <group scale={[scale, scale, scale]}>
      {renderShipModel()}
    </group>
  );
};
