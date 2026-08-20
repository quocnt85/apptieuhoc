import React from 'react';
import { Home, Map, Gamepad2, User } from 'lucide-react';
import { interactionService } from '../../services/interaction';
import { useGameStore } from '../../stores/useGameStore';

export type VercelTab = 'home' | 'map' | 'minigame' | 'profile';

interface Props {
  activeTab: VercelTab;
  onChangeTab: (tab: VercelTab) => void;
}

export const VercelBottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const { demoStyleMode } = useGameStore();

  const tabs: { id: VercelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang Chủ', icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'map', label: 'Bản Đồ', icon: <Map className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'minigame', label: 'Mini Game', icon: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" /> },
    { id: 'profile', label: 'Hồ Sơ', icon: <User className="w-5 h-5 sm:w-6 sm:h-6" /> },
  ];

  const handleSelect = (tab: VercelTab) => {
    interactionService.playTap();
    onChangeTab(tab);
  };

  // 0. Sunny Playful Clay (Default Kids World)
  if (demoStyleMode === 'sunnyclay') {
    return (
      <nav className="w-full bg-white/95 backdrop-blur-md border-t-2 border-sky-100 px-2 sm:px-6 pt-2 pb-[max(0.75rem,var(--sab))] flex items-center justify-around shadow-lg shrink-0 z-30 touch-action-manipulation select-none">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`min-w-[68px] min-h-[54px] flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-120 active:scale-90 ${
                isActive ? 'text-sky-700 font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 text-white shadow-[0_3px_0_0_#0284c7] scale-110' 
                  : 'bg-transparent text-slate-400'
              }`}>
                {t.icon}
              </div>
              <span className={`text-[11px] sm:text-xs mt-1 tracking-tight ${isActive ? 'font-black text-sky-700' : 'font-bold text-slate-400'}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // 1. High-Gloss 3D Game Style
  if (demoStyleMode === 'gloss3d') {
    return (
      <nav className="w-full bg-slate-900/95 backdrop-blur-md border-t-2 border-indigo-500/30 px-2 sm:px-6 pt-2 pb-[max(0.75rem,var(--sab))] flex items-center justify-around shadow-2xl shrink-0 z-30 touch-action-manipulation select-none">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`min-w-[68px] min-h-[54px] flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-120 active:scale-90 ${
                isActive ? 'text-cyan-300 font-black' : 'text-slate-400 hover:text-slate-200 font-bold'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-[0_4px_0_0_#1e1b4b,0_0_12px_rgba(6,182,212,0.5)] scale-110' 
                  : 'bg-transparent text-slate-400'
              }`}>
                {t.icon}
              </div>
              <span className={`text-[11px] sm:text-xs mt-1 tracking-tight ${isActive ? 'font-black text-cyan-300 drop-shadow' : 'font-bold text-slate-400'}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // 2. Playful Neo-Pop Style
  if (demoStyleMode === 'neopop') {
    return (
      <nav className="w-full bg-white border-t-3 border-slate-900 px-2 sm:px-6 pt-2 pb-[max(0.75rem,var(--sab))] flex items-center justify-around shadow-[0_-4px_0_0_#0f172a] shrink-0 z-30 touch-action-manipulation select-none">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`min-w-[68px] min-h-[54px] flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-120 active:translate-y-0.5 ${
                isActive ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-[#fde047] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] scale-110' 
                  : 'bg-transparent text-slate-500'
              }`}>
                {t.icon}
              </div>
              <span className={`text-[11px] sm:text-xs mt-1 tracking-tight ${isActive ? 'font-black text-slate-950' : 'font-bold text-slate-500'}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // 3. Apple Arcade Glassmorphism Style
  return (
    <nav className="w-full backdrop-blur-2xl bg-white/75 border-t border-white/80 px-2 sm:px-6 pt-2 pb-[max(0.75rem,var(--sab))] flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.03)] shrink-0 z-30 touch-action-manipulation select-none">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`min-w-[68px] min-h-[54px] flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-120 active:scale-90 ${
              isActive ? 'text-indigo-600 font-black' : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <div className={`p-2 rounded-full transition-all ${
              isActive 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.35)] scale-110' 
                : 'bg-transparent text-slate-400'
            }`}>
              {t.icon}
            </div>
            <span className={`text-[11px] sm:text-xs mt-1 tracking-tight ${isActive ? 'font-black text-indigo-600' : 'font-bold text-slate-500'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};


