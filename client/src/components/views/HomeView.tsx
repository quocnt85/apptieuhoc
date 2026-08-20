import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Flame, Sparkles, Map, Rocket, CheckCircle2, ChevronRight } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Props {
  onNavigateToMap: () => void;
  onNavigateToMiniGame?: () => void;
}

export const HomeView: React.FC<Props> = ({ onNavigateToMap, onNavigateToMiniGame }) => {
  const { user } = useGameStore();

  const dailyQuests = [
    { id: 'q1', title: 'Hoàn thành 1 bài học kỹ năng', progress: 1, max: 1, rewardXp: 50, done: true, action: onNavigateToMap },
    { id: 'q2', title: 'Thực hành chào lễ phép với người thân', progress: 0, max: 1, rewardXp: 30, done: false, action: onNavigateToMap },
    { id: 'q3', title: 'Chiến thắng 1 thử thách Mini-game', progress: 1, max: 1, rewardXp: 40, done: true, action: onNavigateToMiniGame || onNavigateToMap },
  ];

  const handleAction = (cb?: () => void) => {
    interactionService.playTap();
    if (cb) cb();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#fefce8] text-slate-800 select-none">
      {/* 3D Starlight Welcome Hero Card */}
      <div className="p-5 sm:p-6 bg-white/95 backdrop-blur-xl border-2 border-sky-200/80 shadow-[0_12px_32px_rgba(56,189,248,0.18)] rounded-[32px] relative overflow-hidden">
        {/* Background ambient starlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-yellow-300/20 via-sky-300/20 to-transparent blur-2xl pointer-events-none -z-10" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-b from-sky-100 to-indigo-100 border-2 border-sky-300 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {user.avatar}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 text-yellow-950 font-black text-[10px] px-2 py-0.5 rounded-full border-2 border-white shadow">
                Lớp {user.grade}
              </div>
            </div>
            <div>
              <h2 className="font-black text-xl sm:text-2xl text-sky-950 flex items-center gap-1.5">
                <span>Chào {user.name}!</span>
              </h2>
              <div className="font-extrabold text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                <span>Chuỗi ngày:</span>
                <span className="bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 border border-amber-200 shadow-[0_2px_0_0_#d97706] px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-black">
                  <Flame className="w-3.5 h-3.5 fill-amber-950 text-amber-950 animate-pulse" /> {user.streakDays} Ngày
                </span>
              </div>
            </div>
          </div>

          {/* 3D Mascot Floating Accent */}
          <div className="relative shrink-0 hidden xs:block">
            <img 
              src="/assets/3d/star_mascot.png" 
              alt="Sao Nova" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_8px_16px_rgba(251,191,36,0.5)] animate-float" 
            />
          </div>
        </div>

        {/* Primary Starlight Adventure CTA */}
        <button
          onClick={() => handleAction(onNavigateToMap)}
          className="w-full min-h-[58px] mt-4 py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white border-2 border-sky-200 shadow-[0_8px_0_0_#0284c7,0_12px_24px_rgba(2,132,199,0.35)] active:translate-y-1 active:shadow-[0_2px_0_0_#0284c7] flex items-center justify-center gap-2 transition-all group"
        >
          <Map className="w-5 h-5 drop-shadow group-hover:rotate-12 transition-transform" />
          <span className="drop-shadow">Bắt Đầu Phiêu Lưu Kỳ Thú 🗺️</span>
        </button>
      </div>

      {/* 3D Quick Launch Mini-Game Banner */}
      <div 
        onClick={() => handleAction(onNavigateToMiniGame)}
        className="p-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 border-2 border-violet-300/80 shadow-[0_8px_0_0_#5b21b6,0_12px_28px_rgba(91,33,182,0.3)] text-white rounded-[30px] flex items-center justify-between cursor-pointer active:translate-y-1 transition-all relative overflow-hidden group"
      >
        {/* Shimmer line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="relative shrink-0">
            <img 
              src="/assets/3d/rocket_spaceship.png" 
              alt="Phi Thuyền Nova" 
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)] animate-bounce-slow" 
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-yellow-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Minigame Vũ Trụ</span>
            </div>
            <h3 className="font-black text-sm sm:text-base text-white drop-shadow">Thử Thách Phi Thuyền Nova</h3>
            <p className="text-[11px] text-violet-200 font-bold mt-0.5">Lái phi thuyền thu thập sao & né chướng ngại vật</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-violet-200 shrink-0 group-hover:translate-x-1 transition-transform relative z-10" />
      </div>

      {/* 3D Daily Quests Card */}
      <div className="p-5 sm:p-6 bg-white/95 backdrop-blur-xl border-2 border-amber-200 shadow-[0_8px_0_0_#fde68a,0_12px_28px_rgba(245,158,11,0.12)] rounded-[32px]">
        <div className="flex justify-between items-center mb-3.5">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/3d/treasure_chest.png" 
              alt="Rương Kho Báu" 
              className="w-8 h-8 object-contain drop-shadow" 
            />
            <h3 className="font-black text-base text-sky-950">
              Nhiệm Vụ Rương Kho Báu
            </h3>
          </div>
          <span className="font-black text-xs text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-300 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
            Thưởng +XP ⚡
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {dailyQuests.map((q) => (
            <div
              key={q.id}
              onClick={() => handleAction(q.action)}
              className="bg-sky-50/60 border border-sky-200/80 p-3.5 rounded-2xl flex justify-between items-center cursor-pointer hover:border-sky-300 hover:bg-sky-100/50 active:scale-98 transition-all"
            >
              <div>
                <p className="font-black text-xs sm:text-sm text-slate-800">{q.title}</p>
                <p className="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1">
                  <span>Tiến độ: {q.progress}/{q.max}</span>
                  {q.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />}
                </p>
              </div>
              <div className="bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 border border-amber-200 font-black text-xs px-3.5 py-1.5 rounded-xl shrink-0 shadow-[0_2px_0_0_#b45309]">
                +{q.rewardXp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

