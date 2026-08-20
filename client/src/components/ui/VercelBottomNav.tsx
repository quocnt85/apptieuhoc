import React from 'react';
import { Home, Map, User } from 'lucide-react';
import { soundService } from '../../services/audio';

export type VercelTab = 'home' | 'map' | 'profile';

interface Props {
  activeTab: VercelTab;
  onChangeTab: (tab: VercelTab) => void;
}

export const VercelBottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: VercelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang Chủ', icon: <Home className="w-5 h-5" /> },
    { id: 'map', label: 'Bản Đồ', icon: <Map className="w-5 h-5" /> },
    { id: 'profile', label: 'Hồ Sơ', icon: <User className="w-5 h-5" /> },
  ];

  const handleSelect = (tab: VercelTab) => {
    soundService.playClick();
    onChangeTab(tab);
  };

  return (
    <nav className="w-full bg-white border-t-2 border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg shrink-0">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-150 ${
              isActive
                ? 'text-blue-600 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-bold'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'bg-blue-50' : ''}`}>
              {t.icon}
            </div>
            <span className="text-[11px] mt-0.5">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
