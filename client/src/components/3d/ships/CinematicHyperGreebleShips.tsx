import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createHyperGreebleHullTextures } from './HyperGreebleShipTextures';

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
// CINEMATIC 250+ GREEBLE X-WING (Flawless Aerodynamics, 24-Blade Turbine, 250+ Parts)
// =========================================================================
export const Cinematic250GreebleXWing: React.FC<{ hasVnFlag?: boolean }> = ({ hasVnFlag = true }) => {
  const droidRef = useRef<THREE.Group>(null);
  const turbineIntake1Ref = useRef<THREE.Mesh>(null);
  const turbineIntake2Ref = useRef<THREE.Mesh>(null);
  const turbineIntake3Ref = useRef<THREE.Mesh>(null);
  const turbineIntake4Ref = useRef<THREE.Mesh>(null);
  const afterburnersRef = useRef<THREE.Group>(null);

  const textures = useMemo(() => createHyperGreebleHullTextures(), []);

  useFrame(({ clock }, delta) => {
    // Astromech Droid scanning rotation
    if (droidRef.current) {
      droidRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.8;
    }
    // High-Visibility 24-Blade Turbine Fans Spinning
    const spinSpeed = delta * 15;
    if (turbineIntake1Ref.current) turbineIntake1Ref.current.rotation.z += spinSpeed;
    if (turbineIntake2Ref.current) turbineIntake2Ref.current.rotation.z += spinSpeed;
    if (turbineIntake3Ref.current) turbineIntake3Ref.current.rotation.z += spinSpeed;
    if (turbineIntake4Ref.current) turbineIntake4Ref.current.rotation.z += spinSpeed;

    // Afterburner Plasma Pulse
    if (afterburnersRef.current) {
      const p = 1.0 + Math.sin(clock.getElapsedTime() * 22) * 0.14;
      afterburnersRef.current.scale.set(p, p, 1.0 + Math.sin(clock.getElapsedTime() * 28) * 0.22);
    }
  });

  return (
    <group scale={[1.3, 1.3, 1.3]}>
      {/* ================================================================= */}
      {/* 1. CONTINUOUS CHINED AERODYNAMIC FUSELAGE (Thân Nâng Khí Động Học Liền Mạch) */}
      {/* ================================================================= */}
      {/* Forward Chined Wedge Fuselage (Mũi Vuốt Thon Dài Liền Mạch, Không Khúc Gãy) */}
      <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.16, 1.3, 8]} />
        <meshPhysicalMaterial
          map={textures.hullMap}
          bumpMap={textures.hullBumpMap}
          bumpScale={0.08}
          roughnessMap={textures.hullRoughnessMap}
          emissiveMap={textures.hullEmissiveMap}
          emissive={new THREE.Color('#38bdf8')}
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.75}
          clearcoat={0.7}
        />
      </mesh>

      {/* Mid to Aft Fuselage Core */}
      <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.9, 8]} />
        <meshPhysicalMaterial
          map={textures.hullMap}
          bumpMap={textures.hullBumpMap}
          bumpScale={0.08}
          roughnessMap={textures.hullRoughnessMap}
          roughness={0.25}
          metalness={0.75}
          clearcoat={0.7}
        />
      </mesh>

      {/* Aerodynamic Leading-Edge Chined Strakes (Gờ Khí Động Học Dọc Mũi) */}
      <mesh position={[-0.09, -0.01, -0.6]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[0.03, 0.015, 0.9]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} />
      </mesh>
      <mesh position={[0.09, -0.01, -0.6]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[0.03, 0.015, 0.9]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} />
      </mesh>

      {/* Extreme Sharp Needle Pitot Sensor Probe at the Tip */}
      <mesh position={[0, 0, -1.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.008, 0.35, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.98} />
      </mesh>
      <mesh position={[0, 0, -1.63]}>
        <sphereGeometry args={[0.008, 10, 10]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Stepped Armor Plating Sheets on Forward Fuselage (4 Tấm Giáp Xếp Tầng) */}
      {[-0.2, 0, 0.2, 0.4].map((z, idx) => (
        <mesh key={idx} position={[0, 0.075 - idx * 0.01, z - 0.7]}>
          <boxGeometry args={[0.11 - idx * 0.015, 0.012, 0.16]} />
          <meshPhysicalMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Dual Forward RCS Thruster Quad-Blocks (8 Vòi Phun Đồng Vi Cơ Khí) */}
      {[-0.09, 0.09].map((x, idx) => (
        <group key={idx} position={[x, 0.01, -0.95]}>
          <mesh>
            <boxGeometry args={[0.02, 0.04, 0.06]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} />
          </mesh>
          {[-0.014, 0.014].map((oz, jdx) => (
            <mesh key={jdx} position={[x > 0 ? 0.015 : -0.015, 0, oz]} rotation={[0, 0, x > 0 ? -Math.PI / 2 : Math.PI / 2]}>
              <cylinderGeometry args={[0.004, 0.007, 0.014, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Recessed Forward Avionics Bay with Copper Cooling Grille */}
      <mesh position={[0, -0.065, -0.6]}>
        <boxGeometry args={[0.09, 0.028, 0.25]} />
        <meshStandardMaterial color="#b45309" metalness={0.92} roughness={0.3} />
      </mesh>

      {/* ================================================================= */}
      {/* 2. COCKPIT CANOPY WITH FACETED GLASS & TITANIUM ROLLCAGE STRUTS */}
      {/* ================================================================= */}
      <group position={[0, 0.11, -0.2]}>
        {/* Faceted Tinted Glass Visor (Kính Vòm Đa Giác) */}
        <mesh rotation={[0.26, 0, 0]}>
          <boxGeometry args={[0.15, 0.11, 0.42]} />
          <meshPhysicalMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.65}
            roughness={0.03}
            metalness={0.95}
            clearcoat={0.95}
          />
        </mesh>
        {/* Titanium Structural Rollcage Framing Struts */}
        <mesh position={[0, 0.025, 0]} rotation={[0.26, 0, 0]}>
          <torusGeometry args={[0.08, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0f172a" metalness={0.98} />
        </mesh>
        <mesh position={[0, 0.025, -0.12]} rotation={[0.26, 0, 0]}>
          <torusGeometry args={[0.068, 0.007, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0f172a" metalness={0.98} />
        </mesh>
        <mesh position={[0, 0.025, 0.12]} rotation={[0.26, 0, 0]}>
          <torusGeometry args={[0.088, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0f172a" metalness={0.98} />
        </mesh>
      </group>

      {/* ================================================================= */}
      {/* 3. ASTROMECH DROID BAY (R2-D2 Droid Xoay Đầu) */}
      {/* ================================================================= */}
      <group position={[0, 0.14, 0.16]}>
        {/* Socket Collar Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.068, 0.012, 10, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} />
        </mesh>
        {/* Rotating Droid Dome */}
        <group ref={droidRef}>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.06, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color="#f1f5f9" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Blue Panel Stripes */}
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.057, 0.06, 0.016, 16, 1, true, 0, Math.PI * 1.3]} />
            <meshBasicMaterial color="#2563eb" side={THREE.DoubleSide} />
          </mesh>
          {/* Red Optical Eye Sensor */}
          <mesh position={[0.022, 0.038, -0.042]}>
            <sphereGeometry args={[0.014, 10, 10]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          {/* Green Data Holo Projector */}
          <mesh position={[-0.026, 0.032, -0.042]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.015, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* Upper Generator Deck with Exposed Braided Conduits & Copper Coolant Tubes */}
      <group position={[0, 0.14, 0.45]}>
        <mesh>
          <boxGeometry args={[0.16, 0.05, 0.32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        {/* Braided Conduits (Ống Dẫn Nhiên Liệu Lộ Thiên) */}
        {[-0.05, 0, 0.05].map((cx, cidx) => (
          <mesh key={cidx} position={[cx, 0.032, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.3, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} />
          </mesh>
        ))}
      </group>

      {/* ================================================================= */}
      {/* 4. S-FOIL 4-WING SCISSOR WINGS WITH 3-TIER PLATING & VORTEX FINS */}
      {/* ================================================================= */}
      {[
        { id: 'top-left', rotZ: 0.22, posX: -0.11, posY: 0.04, sfoilAngle: -0.12, redStripe: true },
        { id: 'top-right', rotZ: -0.22, posX: 0.11, posY: 0.04, sfoilAngle: 0.12, redStripe: true },
        { id: 'bottom-left', rotZ: -0.22, posX: -0.11, posY: -0.04, sfoilAngle: -0.12, redStripe: false },
        { id: 'bottom-right', rotZ: 0.22, posX: 0.11, posY: -0.04, sfoilAngle: 0.12, redStripe: false },
      ].map((w) => {
        const isLeft = w.posX < 0;
        return (
          <group key={w.id} position={[w.posX, w.posY, 0.42]} rotation={[0, 0, w.rotZ]}>
            {/* Wing Hinge Mechanical Box with Chrome Double Hydraulic Pistons */}
            <group position={[0, 0, 0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.055, 0.055, 0.28, 12]} />
                <meshStandardMaterial color="#0f172a" metalness={0.98} />
              </mesh>
              {/* Dual Chrome Hydraulic Pistons */}
              {[-0.06, 0.06].map((pz, pidx) => (
                <mesh key={pidx} position={[isLeft ? -0.08 : 0.08, 0, pz]} rotation={[0, 0, isLeft ? 0.35 : -0.35]}>
                  <cylinderGeometry args={[0.012, 0.012, 0.16, 10]} />
                  <meshPhysicalMaterial color="#ffffff" metalness={0.98} roughness={0.05} />
                </mesh>
              ))}
            </group>

            {/* Main Cambered Airfoil Wing Blade */}
            <mesh position={[isLeft ? -0.62 : 0.62, 0, -0.08]} rotation={[0, w.sfoilAngle, 0]}>
              <boxGeometry args={[0.96, 0.024, 0.48]} />
              <meshPhysicalMaterial
                map={textures.hullMap}
                bumpMap={textures.hullBumpMap}
                bumpScale={0.08}
                roughnessMap={textures.hullRoughnessMap}
                color="#f8fafc"
                roughness={0.25}
                metalness={0.65}
                clearcoat={0.6}
              />
            </mesh>

            {/* 3-Tier Stepped Armor Plate Layer on Wing Top */}
            <mesh position={[isLeft ? -0.55 : 0.55, 0.015, -0.06]} rotation={[0, w.sfoilAngle, 0]}>
              <boxGeometry args={[0.55, 0.008, 0.32]} />
              <meshPhysicalMaterial color="#e2e8f0" metalness={0.8} />
            </mesh>

            {/* 4 Micro Vortex Generator Fins on Leading Edge (4 Vây Cản Gió) */}
            {[-0.3, -0.5, -0.7, -0.9].map((vx, vidx) => {
              const rx = isLeft ? vx : -vx;
              return (
                <mesh key={vidx} position={[rx, 0.018, -0.3]} rotation={[0, 0.15, 0]}>
                  <boxGeometry args={[0.006, 0.02, 0.04]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.95} />
                </mesh>
              );
            })}

            {/* Red Rebel Alliance Chevron Wing Ident Stripes */}
            {w.redStripe && (
              <group position={[isLeft ? -0.7 : 0.7, 0.018, -0.08]} rotation={[0, w.sfoilAngle, 0]}>
                <mesh position={[0, 0, -0.1]}>
                  <boxGeometry args={[0.24, 0.006, 0.1]} />
                  <meshBasicMaterial color="#dc2626" />
                </mesh>
                <mesh position={[0, 0, 0.1]}>
                  <boxGeometry args={[0.24, 0.006, 0.1]} />
                  <meshBasicMaterial color="#dc2626" />
                </mesh>
              </group>
            )}

            {/* WINGTIP 6-SEGMENT LASER CANNON ASSEMBLY */}
            <group position={[isLeft ? -1.14 : 1.14, 0, -0.34]}>
              {/* Rear Generator Module */}
              <mesh position={[0, 0, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.038, 0.35, 12]} />
                <meshStandardMaterial color="#0f172a" metalness={0.95} />
              </mesh>

              {/* Central Heat Radiator Coil Assembly (Vòng Xoắn Tản Nhiệt Bằng Đồng) */}
              <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.024, 0.024, 0.55, 12]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
              </mesh>
              {[-0.18, -0.09, 0, 0.09, 0.18].map((cz, cidx) => (
                <mesh key={cidx} position={[0, 0, cz]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.028, 0.006, 8, 16]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.95} />
                </mesh>
              ))}

              {/* Forward Barrel & Flash Suppressor Muzzle (Nòng Súng Mũi Vuốt) */}
              <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.013, 0.016, 0.72, 12]} />
                <meshStandardMaterial color="#334155" metalness={0.95} />
              </mesh>
              {/* Laser Emitter Tip */}
              <mesh position={[0, 0, -0.98]}>
                <sphereGeometry args={[0.024, 12, 12]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          </group>
        );
      })}

      {/* ================================================================= */}
      {/* 5. QUAD INCOM 4L4 ENGINES WITH BRIGHTLY ILLUMINATED 24-BLADE TURBINE */}
      {/* ================================================================= */}
      {[
        { pos: [-0.26, 0.12, 0.46], ref: turbineIntake1Ref },
        { pos: [0.26, 0.12, 0.46], ref: turbineIntake2Ref },
        { pos: [-0.26, -0.12, 0.46], ref: turbineIntake3Ref },
        { pos: [0.26, -0.12, 0.46], ref: turbineIntake4Ref },
      ].map((eng, idx) => (
        <group key={idx} position={eng.pos as [number, number, number]}>
          {/* Intake Cowl Lip (Miệng Hút Gió Tròn) */}
          <mesh position={[0, 0, -0.34]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.098, 0.016, 12, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.98} />
          </mesh>

          {/* BRIGHT GLOWING INTERIOR RING (Vành Sáng Chiếu Rọi Miệng Hút Gió) */}
          <mesh position={[0, 0, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.092, 0.008, 8, 24]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* ROTATING 24-BLADE COMPRESSOR TURBINE DISK WITH TEXTURE (Cánh Quạt Sáng Quay Tròn Rõ Nét) */}
          <mesh position={[0, 0, -0.3]} rotation={[0, 0, 0]} ref={eng.ref as React.RefObject<THREE.Mesh>}>
            <circleGeometry args={[0.09, 24]} />
            <meshBasicMaterial map={textures.turbineMap} side={THREE.DoubleSide} />
          </mesh>

          {/* Engine Body with 8 Circumferential Radiator Heat Rings (Gân Tản Nhiệt Đa Tầng) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.095, 0.11, 0.68, 24]} />
            <meshPhysicalMaterial color="#cbd5e1" metalness={0.88} roughness={0.18} />
          </mesh>
          {[-0.2, -0.12, -0.04, 0.04, 0.12, 0.2].map((rz, ridx) => (
            <mesh key={ridx} position={[0, 0, rz]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.104, 0.007, 8, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.95} />
            </mesh>
          ))}

          {/* Titanium Fuel Conduit Tube along Engine Top (Ống Dẫn Nhiên Liệu Lộ Thiên) */}
          <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.62, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} />
          </mesh>

          {/* Convergent-Divergent Exhaust Nozzle with 12 Petal Flaps (Vòi Phun 12 Lá Xếp) */}
          <group position={[0, 0, 0.4]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.11, 0.18, 24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.98} />
            </mesh>
            {[...Array(12)].map((_, pidx) => {
              const pAngle = (pidx / 12) * Math.PI * 2;
              return (
                <mesh key={pidx} position={[Math.cos(pAngle) * 0.1, Math.sin(pAngle) * 0.1, 0.04]} rotation={[0, 0, pAngle]}>
                  <boxGeometry args={[0.018, 0.05, 0.13]} />
                  <meshPhysicalMaterial color="#ffffff" metalness={0.98} roughness={0.1} />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}

      {/* Quad Ion Exhaust Plasma Shock Diamonds (Lửa Động Cơ Có Vòng Sóng Xung Kích) */}
      <group ref={afterburnersRef}>
        {[
          [-0.26, 0.12],
          [0.26, 0.12],
          [-0.26, -0.12],
          [0.26, -0.12],
        ].map(([x, y], idx) => (
          <group key={idx} position={[x, y, 0.94]}>
            {/* Outer Flame Cone */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.085, 0.6, 16]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.85} />
            </mesh>
            {/* Inner Core Plasma Shock Diamond */}
            <mesh position={[0, 0, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.048, 0.35, 12]} />
              <meshBasicMaterial color="#fef08a" transparent opacity={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Dorsal Vietnam Flag Badge */}
      {hasVnFlag && <VietnamFlagDecal position={[0, 0.15, 0.48]} scale={[0.18, 0.12, 0.01]} />}
    </group>
  );
};
