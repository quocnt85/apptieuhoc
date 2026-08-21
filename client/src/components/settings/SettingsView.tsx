import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Settings, Volume2, VolumeX, Clock, User, RotateCcw } from 'lucide-react';
import { interactionService } from '../../services/interaction';

export const SettingsView: React.FC = () => {
  const { user, settings, toggleSound } = useGameStore();

  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const avatars = ['🦁', '🐼', '🦊', '🚀', '🤖', '🦖', '🦄', '⭐'];

  const handleSelectAvatar = (av: string) => {
    setSelectedAvatar(av);
    useGameStore.setState((state) => ({
      user: { ...state.user, avatar: av }
    }));
    interactionService.playSelect();
  };

  const handleToggle = () => {
    interactionService.playTap();
    toggleSound();
  };

  const handleReset = () => {
    interactionService.playError();
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ làm bài để luyện tập lại từ đầu không?')) {
      localStorage.removeItem('novastars_app_state_v1');
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
        <div className="text-xs font-black text-slate-300">ÂM THANH</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? <Volume2 className="w-6 h-6 text-blue-400" /> : <VolumeX className="w-6 h-6 text-slate-500" />}
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-100">Âm thanh & Rung</div>
              <div className="text-xs text-slate-400 mt-0.5">Hiệu ứng vui nhộn khi chọn đáp án</div>
            </div>
          </div>
          <button
            onClick={handleToggle}
            aria-label="Chuyển đổi âm thanh"
            className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
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

