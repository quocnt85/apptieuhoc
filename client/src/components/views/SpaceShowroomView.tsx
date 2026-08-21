import React, { useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { SHIPS_DATA, SpaceshipModelData } from '../../data/shipsData';
import { PLANETS_DATA } from '../../data/planetsData';
import { PlanetData } from '../../types';
import { AerodynamicShipRenderer } from '../3d/ships/AerodynamicShips';
import { PlanetMesh } from '../3d/PlanetMesh';
import { useGameStore } from '../../stores/useGameStore';
import { soundService } from '../../services/audio';
import {
  Rocket,
  Globe2,
  Wind,
  RotateCw,
  Eye,
  Camera,
  Check,
  Flag,
  Sparkles,
  Zap,
  Info,
  Layers,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Palette
} from 'lucide-react';
import * as THREE from 'three';

// 3D Canvas Scene for Showroom
const ShowroomScene: React.FC<{
  mode: 'ships' | 'planets';
  selectedShip: SpaceshipModelData;
  selectedPlanet: PlanetData;
  shipColor: string;
  hasVnFlag: boolean;
  showStreamlines: boolean;
  autoRotate: boolean;
  cameraPreset: 'front' | 'cockpit' | 'side' | 'rear' | 'default';
  zoomLevel: number;
}> = ({
  mode,
  selectedShip,
  selectedPlanet,
  shipColor,
  hasVnFlag,
  showStreamlines,
  autoRotate,
  cameraPreset,
  zoomLevel,
}) => {
  const modelGroupRef = useRef<THREE.Group>(null);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  // Camera preset orientations
  React.useEffect(() => {
    if (!modelGroupRef.current) return;
    switch (cameraPreset) {
      case 'front':
        modelGroupRef.current.rotation.set(0.15, Math.PI, 0);
        break;
      case 'cockpit':
        modelGroupRef.current.rotation.set(0.4, Math.PI * 0.85, 0);
        break;
      case 'side':
        modelGroupRef.current.rotation.set(0.05, Math.PI / 2, 0);
        break;
      case 'rear':
        modelGroupRef.current.rotation.set(-0.1, 0, 0);
        break;
      case 'default':
      default:
        modelGroupRef.current.rotation.set(0.2, 0.4, 0);
        break;
    }
    velocityRef.current = { x: 0, y: 0 };
  }, [cameraPreset, selectedShip.id, selectedPlanet.id, mode]);

  // Pointer drag listener on the entire 3D canvas with pointer capture
  React.useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.touchAction = 'none';

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };

      modelGroupRef.current.rotation.y += dx * 0.008;
      modelGroupRef.current.rotation.x += dy * 0.008;

      velocityRef.current = {
        x: dy * 0.004,
        y: dx * 0.004,
      };
    };

    const onPointerUp = (e: PointerEvent) => {
      isDraggingRef.current = false;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe fallback
      }
    };

    const onTouchPrevent = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('touchmove', onTouchPrevent, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('touchmove', onTouchPrevent);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!modelGroupRef.current) return;

    if (!isDraggingRef.current) {
      if (autoRotate) {
        modelGroupRef.current.rotation.y += delta * 0.45;
      } else {
        modelGroupRef.current.rotation.y += velocityRef.current.y;
        modelGroupRef.current.rotation.x += velocityRef.current.x;
        velocityRef.current.x *= 0.93;
        velocityRef.current.y *= 0.93;
      }
    }
  });

  return (
    <group scale={[zoomLevel, zoomLevel, zoomLevel]}>
      <group ref={modelGroupRef} position={[0, 0, 0]}>
        {mode === 'ships' ? (
          <AerodynamicShipRenderer
            shipId={selectedShip.id}
            shipColor={shipColor}
            hasVnFlag={hasVnFlag}
            showStreamlines={showStreamlines}
            scale={1.35}
          />
        ) : (
          <PlanetMesh
            planet={selectedPlanet}
            radius={1.25}
            showNodes={false}
            interactiveSpin={false}
          />
        )}
      </group>
    </group>
  );
};

