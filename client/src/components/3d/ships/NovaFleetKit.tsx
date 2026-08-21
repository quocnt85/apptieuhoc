import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Vec3 = [number, number, number];

export const NOVA_PALETTE = {
  dark: '#07111f',
  armor: '#17263a',
  metal: '#64748b',
  cyan: '#31d7ff',
  blue: '#2563eb',
  amber: '#ffb224',
  white: '#edf7ff',
};

interface SurfaceTextures {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
}

let surfaceTextures: SurfaceTextures | null = null;

function getSurfaceTextures(): SurfaceTextures {
  if (surfaceTextures) return surfaceTextures;
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  const bumpCanvas = document.createElement('canvas');
  const roughCanvas = document.createElement('canvas');
  colorCanvas.width = bumpCanvas.width = roughCanvas.width = size;
  colorCanvas.height = bumpCanvas.height = roughCanvas.height = size;
  const color = colorCanvas.getContext('2d')!;
  const bump = bumpCanvas.getContext('2d')!;
  const rough = roughCanvas.getContext('2d')!;

  color.fillStyle = '#e9eff3';
  color.fillRect(0, 0, size, size);
  bump.fillStyle = '#808080';
  bump.fillRect(0, 0, size, size);
  rough.fillStyle = '#525252';
  rough.fillRect(0, 0, size, size);

  const cell = 64;
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const inset = 4;
      color.fillStyle = (x / cell + y / cell) % 2 ? '#e3eaee' : '#edf2f5';
      color.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
      color.strokeStyle = 'rgba(71, 85, 105, 0.58)';
      color.lineWidth = 1.25;
      color.strokeRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
      bump.strokeStyle = '#171717';
      bump.lineWidth = 5;
      bump.strokeRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
      rough.fillStyle = (x / cell + y / cell) % 3 ? '#454545' : '#686868';
      rough.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
      [[10, 10], [cell - 10, 10], [10, cell - 10], [cell - 10, cell - 10]].forEach(([rx, ry]) => {
        color.fillStyle = '#334155';
        color.beginPath();
        color.arc(x + rx, y + ry, 2.2, 0, Math.PI * 2);
        color.fill();
        bump.fillStyle = '#e5e5e5';
        bump.beginPath();
        bump.arc(x + rx, y + ry, 2.6, 0, Math.PI * 2);
        bump.fill();
      });
    }
  }
  color.globalAlpha = 0.18;
  color.strokeStyle = '#ffffff';
  color.lineWidth = 1;
  for (let i = 0; i < 50; i += 1) {
    const y = (i * 97) % size;
    color.beginPath();
    color.moveTo((i * 53) % size, y);
    color.lineTo(((i * 53) % size) + 25 + (i % 5) * 9, y + (i % 3) - 1);
    color.stroke();
  }
  color.globalAlpha = 1;

  const makeTexture = (canvas: HTMLCanvasElement, colorSpace = false) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.05, 1.05);
    texture.anisotropy = 4;
    if (colorSpace) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };
  surfaceTextures = {
    map: makeTexture(colorCanvas, true),
    bump: makeTexture(bumpCanvas),
    roughness: makeTexture(roughCanvas),
  };
  return surfaceTextures;
}

export const HullSurfaceMaterial: React.FC<{
  color: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}> = ({ color, metalness = 0.78, roughness = 0.24, emissive = '#000000', emissiveIntensity = 0 }) => {
  const textures = useMemo(() => getSurfaceTextures(), []);
  const accent = useMemo(() => new THREE.Color(color), [color]);
  return (
    <meshPhysicalMaterial
      map={textures.map}
      bumpMap={textures.bump}
      bumpScale={0.035}
      roughnessMap={textures.roughness}
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      metalness={metalness}
      roughness={roughness}
      clearcoat={0.86}
      clearcoatRoughness={0.12}
      iridescence={0.08}
      onBeforeCompile={(shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          `float novaRim = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewPosition)), 0.0, 1.0), 3.0);
           gl_FragColor.rgb += vec3(${accent.r.toFixed(4)}, ${accent.g.toFixed(4)}, ${accent.b.toFixed(4)}) * novaRim * 0.22;
           #include <dithering_fragment>`
        );
      }}
      customProgramCacheKey={() => `nova-hull-${color}`}
    />
  );
};

function prismGeometry(points: Array<[number, number]>, thickness: number) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: Math.min(0.035, thickness * 0.35),
    bevelThickness: Math.min(0.025, thickness * 0.25),
    curveSegments: 1,
  });
  geometry.center();
  geometry.rotateX(Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

export const AeroPanel: React.FC<{
  points: Array<[number, number]>;
  thickness?: number;
  position?: Vec3;
  rotation?: Vec3;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
}> = ({
  points,
  thickness = 0.06,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = NOVA_PALETTE.white,
  emissive = '#000000',
  emissiveIntensity = 0,
  metalness = 0.78,
  roughness = 0.24,
}) => {
  const geometry = useMemo(() => prismGeometry(points, thickness), [points, thickness]);
  return (
    <mesh geometry={geometry} position={position} rotation={rotation}>
      <HullSurfaceMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} metalness={metalness} roughness={roughness} />
    </mesh>
  );
};

