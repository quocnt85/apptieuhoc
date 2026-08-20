import React, { useEffect } from 'react';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#241e5e] to-[#312e81] text-white p-6 sm:p-8 text-center animate-fadeIn select-none">
      <div className="text-7xl sm:text-8xl mb-4 animate-float animate-pulse-glow">🌟</div>
      <h1 className="text-3xl sm:text-4xl font-black text-[#fde047] tracking-tight mb-2 drop-shadow-md">NOVASTARS</h1>
      <p className="text-base sm:text-lg font-extrabold text-[#c7d2fe] mb-8 tracking-wide">Phiêu Lưu Học Kỹ Năng Sống</p>

      {/* 3D Candy Loading Bar */}
      <div className="w-56 sm:w-68 h-3.5 bg-white/20 rounded-full overflow-hidden mb-4 p-0.5 border border-white/25 shadow-inner">
        <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full animate-pulse shadow-sm" style={{ width: '100%' }} />
      </div>
      <p className="text-xs sm:text-sm text-indigo-200 font-bold">Đang tải thế giới phiêu lưu...</p>
    </div>
  );
};
