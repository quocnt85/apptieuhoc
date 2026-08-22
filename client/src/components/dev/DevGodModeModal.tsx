import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useParentZoneStore } from '../../stores/useParentZoneStore';
import { soundService } from '../../services/audio';
import { 
  Wrench, 
  X, 
  Zap, 
  Coins, 
  Diamond, 
  Star, 
  Infinity as InfinityIcon, 
  Activity, 
  Trophy, 
  Rocket, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Flame, 
  Gauge 
} from 'lucide-react';

type DevTab = 'energy' | 'economy' | 'progression' | 'system';

interface DevGodModeModalProps {
  onOpenShowroom?: () => void;
}

export const DevGodModeModal: React.FC<DevGodModeModalProps> = ({ onOpenShowroom }) => {
  const {
    user,
    isDevPanelOpen,
    toggleDevPanel,
    isUnlimitedMode,
    toggleUnlimitedMode,
    showFpsOverlay,
    toggleFpsOverlay,
    setEnergy,
    setNovaCoins,
    setDiamonds,
    setStars,
    setLevel,
    addXP,
    instantCompleteCurrentLesson,
    unlockAllPlanetNodes,
    unlockAllCosmetics,
    resetAllProgress,
    buyBooster,
    setGreetingQuestDone,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<DevTab>('energy');
  const [customEnergyInput, setCustomEnergyInput] = useState<string>(user.energy.toString());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setCustomEnergyInput(user.energy.toString());
  }, [user.energy]);

  if (!isDevPanelOpen) return null;

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSetCustomEnergy = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(customEnergyInput, 10);
    if (!isNaN(val)) {
      setEnergy(val);
      showNotification(`Đã đặt Năng Lượng = ${val} ⚡`);
    }
  };

  const prepareManualReview = () => {
    setEnergy(999);
    setNovaCoins(99_999);
    setDiamonds(9_999);
    setLevel(20);
    unlockAllPlanetNodes();
    unlockAllCosmetics();
    setGreetingQuestDone(true);
    if (!isUnlimitedMode) toggleUnlimitedMode();
    const parent = useParentZoneStore.getState();
    if (parent.profiles.length < 2) {
      parent.createProfile({ name: 'Hồ sơ Review B', grade: 4, avatar: '👩‍🚀' });
    }
    showNotification('Đã sẵn sàng: full tài nguyên, nội dung, tàu và 2 hồ sơ review.');
  };

  return (
    <div 
      data-testid="dev-god-mode-modal"
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn text-white"
    >
      <div className="bg-gradient-to-b from-[#0f172a] via-[#131d36] to-[#0b1022] border-2 border-amber-500/80 rounded-[28px] max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg font-black">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-yellow-300">DEV GOD MODE</h3>
                <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Bảng điều khiển kiểm thử trò chơi</p>
            </div>
          </div>

          <button
            onClick={() => { soundService.playClick(); toggleDevPanel(false); }}
            data-testid="dev-close-btn"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/90 border-b border-slate-800 shrink-0 text-xs font-bold">
          <button
            onClick={() => { soundService.playClick(); setActiveTab('energy'); }}
            data-testid="dev-tab-energy"
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'energy' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="text-[10px]">Năng Lượng</span>
          </button>

          <button
            onClick={() => { soundService.playClick(); setActiveTab('economy'); }}
            data-testid="dev-tab-economy"
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'economy' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span className="text-[10px]">Tiền Tệ</span>
          </button>

          <button
            onClick={() => { soundService.playClick(); setActiveTab('progression'); }}
            data-testid="dev-tab-progression"
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'progression' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span className="text-[10px]">Tiến Trình</span>
          </button>

          <button
            onClick={() => { soundService.playClick(); setActiveTab('system'); }}
            data-testid="dev-tab-system"
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'system' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span className="text-[10px]">Hệ Thống</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          
          {/* Toast Notification inside modal */}
          {toastMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/80 text-emerald-300 text-xs font-bold text-center animate-scaleUp flex items-center justify-center gap-1.5 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* TAB 1: ENERGY & LEVEL */}
          {activeTab === 'energy' && (
            <div className="space-y-4">
              {/* Current Status Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-bold">NĂNG LƯỢNG HIỆN TẠI</div>
                  <div data-testid="dev-energy-display" className="text-xl font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <Zap className="w-5 h-5 fill-emerald-400" />
                    <span>{user.energy} / {user.maxEnergy}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold text-right">CẤP ĐỘ</div>
                  <div data-testid="dev-level-display" className="text-xl font-black text-yellow-400 text-right">
                    Lv.{user.level} <span className="text-xs text-slate-400">({user.xp}/{user.xpToNextLevel} XP)</span>
                  </div>
                </div>
              </div>

              {/* Energy Quick Actions */}
              <div>
                <label className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-2">
                  Điều Chỉnh Nhanh Năng Lượng
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setEnergy(user.energy + 10); showNotification('+10 Năng Lượng'); }}
                    data-testid="dev-set-energy-10-btn"
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-emerald-300 active:scale-95 transition-all"
                  >
                    +10 ⚡
                  </button>
                  <button
                    onClick={() => { setEnergy(Math.max(0, user.energy - 10)); showNotification('-10 Năng Lượng'); }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-rose-300 active:scale-95 transition-all"
                  >
                    -10 ⚡
                  </button>
                  <button
                    onClick={() => { setEnergy(user.energy + 50); showNotification('+50 Năng Lượng'); }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-emerald-300 active:scale-95 transition-all"
                  >
                    +50 ⚡
                  </button>
                  <button
                    onClick={() => { setEnergy(50); showNotification('Hồi đầy 50 Năng Lượng'); }}
                    data-testid="dev-set-energy-max-btn"
                    className="py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 font-black text-xs text-emerald-300 col-span-2 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-emerald-300" />
                    <span>Hồi Đầy (50 Năng Lượng)</span>
                  </button>
                  <button
                    onClick={() => { setEnergy(0); showNotification('Đặt Năng Lượng = 0'); }}
                    data-testid="dev-set-energy-0-btn"
                    className="py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 font-black text-xs text-rose-300 active:scale-95 transition-all"
                  >
                    0️⃣ Cạn (Set 0)
                  </button>
                </div>
              </div>

              {/* Custom Input */}
              <form onSubmit={handleSetCustomEnergy} className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Nhập số Năng Lượng tùy ý:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customEnergyInput}
                    onChange={(e) => setCustomEnergyInput(e.target.value)}
                    data-testid="dev-energy-input"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                    placeholder="VD: 100"
                  />
                  <button
                    type="submit"
                    data-testid="dev-energy-apply-btn"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow active:scale-95 transition-all"
                  >
                    Áp Dụng
                  </button>
                </div>
              </form>

              {/* Level & XP Actions */}
              <div>
                <label className="text-xs font-black text-yellow-300 uppercase tracking-wider block mb-2">
                  Cấp Độ & Kinh Nghiệm
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setLevel(user.level + 1); showNotification(`Lên Lv.${user.level + 1}!`); }}
                    data-testid="dev-level-up-btn"
                    className="py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 font-black text-xs text-indigo-300 active:scale-95 transition-all"
                  >
                    +1 Level 🆙
                  </button>
                  <button
                    onClick={() => { setLevel(user.level + 5); showNotification(`Lên Lv.${user.level + 5}!`); }}
                    className="py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 font-black text-xs text-indigo-300 active:scale-95 transition-all"
                  >
                    +5 Level 🚀
                  </button>
                  <button
                    onClick={() => { addXP(500); showNotification('+500 XP!'); }}
                    className="py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 font-black text-xs text-purple-300 active:scale-95 transition-all"
                  >
                    +500 XP ✨
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ECONOMY & UNLIMITED */}
          {activeTab === 'economy' && (
            <div className="space-y-4">
              
              {/* Unlimited Mode Master Switch */}
              <button 
                type="button"
                onClick={toggleUnlimitedMode}
                data-testid="dev-unlimited-toggle"
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all text-left ${
                  isUnlimitedMode 
                    ? 'bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    isUnlimitedMode ? 'bg-yellow-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <InfinityIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-yellow-300 flex items-center gap-1.5">
                      <span>CHẾ ĐỘ VÔ HẠN TẤT CẢ</span>
                      <span 
                        data-testid="dev-unlimited-status" 
                        className={`text-[9px] px-1.5 py-0.2 rounded font-black ${isUnlimitedMode ? 'bg-yellow-400 text-slate-950' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {isUnlimitedMode ? 'ON' : 'OFF'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">Xu, Kim Cương, Năng Lượng & Sao bất tận</p>
                  </div>
                </div>

                <div className={`w-12 h-6 rounded-full p-0.5 transition-colors ${isUnlimitedMode ? 'bg-yellow-400' : 'bg-slate-700'}`}>
                  <div className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${isUnlimitedMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </button>

              {/* Current Balances */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">XU NOVA</div>
                  <div data-testid="dev-coins-display" className="font-black text-sm text-yellow-300">🟡 {user.novaCoins}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">KIM CƯƠNG</div>
                  <div data-testid="dev-diamonds-display" className="font-black text-sm text-cyan-300">💎 {user.diamonds}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">SAO</div>
                  <div data-testid="dev-stars-display" className="font-black text-sm text-amber-400">⭐ {user.stars}</div>
                </div>
              </div>

              {/* Nova Coins Actions */}
              <div>
                <label className="text-xs font-black text-yellow-300 uppercase tracking-wider block mb-2">
                  Xu Nova (Nova Coins)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => { setNovaCoins(user.novaCoins + 100); showNotification('+100 Xu Nova'); }}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-yellow-300 active:scale-95"
                  >
                    +100 🟡
                  </button>
                  <button
                    onClick={() => { setNovaCoins(user.novaCoins + 1000); showNotification('+1000 Xu Nova'); }}
                    data-testid="dev-add-coins-1000-btn"
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-yellow-300 active:scale-95"
                  >
                    +1,000 🟡
                  </button>
                  <button
                    onClick={() => { setNovaCoins(Math.max(0, user.novaCoins - 100)); showNotification('-100 Xu Nova'); }}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-slate-300 active:scale-95"
                  >
                    -100 🟡
                  </button>
                  <button
                    onClick={() => { setNovaCoins(99999); showNotification('Đặt 99,999 Xu Nova'); }}
                    className="py-2 rounded-xl bg-yellow-950/80 border border-yellow-500/50 font-black text-xs text-yellow-300 active:scale-95"
                  >
                    Max 99k
                  </button>
                </div>
              </div>

              {/* Diamonds Actions */}
              <div>
                <label className="text-xs font-black text-cyan-300 uppercase tracking-wider block mb-2">
                  Kim Cương (Diamonds)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => { setDiamonds(user.diamonds + 50); showNotification('+50 Kim Cương'); }}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-cyan-300 active:scale-95"
                  >
                    +50 💎
                  </button>
                  <button
                    onClick={() => { setDiamonds(user.diamonds + 500); showNotification('+500 Kim Cương'); }}
                    data-testid="dev-add-diamonds-500-btn"
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-cyan-300 active:scale-95"
                  >
                    +500 💎
                  </button>
                  <button
                    onClick={() => { setDiamonds(Math.max(0, user.diamonds - 50)); showNotification('-50 Kim Cương'); }}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-slate-300 active:scale-95"
                  >
                    -50 💎
                  </button>
                  <button
                    onClick={() => { setDiamonds(9999); showNotification('Đặt 9,999 Kim Cương'); }}
                    className="py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/50 font-black text-xs text-cyan-300 active:scale-95"
                  >
                    Max 9k
                  </button>
                </div>
              </div>

              {/* Stars & Boss Pass */}
              <div>
                <label className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-2">
                  Sao & Vé Đấu Boss
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setStars(user.stars + 5); showNotification('+5 Sao Tinh Cầu'); }}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-amber-300 active:scale-95"
                  >
                    +5 ⭐
                  </button>
                  <button
                    onClick={() => { setStars(user.stars + 20); showNotification('+20 Sao Tinh Cầu'); }}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-black text-xs text-amber-300 active:scale-95"
                  >
                    +20 ⭐
                  </button>
                  <button
                    onClick={() => { buyBooster('boss_pass', 0); showNotification('+1 Vé Đấu Boss Miễn Phí'); }}
                    className="py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 font-black text-xs text-purple-300 active:scale-95"
                  >
                    +1 Vé Boss 🎫
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROGRESSION & UNLOCKS */}
          {activeTab === 'progression' && (
            <div className="space-y-3">
              <label className="text-xs font-black text-sky-300 uppercase tracking-wider block">
                Vượt Màn & Mở Khóa Nội Dung
              </label>

              <button
                onClick={prepareManualReview}
                data-testid="dev-prepare-review-btn"
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Check className="w-5 h-5" />
                  <div className="text-left">
                    <div>Chuẩn Bị Manual Review · 1 Chạm</div>
                    <div className="text-[10px] text-amber-950/80 font-bold">Full tài nguyên · mở bài/tàu · tạo hồ sơ B · không cần cày</div>
                  </div>
                </div>
                <span>✓ Chạy</span>
              </button>

              <div className="rounded-xl border border-cyan-700/60 bg-cyan-950/40 p-3 text-[11px] text-cyan-100">
                Góc Phụ Huynh và Space ID dùng mật khẩu review <strong>1234</strong> hoặc <strong>123456</strong> trong môi trường demo.
              </div>

              {/* Instant Complete Current Lesson */}
              <button
                onClick={() => {
                  instantCompleteCurrentLesson();
                  showNotification('Đã hoàn thành bài học 3 sao trọn vẹn! 🏆');
                }}
                data-testid="dev-instant-complete-btn"
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-yellow-300" />
                  <div className="text-left">
                    <div>Hoàn Thành Nhanh Bài Học Hiện Tại</div>
                    <div className="text-[10px] text-emerald-200 font-normal">Tự động trao 3⭐, XP & Xu thưởng</div>
                  </div>
                </div>
                <span>⚡ Chạy</span>
              </button>

              {/* Unlock All Planet Nodes */}
              <button
                onClick={() => {
                  unlockAllPlanetNodes();
                  showNotification('Đã mở khóa toàn bộ các màn trên tất cả hành tinh! 🌌');
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                  <div className="text-left">
                    <div>Mở Khóa Toàn Bộ Tinh Cầu (All Nodes 3⭐)</div>
                    <div className="text-[10px] text-indigo-200 font-normal">Mở tất cả tọa độ trên Tinh Cầu Dũng Khí</div>
                  </div>
                </div>
                <span>🌌 Mở</span>
              </button>

              {/* Unlock All Cosmetics */}
              <button
                onClick={() => {
                  unlockAllCosmetics();
                  showNotification('Đã mở khóa toàn bộ phi thuyền & màu sơn! 🚀');
                }}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Rocket className="w-5 h-5 text-white" />
                  <div className="text-left">
                    <div>Mở Khóa Toàn Bộ Phi Thuyền & Skin</div>
                    <div className="text-[10px] text-purple-200 font-normal">Falcon Apex, Starlight Runner & Full màu</div>
                  </div>
                </div>
                <span>🎨 Mở</span>
              </button>

              {/* Open 3D Space Fleet Showroom (Admin Feature) */}
              {onOpenShowroom && (
                <button
                  onClick={() => {
                    toggleDevPanel(false);
                    onOpenShowroom();
                  }}
                  data-testid="dev-open-showroom-btn"
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <div className="text-left">
                      <div>Phòng Duyệt 3D Không Gian (Admin)</div>
                      <div className="text-[10px] text-sky-200 font-normal">Duyệt 8 phi thuyền khí động học & tinh cầu</div>
                    </div>
                  </div>
                  <span>✨ Mở</span>
                </button>
              )}

              {/* Complete Daily Greeting Quest */}
              <button
                onClick={() => {
                  setGreetingQuestDone(true);
                  showNotification('Đã đánh dấu hoàn thành nhiệm vụ chào hỏi!');
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-500 font-black text-xs sm:text-sm text-slate-200 flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <div>Tự Động Duyệt Nhiệm Vụ Phụ Huynh</div>
                    <div className="text-[10px] text-slate-400 font-normal">Chỉ dùng trong môi trường phát triển</div>
                  </div>
                </div>
                <span>✅ Duyệt</span>
              </button>
            </div>
          )}

          {/* TAB 4: SYSTEM & PERFORMANCE */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              
              {/* FPS & Performance HUD Master Switch */}
              <button 
                type="button"
                onClick={() => toggleFpsOverlay()}
                data-testid="dev-fps-toggle"
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all text-left ${
                  showFpsOverlay 
                    ? 'bg-slate-900 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]' 
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    showFpsOverlay ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-sky-300 flex items-center gap-1.5">
                      <span>HIỂN THỊ PERFORMANCE HUD</span>
                      <span 
                        data-testid="dev-fps-status" 
                        className={`text-[9px] px-1.5 py-0.2 rounded font-black ${showFpsOverlay ? 'bg-sky-400 text-slate-950' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {showFpsOverlay ? 'ON' : 'OFF'}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">Đo FPS, Frame Time (ms) & JS Heap RAM</p>
                  </div>
                </div>

                <div className={`w-12 h-6 rounded-full p-0.5 transition-colors ${showFpsOverlay ? 'bg-sky-400' : 'bg-slate-700'}`}>
                  <div className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${showFpsOverlay ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </button>

              {/* Reset State Card */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2.5">
                <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-wider">
                  <RotateCcw className="w-4 h-4" />
                  <span>Khôi Phục Mặc Định (Reset State)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Xóa toàn bộ dữ liệu LocalStorage và quay về trạng thái tài khoản mới tinh (FTUE).
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ tiến trình game và bắt đầu lại từ đầu không?')) {
                      resetAllProgress();
                      showNotification('Đã xóa dữ liệu và reset game thành công!');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs active:scale-95 transition-all shadow"
                >
                  Xóa Dữ Liệu & Reset Tài Khoản
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium shrink-0">
          <span>NovaStars Dev Suite</span>
          <button
            onClick={() => toggleDevPanel(false)}
            data-testid="dev-footer-close-btn"
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl active:scale-95 transition-all"
          >
            Đóng Panel
          </button>
        </div>

      </div>
    </div>
  );
};
