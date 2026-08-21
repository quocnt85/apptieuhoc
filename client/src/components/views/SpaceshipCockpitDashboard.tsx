import React from 'react';
import { PlanetCoordinateNode, PlanetData } from '../../types';
import { useGameStore } from '../../stores/useGameStore';
import { Star, Sparkles, AlertCircle, ChevronDown, Lock, Rocket } from 'lucide-react';
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
  const {
    user,
    completedNodes,
    nodeStars,
    consumeEnergyForNode,
    startLesson,
    isNodeUnlocked,
    isPlanetUnlocked,
    selectPlanet,
  } = useGameStore();

  const isCompleted = Boolean(completedNodes[node.id]);
  const starsEarned = nodeStars[node.id] || (isCompleted ? 3 : 0);
  const isFirstTry = !isCompleted;
  const energyCost = isFirstTry ? 0 : node.isBoss ? (user.freeBossPassCount > 0 ? 0 : 20) : 10;
  const hasEnoughEnergy = isFirstTry || user.energy >= energyCost || (node.isBoss && user.freeBossPassCount > 0);

  const isUnlocked = isNodeUnlocked(node, planet?.id);
  const planetUnlocked = planet ? isPlanetUnlocked(planet.id) : true;

  const handleStart = () => {
    if (!isUnlocked) {
      soundService.playWrong();
      return;
    }
    const res = consumeEnergyForNode(node.id, node.isBoss);
    if (!res.success) {
      soundService.playWrong();
      return;
    }
    soundService.playVictory();
    onStartLesson(node);
  };

  const handleReturnToOriginPlanet = () => {
    soundService.playVictory();
    onClose();
    selectPlanet('bravery_prime');
  };

  const buttonText = !isUnlocked
    ? 'CHƯA MỞ KHÓA BÀI HỌC 🔒'
    : node.isBoss
    ? 'BẮT ĐẦU ĐẤU BOSS ⚔️'
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
        <div className="flex items-center justify-end w-full mb-2">
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
        <div className={`relative bg-gradient-to-b ${
          isUnlocked
            ? 'from-[#051126]/95 via-[#0a1b3d]/90 to-[#030914]/95 border-cyan-400/60 shadow-[inset_0_2px_20px_rgba(6,182,212,0.25)]'
            : 'from-[#1e140a]/95 via-[#1a1322]/90 to-[#0d0914]/95 border-amber-500/60 shadow-[inset_0_2px_20px_rgba(245,158,11,0.2)]'
        } border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-5 overflow-hidden`}>
          {/* Holographic Scanline Texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
            {/* Mission Hologram Icon Badge */}
            <div className="relative shrink-0">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-xl border-2 ${
                  !isUnlocked
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-400 text-slate-400 shadow-amber-500/20'
                    : node.isBoss
                    ? 'bg-gradient-to-br from-rose-500 to-amber-600 border-amber-300 shadow-rose-500/50 animate-pulse'
                    : 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-cyan-200 shadow-sky-500/50'
                }`}
              >
                {isUnlocked ? node.icon : <Lock className="w-8 h-8 text-amber-400" />}
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
              {(node.isBoss || !isUnlocked) && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  {node.isBoss && isUnlocked && (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-400/50 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md">
                      👑 BOSS TRANH ĐOẠT
                    </span>
                  )}
                  {!isUnlocked && (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>CHƯA MỞ KHÓA</span>
                    </span>
                  )}
                </div>
              )}

              <h3 className="font-black text-base sm:text-xl text-yellow-300 tracking-tight line-clamp-1">
                {node.title}
              </h3>

              {/* Reward & Energy HUD / Unlock Requirement Box */}
              {isUnlocked ? (
                <div className="flex items-center justify-center sm:justify-start gap-2.5 mt-2.5 flex-wrap">
                  <div className="bg-slate-900/80 border border-amber-400/40 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold text-amber-200 shadow-sm">
                    <span>🟡 +{node.rewardCoins}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-sky-300">+{node.rewardXp} XP</span>
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
                      <span>
                        {energyCost} / {user.energy}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                /* Locked State Notice Banner */
                <div className="mt-2.5 p-2 rounded-xl bg-amber-950/70 border border-amber-500/50 text-[11px] sm:text-xs text-amber-200 font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {!planetUnlocked
                      ? (planet?.unlockRequirement?.descriptionVi || 'Cần hoàn thành các bài học ở tinh cầu trước để giải mã tọa độ này.')
                      : `Cần đạt ${node.starsRequiredToUnlock} ⭐ để mở khóa bài học này (Hiện có: ${user.stars} ⭐).`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Insufficient Energy Warning */}
        {isUnlocked && !hasEnoughEnergy && (
          <div className="mt-3 bg-rose-950/80 border border-rose-500/60 p-2.5 rounded-xl flex items-center gap-2 text-rose-200 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Hết năng lượng! Hãy nghỉ ngơi hồi phục hoặc tiếp nhiên liệu tại Xưởng Tàu.</span>
          </div>
        )}

        {/* 3. MAIN ENGINE IGNITION BUTTON (Nút BẮT ĐẦU khởi hành / Quay về Tinh Cầu Dũng Khí) */}
        <div className="mt-3.5 flex flex-col gap-2">
          <button
            type="button"
            data-testid="start-lesson-btn"
            onClick={handleStart}
            disabled={!isUnlocked || !hasEnoughEnergy}
            className={`w-full min-h-[56px] sm:min-h-[62px] py-3.5 px-6 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg transition-all flex items-center justify-center gap-2.5 shadow-2xl relative overflow-hidden group ${
              isUnlocked && hasEnoughEnergy
                ? node.isBoss
                  ? 'bg-gradient-to-r from-rose-500 via-red-600 to-amber-600 text-white border-2 border-amber-300 shadow-[0_6px_0_0_#9f1239,0_10px_25px_rgba(244,63,94,0.5)] active:translate-y-1 active:shadow-[0_2px_0_0_#9f1239]'
                  : 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white border-2 border-sky-200 shadow-[0_6px_0_0_#0369a1,0_10px_25px_rgba(2,132,199,0.5)] active:translate-y-1 active:shadow-[0_2px_0_0_#0369a1]'
                : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {/* Shimmer light sweep animation across button */}
            {isUnlocked && hasEnoughEnergy && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 pointer-events-none" />
            )}

            <span className="tracking-wide drop-shadow-md">{buttonText}</span>
          </button>

          {/* Quick Return Button if on locked planet */}
          {!isUnlocked && planet?.id !== 'bravery_prime' && (
            <button
              type="button"
              onClick={handleReturnToOriginPlanet}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-sky-400/50 text-sky-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Rocket className="w-4 h-4 text-amber-400" />
              <span>Về Tinh Cầu Dũng Khí để mở khóa bài học 🪐</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
