import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Zap, Trophy, FastForward, Wrench } from 'lucide-react';
import { soundService } from '../../services/audio';
import { parentFeatureFlags } from '../../config/parentFeatureFlags';

interface Props {
  onSkipStage: () => void;
  onInstantComplete: () => void;
  currentStageIndex: number;
  totalStages: number;
}

export const QuickDevBar: React.FC<Props> = ({
  onSkipStage,
  onInstantComplete,
  currentStageIndex,
  totalStages,
}) => {
  const { isGodModeUnlocked, toggleDevPanel } = useGameStore();

  if ((!import.meta.env.DEV && !parentFeatureFlags.demoAccess) || !isGodModeUnlocked) return null;

  const handleSkip = () => {
    soundService.playClick();
    onSkipStage();
  };

  const handleComplete = () => {
    soundService.playVictory();
    onInstantComplete();
  };

  return (
    <div 
      data-testid="quick-dev-bar"
      className="w-full bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-amber-950/90 border-b border-amber-500/40 px-3 py-1.5 flex items-center justify-between shadow-lg text-white text-xs select-none z-30 shrink-0"
    >
      <div className="flex items-center gap-1.5">
        <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <Wrench className="w-3 h-3" /> Dev Mode
        </span>
        <span className="font-mono text-amber-200 text-[11px] hidden sm:inline">
          Màn {currentStageIndex + 1}/{totalStages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Skip Stage Button */}
        <button
          onClick={handleSkip}
          className="px-2.5 py-1 rounded-lg bg-sky-600/90 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all shadow"
          title="Bỏ qua giai đoạn hiện tại"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Qua Màn</span>
        </button>

        {/* Instant Complete Lesson Button */}
        <button
          onClick={handleComplete}
          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-[11px] flex items-center gap-1 active:scale-95 transition-all shadow"
          title="Hoàn thành bài học ngay lập tức với 3 sao"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Hoàn Thành 3⭐</span>
        </button>

        {/* Open Dev Panel */}
        <button
          onClick={() => toggleDevPanel(true)}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 active:scale-95 transition-all border border-amber-500/30"
          title="Mở bảng điều khiển Dev God Mode"
        >
          <Wrench className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
