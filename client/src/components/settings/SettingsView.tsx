import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Settings, Volume2, VolumeX, Music, Clock, User, RotateCcw } from 'lucide-react';
import { interactionService } from '../../services/interaction';

export const SettingsView: React.FC = () => {
  const { user, settings, toggleBgm, toggleSfx } = useGameStore();

  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const avatars = ['🦁', '🐼', '🦊', '🚀', '🤖', '🦖', '🦄', '⭐'];

  const handleSelectAvatar = (av: string) => {
    setSelectedAvatar(av);
    useGameStore.setState((state) => ({
      user: { ...state.user, avatar: av }
    }));
    interactionService.playSelect();
  };

  const handleReset = () => {
    interactionService.playError();
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ làm bài để luyện tập lại từ đầu không?')) {
      useGameStore.getState().resetAllProgress();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn max-w-xl mx-auto px-1">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Cài Đặt</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Âm thanh, hình đại diện và bảo vệ mắt cho bé.
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="text-xs font-black text-slate-300 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>ĐỔI ẢNH ĐẠI DIỆN</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {avatars.map((av) => (
            <button
              key={av}
              onClick={() => handleSelectAvatar(av)}
              className={`p-3 rounded-2xl text-2xl sm:text-3xl border-2 transition-all flex items-center justify-center min-h-[56px] active:scale-95 ${
                selectedAvatar === av
                  ? 'bg-indigo-600/40 border-indigo-400 shadow-md scale-105'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Sound & Haptics Toggle */}
      <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="text-xs font-black text-slate-300 uppercase tracking-wider">Âm thanh & Nhạc nền</div>

        <div className="flex items-center justify-between" data-testid="bgm-toggle-row">
          <div className="flex items-center gap-3">
            <Music className={`w-6 h-6 ${settings.bgmEnabled ? 'text-sky-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-100">Nhạc nền BGM</div>
              <div className="text-xs text-slate-400 mt-0.5">Nhạc vũ trụ trong lúc học và khám phá</div>
            </div>
          </div>
          <button
            onClick={toggleBgm}
            aria-label="Bật tắt nhạc nền BGM"
            aria-pressed={settings.bgmEnabled}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${settings.bgmEnabled ? 'bg-sky-500 shadow-sm shadow-sky-500/40' : 'bg-slate-700'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settings.bgmEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800" data-testid="sfx-toggle-row">
          <div className="flex items-center gap-3">
            {settings.sfxEnabled ? <Volume2 className="w-6 h-6 text-emerald-400" /> : <VolumeX className="w-6 h-6 text-slate-500" />}
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-100">Hiệu ứng âm thanh SFX</div>
              <div className="text-xs text-slate-400 mt-0.5">Nút bấm, phần thưởng, tàu và hyperspace</div>
            </div>
          </div>
          <button
            onClick={toggleSfx}
            aria-label="Bật tắt hiệu ứng âm thanh SFX"
            aria-pressed={settings.sfxEnabled}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${settings.sfxEnabled ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40' : 'bg-slate-700'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settings.sfxEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* BGM Style Selection */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phong cách nhạc nền (Tone.js)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                useGameStore.getState().setBgmStyle('ambient');
              }}
              disabled={!settings.bgmEnabled}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                (settings.bgmStyle || 'ambient') === 'ambient'
                  ? 'bg-sky-950/60 border-sky-400 text-white shadow-md shadow-sky-950/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              } ${!settings.bgmEnabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-98'}`}
            >
              <span className="text-lg">🪐</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100">Vũ trụ êm dịu</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Thư giãn, tập trung làm bài</div>
              </div>
            </button>

            <button
              onClick={() => {
                useGameStore.getState().setBgmStyle('adventure');
              }}
              disabled={!settings.bgmEnabled}
              className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                settings.bgmStyle === 'adventure'
                  ? 'bg-amber-950/60 border-amber-400 text-white shadow-md shadow-amber-950/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              } ${!settings.bgmEnabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-98'}`}
            >
              <span className="text-lg">🚀</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-100">Phiêu lưu ngân hà</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Hào hùng, sôi nổi khám phá</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Parental Screen Time Limit */}
      <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-4 sm:p-5 space-y-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-slate-300">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>GIỚI HẠN THỜI GIAN MỖI NGÀY</span>
          </div>
          <span className="text-xs font-black text-purple-400 font-mono">{settings.dailyTimeLimitMinutes} phút</span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Bảo vệ mắt và cân bằng thời gian sử dụng thiết bị.
        </p>
      </div>

      {/* Reset Data */}
      <div className="pt-2">
        <button
          onClick={handleReset}
          className="w-full min-h-[50px] py-3 rounded-2xl bg-rose-950/40 border-2 border-rose-800/60 hover:bg-rose-900/40 text-rose-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại tiến độ làm bài</span>
        </button>
      </div>
    </div>
  );
};

