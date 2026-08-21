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

interface ShipProps {
  shipColor?: string;
  showStreamlines?: boolean;
  thrustPower?: number;
}

const DarkPanel: React.FC<{
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, scale, rotation = [0, 0, 0] }) => (
  <mesh position={position} scale={scale} rotation={rotation}>
    <boxGeometry />
    <meshPhysicalMaterial color={NOVA_PALETTE.dark} metalness={0.94} roughness={0.18} clearcoat={0.5} />
  </mesh>
);

const Fin: React.FC<{ side: -1 | 1; position: [number, number, number]; color: string }> = ({ side, position, color }) => (
  <AeroPanel
    points={[[0, -0.3], [side * 0.5, 0], [side * 0.42, 0.58], [side * 0.06, 0.3]]}
    thickness={0.055}
    position={position}
    rotation={[0, 0, side * 0.48]}
    color={color}
  />
);

// 1. Forward-swept high-speed interceptor.
export const NovaApexHunter: React.FC<ShipProps> = ({ shipColor = '#38bdf8', showStreamlines = false, thrustPower = 1.0 }) => {
  const turbineRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (turbineRef.current) turbineRef.current.rotation.z -= delta * 7;
  });
  const wing = [[0, -0.15], [1.18, 0.18], [1.42, 0.64], [0.34, 0.34]] as Array<[number, number]>;
  return (
    <group scale={0.94}>
      <HullShell color={NOVA_PALETTE.white} position={[0, 0, -0.12]} scale={[0.78, 0.46, 1.08]} radius={0.35} length={1.55} />
      <AeroPanel points={[[0, -0.88], [0.43, -0.42], [0.36, 0.62], [0, 0.88]]} thickness={0.18} position={[0, -0.05, -0.1]} color={shipColor} />
      <AeroPanel points={wing} thickness={0.105} position={[0.24, -0.04, 0.12]} color={shipColor} />
      <AeroPanel points={wing.map(([x, z]) => [-x, z])} thickness={0.105} position={[-0.24, -0.04, 0.12]} color={shipColor} />
      <AeroPanel points={[[0, -0.1], [1.02, 0.2], [1.2, 0.38], [0.22, 0.24]]} thickness={0.035} position={[0.29, 0.035, 0.13]} color={NOVA_PALETTE.armor} />
      <AeroPanel points={[[0, -0.1], [-1.02, 0.2], [-1.2, 0.38], [-0.22, 0.24]]} thickness={0.035} position={[-0.29, 0.035, 0.13]} color={NOVA_PALETTE.armor} />
      <mesh position={[0, -0.015, -1.18]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.72]}>
        <coneGeometry args={[0.21, 0.72, 20]} />
        <HullSurfaceMaterial color={NOVA_PALETTE.white} metalness={0.82} roughness={0.2} />
      </mesh>
      <Canopy position={[0, 0.205, -0.53]} scale={[0.88, 0.92, 1.2]} />
      <DarkPanel position={[0, 0.245, 0.23]} scale={[0.12, 0.08, 0.62]} />
      <EnergyStrip position={[0, 0.294, 0.18]} scale={[0.7, 0.6, 1.55]} />
      <AeroPanel points={[[0, -0.74], [0.2, -0.48], [0.18, 0.52], [0, 0.72]]} thickness={0.035} position={[0.24, 0.12, -0.02]} color={shipColor} />
      <AeroPanel points={[[0, -0.74], [-0.2, -0.48], [-0.18, 0.52], [0, 0.72]]} thickness={0.035} position={[-0.24, 0.12, -0.02]} color={shipColor} />
      <EnginePod position={[-0.58, -0.04, 0.52]} scale={0.9} accent={shipColor} thrustPower={thrustPower} />
      <EnginePod position={[0.58, -0.04, 0.52]} scale={0.9} accent={shipColor} thrustPower={thrustPower} />
      <group ref={turbineRef}>
        {[-0.58, 0.58].map((x) => <group key={x} position={[x, -0.04, 0.17]}>
          {Array.from({ length: 8 }).map((_, index) => <mesh key={index} rotation={[0, 0, index * Math.PI / 4]} position={[0.1, 0, 0]}>
            <boxGeometry args={[0.13, 0.025, 0.018]} /><meshBasicMaterial color="#9ff3ff" toneMapped={false} />
          </mesh>)}
        </group>)}
      </group>
      <Fin side={1} position={[0.23, 0.16, 0.69]} color={shipColor} />
      <Fin side={-1} position={[-0.23, 0.16, 0.69]} color={shipColor} />
      <NavigationLights width={1.47} z={0.65} />
      <Streamlines visible={showStreamlines} width={1.15} length={4.3} />
    </group>
  );
};

