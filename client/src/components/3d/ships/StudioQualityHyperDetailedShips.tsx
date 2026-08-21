import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

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
// HYPER-DETAILED INCOM T-65 X-WING STARFIGHTER (80+ Intricate Parts)
// =========================================================================
export const HyperDetailedXWing: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const droidRef = useRef<THREE.Group>(null);
  const turbineRef = useRef<THREE.Group>(null);
  const afterburnersRef = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    // Astromech Droid scanning rotation
    if (droidRef.current) {
      droidRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.8;
    }
    // Turbine compressor fan spin
    if (turbineRef.current) {
      turbineRef.current.rotation.z += delta * 12;
    }
    // Engine thrust pulse
    if (afterburnersRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 20) * 0.14;
      afterburnersRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 26) * 0.22);
    }
  });

  return (
    <group scale={[1.25, 1.25, 1.25]}>
      {/* ================================================================= */}
      {/* 1. NOSE CONE & FORWARD FUSELAGE (Mũi Tàu Đa Tầng & Rãnh Cảm Biến) */}
      {/* ================================================================= */}
      {/* Nose Tip Sensor Radome */}
      <mesh position={[0, 0, -1.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.045, 0.28, 16]} />
        <meshPhysicalMaterial color="#334155" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Nose Pitot Sensor Probe */}
      <mesh position={[0, 0, -1.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.22, 10]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
      </mesh>

      {/* Forward Chined Fuselage (Thân Vát Khí Động Học) */}
      <mesh position={[0, -0.01, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.13, 0.8, 8]} />
        <meshPhysicalMaterial color="#f1f5f9" roughness={0.25} metalness={0.7} clearcoat={0.6} />
      </mesh>

      {/* Recessed Forward Avionics Bay & Copper Heat Exchanger */}
      <mesh position={[0, -0.065, -0.55]}>
        <boxGeometry args={[0.08, 0.03, 0.22]} />
        <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Forward RCS Reaction Control Thruster Quads (4 Vòi Phun Đồng Mỗi Bên) */}
      {[-0.075, 0.075].map((x, idx) => (
        <group key={idx} position={[x, 0, -0.85]}>
          <mesh>
            <boxGeometry args={[0.02, 0.035, 0.05]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {[-0.012, 0.012].map((oz, jdx) => (
            <mesh key={jdx} position={[x > 0 ? 0.015 : -0.015, 0, oz]} rotation={[0, 0, x > 0 ? -Math.PI / 2 : Math.PI / 2]}>
              <cylinderGeometry args={[0.004, 0.007, 0.012, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ================================================================= */}
      {/* 2. MID FUSELAGE & DETAILED COCKPIT FLIGHT DECK (Buồng Lái Nhìn Thấu) */}
      {/* ================================================================= */}
      {/* Mid Fuselage Main Hull */}
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.22, 0.65, 8]} />
        <meshPhysicalMaterial color="#e2e8f0" roughness={0.28} metalness={0.65} clearcoat={0.6} />
      </mesh>

      {/* COCKPIT INTERIOR (Nội Thất Buồng Lái Nhìn Thấu) */}
      <group position={[0, 0.04, -0.22]}>
        {/* Pilot Seat Back & Headrest (Ghế Phi Công Thể Thao) */}
        <mesh position={[0, 0.04, 0.06]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.08, 0.14, 0.03]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.12, 0.08]}>
          <boxGeometry args={[0.055, 0.04, 0.03]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} />
        </mesh>
        {/* Pilot Seat Cushion */}
        <mesh position={[0, -0.02, 0.01]}>
          <boxGeometry args={[0.08, 0.03, 0.1]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Illuminated Flight Control Dashboard (Bảng Điều Khiển Phát Sáng) */}
        <mesh position={[0, 0.02, -0.12]} rotation={[0.45, 0, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.045, -0.1]}>
          <planeGeometry args={[0.07, 0.03]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* 3D Flight Control Stick (Cần Lái Joystick) */}
        <group position={[0, -0.01, -0.04]}>
          <mesh rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.004, 0.005, 0.06, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.03, 0.005]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Holographic HUD Targeting Reticle (Kính Ngắm HUD Trong Suốt) */}
        <mesh position={[0, 0.09, -0.1]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.045, 0.035]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Transparent Faceted Canopy Glass (Kính Vòm Đa Giác) */}
      <mesh position={[0, 0.09, -0.22]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.14, 0.11, 0.38]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.3}
          roughness={0.03}
          metalness={0.95}
          transmission={0.85}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Titanium Canopy Rollcage Struts (Khung Sườn Titan Cường Lực) */}
      <mesh position={[0, 0.12, -0.22]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.075, 0.007, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.12, -0.32]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.06, 0.006, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} />
      </mesh>

      {/* ================================================================= */}
      {/* 3. ASTROMECH DROID SOCKET (R2-D2 Droid Xoay Đầu) */}
      {/* ================================================================= */}
      <group position={[0, 0.12, 0.14]}>
        {/* Droid Socket Collar Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.065, 0.012, 10, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.95} />
        </mesh>
        {/* Rotating Droid Dome */}
        <group ref={droidRef}>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.058, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Blue Astromech Panel Stripes */}
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.055, 0.058, 0.015, 16, 1, true, 0, Math.PI * 1.2]} />
            <meshBasicMaterial color="#2563eb" side={THREE.DoubleSide} />
          </mesh>
          {/* Red Optical Eye Sensor */}
          <mesh position={[0.02, 0.038, -0.04]}>
            <sphereGeometry args={[0.014, 10, 10]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          {/* Green Data Holo Projector */}
          <mesh position={[-0.025, 0.032, -0.04]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.015, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* ================================================================= */}
      {/* 4. S-FOIL 4-WING SCISSOR MECHANISM WITH HYDRAULIC STRUTS & LASERS */}
      {/* ================================================================= */}
      {[
        { id: 'top-left', rotZ: 0.22, posX: -0.11, posY: 0.04, sfoilAngle: -0.12, redStripe: true },
        { id: 'top-right', rotZ: -0.22, posX: 0.11, posY: 0.04, sfoilAngle: 0.12, redStripe: true },
        { id: 'bottom-left', rotZ: -0.22, posX: -0.11, posY: -0.04, sfoilAngle: -0.12, redStripe: false },
        { id: 'bottom-right', rotZ: 0.22, posX: 0.11, posY: -0.04, sfoilAngle: 0.12, redStripe: false },
      ].map((w) => {
        const isLeft = w.posX < 0;
        return (
          <group key={w.id} position={[w.posX, w.posY, 0.38]} rotation={[0, 0, w.rotZ]}>
            {/* Wing Hinge Mechanical Gearbox with Chrome Hydraulic Piston */}
            <group position={[0, 0, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.26, 12]} />
                <meshStandardMaterial color="#0f172a" metalness={0.95} />
              </mesh>
              {/* Chrome Hydraulic Piston Shaft */}
              <mesh position={[isLeft ? -0.08 : 0.08, 0, 0]} rotation={[0, 0, isLeft ? 0.3 : -0.3]}>
                <cylinderGeometry args={[0.014, 0.014, 0.16, 12]} />
                <meshPhysicalMaterial color="#ffffff" metalness={0.98} roughness={0.05} />
              </mesh>
            </group>

            {/* Main Cambered Wing Blade (Bản Cánh Khí Động Học Chữ X) */}
            <mesh position={[isLeft ? -0.58 : 0.58, 0, -0.08]} rotation={[0, w.sfoilAngle, 0]}>
              <boxGeometry args={[0.92, 0.024, 0.44]} />
              <meshPhysicalMaterial color="#f8fafc" roughness={0.25} metalness={0.65} clearcoat={0.6} />
            </mesh>

            {/* Red Rebel Alliance Chevron Wing Ident Stripes */}
            {w.redStripe && (
              <group position={[isLeft ? -0.65 : 0.65, 0.014, -0.08]} rotation={[0, w.sfoilAngle, 0]}>
                <mesh position={[0, 0, -0.08]}>
                  <boxGeometry args={[0.22, 0.005, 0.1]} />
                  <meshBasicMaterial color="#dc2626" />
                </mesh>
                <mesh position={[0, 0, 0.08]}>
                  <boxGeometry args={[0.22, 0.005, 0.1]} />
                  <meshBasicMaterial color="#dc2626" />
                </mesh>
              </group>
            )}

            {/* WINGTIP LASER CANNON / SCIENTIFIC PROBE (Đại Bác Quang Học Đầu Cánh) */}
            <group position={[isLeft ? -1.06 : 1.06, 0, -0.32]}>
              {/* Rear Generator Module */}
              <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.028, 0.034, 0.32, 12]} />
                <meshStandardMaterial color="#1e293b" metalness={0.95} />
              </mesh>

              {/* Central Heat Radiator Coil Assembly (Vòng Xoắn Tản Nhiệt Bằng Đồng) */}
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.022, 0.022, 0.5, 12]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
              </mesh>
              {[-0.15, -0.05, 0.05, 0.15].map((cz, cidx) => (
                <mesh key={cidx} position={[0, 0, cz]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.026, 0.006, 8, 16]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.95} />
                </mesh>
              ))}

              {/* Forward Barrel & Flash Suppressor Muzzle (Nòng Súng Mũi Vuốt) */}
              <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.015, 0.65, 12]} />
                <meshStandardMaterial color="#475569" metalness={0.95} />
              </mesh>
              {/* Laser Emitter Tip */}
              <mesh position={[0, 0, -0.89]}>
                <sphereGeometry args={[0.022, 12, 12]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* ================================================================= */}
      {/* 5. QUAD INCOM 4L4 FUSIAL THRUST ENGINES WITH 12-BLADE TURBINE FANS */}
      {/* ================================================================= */}
      {[
        [-0.24, 0.11],
        [0.24, 0.11],
        [-0.24, -0.11],
        [0.24, -0.11],
      ].map(([x, y], idx) => (
        <group key={idx} position={[x, y, 0.42]}>
          {/* Intake Cowl Lip (Miệng Hút Gió Vát Tròn) */}
          <mesh position={[0, 0, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.092, 0.016, 12, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.98} />
          </mesh>

          {/* INTERNAL ROTATING COMPRESSOR TURBINE DISK (12 Lá Cánh Quạt Quay) */}
          <group position={[0, 0, -0.28]} ref={turbineRef}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} />
            </mesh>
            {[...Array(12)].map((_, bidx) => {
              const angle = (bidx / 12) * Math.PI * 2;
              return (
                <mesh key={bidx} rotation={[0, 0, angle]} position={[Math.cos(angle) * 0.055, Math.sin(angle) * 0.055, 0]}>
                  <boxGeometry args={[0.012, 0.055, 0.004]} />
                  <meshPhysicalMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
                </mesh>
              );
            })}
          </group>

          {/* Engine Body with 6 Circumferential Radiator Heat Rings (Gân Tản Nhiệt Đa Tầng) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.105, 0.65, 24]} />
            <meshPhysicalMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
          {[-0.16, -0.08, 0, 0.08, 0.16].map((rz, ridx) => (
            <mesh key={ridx} position={[0, 0, rz]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.098, 0.008, 8, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.95} />
            </mesh>
          ))}

          {/* Titanium Fuel Conduit Tube along Engine Top (Ống Dẫn Nhiên Liệu Lộ Thiên) */}
          <mesh position={[0, 0.105, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.58, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} />
          </mesh>

          {/* Convergent-Divergent Exhaust Nozzle with 8 Petal Flaps (Vòi Phun 8 Lá Xếp) */}
          <group position={[0, 0, 0.38]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.085, 0.105, 0.16, 20]} />
              <meshStandardMaterial color="#1e293b" metalness={0.95} />
            </mesh>
            {[...Array(8)].map((_, pidx) => {
              const pAngle = (pidx / 8) * Math.PI * 2;
              return (
                <mesh key={pidx} position={[Math.cos(pAngle) * 0.095, Math.sin(pAngle) * 0.095, 0.04]} rotation={[0, 0, pAngle]}>
                  <boxGeometry args={[0.02, 0.06, 0.12]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.98} />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}

      {/* Quad Ion Exhaust Plasma Shock Diamonds (Lửa Động Cơ Có Vòng Sóng Xung Kích) */}
      <group ref={afterburnersRef}>
        {[
          [-0.24, 0.11],
          [0.24, 0.11],
          [-0.24, -0.11],
          [0.24, -0.11],
        ].map(([x, y], idx) => (
          <group key={idx} position={[x, y, 0.88]}>
            {/* Outer Flame Cone */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.08, 0.55, 16]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.85} />
            </mesh>
            {/* Inner Core Plasma Shock Diamond */}
            <mesh position={[0, 0, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.045, 0.32, 12]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Dorsal Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.14, 0.45]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};