export const HullShell: React.FC<{
  position?: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  color: string;
  radius?: number;
  length?: number;
}> = ({
  position = [0, 0, 0],
  rotation = [Math.PI / 2, 0, 0],
  scale = [1, 1, 1],
  color,
  radius = 0.34,
  length = 1.7,
}) => (
  <mesh position={position} rotation={rotation} scale={scale}>
    <capsuleGeometry args={[radius, length, 8, 20]} />
    <HullSurfaceMaterial color={color} metalness={0.76} roughness={0.22} />
  </mesh>
);

export const Canopy: React.FC<{
  position: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  color?: string;
}> = ({ position, rotation = [Math.PI / 2, 0, 0], scale = [1, 1, 1], color = '#38c8ff' }) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }), [color]);
  useFrame(({ clock }) => { if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime; });
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        <capsuleGeometry args={[0.19, 0.48, 12, 32]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          vertexShader={`
            varying vec3 vNormalW;
            varying vec3 vView;
            varying vec2 vUv2;
            void main() {
              vec4 mv = modelViewMatrix * vec4(position, 1.0);
              vNormalW = normalize(normalMatrix * normal);
              vView = normalize(-mv.xyz);
              vUv2 = uv;
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColor;
            varying vec3 vNormalW;
            varying vec3 vView;
            varying vec2 vUv2;
            void main() {
              float fresnel = pow(1.0 - max(dot(vNormalW, vView), 0.0), 2.6);
              float scan = smoothstep(0.92, 1.0, sin((vUv2.y * 42.0 - uTime * 1.8) * 3.14159) * 0.5 + 0.5);
              float frame = smoothstep(0.46, 0.5, abs(vUv2.x - 0.5));
              vec3 deepGlass = vec3(0.008, 0.028, 0.075);
              vec3 col = mix(deepGlass, uColor * 1.7, fresnel * 0.82 + scan * 0.12 + frame * 0.18);
              gl_FragColor = vec4(col, 0.78 + fresnel * 0.2);
            }
          `}
        />
      </mesh>
      <mesh scale={[1.035, 1.015, 1.035]}>
        <capsuleGeometry args={[0.19, 0.48, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

export const EnergyStrip: React.FC<{
  position: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  color?: string;
}> = ({ position, rotation = [0, 0, 0], scale = [1, 1, 1], color = NOVA_PALETTE.cyan }) => (
  <mesh position={position} rotation={rotation} scale={scale}>
    <boxGeometry args={[0.05, 0.025, 0.5]} />
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.2} toneMapped={false} />
  </mesh>
);

const PlasmaExhaust: React.FC<{ color: string; thrustPower?: number }> = ({ color, thrustPower = 1.0 }) => {
  const flameMaterial = useRef<THREE.ShaderMaterial>(null);
  const particleMaterial = useRef<THREE.ShaderMaterial>(null);
  const flameUniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }), [color]);
  const particleUniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }), [color]);
  const particles = useMemo(() => {
    const count = 52;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const angle = (i * 2.399963) % (Math.PI * 2);
      const radius = 0.012 + ((i * 37) % 19) / 19 * 0.075;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = 0;
      seeds[i] = ((i * 73) % count) / count;
    }
    return { positions, seeds };
  }, []);
  useFrame(({ clock }) => {
    if (flameMaterial.current) flameMaterial.current.uniforms.uTime.value = clock.elapsedTime;
    if (particleMaterial.current) particleMaterial.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <group scale={[Math.max(0.3, thrustPower), Math.max(0.3, thrustPower), Math.max(0.3, thrustPower)]}>
      <mesh position={[0, 0, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.86, 28, 10, true]} />
        <shaderMaterial
          ref={flameMaterial}
          uniforms={flameUniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            uniform float uTime;
            varying vec2 vUv2;
            void main() {
              vUv2 = uv;
              vec3 p = position;
              float taperNoise = sin(uv.y * 34.0 - uTime * 24.0) * (1.0 - uv.y) * 0.018;
              p.xz *= 1.0 + taperNoise;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColor;
            varying vec2 vUv2;
            void main() {
              float core = pow(max(0.0, 1.0 - abs(vUv2.x - 0.5) * 2.0), 2.0);
              float pulse = 0.82 + sin(vUv2.y * 28.0 - uTime * 20.0) * 0.18;
              float fade = pow(1.0 - vUv2.y, 1.25);
              vec3 col = mix(uColor * 1.4, vec3(1.0, 0.98, 0.82) * 2.2, core * fade);
              gl_FragColor = vec4(col, fade * pulse * (0.42 + core * 0.55));
            }
          `}
        />
      </mesh>
      {[0.62, 0.9, 1.18].map((z, index) => (
        <mesh key={z} position={[0, 0, z]} scale={[0.07 - index * 0.012, 0.07 - index * 0.012, 0.14]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshBasicMaterial color={index === 0 ? '#ffffff' : color} transparent opacity={(0.72 - index * 0.16) * Math.max(0.3, thrustPower)} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      ))}
      <points position={[0, 0, 0.4]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[particles.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMaterial}
          uniforms={particleUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            uniform float uTime;
            attribute float aSeed;
            varying float vLife;
            void main() {
              float life = fract(aSeed + uTime * (0.42 + aSeed * 0.24));
              vLife = 1.0 - life;
              vec3 p = position;
              p.xy *= 1.0 + life * 4.5;
              p.x += sin(aSeed * 71.0 + uTime * 3.0) * life * 0.08;
              p.y += cos(aSeed * 53.0 + uTime * 2.6) * life * 0.08;
              p.z += life * (1.15 + aSeed * 0.8);
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_PointSize = (7.0 + aSeed * 6.0) * vLife * (3.0 / max(1.0, -mv.z));
              gl_Position = projectionMatrix * mv;
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying float vLife;
            void main() {
              float d = distance(gl_PointCoord, vec2(0.5));
              float alpha = smoothstep(0.5, 0.04, d) * vLife;
              gl_FragColor = vec4(mix(uColor, vec3(1.0), vLife * 0.45), alpha * 0.75);
            }
          `}
        />
      </points>
      <pointLight position={[0, 0, 0.25]} color={color} intensity={0.55 * Math.max(0.3, thrustPower)} distance={1.25} decay={2} />
    </group>
  );
};

export const EnginePod: React.FC<{
  position: Vec3;
  scale?: number;
  accent?: string;
  flame?: string;
  rings?: number;
  thrustPower?: number;
}> = ({ position, scale = 1, accent = NOVA_PALETTE.cyan, flame = '#42d9ff', rings = 3, thrustPower = 1.0 }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0, -0.54]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.15, 0.5, 24]} />
        <HullSurfaceMaterial color={NOVA_PALETTE.metal} metalness={0.88} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.12, -0.46]} scale={[0.22, 0.08, 0.42]}>
        <boxGeometry />
        <meshPhysicalMaterial color={NOVA_PALETTE.armor} metalness={0.92} roughness={0.2} clearcoat={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.145, 0.18, 0.62, 24]} />
        <meshPhysicalMaterial color={NOVA_PALETTE.armor} metalness={0.92} roughness={0.2} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0, -0.3]}>
        <torusGeometry args={[0.13, 0.035, 10, 28]} />
        <meshStandardMaterial color={NOVA_PALETTE.metal} metalness={0.98} roughness={0.14} />
      </mesh>
      {Array.from({ length: rings }).map((_, index) => (
        <mesh key={index} position={[0, 0, -0.1 + index * 0.13]}>
          <torusGeometry args={[0.153, 0.014, 8, 24]} />
          <meshStandardMaterial color={index === rings - 1 ? accent : '#40516a'} metalness={0.9} roughness={0.22} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.17, 0.18, 24, 1, true]} />
        <meshStandardMaterial color="#020712" metalness={0.96} roughness={0.16} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.435]}>
        <circleGeometry args={[0.115, 24]} />
        <meshBasicMaterial color={flame} toneMapped={false} />
      </mesh>
      <PlasmaExhaust color={flame} thrustPower={thrustPower} />
    </group>
  );
};