// 2. Crescent deep-space explorer with a quantum core.
export const ChronoVoyager: React.FC<ShipProps> = ({ shipColor = '#7c3aed', showStreamlines = false, thrustPower = 1.0 }) => {
  const radarRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, delta) => {
    if (radarRef.current) radarRef.current.rotation.y += delta * 0.9;
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3.2) * 0.06);
  });
  const crescent = [[0, -0.84], [0.94, -0.52], [1.42, 0.1], [1.16, 0.74], [0.48, 0.38], [0, 0.18]] as Array<[number, number]>;
  return (
    <group scale={0.9}>
      <mesh scale={[1.35, 0.23, 1.22]}><sphereGeometry args={[0.78, 32, 18]} /><HullSurfaceMaterial color={NOVA_PALETTE.white} metalness={0.82} roughness={0.2} /></mesh>
      <mesh position={[0, -0.12, 0.08]} scale={[1.18, 0.16, 1.04]}><sphereGeometry args={[0.78, 28, 14]} /><meshStandardMaterial color={NOVA_PALETTE.dark} metalness={0.94} roughness={0.18} /></mesh>
      <AeroPanel points={crescent} thickness={0.1} position={[0.2, 0, 0.02]} color={shipColor} />
      <AeroPanel points={crescent.map(([x, z]) => [-x, z])} thickness={0.1} position={[-0.2, 0, 0.02]} color={shipColor} />
      <AeroPanel points={[[0, -0.62], [1.06, -0.28], [0.92, 0.04], [0, -0.2]]} thickness={0.035} position={[0.12, 0.065, -0.02]} color={NOVA_PALETTE.armor} />
      <AeroPanel points={[[0, -0.62], [-1.06, -0.28], [-0.92, 0.04], [0, -0.2]]} thickness={0.035} position={[-0.12, 0.065, -0.02]} color={NOVA_PALETTE.armor} />
      <Canopy position={[0, 0.25, -0.47]} scale={[1.12, 0.72, 0.82]} color="#b15cff" />
      <mesh ref={coreRef} position={[0, 0.22, 0.18]}><sphereGeometry args={[0.2, 24, 18]} /><meshBasicMaterial color="#80f5ff" transparent opacity={0.92} toneMapped={false} /></mesh>
      {[0.29, 0.37].map((radius) => <mesh key={radius} position={[0, 0.22, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.018, 8, 32]} /><meshStandardMaterial color={radius < 0.3 ? '#f7c95c' : '#43ddff'} emissive={radius < 0.3 ? '#c07912' : '#129ad0'} emissiveIntensity={1.8} metalness={0.8} />
      </mesh>)}
      <group ref={radarRef} position={[0, 0.39, 0.48]}>
        <mesh><cylinderGeometry args={[0.035, 0.05, 0.18, 12]} /><meshStandardMaterial color={NOVA_PALETTE.metal} metalness={0.95} /></mesh>
        <mesh position={[0, 0.13, 0]} rotation={[0.35, 0, 0]}><cylinderGeometry args={[0.28, 0.055, 0.07, 28]} /><meshPhysicalMaterial color={NOVA_PALETTE.white} metalness={0.9} roughness={0.15} /></mesh>
        <mesh position={[0, 0.18, 0.04]}><sphereGeometry args={[0.04, 12, 12]} /><meshBasicMaterial color="#4ff6ff" toneMapped={false} /></mesh>
      </group>
      {[-0.78, -0.28, 0.28, 0.78].map((x) => <EnginePod key={x} position={[x, -0.06, 0.63]} scale={0.62} accent="#a855f7" thrustPower={thrustPower} />)}
      <NavigationLights width={1.49} z={0.2} />
      <Streamlines visible={showStreamlines} width={1.3} length={4} color="#bd7cff" />
    </group>
  );
};

