import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Compass, BookOpen, Gamepad2, Users, Settings } from 'lucide-react';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useGameStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'world', label: 'Bản Đồ', icon: <Compass className="w-5 h-5" /> },
    { id: 'explore', label: 'Thư Viện', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'practice', label: 'Mini Game', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'parent', label: 'Phụ Huynh', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Cài Đặt', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1329]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-indigo-500/20 shadow-sm shadow-indigo-500/30' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
