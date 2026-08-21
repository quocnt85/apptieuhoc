import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { SHIPS_DATA } from '../../data/shipsData';
import { AerodynamicShipRenderer } from '../3d/ships/AerodynamicShips';
import { Rocket, Palette, Flag, Zap, Sparkles, Check, Lock, Gift, Eye, RotateCw, X, Wind, Trophy } from 'lucide-react';
import { soundService } from '../../services/audio';
import * as THREE from 'three';

// Interactive 3D Orbit Viewer Modal in Hangar
const ShipViewer3DModal: React.FC<{
  onClose: () => void;
  shipId: string;
  shipColor: string;
  hasVnFlag: boolean;
}> = ({ onClose, shipId, shipColor, hasVnFlag }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
      <div className="bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] border-2 border-sky-400 rounded-[32px] p-5 max-w-lg w-full text-white shadow-[0_0_50px_rgba(56,189,248,0.4)] relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => { soundService.playClick(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-black text-lg sm:text-xl text-yellow-300 flex items-center gap-2 mb-1">
          <Eye className="w-5 h-5 text-sky-400" />
          <span>Quan Sát Phi Thuyền 3D Thực Tế</span>
        </h3>
        <p className="text-xs text-sky-200 font-bold mb-3">
          Vuốt hoặc kéo chuột để xoay 360° quan sát cánh và động cơ
        </p>

        {/* 3D Canvas Container */}
        <div
          className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-radial from-[#1e1b4b] via-[#0b1026] to-[#050814] border border-sky-400/40 relative cursor-grab active:cursor-grabbing shadow-inner touch-none touch-canvas-interactive overscroll-none"
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
            style={{ touchAction: 'none' }}
            className="touch-none"
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 6, 5]} intensity={2.4} />
            <pointLight position={[-4, -3, -2]} intensity={1.5} color="#38bdf8" />
            <group ref={groupRef}>
              <AerodynamicShipRenderer
                shipId={shipId}
                shipColor={shipColor}
                hasVnFlag={hasVnFlag}
                showStreamlines={true}
                scale={1.2}
              />
            </group>
          </Canvas>

          {/* Floating Hint */}
          <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
            <span className="bg-slate-950/80 border border-white/20 text-sky-300 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
              <RotateCw className="w-3 h-3 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Chạm & vuốt màn hình để xoay 360°</span>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => { soundService.playClick(); onClose(); }}
          className="mt-4 w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-sky-400 to-blue-600 text-white border border-sky-200 shadow-lg active:scale-95 transition-all"
        >
          Đã Xong ✨
        </button>
      </div>
    </div>
  );
};

