import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Wrench } from 'lucide-react';
import { soundService } from '../../services/audio';

export const DevFloatingButton: React.FC = () => {
  const { isGodModeUnlocked, isDevPanelOpen, toggleDevPanel } = useGameStore();

  if (!isGodModeUnlocked || isDevPanelOpen) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.playClick();
    toggleDevPanel(true);
  };

  return (
    <button
      data-testid="dev-floating-btn"
      onClick={handleClick}
      aria-label="Mở Dev God Mode"
      className="fixed bottom-20 right-4 z-[80] bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-3 py-2 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.5)] border-2 border-yellow-200 flex items-center gap-1.5 font-black text-xs hover:scale-105 active:scale-95 transition-transform select-none"
    >
      <Wrench className="w-4 h-4" />
      <span>GOD MODE</span>
    </button>
  );
};