export const NavigationLights: React.FC<{ width?: number; z?: number }> = ({ width = 1, z = 0 }) => (
  <>
    <mesh position={[-width, 0.03, z]}>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshBasicMaterial color="#ff315b" toneMapped={false} />
    </mesh>
    <mesh position={[width, 0.03, z]}>
      <sphereGeometry args={[0.035, 12, 12]} />
      <meshBasicMaterial color="#34ff9a" toneMapped={false} />
    </mesh>
  </>
);

export const Streamlines: React.FC<{ visible: boolean; width?: number; length?: number; color?: string }> = ({
  visible,
  width = 1.2,
  length = 3.6,
  color = '#59dcff',
}) => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.z = ((clock.elapsedTime * 1.6) % 0.7) - 0.35;
  });
  if (!visible) return null;

  return (
    <group ref={group}>
      {[-1, -0.55, 0.55, 1].map((factor, index) => (
        <mesh key={factor} position={[factor * width, index % 2 ? -0.14 : 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, length, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.34} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export const GreebleRail: React.FC<{
  position: Vec3;
  rotation?: Vec3;
  count?: number;
  spacing?: number;
  color?: string;
}> = ({ position, rotation = [0, 0, 0], count = 6, spacing = 0.13, color = NOVA_PALETTE.metal }) => (
  <group position={position} rotation={rotation}>
    {Array.from({ length: count }).map((_, index) => (
      <mesh key={index} position={[0, 0, (index - (count - 1) / 2) * spacing]}>
        <boxGeometry args={[0.06, 0.045, 0.075]} />
        <meshStandardMaterial color={color} metalness={0.92} roughness={0.22} />
      </mesh>
    ))}
  </group>
);
