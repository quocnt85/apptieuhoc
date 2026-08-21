import React, { useEffect } from 'react';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-slate-950 text-white select-none relative overflow-hidden animate-fadeIn">
      {/* Background Cinematic Space Splash Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/novastars_splash_art.jpg"
          alt="NovaStars Space Adventure"
          className="w-full h-full object-cover object-center animate-scaleSlow"
        />
        {/* Gradients to blend UI smoothly */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/80 to-transparent" />
      </div>

      {/* Top Brand Subtitle */}
      <div className="relative z-10 pt-10 sm:pt-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-950/60 backdrop-blur-md border border-sky-400/50 px-4 py-1 rounded-full shadow-lg">
          <span className="text-yellow-300 animate-spin" style={{ animationDuration: '8s' }}>⭐</span>
          <span className="text-xs sm:text-sm font-black tracking-wider text-sky-200 uppercase">Hành Tinh Học Kỹ Năng Sống</span>
        </div>
      </div>

      {/* Bottom Loading Progress & Action Indicator */}
      <div className="relative z-10 pb-12 sm:pb-16 px-6 flex flex-col items-center text-center">
        {/* Loading Progress Bar */}
        <div className="w-64 sm:w-72 h-3.5 bg-slate-950/80 backdrop-blur-md rounded-full overflow-hidden mb-3 p-0.5 border-2 border-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
          <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-sky-400 rounded-full animate-pulse shadow-sm" style={{ width: '100%' }} />
        </div>
        
        <p className="text-xs sm:text-sm text-sky-200 font-black tracking-wide drop-shadow flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Đang nạp năng lượng & khởi động hành trình...</span>
        </p>
      </div>
    </div>
  );
};

