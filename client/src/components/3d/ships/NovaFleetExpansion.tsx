import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  AeroPanel,
  Canopy,
  EnergyStrip,
  EnginePod,
  GreebleRail,
  HullShell,
  HullSurfaceMaterial,
  NavigationLights,
  NOVA_PALETTE,
  Streamlines,
} from './NovaFleetKit';

interface ExpansionShipProps {
  shipColor?: string;
  showStreamlines?: boolean;
  thrustPower?: number;
}

const StructuralBeam: React.FC<{
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}> = ({ position, scale, rotation = [0, 0, 0], color = NOVA_PALETTE.armor }) => (
  <mesh position={position} scale={scale} rotation={rotation}>
    <boxGeometry />
    <meshPhysicalMaterial color={color} metalness={0.94} roughness={0.2} clearcoat={0.42} />
  </mesh>
);

const ArmoredNose: React.FC<{
  position: [number, number, number];
  radius: number;
  length: number;
  color: string;
  accent: string;
  lance?: boolean;
}> = ({ position, radius, length, color, accent, lance = false }) => (
  <group position={position}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <coneGeometry args={[radius, length, 32, 6]} />
      <HullSurfaceMaterial color={color} metalness={0.88} roughness={0.18} />
    </mesh>
    <mesh position={[0, 0, length * 0.31]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius * 0.82, radius * 0.075, 10, 36]} />
      <meshBasicMaterial color={accent} toneMapped={false} />
    </mesh>
    {lance && (
      <mesh position={[0, 0, -length * 0.68]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[radius * 0.2, length * 0.7, 18, 4]} />
        <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.38} metalness={0.95} roughness={0.14} clearcoat={0.7} />
      </mesh>
    )}
  </group>
);

const ShieldBubble: React.FC<{ color: string }> = ({ color }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh scale={[1.42, 0.58, 1.48]}>
      <sphereGeometry args={[1, 32, 20]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }}
        vertexShader={`
          varying vec3 vNormalView;
          varying vec3 vView;
          varying vec3 vPos;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormalView = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            vPos = position;
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          varying vec3 vNormalView;
          varying vec3 vView;
          varying vec3 vPos;
          void main() {
            float rim = pow(1.0 - max(dot(vNormalView, vView), 0.0), 4.2);
            float gridA = smoothstep(0.94, 1.0, abs(sin((vPos.x + vPos.z) * 18.0 + uTime * 0.7)));
            float gridB = smoothstep(0.95, 1.0, abs(sin((vPos.x - vPos.z) * 18.0 - uTime * 0.55)));
            float alpha = rim * 0.34 + (gridA + gridB) * rim * 0.055;
            gl_FragColor = vec4(uColor * (1.1 + rim), alpha);
          }
        `}
      />
    </mesh>
  );
};

