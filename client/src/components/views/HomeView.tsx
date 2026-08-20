import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Flame, Sparkles, Map, Rocket, CheckCircle2, ChevronRight } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Props {
  onNavigateToMap: () => void;
  onNavigateToMiniGame?: () => void;
}

export const HomeView: React.FC<Props> = ({ onNavigateToMap, onNavigateToMiniGame }) => {
  const { user, demoStyleMode } = useGameStore();

  const dailyQuests = [
    { id: 'q1', title: 'Hoàn thành 1 bài học kỹ năng', progress: 1, max: 1, rewardXp: 50, done: true, action: onNavigateToMap },
    { id: 'q2', title: 'Thực hành chào lễ phép với người thân', progress: 0, max: 1, rewardXp: 30, done: false, action: onNavigateToMap },
    { id: 'q3', title: 'Chiến thắng 1 thử thách Mini-game', progress: 1, max: 1, rewardXp: 40, done: true, action: onNavigateToMiniGame || onNavigateToMap },
  ];

  const handleAction = (cb?: () => void) => {
    interactionService.playTap();
    if (cb) cb();
  };

  // 1. High-Gloss 3D Game Style
  if (demoStyleMode === 'gloss3d') {
    return (
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-slate-950 text-slate-100 select-none">
        {/* Welcome Hero Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-900/90 via-purple-950/90 to-slate-900/90 border-2 border-indigo-400/60 shadow-[0_10px_0_0_#1e1b4b,0_20px_35px_rgba(0,0,0,0.6)] rounded-[32px] relative overflow-hidden">
          {/* Top gloss line reflection */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-[30px]" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-b from-indigo-600 to-purple-800 border-3 border-indigo-300 flex items-center justify-center text-3xl shadow-[0_4px_12px_rgba(99,102,241,0.5)] shrink-0 animate-float">
              {user.avatar}
            </div>
            <div>
              <h2 className="font-black text-xl sm:text-2xl text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Chào {user.name}!</h2>
              <div className="font-extrabold text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <span>Chuỗi học tập:</span>
                <span className="bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 border-2 border-amber-200 shadow-[0_2px_0_0_#78350f] px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-black">
                  <Flame className="w-3.5 h-3.5 fill-amber-950 text-amber-950 animate-pulse" /> {user.streakDays} Ngày
                </span>
              </div>
            </div>
          </div>

          {/* Primary CTA - Tiếp tục học tập */}
          <button
            onClick={() => handleAction(onNavigateToMap)}
            className="w-full min-h-[58px] mt-4 py-3.5 rounded-2xl font-black text-base bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white border-2 border-[#7dd3fc] shadow-[0_8px_0_0_#075985,0_12px_25px_rgba(2,132,199,0.4)] active:translate-y-1 active:shadow-[0_2px_0_0_#075985] flex items-center justify-center gap-2 transition-all relative z-10"
          >
            <Map className="w-5 h-5 drop-shadow" />
            <span className="drop-shadow">Tiếp Tục Phiêu Lưu 🗺️</span>
          </button>
        </div>

        {/* Quick Launch Mini-Game Banner */}
        <div 
          onClick={() => handleAction(onNavigateToMiniGame)}
          className="p-4 bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-800 text-white border-2 border-violet-300 shadow-[0_8px_0_0_#3b0764,0_15px_25px_rgba(124,58,237,0.3)] rounded-[26px] flex items-center justify-between cursor-pointer active:translate-y-1 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-2xl animate-float shrink-0 shadow-inner">
              🚀
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black text-yellow-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Thử Thách Nhanh</span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white drop-shadow">Thử Thách Phi Thuyền Nova</h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-purple-200 shrink-0" />
        </div>

        {/* Daily Quests Card */}
        <div className="p-5 sm:p-6 bg-slate-900/90 border-2 border-slate-800 shadow-[0_8px_0_0_#090d16] rounded-[30px]">
          <div className="flex justify-between items-center mb-3.5">
            <h3 className="font-black text-base text-yellow-300 flex items-center gap-1.5 drop-shadow">
              <span>🎯</span> Nhiệm Vụ Hằng Ngày
            </h3>
            <span className="font-black text-xs text-amber-950 bg-amber-400 px-3 py-1 rounded-full border-2 border-amber-200 shadow-[0_2px_0_0_#78350f]">
              Thưởng +XP ⚡
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {dailyQuests.map((q) => (
              <div
                key={q.id}
                onClick={() => handleAction(q.action)}
                className="bg-slate-950/80 border-2 border-slate-800 p-3.5 rounded-2xl flex justify-between items-center cursor-pointer hover:border-indigo-500/60 active:scale-98 transition-all"
              >
                <div>
                  <p className="font-black text-xs sm:text-sm text-slate-100">{q.title}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5 flex items-center gap-1">
                    <span>Tiến độ: {q.progress}/{q.max}</span>
                    {q.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
                  </p>
                </div>
                <div className="bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 border-2 border-amber-200 font-black text-xs px-3 py-1 rounded-xl shrink-0 shadow-[0_2px_0_0_#78350f]">
                  +{q.rewardXp} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Playful Neo-Pop Style
  if (demoStyleMode === 'neopop') {
    return (
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-[#fef9c3] text-slate-900 select-none">
        {/* Welcome Hero Card */}
        <div className="p-5 sm:p-6 bg-[#bae6fd] border-3 border-slate-900 shadow-[6px_6px_0_0_#0f172a] rounded-[28px]">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-white border-3 border-slate-900 shadow-[3px_3px_0_0_#0f172a] flex items-center justify-center text-3xl shrink-0 animate-float">
              {user.avatar}
            </div>
            <div>
              <h2 className="font-black text-xl sm:text-2xl text-slate-900">Chào {user.name}!</h2>
              <div className="font-extrabold text-xs text-slate-700 mt-1 flex items-center gap-1.5">
                <span>Chuỗi học tập:</span>
                <span className="bg-[#fde047] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-black">
                  <Flame className="w-3.5 h-3.5 fill-slate-900 text-slate-900" /> {user.streakDays} Ngày
                </span>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => handleAction(onNavigateToMap)}
            className="w-full min-h-[58px] mt-4 py-3.5 rounded-2xl font-black text-base bg-[#fde047] text-slate-950 border-3 border-slate-900 shadow-[5px_5px_0_0_#0f172a] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 transition-all"
          >
            <Map className="w-5 h-5" />
            <span>Tiếp Tục Phiêu Lưu 🗺️</span>
          </button>
        </div>

        {/* Quick Launch Mini-Game Banner */}
        <div 
          onClick={() => handleAction(onNavigateToMiniGame)}
          className="p-4 bg-[#c084fc] border-3 border-slate-900 shadow-[6px_6px_0_0_#0f172a] rounded-[26px] text-slate-950 flex items-center justify-between cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] flex items-center justify-center text-2xl shrink-0">
              🚀
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>Thử Thách Nhanh</span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-slate-950">Thử Thách Phi Thuyền Nova</h3>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-900 shrink-0" />
        </div>

        {/* Daily Quests Card */}
        <div className="p-5 sm:p-6 bg-white border-3 border-slate-900 shadow-[6px_6px_0_0_#0f172a] rounded-[28px]">
          <div className="flex justify-between items-center mb-3.5">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
              <span>🎯</span> Nhiệm Vụ Hằng Ngày
            </h3>
            <span className="font-black text-xs text-slate-950 bg-[#86efac] px-3 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]">
              Thưởng +XP ⚡
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {dailyQuests.map((q) => (
              <div
                key={q.id}
                onClick={() => handleAction(q.action)}
                className="bg-slate-50 border-2 border-slate-900 p-3.5 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-yellow-50 active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-[2px_2px_0_0_#0f172a]"
              >
                <div>
                  <p className="font-black text-xs sm:text-sm text-slate-900">{q.title}</p>
                  <p className="text-xs text-slate-600 font-bold mt-0.5 flex items-center gap-1">
                    <span>Tiến độ: {q.progress}/{q.max}</span>
                    {q.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />}
                  </p>
                </div>
                <div className="bg-[#fde047] text-slate-950 border-2 border-slate-900 font-black text-xs px-3 py-1 rounded-xl shrink-0 shadow-[2px_2px_0_0_#0f172a]">
                  +{q.rewardXp} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Apple Arcade Glassmorphism Style
  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-gradient-to-b from-indigo-50/60 via-sky-50/60 to-rose-50/60 text-slate-900 select-none">
      {/* Welcome Hero Card */}
      <div className="backdrop-blur-2xl bg-white/80 border-2 border-white rounded-[32px] p-5 sm:p-6 shadow-[0_16px_40px_rgba(99,102,241,0.12)]">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-b from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl shadow-[0_8px_20px_rgba(99,102,241,0.35)] shrink-0 animate-float">
            {user.avatar}
          </div>
          <div>
            <h2 className="font-black text-xl sm:text-2xl text-indigo-950">Chào {user.name}!</h2>
            <div className="font-bold text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <span>Chuỗi học tập:</span>
              <span className="backdrop-blur-md bg-amber-500/15 text-amber-900 border border-amber-300 px-3 py-0.5 rounded-full flex items-center gap-1 text-xs font-black shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" /> {user.streakDays} Ngày
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => handleAction(onNavigateToMap)}
          className="w-full min-h-[58px] mt-4 py-3.5 rounded-full font-black text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_10px_25px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_30px_rgba(79,70,229,0.5)] active:scale-95 flex items-center justify-center gap-2 transition-all"
        >
          <Map className="w-5 h-5" />
          <span>Tiếp Tục Phiêu Lưu 🗺️</span>
        </button>
      </div>

      {/* Quick Launch Mini-Game Banner */}
      <div 
        onClick={() => handleAction(onNavigateToMiniGame)}
        className="backdrop-blur-2xl bg-gradient-to-r from-purple-500/90 to-indigo-600/90 text-white rounded-[28px] shadow-[0_12px_30px_rgba(147,51,234,0.25)] border border-white/40 p-4 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-2xl animate-float shrink-0 shadow-inner">
            🚀
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-amber-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Thử Thách Nhanh</span>
            </div>
            <h3 className="font-black text-sm sm:text-base text-white">Thử Thách Phi Thuyền Nova</h3>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/80 shrink-0" />
      </div>

      {/* Daily Quests Card */}
      <div className="backdrop-blur-2xl bg-white/80 border-2 border-white rounded-[32px] p-5 sm:p-6 shadow-[0_16px_40px_rgba(99,102,241,0.08)]">
        <div className="flex justify-between items-center mb-3.5">
          <h3 className="font-black text-base text-indigo-950 flex items-center gap-1.5">
            <span>🎯</span> Nhiệm Vụ Hằng Ngày
          </h3>
          <span className="font-black text-xs text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
            Thưởng +XP ⚡
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {dailyQuests.map((q) => (
            <div
              key={q.id}
              onClick={() => handleAction(q.action)}
              className="bg-white/90 border border-slate-200/80 p-3.5 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-indigo-50/40 active:scale-98 transition-all shadow-sm"
            >
              <div>
                <p className="font-black text-xs sm:text-sm text-slate-800">{q.title}</p>
                <p className="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1">
                  <span>Tiến độ: {q.progress}/{q.max}</span>
                  {q.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />}
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-xs px-3 py-1 rounded-full shrink-0 shadow-sm">
                +{q.rewardXp} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

