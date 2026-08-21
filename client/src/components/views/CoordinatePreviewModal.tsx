import React from 'react';
import { PlanetCoordinateNode } from '../../types';
import { useGameStore } from '../../stores/useGameStore';
import { Zap, Star, Shield, Sparkles, X, AlertCircle } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  node: PlanetCoordinateNode;
  onStartLesson: (node: PlanetCoordinateNode) => void;
  onClose: () => void;
}

export const CoordinatePreviewModal: React.FC<Props> = ({ node, onStartLesson, onClose }) => {
  const { user, completedNodes, nodeStars, consumeEnergyForNode, startLesson } = useGameStore();

  const isCompleted = Boolean(completedNodes[node.id]);
  const starsEarned = nodeStars[node.id] || (isCompleted ? 3 : 0);
  const isFirstTry = !isCompleted;
  const energyCost = isFirstTry ? 0 : node.isBoss ? (user.freeBossPassCount > 0 ? 0 : 20) : 10;
  const hasEnoughEnergy = isFirstTry || user.energy >= energyCost || (node.isBoss && user.freeBossPassCount > 0);

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none pointer-events-auto">
      <div className="bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] border-2 border-sky-400/80 rounded-[32px] p-5 sm:p-6 max-w-sm sm:max-w-md w-full text-white shadow-[0_20px_50px_rgba(56,189,248,0.3)] relative overflow-hidden pointer-events-auto">
        {/* Glow ambient background */}
        <div className="absolute -top-12 inset-x-0 h-32 bg-gradient-to-b from-sky-400/20 to-transparent blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => { soundService.playClick(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Node Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-3 animate-float ${
              node.isBoss
                ? 'bg-gradient-to-br from-rose-500 to-amber-600 border-amber-300 shadow-rose-500/50'
                : 'bg-gradient-to-br from-sky-400 to-blue-600 border-sky-200 shadow-sky-500/50'
            }`}>
              {node.icon}
            </div>
            {isCompleted && (
              <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                <span className="bg-amber-400 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black flex items-center gap-1 border border-white shadow-md">
                  <Star className="w-3 h-3 fill-amber-950" />
                  <span>{starsEarned} / 3 Sao</span>
                </span>
              </div>
            )}
          </div>

          <h3 className="font-black text-lg sm:text-xl text-yellow-300 tracking-tight mt-1">
            {node.title}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-sky-200 mt-0.5">
            {node.subtitle}
          </p>
        </div>

        {/* Rewards & Energy Cost HUD */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="bg-slate-900/90 border border-amber-400/40 p-3 rounded-2xl flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-amber-300">Phần Thưởng</span>
            <div className="flex items-center gap-2 mt-1 font-black text-xs sm:text-sm">
              <span className="text-yellow-400">🟡 +{node.rewardCoins}</span>
              <span className="text-sky-300">⚡ +{node.rewardXp} XP</span>
            </div>
          </div>

          <div className={`border p-3 rounded-2xl flex flex-col items-center justify-center ${
            isFirstTry
              ? 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300'
              : hasEnoughEnergy
              ? 'bg-sky-950/80 border-sky-400/50 text-sky-300'
              : 'bg-rose-950/80 border-rose-400/50 text-rose-300'
          }`}>
            <span className="text-[11px] font-bold">Năng Lượng</span>
            <div className="flex items-center gap-1 mt-1 font-black text-xs sm:text-sm">
              {isFirstTry ? (
                <span className="text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Miễn phí: 0 ⚡
                </span>
              ) : node.isBoss && user.freeBossPassCount > 0 ? (
                <span className="text-yellow-300">🎫 Vé Boss</span>
              ) : (
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> {energyCost} / {user.energy} ⚡
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Warning if not enough energy */}
        {!hasEnoughEnergy && (
          <div className="bg-rose-900/60 border border-rose-500/60 p-2.5 rounded-xl flex items-center gap-2 text-rose-200 text-xs font-bold mb-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Hết năng lượng! Đợi hồi phục hoặc nạp tại Xưởng Tàu nhé.</span>
          </div>
        )}

        {/* Action Button */}
        <button
          data-testid="start-lesson-btn"
          onClick={handleStart}
          disabled={!hasEnoughEnergy}
          className={`w-full min-h-[54px] py-3.5 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
            hasEnoughEnergy
              ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white border-2 border-sky-200 shadow-[0_6px_0_0_#0284c7,0_10px_20px_rgba(2,132,199,0.4)] active:translate-y-1 active:shadow-[0_2px_0_0_#0284c7]'
              : 'bg-slate-700 text-slate-400 border border-slate-600 cursor-not-allowed'
          }`}
        >
          <span>{node.isBoss ? 'Đấu Boss ⚔️' : isCompleted ? 'Luyện Lại 🔄' : 'Bắt Đầu 🚀'}</span>
        </button>
      </div>
    </div>
  );
};
