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
    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-slate-50">
      {/* Welcome Hero Card */}
      <div className="ns-card-3d p-5 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-blue-300 flex items-center justify-center text-3xl shadow-sm shrink-0">
            {user.avatar}
          </div>
          <div>
            <h2 className="font-black text-xl text-[#1e1b4b]">Chào {user.name}!</h2>
            <div className="font-extrabold text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <span>Chuỗi học tập:</span>
              <span className="text-amber-600 font-black bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {user.streakDays} Ngày
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA - Tiếp tục học tập */}
        <button
          onClick={() => handleAction(onNavigateToMap)}
          className="w-full min-h-[54px] mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-base shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all ns-btn-3d ns-btn-primary"
        >
          <Map className="w-5 h-5" />
          <span>Tiếp Tục Phiêu Lưu 🗺️</span>
        </button>
      </div>

      {/* Quick Launch Mini-Game Banner */}
      <div 
        onClick={() => handleAction(onNavigateToMiniGame)}
        className="ns-card-3d p-4 bg-gradient-to-r from-purple-900 to-indigo-950 text-white border-2 border-purple-500/50 flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/40 border border-purple-400/40 flex items-center justify-center text-2xl animate-bounce-slow shrink-0">
            🚀
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Thử Thách Nhanh</span>
            </div>
            <h3 className="font-black text-sm sm:text-base text-white">Thử Thách Phi Thuyền Nova</h3>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-purple-300 shrink-0" />
      </div>

      {/* Daily Quests Card */}
      <div className="ns-card-3d p-5 bg-white border-2 border-slate-200">
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
            <span>🎯</span> Nhiệm Vụ Hằng Ngày
          </h3>
          <span className="font-black text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Thưởng +XP ⚡
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {dailyQuests.map((q) => (
            <div
              key={q.id}
              onClick={() => handleAction(q.action)}
              className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl flex justify-between items-center cursor-pointer hover:border-indigo-300 active:scale-98 transition-all"
            >
              <div>
                <p className="font-black text-xs sm:text-sm text-slate-800">{q.title}</p>
                <p className="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1">
                  <span>Tiến độ: {q.progress}/{q.max}</span>
                  {q.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />}
                </p>
              </div>
              <div className="bg-amber-100 text-amber-900 border-2 border-amber-300 font-black text-xs px-3 py-1.5 rounded-xl shrink-0">
                +{q.rewardXp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

