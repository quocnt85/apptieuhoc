import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Flame, Rocket, ChevronRight, Play, Check, X } from 'lucide-react';
import { soundService } from '../../services/audio';
import { interactionService } from '../../services/interaction';

interface Props {
  onNavigateToMap: () => void;
  onNavigateToMiniGame?: () => void;
}

// Modal for Parent Authentication & Greeting Quest Verification
const ParentGreetingConfirmModal: React.FC<{
  onClose: () => void;
  onConfirmSuccess: () => void;
}> = ({ onClose, onConfirmSuccess }) => {
  const { settings } = useGameStore();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isAgreed, setIsAgreed] = useState(true);

  const parentPin = settings.parentPin || '1234';

  const handleDigit = (digit: string) => {
    soundService.playClick();
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      setErrorMsg('');
      if (next.length === 4) {
        if (next === parentPin) {
          setIsPinVerified(true);
          soundService.playVictory();
        } else {
          setErrorMsg('Mã PIN chưa chính xác. Vui lòng nhập lại!');
          setTimeout(() => setPinInput(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    soundService.playClick();
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleComplete = () => {
    if (!isAgreed) return;
    onConfirmSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
      <div className="bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] border-2 border-amber-400/80 rounded-[32px] p-5 sm:p-6 max-w-sm sm:max-w-md w-full text-white shadow-[0_0_50px_rgba(251,191,36,0.3)] relative">
        {/* Close Button */}
        <button
          onClick={() => { soundService.playClick(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPinVerified ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-3 shadow-lg">
              👨‍👩‍👧
            </div>

            <h3 className="font-black text-lg sm:text-xl text-yellow-300">
              Phụ Huynh Duyệt
            </h3>
            <p className="text-xs text-sky-200 font-bold mt-1 max-w-xs">
              Nhập mã PIN để xác nhận bé đã chào hỏi lễ phép hôm nay.
            </p>

            {/* PIN Code Dots Indicator */}
            <div className="flex gap-3 my-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                    pinInput.length > idx
                      ? 'bg-amber-500 border-yellow-200 text-slate-950 shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {pinInput.length > idx ? '●' : '○'}
                </div>
              ))}
            </div>

            {errorMsg ? (
              <p className="text-xs font-bold text-rose-400 mb-3 animate-shake">{errorMsg}</p>
            ) : (
              <p className="text-[11px] font-bold text-slate-400 mb-3">
                Mã PIN mặc định: <b className="text-yellow-400 font-mono">1234</b>
              </p>
            )}

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-[260px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDigit(num)}
                  className="h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-lg font-black text-white hover:bg-slate-700 active:scale-95 transition-all shadow"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setPinInput('')}
                className="h-12 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-black text-slate-400 hover:text-white active:scale-95"
              >
                Xóa
              </button>
              <button
                onClick={() => handleDigit('0')}
                className="h-12 rounded-2xl bg-slate-800/90 border border-slate-700 text-lg font-black text-white hover:bg-slate-700 active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-black text-slate-400 hover:text-white active:scale-95"
              >
                ⌫
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Check View */
          <div className="flex flex-col items-center text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl mb-3 shadow-lg">
              🎉
            </div>

            <h3 className="font-black text-lg sm:text-xl text-yellow-300">
              PIN Hợp Lệ!
            </h3>
            <p className="text-xs text-sky-200 font-bold mt-1">
              Phụ huynh xác nhận hành vi thực tế của bé:
            </p>

            <div
              onClick={() => setIsAgreed(!isAgreed)}
              className="my-4 p-4 rounded-2xl bg-slate-900/90 border-2 border-amber-400/60 flex items-center gap-3.5 text-left cursor-pointer shadow-lg w-full"
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-white border transition-all ${
                  isAgreed ? 'bg-emerald-500 border-white' : 'bg-slate-800 border-slate-600'
                }`}
              >
                {isAgreed && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-200 leading-snug">
                Bé đã chủ động chào hỏi lễ phép, mỉm cười và tự tin hôm nay.
              </p>
            </div>

            <button
              onClick={handleComplete}
              disabled={!isAgreed}
              className="w-full py-3.5 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 border-2 border-white shadow-xl active:scale-95 transition-all"
            >
              Duyệt & Nhận Thưởng (+30 Xu) ⭐
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const HomeView: React.FC<Props> = ({ onNavigateToMap, onNavigateToMiniGame }) => {
  const { user, addNovaCoins, unlockGodMode } = useGameStore();

  const [greetingQuestDone, setGreetingQuestDone] = useState<boolean>(() => {
    return localStorage.getItem('novastars_quest_greeting_done') === 'true';
  });
  const [showParentModal, setShowParentModal] = useState(false);
  const [rewardMsg, setRewardMsg] = useState<string | null>(null);

  // 5-click Easter Egg state
  const heroClickCountRef = React.useRef<number>(0);
  const heroLastClickRef = React.useRef<number>(0);

  const handleHeroAvatarClick = () => {
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
      unlockGodMode();
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

  const handleGreetingQuestClick = () => {
    if (greetingQuestDone) return;
    soundService.playClick();
    setShowParentModal(true);
  };

  const handleParentConfirmSuccess = () => {
    setShowParentModal(false);
    setGreetingQuestDone(true);
    localStorage.setItem('novastars_quest_greeting_done', 'true');
    addNovaCoins(30);
    soundService.playVictory();
    setRewardMsg('🎉 Phụ huynh đã duyệt! Bé nhận được +30 Xu Nova 🟡!');
    setTimeout(() => setRewardMsg(null), 4000);
  };

  const dailyQuests = [
    {
      id: 'q1',
      title: 'Hoàn thành 1 bài học kỹ năng tinh cầu',
      progress: 1,
      max: 1,
      rewardCoins: 50,
      done: true,
      onClick: () => handleAction(onNavigateToMap)
    },
    {
      id: 'q2',
      title: 'Thực hành chào hỏi lễ phép ngoài đời thực',
      progress: greetingQuestDone ? 1 : 0,
      max: 1,
      rewardCoins: 30,
      done: greetingQuestDone,
      requiresParent: true,
      onClick: handleGreetingQuestClick
    },
    {
      id: 'q3',
      title: 'Lái phi thuyền thu thập 10 sao',
      progress: 1,
      max: 1,
      rewardCoins: 40,
      done: true,
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
              onClick={handleHeroAvatarClick}
              data-testid="hero-avatar-btn"
              className="relative cursor-pointer active:scale-95 transition-transform shrink-0"
              title="Nhấp 5 lần để mở Dev God Mode"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border-2 border-sky-400 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
                {currentAvatar}
              </div>
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

      {/* Reward Message Alert */}
      {rewardMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-900/90 border-2 border-emerald-400 text-emerald-100 text-xs font-black text-center shadow-lg animate-scaleUp">
          {rewardMsg}
        </div>
      )}

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
                  <h4 className={`text-xs sm:text-sm font-black truncate ${q.done ? 'text-emerald-300 line-through opacity-80' : 'text-slate-200'}`}>
                    <span>{q.title}</span>
                  </h4>
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

      {/* Parent Greeting Verification Modal */}
      {showParentModal && (
        <ParentGreetingConfirmModal
          onClose={() => setShowParentModal(false)}
          onConfirmSuccess={handleParentConfirmSuccess}
        />
      )}
    </div>
  );
};


