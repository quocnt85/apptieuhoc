import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Flame, Sparkles, Map, CheckCircle2 } from 'lucide-react';

interface Props {
  onNavigateToMap: () => void;
}

export const HomeView: React.FC<Props> = ({ onNavigateToMap }) => {
  const { user } = useGameStore();

  const dailyQuests = [
    { id: 'q1', title: 'Hoàn thành 1 bài học kỹ năng', progress: 1, max: 1, rewardXp: 50, done: true },
    { id: 'q2', title: 'Thực hành chào lễ phép với người thân', progress: 0, max: 1, rewardXp: 30, done: false },
    { id: 'q3', title: 'Chiến thắng 1 thử thách Mini-game', progress: 1, max: 1, rewardXp: 40, done: true },
  ];

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto pb-20 animate-fadeIn bg-slate-50">
      {/* Welcome Hero Card */}
      <div className="ns-card-3d p-5 bg-gradient-to-br from-blue-100 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-blue-200 flex items-center justify-center text-3xl shadow-sm shrink-0">
            {user.avatar}
          </div>
          <div>
            <h2 className="font-black text-xl text-[#1e1b4b]">Chào {user.name}!</h2>
            <p className="font-bold text-xs text-slate-600 mt-0.5 flex items-center gap-1">
              <span>Chuỗi học tập:</span>
              <span className="text-amber-600 font-extrabold flex items-center">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 inline" /> {user.streakDays} Ngày Liên Tiếp
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToMap}
          className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all ns-btn-3d ns-btn-primary"
        >
          <Map className="w-4 h-4" />
          <span>Tiếp Tục Học Tập 🗺️</span>
        </button>
      </div>

      {/* Daily Quests Card */}
      <div className="ns-card-3d p-5 bg-white">
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
            <span>🎯</span> Nhiệm Vụ Hằng Ngày
          </h3>
          <span className="font-bold text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Thưởng +XP
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {dailyQuests.map((q) => (
            <div
              key={q.id}
              className="bg-slate-50 border-2 border-slate-200 p-3 rounded-2xl flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-xs text-slate-800">{q.title}</p>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Tiến độ: {q.progress}/{q.max} {q.done && '✅'}
                </p>
              </div>
              <div className="bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-xl shrink-0">
                ⚡ +{q.rewardXp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