export const SpaceShowroomView: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user, equipShip, equipColor, toggleVietnamFlag, selectPlanet, activePlanetId } = useGameStore();

  const [mode, setMode] = useState<'ships' | 'planets'>('ships');
  const [selectedShipIndex, setSelectedShipIndex] = useState(0);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(0);

  // 3D Controls
  const [showStreamlines, setShowStreamlines] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<'front' | 'cockpit' | 'side' | 'rear' | 'default'>('default');
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [activeTabSub, setActiveTabSub] = useState<'specs' | 'custom'>('specs');

  const currentShip = SHIPS_DATA[selectedShipIndex] || SHIPS_DATA[0];
  const currentPlanet = PLANETS_DATA[selectedPlanetIndex] || PLANETS_DATA[0];

  const currentShipColor = user.customization?.equippedColor || '#38bdf8';
  const hasVnFlag = user.customization?.hasVietnamFlag ?? true;
  const isEquipped = user.customization?.equippedShip === currentShip.id;
  const isCurrentPlanet = activePlanetId === currentPlanet.id;

  const colorsList = [
    { hex: '#38bdf8', name: 'Xanh Cyan' },
    { hex: '#f59e0b', name: 'Vàng Hoàng Kim' },
    { hex: '#ef4444', name: 'Đỏ Chiến Binh' },
    { hex: '#10b981', name: 'Xanh Lục Bảo' },
    { hex: '#8b5cf6', name: 'Tím Tinh Vân' },
  ];

  const handleEquipShip = () => {
    soundService.playVictory();
    equipShip(currentShip.id);
  };

  const handleSelectPlanet = () => {
    soundService.playVictory();
    selectPlanet(currentPlanet.id);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-gradient-to-b from-[#030712] via-[#0b1026] to-[#0f172a] text-white select-none overflow-hidden relative animate-fadeIn">
      {/* Top Header Bar */}
      <div className="p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl border-b border-sky-500/25 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 border border-white/30 flex items-center justify-center text-xl shadow-lg shadow-sky-500/30">
            {mode === 'ships' ? '🚀' : '🪐'}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-yellow-300 flex items-center gap-1.5">
              <span>Phòng Duyệt 3D Không Gian</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
                PBR 360°
              </span>
            </h2>
            <p className="text-[11px] text-sky-200 font-bold">
              {mode === 'ships' ? '5 Phi Thuyền Khí Động Học' : '5 Tinh Cầu Độc Bản'}
            </p>
          </div>
        </div>

        {/* Mode Switcher: Ships <-> Planets */}
        <div className="flex bg-slate-900 border border-sky-400/40 p-1 rounded-2xl shadow-inner">
          <button
            data-testid="showroom-tab-ships"
            onClick={() => {
              soundService.playClick();
              setMode('ships');
              setCameraPreset('default');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              mode === 'ships'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">5 Tàu Vũ Trụ</span>
            <span className="sm:hidden">Tàu</span>
          </button>

          <button
            data-testid="showroom-tab-planets"
            onClick={() => {
              soundService.playClick();
              setMode('planets');
              setCameraPreset('default');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              mode === 'planets'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">5 Hành Tinh</span>
            <span className="sm:hidden">Hành Tinh</span>
          </button>
        </div>
      </div>

      {/* Main Interactive 3D Canvas Area */}
      <div className="relative flex-1 w-full overflow-hidden bg-radial from-[#1e1b4b] via-[#070d1e] to-[#030712] cursor-grab active:cursor-grabbing touch-none touch-canvas-interactive overscroll-none">
        <Canvas
          camera={{ position: [0, 0.3, 4.2], fov: 45 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          style={{ touchAction: 'none' }}
          className="touch-none"
        >
          <color attach="background" args={['#050814']} />
          <ambientLight intensity={0.8} color="#e0f2fe" />
          <directionalLight position={[6, 8, 6]} intensity={2.5} color="#fffbeb" />
          <directionalLight position={[-6, -4, -4]} intensity={1.2} color="#38bdf8" />
          <pointLight position={[0, 4, 3]} intensity={1.5} color="#ffffff" />
          
          <Stars radius={45} depth={30} count={1800} factor={4} saturation={0.6} fade speed={0.6} />

          <ShowroomScene
            mode={mode}
            selectedShip={currentShip}
            selectedPlanet={currentPlanet}
            shipColor={currentShipColor}
            hasVnFlag={hasVnFlag}
            showStreamlines={showStreamlines}
            autoRotate={autoRotate}
            cameraPreset={cameraPreset}
            zoomLevel={zoomLevel}
          />
        </Canvas>

        {/* Floating Quick Action 3D Toolbar (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Toggle Wind Streamlines (Ships only) */}
          {mode === 'ships' && (
            <button
              onClick={() => setShowStreamlines(!showStreamlines)}
              title="Bật/Tắt Vệt Gió Khí Động Học"
              className={`p-2.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all active:scale-90 ${
                showStreamlines
                  ? 'bg-sky-500/30 border-sky-400 text-sky-300 shadow-sky-500/20'
                  : 'bg-slate-900/80 border-slate-700 text-slate-400'
              }`}
            >
              <Wind className="w-4 h-4" />
            </button>
          )}

          {/* Toggle Auto Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Bật/Tắt Tự Động Xoay"
            className={`p-2.5 rounded-2xl border backdrop-blur-md shadow-lg transition-all active:scale-90 ${
              autoRotate
                ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Zoom Controls */}
          <div className="flex flex-col bg-slate-900/90 border border-slate-700 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90"
              title="Phóng to"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-full h-px bg-slate-800" />
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camera Angle Presets (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10 bg-slate-950/80 backdrop-blur-md border border-white/15 p-1 rounded-2xl shadow-lg">
          <span className="text-[10px] font-black text-slate-400 px-1.5 flex items-center gap-1">
            <Camera className="w-3 h-3 text-sky-400" />
            <span className="hidden sm:inline">Góc Nhìn:</span>
          </span>
          {(mode === 'ships'
            ? [
                { id: 'default', label: 'Tổng Thể' },
                { id: 'front', label: 'Mũi Tàu' },
                { id: 'cockpit', label: 'Buồng Lái' },
                { id: 'side', label: 'Cánh' },
                { id: 'rear', label: 'Động Cơ' },
              ]
            : [
                { id: 'default', label: 'Tổng Thể' },
                { id: 'front', label: 'Xích Đạo' },
                { id: 'cockpit', label: 'Cực Bắc' },
                { id: 'side', label: 'Đường Viền' },
              ]
          ).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                soundService.playClick();
                setCameraPreset(c.id as any);
              }}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                cameraPreset === c.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Bottom Floating Drag Hint */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-10 px-4">
          <span className="bg-slate-950/80 backdrop-blur-md border border-white/20 text-sky-300 text-[10px] font-bold px-3 py-1 rounded-full shadow flex items-center gap-1.5">
            <RotateCw className="w-3 h-3 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Kéo chuột hoặc vuốt để xoay 360° • Xem từng góc cạnh khí động học</span>
          </span>
        </div>
      </div>

      {/* Bottom Selector & Technical Specs Panel */}
      <div className="bg-slate-950/95 border-t-2 border-sky-500/30 p-3.5 sm:p-4 shrink-0 flex flex-col gap-3 max-h-[48vh] overflow-y-auto shadow-2xl z-20">
        {/* Horizontal Carousel Selector */}
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {mode === 'ships'
            ? SHIPS_DATA.map((ship, idx) => {
                const isSelected = idx === selectedShipIndex;
                const isShipEquipped = user.customization?.equippedShip === ship.id;

                return (
                  <button
                    key={ship.id}
                    data-testid={`ship-select-${ship.id}`}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedShipIndex(idx);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 shrink-0 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-sky-950/90 border-sky-400 shadow-lg shadow-sky-500/25 ring-2 ring-sky-400/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/20 flex items-center justify-center text-base">
                      🚀
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white flex items-center gap-1">
                        <span>{ship.name}</span>
                        {isShipEquipped && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] text-sky-300 font-bold">
                        $C_d: {ship.dragCoefficientCd}$ • Mach {ship.maxMachSpeed}
                      </div>
                    </div>
                  </button>
                );
              })
            : PLANETS_DATA.map((pl, idx) => {
                const isSelected = idx === selectedPlanetIndex;
                const isPlanetActive = activePlanetId === pl.id;

                return (
                  <button
                    key={pl.id}
                    data-testid={`planet-select-${pl.id}`}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedPlanetIndex(idx);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 shrink-0 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-purple-950/90 border-purple-400 shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center text-base shadow"
                      style={{ backgroundColor: pl.color }}
                    >
                      🪐
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white flex items-center gap-1">
                        <span>{pl.titleVi}</span>
                        {isPlanetActive && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] text-purple-300 font-bold capitalize">
                        {pl.type}
                      </div>
                    </div>
                  </button>
                );
              })}
        </div>

        {/* Details Card & Action Bar */}
        {mode === 'ships' ? (
          <div className="space-y-2.5">
            {/* Header Title & Aerodynamic Highlights */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base text-yellow-300">{currentShip.nameVi}</h3>
                  <span className="text-[10px] bg-yellow-400/20 text-yellow-300 font-black px-2 py-0.5 rounded-full border border-yellow-400/30">
                    {currentShip.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">{currentShip.description}</p>
              </div>

              {/* Action Button: Equip Ship */}
              <div className="shrink-0 w-full sm:w-auto">
                {isEquipped ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-black text-xs px-4 py-2 rounded-2xl flex items-center justify-center gap-1 shadow">
                    <Check className="w-4 h-4" /> Đang Trang Bị
                  </span>
                ) : (
                  <button
                    onClick={handleEquipShip}
                    className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded-2xl border border-sky-300 shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Trang Bị Phi Thuyền Này ✨</span>
                  </button>
                )}
              </div>
            </div>

            {/* Aerodynamic Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-sky-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Hệ Số Cản ($C_d$)</span>
                <div className="font-black text-sm text-sky-300 mt-0.5">{currentShip.dragCoefficientCd}</div>
                <span className="text-[9px] text-slate-500">Kháng sóng âm siêu thấp</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-sky-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tỉ Số Lực Nâng ($L/D$)</span>
                <div className="font-black text-sm text-yellow-300 mt-0.5">{currentShip.liftToDragRatio} : 1</div>
                <span className="text-[9px] text-slate-500">Lực nâng thân & cánh</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-sky-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Vận Tốc Cực Đại</span>
                <div className="font-black text-sm text-emerald-300 mt-0.5">Mach {currentShip.maxMachSpeed}</div>
                <span className="text-[9px] text-slate-500">Tốc độ siêu thanh</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-sky-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Cấu Trúc Cánh</span>
                <div className="font-black text-[11px] text-purple-300 mt-0.5 truncate">{currentShip.aerodynamicProfile}</div>
                <span className="text-[9px] text-slate-500">Sải cánh: {currentShip.wingspanMeters}m</span>
              </div>
            </div>

            {/* Aerodynamic Key Features List */}
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-black text-sky-200 flex items-center gap-1.5 mb-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span>Nguyên Lý Khí Động Học Nổi Bật:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentShip.aeroFeatures.map((feat, fidx) => (
                  <div key={fidx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                    <span className="text-sky-400 font-bold shrink-0">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Customization Bar: Color Picker & Flag Toggle */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              {/* Color Palette */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-yellow-300" /> Màu Sơn:
                </span>
                <div className="flex gap-1.5">
                  {colorsList.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => equipColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        currentShipColor === c.hex
                          ? 'border-white scale-110 shadow-lg shadow-sky-400/50 ring-2 ring-sky-400'
                          : 'border-slate-600 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Vietnam Flag Toggle */}
              <button
                onClick={toggleVietnamFlag}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  hasVnFlag
                    ? 'bg-red-600/90 text-white border-yellow-300 shadow-md shadow-red-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span>⭐</span>
                <span>{hasVnFlag ? 'Đã Dán Cờ VN' : 'Dán Cờ VN'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Planet Details Card */
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm sm:text-base text-yellow-300">{currentPlanet.titleVi}</h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 font-black px-2 py-0.5 rounded-full border border-purple-400/30">
                    {currentPlanet.name}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">{currentPlanet.description}</p>
              </div>

              {/* Action Button: Travel to Planet */}
              <div className="shrink-0 w-full sm:w-auto">
                {isCurrentPlanet ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-black text-xs px-4 py-2 rounded-2xl flex items-center justify-center gap-1 shadow">
                    <Check className="w-4 h-4" /> Đang Ở Tinh Cầu Này
                  </span>
                ) : (
                  <button
                    onClick={handleSelectPlanet}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded-2xl border border-purple-300 shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Du Hành Tới Tinh Cầu Này 🪐</span>
                  </button>
                )}
              </div>
            </div>

            {/* Planet Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Đường Kính</span>
                <div className="font-black text-sm text-purple-300 mt-0.5">
                  {currentPlanet.diameterKm?.toLocaleString() || '12,742'} km
                </div>
                <span className="text-[9px] text-slate-500">Quy mô thiên thể</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Nhiệt Độ Bề Mặt</span>
                <div className="font-black text-xs sm:text-sm text-yellow-300 mt-0.5 truncate">
                  {currentPlanet.surfaceTemp || '25°C'}
                </div>
                <span className="text-[9px] text-slate-500">Khí hậu & môi trường</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Trọng Lực</span>
                <div className="font-black text-sm text-emerald-300 mt-0.5">{currentPlanet.gravity || '1.0 G'}</div>
                <span className="text-[9px] text-slate-500">Gia tốc trọng trường</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Vành Đai & Vệ Tinh</span>
                <div className="font-black text-xs text-sky-300 mt-0.5">
                  {currentPlanet.hasRings ? 'Có Vành Đai' : 'Không Vành'} • {currentPlanet.hasMoon ? '1 Vệ Tinh' : 'Không Mặt Trăng'}
                </div>
                <span className="text-[9px] text-slate-500">Quỹ đạo đồng bộ</span>
              </div>
            </div>

            {/* Geological Highlights */}
            {currentPlanet.geologyHighlights && (
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-black text-purple-200 flex items-center gap-1.5 mb-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Đặc Trưng Địa Chất Thiên Thể:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {currentPlanet.geologyHighlights.map((geo, gidx) => (
                    <div key={gidx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                      <span className="text-purple-400 font-bold shrink-0">•</span>
                      <span>{geo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
