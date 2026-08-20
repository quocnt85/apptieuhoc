import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Rocket, Palette, Flag, Zap, Shield, Sparkles, Check, Lock, Gift } from 'lucide-react';
import { soundService } from '../../services/audio';

export const SpaceHangarView: React.FC = () => {
  const {
    user,
    buyShip,
    equipShip,
    buyColor,
    equipColor,
    toggleVietnamFlag,
    equipAvatar,
    buyBooster,
    addNovaCoins,
    addDiamonds,
  } = useGameStore();

  const [activeSubTab, setActiveSubTab] = useState<'ships' | 'colors' | 'boosters'>('ships');
  const [adRewardMsg, setAdRewardMsg] = useState<string | null>(null);

  const shipsList = [
    { id: 'explorer_v1', name: 'Tàu Thám Hiểm (Explorer V1)', price: 0, icon: '🚀', desc: 'Phi thuyền cơ bản nhanh nhẹn, thích hợp mọi tinh cầu.' },
    { id: 'falcon_apex', name: 'Tàu Tia Chớp (Falcon Apex)', price: 300, icon: '🛸', desc: 'Thiết kế khí động học siêu thanh, động cơ ion kép.' },
    { id: 'starlight_runner', name: 'Tàu Tinh Cầu (Starlight Runner)', price: 600, icon: '🛰️', desc: 'Vỏ titan chống bức xạ vũ trụ, vệt lửa đa sắc.' },
  ];

  const colorsList = [
    { hex: '#38bdf8', name: 'Xanh Lam Cyan', price: 0 },
    { hex: '#f59e0b', name: 'Vàng Hoàng Kim', price: 0 },
    { hex: '#ef4444', name: 'Đỏ Chiến Binh', price: 100 },
    { hex: '#10b981', name: 'Xanh Lục Bảo', price: 100 },
    { hex: '#8b5cf6', name: 'Tím Tinh Vân', price: 150 },
  ];

  const avatarList = ['🚀', '👧', '👦', '🤖', '🦊', '⭐', '🦁', '🐼', '🦄', '🦖'];

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
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-tight flex items-center justify-center gap-2">
          <span>🛠️</span> Xưởng Tàu Không Gian
        </h2>
        <p className="text-xs sm:text-sm font-bold text-sky-200 mt-0.5">
          Tùy biến phi thuyền, sơn màu, dán cờ Việt Nam & nạp năng lượng
        </p>
      </div>

      {/* Sub Tabs Switcher */}
      <div className="flex bg-slate-900/90 border border-sky-400/40 p-1 rounded-2xl mb-4 shrink-0 shadow-lg">
        <button
          onClick={() => { soundService.playClick(); setActiveSubTab('ships'); }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
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
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
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
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
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
        <div className="bg-emerald-900/90 border-2 border-emerald-400 text-emerald-100 p-3 rounded-2xl text-xs font-black text-center mb-4 shadow-lg animate-scaleUp">
          {adRewardMsg}
        </div>
      )}

      {/* SubTab 1: Ships Customization */}
      {activeSubTab === 'ships' && (
        <div className="space-y-3 animate-fadeIn">
          {shipsList.map((s) => {
            const isUnlocked = user.customization?.unlockedShips?.includes(s.id);
            const isEquipped = user.customization?.equippedShip === s.id;

            return (
              <div
                key={s.id}
                className={`p-4 rounded-3xl border-2 transition-all flex items-center justify-between gap-3 shadow-lg ${
                  isEquipped
                    ? 'bg-sky-950/80 border-sky-400 shadow-sky-500/20'
                    : isUnlocked
                    ? 'bg-slate-900/80 border-slate-700'
                    : 'bg-slate-900/50 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-yellow-300">{s.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-[200px] sm:max-w-xs">{s.desc}</p>
                  </div>
                </div>

                <div>
                  {isEquipped ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đang Dùng
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => equipShip(s.id)}
                      className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-2xl border border-sky-300 shadow transition-all"
                    >
                      Trang Bị
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const ok = buyShip(s.id, s.price);
                        if (!ok) alert('Bạn không đủ Xu Nova 🟡! Hãy hoàn thành thêm bài học nhé.');
                      }}
                      className="bg-amber-500 hover:bg-amber-400 active:scale-95 text-amber-950 font-black text-xs px-4 py-2 rounded-2xl border border-amber-300 shadow transition-all flex items-center gap-1"
                    >
                      <span>🟡 {s.price} Xu</span>
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
          <div className="p-4 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900/80 to-slate-900/80 border-2 border-red-500/60 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 border-2 border-yellow-300 flex items-center justify-center text-2xl shadow">
                ⭐
              </div>
              <div>
                <h4 className="font-black text-sm text-yellow-300 flex items-center gap-1.5">
                  <span>Quốc Kỳ Việt Nam</span>
                  <Flag className="w-4 h-4 text-red-400" />
                </h4>
                <p className="text-xs text-slate-300 font-medium">Dán cờ đỏ sao vàng trên cánh phi thuyền</p>
              </div>
            </div>

            <button
              onClick={toggleVietnamFlag}
              className={`px-4 py-2 rounded-2xl font-black text-xs border transition-all active:scale-95 shadow ${
                user.customization?.hasVietnamFlag
                  ? 'bg-red-600 text-white border-yellow-300 shadow-red-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-600'
              }`}
            >
              {user.customization?.hasVietnamFlag ? '✅ Đã Dán Cờ' : 'Bật Dán Cờ'}
            </button>
          </div>

          {/* Paint Colors Palette */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-700 space-y-3">
            <h4 className="font-black text-sm text-sky-200">Sơn Màu Thân Tàu Không Gian</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {colorsList.map((c) => {
                const isUnlocked = user.customization?.unlockedColors?.includes(c.hex);
                const isEquipped = user.customization?.equippedColor === c.hex;

                return (
                  <div
                    key={c.hex}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-bold text-xs text-white">{c.name}</span>
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đang Dùng
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => equipColor(c.hex)}
                          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] px-3 py-1 rounded-xl"
                        >
                          Chọn
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const ok = buyColor(c.hex, c.price);
                            if (!ok) alert('Bạn không đủ Xu Nova 🟡!');
                          }}
                          className="bg-amber-500 text-amber-950 font-black text-[11px] px-3 py-1 rounded-xl"
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

      {/* SubTab 3: Energy & Boosters */}
      {activeSubTab === 'boosters' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Energy Status Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-sky-950/80 via-blue-950/80 to-slate-900 border-2 border-sky-400/60 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 border border-white/30 flex items-center justify-center text-2xl shadow">
                ⚡
              </div>
              <div>
                <h4 className="font-black text-sm text-yellow-300">Bình Năng Lượng Phi Thuyền</h4>
                <p className="text-xs text-sky-200 font-medium">Tự động nạp: 1 ⚡ mỗi 60 giây</p>
              </div>
            </div>
            <div className="text-right font-black">
              <span className="text-lg text-sky-300">{user.energy}</span>
              <span className="text-xs text-slate-400"> / {user.maxEnergy} ⚡</span>
            </div>
          </div>

          {/* Booster Item 1: x2 Regen Speed */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-sky-300 flex items-center gap-1.5">
                <span>⚡ Siêu Năng Lượng x2 (30 Phút)</span>
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Tăng tốc độ nạp pin lên 1 ⚡ mỗi 30 giây.</p>
            </div>
            <button
              onClick={() => {
                const ok = buyBooster('double_regen', 15);
                if (!ok) alert('Bạn không đủ Kim Cương 💎!');
              }}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs px-3.5 py-2 rounded-2xl border border-purple-300 shadow active:scale-95 transition-all"
            >
              💎 15 KC
            </button>
          </div>

          {/* Booster Item 2: Free Boss Pass */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-yellow-300 flex items-center gap-1.5">
                <span>🎫 Vé Khiêu Chiến Boss Miễn Phí</span>
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Miễn phí 1 lần đấu Boss mà không tốn 20 ⚡ (Hiện có: {user.freeBossPassCount}).
              </p>
            </div>
            <button
              onClick={() => {
                const ok = buyBooster('boss_pass', 20);
                if (!ok) alert('Bạn không đủ Kim Cương 💎!');
              }}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs px-3.5 py-2 rounded-2xl border border-purple-300 shadow active:scale-95 transition-all"
            >
              💎 20 KC
            </button>
          </div>

          {/* Booster Item 3: Instant Refuel */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="font-black text-sm text-emerald-300 flex items-center gap-1.5">
                <span>🔋 Nạp Đầy Bình 50/50 Ngay</span>
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Lập tức đầy 50 đơn vị năng lượng cho tàu.</p>
            </div>
            <button
              onClick={() => {
                const ok = buyBooster('instant_refuel', 25);
                if (!ok) alert('Bạn không đủ Kim Cương 💎!');
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs px-3.5 py-2 rounded-2xl border border-emerald-300 shadow active:scale-95 transition-all"
            >
              💎 25 KC
            </button>
          </div>

          {/* Watch Rewarded Video Ad for Free Rewards */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/70 via-yellow-950/60 to-slate-900 border-2 border-yellow-400/70 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow">
                🎁
              </div>
              <div>
                <h4 className="font-black text-sm text-yellow-300">Nhận Quà Tiếp Tế Vũ Trụ</h4>
                <p className="text-xs text-amber-200 font-medium">+100 Xu Nova 🟡 & +10 Kim Cương 💎</p>
              </div>
            </div>
            <button
              onClick={handleWatchAdReward}
              className="bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-black text-xs px-4 py-2.5 rounded-2xl border border-white shadow active:scale-95 transition-all"
            >
              Nhận Quà 📺
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
