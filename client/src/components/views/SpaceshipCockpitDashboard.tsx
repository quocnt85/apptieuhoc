import React, { useState } from 'react';
import { PlanetCoordinateNode, PlanetData } from '../../types';
import { useGameStore } from '../../stores/useGameStore';
import { Zap, Star, Shield, Sparkles, X, AlertCircle, Radio, Gauge, Power, Compass, ChevronDown } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  node: PlanetCoordinateNode;
  planet?: PlanetData;
  onStartLesson: (node: PlanetCoordinateNode) => void;
  onClose: () => void;
}

export const SpaceshipCockpitDashboard: React.FC<Props> = ({
  node,
  planet,
  onStartLesson,
  onClose,
}) => {
  const { user, completedNodes, nodeStars, consumeEnergyForNode, startLesson } = useGameStore();
  const [activeToggle, setActiveToggle] = useState<Record<string, boolean>>({
    radar: true,
    shields: true,
    warp: true,
  });

  const isCompleted = Boolean(completedNodes[node.id]);
  const starsEarned = nodeStars[node.id] || (isCompleted ? 3 : 0);
  const isFirstTry = !isCompleted;
  const energyCost = isFirstTry ? 0 : node.isBoss ? (user.freeBossPassCount > 0 ? 0 : 20) : 10;
  const hasEnoughEnergy = isFirstTry || user.energy >= energyCost || (node.isBoss && user.freeBossPassCount > 0);

  const handleToggleSwitch = (key: string) => {
    soundService.playClick();
    setActiveToggle((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStart = () => {
    const res = consumeEnergyForNode(node.id, node.isBoss);
    if (!res.success) {
      soundService.playWrong();
      return;
    }
    soundService.playVictory();
    onStartLesson(node);
    startLesson(node.id);
  };

  const buttonText = node.isBoss
    ? 'BẮT ĐẦU ĐẤU BOSS ⚔️'
    : isCompleted
    ? 'BẮT ĐẦU LUYỆN LẠI 🔄'
    : 'BẮT ĐẦU 🚀';

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col justify-end select-none pointer-events-auto">
      {/* Semi-transparent backdrop overlay to focus on cockpit */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-auto"
        onClick={() => { soundService.playClick(); onClose(); }}
      />

      {/* Main Spaceship Cockpit Control Board (Sliding from bottom) */}
      <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-b from-[#0b1329] via-[#0f172a] to-[#050814] border-t-3 border-x-2 border-sky-400/80 rounded-t-[36px] sm:rounded-t-[44px] shadow-[0_-15px_50px_rgba(56,189,248,0.35)] px-4 pt-3 pb-6 sm:px-6 sm:pb-8 flex flex-col z-10 animate-slideUpBottom overflow-hidden">
        {/* Cockpit Canopy Top Handle & Fast Dismiss */}
        <div className="flex items-center justify-between w-full mb-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-sky-500/40 rounded-full text-[11px] font-black text-sky-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="tracking-wider">TỌA ĐỘ ĐÃ KHÓA: {node.id.toUpperCase()}</span>
          </div>

          {/* Minimize / Close Cockpit Button */}
          <button
            type="button"
            onClick={() => { soundService.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full bg-slate-800/90 border border-white/25 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 active:scale-90 transition-all shadow-md"
            title="Đóng bảng điều khiển"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* 1. MISSION TACTICAL MONITOR SCREEN (Màn hình lớn hiển thị thông tin bài học) */}
        <div className="relative bg-gradient-to-b from-[#051126]/95 via-[#0a1b3d]/90 to-[#030914]/95 border-2 border-cyan-400/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[inset_0_2px_20px_rgba(6,182,212,0.25)] overflow-hidden">
          {/* Holographic Scanline Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
            {/* Mission Hologram Icon Badge */}
            <div className="relative shrink-0">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-2 ${
                  node.isBoss
                    ? 'bg-gradient-to-br from-rose-500 to-amber-600 border-amber-300 shadow-rose-500/50 animate-pulse'
                    : 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-cyan-200 shadow-sky-500/50'
                }`}
              >
                {node.icon}
              </div>
              {isCompleted && (
                <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                  <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 border border-white shadow-md">
                    <Star className="w-3 h-3 fill-amber-950" />
                    <span>{starsEarned}/3</span>
                  </span>
                </div>
              )}
            </div>

            {/* Mission Details */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md uppercase">
                  {planet?.titleVi || 'Nhiệm Vụ Không Gian'}
                </span>
                {node.isBoss && (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-400/50 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md">
                    👑 BOSS TRANH ĐOẠT
                  </span>
                )}
              </div>

              <h3 className="font-black text-base sm:text-xl text-yellow-300 tracking-tight line-clamp-1">
                {node.title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-sky-100/90 mt-0.5 line-clamp-2">
                {node.subtitle}
              </p>

              {/* Reward & Energy HUD in Monitor */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-2.5 flex-wrap">
                <div className="bg-slate-900/80 border border-amber-400/40 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold text-amber-200 shadow-sm">
                  <span>🟡 +{node.rewardCoins} Xu</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-sky-300">⚡ +{node.rewardXp} XP</span>
                </div>

                <div
                  className={`border px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-bold shadow-sm ${
                    isFirstTry
                      ? 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
                      : hasEnoughEnergy
                      ? 'bg-sky-950/80 border-sky-400/50 text-sky-300'
                      : 'bg-rose-950/80 border-rose-400/50 text-rose-300'
                  }`}
                >
                  {isFirstTry ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Miễn phí lượt đầu!
                    </span>
                  ) : node.isBoss && user.freeBossPassCount > 0 ? (
                    <span>🎫 Vé Boss Miễn Phí</span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" /> {energyCost} / {user.energy} ⚡
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. COCKPIT SUB-SYSTEM GAUGES & BUTTONS (Hệ thống đồng hồ, công tắc & nút bấm tàu) */}
        <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3 items-center">
          {/* Gauge 1: Planetary Environment Dial */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center shadow-inner">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Compass className="w-3 h-3 text-sky-400" />
              <span>MÔI TRƯỜNG</span>
            </div>
            <div className="text-xs sm:text-sm font-black text-cyan-300 mt-0.5">
              {planet?.surfaceTemp || '25°C'}
            </div>
            <span className="text-[9px] text-slate-400 font-semibold">{planet?.gravity || '1.0 G'} Trọng lực</span>
          </div>

          {/* Gauge 2: Warp Reactor Core */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center shadow-inner">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Power className="w-3 h-3 text-amber-400" />
              <span>ĐỘNG CƠ</span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-emerald-400 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </div>
            <span className="text-[9px] text-slate-400 font-semibold">Warp Drive 100%</span>
          </div>

          {/* Controls: Cockpit Toggle Switches */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-center shadow-inner">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>PHÒNG HỘ</span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSwitch('shields')}
              className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-black transition-all border ${
                activeToggle.shields
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                  : 'bg-slate-800 border-slate-600 text-slate-400'
              }`}
            >
              {activeToggle.shields ? '🛡️ KHIÊN BẬT' : 'TẮT'}
            </button>
          </div>
        </div>

        {/* Insufficient Energy Warning */}
        {!hasEnoughEnergy && (
          <div className="mt-3 bg-rose-950/80 border border-rose-500/60 p-2.5 rounded-xl flex items-center gap-2 text-rose-200 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Hết năng lượng! Hãy nghỉ ngơi hồi phục hoặc tiếp nhiên liệu tại Xưởng Tàu.</span>
          </div>
        )}

        {/* 3. MAIN ENGINE IGNITION BUTTON (Nút BẮT ĐẦU siêu to khởi hành) */}
        <div className="mt-3.5">
          <button
            type="button"
            data-testid="start-lesson-btn"
            onClick={handleStart}
            disabled={!hasEnoughEnergy}
            className={`w-full min-h-[56px] sm:min-h-[62px] py-3.5 px-6 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg transition-all flex items-center justify-center gap-2.5 shadow-2xl relative overflow-hidden group ${
              hasEnoughEnergy
                ? node.isBoss
                  ? 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 text-white border-2 border-amber-300 shadow-[0_6px_0_0_#9f1239,0_10px_25px_rgba(244,63,94,0.5)] active:translate-y-1 active:shadow-[0_2px_0_0_#9f1239]'
                  : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white border-2 border-sky-200 shadow-[0_6px_0_0_#0369a1,0_10px_25px_rgba(2,132,199,0.5)] active:translate-y-1 active:shadow-[0_2px_0_0_#0369a1]'
                : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {/* Shimmer light sweep animation across button */}
            {hasEnoughEnergy && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 pointer-events-none" />
            )}

            <span className="tracking-wide drop-shadow-md">{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
