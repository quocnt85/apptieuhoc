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
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white p-6 text-center animate-fadeIn">
      <div className="text-7xl mb-4 animate-bounce-slow">🌟</div>
      <h1 className="text-3xl font-black text-[#fde047] tracking-tight mb-2">NOVASTARS</h1>
      <p className="text-base font-bold text-[#a5b4fc] mb-8">Phiêu Lưu Học Kỹ Năng Sống</p>

      {/* Loading bar */}
      <div className="w-52 h-2.5 bg-white/20 rounded-full overflow-hidden mb-4 p-0.5">
        <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full animate-pulse" style={{ width: '100%' }} />
      </div>
      <p className="text-xs text-slate-300 font-medium">Đang tải thế giới phiêu lưu...</p>
    </div>
  );
};
