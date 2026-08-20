
import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Volume2, VolumeX } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface VercelHeaderProps {
  title: string;
}

export const VercelHeader: React.FC<VercelHeaderProps> = ({ title }) => {
  const { user, settings, toggleSound } = useGameStore();

  const handleToggle = () => {
    interactionService.playTap();
    toggleSound();
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-xl border-b border-sky-200/70 px-4 sm:px-6 pt-[max(0.85rem,var(--sat))] pb-3 flex items-center justify-between shadow-[0_4px_20px_rgba(56,189,248,0.12)] shrink-0 z-30 touch-action-manipulation select-none">
      {/* Brand & Mascot */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <img 
            src="/assets/3d/star_mascot.png" 
            alt="Sao Nova" 
            className="w-10 h-10 object-contain drop-shadow-[0_4px_10px_rgba(251,191,36,0.5)] animate-float" 
          />
          <div className="absolute -inset-1 bg-yellow-400/20 blur-md rounded-full -z-10 animate-pulse" />
        </div>
        <div>
          <h1 className="font-black text-lg sm:text-xl text-sky-950 tracking-tight leading-none flex items-center gap-1.5">
            {title}
          </h1>
          <span className="text-[10px] font-black text-sky-500 uppercase tracking-wider">Hành Tinh Tri Thức</span>
        </div>
      </div>

      {/* 3D HUD Stats */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 3D XP Diamond Crystal */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-300 shadow-[0_3px_0_0_#38bdf8,0_4px_12px_rgba(56,189,248,0.2)] font-black text-xs sm:text-sm px-3 py-1.5 rounded-full flex items-center gap-2 transition-all">
          <img 
            src="/assets/3d/gem_xp.png" 
            alt="XP Crystal" 
            className="w-5 h-5 object-contain drop-shadow-[0_0_6px_rgba(56,189,248,0.8)] animate-pulse" 
          />
          <span className="font-black font-mono text-sky-950">{user.xp} XP</span>
        </div>

        {/* 3D Star Badge */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-[0_3px_0_0_#f59e0b,0_4px_12px_rgba(245,158,11,0.2)] font-black text-xs sm:text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all">
          <span className="text-base animate-bounce-slow filter drop-shadow">⭐</span>
          <span className="font-black font-mono text-amber-950">{user.stars}</span>
        </div>

        {/* 3D Sound Toggle */}
        <button
          onClick={handleToggle}
          aria-label="Bật tắt âm thanh"
          className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-120 active:translate-y-1 ${
            settings.soundEnabled 
              ? 'bg-gradient-to-b from-sky-400 to-sky-500 border-sky-300 text-white shadow-[0_4px_0_0_#0284c7,0_4px_12px_rgba(2,132,199,0.3)]' 
              : 'bg-slate-100 border-slate-300 text-slate-400 shadow-[0_3px_0_0_#cbd5e1]'
          }`}
        >
          {settings.soundEnabled ? <Volume2 className="w-5 h-5 drop-shadow" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
