import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { ChevronLeft, Gauge, Heart, Lock, Pause, Play, RotateCcw, Shield, Sparkles, X, Zap } from 'lucide-react';
import * as THREE from 'three';
import { AerodynamicShipRenderer } from '../3d/ships/AerodynamicShips';
import { useGameStore } from '../../stores/useGameStore';
import { soundService } from '../../services/audio';
import { interactionService } from '../../services/interaction';
import {
  ASTEROID_STATS,
  MATERIAL_STATS,
  RUNNER_BALANCE,
  RUNNER_SHIPS,
  AsteroidMaterial,
  AsteroidTier,
  RunnerPowerUp,
  RunnerShipConfig,
  WeaponKind,
  getDamageMultiplier,
  getMoveSpeed,
  getResponsiveness,
  getRunnerShip,
} from './asteroidRunnerConfig';

type RunnerPhase = 'lobby' | 'playing' | 'boss' | 'wormhole' | 'paused' | 'gameover' | 'victory';
type LivePhase = 'playing' | 'boss' | 'wormhole';
type RunnerMode = 'stage' | 'endless';
type RunnerQuality = 'low' | 'medium' | 'high';

interface InputState {
  pointerActive: boolean;
  pointerId: number | null;
  lastX: number;
  lastY: number;
  targetX: number;
  targetY: number;
  keys: Set<string>;
}

interface HudState {
  hp: number;
  maxHp: number;
  score: number;
  coins: number;
  progress: number;
  combo: number;
  orbiterCount: number;
  slowSeconds: number;
  attackSpeedStacks: number;
  moveSpeedStacks: number;
  damageStacks: number;
  blackholeSeconds: number;
  phaseSeconds: number;
  teamSeconds: number;
  asteroidsDestroyed: number;
  powerupsCollected: number;
  maxCombo: number;
  survivalSeconds: number;
  bossHp: number;
  bossMaxHp: number;
}

interface RunSnapshot extends HudState {
  mode: LivePhase;
}

interface RunResult {
  won: boolean;
  score: number;
  collectedCoins: number;
  awardedCoins: number;
  isBest: boolean;
  newAchievements: string[];
}

interface BulletEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  aoe: number;
  ttl: number;
  kind: WeaponKind;
  piercingRemaining: number;
  hitIds: number[];
  homingStrength: number;
  autoDetonateY?: number;
  trail: boolean;
  fromOrbiter: boolean;
  dead?: boolean;
}

interface AsteroidEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  tier: AsteroidTier;
  material: AsteroidMaterial;
  rotation: number;
  spin: number;
  seed: number;
  dead?: boolean;
}

interface PickupEntity {
  id: number;
  x: number;
  y: number;
  vy: number;
  kind: 'coin' | RunnerPowerUp;
  value: number;
  dead?: boolean;
}

interface BurstEntity {
  id: number;
  x: number;
  y: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
  ring?: boolean;
  dead?: boolean;
}

interface ResupplyEntity {
  id: number;
  x: number;
  y: number;
  vx: number;
  dropped: boolean;
  dead?: boolean;
}

const EMPTY_HUD: HudState = {
  hp: 1,
  maxHp: 1,
  score: 0,
  coins: 0,
  progress: 0,
  combo: 0,
  orbiterCount: 0,
  slowSeconds: 0,
  attackSpeedStacks: 0,
  moveSpeedStacks: 0,
  damageStacks: 0,
  blackholeSeconds: 0,
  phaseSeconds: 0,
  teamSeconds: 0,
  asteroidsDestroyed: 0,
  powerupsCollected: 0,
  maxCombo: 0,
  survivalSeconds: 0,
  bossHp: 0,
  bossMaxHp: RUNNER_BALANCE.bossHp,
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const distanceSquared = (ax: number, ay: number, bx: number, by: number) => ((ax - bx) ** 2) + ((ay - by) ** 2);

const seededNoise = (value: number) => {
  const x = Math.sin(value * 91.733) * 43758.5453;
  return x - Math.floor(x);
};

const createIrregularAsteroidGeometry = (variant: number, detail = 1) => {
  const geometry = new THREE.IcosahedronGeometry(1, detail).toNonIndexed();
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const shades = new Float32Array(positions.count * 3);
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const ridge = seededNoise(x * 7.1 + y * 11.3 + z * 17.7 + variant * 23.9);
    const broad = seededNoise(x * 2.4 + z * 4.7 + variant * 13.1);
    const radius = 0.72 + ridge * 0.34 + broad * 0.16;
    positions.setXYZ(index, x * radius * (0.88 + seededNoise(variant + 1) * 0.26), y * radius, z * radius * (0.84 + seededNoise(variant + 5) * 0.3));
    const shade = 0.5 + seededNoise(index * 0.37 + variant * 5.9) * 0.55;
    shades[index * 3] = shade;
    shades[index * 3 + 1] = shade;
    shades[index * 3 + 2] = shade;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(shades, 3));
  geometry.computeVertexNormals();
  return geometry;
};

const ASTEROID_GEOMETRIES = Array.from({ length: 9 }, (_, index) => createIrregularAsteroidGeometry(index));
const TITAN_GEOMETRY = createIrregularAsteroidGeometry(19, 2);
const ASTEROID_MATERIALS: Record<AsteroidMaterial, THREE.MeshStandardMaterial> = {
  rock: new THREE.MeshStandardMaterial({ color: '#78839b', roughness: 0.94, metalness: 0.05, vertexColors: true, flatShading: true }),
  hard: new THREE.MeshStandardMaterial({ color: '#9a674f', emissive: '#2b1008', emissiveIntensity: 0.25, roughness: 0.86, metalness: 0.16, vertexColors: true, flatShading: true }),
  silver: new THREE.MeshStandardMaterial({ color: '#c8d5e4', emissive: '#26384c', emissiveIntensity: 0.24, roughness: 0.42, metalness: 0.72, vertexColors: true, flatShading: true }),
  gold: new THREE.MeshStandardMaterial({ color: '#e7ad32', emissive: '#6b3808', emissiveIntensity: 0.62, roughness: 0.38, metalness: 0.76, vertexColors: true, flatShading: true }),
  platinum: new THREE.MeshStandardMaterial({ color: '#b9f3ee', emissive: '#185e69', emissiveIntensity: 0.8, roughness: 0.3, metalness: 0.82, vertexColors: true, flatShading: true }),
  diamond: new THREE.MeshStandardMaterial({ color: '#9b7cf2', emissive: '#351884', emissiveIntensity: 1.35, roughness: 0.34, metalness: 0.58, vertexColors: true, flatShading: true }),
};

const compactAliveInPlace = <T extends { dead?: boolean }>(items: T[]) => {
  let writeIndex = 0;
  for (let readIndex = 0; readIndex < items.length; readIndex += 1) {
    const item = items[readIndex];
    if (item.dead) continue;
    items[writeIndex] = item;
    writeIndex += 1;
  }
  const removed = items.length - writeIndex;
  items.length = writeIndex;
  return removed;
};

const ACHIEVEMENT_LABELS: Record<string, string> = {
  first_clear: 'Mở Đường Đầu Tiên',
  asteroid_100: 'Thợ Mỏ 100 Thiên Thạch',
  powerup_25: 'Nhà Sưu Tập Năng Lượng',
  combo_10: 'Chuỗi Phân Rã ×10',
  stage_5: 'Nhà Thám Hiểm Màn 5',
  endless_5000: 'Huyền Thoại Vô Tận 5.000',
};
const BULLET_GEOMETRY = new THREE.CapsuleGeometry(1, 2.6, 4, 8);
const BULLET_TRAIL_GEOMETRY = new THREE.CapsuleGeometry(0.42, 3.4, 3, 6);
const ORBITER_GEOMETRY = new THREE.OctahedronGeometry(0.18, 0);
const PICKUP_COIN_GEOMETRY = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 18);
const PICKUP_POWER_GEOMETRY = new THREE.OctahedronGeometry(0.3, 0);
const BURST_DISC_GEOMETRY = new THREE.CircleGeometry(0.32, 12);
const BURST_RING_GEOMETRY = new THREE.RingGeometry(0.45, 0.56, 24);
const CRATER_GEOMETRY = new THREE.RingGeometry(0.5, 1, 10);
const CRYSTAL_CORE_GEOMETRY = new THREE.OctahedronGeometry(1, 0);
const WORMHOLE_TORUS_GEOMETRY = new THREE.TorusGeometry(1.4, 0.3, 14, 48);
const WORMHOLE_CORE_GEOMETRY = new THREE.CircleGeometry(1.12, 40);
const TITAN_BOW_WAVE_GEOMETRY = new THREE.PlaneGeometry(1.15, 0.11);
const BULLET_MATERIALS = new Map<string, THREE.MeshBasicMaterial>([
  '#55f6ff', '#b66cff', '#ffd84f', '#48ffbd', '#ff824d', '#55eaff', '#fbbf24', '#b98cff',
].map((color) => [color, new THREE.MeshBasicMaterial({ color, toneMapped: false })]));
const BULLET_TRAIL_MATERIALS = new Map<string, THREE.MeshBasicMaterial>([
  '#55f6ff', '#b66cff', '#ffd84f', '#48ffbd', '#ff824d', '#55eaff', '#fbbf24', '#b98cff',
].map((color) => [color, new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: 0.38, depthWrite: false })]));
const BULLET_INSTANCE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
const BULLET_TRAIL_INSTANCE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: true, opacity: 0.38, depthWrite: false });
const PICKUP_INSTANCE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false, transparent: true, opacity: 0.94 });
const BURST_INSTANCE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.88, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
const PICKUP_MATERIALS: Record<PickupEntity['kind'], THREE.MeshStandardMaterial> = {
  coin: new THREE.MeshStandardMaterial({ color: '#ffd447', emissive: '#bd7300', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
  heal: new THREE.MeshStandardMaterial({ color: '#4cff9d', emissive: '#175bd8', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
  slow: new THREE.MeshStandardMaterial({ color: '#55e6ff', emissive: '#175bd8', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
  orbiter: new THREE.MeshStandardMaterial({ color: '#c47aff', emissive: '#4c1d95', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
  attack_speed: new THREE.MeshStandardMaterial({ color: '#ff7a59', emissive: '#a52b16', emissiveIntensity: 2.4, metalness: 0.5, roughness: 0.25 }),
  move_speed: new THREE.MeshStandardMaterial({ color: '#48f0ff', emissive: '#087b9a', emissiveIntensity: 2.4, metalness: 0.5, roughness: 0.25 }),
  damage: new THREE.MeshStandardMaterial({ color: '#ff4db8', emissive: '#8d125c', emissiveIntensity: 2.4, metalness: 0.5, roughness: 0.25 }),
  blackhole: new THREE.MeshStandardMaterial({ color: '#44217a', emissive: '#16042f', emissiveIntensity: 2.8, metalness: 0.25, roughness: 0.4 }),
  phase: new THREE.MeshStandardMaterial({ color: '#9ffaff', emissive: '#2466d4', emissiveIntensity: 2.8, metalness: 0.35, roughness: 0.2 }),
  team: new THREE.MeshStandardMaterial({ color: '#ffd65a', emissive: '#b35b08', emissiveIntensity: 2.8, metalness: 0.6, roughness: 0.2 }),
  mid_wormhole: new THREE.MeshStandardMaterial({ color: '#9b65ff', emissive: '#4a18b5', emissiveIntensity: 3, metalness: 0.3, roughness: 0.2 }),
};
const ORBITER_MATERIALS = [
  new THREE.MeshStandardMaterial({ color: '#75f5ff', emissive: '#27bddd', emissiveIntensity: 2.5 }),
  new THREE.MeshStandardMaterial({ color: '#f8d35b', emissive: '#c78313', emissiveIntensity: 2.5 }),
];
const CRATER_MATERIAL = new THREE.MeshBasicMaterial({ color: '#171923', transparent: true, opacity: 0.58, depthWrite: false });
const CRYSTAL_CORE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#bb9cff', transparent: true, opacity: 0.34, toneMapped: false });
const WORMHOLE_TORUS_MATERIAL = new THREE.MeshStandardMaterial({ color: '#8a5cff', emissive: '#4c1dcb', emissiveIntensity: 4, toneMapped: false });
const WORMHOLE_CORE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#39e8ff', transparent: true, opacity: 0.42, depthWrite: false, toneMapped: false });
const TITAN_BOW_WAVE_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#ffc46b', transparent: true, opacity: 0.46, depthWrite: false,
  toneMapped: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
});
const localDateKey = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

const CameraSetup: React.FC = () => {
  const { camera, size } = useThree();
  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera;
    const halfWidth = 4.95;
    const halfHeight = halfWidth / Math.max(0.32, size.width / size.height);
    ortho.left = -halfWidth;
    ortho.right = halfWidth;
    ortho.top = halfHeight;
    ortho.bottom = -halfHeight;
    ortho.near = 0.1;
    ortho.far = 80;
    ortho.position.set(0, 13, 0);
    ortho.up.set(0, 0, -1);
    ortho.lookAt(0, 0, 0);
    ortho.updateProjectionMatrix();
  }, [camera, size.height, size.width]);
  return null;
};

const ParallaxStarLayer: React.FC<{
  count: number;
  speed: number;
  size: number;
  color: string;
  depth: number;
  playerX: React.MutableRefObject<{ x: number }>;
}> = ({ count, speed, size, color, depth, playerX }) => {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      data[index * 3] = (seededNoise(index * 2.17 + depth) - 0.5) * 13;
      data[index * 3 + 1] = depth;
      data[index * 3 + 2] = (seededNoise(index * 5.31 + depth * 7) - 0.5) * 28;
    }
    return data;
  }, [count, depth]);
  useFrame((_, delta) => {
    if (!points.current) return;
    const attribute = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let index = 0; index < count; index += 1) {
      const nextZ = attribute.getZ(index) + speed * delta;
      attribute.setZ(index, nextZ > 14 ? -14 : nextZ);
    }
    attribute.needsUpdate = true;
    points.current.position.x = -playerX.current.x * (0.02 + speed * 0.025);
  });
  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation={false} transparent opacity={0.92} depthWrite={false} toneMapped={false} />
    </points>
  );
};

