import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PlanetData, PlanetCoordinateNode } from '../../types';
import { LessonCoordinatesMarker } from './LessonCoordinatesMarker';
import { useGameStore } from '../../stores/useGameStore';

interface Props {
  planet: PlanetData;
  radius?: number;
  onSelectNode: (node: PlanetCoordinateNode) => void;
}

// Procedural Realistic Planetary Geography Generator (Bắc/Nam Cực, Đại dương, Đồng cỏ, Dãy núi tuyết, Craters)
function generateRealisticPlanetTexture(planet: PlanetData): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // 1. BASE DEEP OCEAN (Đại dương xanh sâu thẳm)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0, '#0c4a6e'); // Biển băng lạnh phương Bắc
  oceanGrad.addColorStop(0.18, '#0369a1');
  oceanGrad.addColorStop(0.5, '#0284c7'); // Biển nhiệt đới xích đạo
  oceanGrad.addColorStop(0.82, '#0369a1');
  oceanGrad.addColorStop(1, '#0c4a6e'); // Biển băng lạnh phương Nam
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. CONTINENTS & GRASSLANDS (Lục địa & Đồng cỏ xanh tươi)
  const continents = [
    { cx: w * 0.22, cy: h * 0.45, rx: 160, ry: 90 },
    { cx: w * 0.65, cy: h * 0.4, rx: 190, ry: 105 },
    { cx: w * 0.45, cy: h * 0.68, rx: 130, ry: 75 },
    { cx: w * 0.88, cy: h * 0.58, rx: 140, ry: 80 },
    { cx: w * 0.08, cy: h * 0.65, rx: 95, ry: 55 },
  ];

  continents.forEach((cont) => {
    // 2a. Thềm lục địa / Vùng nước nông (Shallow waters / Cyan coast)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(cont.cx, cont.cy, cont.rx + 16, cont.ry + 12, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // 2b. Bờ cát / Đất màu lục địa (Coastal sand belt)
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(cont.cx, cont.cy, cont.rx + 6, cont.ry + 4, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // 2c. Đồng cỏ xanh tươi & Rừng cây (Lush green biomes)
    const landGrad = ctx.createRadialGradient(cont.cx, cont.cy, 10, cont.cx, cont.cy, cont.rx);
    landGrad.addColorStop(0, '#15803d');
    landGrad.addColorStop(0.45, '#16a34a');
    landGrad.addColorStop(0.8, '#22c55e');
    landGrad.addColorStop(1, '#65a30d');
    ctx.fillStyle = landGrad;
    ctx.beginPath();
    ctx.ellipse(cont.cx, cont.cy, cont.rx, cont.ry, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // 2d. Quần đảo nhỏ quanh bờ biển (Islands & Archipelagos)
    for (let a = 0; a < 6; a++) {
      const angle = (a / 6) * Math.PI * 2;
      const dist = cont.rx * 1.14 + (a * 7) % 20;
      const ix = cont.cx + Math.cos(angle) * dist;
      const iy = cont.cy + Math.sin(angle) * (dist * 0.6);
      if (iy > 75 && iy < h - 75) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ix, iy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(ix, iy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  // 3. MOUNTAIN RANGES & SNOW PEAKS (Dãy núi đá & Đỉnh phủ tuyết)
  const mountainChains = [
    { sx: w * 0.14, sy: h * 0.42, ex: w * 0.28, ey: h * 0.48 },
    { sx: w * 0.56, sy: h * 0.35, ex: w * 0.74, ey: h * 0.44 },
    { sx: w * 0.82, sy: h * 0.54, ex: w * 0.94, ey: h * 0.62 },
  ];

  mountainChains.forEach((chain) => {
    const steps = 12;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const mx = chain.sx + (chain.ex - chain.sx) * t + (Math.sin(s * 2.5) * 8);
      const my = chain.sy + (chain.ey - chain.sy) * t + (Math.cos(s * 2.5) * 6);
      const mSize = 13 + (s % 4) * 3;

      // Mountain rock base (Nâu xám đá)
      ctx.fillStyle = '#57534e';
      ctx.beginPath();
      ctx.arc(mx, my, mSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(mx - 2, my - 2, mSize * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Snow-capped peak (Đỉnh phủ băng tuyết trắng tinh)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mx - 1, my - 1, mSize * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 4. IMPACT CRATERS (Miệng hố va chạm thiên thạch đổ bóng nổi khối)
  const craterLocations = [
    { x: w * 0.35, y: h * 0.32, r: 16 },
    { x: w * 0.52, y: h * 0.62, r: 22 },
    { x: w * 0.78, y: h * 0.38, r: 14 },
    { x: w * 0.18, y: h * 0.58, r: 13 },
    { x: w * 0.48, y: h * 0.42, r: 11 },
    { x: w * 0.92, y: h * 0.48, r: 15 },
  ];

  craterLocations.forEach((cr) => {
    // Outer Ejecta Blanket (Vệt đất đá văng quanh hố)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cr.x, cr.y, cr.r * 1.3, 0, Math.PI * 2);
    ctx.stroke();

    // Crater Rim Highlight (Vành sáng nổi khối)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cr.x - 1, cr.y - 1, cr.r, 0, Math.PI * 2);
    ctx.stroke();

    // Crater Pit (Lòng hố trũng tối)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cr.x + 2, cr.y + 2, cr.r * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Central Peak (Đỉnh đá tâm hố)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cr.x, cr.y, cr.r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. POLAR ICE CAPS (Mũ băng tuyết Bắc Cực & Nam Cực rõ nét)
  // 5a. Bắc Cực (Top 0% - 15%)
  const northCap = ctx.createLinearGradient(0, 0, 0, 75);
  northCap.addColorStop(0, '#ffffff');
  northCap.addColorStop(0.7, '#f8fafc');
  northCap.addColorStop(0.9, '#bae6fd');
  northCap.addColorStop(1, 'transparent');
  ctx.fillStyle = northCap;
  ctx.fillRect(0, 0, w, 75);

  ctx.fillStyle = '#ffffff';
  for (let bx = 0; bx < w; bx += 28) {
    const by = 55 + Math.sin(bx * 0.05) * 14;
    ctx.beginPath();
    ctx.arc(bx, by, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5b. Nam Cực (Bottom 85% - 100%)
  const southCap = ctx.createLinearGradient(0, h - 75, 0, h);
  southCap.addColorStop(0, 'transparent');
  southCap.addColorStop(0.1, '#bae6fd');
  southCap.addColorStop(0.3, '#f8fafc');
  southCap.addColorStop(1, '#ffffff');
  ctx.fillStyle = southCap;
  ctx.fillRect(0, h - 75, w, 75);

  ctx.fillStyle = '#ffffff';
  for (let sx = 0; sx < w; sx += 28) {
    const sy = h - 55 - Math.sin(sx * 0.05) * 14;
    ctx.beginPath();
    ctx.arc(sx, sy, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Procedural Realistic Bump Map
function generateRealisticBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // Đại dương: Đáy phẳng tối
  ctx.fillStyle = '#202020';
  ctx.fillRect(0, 0, w, h);

  // Lục địa: Cao hơn mặt biển
  const continents = [
    { cx: w * 0.22, cy: h * 0.45, rx: 80, ry: 45 },
    { cx: w * 0.65, cy: h * 0.4, rx: 95, ry: 52 },
    { cx: w * 0.45, cy: h * 0.68, rx: 65, ry: 37 },
    { cx: w * 0.88, cy: h * 0.58, rx: 70, ry: 40 },
    { cx: w * 0.08, cy: h * 0.65, rx: 47, ry: 27 },
  ];

  continents.forEach((cont) => {
    const grad = ctx.createRadialGradient(cont.cx, cont.cy, 5, cont.cx, cont.cy, cont.rx);
    grad.addColorStop(0, '#959595');
    grad.addColorStop(0.8, '#707070');
    grad.addColorStop(1, '#202020');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cont.cx, cont.cy, cont.rx, cont.ry, 0.1, 0, Math.PI * 2);
    ctx.fill();
  });

  // Núi cao: Trắng sáng nổi gồ ghề
  for (let i = 0; i < 20; i++) {
    const mx = Math.random() * w;
    const my = (Math.random() * 0.5 + 0.25) * h;
    const r = 8 + Math.random() * 14;
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#b0b0b0');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters: Vành nhô cao (trắng), lòng trũng (đen)
  const craters = [
    { x: w * 0.35, y: h * 0.32, r: 8 },
    { x: w * 0.52, y: h * 0.62, r: 11 },
    { x: w * 0.78, y: h * 0.38, r: 7 },
    { x: w * 0.18, y: h * 0.58, r: 6 },
  ];

  craters.forEach((cr) => {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cr.x, cr.y, cr.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(cr.x, cr.y, cr.r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// Procedural Atmospheric Cloud Swirls
function generateCloudsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 28; i++) {
    const x = Math.random() * canvas.width;
    const y = (Math.random() * 0.7 + 0.15) * canvas.height;
    const rx = 60 + Math.random() * 120;
    const ry = 12 + Math.random() * 26;

    const grad = ctx.createRadialGradient(x, y, 2, x, y, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// Procedural Concentric Ring Texture
function generateRingTexture(ringColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.08, ringColor);
  grad.addColorStop(0.25, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.38, 'rgba(0,0,0,0.1)'); // Cassini division
  grad.addColorStop(0.46, ringColor);
  grad.addColorStop(0.72, 'rgba(255,245,180,0.95)');
  grad.addColorStop(0.88, ringColor);
  grad.addColorStop(1, 'transparent');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export const PlanetMesh: React.FC<Props> = ({ planet, radius = 1.0, onSelectNode }) => {
  const { isFlyingToNode, selectedCoordinateNode } = useGameStore();
  const planetGroupRef = useRef<THREE.Group>(null);
  const coreSphereRef = useRef<THREE.Mesh>(null);
  const cloudSphereRef = useRef<THREE.Mesh>(null);
  const moonOrbitGroupRef = useRef<THREE.Group>(null);

  // Manual Drag Rotation State
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: planet.rotationSpeed });
  const autoAligningRef = useRef(false);
  const targetRotationRef = useRef<THREE.Quaternion>(new THREE.Quaternion());

  const { gl } = useThree();

  // Procedural Textures Memoization
  const surfaceTexture = useMemo(
    () => generateRealisticPlanetTexture(planet),
    [planet.color, planet.glowColor, planet.type]
  );
  const bumpTexture = useMemo(() => generateRealisticBumpMap(), []);
  const cloudsTexture = useMemo(() => generateCloudsTexture(), []);
  const ringTexture = useMemo(
    () => generateRingTexture(planet.ringColor || '#fde047'),
    [planet.ringColor]
  );

  // Setup auto-align rotation when a target node is selected
  React.useEffect(() => {
    if (selectedCoordinateNode && isFlyingToNode && planetGroupRef.current) {
      autoAligningRef.current = true;

      // Desired orientation: bring (lat, lon) to face towards camera (+Z direction)
      const lat = selectedCoordinateNode.lat;
      const lon = selectedCoordinateNode.lon;

      // Compute required rotation to align (lat, lon) with (0, 0, +1)
      const targetQuat = new THREE.Quaternion();
      const euler = new THREE.Euler(-lat, -lon, 0, 'YXZ');
      targetQuat.setFromEuler(euler);

      targetRotationRef.current.copy(targetQuat);
    }
  }, [selectedCoordinateNode, isFlyingToNode]);

  // Pointer / Touch drag handlers for interactive 360 spinning
  React.useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      autoAligningRef.current = false;
      previousPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !planetGroupRef.current) return;

      const deltaX = e.clientX - previousPointerRef.current.x;
      const deltaY = e.clientY - previousPointerRef.current.y;
      previousPointerRef.current = { x: e.clientX, y: e.clientY };

      const rotateSpeed = 0.005;
      planetGroupRef.current.rotation.y += deltaX * rotateSpeed;
      planetGroupRef.current.rotation.x += deltaY * rotateSpeed;

      rotationVelocityRef.current = {
        x: deltaY * rotateSpeed * 0.5,
        y: deltaX * rotateSpeed * 0.5,
      };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!planetGroupRef.current) return;

    // 1. If auto-aligning to bring node to front:
    if (autoAligningRef.current) {
      planetGroupRef.current.quaternion.slerp(targetRotationRef.current, Math.min(1, delta * 3.5));
      // Check convergence
      if (planetGroupRef.current.quaternion.angleTo(targetRotationRef.current) < 0.03) {
        autoAligningRef.current = false;
        rotationVelocityRef.current = { x: 0, y: 0 };
      }
    } else if (!isDraggingRef.current) {
      // 2. Idle rotation + inertia damping
      planetGroupRef.current.rotation.y += rotationVelocityRef.current.y + planet.rotationSpeed * 0.4;
      planetGroupRef.current.rotation.x += rotationVelocityRef.current.x;

      // Damp velocities
      rotationVelocityRef.current.x *= 0.92;
      rotationVelocityRef.current.y *= 0.92;
    }

    // Independent Cloud layer rotation
    if (cloudSphereRef.current) {
      cloudSphereRef.current.rotation.y += 0.002;
    }

    // Moon continuous orbit revolution inside the synchronized planet group
    if (moonOrbitGroupRef.current) {
      moonOrbitGroupRef.current.rotation.y += 0.012;
    }
  });

  return (
    <group rotation={[planet.tiltAngle, 0, 0]}>
      {/* Main Rotatable System Group (Planet + Clouds + Rings + Moon ALL TOGETHER) */}
      <group ref={planetGroupRef}>
        {/* Core Terrain Sphere with Realistic Earth-like Geography */}
        <mesh ref={coreSphereRef}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={surfaceTexture}
            bumpMap={bumpTexture}
            bumpScale={0.05}
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>

        {/* Atmosphere Cloud Layer (Rotating Procedural Swirls) */}
        <mesh ref={cloudSphereRef} scale={[1.025, 1.025, 1.025]}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            opacity={0.4}
            roughness={0.9}
            depthWrite={false}
          />
        </mesh>

        {/* Atmospheric Glow Shell (Rim Lighting) */}
        <mesh scale={[1.06, 1.06, 1.06]}>
          <sphereGeometry args={[radius, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor || '#38bdf8'}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Synchronized Planetary Ring System (Inside Group to Rotate Synchronously) */}
        {planet.hasRings && (
          <mesh rotation={[Math.PI / 2 + 0.15, 0, 0]}>
            <ringGeometry args={[radius * 1.35, radius * 1.85, 80]} />
            <meshStandardMaterial
              map={ringTexture}
              color="#ffffff"
              transparent
              opacity={0.85}
              side={THREE.DoubleSide}
              roughness={0.3}
            />
          </mesh>
        )}

        {/* Synchronized Orbiting Moon / Satellite with Trail (Inside Group) */}
        {planet.hasMoon && (
          <group ref={moonOrbitGroupRef}>
            {/* Orbit path line */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 2.05 - 0.004, radius * 2.05 + 0.004, 64]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>

            {/* Moon Body */}
            <mesh position={[radius * 2.05, 0.15, 0]}>
              <sphereGeometry args={[0.11, 24, 24]} />
              <meshStandardMaterial
                map={bumpTexture}
                color={planet.moonColor || '#cbd5e1'}
                roughness={0.85}
                metalness={0.1}
              />
            </mesh>
          </group>
        )}

        {/* Minimalist Coordinate Markers Pinned Directly to Ground */}
        {planet.nodes.map((node, index) => (
          <LessonCoordinatesMarker
            key={node.id}
            node={node}
            index={index + 1}
            radius={radius}
            onSelectNode={onSelectNode}
          />
        ))}
      </group>
    </group>
  );
};

