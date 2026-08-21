import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

interface Props {
  children: React.ReactNode;
}

export const SpaceCanvas: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-[#050814] via-[#0b1026] to-[#160e33] select-none">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        {/* Deep Cosmic Background Color */}
        <color attach="background" args={['#050814']} />

        {/* Ambient & Directional Lighting for 3D PBR Shading */}
        <ambientLight intensity={0.65} color="#e0f2fe" />
        <directionalLight
          position={[10, 8, 6]}
          intensity={2.2}
          color="#fffbeb"
          castShadow={false}
        />
        {/* Soft Cosmic Rim Light */}
        <pointLight position={[-8, -6, -4]} intensity={0.9} color="#818cf8" />

        {/* Dynamic Starfield Particles */}
        <Stars
          radius={50}
          depth={40}
          count={2500}
          factor={4}
          saturation={0.5}
          fade
          speed={0.8}
        />

        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};