const ParallaxStarfield: React.FC<{ playerX: React.MutableRefObject<{ x: number }>; quality: RunnerQuality }> = ({ playerX, quality }) => {
  const multiplier = quality === 'low' ? 0.58 : quality === 'medium' ? 0.8 : 1;
  return (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.2, -0.7, -2]} scale={[5.5, 8, 1]}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color="#173c79" transparent opacity={0.18} depthWrite={false} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.6, -0.68, 3]} scale={[4.5, 7, 1]}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color="#6d28a8" transparent opacity={0.14} depthWrite={false} />
    </mesh>
    <ParallaxStarLayer playerX={playerX} count={Math.round(110 * multiplier)} speed={0.42} size={1.25} color="#7898c9" depth={-0.62} />
    <ParallaxStarLayer playerX={playerX} count={Math.round(72 * multiplier)} speed={0.9} size={1.7} color="#d9ecff" depth={-0.42} />
    <ParallaxStarLayer playerX={playerX} count={Math.round(42 * multiplier)} speed={1.55} size={2.2} color="#a5f3fc" depth={-0.2} />
  </group>
  );
};

const FramePerformanceMonitor: React.FC<{ quality: RunnerQuality }> = ({ quality }) => {
  const { gl } = useThree();
  const sample = useRef({ frames: 0, elapsed: 0, longFrames: 0, longTasks: 0, maxFrameMs: 0, reduced: false });
  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return undefined;
    try {
      const observer = new PerformanceObserver((list) => {
        sample.current.longTasks += list.getEntries().length;
      });
      observer.observe({ entryTypes: ['longtask'] });
      return () => observer.disconnect();
    } catch {
      return undefined;
    }
  }, []);
  useFrame(({ clock }, delta) => {
    const current = sample.current;
    current.frames += 1;
    current.elapsed += delta;
    current.maxFrameMs = Math.max(current.maxFrameMs, delta * 1000);
    if (delta > 0.05) current.longFrames += 1;
    if (current.elapsed < 2) return;
    const fps = current.frames / current.elapsed;
    (window as Window & { __asteroidRunnerPerf?: unknown }).__asteroidRunnerPerf = {
      quality,
      fps: Math.round(fps),
      longFrames: current.longFrames,
      longTasks: current.longTasks,
      maxFrameMs: Math.round(current.maxFrameMs),
      pixelRatio: gl.getPixelRatio(),
      capturedAt: Date.now(),
    };
    if (!current.reduced && fps < 48 && clock.elapsedTime > 6 && gl.getPixelRatio() > 1) {
      gl.setPixelRatio(Math.max(1, gl.getPixelRatio() - 0.2));
      current.reduced = true;
    }
    current.frames = 0;
    current.elapsed = 0;
    current.longFrames = 0;
    current.longTasks = 0;
    current.maxFrameMs = 0;
  });
  return null;
};

const SceneAssetPrewarmer: React.FC = () => (
  <group position={[0, -4, 0]} scale={0.001} dispose={null}>
    {(['rock', 'hard', 'silver', 'gold', 'platinum', 'diamond'] as AsteroidMaterial[]).map((kind, index) => (
      <mesh key={kind} geometry={ASTEROID_GEOMETRIES[index % ASTEROID_GEOMETRIES.length]} material={ASTEROID_MATERIALS[kind]} />
    ))}
    {[...BULLET_MATERIALS.values()].map((material) => <mesh key={material.uuid} geometry={BULLET_GEOMETRY} material={material} />)}
    {[...BULLET_TRAIL_MATERIALS.values()].map((material) => <mesh key={material.uuid} geometry={BULLET_TRAIL_GEOMETRY} material={material} />)}
    {Object.values(PICKUP_MATERIALS).map((material, index) => <mesh key={material.uuid} geometry={index === 0 ? PICKUP_COIN_GEOMETRY : PICKUP_POWER_GEOMETRY} material={material} />)}
    {ORBITER_MATERIALS.map((material) => <mesh key={material.uuid} geometry={ORBITER_GEOMETRY} material={material} />)}
    <mesh geometry={CRATER_GEOMETRY} material={CRATER_MATERIAL} />
    <mesh geometry={CRYSTAL_CORE_GEOMETRY} material={CRYSTAL_CORE_MATERIAL} />
    <mesh geometry={WORMHOLE_TORUS_GEOMETRY} material={WORMHOLE_TORUS_MATERIAL} />
    <mesh geometry={WORMHOLE_CORE_GEOMETRY} material={WORMHOLE_CORE_MATERIAL} />
    <mesh geometry={TITAN_BOW_WAVE_GEOMETRY} material={TITAN_BOW_WAVE_MATERIAL} />
    <mesh geometry={BURST_RING_GEOMETRY}><meshBasicMaterial transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>
    <mesh geometry={BURST_DISC_GEOMETRY}><meshBasicMaterial transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} /></mesh>
  </group>
);

const LobbyShipPreview: React.FC<{ ship: RunnerShipConfig; color: string }> = ({ ship, color }) => (
  <Canvas
    orthographic
    dpr={[1, 1.5]}
    camera={{ position: [0, 5, 4], zoom: 58, near: 0.1, far: 50 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  >
    <ambientLight intensity={1.7} />
    <directionalLight position={[3, 5, 4]} intensity={3} color="#dff8ff" />
    <pointLight position={[-3, 1, 2]} intensity={8} color="#8b5cf6" distance={10} />
    <group rotation={[-0.7, 0, 0]} position={[0, -0.05, 0]}>
      <AerodynamicShipRenderer shipId={ship.id} shipColor={color} showStreamlines thrustPower={0.9} scale={1.05} />
    </group>
    <Stars radius={24} depth={16} count={420} factor={2.5} saturation={0.9} fade speed={0.6} />
  </Canvas>
);

const PlayerModel: React.FC<{
  ship: RunnerShipConfig;
  color: string;
  input: React.MutableRefObject<InputState>;
  simPosition: React.MutableRefObject<{ x: number; y: number; vx: number; vy: number; invulnerable: number }>;
  visible: boolean;
  orbiterCount: number;
  orbiterPositions: React.MutableRefObject<Array<{ x: number; y: number }>>;
  phaseActive: boolean;
}> = ({ ship, color, input, simPosition, visible, orbiterCount, orbiterPositions, phaseActive }) => {
  const group = useRef<THREE.Group>(null);
  const leftOrbiter = useRef<THREE.Group>(null);
  const rightOrbiter = useRef<THREE.Group>(null);
  useEffect(() => {
    const root = group.current;
    if (!root) return;
    root.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        const savedOpacity = material.userData.runnerOriginalOpacity ?? material.opacity;
        material.userData.runnerOriginalOpacity = savedOpacity;
        material.transparent = phaseActive || savedOpacity < 1;
        material.opacity = phaseActive ? Math.min(0.48, savedOpacity) : savedOpacity;
        material.needsUpdate = true;
      });
    });
  }, [phaseActive]);
  useFrame(({ clock }) => {
    const current = simPosition.current;
    if (group.current) {
      group.current.position.set(current.x, 0.34, -current.y);
      const targetRoll = clamp(-current.vx * 0.14, -Math.PI / 4, Math.PI / 4);
      const targetPitch = clamp(current.vy * 0.11, -Math.PI / 6, Math.PI / 6);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRoll, 0.18);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetPitch, 0.18);
      const flicker = current.invulnerable > 0 && Math.floor(clock.elapsedTime * 16) % 2 === 0;
      group.current.visible = visible && !flicker;
    }
    const orbit = clock.elapsedTime * 2.5;
    [leftOrbiter.current, rightOrbiter.current].forEach((node, index) => {
      const side = index === 0 ? -1 : 1;
      const orbiterX = current.x + side * (0.9 + Math.sin(orbit) * 0.08);
      const orbiterY = current.y - 0.45 - Math.cos(orbit) * 0.12;
      orbiterPositions.current[index] = { x: orbiterX, y: orbiterY };
      if (!node) return;
      node.position.set(orbiterX, 0.42, -orbiterY);
    });
    if (!input.current.pointerActive && input.current.keys.size === 0 && group.current) {
      group.current.position.y += Math.sin(clock.elapsedTime * 4) * 0.025;
    }
  });
  return (
    <>
      <group ref={group} scale={RUNNER_BALANCE.playerVisualScale}>
        <AerodynamicShipRenderer shipId={ship.id} shipColor={color} thrustPower={1} scale={1} />
        <pointLight position={[0, 0.25, 1.1]} intensity={4} color={color} distance={3.5} />
      </group>
      {orbiterCount >= 1 && <group ref={leftOrbiter}>
        <mesh geometry={ORBITER_GEOMETRY} material={ORBITER_MATERIALS[0]} dispose={null} />
      </group>}
      {orbiterCount >= 2 && <group ref={rightOrbiter}>
        <mesh geometry={ORBITER_GEOMETRY} material={ORBITER_MATERIALS[1]} dispose={null} />
      </group>}
    </>
  );
};

const detectRunnerQuality = (): RunnerQuality => {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const mobileSafari = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (memory <= 3 || cores <= 4 || (mobileSafari && window.innerWidth <= 375)) return 'low';
  if (memory >= 8 && cores >= 8 && window.devicePixelRatio <= 2) return 'high';
  return 'medium';
};

const ActiveRunEffects: React.FC<{
  player: React.MutableRefObject<{ x: number; y: number }>;
  effects: React.MutableRefObject<{ phase: number; blackhole: number; team: number }>;
  supportShips: [RunnerShipConfig, RunnerShipConfig];
}> = ({ player, effects, supportShips }) => {
  const phaseHalo = useRef<THREE.Group>(null);
  const blackhole = useRef<THREE.Group>(null);
  const supportLeft = useRef<THREE.Group>(null);
  const supportRight = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    const phaseActive = effects.current.phase > 0;
    const blackholeActive = effects.current.blackhole > 0;
    const teamActive = effects.current.team > 0;
    if (phaseHalo.current) {
      phaseHalo.current.position.set(player.current.x, 0.22, -player.current.y);
      const scale = phaseActive ? 0.92 + Math.sin(clock.elapsedTime * 7) * 0.08 : 0.001;
      phaseHalo.current.scale.setScalar(scale);
      phaseHalo.current.rotation.y += delta * 1.8;
    }
    if (blackhole.current) {
      const scale = blackholeActive ? 1 + Math.sin(clock.elapsedTime * 4) * 0.09 : 0.001;
      blackhole.current.scale.setScalar(scale);
      blackhole.current.rotation.y += delta * 2.4;
    }
    [supportLeft.current, supportRight.current].forEach((node, index) => {
      if (!node) return;
      const side = index === 0 ? -1 : 1;
      node.position.set(player.current.x + side * 1.22, 0.28, -player.current.y + 0.7 + Math.sin(clock.elapsedTime * 4 + index) * 0.08);
      const targetScale = teamActive ? 0.42 : 0.001;
      node.scale.setScalar(THREE.MathUtils.lerp(node.scale.x, targetScale, 0.16));
    });
  });
  return (
    <>
      <group ref={phaseHalo} scale={0.001}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.08, 8, 36]} />
          <meshBasicMaterial color="#8ff7ff" transparent opacity={0.58} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <group ref={blackhole} position={[0, 0.12, -4.7]} scale={0.001}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.28, 12, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.74} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.05, 40]} />
          <meshBasicMaterial color="#03020a" toneMapped={false} />
        </mesh>
      </group>
      <group ref={supportLeft} scale={0.001}><AerodynamicShipRenderer shipId={supportShips[0].id} shipColor="#7de7ff" thrustPower={0.9} scale={1} /></group>
      <group ref={supportRight} scale={0.001}><AerodynamicShipRenderer shipId={supportShips[1].id} shipColor="#ffd65a" thrustPower={0.9} scale={1} /></group>
    </>
  );
};

const Wormhole: React.FC<{ visible: boolean; x: number; y: number }> = ({ visible, x, y }) => {
  const root = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    root.current.rotation.y += delta * 1.8;
    root.current.rotation.z -= delta * 0.8;
    const pulse = 1 + Math.sin(clock.elapsedTime * 5) * 0.08;
    root.current.scale.setScalar(pulse);
  });
  if (!visible) return null;
  return (
    <group ref={root} position={[x, 0.15, -y]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={WORMHOLE_TORUS_GEOMETRY} attach="geometry" />
        <primitive object={WORMHOLE_TORUS_MATERIAL} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={WORMHOLE_CORE_GEOMETRY} attach="geometry" />
        <primitive object={WORMHOLE_CORE_MATERIAL} attach="material" />
      </mesh>
    </group>
  );
};

interface RunnerSceneProps {
  runKey: number;
  phase: RunnerPhase;
  ship: RunnerShipConfig;
  shipColor: string;
  input: React.MutableRefObject<InputState>;
  continueToken: number;
  runMode: RunnerMode;
  stage: number;
  quality: RunnerQuality;
  onHud: (hud: HudState) => void;
  onBossStarted: () => void;
  onWormholeStarted: () => void;
  onGameOver: (snapshot: RunSnapshot) => void;
  onVictory: (snapshot: RunSnapshot) => void;
  onFeedback: (kind: 'hit' | 'power' | 'danger' | 'boss', message?: string) => void;
  debugFast?: boolean;
}

