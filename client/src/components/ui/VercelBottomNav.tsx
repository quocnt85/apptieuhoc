import React from 'react';
import { Home, Globe2, Wrench, User } from 'lucide-react';
import { soundService } from '../../services/audio';

export type VercelTab = 'home' | 'planet' | 'hangar' | 'profile' | 'showroom';

interface Props {
  activeTab: VercelTab;
  onChangeTab: (tab: VercelTab) => void;
}

export const VercelBottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: VercelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang Chủ', icon: <span className="text-xl sm:text-2xl select-none leading-none drop-shadow">🛸</span> },
    { id: 'planet', label: 'Hành Tinh', icon: <span className="text-xl sm:text-2xl select-none leading-none drop-shadow">🪐</span> },
    { id: 'hangar', label: 'Xưởng Tàu', icon: <span className="text-xl sm:text-2xl select-none leading-none drop-shadow">🛠️</span> },
    { id: 'profile', label: 'Hồ Sơ', icon: <span className="text-xl sm:text-2xl select-none leading-none drop-shadow">👨‍🚀</span> },
  ];

  const handleSelect = (tab: VercelTab) => {
    soundService.playClick();
    onChangeTab(tab);
  };

  return (
    <nav className="w-full bg-slate-950/90 backdrop-blur-xl border-t border-sky-500/25 px-2 sm:px-6 pt-2 pb-[max(0.75rem,var(--sab))] flex items-center justify-around shadow-[0_-4px_24px_rgba(0,0,0,0.8)] shrink-0 z-30 touch-action-manipulation select-none">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`min-w-[68px] min-h-[54px] flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
              isActive ? 'text-sky-300 font-black' : 'text-slate-500 hover:text-slate-300 font-bold'
            }`}
          >
            <div
              className={`p-2 rounded-2xl transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 text-white shadow-[0_4px_0_0_#0284c7,0_6px_16px_rgba(2,132,199,0.45)] scale-110'
                  : 'bg-transparent text-slate-500'
              }`}
            >
              {t.icon}
            </div>
            <span
              className={`text-[11px] sm:text-xs mt-1 tracking-tight ${
                isActive ? 'font-black text-yellow-300' : 'font-bold text-slate-500'
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
