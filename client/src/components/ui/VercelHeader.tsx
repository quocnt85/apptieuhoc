import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Volume1, Volume2, VolumeX, Zap, Music, Sparkles, Rocket, Check, X } from 'lucide-react';
import { soundService } from '../../services/audio';
import { AvatarComposer } from '../personalization/AvatarComposer';
import { useParentZoneStore } from '../../stores/useParentZoneStore';

interface Props {
  title?: string;
}

export const VercelHeader: React.FC<Props> = () => {
  const { user, settings, toggleBgm, toggleSfx, setBgmStyle, refreshEnergy } = useGameStore();
  const activeChildId = useParentZoneStore((state) => state.activeProfileId);
  const [countdownText, setCountdownText] = useState<string>('');
  const [isAudioMenuOpen, setIsAudioMenuOpen] = useState<boolean>(false);
  const audioMenuRef = useRef<HTMLDivElement>(null);

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

  // Click outside to close audio menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (audioMenuRef.current && !audioMenuRef.current.contains(event.target as Node)) {
        setIsAudioMenuOpen(false);
      }
    };
    if (isAudioMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAudioMenuOpen]);

  const handleSelectStyle = (style: 'ambient' | 'adventure') => {
    setBgmStyle(style);
  };

  const currentStyle = settings.bgmStyle || 'ambient';
  const allAudioEnabled = settings.bgmEnabled && settings.sfxEnabled;
  const someAudioEnabled = settings.bgmEnabled || settings.sfxEnabled;

  return (
    <header className="w-full bg-slate-950/85 backdrop-blur-xl border-b border-sky-500/25 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl shrink-0 z-[60] select-none text-white relative">
      {/* Left: Interactive Currency & Energy Chips */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
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

      {/* Right: Sound Menu Toggle Button */}
      <div className="flex items-center gap-2">
        <AvatarComposer childId={activeChildId} presetAvatar={user.avatar === '🚀' ? '👨‍🚀' : user.avatar} className="hidden h-9 w-9 rounded-xl sm:block"/>
        <div className="relative" ref={audioMenuRef}>
        <button
          onClick={() => {
            soundService.playClick();
            setIsAudioMenuOpen((prev) => !prev);
          }}
          aria-label="Cài đặt âm thanh và nhạc nền"
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shadow-sm active:scale-95 ${
            isAudioMenuOpen
              ? 'bg-sky-600/30 border-sky-400 text-sky-300 shadow-sky-500/20 ring-2 ring-sky-500/30'
              : someAudioEnabled
              ? 'bg-slate-900/90 border-slate-700 hover:border-sky-400/60 text-sky-400 hover:text-white'
              : 'bg-slate-900/90 border-slate-700 text-slate-500 hover:text-slate-300'
          }`}
        >
          {allAudioEnabled ? <Volume2 className="w-4 h-4" /> : someAudioEnabled ? <Volume1 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Dropdown Audio Selector Popover */}
        {isAudioMenuOpen && (
          <div className="absolute right-0 top-11 w-72 sm:w-80 bg-slate-950/95 border border-sky-500/40 backdrop-blur-2xl rounded-2xl shadow-2xl p-3.5 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-black tracking-wider text-slate-200 uppercase">Âm thanh & Nhạc nền</span>
              </div>
              <button
                onClick={() => setIsAudioMenuOpen(false)}
                aria-label="Đóng cài đặt âm thanh"
                className="w-6 h-6 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Independent BGM toggle */}
            <div className="flex items-center justify-between bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/80" data-testid="header-bgm-toggle">
              <div className="flex items-center gap-2.5">
                <Music className={`w-4 h-4 ${settings.bgmEnabled ? 'text-sky-400' : 'text-slate-500'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-200">Nhạc nền BGM</div>
                  <div className="text-[10px] text-slate-400">{settings.bgmEnabled ? 'Đang phát nhạc nền' : 'Đã tắt nhạc nền'}</div>
                </div>
              </div>
              <button
                onClick={toggleBgm}
                aria-label="Bật tắt nhạc nền BGM"
                aria-pressed={settings.bgmEnabled}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  settings.bgmEnabled ? 'bg-sky-500 shadow-sm shadow-sky-500/50' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.bgmEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Independent SFX toggle */}
            <div className="flex items-center justify-between bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/80" data-testid="header-sfx-toggle">
              <div className="flex items-center gap-2.5">
                {settings.sfxEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <div>
                  <div className="text-xs font-bold text-slate-200">Hiệu ứng SFX</div>
                  <div className="text-[10px] text-slate-400">{settings.sfxEnabled ? 'Nút bấm, tàu và phần thưởng' : 'Đã tắt hiệu ứng'}</div>
                </div>
              </div>
              <button
                onClick={toggleSfx}
                aria-label="Bật tắt hiệu ứng âm thanh SFX"
                aria-pressed={settings.sfxEnabled}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                  settings.sfxEnabled ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.sfxEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* BGM Style Selection */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">
                Chọn phong cách BGM (Tone.js)
              </div>

              {/* Style 1: Chill Space Ambient */}
              <button
                onClick={() => handleSelectStyle('ambient')}
                disabled={!settings.bgmEnabled}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                  currentStyle === 'ambient'
                    ? 'bg-sky-950/60 border-sky-400 shadow-md shadow-sky-950/40 text-white'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                } ${!settings.bgmEnabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-98'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      🪐 Vũ trụ êm dịu
                    </span>
                    {currentStyle === 'ambient' && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Âm sắc ấm, êm ái, giúp học sinh tập trung làm bài
                  </p>
                </div>
              </button>

              {/* Style 2: Space Adventure */}
              <button
                onClick={() => handleSelectStyle('adventure')}
                disabled={!settings.bgmEnabled}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                  currentStyle === 'adventure'
                    ? 'bg-amber-950/50 border-amber-400 shadow-md shadow-amber-950/40 text-white'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300'
                } ${!settings.bgmEnabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-98'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Rocket className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      🚀 Phiêu lưu ngân hà
                    </span>
                    {currentStyle === 'adventure' && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Nhịp điệu sôi nổi, hào hùng, truyền cảm hứng khám phá
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  );
};
