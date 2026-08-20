import React from 'react';
import { useGameStore, DemoStyleMode } from '../../stores/useGameStore';
import { interactionService } from '../../services/interaction';
import { Sparkles, Zap, Wand2 } from 'lucide-react';

export const DemoStyleSwitcher: React.FC = () => {
  const { demoStyleMode, setDemoStyleMode } = useGameStore();

  const styles: { id: DemoStyleMode; label: string; icon: string; tag: string; desc: string }[] = [
    { 
      id: 'gloss3d', 
      label: '1. High-Gloss 3D', 
      icon: '🎮', 
      tag: 'Brawl Stars / Duolingo',
      desc: 'Bóng bẩy, rực rỡ, bề mặt nổi 3D đa tầng & ánh kim loại Game' 
    },
    { 
      id: 'neopop', 
      label: '2. Neo-Pop', 
      icon: '⚡', 
      tag: 'Headspace / Neo-Brutalist',
      desc: 'Viền đen cá tính, mảng màu Pop tương phản cao, tối giản hiện đại' 
    },
    { 
      id: 'appleglass', 
      label: '3. Apple Glass', 
      icon: '🌌', 
      tag: 'Monument Valley / Arcade',
      desc: 'Kính mờ Frosted Glass, ánh sáng mềm mại sang trọng êm dịu' 
    },
  ];

  const handleSelect = (mode: DemoStyleMode) => {
    interactionService.playTap();
    setDemoStyleMode(mode);
  };

  const activeStyleInfo = styles.find(s => s.id === demoStyleMode) || styles[0];

  return (
    <div className="w-full bg-slate-900 text-white px-3 py-2 border-b border-slate-800 shrink-0 z-40 shadow-md select-none">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
          <Wand2 className="w-3.5 h-3.5 animate-spin-slow" />
          <span className="uppercase tracking-wider">Chọn Demo Phong Cách:</span>
        </div>
        <span className="text-[11px] font-bold text-slate-400 truncate">
          {activeStyleInfo.tag}
        </span>
      </div>

      {/* 3 Switcher Buttons */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
        {styles.map((st) => {
          const isActive = demoStyleMode === st.id;
          return (
            <button
              key={st.id}
              onClick={() => handleSelect(st.id)}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                isActive
                  ? st.id === 'gloss3d'
                    ? 'bg-gradient-to-b from-sky-400 to-blue-600 text-white shadow-[0_3px_0_0_#0369a1] scale-[1.02]'
                    : st.id === 'neopop'
                    ? 'bg-[#fde047] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] scale-[1.02]'
                    : 'backdrop-blur-md bg-white/90 text-indigo-950 shadow-[0_4px_12px_rgba(255,255,255,0.3)] scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="text-sm">{st.icon}</span>
              <span className="truncate text-[11px] font-black">{st.label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-300 font-medium mt-1 text-center truncate px-1">
        ✨ {activeStyleInfo.desc}
      </div>
    </div>
  );
};
