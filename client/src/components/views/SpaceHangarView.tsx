import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useGameStore } from '../../stores/useGameStore';
import { SHIPS_DATA, SpaceshipModelData } from '../../data/shipsData';
import { AerodynamicShipRenderer } from '../3d/ships/AerodynamicShips';
import { Rocket, Palette, Zap, Check, Lock, RotateCw, X, Sparkles, Shield, Flame, Flag } from 'lucide-react';
import { soundService } from '../../services/audio';
import * as THREE from 'three';

// Helper function to resolve default native theme color per spaceship
export const getDefaultColorForShip = (shipId: string): string => {
  switch (shipId) {
    case 'falcon_apex': return '#7c3aed';
    case 'solar_phoenix': return '#2563eb';
    case 'starlight_runner': return '#f1f5f9';
    case 'astral_shuttle': return '#f8fafc';
    default: return '#38bdf8';
  }
};

// Interactive 3D Orbit Viewer & Integrated Paint/Customization Modal in Hangar
const ShipInteractiveDetailModal: React.FC<{
  ship: SpaceshipModelData;
  onClose: () => void;
  isUnlocked: boolean;
  isEquipped: boolean;
  onEquip: () => void;
  onBuy: () => void;
}> = ({ ship, onClose, isUnlocked, isEquipped, onEquip, onBuy }) => {
  const { user, equipColor, buyColor, toggleVietnamFlag } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  const currentEquippedColor = user.customization?.equippedColor || 'default';
  const [selectedColorKey, setSelectedColorKey] = useState<string>(currentEquippedColor);

  const defaultThemeColor = getDefaultColorForShip(ship.id);
  const activeRenderColor = selectedColorKey === 'default' ? defaultThemeColor : selectedColorKey;

  const unlockedColors = user.customization?.unlockedColors || ['default', '#38bdf8'];
  const hasVietnamFlag = user.customization?.hasVietnamFlag ?? true;

  // Available Paint Colors Palette
  const paintPalette = [
    { id: 'default', name: 'Mặc Định', hex: defaultThemeColor, price: 0, isFree: true },
    { id: '#38bdf8', name: 'Xanh Lam Cyan', hex: '#38bdf8', price: 0, isFree: true },
    { id: '#ef4444', name: 'Đỏ Chiến Binh', hex: '#ef4444', price: 100, isFree: false },
    { id: '#10b981', name: 'Xanh Lục Bảo', hex: '#10b981', price: 100, isFree: false },
    { id: '#8b5cf6', name: 'Tím Tinh Vân', hex: '#8b5cf6', price: 150, isFree: false },
    { id: '#f59e0b', name: 'Vàng Hoàng Kim', hex: '#f59e0b', price: 250, isFree: false },
  ];

  const handleSelectColor = (colorId: string) => {
    soundService.playClick();
    setSelectedColorKey(colorId);
    if (colorId === 'default' || unlockedColors.includes(colorId)) {
      equipColor(colorId === 'default' ? defaultThemeColor : colorId);
    }
  };

  const handleBuyColor = (colorId: string, price: number) => {
    const success = buyColor(colorId, price);
    if (!success) {
      alert('Bạn không đủ Xu Nova 🟡 để mở khóa màu sơn này!');
    } else {
      setSelectedColorKey(colorId);
      equipColor(colorId);
    }
  };

  const isColorOwned = (colorId: string) => {
    if (colorId === 'default') return true;
    return unlockedColors.includes(colorId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-fadeIn overflow-y-auto">
      <div className="bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] border-2 border-sky-400 rounded-[32px] p-4 sm:p-5 max-w-lg w-full text-white shadow-[0_0_50px_rgba(56,189,248,0.4)] relative flex flex-col items-center my-auto">
        {/* Close Button */}
        <button
          onClick={() => { soundService.playClick(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pr-8 pl-2 mb-2 w-full">
          <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
            {ship.badge}
          </span>
          <h3 className="font-black text-lg sm:text-xl text-yellow-300 flex items-center justify-center gap-1.5 mt-1">
            <span>{ship.nameVi}</span>
            {isEquipped && <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />}
          </h3>
          <p className="text-xs text-sky-200 font-bold">
            {ship.classType}
          </p>
        </div>

        {/* 3D Interactive Canvas Container (Real-Time 360 Color Preview) */}
        <div
          className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-radial from-[#1e1b4b] via-[#0b1026] to-[#050814] border border-sky-400/40 relative cursor-grab active:cursor-grabbing shadow-inner touch-none touch-canvas-interactive overscroll-none mb-3"
          onPointerDown={(e) => {
            isDraggingRef.current = true;
            prevPointerRef.current = { x: e.clientX, y: e.clientY };
            try {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            } catch {}
          }}
          onPointerMove={(e) => {
            if (isDraggingRef.current && groupRef.current) {
              const dx = e.clientX - prevPointerRef.current.x;
              const dy = e.clientY - prevPointerRef.current.y;
              prevPointerRef.current = { x: e.clientX, y: e.clientY };
              groupRef.current.rotation.y += dx * 0.012;
              groupRef.current.rotation.x += dy * 0.012;
            }
          }}
          onPointerUp={(e) => {
            isDraggingRef.current = false;
            try {
              if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              }
            } catch {}
          }}
          onPointerCancel={(e) => {
            isDraggingRef.current = false;
            try {
              if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              }
            } catch {}
          }}
        >
          <Canvas
            camera={{ position: [0, 0.4, 3.2], fov: 45 }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.15;
            }}
            style={{ touchAction: 'none' }}
            className="touch-none"
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 6, 5]} intensity={2.4} />
            <pointLight position={[-4, -3, -2]} intensity={1.5} color="#38bdf8" />
            <Environment resolution={96}>
              <Lightformer form="rect" intensity={5} color="#ecfeff" position={[0, 4, 2]} scale={[6, 2, 1]} rotation={[Math.PI / 2, 0, 0]} />
              <Lightformer form="rect" intensity={3} color="#38bdf8" position={[-3, 0, 1]} scale={[2, 5, 1]} rotation={[0, Math.PI / 2, 0]} />
            </Environment>
            <group ref={groupRef}>
              <AerodynamicShipRenderer
                shipId={ship.id}
                shipColor={activeRenderColor}
                showStreamlines={false}
                thrustPower={0.3}
                scale={1.25}
              />
            </group>
          </Canvas>

          {/* Floating Hint */}
          <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
            <span className="bg-slate-950/80 border border-white/20 text-sky-300 text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow">
              <RotateCw className="w-3 h-3 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Vuốt để xoay 360° • Màu sơn đổi trực tiếp</span>
            </span>
          </div>
        </div>

        {/* Integrated Real-Time Paint & Customization Bar */}
        <div className="w-full bg-slate-900/90 border border-sky-400/30 p-3 rounded-2xl mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-yellow-300">
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              <span>Sơn Màu Phi Thuyền</span>
            </div>

            {/* Vietnam Flag Toggle */}
            <button
              type="button"
              onClick={() => { soundService.playClick(); toggleVietnamFlag(); }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                hasVietnamFlag
                  ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              <Flag className="w-3 h-3 text-rose-400" />
              <span>Cờ VN: <b>{hasVietnamFlag ? 'BẬT 🇻🇳' : 'TẮT'}</b></span>
            </button>
          </div>

          {/* Color Swatches Strip */}
          <div className="flex items-center justify-between gap-1.5 pt-1 overflow-x-auto scrollbar-none">
            {paintPalette.map((colorItem) => {
              const owned = isColorOwned(colorItem.id);
              const isSelected = selectedColorKey === colorItem.id;

              return (
                <button
                  key={colorItem.id}
                  type="button"
                  onClick={() => handleSelectColor(colorItem.id)}
                  title={colorItem.name}
                  className={`relative flex-1 py-1.5 px-1 rounded-xl border-2 flex flex-col items-center justify-center transition-all min-w-[50px] ${
                    isSelected
                      ? 'border-yellow-300 bg-sky-950/80 scale-105 shadow-[0_0_12px_rgba(253,224,71,0.5)]'
                      : 'border-slate-700/80 bg-slate-950/60 hover:border-slate-500'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/60 shadow flex items-center justify-center relative"
                    style={{ backgroundColor: colorItem.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white drop-shadow stroke-[3]" />}
                    {!owned && (
                      <div className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-amber-300" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-slate-300 mt-1 truncate max-w-full">
                    {colorItem.id === 'default' ? 'Mặc Định' : colorItem.name.split(' ')[0]}
                  </span>
                  {!owned && (
                    <span className="text-[8px] font-black text-amber-300 mt-0.5">
                      {colorItem.price} 🟡
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Unlock prompt if a locked color (e.g. Gold 250) is selected */}
          {!isColorOwned(selectedColorKey) && (
            <div className="flex items-center justify-between bg-amber-950/80 border border-amber-500/50 p-2 rounded-xl text-xs font-bold text-amber-200 mt-2 animate-fadeIn">
              <span>Màu này cần mở khóa:</span>
              <button
                type="button"
                onClick={() => {
                  const target = paintPalette.find((p) => p.id === selectedColorKey);
                  if (target) handleBuyColor(target.id, target.price);
                }}
                className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-lg shadow hover:bg-yellow-300 active:scale-95"
              >
                Mở Khóa ({paintPalette.find((p) => p.id === selectedColorKey)?.price} Xu 🟡)
              </button>
            </div>
          )}
        </div>

        {/* Detailed Highly-Differentiated Stats */}
        <div className="w-full space-y-2 text-left mb-3.5">
          {/* 3 Distinct Game Stats Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/90 border border-sky-400/40 p-2 rounded-xl text-center">
              <div className="text-[10px] font-black text-sky-300 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-sky-400" /> Tốc Độ
              </div>
              <div className="text-sm font-black text-white mt-0.5">{ship.speed}/100</div>
            </div>

            <div className="bg-slate-900/90 border border-emerald-400/40 p-2 rounded-xl text-center">
              <div className="text-[10px] font-black text-emerald-300 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> Giáp
              </div>
              <div className="text-sm font-black text-white mt-0.5">{ship.shield}/100</div>
            </div>

            <div className="bg-slate-900/90 border border-amber-400/40 p-2 rounded-xl text-center">
              <div className="text-[10px] font-black text-amber-300 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Sức Mạnh
              </div>
              <div className="text-sm font-black text-white mt-0.5">{ship.power}/100</div>
            </div>
          </div>

          {/* Special Feature */}
          <div className="bg-indigo-950/60 border border-indigo-400/40 p-2 rounded-xl text-[11px] font-bold text-indigo-200 flex items-start gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
            <span>Kỹ năng: <b className="text-yellow-300 font-black">{ship.specialFeature}</b></span>
          </div>
        </div>

        {/* Main Equip / Purchase Action Button */}
        <div className="w-full">
          {ship.isPlaceholder ? (
            <div className="w-full py-3 rounded-2xl font-black text-sm sm:text-base bg-indigo-950/90 border-2 border-indigo-400/70 text-indigo-200 flex items-center justify-center gap-2 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>Bản Vẽ Thiết Kế • Sắp Ra Mắt</span>
            </div>
          ) : isEquipped ? (
            <div className="w-full py-3 rounded-2xl font-black text-sm sm:text-base bg-emerald-950 border-2 border-emerald-400 text-emerald-200 flex items-center justify-center gap-2 shadow-lg">
              <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
              <span>Đang Lái Phi Thuyền Này</span>
            </div>
          ) : isUnlocked ? (
            <button
              onClick={onEquip}
              className="w-full py-3 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white border-2 border-sky-200 shadow-[0_5px_0_0_#0284c7,0_8px_20px_rgba(2,132,199,0.5)] active:translate-y-1 active:shadow-[0_1px_0_0_#0284c7] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Rocket className="w-5 h-5" />
              <span>Trang Bị Phi Thuyền ✨</span>
            </button>
          ) : (
            <button
              onClick={onBuy}
              className="w-full py-3 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 border-2 border-yellow-200 shadow-[0_5px_0_0_#b45309,0_8px_20px_rgba(245,158,11,0.5)] active:translate-y-1 active:shadow-[0_1px_0_0_#b45309] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-5 h-5" />
              <span>Mở Khóa ({ship.price} Xu Nova 🟡)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const SpaceHangarView: React.FC = () => {
  const {
    user,
    buyShip,
    equipShip,
    buyBooster,
    addNovaCoins,
    addDiamonds,
  } = useGameStore();

  const [activeSubTab, setActiveSubTab] = useState<'ships' | 'boosters'>('ships');
  const [adRewardMsg, setAdRewardMsg] = useState<string | null>(null);
  const [selectedShipDetail, setSelectedShipDetail] = useState<SpaceshipModelData | null>(null);

  const handleWatchAdReward = () => {
    soundService.playVictory();
    addNovaCoins(100);
    addDiamonds(10);
    setAdRewardMsg('🎉 Bạn đã nhận được +100 Xu Nova 🟡 & +10 Kim Cương 💎!');
    setTimeout(() => setAdRewardMsg(null), 4000);
  };

  const handleSelectShipCard = (s: SpaceshipModelData) => {
    soundService.playClick();
    setSelectedShipDetail(s);
  };

  const handleEquipShipInModal = (shipId: string) => {
    equipShip(shipId);
    setSelectedShipDetail(null);
  };

  const handleBuyShipInModal = (s: SpaceshipModelData) => {
    const ok = buyShip(s.id, s.price);
    if (!ok) {
      alert('Bạn không đủ Xu Nova 🟡! Hãy hoàn thành thêm bài học nhé.');
    } else {
      equipShip(s.id);
      setSelectedShipDetail(null);
    }
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-y-auto pb-24 p-4 sm:p-6 bg-gradient-to-b from-[#050814] via-[#0b1026] to-[#160e33] text-white select-none animate-fadeIn">
      {/* Top Header */}
      <div className="text-center mb-3">
        <h2 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-tight flex items-center justify-center gap-2">
          <span>🛠️</span> Xưởng Tàu Không Gian
        </h2>
        <p className="text-xs sm:text-sm font-bold text-sky-200 mt-0.5">
          Tùy biến phi thuyền, sơn màu 3D & nạp năng lượng
        </p>
      </div>

      {/* Sub Tabs Switcher (Clean 2-Tab Layout: Ships & Boosters) */}
      <div className="flex bg-slate-900/90 border border-sky-400/40 p-1 rounded-2xl mb-4 shrink-0 shadow-lg max-w-md mx-auto w-full">
        <button
          onClick={() => { soundService.playClick(); setActiveSubTab('ships'); }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'ships'
              ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>Phi Thuyền Không Gian</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveSubTab('boosters'); }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'boosters'
              ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Năng Lượng & Tiện Ích</span>
        </button>
      </div>

      {/* Ad Reward Banner Message */}
      {adRewardMsg && (
        <div className="bg-emerald-900/90 border-2 border-emerald-400 text-emerald-100 p-3.5 rounded-2xl text-xs font-black text-center mb-4 shadow-lg animate-scaleUp">
          {adRewardMsg}
        </div>
      )}

      {/* SubTab 1: 5 Aerodynamic Ships Customization */}
      {activeSubTab === 'ships' && (
        <div className="space-y-3 animate-fadeIn">
          {SHIPS_DATA.map((s) => {
            const isUnlocked = user.customization?.unlockedShips?.includes(s.id);
            const isEquipped = user.customization?.equippedShip === s.id;

            return (
              <div
                key={s.id}
                onClick={() => handleSelectShipCard(s)}
                className={`p-3.5 sm:p-4 rounded-3xl border-2 transition-all flex items-center justify-between gap-3 sm:gap-4 shadow-xl relative overflow-hidden cursor-pointer group active:scale-98 ${
                  isEquipped
                    ? 'bg-sky-950/90 border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_25px_rgba(56,189,248,0.3)]'
                    : isUnlocked
                    ? 'bg-slate-900/80 border-slate-700 hover:border-sky-400/60'
                    : 'bg-slate-900/50 border-slate-800 opacity-90'
                }`}
              >
                {/* Ship Graphic 3D Image Thumbnail (Clean, no overlapping text) */}
                <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 max-w-[56px] max-h-[56px] sm:max-w-[64px] sm:max-h-[64px] aspect-square rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-sky-400/40 shrink-0 shadow-lg relative overflow-hidden flex items-center justify-center">
                    <img
                      src={s.image}
                      alt={s.nameVi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm sm:text-base text-yellow-300 flex items-center gap-1.5 truncate">
                      <span>{s.nameVi}</span>
                      {isEquipped && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                    </h4>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">{s.classType}</p>
                    
                    {/* Highly Differentiated 3 Game Stats */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
                      <span className="bg-slate-950/80 border border-sky-500/30 px-1.5 py-0.5 rounded-lg text-[11px] font-black text-sky-300">
                        ⚡ {s.speed}
                      </span>
                      <span className="bg-slate-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-lg text-[11px] font-black text-emerald-300">
                        🛡️ {s.shield}
                      </span>
                      <span className="bg-slate-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded-lg text-[11px] font-black text-amber-300">
                        💥 {s.power}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status / Action Indicator */}
                <div className="shrink-0 flex items-center">
                  {s.isPlaceholder ? (
                    <span className="bg-indigo-950/90 text-indigo-300 font-black text-xs px-2.5 py-1.5 rounded-xl border border-indigo-400/50 shadow flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                      <span>Sắp Ra Mắt</span>
                    </span>
                  ) : isEquipped ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-black text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Lái
                    </span>
                  ) : isUnlocked ? (
                    <span className="bg-sky-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow border border-sky-300">
                      Chọn
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-amber-950 font-black text-xs px-2.5 py-1.5 rounded-xl border border-amber-300 shadow flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{s.price} 🟡</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Footer Note */}
          <div className="text-center text-xs font-bold text-slate-400 py-3 border-t border-slate-800/80 mt-2">
            Nhấn vào phi thuyền để xoay 3D 360°, sơn màu real-time và gắn cờ
          </div>
        </div>
      )}

      {/* SubTab 2: Energy & Boosters */}
      {activeSubTab === 'boosters' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Reactor & Capacity Overview */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-sky-400/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-amber-950 flex items-center justify-center text-3xl shadow-lg shrink-0">
                ⚡
              </div>
              <div>
                <span className="bg-sky-500/30 text-sky-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-sky-400/40">
                  Lò Phản Ứng Ion
                </span>
                <h4 className="font-black text-base sm:text-lg text-yellow-300 mt-1">Bình Năng Lượng Phi Thuyền</h4>
                <p className="text-xs text-sky-200 font-bold mt-0.5">Tự động nạp: +1 ⚡ mỗi 60 giây</p>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col items-end shrink-0">
              <div className="font-black text-2xl sm:text-3xl text-yellow-300 flex items-baseline gap-1">
                <span>{user.energy}</span>
                <span className="text-sm text-slate-400 font-bold">/ {user.maxEnergy} ⚡</span>
              </div>
              <div className="w-full sm:w-36 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-1.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-sky-400 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (user.energy / user.maxEnergy) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Boosters Grid */}
          <div className="space-y-3">
            {/* Double Regen */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-purple-500/50 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 border border-purple-300/50 flex items-center justify-center text-2xl shadow-lg shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-purple-300">Sạc Siêu Tốc x2 (30 Phút)</h4>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">Sạc năng lượng nhanh gấp đôi</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = buyBooster('double_regen', 15);
                  if (!ok) alert('Bạn không đủ Kim Cương 💎!');
                }}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl border border-purple-300 shadow-md active:scale-95 transition-all shrink-0"
              >
                💎 15
              </button>
            </div>

            {/* Boss Pass */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 border border-amber-300/50 flex items-center justify-center text-2xl shadow-lg shrink-0">
                  🎫
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-yellow-300">Vé Đấu Boss Miễn Phí</h4>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">Hiện có: <b className="text-yellow-300 font-black">{user.freeBossPassCount} vé</b></p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = buyBooster('boss_pass', 20);
                  if (!ok) alert('Bạn không đủ Kim Cương 💎!');
                }}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black text-xs px-4 py-2.5 rounded-2xl border border-yellow-200 shadow-md active:scale-95 transition-all shrink-0"
              >
                💎 20
              </button>
            </div>

            {/* Instant Refuel */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-300/50 flex items-center justify-center text-2xl shadow-lg shrink-0">
                  🔋
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-emerald-300">Hồi Phục Đầy Bình 50 ⚡</h4>
                  <p className="text-[11px] text-slate-300 font-medium mt-0.5">Đầy ngay 50 năng lượng tức thì</p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = buyBooster('instant_refuel', 25);
                  if (!ok) alert('Bạn không đủ Kim Cương 💎!');
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl border border-emerald-300 shadow-md active:scale-95 transition-all shrink-0"
              >
                💎 25
              </button>
            </div>

            {/* Watch Rewarded Ad Item */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/80 via-yellow-950/70 to-slate-900 border-2 border-yellow-400/80 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-lg shrink-0">
                  🎁
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-yellow-300">Quà Tiếp Tế Miễn Phí</h4>
                  <p className="text-[11px] text-amber-200 font-medium mt-0.5">+100 Xu 🟡 & +10 KC 💎</p>
                </div>
              </div>

              <button
                onClick={handleWatchAdReward}
                className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black text-xs px-4 py-2.5 rounded-2xl border-2 border-white shadow-xl active:scale-95 transition-all shrink-0"
              >
                Nhận Quà 📺
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive 3D Orbit Detail & Integrated Customization Modal */}
      {selectedShipDetail && (
        <ShipInteractiveDetailModal
          ship={selectedShipDetail}
          onClose={() => setSelectedShipDetail(null)}
          isUnlocked={user.customization?.unlockedShips?.includes(selectedShipDetail.id) ?? false}
          isEquipped={user.customization?.equippedShip === selectedShipDetail.id}
          onEquip={() => handleEquipShipInModal(selectedShipDetail.id)}
          onBuy={() => handleBuyShipInModal(selectedShipDetail)}
        />
      )}
    </div>
  );
};