export const SpaceHangarView: React.FC<{ onOpenShowroom?: () => void }> = ({ onOpenShowroom }) => {
  const {
    user,
    buyShip,
    equipShip,
    buyColor,
    equipColor,
    toggleVietnamFlag,
    buyBooster,
    addNovaCoins,
    addDiamonds,
  } = useGameStore();

  const [activeSubTab, setActiveSubTab] = useState<'ships' | 'colors' | 'boosters'>('ships');
  const [adRewardMsg, setAdRewardMsg] = useState<string | null>(null);
  const [inspectShipId, setInspectShipId] = useState<string | null>(null);

  const currentShipColor = user.customization?.equippedColor || '#38bdf8';
  const hasVnFlag = user.customization?.hasVietnamFlag ?? true;

  const colorsList = [
    { hex: '#38bdf8', name: 'Xanh Lam Cyan', price: 0 },
    { hex: '#f59e0b', name: 'Vàng Hoàng Kim', price: 0 },
    { hex: '#ef4444', name: 'Đỏ Chiến Binh', price: 100 },
    { hex: '#10b981', name: 'Xanh Lục Bảo', price: 100 },
    { hex: '#8b5cf6', name: 'Tím Tinh Vân', price: 150 },
  ];

  const handleWatchAdReward = () => {
    soundService.playVictory();
    addNovaCoins(100);
    addDiamonds(10);
    setAdRewardMsg('🎉 Bạn đã nhận được +100 Xu Nova 🟡 & +10 Kim Cương 💎!');
    setTimeout(() => setAdRewardMsg(null), 4000);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-y-auto pb-24 p-4 sm:p-6 bg-gradient-to-b from-[#050814] via-[#0b1026] to-[#160e33] text-white select-none animate-fadeIn">
      {/* Top Header */}
      <div className="text-center mb-3">
        <h2 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-tight flex items-center justify-center gap-2">
          <span>🛠️</span> Xưởng Tàu Không Gian
        </h2>
        <p className="text-xs sm:text-sm font-bold text-sky-200 mt-0.5">
          Tùy biến phi thuyền chuẩn khí động học, sơn màu & nạp năng lượng
        </p>
      </div>

      {/* Button to Open Full 3D Showroom View */}
      <div className="mb-4 space-y-2">
        {onOpenShowroom && (
          <button
            onClick={() => { soundService.playClick(); onOpenShowroom(); }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-black text-sm sm:text-base border-2 border-sky-300 shadow-[0_6px_20px_rgba(56,189,248,0.35)] flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>🪐 Mở Phòng Duyệt 3D (5 Tàu Vũ Trụ & 5 Hành Tinh) ✨</span>
          </button>
        )}

        <button
          onClick={() => { soundService.playClick(); setInspectShipId(user.customization?.equippedShip || 'explorer_v1'); }}
          className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-sky-200 font-bold text-xs sm:text-sm border border-sky-500/40 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Eye className="w-4 h-4 text-sky-400" />
          <span>Mở Phòng Ngắm Tàu Vũ Trụ 3D (Xoay 360°)</span>
        </button>
      </div>

      {/* Sub Tabs Switcher */}
      <div className="flex bg-slate-900/90 border border-sky-400/40 p-1 rounded-2xl mb-4 shrink-0 shadow-lg">
        <button
          onClick={() => { soundService.playClick(); setActiveSubTab('ships'); }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'ships'
              ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>Phi Thuyền</span>
        </button>

        <button
          onClick={() => { soundService.playClick(); setActiveSubTab('colors'); }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'colors'
              ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Màu Sơn & Cờ</span>
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
          <span>Năng Lượng & Buff</span>
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
        <div className="space-y-3.5 animate-fadeIn">
          {SHIPS_DATA.map((s) => {
            const isUnlocked = user.customization?.unlockedShips?.includes(s.id);
            const isEquipped = user.customization?.equippedShip === s.id;

            return (
              <div
                key={s.id}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden ${
                  isEquipped
                    ? 'bg-sky-950/80 border-sky-400 shadow-sky-500/20'
                    : isUnlocked
                    ? 'bg-slate-900/80 border-slate-700'
                    : 'bg-slate-900/50 border-slate-800 opacity-85'
                }`}
              >
                {/* Ship Graphic Card */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-sky-400/50 flex items-center justify-center p-2 shrink-0 shadow-lg relative text-3xl">
                    🚀
                    <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow">
                      {s.badge}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-black text-sm sm:text-base text-yellow-300">{s.nameVi}</h4>
                    <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">{s.description}</p>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-500/30">
                        $C_d: {s.dragCoefficientCd}$ • Mach {s.maxMachSpeed}
                      </span>
                      <button
                        onClick={() => { soundService.playClick(); setInspectShipId(s.id); }}
                        className="text-sky-400 hover:text-sky-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem 3D
                      </button>
                    </div>
                  </div>
                </div>

                {/* Equip / Buy Action Button */}
                <div className="w-full sm:w-auto flex justify-end shrink-0">
                  {isEquipped ? (
                    <span className="w-full sm:w-auto justify-center bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-black text-xs px-4 py-2 rounded-2xl flex items-center gap-1 shadow">
                      <Check className="w-4 h-4" /> Đang Trang Bị
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => equipShip(s.id)}
                      className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl border border-sky-300 shadow transition-all"
                    >
                      Trang Bị
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const ok = buyShip(s.id, s.price);
                        if (!ok) alert('Bạn không đủ Xu Nova 🟡! Hãy hoàn thành thêm bài học nhé.');
                      }}
                      className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 active:scale-95 text-amber-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl border border-amber-300 shadow transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>🟡 Mở Khóa ({s.price} Xu)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SubTab 2: Paint Colors & Vietnam Flag */}
      {activeSubTab === 'colors' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Vietnam Flag Decal Toggle */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/70 via-slate-900/80 to-slate-900/80 border-2 border-red-500/60 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-red-600 border-2 border-yellow-300 flex items-center justify-center text-3xl shadow-lg">
                ⭐
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-yellow-300 flex items-center gap-1.5">
                  <span>Quốc Kỳ Việt Nam</span>
                  <Flag className="w-4 h-4 text-red-400" />
                </h4>
                <p className="text-xs text-slate-300 font-medium mt-0.5">Dán cờ đỏ sao vàng trên cánh phi thuyền</p>
              </div>
            </div>

            <button
              onClick={toggleVietnamFlag}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm border transition-all active:scale-95 shadow-lg ${
                user.customization?.hasVietnamFlag
                  ? 'bg-red-600 text-white border-yellow-300 shadow-red-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-600'
              }`}
            >
              {user.customization?.hasVietnamFlag ? '✅ Đã Dán Cờ' : 'Bật Dán Cờ'}
            </button>
          </div>

          {/* Paint Colors Palette */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-700 space-y-3 shadow-lg">
            <h4 className="font-black text-sm text-sky-200">Sơn Màu Thân Tàu Không Gian</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {colorsList.map((c) => {
                const isUnlocked = user.customization?.unlockedColors?.includes(c.hex);
                const isEquipped = user.customization?.equippedColor === c.hex;

                return (
                  <div
                    key={c.hex}
                    className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-between shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-black text-xs sm:text-sm text-white">{c.name}</span>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
                          <Check className="w-4 h-4" /> Đang Dùng
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => equipColor(c.hex)}
                          className="bg-sky-600 hover:bg-sky-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl active:scale-95 shadow"
                        >
                          Chọn
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const ok = buyColor(c.hex, c.price);
                            if (!ok) alert('Bạn không đủ Xu Nova 🟡!');
                          }}
                          className="bg-amber-500 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-xl active:scale-95 shadow"
                        >
                          🟡 {c.price}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Boosters & Energy */}
      {activeSubTab === 'boosters' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Giant Energy Reactor Status Card */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-r from-sky-950 via-blue-950 to-indigo-950 border-3 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_24px_rgba(56,189,248,0.6)] shrink-0 animate-pulse">
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
          <div className="space-y-3.5">
            {/* Double Regen */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-purple-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 border-2 border-purple-300/50 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-purple-300 flex items-center gap-2">
                    <span>Siêu Tốc Nạp Năng Lượng x2 (30 Phút)</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                    Tăng gấp đôi tốc độ sạc: Nạp 1 ⚡ mỗi 30 giây trong 30 phút.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = buyBooster('double_regen', 15);
                  if (!ok) alert('Bạn không đủ Kim Cương 💎!');
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl border border-purple-300 shadow-lg active:scale-95 transition-all shrink-0"
              >
                💎 Mua (15 KC)
              </button>
            </div>

            {/* Boss Pass */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 border-2 border-amber-300/50 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  🎫
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-yellow-300 flex items-center gap-2">
                    <span>Vé Khiêu Chiến Boss Miễn Phí</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                    Miễn phí 1 lần đấu Boss mà không tốn 20 ⚡ (Hiện có: <b className="text-yellow-300 font-black">{user.freeBossPassCount} vé</b>).
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = buyBooster('boss_pass', 20);
                  if (!ok) alert('Bạn không đủ Kim Cương 💎!');
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-amber-950 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl border border-yellow-200 shadow-lg active:scale-95 transition-all shrink-0"
              >
                💎 Mua (20 KC)
              </button>
            </div>

            {/* Instant Refuel */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-300/50 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  🔋
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-emerald-300 flex items-center gap-2">
                    <span>Nạp Đầy Bình 50/50 Tức Thì</span>
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                    Lập tức hồi phục đầy 50 đơn vị năng lượng cho phi thuyền.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const ok = buyBooster('instant_refuel', 25);
                  if (!ok) alert('Bạn không đủ Kim Cương 💎!');
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl border border-emerald-300 shadow-lg active:scale-95 transition-all shrink-0"
              >
                💎 Mua (25 KC)
              </button>
            </div>

            {/* Watch Rewarded Ad Item */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-yellow-950/70 to-slate-900 border-2 border-yellow-400/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-lg shrink-0">
                  🎁
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-yellow-300">Nhận Quà Tiếp Tế Vũ Trụ Miễn Phí</h4>
                  <p className="text-xs text-amber-200 font-medium mt-1">Thưởng ngay: +100 Xu Nova 🟡 & +10 Kim Cương 💎</p>
                </div>
              </div>

              <button
                onClick={handleWatchAdReward}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl border-2 border-white shadow-xl active:scale-95 transition-all shrink-0"
              >
                Nhận Quà Tiếp Tế 📺
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D Ship Inspector Modal */}
      {inspectShipId && (
        <ShipViewer3DModal
          onClose={() => setInspectShipId(null)}
          shipId={inspectShipId}
          shipColor={currentShipColor}
          hasVnFlag={hasVnFlag}
        />
      )}
    </div>
  );
};
