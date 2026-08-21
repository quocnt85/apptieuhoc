import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Volume2, VolumeX, Zap } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  title?: string;
}

export const VercelHeader: React.FC<Props> = () => {
  const { user, settings, toggleSound, refreshEnergy } = useGameStore();
  const [countdownText, setCountdownText] = useState<string>('');

  // Live timer for energy regeneration
  useEffect(() => {
    const timer = setInterval(() => {
      refreshEnergy();
      if (user.energy < user.maxEnergy) {
        const now = Date.now();
        const elapsed = Math.floor((now - user.lastEnergyTimestamp) / 1000);
        const isDouble = user.doubleRegenUntil && user.doubleRegenUntil > now;
        const interval = isDouble ? 30 : 60;
        const remaining = Math.max(0, interval - (elapsed % interval));
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        setCountdownText(`+1 in ${mins}:${secs < 10 ? '0' : ''}${secs}`);
      } else {
        setCountdownText('Đầy ⚡');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user.energy, user.maxEnergy, user.lastEnergyTimestamp, user.doubleRegenUntil, refreshEnergy]);

  const handleToggleSound = () => {
    soundService.playClick();
    toggleSound();
  };

  return (
    <header className="w-full bg-slate-950/85 backdrop-blur-xl border-b border-sky-500/25 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl shrink-0 z-30 select-none text-white">
      {/* Left: Interactive Currency & Energy Chips */}
      <div 
        className="flex items-center gap-1.5 sm:gap-2.5"
      >
        {/* Energy Unit Chip */}
        <div
          title={countdownText}
          className="bg-slate-900/90 border border-sky-400/60 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm hover:border-sky-300 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="font-black text-xs sm:text-sm text-sky-200">{user.energy}</span>
          <span className="text-[10px] text-slate-400 font-bold">/{user.maxEnergy}</span>
        </div>

        {/* Nova Coins Chip */}
        <div className="bg-slate-900/90 border border-amber-400/60 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm hover:border-amber-300 transition-colors">
          <span className="text-xs">🟡</span>
          <span className="font-black text-xs sm:text-sm text-yellow-300">{user.novaCoins}</span>
        </div>

        {/* Diamonds Chip */}
        <div className="bg-slate-900/90 border border-cyan-400/60 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm hover:border-cyan-300 transition-colors">
          <span className="text-xs">💎</span>
          <span className="font-black text-xs sm:text-sm text-cyan-300">{user.diamonds}</span>
        </div>
      </div>

      {/* Right: Sound Toggle */}
      <div className="flex items-center">
        <button
          onClick={handleToggleSound}
          aria-label="Bật tắt âm thanh"
          className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-sky-400/60 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-sm"
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>
    </header>
  );
};
