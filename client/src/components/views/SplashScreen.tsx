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
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 text-white p-6 sm:p-8 text-center animate-fadeIn select-none relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 bg-yellow-300/25 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="relative mb-4">
        <img 
          src="/assets/3d/star_mascot.png" 
          alt="Sao Nova" 
          className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_12px_24px_rgba(251,191,36,0.6)] animate-float" 
        />
        <div className="absolute -inset-2 bg-yellow-300/30 blur-xl rounded-full -z-10 animate-pulse" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-yellow-300 tracking-tight mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        NOVASTARS
      </h1>
      <p className="text-sm sm:text-base font-extrabold text-sky-100 mb-8 tracking-wide">
        Hành Tinh Học Kỹ Năng Sống
      </p>

      {/* 3D Starlight Loading Bar */}
      <div className="w-56 sm:w-68 h-3.5 bg-white/20 rounded-full overflow-hidden mb-3.5 p-0.5 border border-white/30 shadow-inner">
        <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 rounded-full animate-pulse shadow-sm" style={{ width: '100%' }} />
      </div>
      <p className="text-xs sm:text-sm text-sky-100 font-bold">Đang kết nối hành tinh tri thức...</p>
    </div>
  );
};
