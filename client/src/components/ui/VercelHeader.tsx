import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Volume2, VolumeX, Zap, Star } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Props {
  title: string;
}

export const VercelHeader: React.FC<Props> = ({ title }) => {
  const { user, settings, toggleSound } = useGameStore();

  const handleToggle = () => {
    interactionService.playTap();
    toggleSound();
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200/80 px-4 sm:px-6 pt-[max(0.85rem,var(--sat))] pb-3 flex items-center justify-between shadow-sm shrink-0 z-30 touch-action-manipulation">
      <div className="flex items-center gap-2">
        <span className="text-2xl animate-bounce-slow">⭐</span>
        <h1 className="font-black text-lg sm:text-xl text-[#1e1b4b] tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* XP Badge */}
        <div className="bg-amber-100/90 text-amber-900 border-2 border-amber-300 font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
          <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="font-black font-mono">{user.xp}</span>
        </div>

        {/* Stars Badge */}
        <div className="bg-yellow-100/90 text-yellow-900 border-2 border-yellow-300 font-extrabold text-xs sm:text-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
          <span className="font-black font-mono">{user.stars}</span>
        </div>

        {/* Sound Toggle (Large 44px Touch Target) */}
        <button
          onClick={handleToggle}
          aria-label="Bật tắt âm thanh"
          className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm ${
            settings.soundEnabled 
              ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-blue-500/10' 
              : 'bg-slate-100 border-slate-300 text-slate-400'
          }`}
        >
          {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