// 6. Chương Dương — orbital guardian cruiser with a visible multi-frequency shield.
export const ChuongDuongGuardian: React.FC<ExpansionShipProps> = ({
  shipColor = '#0ea5e9',
  showStreamlines = false,
  thrustPower = 1,
}) => {
  const shieldRingRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (shieldRingRef.current) {
      shieldRingRef.current.rotation.z += delta * 0.42;
      shieldRingRef.current.rotation.y -= delta * 0.24;
    }
    if (radarRef.current) radarRef.current.rotation.y += delta * 1.15;
  });

  const mainBlade = [[0, -1.42], [0.48, -0.88], [0.58, 0.9], [0.32, 1.28], [0, 1.42]] as Array<[number, number]>;
  const shieldWing = [[0, -0.5], [0.92, -0.18], [1.24, 0.68], [0.48, 0.48]] as Array<[number, number]>;

  return (
    <group scale={0.83}>
      <AeroPanel points={mainBlade} thickness={0.3} color={NOVA_PALETTE.white} />
      <AeroPanel points={mainBlade.map(([x, z]) => [-x, z])} thickness={0.3} color={NOVA_PALETTE.white} />
      <HullShell color={shipColor} position={[0, 0.12, -0.04]} scale={[0.74, 0.42, 1.18]} radius={0.34} length={1.48} />
      <ArmoredNose position={[0, 0.06, -1.46]} radius={0.39} length={0.92} color={NOVA_PALETTE.white} accent="#55eaff" />
      <Canopy position={[0, 0.34, -0.62]} scale={[1.04, 0.76, 1.12]} color="#54e7ff" />

      <AeroPanel points={shieldWing} thickness={0.1} position={[0.26, -0.02, 0.1]} color={shipColor} />
      <AeroPanel points={shieldWing.map(([x, z]) => [-x, z])} thickness={0.1} position={[-0.26, -0.02, 0.1]} color={shipColor} />
      <StructuralBeam position={[-0.72, 0.03, 0.26]} scale={[0.72, 0.1, 0.14]} rotation={[0, -0.16, 0]} />
      <StructuralBeam position={[0.72, 0.03, 0.26]} scale={[0.72, 0.1, 0.14]} rotation={[0, 0.16, 0]} />

      <group ref={shieldRingRef} position={[0, 0.1, 0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.83, 0.024, 10, 64]} />
          <meshBasicMaterial color="#5cecff" transparent opacity={0.82} toneMapped={false} />
        </mesh>
        <mesh rotation={[0.55, 0.2, 0.28]}>
          <torusGeometry args={[0.94, 0.015, 8, 64]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.58} toneMapped={false} />
        </mesh>
      </group>
      <ShieldBubble color="#38d9ff" />

      <group ref={radarRef} position={[0, 0.57, 0.2]}>
        <mesh><cylinderGeometry args={[0.035, 0.055, 0.18, 12]} /><meshStandardMaterial color={NOVA_PALETTE.metal} metalness={0.95} /></mesh>
        <mesh position={[0, 0.12, 0]} rotation={[0.25, 0, 0]}><cylinderGeometry args={[0.24, 0.05, 0.055, 28]} /><HullSurfaceMaterial color={NOVA_PALETTE.white} metalness={0.88} roughness={0.16} /></mesh>
        <mesh position={[0, 0.17, 0.02]}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color="#a7f8ff" toneMapped={false} /></mesh>
      </group>
      <GreebleRail position={[-0.34, 0.29, 0.24]} count={8} spacing={0.14} />
      <GreebleRail position={[0.34, 0.29, 0.24]} count={8} spacing={0.14} />

      {[-0.68, -0.22, 0.22, 0.68].map((x) => (
        <EnginePod key={x} position={[x, -0.09, 0.96]} scale={0.67} accent="#55eaff" flame="#34d9ff" thrustPower={thrustPower} />
      ))}
      <EnergyStrip position={[-0.5, 0.16, -0.12]} scale={[0.6, 0.7, 2.2]} color="#55eaff" />
      <EnergyStrip position={[0.5, 0.16, -0.12]} scale={[0.6, 0.7, 2.2]} color="#55eaff" />
      <NavigationLights width={1.5} z={0.68} />
      <Streamlines visible={showStreamlines} width={1.28} length={4.7} color="#51e5ff" />
    </group>
  );
};

const SurveyLeg: React.FC<{ side: -1 | 1; fore: -1 | 1; color: string }> = ({ side, fore, color }) => (
  <group position={[side * 0.72, -0.16, fore * 0.5]}>
    <mesh rotation={[0, 0, side * 0.58]}>
      <cylinderGeometry args={[0.055, 0.075, 0.78, 12]} />
      <meshStandardMaterial color={NOVA_PALETTE.metal} metalness={0.96} roughness={0.18} />
    </mesh>
    <mesh position={[side * 0.24, -0.35, 0]} rotation={[0, 0, side * 0.58]}>
      <cylinderGeometry args={[0.025, 0.035, 0.58, 10]} />
      <meshPhysicalMaterial color={color} metalness={0.86} roughness={0.22} clearcoat={0.5} />
    </mesh>
    <mesh position={[side * 0.43, -0.61, 0]} scale={[0.22, 0.08, 0.28]} rotation={[0, 0, side * 0.08]}>
      <boxGeometry />
      <meshStandardMaterial color={NOVA_PALETTE.armor} metalness={0.92} roughness={0.3} />
    </mesh>
  </group>
);

