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
    <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn select-none">
      <div className="bg-white rounded-[32px] border-4 border-indigo-500 p-6 sm:p-7 max-w-sm sm:max-w-md w-full text-center space-y-4 shadow-2xl animate-scaleUp">
        <div className="text-6xl animate-float animate-pulse-glow">🌟</div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b]">Chào Mừng Đến NovaStars!</h2>
        <p className="text-sm font-bold text-slate-700 leading-relaxed">
          Sao Nova chào em! Em đã sẵn sàng biến giờ dùng điện thoại thành hành trình phiêu lưu kỹ năng sống chưa?
        </p>

        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-4 rounded-2xl border-2 border-sky-200 text-left shadow-sm">
          <p className="font-black text-sky-900 text-xs mb-1">🗺️ Sứ Mệnh Đầu Tiên:</p>
          <p className="font-black text-indigo-950 text-sm">Đảo Dũng Cảm → Bài 1: Lời Chào Ngôi Sao</p>
        </div>

        <button
          onClick={handleStart}
          className="w-full min-h-[58px] py-4 rounded-2xl font-black text-base shadow-lg shadow-sky-500/25 active:scale-95 transition-all ns-btn-3d ns-btn-primary flex items-center justify-center gap-2"
        >
          <span>Bắt Đầu Hành Trình Ngay!</span>
          <span>🚀</span>
        </button>
      </div>
    </div>
  );
};