// 3. Heavy orbital carrier with twin drone runways.
export const OrionSkyCarrier: React.FC<ShipProps> = ({ shipColor = '#2563eb', showStreamlines = false, thrustPower = 1.0 }) => {
  const beaconRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (beaconRef.current) (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(clock.elapsedTime * 5) * 0.35;
  });
  const hull = [[0, -1.18], [0.48, -0.78], [0.56, 0.86], [0.34, 1.18], [0, 1.3]] as Array<[number, number]>;
  const deck = [[0, -0.72], [0.74, -0.52], [0.84, 0.72], [0.55, 1], [0, 0.84]] as Array<[number, number]>;
  return (
    <group scale={0.78}>
      <AeroPanel points={hull} thickness={0.38} color={NOVA_PALETTE.white} /><AeroPanel points={hull.map(([x, z]) => [-x, z])} thickness={0.38} color={NOVA_PALETTE.white} />
      <AeroPanel points={deck} thickness={0.16} position={[0.47, -0.04, 0.12]} color={shipColor} /><AeroPanel points={deck.map(([x, z]) => [-x, z])} thickness={0.16} position={[-0.47, -0.04, 0.12]} color={shipColor} />
      {([-1, 1] as const).map((side) => <group key={side} position={[side * 1.02, 0, 0.1]}>
        <AeroPanel points={[[0, -0.9], [0.38 * side, -0.68], [0.42 * side, 0.8], [0, 1.02]]} thickness={0.2} color={NOVA_PALETTE.white} />
        <DarkPanel position={[side * 0.12, 0.12, 0.06]} scale={[0.2, 0.035, 1.35]} />
        {[-0.58, -0.22, 0.14, 0.5].map((z) => <EnergyStrip key={z} position={[side * 0.12, 0.166, z]} scale={[0.55, 0.65, 0.12]} color="#f4c94d" />)}
      </group>)}
      <mesh position={[0, 0.34, 0.16]} scale={[0.56, 0.24, 0.72]}><boxGeometry /><HullSurfaceMaterial color={shipColor} metalness={0.78} roughness={0.24} /></mesh>
      <mesh position={[0, 0.57, 0.08]} scale={[0.38, 0.22, 0.42]}><sphereGeometry args={[0.72, 20, 12]} /><meshPhysicalMaterial color="#34e5d0" emissive="#0d8d88" emissiveIntensity={0.8} metalness={0.72} roughness={0.08} transmission={0.25} /></mesh>
      <mesh position={[0, 0.88, 0.12]}><cylinderGeometry args={[0.018, 0.028, 0.46, 8]} /><meshStandardMaterial color="#f7c84d" metalness={0.95} /></mesh>
      <mesh ref={beaconRef} position={[0, 1.12, 0.12]}><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color="#ff405f" transparent toneMapped={false} /></mesh>
      <GreebleRail position={[-0.43, 0.25, 0.18]} count={10} spacing={0.16} /><GreebleRail position={[0.43, 0.25, 0.18]} count={10} spacing={0.16} />
      {[-0.9, -0.3, 0.3, 0.9].map((x) => <EnginePod key={x} position={[x, -0.12, 1.04]} scale={0.82} accent={shipColor} thrustPower={thrustPower} />)}
      <NavigationLights width={1.43} z={0.78} />
      <Streamlines visible={showStreamlines} width={1.5} length={4.6} />
    </group>
  );
};

// 4. Seamless double-delta lifting-body shuttle.
export const AeroShuttleX9: React.FC<ShipProps> = ({ shipColor = '#f1f5f9', showStreamlines = false, thrustPower = 1.0 }) => {
  const delta = [[0, -1.34], [0.88, 0.04], [1.38, 0.92], [0.48, 0.62], [0, 1.12]] as Array<[number, number]>;
  const belly = [[0, -1.28], [0.73, 0.05], [1.15, 0.75], [0.38, 0.5], [0, 1.02]] as Array<[number, number]>;
  return (
    <group scale={0.9}>
      <AeroPanel points={delta} thickness={0.18} position={[0, 0.02, 0]} color={NOVA_PALETTE.white} /><AeroPanel points={delta.map(([x, z]) => [-x, z])} thickness={0.18} position={[0, 0.02, 0]} color={NOVA_PALETTE.white} />
      <AeroPanel points={belly} thickness={0.045} position={[0, -0.14, 0.06]} color="#080d16" roughness={0.5} /><AeroPanel points={belly.map(([x, z]) => [-x, z])} thickness={0.045} position={[0, -0.14, 0.06]} color="#080d16" roughness={0.5} />
      <HullShell color={shipColor} position={[0, 0.11, -0.15]} scale={[0.7, 0.42, 1.18]} radius={0.34} length={1.5} />
      <mesh position={[0, 0.08, -1.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.75]}><coneGeometry args={[0.25, 0.66, 24]} /><HullSurfaceMaterial color={shipColor} metalness={0.7} roughness={0.23} /></mesh>
      <Canopy position={[0, 0.34, -0.58]} scale={[1.05, 0.86, 1.3]} color="#2ba8e8" />
      <EnergyStrip position={[-0.43, 0.15, 0.1]} scale={[0.48, 0.65, 1.9]} /><EnergyStrip position={[0.43, 0.15, 0.1]} scale={[0.48, 0.65, 1.9]} />
      <Fin side={1} position={[0.27, 0.22, 0.72]} color={shipColor} /><Fin side={-1} position={[-0.27, 0.22, 0.72]} color={shipColor} />
      <DarkPanel position={[-0.88, 0.12, 0.5]} scale={[0.48, 0.025, 0.12]} rotation={[0, -0.12, 0]} /><DarkPanel position={[0.88, 0.12, 0.5]} scale={[0.48, 0.025, 0.12]} rotation={[0, 0.12, 0]} />
      <EnginePod position={[-0.25, 0.01, 0.92]} scale={0.68} accent={shipColor} thrustPower={thrustPower} /><EnginePod position={[0, 0.13, 0.96]} scale={0.72} accent={shipColor} thrustPower={thrustPower} /><EnginePod position={[0.25, 0.01, 0.92]} scale={0.68} accent={shipColor} thrustPower={thrustPower} />
      <NavigationLights width={1.39} z={0.9} />
      <Streamlines visible={showStreamlines} width={1.25} length={4.5} />
    </group>
  );
};

