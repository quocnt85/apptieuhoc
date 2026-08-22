import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Flame, Rocket, ChevronRight, Play, Check } from 'lucide-react';
import { soundService } from '../../services/audio';
import { interactionService } from '../../services/interaction';
import { AvatarComposer } from '../personalization/AvatarComposer';
import { useParentZoneStore } from '../../stores/useParentZoneStore';
import { ProfileView } from './ProfileView';

interface Props {
  onNavigateToMap: () => void;
  onNavigateToMiniGame?: () => void;
}

export const HomeView: React.FC<Props> = ({ onNavigateToMap, onNavigateToMiniGame }) => {
  const { user, completedNodes } = useGameStore();
  const activeChildId = useParentZoneStore((state) => state.activeProfileId);

  // 5-click Easter Egg state
  const heroClickCountRef = React.useRef<number>(0);
  const heroLastClickRef = React.useRef<number>(0);

  const handleHeroAvatarClick = () => {
    if (!import.meta.env.DEV) return;
    const now = Date.now();
    if (now - heroLastClickRef.current > 4000) {
      heroClickCountRef.current = 1;
    } else {
      heroClickCountRef.current += 1;
    }
    heroLastClickRef.current = now;

    soundService.playClick();

    if (heroClickCountRef.current >= 5) {
      heroClickCountRef.current = 0;
      useGameStore.getState().toggleGodMode();
    }
  };

  // Clean greeting avoiding repeated "Phi Hành Gia"
  const cleanName = user.name.replace(/^Phi Hành Gia\s*/i, '').trim();
  const greetingTitle = `Chào Phi Hành Gia ${cleanName || 'Nhí'}!`;
  const currentAvatar = user.avatar === '🚀' ? '👨‍🚀' : user.avatar;

  const handleAction = (cb?: () => void) => {
    interactionService.playTap();
    if (cb) cb();
  };

  const completedLessonsCount = Object.keys(completedNodes || {}).length;
  const currentStars = user.stars || 0;

  const dailyQuests = [
    {
      id: 'q1',
      title: 'Hoàn thành 1 bài học kỹ năng tinh cầu',
      progress: Math.min(1, completedLessonsCount),
      max: 1,
      rewardCoins: 50,
      done: completedLessonsCount >= 1,
      requiresParent: false,
      onClick: () => handleAction(onNavigateToMap)
    },
    {
      id: 'q3',
      title: 'Lái phi thuyền thu thập 10 sao',
      progress: Math.min(10, currentStars),
      max: 10,
      rewardCoins: 40,
      done: currentStars >= 10,
      requiresParent: false,
      onClick: () => handleAction(onNavigateToMiniGame || onNavigateToMap)
    },
  ];

  const completedCount = dailyQuests.filter((q) => q.done).length;

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-gradient-to-b from-[#050814] via-[#0b1026] to-[#160e33] text-white select-none">
      {/* Cosmic Hero Banner */}
      <div className="p-5 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-2 border-sky-400/50 shadow-[0_12px_32px_rgba(56,189,248,0.25)] rounded-[32px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-yellow-400/20 via-sky-400/20 to-transparent blur-2xl pointer-events-none -z-10" />

        <div className="flex items-center justify-between gap-3">
          {/* Avatar and Astronaut Info */}
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div 
              onClick={import.meta.env.DEV ? handleHeroAvatarClick : undefined}
              data-testid="hero-avatar-btn"
              className="relative cursor-pointer active:scale-95 transition-transform shrink-0"
              title={import.meta.env.DEV ? 'Nhấp 5 lần để bật/tắt chế độ phát triển' : undefined}
            >
              <AvatarComposer childId={activeChildId} presetAvatar={currentAvatar} className="h-14 w-14 shrink-0 rounded-2xl sm:h-16 sm:w-16 sm:rounded-3xl"/>
              {/* Tag Avatar Synchronized to Lv. */}
              <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full border-2 border-slate-900 shadow">
                Lv.{user.level}
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="font-black text-base sm:text-xl text-yellow-300 truncate">
                <span>{greetingTitle}</span>
              </h2>
              <div className="font-extrabold text-[11px] sm:text-xs text-sky-200 mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-2">
                <span>(Lớp {user.grade})</span>
                <span>•</span>
                <span className="bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border border-amber-300 shadow px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] sm:text-xs font-black">
                  <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-amber-950 text-amber-950 animate-pulse" /> {user.streakDays} Ngày
                </span>
              </div>
            </div>
          </div>

          {/* Play Button & Label on the Right */}
          <div className="flex flex-col items-center shrink-0">
            <button
              onClick={() => handleAction(onNavigateToMap)}
              data-testid="play-continue-btn"
              className="w-13 h-13 sm:w-15 sm:h-15 p-3 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 text-slate-950 border-2 border-yellow-200 shadow-[0_5px_0_0_#b45309,0_8px_20px_rgba(245,158,11,0.5)] active:translate-y-1 active:shadow-[0_1px_0_0_#b45309] flex items-center justify-center transition-all group cursor-pointer"
              title="Tiếp tục học"
            >
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950 text-slate-950 translate-x-0.5 group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-[10px] sm:text-[11px] font-black text-yellow-300 mt-1.5 tracking-tight text-center">
              Tiếp tục học
            </span>
          </div>
        </div>
      </div>

      {/* Space Challenge Banner */}
      <div 
        onClick={() => handleAction(onNavigateToMiniGame || onNavigateToMap)}
        className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900/90 via-purple-950/90 to-slate-900/90 border-2 border-purple-400/50 shadow-xl rounded-[32px] flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-700 border border-white/30 flex items-center justify-center text-2xl shadow">
            <Rocket className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-white drop-shadow">Thử Thách Phi Thuyền</h3>
            <p className="text-[11px] text-violet-200 font-bold mt-0.5">Thu thập sao và né vật cản 🚀</p>
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
            {completedCount}/{dailyQuests.length} Đã Xong
          </span>
        </div>

        <div className="space-y-2.5">
          {dailyQuests.map((q) => (
            <div
              key={q.id}
              onClick={q.onClick}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer ${
                q.done
                  ? 'bg-emerald-950/60 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 active:scale-98'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Standard Square Rounded Checkbox */}
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all shrink-0 ${
                  q.done ? 'bg-emerald-500 border-emerald-300 text-white shadow-sm' : 'bg-slate-800/80 border-slate-600 text-transparent'
                }`}>
                  {q.done && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className={`text-xs sm:text-sm font-black truncate ${q.done ? 'text-emerald-300 line-through opacity-80' : 'text-slate-200'}`}>
                      <span>{q.title}</span>
                    </h4>
                    {q.max > 1 && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${q.done ? 'bg-emerald-800/80 text-emerald-200' : 'bg-slate-700 text-sky-300'}`}>
                        {q.progress}/{q.max}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">🟡 +{q.rewardCoins} Xu Nova</span>
                </div>
              </div>

              {!q.done && (
                <span className={`font-black text-xs px-3 py-1.5 rounded-xl shadow active:scale-95 transition-all text-center shrink-0 whitespace-nowrap ${
                  q.requiresParent
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-300/50'
                    : 'bg-sky-600 text-white border border-sky-400/50'
                }`}>
                  {q.requiresParent ? 'Phụ huynh duyệt' : 'Làm'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <ProfileView embedded />

    </div>
  );
};


