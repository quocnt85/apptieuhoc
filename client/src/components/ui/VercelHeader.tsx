import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Volume2, VolumeX, Zap, Sparkles } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  title?: string;
}

export const VercelHeader: React.FC<Props> = ({ title = 'Hành Tinh Tri Thức' }) => {
  const { user, settings, toggleSound, refreshEnergy, unlockGodMode } = useGameStore();
  const [countdownText, setCountdownText] = useState<string>('');

  // 5-click Easter Egg state
  const clickCountRef = React.useRef<number>(0);
  const lastClickRef = React.useRef<number>(0);

  const handleAvatarClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current > 4000) {
      clickCountRef.current = 1;
    } else {
      clickCountRef.current += 1;
    }
    lastClickRef.current = now;

    soundService.playClick();

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      unlockGodMode();
    }
  };

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
      {/* Pilot Avatar & Level Badge */}
      <div 
        onClick={handleAvatarClick}
        data-testid="header-avatar-btn"
        className="flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
        title="Nhấp 5 lần để mở Dev God Mode"
      >
        <div className="relative">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border-2 border-sky-400/80 flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            {user.avatar === '🚀' ? '👨‍🚀' : user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
            Lv.{user.level}
          </div>
        </div>

        <div className="hidden sm:flex flex-col">
          <span className="font-black text-xs text-yellow-300 leading-tight">{user.name}</span>
          <span className="font-bold text-[10px] text-sky-200">Phi Hành Gia (Lớp {user.grade})</span>
        </div>
      </div>

      {/* Center Screen Title */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 border border-sky-400/30 px-3.5 py-1 rounded-full shadow-inner">
        <span className="text-xs sm:text-sm font-black text-yellow-300 tracking-tight">{title}</span>
      </div>

      {/* Right Stats HUD (Energy, Nova Coins, Diamonds, Sound) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Energy Unit Chip */}
        <div
          title={countdownText}
          className="bg-slate-900/90 border border-sky-400/60 px-2 sm:px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="font-black text-xs text-sky-200">{user.energy}</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">/{user.maxEnergy}</span>
        </div>

        {/* Nova Coins Chip */}
        <div className="bg-slate-900/90 border border-amber-400/60 px-2 sm:px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <span className="text-xs">🟡</span>
          <span className="font-black text-xs text-yellow-300">{user.novaCoins}</span>
        </div>

        {/* Diamonds Chip */}
        <div className="bg-slate-900/90 border border-cyan-400/60 px-2 sm:px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <span className="text-xs">💎</span>
          <span className="font-black text-xs text-cyan-300">{user.diamonds}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="w-8 h-8 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all"
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>
    </header>
  );
};