const RunnerScene: React.FC<RunnerSceneProps> = ({
  runKey,
  phase,
  ship,
  shipColor,
  input,
  continueToken,
  runMode,
  stage,
  quality,
  onHud,
  onBossStarted,
  onWormholeStarted,
  onGameOver,
  onVictory,
  onFeedback,
  debugFast = false,
}) => {
  const [, setEntityVersion] = useState(0);
  const bulletInstances = useRef<THREE.InstancedMesh>(null);
  const bulletTrailInstances = useRef<THREE.InstancedMesh>(null);
  const asteroidRefs = useRef(new Map<number, THREE.Group>());
  const coinInstances = useRef<THREE.InstancedMesh>(null);
  const powerupInstances = useRef<THREE.InstancedMesh>(null);
  const burstDiscInstances = useRef<THREE.InstancedMesh>(null);
  const burstRingInstances = useRef<THREE.InstancedMesh>(null);
  const resupplyRefs = useRef(new Map<number, THREE.Group>());
  const instanceDummy = useMemo(() => new THREE.Object3D(), []);
  const instanceColor = useMemo(() => new THREE.Color(), []);
  const playerPosition = useRef({ x: 0, y: -5.6, vx: 0, vy: 0, invulnerable: 0 });
  const orbiterPositions = useRef([{ x: -0.9, y: -6.05 }, { x: 0.9, y: -6.05 }]);
  const effectState = useRef({ phase: 0, blackhole: 0, team: 0 });
  const supportShips = useMemo<[RunnerShipConfig, RunnerShipConfig]>(() => {
    const candidates = RUNNER_SHIPS.filter((candidate) => candidate.totalPower >= ship.totalPower);
    const pool = candidates.length > 0 ? candidates : [ship];
    const first = pool[runKey % pool.length] || ship;
    const second = pool[(runKey + Math.max(1, Math.floor(pool.length / 2))) % pool.length] || first;
    return [first, second];
  }, [runKey, ship]);
  const stageDuration = debugFast ? 4 : RUNNER_BALANCE.stageDurationSeconds;
  const bossEntryDuration = debugFast ? 0.45 : RUNNER_BALANCE.bossEntrySeconds;
  const wormholeTimeout = debugFast ? 1.25 : RUNNER_BALANCE.wormholeTimeoutSeconds;

  useEffect(() => {
    [bulletInstances.current, bulletTrailInstances.current, coinInstances.current, powerupInstances.current, burstDiscInstances.current, burstRingInstances.current].forEach((mesh) => {
      if (!mesh) return;
      mesh.count = 0;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    });
  }, []);
  const simRef = useRef({
    id: 0,
    elapsed: 0,
    spawnClock: 0,
    fireClock: 0,
    hudClock: 0,
    bossEntry: 0,
    wormholeClock: 0,
    wormholeX: 0,
    wormholeY: 4.2,
    hp: ship.shield,
    maxHp: ship.shield,
    score: 0,
    coins: 0,
    combo: 0,
    comboClock: 0,
    orbiterCount: 0,
    slowTime: 0,
    attackSpeedStacks: 0,
    moveSpeedStacks: 0,
    damageStacks: 0,
    blackholeTime: 0,
    phaseTime: 0,
    teamTime: 0,
    asteroidsDestroyed: 0,
    powerupsCollected: 0,
    maxCombo: 0,
    resupplyClock: debugFast ? 1.6 : THREE.MathUtils.randFloat(30, 210),
    mode: 'playing' as LivePhase,
    bossId: null as number | null,
    bullets: [] as BulletEntity[],
    asteroids: [] as AsteroidEntity[],
    pickups: [] as PickupEntity[],
    bursts: [] as BurstEntity[],
    resupplies: [] as ResupplyEntity[],
  });

  const bumpEntities = useCallback(() => setEntityVersion((value) => value + 1), []);

  useEffect(() => {
    simRef.current = {
      id: 0, elapsed: 0, spawnClock: 0, fireClock: 0, hudClock: 0, bossEntry: 0, wormholeClock: 0, wormholeX: 0, wormholeY: 4.2,
      hp: ship.shield, maxHp: ship.shield, score: 0, coins: 0, combo: 0, comboClock: 0,
      orbiterCount: 0, slowTime: 0, attackSpeedStacks: 0, moveSpeedStacks: 0, damageStacks: 0,
      blackholeTime: 0, phaseTime: 0, teamTime: 0, resupplyClock: debugFast ? 1.6 : THREE.MathUtils.randFloat(30, 210),
      asteroidsDestroyed: 0, powerupsCollected: 0, maxCombo: 0,
      mode: 'playing', bossId: null, bullets: [], asteroids: [], pickups: [], bursts: [], resupplies: [],
    };
    playerPosition.current = { x: 0, y: -5.6, vx: 0, vy: 0, invulnerable: debugFast ? 999 : 1.2 };
    input.current.targetX = 0;
    input.current.targetY = -5.6;
    bumpEntities();
  }, [bumpEntities, debugFast, input, runKey, ship.shield]);

  useEffect(() => {
    if (continueToken <= 0) return;
    const sim = simRef.current;
    sim.hp = sim.maxHp;
    playerPosition.current.invulnerable = 3;
    onFeedback('power', 'LÁ CHẮN KHỞI ĐỘNG!');
  }, [continueToken, onFeedback]);

  const addBurst = useCallback((x: number, y: number, color: string, size = 1, ring = false) => {
    const sim = simRef.current;
    if (sim.bursts.length >= RUNNER_BALANCE.maxBursts) sim.bursts.shift();
    sim.bursts.push({ id: ++sim.id, x, y, color, life: ring ? 0.55 : 0.38, maxLife: ring ? 0.55 : 0.38, size, ring });
  }, []);

  const addPickup = useCallback((x: number, y: number, kind: PickupEntity['kind'], value: number) => {
    const sim = simRef.current;
    if (sim.pickups.filter((item) => !item.dead).length >= 64) return;
    sim.pickups.push({ id: ++sim.id, x, y, vy: -1.25, kind, value });
  }, []);

  const createAsteroid = useCallback((tier: AsteroidTier, x: number, y: number, material?: AsteroidMaterial, vx = 0) => {
    const sim = simRef.current;
    if (tier !== 'titan' && sim.asteroids.filter((item) => !item.dead).length >= RUNNER_BALANCE.maxAsteroids) return null;
    const materialRoll = Math.random();
    const rolledMaterial: AsteroidMaterial = materialRoll < 0.42 ? 'rock'
      : materialRoll < 0.67 ? 'hard'
      : materialRoll < 0.81 ? 'silver'
      : materialRoll < 0.9 ? 'gold'
      : materialRoll < 0.96 ? 'platinum'
      : 'diamond';
    const chosenMaterial = material || rolledMaterial;
    const base = ASTEROID_STATS[tier];
    const materialInfo = MATERIAL_STATS[chosenMaterial];
    const maxHp = tier === 'titan' ? (debugFast ? 120 : RUNNER_BALANCE.bossHp) : Math.round(materialInfo.baseHp * base.hpFactor);
    const asteroid: AsteroidEntity = {
      id: ++sim.id,
      x,
      y,
      vx,
      vy: tier === 'titan' ? -base.speed : -(base.speed * (0.9 + Math.random() * 0.28)),
      radius: base.radius,
      hp: maxHp,
      maxHp,
      tier,
      material: chosenMaterial,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 1.3,
      seed: Math.random(),
    };
    sim.asteroids.push(asteroid);
    return asteroid;
  }, [debugFast]);

  const destroyAsteroid = useCallback((asteroid: AsteroidEntity) => {
    if (asteroid.dead) return;
    asteroid.dead = true;
    const sim = simRef.current;
    const material = MATERIAL_STATS[asteroid.material];
    addBurst(asteroid.x, asteroid.y, material.color, asteroid.radius * 1.45, true);
    addBurst(asteroid.x - asteroid.radius * 0.25, asteroid.y + 0.1, '#f8fdff', asteroid.radius * 0.75);
    const dustCount = quality === 'low' ? 2 : quality === 'medium' ? 4 : 6;
    for (let index = 0; index < dustCount; index += 1) {
      const angle = seededNoise(asteroid.seed * 97 + index * 11) * Math.PI * 2;
      const distance = asteroid.radius * (0.18 + seededNoise(index * 19 + asteroid.seed) * 0.65);
      addBurst(
        asteroid.x + Math.cos(angle) * distance,
        asteroid.y + Math.sin(angle) * distance,
        index % 2 === 0 ? material.color : '#e7f7ff',
        asteroid.radius * (0.16 + seededNoise(index * 31) * 0.2),
      );
    }
    soundService.playGameExplosion(asteroid.radius);
    sim.score += Math.round(asteroid.maxHp * 1.6) + sim.combo * 4;
    sim.combo = Math.min(12, sim.combo + 1);
    sim.maxCombo = Math.max(sim.maxCombo, sim.combo);
    sim.asteroidsDestroyed += 1;
    sim.comboClock = 2.4;

    if (asteroid.tier === 'titan') {
      sim.coins += ASTEROID_STATS.titan.coins;
      sim.mode = 'wormhole';
      sim.wormholeClock = 0;
      sim.wormholeX = asteroid.x;
      sim.wormholeY = asteroid.y;
      soundService.playWormhole();
      onWormholeStarted();
      onFeedback('power', 'CỔNG CHIẾN THẮNG ĐÃ MỞ!');
      bumpEntities();
      return;
    }

    const materialBonus: Record<AsteroidMaterial, number> = { rock: 0, hard: 0, silver: 1, gold: 1, platinum: 2, diamond: 3 };
    const baseCoins = ASTEROID_STATS[asteroid.tier].coins + materialBonus[asteroid.material];
    if (baseCoins > 0) addPickup(asteroid.x, asteroid.y, 'coin', baseCoins);
    const dropRoll = asteroid.tier === 'debris' ? 1 : Math.random();
    if (asteroid.tier === 'huge' && sim.mode === 'playing' && sim.elapsed < stageDuration * 0.78 && dropRoll < 0.22) {
      addPickup(asteroid.x, asteroid.y, 'mid_wormhole', 0.2);
    } else if (dropRoll < 0.025) {
      const healRoll = Math.random();
      addPickup(asteroid.x + 0.3, asteroid.y, 'heal', healRoll < 0.6 ? 0.2 : healRoll < 0.9 ? 0.5 : 1);
    } else if (dropRoll < 0.045) addPickup(asteroid.x - 0.3, asteroid.y, 'slow', 10);
    else if (dropRoll < 0.062 && sim.orbiterCount < 2) addPickup(asteroid.x, asteroid.y, 'orbiter', 1);
    else if (dropRoll < 0.078) addPickup(asteroid.x, asteroid.y, 'attack_speed', 1);
    else if (dropRoll < 0.094) addPickup(asteroid.x, asteroid.y, 'move_speed', 1);
    else if (dropRoll < 0.11) addPickup(asteroid.x, asteroid.y, 'damage', 1);
    else if (dropRoll < 0.12) addPickup(asteroid.x, asteroid.y, 'blackhole', 6);
    else if (dropRoll < 0.13) addPickup(asteroid.x, asteroid.y, 'phase', 10);
    else if (dropRoll < 0.14) addPickup(asteroid.x, asteroid.y, 'team', 15);

    if (asteroid.tier === 'huge') {
      createAsteroid('large', asteroid.x - 0.36, asteroid.y, asteroid.material, -0.75);
      createAsteroid('large', asteroid.x + 0.36, asteroid.y, asteroid.material, 0.75);
    } else if (asteroid.tier === 'large') {
      createAsteroid('medium', asteroid.x - 0.28, asteroid.y, asteroid.material, -0.9);
      createAsteroid('medium', asteroid.x + 0.28, asteroid.y, asteroid.material, 0.9);
    } else if (asteroid.tier === 'medium') {
      createAsteroid('small', asteroid.x - 0.18, asteroid.y, asteroid.material, -1.15);
      createAsteroid('small', asteroid.x + 0.18, asteroid.y, asteroid.material, 1.15);
    } else if (asteroid.tier === 'small') {
      const fragments = Math.random() < 0.5 ? 2 : 3;
      for (let index = 0; index < fragments; index += 1) {
        const spread = fragments === 2 ? index * 2 - 1 : index - 1;
        createAsteroid('debris', asteroid.x + spread * 0.12, asteroid.y, asteroid.material, spread * 1.35);
      }
    }
    bumpEntities();
  }, [addBurst, addPickup, bumpEntities, createAsteroid, onFeedback, onWormholeStarted, quality, stageDuration]);

  const fireWeapon = useCallback(() => {
    const sim = simRef.current;
    if (sim.bullets.length >= RUNNER_BALANCE.maxBullets) return;
    const player = playerPosition.current;
    const weapon = ship.weapon;
    const damage = weapon.damage * getDamageMultiplier(ship) * (1 + sim.damageStacks * 0.1);
    const add = (offsetX: number, angle = 0, damageScale = 1, radius = 0.12, origin?: { x: number; y: number }, fromOrbiter = false) => {
      const speed = weapon.projectileSpeed;
      const startY = (origin?.y ?? player.y) + (origin ? 0.18 : 0.9);
      sim.bullets.push({
        id: ++sim.id,
        x: (origin?.x ?? player.x) + offsetX,
        y: startY,
        vx: Math.sin(angle) * speed,
        vy: Math.cos(angle) * speed,
        radius,
        damage: damage * damageScale,
        color: weapon.color,
        aoe: weapon.aoe * (fromOrbiter ? 0.5 : 1),
        ttl: 1.6,
        kind: weapon.kind,
        piercingRemaining: weapon.piercing || 0,
        hitIds: [],
        homingStrength: weapon.homingStrength || 0,
        autoDetonateY: weapon.autoDetonateDistance ? startY + weapon.autoDetonateDistance : undefined,
        trail: weapon.kind === 'missile' || weapon.kind === 'homing',
        fromOrbiter,
      });
    };

    if (weapon.kind === 'twin') {
      add(-0.38); add(0.38);
    } else if (weapon.kind === 'piercing') {
      add(0, 0, 1, 0.1);
    } else if (weapon.kind === 'charge') {
      add(0, 0, 1, 0.3);
    } else if (weapon.kind === 'spread') {
      add(0, -0.25); add(0, 0); add(0, 0.25);
    } else if (weapon.kind === 'cluster') {
      add(0, 0, 1, 0.22);
    } else if (weapon.kind === 'missile') {
      add(0, 0, 1, 0.17);
    } else {
      add(0);
    }

    if (sim.orbiterCount >= 1) add(0, 0, 0.5, 0.09, orbiterPositions.current[0], true);
    if (sim.orbiterCount >= 2) add(0, 0, 0.5, 0.09, orbiterPositions.current[1], true);
    if (sim.teamTime > 0) {
      add(-1.22, -0.04, 1, 0.1, { x: player.x, y: player.y - 0.7 });
      add(1.22, 0.04, 1, 0.1, { x: player.x, y: player.y - 0.7 });
    }
    soundService.playGameShot(weapon.kind);
  }, [ship]);

  const publishHud = useCallback(() => {
    const sim = simRef.current;
    const boss = sim.bossId === null ? undefined : sim.asteroids.find((item) => item.id === sim.bossId);
    onHud({
      hp: Math.max(0, Math.round(sim.hp)),
      maxHp: sim.maxHp,
      score: Math.floor(sim.score),
      coins: sim.coins,
      progress: runMode === 'endless'
        ? (sim.elapsed % 60) / 60
        : sim.mode === 'playing' ? clamp(sim.elapsed / stageDuration, 0, 1) : 1,
      combo: sim.combo,
      orbiterCount: sim.orbiterCount,
      slowSeconds: Math.ceil(sim.slowTime),
      attackSpeedStacks: sim.attackSpeedStacks,
      moveSpeedStacks: sim.moveSpeedStacks,
      damageStacks: sim.damageStacks,
      blackholeSeconds: Math.ceil(sim.blackholeTime),
      phaseSeconds: Math.ceil(sim.phaseTime),
      teamSeconds: Math.ceil(sim.teamTime),
      asteroidsDestroyed: sim.asteroidsDestroyed,
      powerupsCollected: sim.powerupsCollected,
      maxCombo: sim.maxCombo,
      survivalSeconds: Math.floor(sim.elapsed),
      bossHp: boss ? Math.max(0, Math.ceil(boss.hp)) : 0,
      bossMaxHp: boss?.maxHp || RUNNER_BALANCE.bossHp,
    });
  }, [onHud, runMode, stageDuration]);

  useFrame((_, rawDelta) => {
    const active = phase === 'playing' || phase === 'boss' || phase === 'wormhole';
    if (!active) return;
    const dt = debugFast ? 0.12 : Math.min(rawDelta, 1 / 30);
    const sim = simRef.current;
    const player = playerPosition.current;
    const entitySlow = sim.slowTime > 0 ? 0.5 : 1;
    const lowHpAssist = sim.hp / sim.maxHp < RUNNER_BALANCE.lowHpAssistThreshold;
    effectState.current.phase = sim.phaseTime;
    effectState.current.blackhole = sim.blackholeTime;
    effectState.current.team = sim.teamTime;
    let entitiesChanged = false;

    if (player.invulnerable > 0) player.invulnerable -= dt;
    if (sim.slowTime > 0) sim.slowTime -= dt;
    if (sim.blackholeTime > 0) sim.blackholeTime -= dt;
    if (sim.phaseTime > 0) sim.phaseTime -= dt;
    if (sim.teamTime > 0) sim.teamTime -= dt;
    sim.comboClock -= dt;
    if (sim.comboClock <= 0 && sim.combo > 0) sim.combo = 0;

    const keys = input.current.keys;
    const axisX = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
    const axisY = (keys.has('ArrowUp') || keys.has('KeyW') ? 1 : 0) - (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0);
    if (axisX || axisY) {
      const keySpeed = getMoveSpeed(ship) * (1 + sim.moveSpeedStacks * 0.15);
      input.current.targetX = clamp(input.current.targetX + axisX * keySpeed * dt, -RUNNER_BALANCE.worldHalfWidth + 0.65, RUNNER_BALANCE.worldHalfWidth - 0.65);
      input.current.targetY = clamp(input.current.targetY + axisY * keySpeed * dt, RUNNER_BALANCE.worldBottom + 1.15, 4.15);
    }
    const response = 1 - Math.exp(-getResponsiveness(ship) * (1 + sim.moveSpeedStacks * 0.15) * dt);
    const nextX = THREE.MathUtils.lerp(player.x, input.current.targetX, response);
    const nextY = THREE.MathUtils.lerp(player.y, input.current.targetY, response);
    player.vx = (nextX - player.x) / Math.max(dt, 0.001);
    player.vy = (nextY - player.y) / Math.max(dt, 0.001);
    player.x = nextX;
    player.y = nextY;

    sim.fireClock -= dt;
    const wantsFire = input.current.pointerActive || keys.has('Space');
    if (wantsFire && sim.fireClock <= 0 && sim.mode !== 'wormhole') {
      fireWeapon();
      sim.fireClock = ship.weapon.fireInterval / (1 + sim.attackSpeedStacks * 0.2);
    }

    if (sim.mode === 'playing') {
      sim.elapsed += dt;
      sim.spawnClock -= dt;
      sim.resupplyClock -= dt;
      const progress = clamp(sim.elapsed / stageDuration, 0, 1);
      const baseInterval = THREE.MathUtils.lerp(0.92, 0.47, progress);
      if (sim.spawnClock <= 0 && sim.asteroids.length < RUNNER_BALANCE.maxAsteroids) {
        const tierRoll = Math.random();
        const tier: AsteroidTier = progress > 0.72 && tierRoll < 0.08
          ? 'huge'
          : progress > 0.42 && tierRoll < 0.2
            ? 'large'
            : tierRoll < 0.52 ? 'medium' : 'small';
        const radius = ASTEROID_STATS[tier].radius;
        createAsteroid(tier, THREE.MathUtils.randFloat(-RUNNER_BALANCE.worldHalfWidth + radius, RUNNER_BALANCE.worldHalfWidth - radius), RUNNER_BALANCE.worldTop + 1.4);
        sim.spawnClock = baseInterval * (lowHpAssist ? 1.28 : 1) * THREE.MathUtils.randFloat(0.82, 1.18);
        entitiesChanged = true;
      }
      if (sim.resupplyClock <= 0 && !sim.resupplies.some((item) => !item.dead)) {
        sim.resupplies.push({ id: ++sim.id, x: -6.2, y: 2.6, vx: 2.25, dropped: false });
        sim.resupplyClock = THREE.MathUtils.randFloat(30, 210);
        onFeedback('power', 'TÀU TIẾP TẾ ĐANG ĐẾN!');
        entitiesChanged = true;
      }
      if (runMode === 'stage' && sim.elapsed >= stageDuration) {
        sim.mode = 'boss';
        sim.bossEntry = 0;
        soundService.playBossAlarmSiren();
        onFeedback('boss', `THIÊN THẠCH CỔ ĐẠI · MÀN ${stage}!`);
        onBossStarted();
      }
    } else if (sim.mode === 'boss' && sim.bossId === null) {
      sim.bossEntry += dt;
      if (sim.bossEntry >= bossEntryDuration) {
        const boss = createAsteroid('titan', 0, RUNNER_BALANCE.worldTop + ASTEROID_STATS.titan.radius + 0.8, 'diamond');
        if (boss) {
          sim.bossId = boss.id;
          entitiesChanged = true;
        }
      }
    }

    if (sim.mode === 'wormhole') {
      // Headless WebKit heavily throttles rAF; debug mode advances by frame so
      // E2E can verify the terminal flow without changing production timing.
      sim.wormholeClock += debugFast ? 0.5 : dt;
      input.current.targetX = THREE.MathUtils.lerp(input.current.targetX, sim.wormholeX, dt * 0.8);
      input.current.targetY = THREE.MathUtils.lerp(input.current.targetY, sim.wormholeY, dt * 0.55);
      if (distanceSquared(player.x, player.y, sim.wormholeX, sim.wormholeY) < 1.45 ** 2 || sim.wormholeClock >= wormholeTimeout) {
        const snapshot: RunSnapshot = {
          hp: sim.hp, maxHp: sim.maxHp, score: sim.score, coins: sim.coins, progress: 1,
          combo: sim.combo, orbiterCount: sim.orbiterCount, slowSeconds: sim.slowTime,
          attackSpeedStacks: sim.attackSpeedStacks, moveSpeedStacks: sim.moveSpeedStacks, damageStacks: sim.damageStacks,
          blackholeSeconds: sim.blackholeTime, phaseSeconds: sim.phaseTime, teamSeconds: sim.teamTime,
          asteroidsDestroyed: sim.asteroidsDestroyed, powerupsCollected: sim.powerupsCollected,
          maxCombo: sim.maxCombo, survivalSeconds: Math.floor(sim.elapsed),
          bossHp: 0, bossMaxHp: RUNNER_BALANCE.bossHp, mode: 'wormhole',
        };
        onVictory(snapshot);
        return;
      }
    }

    const detonateBullet = (bullet: BulletEntity, x: number, y: number, directHitId?: number) => {
      if (bullet.aoe <= 0) return;
      sim.asteroids.forEach((nearby) => {
        if (nearby.dead || nearby.id === directHitId) return;
        if (distanceSquared(x, y, nearby.x, nearby.y) <= (bullet.aoe + nearby.radius) ** 2) {
          nearby.hp -= bullet.damage * (directHitId === undefined ? 0.72 : 0.55);
          if (nearby.hp <= 0) destroyAsteroid(nearby);
        }
      });
      addBurst(x, y, bullet.color, bullet.aoe, true);
      soundService.playGameExplosion(Math.max(0.45, bullet.aoe));
    };

    sim.bullets.forEach((bullet) => {
      if (bullet.homingStrength > 0) {
        let target: AsteroidEntity | undefined;
        let targetDistance = Number.POSITIVE_INFINITY;
        sim.asteroids.forEach((candidate) => {
          if (candidate.dead || candidate.y < bullet.y - 0.4) return;
          const distance = distanceSquared(bullet.x, bullet.y, candidate.x, candidate.y);
          if (distance < targetDistance) {
            target = candidate;
            targetDistance = distance;
          }
        });
        if (target) {
          const dx = target.x - bullet.x;
          const dy = target.y - bullet.y;
          const length = Math.max(0.001, Math.hypot(dx, dy));
          const speed = Math.max(0.1, Math.hypot(bullet.vx, bullet.vy));
          const turn = 1 - Math.exp(-bullet.homingStrength * dt);
          bullet.vx = THREE.MathUtils.lerp(bullet.vx, dx / length * speed, turn);
          bullet.vy = THREE.MathUtils.lerp(bullet.vy, dy / length * speed, turn);
        }
      }
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.ttl -= dt;
      if (!bullet.dead && bullet.autoDetonateY !== undefined && bullet.y >= bullet.autoDetonateY) {
        bullet.dead = true;
        detonateBullet(bullet, bullet.x, bullet.y);
      }
      if (bullet.ttl <= 0 || bullet.y > RUNNER_BALANCE.worldTop + 2 || Math.abs(bullet.x) > RUNNER_BALANCE.worldHalfWidth + 2) bullet.dead = true;
    });

    sim.asteroids.forEach((asteroid) => {
      if (asteroid.dead) return;
      if (debugFast && asteroid.tier === 'titan') {
        asteroid.hp -= 30;
        if (asteroid.hp <= 0) {
          destroyAsteroid(asteroid);
          return;
        }
      }
      asteroid.x += asteroid.vx * dt * entitySlow;
      asteroid.y += asteroid.vy * dt * entitySlow * (lowHpAssist && asteroid.tier !== 'titan' ? 0.84 : 1);
      asteroid.rotation += asteroid.spin * dt;
      if (asteroid.tier === 'titan') {
        asteroid.x = Math.sin((sim.elapsed + sim.bossEntry) * 0.42) * 0.22;
        sim.bossEntry += dt;
      } else if (asteroid.y < RUNNER_BALANCE.worldBottom - 2.2) {
        asteroid.dead = true;
      }
    });

    if (sim.blackholeTime > 0) {
      sim.asteroids.forEach((asteroid) => {
        if (!asteroid.dead && asteroid.tier !== 'titan' && asteroid.y > 0.8) destroyAsteroid(asteroid);
      });
    }

    sim.resupplies.forEach((resupply) => {
      if (resupply.dead) return;
      resupply.x += resupply.vx * dt;
      if (!resupply.dropped && resupply.x >= -0.4) {
        resupply.dropped = true;
        addPickup(resupply.x - 0.4, resupply.y - 0.2, 'heal', 0.5);
        addPickup(resupply.x, resupply.y - 0.35, 'attack_speed', 1);
        const supportDrop: RunnerPowerUp = Math.random() < 0.5 ? 'damage' : 'team';
        addPickup(resupply.x + 0.4, resupply.y - 0.2, supportDrop, supportDrop === 'team' ? 15 : 1);
        soundService.playGamePowerUp();
        onFeedback('power', 'TIẾP TẾ ĐÃ THẢ!');
        entitiesChanged = true;
      }
      if (resupply.x > 6.2) resupply.dead = true;
    });

    sim.bullets.forEach((bullet) => {
      if (bullet.dead) return;
      for (const asteroid of sim.asteroids) {
        if (asteroid.dead || bullet.hitIds.includes(asteroid.id)) continue;
        const hitRadius = asteroid.radius * 0.82 + bullet.radius + 0.12;
        if (distanceSquared(bullet.x, bullet.y, asteroid.x, asteroid.y) > hitRadius ** 2) continue;
        bullet.hitIds.push(asteroid.id);
        if (bullet.piercingRemaining > 1) bullet.piercingRemaining -= 1;
        else bullet.dead = true;
        asteroid.hp -= bullet.damage;
        sim.score += Math.ceil(bullet.damage * 0.35);
        addBurst(bullet.x, bullet.y, bullet.color, bullet.radius * 3.2);
        soundService.playGameImpact(clamp(bullet.damage / 35, 0.2, 1));

        detonateBullet(bullet, asteroid.x, asteroid.y, asteroid.id);
        if (asteroid.hp <= 0) destroyAsteroid(asteroid);
        break;
      }
    });

    if (player.invulnerable <= 0 && sim.phaseTime <= 0 && sim.mode !== 'wormhole') {
      const collision = sim.asteroids.find((asteroid) => !asteroid.dead && distanceSquared(player.x, player.y, asteroid.x, asteroid.y) < (RUNNER_BALANCE.playerHitRadius + asteroid.radius * (asteroid.tier === 'titan' ? 0.88 : 0.68)) ** 2);
      if (collision) {
        const damage = ASTEROID_STATS[collision.tier].damage;
        sim.hp = Math.max(0, sim.hp - damage);
        player.invulnerable = RUNNER_BALANCE.playerInvulnerableSeconds;
        input.current.targetY = clamp(input.current.targetY - 0.65, RUNNER_BALANCE.worldBottom + 1.15, 4.15);
        addBurst(player.x, player.y, '#ff4365', 1.25, true);
        soundService.playGameExplosion(0.7);
        interactionService.playError();
        onFeedback('hit', `-${damage} GIÁP`);
        if (sim.hp <= 0) {
          const snapshot: RunSnapshot = {
            hp: 0, maxHp: sim.maxHp, score: sim.score, coins: sim.coins,
            progress: runMode === 'endless' ? (sim.elapsed % 60) / 60 : sim.mode === 'playing' ? clamp(sim.elapsed / stageDuration, 0, 1) : 1,
            combo: sim.combo, orbiterCount: sim.orbiterCount, slowSeconds: sim.slowTime,
            attackSpeedStacks: sim.attackSpeedStacks, moveSpeedStacks: sim.moveSpeedStacks, damageStacks: sim.damageStacks,
            blackholeSeconds: sim.blackholeTime, phaseSeconds: sim.phaseTime, teamSeconds: sim.teamTime,
            asteroidsDestroyed: sim.asteroidsDestroyed, powerupsCollected: sim.powerupsCollected,
            maxCombo: sim.maxCombo, survivalSeconds: Math.floor(sim.elapsed),
            bossHp: sim.bossId ? sim.asteroids.find((item) => item.id === sim.bossId)?.hp || 0 : 0,
            bossMaxHp: RUNNER_BALANCE.bossHp, mode: sim.mode,
          };
          onGameOver(snapshot);
          return;
        }
      }
    }

    sim.pickups.forEach((pickup) => {
      if (pickup.dead) return;
      const dist = Math.sqrt(distanceSquared(player.x, player.y, pickup.x, pickup.y));
      if (dist < RUNNER_BALANCE.pickupMagnetRadius) {
        const pull = clamp(1 - dist / RUNNER_BALANCE.pickupMagnetRadius, 0.16, 1) * 7 * dt;
        pickup.x = THREE.MathUtils.lerp(pickup.x, player.x, pull);
        pickup.y = THREE.MathUtils.lerp(pickup.y, player.y, pull);
      } else {
        pickup.y += pickup.vy * dt;
      }
      if (dist < 0.58) {
        pickup.dead = true;
        if (pickup.kind !== 'coin') sim.powerupsCollected += 1;
        if (pickup.kind === 'coin') {
          sim.coins = Math.min(RUNNER_BALANCE.runCoinCap, sim.coins + pickup.value);
          soundService.playCoin();
        } else if (pickup.kind === 'heal') {
          sim.hp = Math.min(sim.maxHp, sim.hp + sim.maxHp * pickup.value);
          soundService.playGamePowerUp();
          onFeedback('power', `HỒI GIÁP +${Math.round(pickup.value * 100)}%`);
        } else if (pickup.kind === 'slow') {
          sim.slowTime = Math.max(sim.slowTime, pickup.value);
          soundService.playGamePowerUp();
          onFeedback('power', 'THỜI GIAN CHẬM');
        } else if (pickup.kind === 'orbiter') {
          sim.orbiterCount = Math.min(2, sim.orbiterCount + 1);
          soundService.playGamePowerUp();
          onFeedback('power', `VỆ TINH ${sim.orbiterCount}/2`);
        } else if (pickup.kind === 'attack_speed') {
          sim.attackSpeedStacks += 1;
          soundService.playGamePowerUp();
          onFeedback('power', `TỐC BẮN +20% · ×${sim.attackSpeedStacks}`);
        } else if (pickup.kind === 'move_speed') {
          sim.moveSpeedStacks += 1;
          soundService.playGamePowerUp();
          onFeedback('power', `TỐC ĐỘ +15% · ×${sim.moveSpeedStacks}`);
        } else if (pickup.kind === 'damage') {
          sim.damageStacks += 1;
          soundService.playGamePowerUp();
          onFeedback('power', `SÁT THƯƠNG +10% · ×${sim.damageStacks}`);
        } else if (pickup.kind === 'blackhole') {
          sim.blackholeTime = Math.max(sim.blackholeTime, pickup.value);
          soundService.playWormhole();
          onFeedback('power', 'HỐ ĐEN KÍCH HOẠT · 6 GIÂY');
        } else if (pickup.kind === 'phase') {
          sim.phaseTime = Math.max(sim.phaseTime, pickup.value);
          soundService.playGamePowerUp();
          onFeedback('power', 'XUYÊN KHÔNG · 10 GIÂY');
        } else if (pickup.kind === 'team') {
          sim.teamTime = Math.max(sim.teamTime, pickup.value);
          soundService.playGamePowerUp();
          onFeedback('power', 'BIÊN ĐỘI VIỆN TRỢ · 15 GIÂY');
        } else if (pickup.kind === 'mid_wormhole') {
          sim.elapsed = Math.min(stageDuration, sim.elapsed + stageDuration * pickup.value);
          soundService.playWormhole();
          onFeedback('power', 'NHẢY CÓC TIẾN ĐỘ +20%');
        }
        addBurst(pickup.x, pickup.y, pickup.kind === 'coin' ? '#ffd84f' : '#55f6ff', 0.8, true);
      } else if (pickup.y < RUNNER_BALANCE.worldBottom - 1.5) pickup.dead = true;
    });

    sim.bursts.forEach((burst) => {
      burst.life -= dt;
      if (burst.life <= 0) burst.dead = true;
    });

    const sceneEntityCountBefore = sim.asteroids.length + sim.resupplies.length;
    compactAliveInPlace(sim.bullets);
    compactAliveInPlace(sim.asteroids);
    compactAliveInPlace(sim.pickups);
    compactAliveInPlace(sim.bursts);
    compactAliveInPlace(sim.resupplies);
    const sceneEntityCountAfter = sim.asteroids.length + sim.resupplies.length;
    if (sceneEntityCountBefore !== sceneEntityCountAfter) entitiesChanged = true;

    if (bulletInstances.current) {
      let trailIndex = 0;
      sim.bullets.forEach((bullet, index) => {
        const angle = Math.atan2(bullet.vx, bullet.vy);
        instanceDummy.position.set(bullet.x, 0.28, -bullet.y);
        instanceDummy.rotation.set(Math.PI / 2, angle, 0);
        instanceDummy.scale.set(bullet.radius, bullet.kind === 'piercing' ? bullet.radius * 2.4 : bullet.radius, bullet.radius);
        instanceDummy.updateMatrix();
        bulletInstances.current?.setMatrixAt(index, instanceDummy.matrix);
        bulletInstances.current?.setColorAt(index, instanceColor.set(bullet.color));
        if (bullet.trail && bulletTrailInstances.current) {
          const velocityLength = Math.max(0.001, Math.hypot(bullet.vx, bullet.vy));
          instanceDummy.position.set(
            bullet.x - bullet.vx / velocityLength * bullet.radius * 4.2,
            0.27,
            -(bullet.y - bullet.vy / velocityLength * bullet.radius * 4.2),
          );
          instanceDummy.rotation.set(Math.PI / 2, angle, 0);
          instanceDummy.scale.setScalar(bullet.radius);
          instanceDummy.updateMatrix();
          bulletTrailInstances.current.setMatrixAt(trailIndex, instanceDummy.matrix);
          bulletTrailInstances.current.setColorAt(trailIndex, instanceColor.set(bullet.color));
          trailIndex += 1;
        }
      });
      bulletInstances.current.count = sim.bullets.length;
      bulletInstances.current.instanceMatrix.needsUpdate = true;
      if (bulletInstances.current.instanceColor) bulletInstances.current.instanceColor.needsUpdate = true;
      if (bulletTrailInstances.current) {
        bulletTrailInstances.current.count = trailIndex;
        bulletTrailInstances.current.instanceMatrix.needsUpdate = true;
        if (bulletTrailInstances.current.instanceColor) bulletTrailInstances.current.instanceColor.needsUpdate = true;
      }
    }
    sim.asteroids.forEach((asteroid) => {
      const node = asteroidRefs.current.get(asteroid.id);
      if (!node) return;
      node.position.set(asteroid.x, 0.1, -asteroid.y);
      node.rotation.y = asteroid.rotation;
      node.rotation.z = asteroid.rotation * 0.6;
    });
    let coinIndex = 0;
    let powerupIndex = 0;
    sim.pickups.forEach((pickup) => {
      const targetMesh = pickup.kind === 'coin' ? coinInstances.current : powerupInstances.current;
      const targetIndex = pickup.kind === 'coin' ? coinIndex++ : powerupIndex++;
      if (!targetMesh) return;
      instanceDummy.position.set(pickup.x, 0.42, -pickup.y);
      instanceDummy.rotation.set(0, sim.elapsed * 2.6 + pickup.id, 0);
      instanceDummy.scale.setScalar(pickup.kind === 'mid_wormhole' ? 1.35 : 1);
      instanceDummy.updateMatrix();
      targetMesh.setMatrixAt(targetIndex, instanceDummy.matrix);
      targetMesh.setColorAt(targetIndex, instanceColor.copy(PICKUP_MATERIALS[pickup.kind].color));
    });
    [coinInstances.current, powerupInstances.current].forEach((mesh, index) => {
      if (!mesh) return;
      mesh.count = index === 0 ? coinIndex : powerupIndex;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    let discIndex = 0;
    let ringIndex = 0;
    sim.bursts.forEach((burst) => {
      const targetMesh = burst.ring ? burstRingInstances.current : burstDiscInstances.current;
      const targetIndex = burst.ring ? ringIndex++ : discIndex++;
      if (!targetMesh) return;
      const normalized = 1 - burst.life / burst.maxLife;
      instanceDummy.position.set(burst.x, 0.48, -burst.y);
      instanceDummy.rotation.set(Math.PI / 2, 0, 0);
      instanceDummy.scale.setScalar((0.25 + normalized * 1.25) * burst.size);
      instanceDummy.updateMatrix();
      targetMesh.setMatrixAt(targetIndex, instanceDummy.matrix);
      targetMesh.setColorAt(targetIndex, instanceColor.set(burst.color).multiplyScalar(Math.max(0.08, 1 - normalized)));
    });
    [burstDiscInstances.current, burstRingInstances.current].forEach((mesh, index) => {
      if (!mesh) return;
      mesh.count = index === 0 ? discIndex : ringIndex;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });
    sim.resupplies.forEach((resupply) => {
      const node = resupplyRefs.current.get(resupply.id);
      if (!node) return;
      node.position.set(resupply.x, 0.3, -resupply.y);
    });

    if (entitiesChanged) bumpEntities();
    sim.hudClock -= dt;
    if (sim.hudClock <= 0) {
      sim.hudClock = 0.09;
      publishHud();
    }
  });

  const sim = simRef.current;
  const wormholeVisible = sim.mode === 'wormhole';

  return (
    <>
      <CameraSetup />
      <color attach="background" args={['#06142f']} />
      <fog attach="fog" args={['#081a38', 10, 31]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[2, 8, 4]} intensity={2.6} color="#dffaff" />
      <pointLight position={[-4, 3, -4]} intensity={7} color="#6f39ff" distance={12} />
      <ParallaxStarfield playerX={playerPosition} quality={quality} />
      <FramePerformanceMonitor quality={quality} />
      <SceneAssetPrewarmer />

      <PlayerModel
        ship={ship}
        color={shipColor}
        input={input}
        simPosition={playerPosition}
        visible={phase !== 'gameover'}
        orbiterCount={sim.orbiterCount}
        orbiterPositions={orbiterPositions}
        phaseActive={sim.phaseTime > 0}
      />
      <ActiveRunEffects player={playerPosition} effects={effectState} supportShips={supportShips} />

      {sim.resupplies.map((resupply) => (
        <group
          key={resupply.id}
          ref={(node) => { if (node) resupplyRefs.current.set(resupply.id, node); else resupplyRefs.current.delete(resupply.id); }}
          position={[resupply.x, 0.3, -resupply.y]}
          rotation={[0, 0, -Math.PI / 2]}
          scale={0.5}
        >
          <AerodynamicShipRenderer shipId={supportShips[0].id} shipColor="#75f5ff" thrustPower={0.85} scale={1} />
        </group>
      ))}

      <instancedMesh ref={bulletInstances} args={[BULLET_GEOMETRY, BULLET_INSTANCE_MATERIAL, RUNNER_BALANCE.maxBullets]} frustumCulled={false} dispose={null} />
      <instancedMesh ref={bulletTrailInstances} args={[BULLET_TRAIL_GEOMETRY, BULLET_TRAIL_INSTANCE_MATERIAL, RUNNER_BALANCE.maxBullets]} frustumCulled={false} dispose={null} />

      {sim.asteroids.map((asteroid) => {
        const geometry = asteroid.tier === 'titan'
          ? TITAN_GEOMETRY
          : ASTEROID_GEOMETRIES[Math.floor(asteroid.seed * ASTEROID_GEOMETRIES.length) % ASTEROID_GEOMETRIES.length];
        return (
          <group
            key={asteroid.id}
            ref={(node) => { if (node) asteroidRefs.current.set(asteroid.id, node); else asteroidRefs.current.delete(asteroid.id); }}
            position={[asteroid.x, 0.1, -asteroid.y]}
            scale={asteroid.radius}
          >
            <mesh geometry={geometry} material={ASTEROID_MATERIALS[asteroid.material]} dispose={null} />
            {asteroid.tier === 'titan' && (
              <group position={[0, 0.04, 1.02]}>
                <mesh geometry={TITAN_BOW_WAVE_GEOMETRY} material={TITAN_BOW_WAVE_MATERIAL} position={[-0.46, 0, 0]} rotation={[-Math.PI / 2, 0.44, 0]} />
                <mesh geometry={TITAN_BOW_WAVE_GEOMETRY} material={TITAN_BOW_WAVE_MATERIAL} position={[0.46, 0, 0]} rotation={[-Math.PI / 2, -0.44, 0]} />
                <pointLight position={[0, 0.2, 0]} intensity={1.8} color="#ffae57" distance={2.4} />
              </group>
            )}
            {asteroid.tier !== 'titan' && [0, 1, 2].map((crater) => {
              const angle = seededNoise(asteroid.seed * 100 + crater * 17) * Math.PI * 2;
              const distance = 0.25 + seededNoise(asteroid.seed * 200 + crater * 9) * 0.35;
              return (
                <mesh key={crater} position={[Math.cos(angle) * distance, 0.77, Math.sin(angle) * distance]} rotation={[-Math.PI / 2, 0, angle]} scale={0.12 + seededNoise(asteroid.seed * 300 + crater) * 0.12}>
                  <primitive object={CRATER_GEOMETRY} attach="geometry" />
                  <primitive object={CRATER_MATERIAL} attach="material" />
                </mesh>
              );
            })}
            {(['gold', 'platinum', 'diamond'] as AsteroidMaterial[]).includes(asteroid.material) && <mesh scale={0.72}>
              <primitive object={CRYSTAL_CORE_GEOMETRY} attach="geometry" />
              <primitive object={CRYSTAL_CORE_MATERIAL} attach="material" />
            </mesh>}
          </group>
        );
      })}

      <instancedMesh ref={coinInstances} args={[PICKUP_COIN_GEOMETRY, PICKUP_INSTANCE_MATERIAL, 64]} frustumCulled={false} dispose={null} />
      <instancedMesh ref={powerupInstances} args={[PICKUP_POWER_GEOMETRY, PICKUP_INSTANCE_MATERIAL, 64]} frustumCulled={false} dispose={null} />
      <instancedMesh ref={burstDiscInstances} args={[BURST_DISC_GEOMETRY, BURST_INSTANCE_MATERIAL, RUNNER_BALANCE.maxBursts]} frustumCulled={false} dispose={null} />
      <instancedMesh ref={burstRingInstances} args={[BURST_RING_GEOMETRY, BURST_INSTANCE_MATERIAL, RUNNER_BALANCE.maxBursts]} frustumCulled={false} dispose={null} />

      <Wormhole visible={wormholeVisible} x={sim.wormholeX} y={sim.wormholeY} />
    </>
  );
};

const StatBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
    <span className="w-16 text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
    <div className="h-2 flex-1 rounded-full bg-slate-800 overflow-hidden border border-white/5">
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
    </div>
    <span className="w-7 text-right text-[11px] font-black text-white">{value}</span>
  </div>
);

interface AsteroidRunnerGameProps {
  onExit: () => void;
}

export const AsteroidRunnerGame: React.FC<AsteroidRunnerGameProps> = ({ onExit }) => {
  const {
    user,
    settings,
    miniGameProgress,
    startMiniGameRun,
    finishMiniGameRun,
    consumeEnergy,
    equipShip,
    claimMiniGameDailyReward,
    claimMiniGameAdEnergy,
    useMiniGameRefuel,
  } = useGameStore();
  const unlocked = user.customization.unlockedShips;
  const initialShipId = RUNNER_SHIPS.some((ship) => ship.id === user.customization.equippedShip && unlocked.includes(ship.id))
    ? user.customization.equippedShip
    : RUNNER_SHIPS.find((ship) => unlocked.includes(ship.id))?.id || RUNNER_SHIPS[0].id;
  const [selectedShipId, setSelectedShipId] = useState(initialShipId);
  const selectedShip = getRunnerShip(selectedShipId);
  const quality = useMemo(() => detectRunnerQuality(), []);
  const [runMode, setRunMode] = useState<RunnerMode>('stage');
  const [selectedStage, setSelectedStage] = useState(Math.max(1, miniGameProgress.highestStageUnlocked || 1));
  const [phase, setPhase] = useState<RunnerPhase>('lobby');
  const [runKey, setRunKey] = useState(0);
  const [continueToken, setContinueToken] = useState(0);
  const [hud, setHud] = useState<HudState>({ ...EMPTY_HUD, hp: selectedShip.shield, maxHp: selectedShip.shield });
  const [result, setResult] = useState<RunResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: string; message?: string; id: number } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProgressPanel, setShowProgressPanel] = useState(false);
  const [progressNotice, setProgressNotice] = useState<string | null>(null);
  const [adCountdown, setAdCountdown] = useState<number | null>(null);
  const [resumePhase, setResumePhase] = useState<LivePhase>('playing');
  const pausedHudRef = useRef<HudState | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const settledRef = useRef(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<InputState>({
    pointerActive: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    targetX: 0,
    targetY: -5.6,
    keys: new Set(),
  });
  const shipColor = user.customization.equippedColor || '#38bdf8';
  const isLive = phase === 'playing' || phase === 'boss' || phase === 'wormhole';
  const displayedHud = phase === 'paused' && pausedHudRef.current ? pausedHudRef.current : hud;
  const freeRunAvailable = miniGameProgress.lastFreeRunDate !== localDateKey();
  const dailyProgress = miniGameProgress.daily?.date === localDateKey()
    ? miniGameProgress.daily
    : { date: localDateKey(), asteroids: 0, coins: 0, wins: 0, claimed: [] as string[] };
  const debugFast = import.meta.env.DEV && new URLSearchParams(window.location.search).get('runnerDebug') === 'fast';

  useEffect(() => {
    if (adCountdown === null) return;
    if (adCountdown <= 0) {
      const reward = claimMiniGameAdEnergy();
      setNotice(reward.success ? `Đã nhận +10 Năng Lượng · còn ${reward.remaining} lượt hôm nay.` : reward.reason || 'Không thể nhận tiếp tế.');
      setAdCountdown(null);
      return;
    }
    const timer = window.setTimeout(() => setAdCountdown((value) => value === null ? null : value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [adCountdown, claimMiniGameAdEnergy]);

  const sendFeedback = useCallback((kind: 'hit' | 'power' | 'danger' | 'boss', message?: string) => {
    setFeedback({ kind, message, id: Date.now() });
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), kind === 'boss' ? 2200 : 900);
  }, []);

  const pauseRun = useCallback(() => {
    if (!isLive) return;
    pausedHudRef.current = hud;
    setResumePhase(phase as LivePhase);
    setPhase('paused');
    input.current.pointerActive = false;
    soundService.setShipEnginePower(0.08);
  }, [hud, isLive, phase]);

  const settle = useCallback((snapshot: Pick<RunSnapshot, 'score' | 'coins' | 'asteroidsDestroyed' | 'powerupsCollected' | 'maxCombo'>, won: boolean) => {
    if (settledRef.current) return null;
    settledRef.current = true;
    const award = finishMiniGameRun({
      won,
      score: snapshot.score,
      collectedCoins: snapshot.coins,
      mode: runMode,
      stage: selectedStage,
      asteroidsDestroyed: snapshot.asteroidsDestroyed,
      powerupsCollected: snapshot.powerupsCollected,
      maxCombo: snapshot.maxCombo,
    });
    const nextResult: RunResult = {
      won,
      score: Math.floor(snapshot.score),
      collectedCoins: snapshot.coins,
      awardedCoins: award.awardedCoins,
      isBest: award.isBest,
      newAchievements: award.newAchievements,
    };
    setResult(nextResult);
    return nextResult;
  }, [finishMiniGameRun, runMode, selectedStage]);

  const startRun = useCallback(() => {
    const start = startMiniGameRun();
    if (!start.success) {
      setNotice(start.reason || 'Chưa đủ Năng Lượng.');
      interactionService.playError();
      return;
    }
    settledRef.current = false;
    setResult(null);
    setNotice(null);
    setHud({ ...EMPTY_HUD, hp: selectedShip.shield, maxHp: selectedShip.shield });
    setRunKey((value) => value + 1);
    setPhase('playing');
    setShowTutorial(true);
    input.current.targetX = 0;
    input.current.targetY = -5.6;
    soundService.setBgmStyle('adventure');
    soundService.playEngineStart();
    soundService.startShipEngine(0.22);
    soundService.setShipEnginePower(0.48);
    interactionService.playSuccess();
    setTimeout(() => setShowTutorial(false), 4200);
  }, [selectedShip.shield, startMiniGameRun]);

  const handleGameOver = useCallback((snapshot: RunSnapshot) => {
    setHud(snapshot);
    setResumePhase(snapshot.mode);
    setPhase('gameover');
    input.current.pointerActive = false;
    soundService.setShipEnginePower(0.08);
    sendFeedback('danger', 'LÁ CHẮN CẠN NĂNG LƯỢNG');
  }, [sendFeedback]);

  const handleVictory = useCallback((snapshot: RunSnapshot) => {
    setHud(snapshot);
    settle(snapshot, true);
    setPhase('victory');
    input.current.pointerActive = false;
    soundService.setShipEnginePower(0.05);
    interactionService.playVictory();
  }, [settle]);

  const continueRun = useCallback(() => {
    if (!consumeEnergy(RUNNER_BALANCE.continueEnergyCost)) {
      setNotice(`Cần ${RUNNER_BALANCE.continueEnergyCost} Năng Lượng để tiếp tục.`);
      interactionService.playError();
      return;
    }
    setNotice(null);
    setContinueToken((value) => value + 1);
    setPhase(resumePhase);
    soundService.setShipEnginePower(0.48);
    interactionService.playSuccess();
  }, [consumeEnergy, resumePhase]);

  const quitRun = useCallback(() => {
    if (!settledRef.current && phase !== 'lobby') settle({
      score: hud.score, coins: hud.coins, asteroidsDestroyed: hud.asteroidsDestroyed,
      powerupsCollected: hud.powerupsCollected, maxCombo: hud.maxCombo,
    }, false);
    soundService.setBgmStyle(settings.bgmStyle);
    soundService.stopShipEngine(0.35);
    onExit();
  }, [hud.asteroidsDestroyed, hud.coins, hud.maxCombo, hud.powerupsCollected, hud.score, onExit, phase, settle, settings.bgmStyle]);

  const restartRun = useCallback(() => {
    if (!settledRef.current) settle({
      score: hud.score, coins: hud.coins, asteroidsDestroyed: hud.asteroidsDestroyed,
      powerupsCollected: hud.powerupsCollected, maxCombo: hud.maxCombo,
    }, false);
    startRun();
  }, [hud.asteroidsDestroyed, hud.coins, hud.maxCombo, hud.powerupsCollected, hud.score, settle, startRun]);

  const playNextStage = useCallback(() => {
    setSelectedStage((current) => current + 1);
    startRun();
  }, [startRun]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
      input.current.keys.add(event.code);
      if (event.code === 'Escape') {
        if (isLive) {
          pauseRun();
        } else if (phase === 'paused') {
          setPhase(resumePhase);
        }
      }
    };
    const onKeyUp = (event: KeyboardEvent) => input.current.keys.delete(event.code);
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isLive, pauseRun, phase, resumePhase]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && (phase === 'playing' || phase === 'boss' || phase === 'wormhole')) {
        setResumePhase(phase);
        setPhase('paused');
        input.current.pointerActive = false;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [phase]);

  useEffect(() => () => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    soundService.stopShipEngine(0.25);
    soundService.setBgmStyle(settings.bgmStyle);
  }, [settings.bgmStyle]);

  useEffect(() => {
    interactionService.setHapticsEnabled(settings.hapticEnabled);
  }, [settings.hapticEnabled]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isLive || (event.target as HTMLElement).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    input.current.pointerActive = true;
    input.current.pointerId = event.pointerId;
    input.current.lastX = event.clientX;
    input.current.lastY = event.clientY;
    soundService.setShipEnginePower(0.68);
    setShowTutorial(false);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!input.current.pointerActive || input.current.pointerId !== event.pointerId || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const dx = event.clientX - input.current.lastX;
    const dy = event.clientY - input.current.lastY;
    input.current.lastX = event.clientX;
    input.current.lastY = event.clientY;
    input.current.targetX = clamp(input.current.targetX + dx / rect.width * 11.5, -RUNNER_BALANCE.worldHalfWidth + 0.65, RUNNER_BALANCE.worldHalfWidth - 0.65);
    input.current.targetY = clamp(input.current.targetY - dy / rect.height * 22, RUNNER_BALANCE.worldBottom + 1.15, 4.15);
  };
  const releasePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (input.current.pointerId !== event.pointerId) return;
    input.current.pointerActive = false;
    input.current.pointerId = null;
    soundService.setShipEnginePower(0.34);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const hpRatio = clamp(displayedHud.hp / Math.max(1, displayedHud.maxHp), 0, 1);

  if (phase === 'lobby') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#030611] text-white overflow-hidden font-be-vietnam-pro" data-testid="asteroid-runner-lobby">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(91,69,220,0.32),transparent_42%),linear-gradient(180deg,#071126_0%,#030611_62%,#120626_100%)]" />
        <div className="relative h-full flex flex-col pt-[max(0.75rem,var(--sat))] pb-[max(0.8rem,var(--sab))] px-4">
          <div className="flex items-center justify-between shrink-0">
            <button onClick={onExit} className="w-11 h-11 rounded-2xl bg-slate-900/80 border border-white/15 flex items-center justify-center active:scale-90" aria-label="Đóng mini game">
              <X className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => setShowProgressPanel(true)} className="text-center rounded-xl px-2 py-1 active:scale-95" aria-label="Mở thành tích và nhiệm vụ mini game">
              <div className="text-[10px] font-black tracking-[0.28em] text-cyan-300">NOVA ARCADE</div>
              <h1 className="text-base sm:text-lg font-black text-white">Vượt Dải Thiên Thạch</h1>
              <div className="text-[8px] font-black text-amber-300">🏆 THÀNH TÍCH</div>
            </button>
            <div className="h-11 px-3 rounded-2xl bg-amber-500/15 border border-amber-300/30 flex items-center gap-1.5 font-black text-xs text-amber-200">
              <Zap className="w-4 h-4 fill-amber-300" /> {user.energy}
            </div>
          </div>

          <div className="relative flex-1 min-h-0 my-2 rounded-[30px] overflow-hidden border border-cyan-300/20 bg-slate-950/60 shadow-[0_0_50px_rgba(56,189,248,0.16)]">
            <LobbyShipPreview ship={selectedShip} color={shipColor} />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#060916] via-[#060916]/90 to-transparent pt-20 pointer-events-none">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black text-cyan-300 tracking-[0.2em]">{selectedShip.weapon.id} · {selectedShip.weapon.shortName}</div>
                  <h2 className="text-xl font-black text-white leading-tight">{selectedShip.nameVi}</h2>
                  <p className="text-[11px] text-slate-300 font-bold mt-1">{selectedShip.weapon.name}</p>
                </div>
                <div className="rounded-xl bg-cyan-400/10 border border-cyan-300/30 px-2.5 py-1.5 text-[10px] font-black text-cyan-100">ĐÃ SỞ HỮU</div>
              </div>
            </div>
          </div>

          <div className="shrink-0 space-y-2">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-1.5">
              <button
                type="button"
                onClick={() => setRunMode('stage')}
                className={`min-h-9 px-3 rounded-xl text-[10px] font-black ${runMode === 'stage' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
              >MÀN {selectedStage}</button>
              <button
                type="button"
                onClick={() => setRunMode('endless')}
                className={`min-h-9 px-3 rounded-xl text-[10px] font-black ${runMode === 'endless' ? 'bg-fuchsia-500 text-white' : 'bg-slate-800 text-slate-300'}`}
              >∞ VÔ TẬN</button>
              {runMode === 'stage' && (
                <div className="flex flex-1 gap-1 overflow-x-auto">
                  {Array.from({ length: Math.min(8, Math.max(1, miniGameProgress.highestStageUnlocked || 1)) }, (_, index) => index + 1).map((stageNumber) => (
                    <button key={stageNumber} type="button" onClick={() => setSelectedStage(stageNumber)} className={`min-w-8 h-8 rounded-lg text-[10px] font-black ${selectedStage === stageNumber ? 'bg-amber-400 text-amber-950' : 'bg-slate-950 text-slate-400'}`}>{stageNumber}</button>
                  ))}
                </div>
              )}
              {runMode === 'endless' && <div className="flex-1 text-right pr-2 text-[9px] font-black text-fuchsia-200">KỶ LỤC {miniGameProgress.endlessBestScore.toLocaleString('vi-VN')}</div>}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
              {RUNNER_SHIPS.map((ship) => {
                const isUnlocked = unlocked.includes(ship.id);
                const selected = ship.id === selectedShip.id;
                return (
                  <button
                    key={ship.id}
                    disabled={!isUnlocked}
                    onClick={() => { setSelectedShipId(ship.id); equipShip(ship.id); interactionService.playSelect(); }}
                    className={`relative min-w-[64px] h-14 rounded-2xl border-2 flex items-center justify-center text-2xl snap-center transition-all ${selected ? 'border-cyan-300 bg-cyan-500/20 shadow-[0_0_18px_rgba(34,211,238,0.32)]' : 'border-slate-700 bg-slate-900/80'} ${!isUnlocked ? 'opacity-45 grayscale' : 'active:scale-90'}`}
                    aria-label={`${isUnlocked ? 'Chọn' : 'Đã khóa'} ${ship.nameVi}`}
                  >
                    {ship.icon}
                    {!isUnlocked && <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-600 flex items-center justify-center"><Lock className="w-3 h-3" /></span>}
                  </button>
                );
              })}
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-fuchsia-300/35 bg-fuchsia-500/10 px-2.5 py-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-fuchsia-200">Tổng sức mạnh</span>
                <span className="text-base font-black text-white">{selectedShip.totalPower}</span>
              </div>
              <StatBar label="Tốc độ" value={selectedShip.speed} color="#38d8ff" />
              <StatBar label="Giáp" value={selectedShip.shield} color="#57f0a7" />
              <StatBar label="Sức mạnh" value={selectedShip.power} color="#ffd447" />
            </div>
            {notice && <div className="rounded-xl border border-rose-400/40 bg-rose-500/15 p-2.5 text-center text-xs font-black text-rose-100">{notice}</div>}
            {!freeRunAvailable && user.energy < RUNNER_BALANCE.retryEnergyCost && (
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-amber-300/25 bg-amber-400/8 p-2">
                <button
                  type="button"
                  disabled={adCountdown !== null || (miniGameProgress.adEnergy.date === localDateKey() && miniGameProgress.adEnergy.claims >= 3)}
                  onClick={() => setAdCountdown(5)}
                  className="min-h-11 rounded-xl border border-amber-300/40 bg-amber-400/15 text-[10px] font-black text-amber-100 disabled:opacity-40"
                >{adCountdown !== null ? `TIẾP TẾ ${adCountdown}s` : `🎬 +10 ⚡ (${Math.max(0, 3 - (miniGameProgress.adEnergy.date === localDateKey() ? miniGameProgress.adEnergy.claims : 0))}/3)`}</button>
                <button
                  type="button"
                  disabled={miniGameProgress.instantRefuelCards <= 0}
                  onClick={() => setNotice(useMiniGameRefuel() ? 'Đã dùng Thẻ Nạp Đầy 50 Năng Lượng.' : 'Trong kho không còn Thẻ Nạp Đầy.')}
                  className="min-h-11 rounded-xl border border-emerald-300/40 bg-emerald-400/15 text-[10px] font-black text-emerald-100 disabled:opacity-40"
                >🎒 NẠP ĐẦY ×{miniGameProgress.instantRefuelCards}</button>
                <div className="col-span-2 text-center text-[9px] font-bold text-slate-500">Hoặc chờ hệ thống tự nạp +1 ⚡ mỗi 60 giây.</div>
              </div>
            )}
            <button
              onClick={startRun}
              className="w-full min-h-[58px] rounded-2xl bg-gradient-to-b from-amber-300 via-yellow-400 to-orange-500 text-amber-950 border-2 border-yellow-100 font-black shadow-[0_6px_0_#b45309,0_0_26px_rgba(251,191,36,0.28)] active:translate-y-1 active:shadow-[0_2px_0_#b45309] transition-all flex items-center justify-center gap-2"
              data-testid="asteroid-runner-start"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{runMode === 'endless'
                ? freeRunAvailable ? 'CẤT CÁNH VÔ TẬN MIỄN PHÍ' : `CẤT CÁNH VÔ TẬN · ${RUNNER_BALANCE.retryEnergyCost} NĂNG LƯỢNG`
                : freeRunAvailable ? `CẤT CÁNH MÀN ${selectedStage} MIỄN PHÍ` : `CẤT CÁNH MÀN ${selectedStage} · ${RUNNER_BALANCE.retryEnergyCost} NĂNG LƯỢNG`}</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 font-bold">Lượt đầu mỗi ngày miễn phí · Mục tiêu 2–3 phút</p>
          </div>
        </div>
        {showProgressPanel && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl p-4 pt-[max(1rem,var(--sat))] pb-[max(1rem,var(--sab))] overflow-y-auto">
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div><div className="text-[10px] font-black text-amber-300 tracking-[0.2em]">NOVA ARCADE</div><h2 className="text-xl font-black">Nhiệm Vụ & Thành Tích</h2></div>
                <button type="button" onClick={() => setShowProgressPanel(false)} className="w-11 h-11 rounded-2xl bg-slate-800 border border-white/15 flex items-center justify-center" aria-label="Đóng thành tích"><X className="w-5 h-5" /></button>
              </div>

              <section className="rounded-3xl border border-cyan-300/25 bg-slate-900/85 p-4">
                <h3 className="font-black text-cyan-200">Nhiệm vụ hôm nay</h3>
                {([
                  ['asteroids', 'Phân rã 20 thiên thạch', dailyProgress.asteroids, 20, 20],
                  ['coins', 'Kiếm 30 Xu Nova', dailyProgress.coins, 30, 15],
                  ['wins', 'Hoàn thành 1 màn', dailyProgress.wins, 1, 25],
                ] as const).map(([id, label, value, target, reward]) => {
                  const complete = value >= target;
                  const claimed = dailyProgress.claimed.includes(id);
                  return (
                    <div key={id} className="mt-3 flex items-center gap-3 rounded-2xl bg-slate-950/70 border border-white/8 p-3">
                      <div className="flex-1"><div className="text-xs font-black">{label}</div><div className="mt-1 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, value / target * 100)}%` }} /></div><div className="text-[9px] text-slate-400 mt-1">{Math.min(value, target)}/{target}</div></div>
                      <button
                        type="button"
                        disabled={!complete || claimed}
                        onClick={() => {
                          const ok = claimMiniGameDailyReward(id);
                          setProgressNotice(ok ? `Đã nhận +${reward} Xu Nova!` : 'Nhiệm vụ chưa hoàn thành hoặc đã nhận.');
                        }}
                        className={`min-w-20 h-10 rounded-xl text-[10px] font-black ${claimed ? 'bg-emerald-500/20 text-emerald-300' : complete ? 'bg-amber-400 text-amber-950' : 'bg-slate-800 text-slate-500'}`}
                      >{claimed ? 'ĐÃ NHẬN' : `+${reward} 🟡`}</button>
                    </div>
                  );
                })}
                {progressNotice && <div className="mt-3 text-center text-[10px] font-black text-amber-200">{progressNotice}</div>}
              </section>

              <section className="rounded-3xl border border-amber-300/25 bg-slate-900/85 p-4">
                <h3 className="font-black text-amber-200">Huy hiệu ({miniGameProgress.achievements.length}/{Object.keys(ACHIEVEMENT_LABELS).length})</h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {Object.entries(ACHIEVEMENT_LABELS).map(([id, label]) => {
                    const unlockedAchievement = miniGameProgress.achievements.includes(id);
                    return <div key={id} className={`rounded-2xl border p-3 text-[10px] font-black ${unlockedAchievement ? 'border-amber-300/50 bg-amber-400/15 text-amber-100' : 'border-slate-700 bg-slate-950/60 text-slate-600 grayscale'}`}><div className="text-xl">{unlockedAchievement ? '🏆' : '🔒'}</div>{label}</div>;
                  })}
                </div>
              </section>

              <section className="rounded-3xl border border-fuchsia-300/25 bg-slate-900/85 p-4">
                <div className="flex justify-between"><h3 className="font-black text-fuchsia-200">Bảng kỷ lục của bé</h3><span className="text-[10px] font-black text-slate-400">VÔ TẬN {miniGameProgress.endlessBestScore.toLocaleString('vi-VN')}</span></div>
                <div className="mt-3 space-y-2">
                  {miniGameProgress.leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={`${entry.at}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-950/70 px-3 py-2 text-xs"><span className="font-black text-amber-300">#{index + 1}</span><span className="text-slate-400">{entry.mode === 'endless' ? 'Vô tận' : `Màn ${entry.stage}`}</span><span className="font-black text-white">{entry.score.toLocaleString('vi-VN')}</span></div>
                  ))}
                  {miniGameProgress.leaderboard.length === 0 && <div className="text-center text-xs text-slate-500 py-3">Chưa có chuyến bay nào được ghi nhận.</div>}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[100] bg-black text-white overflow-hidden touch-none select-none font-be-vietnam-pro runner-feedback-${feedback?.kind || 'none'}`}
      data-testid="asteroid-runner-game"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
    >
      <Canvas
        orthographic
        dpr={quality === 'low' ? [1, 1.15] : quality === 'medium' ? [1, 1.35] : [1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false }}
        performance={{ min: 0.65 }}
      >
        <RunnerScene
          runKey={runKey}
          phase={phase}
          ship={selectedShip}
          shipColor={shipColor}
          input={input}
          continueToken={continueToken}
          runMode={runMode}
          stage={selectedStage}
          quality={quality}
          onHud={setHud}
          onBossStarted={() => setPhase('boss')}
          onWormholeStarted={() => setPhase('wormhole')}
          onGameOver={handleGameOver}
          onVictory={handleVictory}
          onFeedback={sendFeedback}
          debugFast={debugFast}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,40,0.15),transparent_36%,rgba(38,7,65,0.18))]" />
      <div className="pointer-events-none absolute inset-0 runner-vignette" />
      {feedback?.kind === 'hit' && <div key={`flash-${feedback.id}`} className="pointer-events-none absolute inset-0 border-[7px] border-rose-500/65 animate-pulse" />}

      <div className="pointer-events-none absolute inset-x-0 top-0 pt-[max(0.65rem,var(--sat))] px-3 z-20">
        <div className="flex items-start gap-2">
          <button
            onPointerDown={(event) => event.stopPropagation()}
            onClick={pauseRun}
            className="pointer-events-auto w-11 h-11 rounded-2xl bg-slate-950/72 border border-white/20 backdrop-blur-lg flex items-center justify-center active:scale-90 shadow-xl"
            aria-label="Tạm dừng"
          >
            <Pause className="w-5 h-5" />
          </button>
          <div className="flex-1 rounded-2xl bg-slate-950/72 border border-white/15 backdrop-blur-lg p-2.5 shadow-xl">
            <div className="flex justify-between items-center text-[10px] font-black mb-1.5">
              <span className="flex items-center gap-1 text-emerald-300"><Shield className="w-3.5 h-3.5" /> GIÁP {displayedHud.hp}/{displayedHud.maxHp}</span>
              <span className="text-amber-300">🟡 {displayedHud.coins}</span>
              <span className="text-cyan-200 font-mono">{displayedHud.score.toLocaleString('vi-VN')}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden bg-slate-800 border border-white/10">
              <div className={`h-full transition-[width] duration-100 ${hpRatio < 0.35 ? 'bg-gradient-to-r from-rose-600 to-orange-400' : 'bg-gradient-to-r from-emerald-500 to-cyan-300'}`} style={{ width: `${hpRatio * 100}%` }} />
            </div>
          </div>
        </div>

        {phase === 'boss' ? (
          <div className="mt-2 rounded-2xl bg-purple-950/85 border border-purple-300/40 backdrop-blur-lg px-3 py-2 shadow-[0_0_24px_rgba(168,85,247,0.28)]">
            <div className="flex justify-between text-[10px] font-black text-purple-100 mb-1"><span>◈ THIÊN THẠCH CỔ ĐẠI</span><span>{Math.ceil(displayedHud.bossHp)}</span></div>
            <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-amber-300 transition-[width] duration-100" style={{ width: `${clamp(displayedHud.bossHp / displayedHud.bossMaxHp, 0, 1) * 100}%` }} /></div>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-950/55 border border-white/10 backdrop-blur px-2.5 py-1.5">
            <span className="text-[9px] font-black text-slate-300 tracking-wider">{runMode === 'endless' ? 'CHU KỲ VÔ TẬN' : `DẢI THIÊN THẠCH · MÀN ${selectedStage}`}</span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300" style={{ width: `${displayedHud.progress * 100}%` }} /></div>
            <span className="text-[10px] font-black text-cyan-200">{runMode === 'endless' ? `${displayedHud.survivalSeconds}s` : `${Math.floor(displayedHud.progress * 100)}%`}</span>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-1.5 justify-end">
          {displayedHud.combo > 1 && <div className="rounded-full bg-amber-400/20 border border-amber-300/30 px-2 py-1 text-[10px] font-black text-amber-200">COMBO ×{displayedHud.combo}</div>}
          {displayedHud.orbiterCount > 0 && <div className="rounded-full bg-cyan-400/15 border border-cyan-300/30 px-2 py-1 text-[10px] font-black text-cyan-100">VỆ TINH {displayedHud.orbiterCount}/2</div>}
          {displayedHud.slowSeconds > 0 && <div className="rounded-full bg-purple-400/15 border border-purple-300/30 px-2 py-1 text-[10px] font-black text-purple-100">SLOW {displayedHud.slowSeconds}s</div>}
          {displayedHud.attackSpeedStacks > 0 && <div className="rounded-full bg-orange-400/15 border border-orange-300/30 px-2 py-1 text-[10px] font-black text-orange-100">BẮN ×{displayedHud.attackSpeedStacks}</div>}
          {displayedHud.moveSpeedStacks > 0 && <div className="rounded-full bg-sky-400/15 border border-sky-300/30 px-2 py-1 text-[10px] font-black text-sky-100">TỐC ×{displayedHud.moveSpeedStacks}</div>}
          {displayedHud.damageStacks > 0 && <div className="rounded-full bg-pink-400/15 border border-pink-300/30 px-2 py-1 text-[10px] font-black text-pink-100">DMG ×{displayedHud.damageStacks}</div>}
          {displayedHud.blackholeSeconds > 0 && <div className="rounded-full bg-violet-500/20 border border-violet-300/40 px-2 py-1 text-[10px] font-black text-violet-100">HỐ ĐEN {displayedHud.blackholeSeconds}s</div>}
          {displayedHud.phaseSeconds > 0 && <div className="rounded-full bg-cyan-300/20 border border-cyan-100/50 px-2 py-1 text-[10px] font-black text-cyan-50">PHASE {displayedHud.phaseSeconds}s</div>}
          {displayedHud.teamSeconds > 0 && <div className="rounded-full bg-amber-300/20 border border-amber-100/50 px-2 py-1 text-[10px] font-black text-amber-50">BIÊN ĐỘI {displayedHud.teamSeconds}s</div>}
        </div>
      </div>

      {showTutorial && isLive && (
        <div className="pointer-events-none absolute inset-x-5 bottom-[max(2.4rem,calc(var(--sab)+1.5rem))] z-20 rounded-3xl bg-slate-950/82 border border-cyan-300/35 backdrop-blur-xl p-4 text-center animate-slide-up-fade">
          <div className="text-2xl mb-1 animate-bounce-slow">☝️</div>
          <div className="font-black text-sm text-white">Chạm, giữ và kéo để lái</div>
          <div className="text-[11px] font-bold text-cyan-200 mt-1">Giữ tay để tự động khai hỏa · Thả tay để dừng</div>
        </div>
      )}

      {feedback?.message && (
        <div key={`message-${feedback.id}`} className={`pointer-events-none absolute inset-x-0 top-[36%] z-30 text-center font-black tracking-wider drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] animate-star-pop ${feedback.kind === 'hit' || feedback.kind === 'danger' ? 'text-rose-300 text-xl' : feedback.kind === 'boss' ? 'text-amber-200 text-2xl' : 'text-cyan-200 text-lg'}`}>
          {feedback.message}
        </div>
      )}

      {phase === 'paused' && (
        <div className="absolute inset-0 z-40 bg-[#030611]/86 backdrop-blur-xl flex items-center justify-center p-5" onPointerDown={(event) => event.stopPropagation()}>
          <div className="w-full max-w-sm rounded-[30px] bg-slate-900 border-2 border-cyan-300/25 p-5 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-400/15 border border-cyan-300/30 flex items-center justify-center"><Pause className="w-8 h-8 text-cyan-200" /></div>
            <h2 className="text-2xl font-black mt-4">Đang Tạm Dừng</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Thời gian và thiên thạch đã được đóng băng.</p>
            <button onClick={() => { setPhase(resumePhase); soundService.setShipEnginePower(0.48); }} className="mt-5 w-full min-h-14 rounded-2xl bg-gradient-to-b from-cyan-300 to-blue-600 border-2 border-cyan-100 text-slate-950 font-black flex items-center justify-center gap-2 active:scale-95"><Play className="w-5 h-5 fill-current" /> TIẾP TỤC</button>
            <button onClick={quitRun} className="mt-3 w-full min-h-12 rounded-2xl bg-slate-800 border border-slate-600 text-slate-200 font-black text-sm active:scale-95">KẾT THÚC VÁN</button>
          </div>
        </div>
      )}

      {phase === 'gameover' && (
        <div className="absolute inset-0 z-40 bg-[#08030d]/88 backdrop-blur-xl flex items-center justify-center p-5" onPointerDown={(event) => event.stopPropagation()}>
          <div className="w-full max-w-sm rounded-[30px] bg-gradient-to-b from-slate-900 to-[#16091d] border-2 border-rose-400/30 p-5 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center"><Heart className="w-8 h-8 text-rose-300" /></div>
            <h2 className="text-2xl font-black mt-4">Cần Tiếp Năng Lượng!</h2>
            <p className="text-xs text-slate-300 font-bold mt-1">{runMode === 'endless' ? `Bé đã trụ được ${hud.survivalSeconds} giây.` : `Bé đã mở được ${Math.floor(hud.progress * 100)}% tuyến đường.`}</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3"><div className="text-[10px] text-slate-500 font-black">ĐIỂM</div><div className="text-lg text-cyan-200 font-black">{hud.score.toLocaleString('vi-VN')}</div></div>
              <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3"><div className="text-[10px] text-slate-500 font-black">XU ĐÃ NHẶT</div><div className="text-lg text-amber-300 font-black">{hud.coins}</div></div>
            </div>
            {notice && <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-500/15 p-2.5 text-xs font-black text-rose-100">{notice}</div>}
            {user.energy < RUNNER_BALANCE.continueEnergyCost && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={adCountdown !== null || (miniGameProgress.adEnergy.date === localDateKey() && miniGameProgress.adEnergy.claims >= 3)}
                  onClick={() => setAdCountdown(5)}
                  className="min-h-12 rounded-xl border border-amber-300/40 bg-amber-400/15 text-[10px] font-black text-amber-100 disabled:opacity-40"
                >{adCountdown !== null ? `TIẾP TẾ ${adCountdown}s` : `🎬 +10 ⚡ (${Math.max(0, 3 - (miniGameProgress.adEnergy.date === localDateKey() ? miniGameProgress.adEnergy.claims : 0))}/3)`}</button>
                <button
                  type="button"
                  disabled={miniGameProgress.instantRefuelCards <= 0}
                  onClick={() => setNotice(useMiniGameRefuel() ? 'Đã dùng Thẻ Nạp Đầy 50 Năng Lượng.' : 'Trong kho không còn Thẻ Nạp Đầy.')}
                  className="min-h-12 rounded-xl border border-emerald-300/40 bg-emerald-400/15 text-[10px] font-black text-emerald-100 disabled:opacity-40"
                >🎒 NẠP ĐẦY ×{miniGameProgress.instantRefuelCards}</button>
                <div className="col-span-2 text-[9px] text-slate-500 font-bold">Hoặc chờ hệ thống tự nạp +1 ⚡ mỗi 60 giây.</div>
              </div>
            )}
            <button onClick={continueRun} className="mt-4 w-full min-h-14 rounded-2xl bg-gradient-to-b from-emerald-300 to-emerald-600 border-2 border-emerald-100 text-emerald-950 font-black active:scale-95">HỒI ĐẦY GIÁP · {RUNNER_BALANCE.continueEnergyCost} ⚡</button>
            <button onClick={restartRun} className="mt-3 w-full min-h-12 rounded-2xl bg-slate-800 border border-slate-600 font-black text-sm flex items-center justify-center gap-2 active:scale-95"><RotateCcw className="w-4 h-4" /> CHƠI LẠI · {RUNNER_BALANCE.retryEnergyCost} ⚡</button>
            <button onClick={quitRun} className="mt-3 text-xs font-black text-slate-400 underline underline-offset-4">NHẬN TOÀN BỘ XU & RỜI TRẬN</button>
          </div>
        </div>
      )}

      {phase === 'victory' && result && (
        <div className="absolute inset-0 z-40 bg-[#020713]/86 backdrop-blur-xl flex items-center justify-center p-5" onPointerDown={(event) => event.stopPropagation()}>
          <div className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#142954] via-[#111331] to-[#1b0b2d] border-2 border-amber-300/45 p-5 shadow-[0_0_60px_rgba(251,191,36,0.22)] text-center">
            <div className="text-5xl animate-bounce-slow">🏆</div>
            <div className="text-[10px] font-black tracking-[0.28em] text-amber-300 mt-3">MISSION COMPLETE</div>
            <h2 className="text-2xl font-black text-white mt-1">Dải Thiên Thạch Đã Mở!</h2>
            <div className="text-[10px] font-black text-cyan-200 mt-1">HOÀN THÀNH MÀN {selectedStage}</div>
            {result.isBest && <div className="inline-flex mt-2 rounded-full bg-purple-500/20 border border-purple-300/30 px-3 py-1 text-[10px] font-black text-purple-100"><Sparkles className="w-3 h-3 mr-1" /> KỶ LỤC MỚI</div>}
            {result.newAchievements.length > 0 && <div className="mt-2 rounded-xl border border-amber-300/35 bg-amber-400/10 p-2 text-[10px] font-black text-amber-100">🏆 Mở khóa {result.newAchievements.length} huy hiệu mới</div>}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <div className="rounded-2xl bg-slate-950/55 border border-white/10 p-3"><Gauge className="w-5 h-5 mx-auto text-cyan-300" /><div className="text-xl font-black text-white mt-1">{result.score.toLocaleString('vi-VN')}</div><div className="text-[9px] font-black text-slate-500">ĐIỂM</div></div>
              <div className="rounded-2xl bg-slate-950/55 border border-white/10 p-3"><div className="text-xl mt-0.5">🟡</div><div className="text-xl font-black text-amber-300">+{result.awardedCoins}</div><div className="text-[9px] font-black text-slate-500">XU NOVA</div></div>
            </div>
            <button onClick={playNextStage} className="mt-5 w-full min-h-14 rounded-2xl bg-gradient-to-b from-amber-300 to-orange-500 border-2 border-amber-100 text-amber-950 font-black flex items-center justify-center gap-2 active:scale-95"><Play className="w-5 h-5 fill-current" /> MÀN TIẾP THEO · {RUNNER_BALANCE.retryEnergyCost} ⚡</button>
            <button onClick={restartRun} className="mt-3 w-full min-h-12 rounded-2xl bg-slate-800 border border-slate-600 font-black text-sm flex items-center justify-center gap-2 active:scale-95"><RotateCcw className="w-4 h-4" /> BAY LẠI MÀN {selectedStage} · {RUNNER_BALANCE.retryEnergyCost} ⚡</button>
            <button onClick={quitRun} className="mt-3 w-full min-h-12 rounded-2xl bg-white/8 border border-white/15 text-white font-black flex items-center justify-center gap-2 active:scale-95"><ChevronLeft className="w-4 h-4" /> VỀ TRANG CHỦ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsteroidRunnerGame;
