import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Zap, Diamond, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, settings, setActiveTab, activeTab } = useGameStore();
  const anyAudioEnabled = settings.bgmEnabled || settings.sfxEnabled;

  const xpProgress = Math.min(100, Math.round((user.xp / user.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left: User Profile & Level Badge */}
        <div 
          onClick={() => setActiveTab('parent')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-xl">
                {user.avatar === '🚀' ? '👨‍🚀' : user.avatar}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded-full border-2 border-slate-900 shadow">
              Lv.{user.level}
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100">{user.name}</span>
              <span className="text-xs text-slate-400 font-medium">(Lớp {user.grade})</span>
            </div>
            {/* XP Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 rounded-full"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono font-medium">
                {user.xp}/{user.xpToNextLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Currencies & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Energy */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse-subtle" />
            <span className="font-bold text-xs sm:text-sm text-emerald-300">
              {user.energy}/{user.maxEnergy}
            </span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
            <Diamond className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span className="font-bold text-xs sm:text-sm text-cyan-300">
              {user.gems}
            </span>
          </div>

          {/* Streak */}
          <div className="hidden xs:flex items-center gap-1 bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-400">
            <span>🔥</span>
            <span>{user.streakDays} ngày</span>
          </div>

          {/* Audio settings shortcut */}
          <button
            onClick={() => setActiveTab('settings')}
            aria-label="Mở cài đặt âm thanh"
            className={`p-2 rounded-xl border transition-all ${
              anyAudioEnabled
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/30' 
                : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'
            }`}
          >
            {anyAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Parent Mode Quick Access */}
          <button
            onClick={() => setActiveTab('parent')}
            aria-label="Dành cho Phụ Huynh"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all ${
              activeTab === 'parent'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Phụ Huynh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
