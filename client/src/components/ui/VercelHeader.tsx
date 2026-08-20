import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Volume2, VolumeX, Zap, Star } from 'lucide-react';

interface Props {
  title: string;
}

export const VercelHeader: React.FC<Props> = ({ title }) => {
  const { user, settings, toggleSound } = useGameStore();

  return (
    <header className="w-full bg-white border-b-2 border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
      <h1 className="font-black text-lg text-[#1e1b4b] tracking-tight">{title}</h1>

      <div className="flex items-center gap-2">
        {/* XP Badge */}
        <div className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{user.xp}</span>
        </div>

        {/* Stars Badge */}
        <div className="bg-yellow-100 text-yellow-900 border border-yellow-300 font-extrabold text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
          <span>{user.stars}</span>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>
    </header>
  );
};
