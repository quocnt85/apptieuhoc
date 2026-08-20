import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Flame, Sparkles, Rocket, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Props {
  onNavigateToMap: () => void;
  onNavigateToMiniGame?: () => void;
}

export const HomeView: React.FC<Props> = ({ onNavigateToMap, onNavigateToMiniGame }) => {
  const { user } = useGameStore();

  const dailyQuests = [
    { id: 'q1', title: 'Hoàn thành 1 bài học kỹ năng tinh cầu', progress: 1, max: 1, rewardCoins: 50, done: true, action: onNavigateToMap },
    { id: 'q2', title: 'Thực hành chào hỏi lễ phép ngoài đời thực', progress: 0, max: 1, rewardCoins: 30, done: false, action: onNavigateToMap },
    { id: 'q3', title: 'Lái phi thuyền thu thập 10 sao', progress: 1, max: 1, rewardCoins: 40, done: true, action: onNavigateToMiniGame || onNavigateToMap },
  ];

  const handleAction = (cb?: () => void) => {
    interactionService.playTap();
    if (cb) cb();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-gradient-to-b from-[#050814] via-[#0b1026] to-[#160e33] text-white select-none">
      {/* Cosmic Hero Banner */}
      <div className="p-5 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-2 border-sky-400/50 shadow-[0_12px_32px_rgba(56,189,248,0.25)] rounded-[32px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-yellow-400/20 via-sky-400/20 to-transparent blur-2xl pointer-events-none -z-10" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border-2 border-sky-400 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {user.avatar}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 text-yellow-950 font-black text-[10px] px-2 py-0.5 rounded-full border-2 border-slate-900 shadow">
                Lớp {user.grade}
              </div>
            </div>
            <div>
              <h2 className="font-black text-xl sm:text-2xl text-yellow-300 flex items-center gap-1.5">
                <span>Chào Phi Hành Gia {user.name}!</span>
              </h2>
              <div className="font-extrabold text-xs text-sky-200 mt-1 flex items-center gap-1.5">
                <span>Chuỗi ngày:</span>
                <span className="bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border border-amber-300 shadow px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-black">
                  <Flame className="w-3.5 h-3.5 fill-amber-950 text-amber-950 animate-pulse" /> {user.streakDays} Ngày
                </span>
              </div>
            </div>
          </div>

          <div className="relative shrink-0 hidden xs:block">
            <img 
              src="/assets/3d/star_mascot.png" 
              alt="Sao Nova" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_8px_16px_rgba(251,191,36,0.6)] animate-float" 
            />
          </div>
        </div>

        {/* Primary Action Button to Planet 3D */}
        <button
          onClick={() => handleAction(onNavigateToMap)}
          className="mt-4 w-full py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white border-2 border-sky-200 shadow-[0_6px_0_0_#0284c7,0_10px_24px_rgba(2,132,199,0.45)] active:translate-y-1 active:shadow-[0_2px_0_0_#0284c7] flex items-center justify-center gap-2 transition-all"
        >
          <span>🚀 Tiếp Tục Thám Hiểm: Tinh Cầu Dũng Khí 3D</span>
        </button>
      </div>

      {/* 3D Minigame Space Banner */}
      <div 
        onClick={() => handleAction(onNavigateToMiniGame || onNavigateToMap)}
        className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900/90 via-purple-950/90 to-slate-900/90 border-2 border-purple-400/50 shadow-xl rounded-[32px] flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 border border-white/30 flex items-center justify-center text-2xl shadow">
            <Rocket className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-yellow-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Thử Thách Vũ Trụ</span>
            </div>
            <h3 className="font-black text-sm sm:text-base text-white drop-shadow">Thử Thách Phi Thuyền Nova</h3>
            <p className="text-[11px] text-violet-200 font-bold mt-0.5">Lái phi thuyền thu thập sao & né chướng ngại vật</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-violet-200 shrink-0 group-hover:translate-x-1 transition-transform relative z-10" />
      </div>

      {/* Daily Quests Card */}
      <div className="p-5 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-2 border-amber-400/40 shadow-xl rounded-[32px]">
        <div className="flex justify-between items-center mb-3.5">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/3d/treasure_chest.png" 
              alt="Rương Kho Báu" 
              className="w-8 h-8 object-contain drop-shadow" 
            />
            <h3 className="font-black text-base text-yellow-300">
              Nhiệm Vụ Hằng Ngày
            </h3>
          </div>
          <span className="font-black text-xs text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-300 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
            2/3 Đã Xong
          </span>
        </div>

        <div className="space-y-2.5">
          {dailyQuests.map((q) => (
            <div
              key={q.id}
              onClick={() => handleAction(q.action)}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                q.done
                  ? 'bg-emerald-950/60 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 active:scale-98'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black border ${
                  q.done ? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-slate-700 border-slate-600 text-slate-400'
                }`}>
                  {q.done ? <CheckCircle2 className="w-4 h-4" /> : '○'}
                </div>
                <div>
                  <h4 className={`text-xs sm:text-sm font-black ${q.done ? 'text-emerald-300 line-through opacity-80' : 'text-slate-200'}`}>
                    {q.title}
                  </h4>
                  <span className="text-[10px] text-amber-300 font-bold">🟡 +{q.rewardCoins} Xu Nova</span>
                </div>
              </div>

              {!q.done && (
                <span className="bg-sky-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow active:scale-95">
                  Làm
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