// 5. Three-stage planetary launch ship.
export const HyperionStarLifterV: React.FC<ShipProps> = ({ shipColor = '#f8fafc', showStreamlines = false, thrustPower = 1.0 }) => {
  const ringRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ringRef.current) ringRef.current.rotation.z += delta * 0.45; });
  return (
    <group scale={0.78}>
      <mesh position={[0, 0, 0.45]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.42, 0.48, 1.72, 28]} /><HullSurfaceMaterial color={shipColor} metalness={0.68} roughness={0.25} /></mesh>
      <mesh position={[0, 0, -0.72]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.28, 0.42, 0.72, 28]} /><HullSurfaceMaterial color={shipColor} metalness={0.72} roughness={0.22} /></mesh>
      <mesh position={[0, 0, -1.27]} rotation={[-Math.PI / 2, 0, 0]}><coneGeometry args={[0.28, 0.58, 28]} /><HullSurfaceMaterial color={shipColor} metalness={0.75} roughness={0.2} /></mesh>
      <Canopy position={[0, 0.02, -1.05]} scale={[0.95, 0.68, 0.72]} color="#7adfff" />
      {[-0.34, 0.05, 0.76, 1.17].map((z, index) => <mesh key={z} position={[0, 0, z]}><torusGeometry args={[index < 2 ? 0.39 : 0.445, 0.045, 10, 30]} /><meshStandardMaterial color={index === 1 ? '#f59e0b' : NOVA_PALETTE.armor} metalness={0.94} roughness={0.18} /></mesh>)}
      <group ref={ringRef} position={[0, 0, -0.48]}>
        <mesh><torusGeometry args={[0.47, 0.028, 10, 40]} /><meshStandardMaterial color="#43e7ff" emissive="#13a6d8" emissiveIntensity={2.8} toneMapped={false} /></mesh>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => <mesh key={angle} position={[Math.cos(angle) * 0.47, Math.sin(angle) * 0.47, 0]}><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color="#f5feff" toneMapped={false} /></mesh>)}
      </group>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, index) => <group key={angle} rotation={[0, 0, angle]} position={[0, 0, 0.22]}>
        <mesh position={[0.61, 0, 0]}><boxGeometry args={[0.4, 0.035, 0.42, 4, 1, 4]} /><meshStandardMaterial color={index % 2 ? NOVA_PALETTE.armor : shipColor} metalness={0.9} roughness={0.26} wireframe /></mesh>
        <mesh position={[0.53, 0, 0.92]} rotation={[0, -0.22, 0]}><boxGeometry args={[0.08, 0.07, 0.9]} /><meshStandardMaterial color={NOVA_PALETTE.metal} metalness={0.94} /></mesh>
      </group>)}
      {[[0, 0], [-0.27, -0.27], [0.27, -0.27], [-0.27, 0.27], [0.27, 0.27]].map(([x, y], index) => <EnginePod key={index} position={[x, y, 1.42]} scale={0.64} accent="#ff8a20" flame="#ff7a18" rings={2} thrustPower={thrustPower} />)}
      <EnergyStrip position={[-0.435, 0, 0.45]} rotation={[0, 0, Math.PI / 2]} scale={[0.8, 0.7, 2.4]} color="#ffb02e" /><EnergyStrip position={[0.435, 0, 0.45]} rotation={[0, 0, Math.PI / 2]} scale={[0.8, 0.7, 2.4]} color="#ffb02e" />
      <Streamlines visible={showStreamlines} width={0.75} length={4.8} color="#ffb44a" />
    </group>
  );
};

export const AerodynamicShipRenderer: React.FC<{
  shipId: string;
  shipColor?: string;
  showStreamlines?: boolean;
  thrustPower?: number;
  scale?: number;
}> = ({ shipId, shipColor = '#38bdf8', showStreamlines = false, thrustPower = 1.0, scale = 1 }) => {
  const props = { shipColor, showStreamlines, thrustPower };
  let model: React.ReactNode;
  switch (shipId) {
    case 'falcon_apex': model = <ChronoVoyager {...props} />; break;
    case 'solar_phoenix': model = <OrionSkyCarrier {...props} />; break;
    case 'starlight_runner': model = <AeroShuttleX9 {...props} />; break;
    case 'astral_shuttle': model = <HyperionStarLifterV {...props} />; break;
    default: model = <NovaApexHunter {...props} />;
  }
  return <group scale={scale}>{model}</group>;
};
