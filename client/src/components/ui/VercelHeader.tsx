import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Volume2, VolumeX, Zap, Star } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Props {
  title: string;
}

export const VercelHeader: React.FC<Props> = ({ title }) => {
  const { user, settings, toggleSound, demoStyleMode } = useGameStore();

  const handleToggle = () => {
    interactionService.playTap();
    toggleSound();
  };

  // 1. High-Gloss 3D Game Style
  if (demoStyleMode === 'gloss3d') {
    return (
      <header className="w-full bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950/95 backdrop-blur-md border-b-2 border-indigo-500/40 px-4 sm:px-6 pt-[max(0.85rem,var(--sat))] pb-3 flex items-center justify-between shadow-xl shrink-0 z-30 touch-action-manipulation select-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-float filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">⭐</span>
          <h1 className="font-black text-lg sm:text-xl text-yellow-300 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* XP Badge 3D Glossy */}
          <div className="bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-amber-950 border-2 border-amber-200/90 shadow-[0_3px_0_0_#78350f,0_4px_10px_rgba(245,158,11,0.4)] font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-amber-950 text-amber-950 animate-pulse" />
            <span className="font-black font-mono tracking-wide">{user.xp}</span>
          </div>

          {/* Stars Badge 3D Glossy */}
          <div className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 text-yellow-950 border-2 border-yellow-100 shadow-[0_3px_0_0_#854d0e,0_4px_10px_rgba(234,179,8,0.4)] font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-950 text-yellow-950 animate-bounce-slow" />
            <span className="font-black font-mono tracking-wide">{user.stars}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggle}
            aria-label="Bật tắt âm thanh"
            className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-120 active:translate-y-1 ${
              settings.soundEnabled 
                ? 'bg-gradient-to-b from-sky-400 to-blue-600 border-sky-300 text-white shadow-[0_4px_0_0_#075985]' 
                : 'bg-slate-800 border-slate-700 text-slate-400 shadow-[0_3px_0_0_#0f172a]'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5 drop-shadow" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>
    );
  }

  // 2. Playful Neo-Pop Style
  if (demoStyleMode === 'neopop') {
    return (
      <header className="w-full bg-white border-b-3 border-slate-900 px-4 sm:px-6 pt-[max(0.85rem,var(--sat))] pb-3 flex items-center justify-between shadow-[0_4px_0_0_#0f172a] shrink-0 z-30 touch-action-manipulation select-none">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-float">⭐</span>
          <h1 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* XP Chip Neo-Pop */}
          <div className="bg-[#fde047] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] font-black text-xs sm:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span className="font-black font-mono">{user.xp}</span>
          </div>

          {/* Stars Chip Neo-Pop */}
          <div className="bg-[#86efac] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] font-black text-xs sm:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span className="font-black font-mono">{user.stars}</span>
          </div>

          {/* Sound Toggle Neo-Pop */}
          <button
            onClick={handleToggle}
            aria-label="Bật tắt âm thanh"
            className={`w-11 h-11 rounded-2xl border-2 border-slate-900 flex items-center justify-center transition-all duration-120 active:translate-x-0.5 active:translate-y-0.5 ${
              settings.soundEnabled 
                ? 'bg-[#93c5fd] text-slate-900 shadow-[3px_3px_0_0_#0f172a]' 
                : 'bg-slate-200 text-slate-500 shadow-[2px_2px_0_0_#0f172a]'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>
    );
  }

  // 3. Apple Arcade Glassmorphism Style
  return (
    <header className="w-full backdrop-blur-2xl bg-white/75 border-b border-white/80 px-4 sm:px-6 pt-[max(0.85rem,var(--sat))] pb-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.03)] shrink-0 z-30 touch-action-manipulation select-none">
      <div className="flex items-center gap-2">
        <span className="text-2xl animate-float">⭐</span>
        <h1 className="font-black text-lg sm:text-xl text-indigo-950 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* XP Badge Glass */}
        <div className="backdrop-blur-md bg-white/80 text-amber-900 border border-amber-200/80 shadow-[0_4px_12px_rgba(245,158,11,0.15)] font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
          <Zap className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span className="font-black font-mono">{user.xp}</span>
        </div>

        {/* Stars Badge Glass */}
        <div className="backdrop-blur-md bg-white/80 text-yellow-900 border border-yellow-200/80 shadow-[0_4px_12px_rgba(234,179,8,0.15)] font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 animate-bounce-slow" />
          <span className="font-black font-mono">{user.stars}</span>
        </div>

        {/* Sound Toggle Glass */}
        <button
          onClick={handleToggle}
          aria-label="Bật tắt âm thanh"
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-120 active:scale-90 ${
            settings.soundEnabled 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-white/60 text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)]' 
              : 'bg-white/70 border-slate-200 text-slate-400'
          }`}
        >
          {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};


