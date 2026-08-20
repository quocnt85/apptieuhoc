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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-[36px] border-4 border-indigo-600 p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-scaleUp">
        <div className="text-6xl animate-bounce-slow">🌟</div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b]">Chào Mừng Đến NovaStars!</h2>
        <p className="text-sm font-bold text-slate-700 leading-relaxed">
          Sao Nova chào em! Em đã sẵn sàng biến giờ dùng điện thoại thành hành trình phiêu lưu kỹ năng sống chưa?
        </p>

        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 text-left">
          <p className="font-black text-blue-900 text-xs mb-1">🗺️ Sứ Mệnh Đầu Tiên:</p>
          <p className="font-extrabold text-slate-800 text-sm">Đảo Dũng Cảm → Bài 1: Lời Chào Ngôi Sao</p>
        </div>

        <button
          onClick={handleStart}
          className="w-full min-h-[56px] py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-base shadow-lg shadow-blue-500/30 active:scale-95 transition-all ns-btn-3d ns-btn-primary"
        >
          Bắt Đầu Hành Trình Ngay! 🚀
        </button>
      </div>
    </div>
  );
};