// 7. Sơn Tinh — rugged geological survey ship with an animated diamond drill.
export const SonTinhSurveyor: React.FC<ExpansionShipProps> = ({
  shipColor = '#d97706',
  showStreamlines = false,
  thrustPower = 1,
}) => {
  const drillRef = useRef<THREE.Group>(null);
  const scannerRef = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (drillRef.current) drillRef.current.rotation.z += delta * 3.8;
    if (scannerRef.current) {
      scannerRef.current.rotation.y -= delta * 0.85;
      const pulse = 1 + Math.sin(clock.elapsedTime * 4.2) * 0.05;
      scannerRef.current.scale.setScalar(pulse);
    }
  });

  const shoulder = [[0, -0.72], [0.72, -0.5], [0.9, 0.72], [0.25, 0.94], [0, 0.64]] as Array<[number, number]>;
  return (
    <group scale={0.8}>
      <HullShell color={NOVA_PALETTE.white} position={[0, 0.08, 0.02]} scale={[1.05, 0.72, 1.08]} radius={0.46} length={1.38} />
      <mesh position={[0, -0.18, 0.08]} scale={[0.84, 0.22, 1.36]}><boxGeometry /><meshPhysicalMaterial color={NOVA_PALETTE.armor} metalness={0.92} roughness={0.28} clearcoat={0.35} /></mesh>
      <AeroPanel points={shoulder} thickness={0.2} position={[0.38, 0.05, 0.05]} color={shipColor} />
      <AeroPanel points={shoulder.map(([x, z]) => [-x, z])} thickness={0.2} position={[-0.38, 0.05, 0.05]} color={shipColor} />
      <Canopy position={[0, 0.42, -0.38]} scale={[1.24, 0.94, 0.94]} color="#f7b94f" />

      <group ref={drillRef} position={[0, -0.02, -1.25]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.35, 1.05, 18, 7]} />
          <meshPhysicalMaterial color="#c8d3de" metalness={0.98} roughness={0.12} clearcoat={0.7} />
        </mesh>
        {[0.12, 0.3, 0.48].map((z, index) => (
          <mesh key={z} position={[0, 0, -z]} rotation={[0, 0, index * 0.7]}>
            <torusGeometry args={[0.27 - index * 0.055, 0.035, 8, 18]} />
            <meshStandardMaterial color={index % 2 ? '#fbbf24' : NOVA_PALETTE.metal} metalness={0.96} roughness={0.18} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -0.02, -0.88]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.31, 0.4, 0.46, 24]} />
        <HullSurfaceMaterial color={shipColor} metalness={0.82} roughness={0.26} />
      </mesh>

      {([-1, 1] as const).flatMap((side) => ([-1, 1] as const).map((fore) => (
        <SurveyLeg key={`${side}-${fore}`} side={side} fore={fore} color={shipColor} />
      )))}
      <group ref={scannerRef} position={[0, 0.72, 0.38]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.25, 0.028, 8, 36]} /><meshBasicMaterial color="#fbbf24" transparent opacity={0.9} toneMapped={false} /></mesh>
        <mesh><sphereGeometry args={[0.11, 18, 14]} /><meshBasicMaterial color="#fff2a6" transparent opacity={0.88} toneMapped={false} /></mesh>
      </group>
      <GreebleRail position={[-0.52, 0.28, 0.28]} count={9} spacing={0.14} color="#d8a038" />
      <GreebleRail position={[0.52, 0.28, 0.28]} count={9} spacing={0.14} color="#d8a038" />

      {[-0.62, 0.62].map((x) => (
        <EnginePod key={x} position={[x, 0.02, 0.9]} scale={0.9} accent="#f6b93b" flame="#ff9b2f" thrustPower={thrustPower} rings={4} />
      ))}
      <EnergyStrip position={[-0.72, 0.22, 0.12]} scale={[0.7, 0.85, 1.8]} color="#fbbf24" />
      <EnergyStrip position={[0.72, 0.22, 0.12]} scale={[0.7, 0.85, 1.8]} color="#fbbf24" />
      <NavigationLights width={1.25} z={0.5} />
      <Streamlines visible={showStreamlines} width={1.22} length={4.6} color="#ffc34d" />
    </group>
  );
};

const LightningArc: React.FC<{ rotation: [number, number, number]; color: string }> = ({ rotation, color }) => (
  <mesh rotation={rotation}>
    <torusGeometry args={[0.38, 0.022, 8, 48, Math.PI * 1.55]} />
    <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
  </mesh>
);

