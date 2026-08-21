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
  getDamageMultiplier,
  getMoveSpeed,
  getResponsiveness,
  getRunnerShip,
} from './asteroidRunnerConfig';

type RunnerPhase = 'lobby' | 'playing' | 'boss' | 'wormhole' | 'paused' | 'gameover' | 'victory';
type LivePhase = 'playing' | 'boss' | 'wormhole';

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

const EMPTY_HUD: HudState = {
  hp: 1,
  maxHp: 1,
  score: 0,
  coins: 0,
  progress: 0,
  combo: 0,
  orbiterCount: 0,
  slowSeconds: 0,
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
  crystal: new THREE.MeshStandardMaterial({ color: '#8c69e8', emissive: '#351884', emissiveIntensity: 1.35, roughness: 0.48, metalness: 0.52, vertexColors: true, flatShading: true }),
};
const BULLET_GEOMETRY = new THREE.CapsuleGeometry(1, 2.6, 4, 8);
const ORBITER_GEOMETRY = new THREE.OctahedronGeometry(0.18, 0);
const PICKUP_COIN_GEOMETRY = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 18);
const PICKUP_POWER_GEOMETRY = new THREE.OctahedronGeometry(0.3, 0);
const BURST_DISC_GEOMETRY = new THREE.CircleGeometry(0.32, 12);
const BURST_RING_GEOMETRY = new THREE.RingGeometry(0.45, 0.56, 24);
const CRATER_GEOMETRY = new THREE.RingGeometry(0.5, 1, 10);
const CRYSTAL_CORE_GEOMETRY = new THREE.OctahedronGeometry(1, 0);
const TITAN_SHOCK_GEOMETRY = new THREE.TorusGeometry(1.08, 0.045, 8, 56);
const TITAN_SHOCK_OUTER_GEOMETRY = new THREE.TorusGeometry(1.08, 0.025, 6, 48);
const WORMHOLE_TORUS_GEOMETRY = new THREE.TorusGeometry(1.4, 0.3, 14, 48);
const WORMHOLE_CORE_GEOMETRY = new THREE.CircleGeometry(1.12, 40);
const BULLET_MATERIALS = new Map<string, THREE.MeshBasicMaterial>([
  '#55f6ff', '#b66cff', '#ffd84f', '#48ffbd', '#ff824d',
].map((color) => [color, new THREE.MeshBasicMaterial({ color, toneMapped: false })]));
const PICKUP_MATERIALS: Record<PickupEntity['kind'], THREE.MeshStandardMaterial> = {
  coin: new THREE.MeshStandardMaterial({ color: '#ffd447', emissive: '#bd7300', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
  heal: new THREE.MeshStandardMaterial({ color: '#4cff9d', emissive: '#175bd8', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
  slow: new THREE.MeshStandardMaterial({ color: '#55e6ff', emissive: '#175bd8', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
  orbiter: new THREE.MeshStandardMaterial({ color: '#c47aff', emissive: '#4c1d95', emissiveIntensity: 2.4, metalness: 0.65, roughness: 0.2 }),
};
const ORBITER_MATERIALS = [
  new THREE.MeshStandardMaterial({ color: '#75f5ff', emissive: '#27bddd', emissiveIntensity: 2.5 }),
  new THREE.MeshStandardMaterial({ color: '#f8d35b', emissive: '#c78313', emissiveIntensity: 2.5 }),
];
const CRATER_MATERIAL = new THREE.MeshBasicMaterial({ color: '#171923', transparent: true, opacity: 0.58, depthWrite: false });
const CRYSTAL_CORE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#bb9cff', transparent: true, opacity: 0.34, toneMapped: false });
const TITAN_SHOCK_MATERIAL = new THREE.MeshBasicMaterial({ color: '#7df7ff', transparent: true, opacity: 0.72, depthWrite: false, toneMapped: false });
const TITAN_SHOCK_OUTER_MATERIAL = new THREE.MeshBasicMaterial({ color: '#ffb35c', transparent: true, opacity: 0.46, depthWrite: false, toneMapped: false });
const WORMHOLE_TORUS_MATERIAL = new THREE.MeshStandardMaterial({ color: '#8a5cff', emissive: '#4c1dcb', emissiveIntensity: 4, toneMapped: false });
const WORMHOLE_CORE_MATERIAL = new THREE.MeshBasicMaterial({ color: '#39e8ff', transparent: true, opacity: 0.42, depthWrite: false, toneMapped: false });
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

const ParallaxStarfield: React.FC<{ playerX: React.MutableRefObject<{ x: number }> }> = ({ playerX }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.2, -0.7, -2]} scale={[5.5, 8, 1]}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color="#173c79" transparent opacity={0.18} depthWrite={false} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.6, -0.68, 3]} scale={[4.5, 7, 1]}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial color="#6d28a8" transparent opacity={0.14} depthWrite={false} />
    </mesh>
    <ParallaxStarLayer playerX={playerX} count={110} speed={0.42} size={1.25} color="#7898c9" depth={-0.62} />
    <ParallaxStarLayer playerX={playerX} count={72} speed={0.9} size={1.7} color="#d9ecff" depth={-0.42} />
    <ParallaxStarLayer playerX={playerX} count={42} speed={1.55} size={2.2} color="#a5f3fc" depth={-0.2} />
  </group>
);

const SceneAssetPrewarmer: React.FC = () => (
  <group position={[0, -4, 0]} scale={0.001} dispose={null}>
    {(['rock', 'hard', 'crystal'] as AsteroidMaterial[]).map((kind, index) => (
      <mesh key={kind} geometry={ASTEROID_GEOMETRIES[index]} material={ASTEROID_MATERIALS[kind]} />
    ))}
    {[...BULLET_MATERIALS.values()].map((material) => <mesh key={material.uuid} geometry={BULLET_GEOMETRY} material={material} />)}
    {Object.values(PICKUP_MATERIALS).map((material, index) => <mesh key={material.uuid} geometry={index === 0 ? PICKUP_COIN_GEOMETRY : PICKUP_POWER_GEOMETRY} material={material} />)}
    {ORBITER_MATERIALS.map((material) => <mesh key={material.uuid} geometry={ORBITER_GEOMETRY} material={material} />)}
    <mesh geometry={CRATER_GEOMETRY} material={CRATER_MATERIAL} />
    <mesh geometry={CRYSTAL_CORE_GEOMETRY} material={CRYSTAL_CORE_MATERIAL} />
    <mesh geometry={TITAN_SHOCK_GEOMETRY} material={TITAN_SHOCK_MATERIAL} />
    <mesh geometry={TITAN_SHOCK_OUTER_GEOMETRY} material={TITAN_SHOCK_OUTER_MATERIAL} />
    <mesh geometry={WORMHOLE_TORUS_GEOMETRY} material={WORMHOLE_TORUS_MATERIAL} />
    <mesh geometry={WORMHOLE_CORE_GEOMETRY} material={WORMHOLE_CORE_MATERIAL} />
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
}> = ({ ship, color, input, simPosition, visible, orbiterCount, orbiterPositions }) => {
  const group = useRef<THREE.Group>(null);
  const leftOrbiter = useRef<THREE.Group>(null);
  const rightOrbiter = useRef<THREE.Group>(null);
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
  onHud,
  onBossStarted,
  onWormholeStarted,
  onGameOver,
  onVictory,
  onFeedback,
  debugFast = false,
}) => {
  const [, setEntityVersion] = useState(0);
  const bulletRefs = useRef(new Map<number, THREE.Mesh>());
  const asteroidRefs = useRef(new Map<number, THREE.Group>());
  const pickupRefs = useRef(new Map<number, THREE.Group>());
  const burstRefs = useRef(new Map<number, THREE.Mesh>());
  const playerPosition = useRef({ x: 0, y: -5.6, vx: 0, vy: 0, invulnerable: 0 });
  const orbiterPositions = useRef([{ x: -0.9, y: -6.05 }, { x: 0.9, y: -6.05 }]);
  const stageDuration = debugFast ? 4 : RUNNER_BALANCE.stageDurationSeconds;
  const bossEntryDuration = debugFast ? 0.45 : RUNNER_BALANCE.bossEntrySeconds;
  const wormholeTimeout = debugFast ? 1.25 : RUNNER_BALANCE.wormholeTimeoutSeconds;
  const simRef = useRef({
    id: 0,
    elapsed: 0,
    spawnClock: 0,
    fireClock: 0,
    hudClock: 0,
    bossEntry: 0,
    wormholeClock: 0,
    hp: ship.shield,
    maxHp: ship.shield,
    score: 0,
    coins: 0,
    combo: 0,
    comboClock: 0,
    orbiterCount: 0,
    slowTime: 0,
    mode: 'playing' as LivePhase,
    bossId: null as number | null,
    bullets: [] as BulletEntity[],
    asteroids: [] as AsteroidEntity[],
    pickups: [] as PickupEntity[],
    bursts: [] as BurstEntity[],
  });

  const bumpEntities = useCallback(() => setEntityVersion((value) => value + 1), []);

  useEffect(() => {
    simRef.current = {
      id: 0, elapsed: 0, spawnClock: 0, fireClock: 0, hudClock: 0, bossEntry: 0, wormholeClock: 0,
      hp: ship.shield, maxHp: ship.shield, score: 0, coins: 0, combo: 0, comboClock: 0,
      orbiterCount: 0, slowTime: 0, mode: 'playing', bossId: null,
      bullets: [], asteroids: [], pickups: [], bursts: [],
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
    sim.pickups.push({ id: ++sim.id, x, y, vy: -1.25, kind, value });
  }, []);

  const createAsteroid = useCallback((tier: AsteroidTier, x: number, y: number, material?: AsteroidMaterial, vx = 0) => {
    const sim = simRef.current;
    if (tier !== 'titan' && sim.asteroids.filter((item) => !item.dead).length >= RUNNER_BALANCE.maxAsteroids) return null;
    const chosenMaterial: AsteroidMaterial = material || (Math.random() < 0.14 ? 'crystal' : Math.random() < 0.36 ? 'hard' : 'rock');
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
    soundService.playGameExplosion(asteroid.radius);
    sim.score += Math.round(asteroid.maxHp * 1.6) + sim.combo * 4;
    sim.combo = Math.min(12, sim.combo + 1);
    sim.comboClock = 2.4;

    if (asteroid.tier === 'titan') {
      sim.coins += ASTEROID_STATS.titan.coins;
      sim.mode = 'wormhole';
      sim.wormholeClock = 0;
      soundService.playWormhole();
      onWormholeStarted();
      onFeedback('power', 'CỔNG CHIẾN THẮNG ĐÃ MỞ!');
      bumpEntities();
      return;
    }

    const baseCoins = ASTEROID_STATS[asteroid.tier].coins;
    addPickup(asteroid.x, asteroid.y, 'coin', baseCoins);
    const dropRoll = Math.random();
    if (dropRoll < 0.035) addPickup(asteroid.x + 0.3, asteroid.y, 'heal', 24);
    else if (dropRoll < 0.065) addPickup(asteroid.x - 0.3, asteroid.y, 'slow', 7);
    else if (dropRoll < 0.09 && sim.orbiterCount < 2) addPickup(asteroid.x, asteroid.y, 'orbiter', 1);

    if (asteroid.tier === 'large') {
      createAsteroid('medium', asteroid.x - 0.28, asteroid.y, asteroid.material, -0.9);
      createAsteroid('medium', asteroid.x + 0.28, asteroid.y, asteroid.material, 0.9);
    } else if (asteroid.tier === 'medium') {
      createAsteroid('small', asteroid.x - 0.18, asteroid.y, asteroid.material, -1.15);
      createAsteroid('small', asteroid.x + 0.18, asteroid.y, asteroid.material, 1.15);
    }
    bumpEntities();
  }, [addBurst, addPickup, bumpEntities, createAsteroid, onFeedback, onWormholeStarted]);

  const fireWeapon = useCallback(() => {
    const sim = simRef.current;
    if (sim.bullets.length >= RUNNER_BALANCE.maxBullets) return;
    const player = playerPosition.current;
    const weapon = ship.weapon;
    const damage = weapon.damage * getDamageMultiplier(ship);
    const add = (offsetX: number, angle = 0, damageScale = 1, radius = 0.12, origin?: { x: number; y: number }) => {
      const speed = weapon.projectileSpeed;
      sim.bullets.push({
        id: ++sim.id,
        x: (origin?.x ?? player.x) + offsetX,
        y: (origin?.y ?? player.y) + (origin ? 0.18 : 0.9),
        vx: Math.sin(angle) * speed,
        vy: Math.cos(angle) * speed,
        radius,
        damage: damage * damageScale,
        color: weapon.color,
        aoe: weapon.aoe,
        ttl: 1.6,
      });
    };

    if (weapon.kind === 'twin') {
      add(-0.38); add(0.38);
    } else if (weapon.kind === 'spread') {
      add(0, -0.25); add(0, 0); add(0, 0.25);
    } else if (weapon.kind === 'cluster') {
      add(0, 0, 1, 0.22);
    } else if (weapon.kind === 'missile') {
      add(0, 0, 1, 0.17);
    } else {
      add(0);
    }

    if (sim.orbiterCount >= 1) add(0, 0, 0.5, 0.09, orbiterPositions.current[0]);
    if (sim.orbiterCount >= 2) add(0, 0, 0.5, 0.09, orbiterPositions.current[1]);
    soundService.playGameShot(weapon.kind);
    bumpEntities();
  }, [bumpEntities, ship]);

  const publishHud = useCallback(() => {
    const sim = simRef.current;
    const boss = sim.bossId === null ? undefined : sim.asteroids.find((item) => item.id === sim.bossId);
    onHud({
      hp: Math.max(0, Math.round(sim.hp)),
      maxHp: sim.maxHp,
      score: Math.floor(sim.score),
      coins: sim.coins,
      progress: sim.mode === 'playing' ? clamp(sim.elapsed / stageDuration, 0, 1) : 1,
      combo: sim.combo,
      orbiterCount: sim.orbiterCount,
      slowSeconds: Math.ceil(sim.slowTime),
      bossHp: boss ? Math.max(0, Math.ceil(boss.hp)) : 0,
      bossMaxHp: boss?.maxHp || RUNNER_BALANCE.bossHp,
    });
  }, [onHud, stageDuration]);

  useFrame((_, rawDelta) => {
    const active = phase === 'playing' || phase === 'boss' || phase === 'wormhole';
    if (!active) return;
    const dt = Math.min(rawDelta, 1 / 30);
    const sim = simRef.current;
    const player = playerPosition.current;
    const entitySlow = sim.slowTime > 0 ? 0.52 : 1;
    const lowHpAssist = sim.hp / sim.maxHp < RUNNER_BALANCE.lowHpAssistThreshold;
    let entitiesChanged = false;

    if (player.invulnerable > 0) player.invulnerable -= dt;
    if (sim.slowTime > 0) sim.slowTime -= dt;
    sim.comboClock -= dt;
    if (sim.comboClock <= 0 && sim.combo > 0) sim.combo = 0;

    const keys = input.current.keys;
    const axisX = (keys.has('ArrowRight') || keys.has('KeyD') ? 1 : 0) - (keys.has('ArrowLeft') || keys.has('KeyA') ? 1 : 0);
    const axisY = (keys.has('ArrowUp') || keys.has('KeyW') ? 1 : 0) - (keys.has('ArrowDown') || keys.has('KeyS') ? 1 : 0);
    if (axisX || axisY) {
      const keySpeed = getMoveSpeed(ship);
      input.current.targetX = clamp(input.current.targetX + axisX * keySpeed * dt, -RUNNER_BALANCE.worldHalfWidth + 0.65, RUNNER_BALANCE.worldHalfWidth - 0.65);
      input.current.targetY = clamp(input.current.targetY + axisY * keySpeed * dt, RUNNER_BALANCE.worldBottom + 1.15, 4.15);
    }
    const response = 1 - Math.exp(-getResponsiveness(ship) * dt);
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
      sim.fireClock = ship.weapon.fireInterval;
    }

    if (sim.mode === 'playing') {
      sim.elapsed += dt;
      sim.spawnClock -= dt;
      const progress = clamp(sim.elapsed / stageDuration, 0, 1);
      const baseInterval = THREE.MathUtils.lerp(0.92, 0.47, progress);
      if (sim.spawnClock <= 0 && sim.asteroids.length < RUNNER_BALANCE.maxAsteroids) {
        const tierRoll = Math.random();
        const tier: AsteroidTier = progress > 0.5 && tierRoll < 0.14 ? 'large' : tierRoll < 0.48 ? 'medium' : 'small';
        const radius = ASTEROID_STATS[tier].radius;
        createAsteroid(tier, THREE.MathUtils.randFloat(-RUNNER_BALANCE.worldHalfWidth + radius, RUNNER_BALANCE.worldHalfWidth - radius), RUNNER_BALANCE.worldTop + 1.4);
        sim.spawnClock = baseInterval * (lowHpAssist ? 1.28 : 1) * THREE.MathUtils.randFloat(0.82, 1.18);
        entitiesChanged = true;
      }
      if (sim.elapsed >= stageDuration) {
        sim.mode = 'boss';
        sim.bossEntry = 0;
        soundService.playBossAlarmSiren();
        onFeedback('boss', 'THIÊN THẠCH CỔ ĐẠI!');
        onBossStarted();
      }
    } else if (sim.mode === 'boss' && sim.bossId === null) {
      sim.bossEntry += dt;
      if (sim.bossEntry >= bossEntryDuration) {
        const boss = createAsteroid('titan', 0, RUNNER_BALANCE.worldTop + ASTEROID_STATS.titan.radius + 0.8, 'crystal');
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
      input.current.targetX = THREE.MathUtils.lerp(input.current.targetX, 0, dt * 0.8);
      input.current.targetY = THREE.MathUtils.lerp(input.current.targetY, 4.2, dt * 0.55);
      if (distanceSquared(player.x, player.y, 0, 4.2) < 1.45 ** 2 || sim.wormholeClock >= wormholeTimeout) {
        const snapshot: RunSnapshot = {
          hp: sim.hp, maxHp: sim.maxHp, score: sim.score, coins: sim.coins, progress: 1,
          combo: sim.combo, orbiterCount: sim.orbiterCount, slowSeconds: sim.slowTime,
          bossHp: 0, bossMaxHp: RUNNER_BALANCE.bossHp, mode: 'wormhole',
        };
        onVictory(snapshot);
        return;
      }
    }

    sim.bullets.forEach((bullet) => {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.ttl -= dt;
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

    sim.bullets.forEach((bullet) => {
      if (bullet.dead) return;
      for (const asteroid of sim.asteroids) {
        if (asteroid.dead) continue;
        const hitRadius = asteroid.radius * 0.82 + bullet.radius + 0.12;
        if (distanceSquared(bullet.x, bullet.y, asteroid.x, asteroid.y) > hitRadius ** 2) continue;
        bullet.dead = true;
        asteroid.hp -= bullet.damage;
        sim.score += Math.ceil(bullet.damage * 0.35);
        addBurst(bullet.x, bullet.y, bullet.color, bullet.radius * 3.2);
        soundService.playGameImpact(clamp(bullet.damage / 35, 0.2, 1));

        if (bullet.aoe > 0) {
          sim.asteroids.forEach((nearby) => {
            if (nearby.dead || nearby.id === asteroid.id) return;
            if (distanceSquared(asteroid.x, asteroid.y, nearby.x, nearby.y) <= (bullet.aoe + nearby.radius) ** 2) {
              nearby.hp -= bullet.damage * 0.55;
              if (nearby.hp <= 0) destroyAsteroid(nearby);
            }
          });
          addBurst(asteroid.x, asteroid.y, bullet.color, bullet.aoe, true);
        }
        if (asteroid.hp <= 0) destroyAsteroid(asteroid);
        break;
      }
    });

    if (player.invulnerable <= 0 && sim.mode !== 'wormhole') {
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
            progress: sim.mode === 'playing' ? clamp(sim.elapsed / stageDuration, 0, 1) : 1,
            combo: sim.combo, orbiterCount: sim.orbiterCount, slowSeconds: sim.slowTime,
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
        if (pickup.kind === 'coin') {
          sim.coins = Math.min(RUNNER_BALANCE.runCoinCap, sim.coins + pickup.value);
          soundService.playCoin();
        } else if (pickup.kind === 'heal') {
          sim.hp = Math.min(sim.maxHp, sim.hp + Math.max(pickup.value, sim.maxHp * 0.25));
          soundService.playGamePowerUp();
          onFeedback('power', 'HỒI GIÁP +25%');
        } else if (pickup.kind === 'slow') {
          sim.slowTime = Math.max(sim.slowTime, pickup.value);
          soundService.playGamePowerUp();
          onFeedback('power', 'THỜI GIAN CHẬM');
        } else if (pickup.kind === 'orbiter') {
          sim.orbiterCount = Math.min(2, sim.orbiterCount + 1);
          soundService.playGamePowerUp();
          onFeedback('power', `VỆ TINH ${sim.orbiterCount}/2`);
        }
        addBurst(pickup.x, pickup.y, pickup.kind === 'coin' ? '#ffd84f' : '#55f6ff', 0.8, true);
      } else if (pickup.y < RUNNER_BALANCE.worldBottom - 1.5) pickup.dead = true;
    });

    sim.bursts.forEach((burst) => {
      burst.life -= dt;
      if (burst.life <= 0) burst.dead = true;
    });

    const before = sim.bullets.length + sim.asteroids.length + sim.pickups.length + sim.bursts.length;
    sim.bullets = sim.bullets.filter((item) => !item.dead);
    sim.asteroids = sim.asteroids.filter((item) => !item.dead);
    sim.pickups = sim.pickups.filter((item) => !item.dead);
    sim.bursts = sim.bursts.filter((item) => !item.dead);
    const after = sim.bullets.length + sim.asteroids.length + sim.pickups.length + sim.bursts.length;
    if (before !== after) entitiesChanged = true;

    sim.bullets.forEach((bullet) => bulletRefs.current.get(bullet.id)?.position.set(bullet.x, 0.28, -bullet.y));
    sim.asteroids.forEach((asteroid) => {
      const node = asteroidRefs.current.get(asteroid.id);
      if (!node) return;
      node.position.set(asteroid.x, 0.1, -asteroid.y);
      node.rotation.y = asteroid.rotation;
      node.rotation.z = asteroid.rotation * 0.6;
    });
    sim.pickups.forEach((pickup) => {
      const node = pickupRefs.current.get(pickup.id);
      if (!node) return;
      node.position.set(pickup.x, 0.42, -pickup.y);
      node.rotation.y += dt * 2.6;
    });
    sim.bursts.forEach((burst) => {
      const node = burstRefs.current.get(burst.id);
      if (!node) return;
      node.position.set(burst.x, 0.48, -burst.y);
      const normalized = 1 - burst.life / burst.maxLife;
      node.scale.setScalar((0.25 + normalized * 1.25) * burst.size);
      const material = node.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 1 - normalized);
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
      <ParallaxStarfield playerX={playerPosition} />
      <SceneAssetPrewarmer />

      <PlayerModel
        ship={ship}
        color={shipColor}
        input={input}
        simPosition={playerPosition}
        visible={phase !== 'gameover'}
        orbiterCount={sim.orbiterCount}
        orbiterPositions={orbiterPositions}
      />

      {sim.bullets.map((bullet) => (
        <mesh
          key={bullet.id}
          ref={(node) => { if (node) bulletRefs.current.set(bullet.id, node); else bulletRefs.current.delete(bullet.id); }}
          position={[bullet.x, 0.28, -bullet.y]}
          geometry={BULLET_GEOMETRY}
          material={BULLET_MATERIALS.get(bullet.color) || BULLET_MATERIALS.get('#55f6ff')}
          scale={bullet.radius}
          dispose={null}
        >
        </mesh>
      ))}

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
            {asteroid.material === 'crystal' && <mesh scale={0.72}>
              <primitive object={CRYSTAL_CORE_GEOMETRY} attach="geometry" />
              <primitive object={CRYSTAL_CORE_MATERIAL} attach="material" />
            </mesh>}
            {asteroid.tier === 'titan' && (
              <group position={[0, 0.05, 0.78]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.25, 0.78, 1]}>
                  <primitive object={TITAN_SHOCK_GEOMETRY} attach="geometry" />
                  <primitive object={TITAN_SHOCK_MATERIAL} attach="material" />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.42, 0.9, 1]}>
                  <primitive object={TITAN_SHOCK_OUTER_GEOMETRY} attach="geometry" />
                  <primitive object={TITAN_SHOCK_OUTER_MATERIAL} attach="material" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {sim.pickups.map((pickup) => (
        <group
          key={pickup.id}
          ref={(node) => { if (node) pickupRefs.current.set(pickup.id, node); else pickupRefs.current.delete(pickup.id); }}
          position={[pickup.x, 0.42, -pickup.y]}
        >
          <mesh
            geometry={pickup.kind === 'coin' ? PICKUP_COIN_GEOMETRY : PICKUP_POWER_GEOMETRY}
            material={PICKUP_MATERIALS[pickup.kind]}
            dispose={null}
          />
        </group>
      ))}

      {sim.bursts.map((burst) => (
        <mesh
          key={burst.id}
          ref={(node) => { if (node) burstRefs.current.set(burst.id, node); else burstRefs.current.delete(burst.id); }}
          position={[burst.x, 0.48, -burst.y]}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={burst.ring ? BURST_RING_GEOMETRY : BURST_DISC_GEOMETRY}
          dispose={null}
        >
          <meshBasicMaterial color={burst.color} transparent opacity={0.9} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}

      <Wormhole visible={wormholeVisible} x={0} y={4.2} />
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
  } = useGameStore();
  const unlocked = user.customization.unlockedShips;
  const initialShipId = RUNNER_SHIPS.some((ship) => ship.id === user.customization.equippedShip && unlocked.includes(ship.id))
    ? user.customization.equippedShip
    : RUNNER_SHIPS.find((ship) => unlocked.includes(ship.id))?.id || RUNNER_SHIPS[0].id;
  const [selectedShipId, setSelectedShipId] = useState(initialShipId);
  const selectedShip = getRunnerShip(selectedShipId);
  const [phase, setPhase] = useState<RunnerPhase>('lobby');
  const [runKey, setRunKey] = useState(0);
  const [continueToken, setContinueToken] = useState(0);
  const [hud, setHud] = useState<HudState>({ ...EMPTY_HUD, hp: selectedShip.shield, maxHp: selectedShip.shield });
  const [result, setResult] = useState<RunResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: string; message?: string; id: number } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
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
  const debugFast = import.meta.env.DEV && new URLSearchParams(window.location.search).get('runnerDebug') === 'fast';

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

  const settle = useCallback((snapshot: Pick<RunSnapshot, 'score' | 'coins'>, won: boolean) => {
    if (settledRef.current) return null;
    settledRef.current = true;
    const award = finishMiniGameRun({ won, score: snapshot.score, collectedCoins: snapshot.coins });
    const nextResult: RunResult = {
      won,
      score: Math.floor(snapshot.score),
      collectedCoins: snapshot.coins,
      awardedCoins: award.awardedCoins,
      isBest: award.isBest,
    };
    setResult(nextResult);
    return nextResult;
  }, [finishMiniGameRun]);

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
    if (!settledRef.current && phase !== 'lobby') settle({ score: hud.score, coins: hud.coins }, false);
    soundService.setBgmStyle(settings.bgmStyle);
    soundService.stopShipEngine(0.35);
    onExit();
  }, [hud.coins, hud.score, onExit, phase, settle, settings.bgmStyle]);

  const restartRun = useCallback(() => {
    if (!settledRef.current) settle({ score: hud.score, coins: hud.coins }, false);
    startRun();
  }, [hud.coins, hud.score, settle, startRun]);

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
            <div className="text-center">
              <div className="text-[10px] font-black tracking-[0.28em] text-cyan-300">NOVA ARCADE</div>
              <h1 className="text-base sm:text-lg font-black text-white">Vượt Dải Thiên Thạch</h1>
            </div>
            <div className="h-11 px-3 rounded-2xl bg-amber-500/15 border border-amber-300/30 flex items-center gap-1.5 font-black text-xs text-amber-200">
              <Zap className="w-4 h-4 fill-amber-300" /> {user.energy}
            </div>
          </div>

          <div className="relative flex-1 min-h-0 my-3 rounded-[30px] overflow-hidden border border-cyan-300/20 bg-slate-950/60 shadow-[0_0_50px_rgba(56,189,248,0.16)]">
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

          <div className="shrink-0 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
              {RUNNER_SHIPS.map((ship) => {
                const isUnlocked = unlocked.includes(ship.id);
                const selected = ship.id === selectedShip.id;
                return (
                  <button
                    key={ship.id}
                    disabled={!isUnlocked}
                    onClick={() => { setSelectedShipId(ship.id); interactionService.playSelect(); }}
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
            <button
              onClick={startRun}
              className="w-full min-h-[58px] rounded-2xl bg-gradient-to-b from-amber-300 via-yellow-400 to-orange-500 text-amber-950 border-2 border-yellow-100 font-black shadow-[0_6px_0_#b45309,0_0_26px_rgba(251,191,36,0.28)] active:translate-y-1 active:shadow-[0_2px_0_#b45309] transition-all flex items-center justify-center gap-2"
              data-testid="asteroid-runner-start"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{freeRunAvailable ? 'CẤT CÁNH MIỄN PHÍ' : `CẤT CÁNH · ${RUNNER_BALANCE.retryEnergyCost} NĂNG LƯỢNG`}</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 font-bold">Lượt đầu mỗi ngày miễn phí · Mục tiêu 2–3 phút</p>
          </div>
        </div>
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
        dpr={[1, 1.5]}
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
            <span className="text-[9px] font-black text-slate-300 tracking-wider">DẢI THIÊN THẠCH</span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-amber-300" style={{ width: `${displayedHud.progress * 100}%` }} /></div>
            <span className="text-[10px] font-black text-cyan-200">{Math.floor(displayedHud.progress * 100)}%</span>
          </div>
        )}

        <div className="mt-2 flex gap-1.5 justify-end">
          {displayedHud.combo > 1 && <div className="rounded-full bg-amber-400/20 border border-amber-300/30 px-2 py-1 text-[10px] font-black text-amber-200">COMBO ×{displayedHud.combo}</div>}
          {displayedHud.orbiterCount > 0 && <div className="rounded-full bg-cyan-400/15 border border-cyan-300/30 px-2 py-1 text-[10px] font-black text-cyan-100">VỆ TINH {displayedHud.orbiterCount}/2</div>}
          {displayedHud.slowSeconds > 0 && <div className="rounded-full bg-purple-400/15 border border-purple-300/30 px-2 py-1 text-[10px] font-black text-purple-100">SLOW {displayedHud.slowSeconds}s</div>}
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
            <p className="text-xs text-slate-300 font-bold mt-1">Bé đã mở được {Math.floor(hud.progress * 100)}% tuyến đường.</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3"><div className="text-[10px] text-slate-500 font-black">ĐIỂM</div><div className="text-lg text-cyan-200 font-black">{hud.score.toLocaleString('vi-VN')}</div></div>
              <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3"><div className="text-[10px] text-slate-500 font-black">XU ĐÃ NHẶT</div><div className="text-lg text-amber-300 font-black">{hud.coins}</div></div>
            </div>
            {notice && <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-500/15 p-2.5 text-xs font-black text-rose-100">{notice}</div>}
            <button onClick={continueRun} className="mt-4 w-full min-h-14 rounded-2xl bg-gradient-to-b from-emerald-300 to-emerald-600 border-2 border-emerald-100 text-emerald-950 font-black active:scale-95">HỒI ĐẦY GIÁP · {RUNNER_BALANCE.continueEnergyCost} ⚡</button>
            <button onClick={restartRun} className="mt-3 w-full min-h-12 rounded-2xl bg-slate-800 border border-slate-600 font-black text-sm flex items-center justify-center gap-2 active:scale-95"><RotateCcw className="w-4 h-4" /> CHƠI LẠI TỪ ĐẦU</button>
            <button onClick={quitRun} className="mt-3 text-xs font-black text-slate-400 underline underline-offset-4">NHẬN 50% XU & RỜI TRẬN</button>
          </div>
        </div>
      )}

      {phase === 'victory' && result && (
        <div className="absolute inset-0 z-40 bg-[#020713]/86 backdrop-blur-xl flex items-center justify-center p-5" onPointerDown={(event) => event.stopPropagation()}>
          <div className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-[#142954] via-[#111331] to-[#1b0b2d] border-2 border-amber-300/45 p-5 shadow-[0_0_60px_rgba(251,191,36,0.22)] text-center">
            <div className="text-5xl animate-bounce-slow">🏆</div>
            <div className="text-[10px] font-black tracking-[0.28em] text-amber-300 mt-3">MISSION COMPLETE</div>
            <h2 className="text-2xl font-black text-white mt-1">Dải Thiên Thạch Đã Mở!</h2>
            {result.isBest && <div className="inline-flex mt-2 rounded-full bg-purple-500/20 border border-purple-300/30 px-3 py-1 text-[10px] font-black text-purple-100"><Sparkles className="w-3 h-3 mr-1" /> KỶ LỤC MỚI</div>}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <div className="rounded-2xl bg-slate-950/55 border border-white/10 p-3"><Gauge className="w-5 h-5 mx-auto text-cyan-300" /><div className="text-xl font-black text-white mt-1">{result.score.toLocaleString('vi-VN')}</div><div className="text-[9px] font-black text-slate-500">ĐIỂM</div></div>
              <div className="rounded-2xl bg-slate-950/55 border border-white/10 p-3"><div className="text-xl mt-0.5">🟡</div><div className="text-xl font-black text-amber-300">+{result.awardedCoins}</div><div className="text-[9px] font-black text-slate-500">XU NOVA</div></div>
            </div>
            <button onClick={restartRun} className="mt-5 w-full min-h-14 rounded-2xl bg-gradient-to-b from-amber-300 to-orange-500 border-2 border-amber-100 text-amber-950 font-black flex items-center justify-center gap-2 active:scale-95"><RotateCcw className="w-5 h-5" /> BAY LẠI</button>
            <button onClick={quitRun} className="mt-3 w-full min-h-12 rounded-2xl bg-white/8 border border-white/15 text-white font-black flex items-center justify-center gap-2 active:scale-95"><ChevronLeft className="w-4 h-4" /> VỀ TRANG CHỦ</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsteroidRunnerGame;
