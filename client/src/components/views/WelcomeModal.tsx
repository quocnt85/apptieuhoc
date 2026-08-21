import React from 'react';
import { interactionService } from '../../services/interaction';

interface Props {
  onStart: () => void;
}

export const WelcomeModal: React.FC<Props> = ({ onStart }) => {
  const handleStart = () => {
    interactionService.playVictory();
    onStart();
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn select-none">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-[36px] border-2 border-sky-400/50 p-6 sm:p-7 max-w-sm sm:max-w-md w-full text-center space-y-4 shadow-[0_20px_50px_rgba(56,189,248,0.3)] animate-scaleUp relative overflow-hidden text-white">
        {/* Glow ambient */}
        <div className="absolute -top-10 inset-x-0 h-32 bg-gradient-to-b from-sky-400/20 to-transparent blur-xl pointer-events-none" />

        <div className="relative">
          <img 
            src="/assets/3d/star_mascot.png" 
            alt="Sao Nova" 
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain mx-auto drop-shadow-[0_8px_20px_rgba(251,191,36,0.6)] animate-float" 
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-yellow-300">Chào Phi Hành Gia Nhí!</h2>
        <p className="text-sm font-bold text-slate-300 leading-relaxed">
          Sẵn sàng lái phi thuyền thám hiểm các <span className="text-sky-300">Hành Tinh Tri Thức</span> chưa?
        </p>

        <div className="bg-slate-950/80 p-3.5 rounded-3xl border border-sky-500/30 text-left shadow-sm">
          <p className="font-black text-sky-400 text-xs mb-0.5">🪐 Điểm Dừng Đầu Tiên:</p>
          <p className="font-black text-white text-sm">Tinh Cầu Dũng Khí • Bài 1</p>
        </div>

        <button
          onClick={handleStart}
          className="w-full min-h-[56px] py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white border-2 border-sky-200 shadow-[0_8px_0_0_#0284c7,0_12px_24px_rgba(2,132,199,0.35)] active:translate-y-1 active:shadow-[0_2px_0_0_#0284c7] flex items-center justify-center gap-2 transition-all"
        >
          <span>Bắt Đầu Ngay 🚀</span>
        </button>
      </div>
    </div>
  );
};