// 8. Thánh Gióng — legendary iron-horse dreadnought powered by a thunder core.
export const ThanhGiongColossus: React.FC<ExpansionShipProps> = ({
  shipColor = '#ef4444',
  showStreamlines = false,
  thrustPower = 1,
}) => {
  const thunderRef = useRef<THREE.Group>(null);
  const crestRef = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (thunderRef.current) {
      thunderRef.current.rotation.z += delta * 0.85;
      thunderRef.current.rotation.y -= delta * 0.45;
      const pulse = 1 + Math.sin(clock.elapsedTime * 7) * 0.07;
      thunderRef.current.scale.setScalar(pulse);
    }
    if (crestRef.current) crestRef.current.rotation.y = Math.sin(clock.elapsedTime * 1.4) * 0.12;
  });

  const armorBlade = [[0, -1.34], [0.55, -0.82], [0.72, 0.7], [0.38, 1.28], [0, 1.45]] as Array<[number, number]>;
  const shoulder = [[0, -0.52], [1.08, -0.16], [1.28, 0.7], [0.46, 0.48]] as Array<[number, number]>;
  return (
    <group scale={0.78}>
      <AeroPanel points={armorBlade} thickness={0.44} color="#dbe4eb" />
      <AeroPanel points={armorBlade.map(([x, z]) => [-x, z])} thickness={0.44} color="#dbe4eb" />
      <HullShell color={NOVA_PALETTE.armor} position={[0, 0.14, 0.04]} scale={[1.08, 0.72, 1.22]} radius={0.42} length={1.5} />
      <AeroPanel points={shoulder} thickness={0.17} position={[0.36, 0.12, 0.08]} color={shipColor} />
      <AeroPanel points={shoulder.map(([x, z]) => [-x, z])} thickness={0.17} position={[-0.36, 0.12, 0.08]} color={shipColor} />
      <Canopy position={[0, 0.48, -0.54]} scale={[1.15, 0.86, 1.12]} color="#ff784f" />

      <ArmoredNose position={[0, 0.08, -1.56]} radius={0.5} length={1.12} color={shipColor} accent="#ffd84a" lance />

      <group ref={crestRef} position={[0, 0.54, -0.04]}>
        <StructuralBeam position={[0, 0, 0.05]} scale={[0.16, 0.13, 0.76]} color="#9a5b10" />
        <StructuralBeam position={[-0.16, 0.2, -0.28]} scale={[0.07, 0.28, 0.22]} rotation={[0.18, 0, 0.22]} color="#f59e0b" />
        <StructuralBeam position={[0.16, 0.2, -0.28]} scale={[0.07, 0.28, 0.22]} rotation={[0.18, 0, -0.22]} color="#f59e0b" />
        <mesh position={[0, 0.06, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.36, 0.18, 24]} />
          <HullSurfaceMaterial color="#7c2d12" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      <group ref={thunderRef} position={[0, 0.68, 0.3]}>
        <mesh><sphereGeometry args={[0.26, 24, 18]} /><meshBasicMaterial color="#fff7b2" transparent opacity={0.96} toneMapped={false} /></mesh>
        <LightningArc rotation={[Math.PI / 2, 0, 0.2]} color="#73ecff" />
        <LightningArc rotation={[0.35, 0.7, 0.5]} color="#b98cff" />
        <LightningArc rotation={[-0.5, 0.35, 1.1]} color="#fff071" />
      </group>
      <mesh position={[0, 0.68, 0.3]}><sphereGeometry args={[0.48, 24, 18]} /><meshPhysicalMaterial color="#5f47a8" emissive="#4c1d95" emissiveIntensity={1.2} transparent opacity={0.2} depthWrite={false} /></mesh>
      <mesh position={[0, 0.43, 0.3]}>
        <cylinderGeometry args={[0.31, 0.43, 0.32, 24]} />
        <HullSurfaceMaterial color="#4c1d95" emissive="#7c3aed" emissiveIntensity={0.34} metalness={0.86} roughness={0.2} />
      </mesh>

      <StructuralBeam position={[-0.82, 0.06, 0.34]} scale={[0.9, 0.12, 0.16]} rotation={[0, -0.12, 0]} color="#7c8797" />
      <StructuralBeam position={[0.82, 0.06, 0.34]} scale={[0.9, 0.12, 0.16]} rotation={[0, 0.12, 0]} color="#7c8797" />
      <GreebleRail position={[-0.52, 0.35, 0.46]} count={10} spacing={0.15} color="#f59e0b" />
      <GreebleRail position={[0.52, 0.35, 0.46]} count={10} spacing={0.15} color="#f59e0b" />

      {[-0.88, -0.52, 0, 0.52, 0.88].map((x, index) => (
        <EnginePod
          key={x}
          position={[x, index === 2 ? 0.13 : -0.02, 1.03]}
          scale={index === 2 ? 0.92 : 0.76}
          accent={index === 2 ? '#fff36b' : '#a878ff'}
          flame={index === 2 ? '#fff36b' : '#9f67ff'}
          thrustPower={thrustPower}
          rings={4}
        />
      ))}
      <EnergyStrip position={[-0.62, 0.24, -0.08]} scale={[0.72, 0.8, 2.35]} color="#ffc83d" />
      <EnergyStrip position={[0.62, 0.24, -0.08]} scale={[0.72, 0.8, 2.35]} color="#ffc83d" />
      <NavigationLights width={1.55} z={0.7} />
      <Streamlines visible={showStreamlines} width={1.42} length={5} color="#ae79ff" />
    </group>
  );
};
