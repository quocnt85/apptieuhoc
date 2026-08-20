import React from 'react';
import { Home, Map, Gamepad2, User } from 'lucide-react';
import { interactionService } from '../../services/interaction';

export type VercelTab = 'home' | 'map' | 'minigame' | 'profile';

interface Props {
  activeTab: VercelTab;
  onChangeTab: (tab: VercelTab) => void;
}

export const VercelBottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => {
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

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t-2 border-slate-200/80 px-2 sm:px-6 pt-2 pb-[max(0.75rem,var(--sab))] flex items-center justify-around shadow-lg shrink-0 z-30 touch-action-manipulation">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`min-w-[64px] min-h-[52px] flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-90 ${
              isActive
                ? 'text-blue-600 font-black'
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              isActive 
                ? 'bg-blue-100 text-blue-600 shadow-sm scale-110' 
                : 'bg-transparent'
            }`}>
              {t.icon}
            </div>
            <span className={`text-xs mt-0.5 tracking-tight ${isActive ? 'font-black text-blue-600' : 'font-bold'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

