import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Settings, Volume2, VolumeX, Smartphone, Clock, User, RotateCcw, Shield } from 'lucide-react';
import { soundService } from '../../services/audio';

export const SettingsView: React.FC = () => {
  const { user, settings, toggleSound } = useGameStore();

  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const avatars = ['🦁', '🐼', '🦊', '🚀', '🤖', '🦖', '🦄', '⭐'];

  const handleSelectAvatar = (av: string) => {
    setSelectedAvatar(av);
    useGameStore.setState((state) => ({
      user: { ...state.user, avatar: av }
    }));
    soundService.playClick();
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ làm bài để luyện tập lại từ đầu không?')) {
      localStorage.removeItem('novastars_app_state_v1');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Cài Đặt Ứng Dụng</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tùy chỉnh âm thanh, đại diện học sinh và chế độ bảo vệ trẻ em.
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>CHỌN HÌNH ĐẠI DIỆN YÊU THÍCH</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {avatars.map((av) => (
            <button
              key={av}
              onClick={() => handleSelectAvatar(av)}
              className={`p-3 rounded-2xl text-2xl border-2 transition-all flex items-center justify-center ${
                selectedAvatar === av
                  ? 'bg-indigo-600/30 border-indigo-500 shadow-md shadow-indigo-500/20 scale-105'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Sound & Haptics Toggle */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
        <div className="text-xs font-bold text-slate-300">ÂM THANH & PHẢN HỒI</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            <div>
              <div className="text-xs font-bold text-slate-200">Hiệu ứng âm thanh sinh động</div>
              <div className="text-[11px] text-slate-400">Âm thanh vui tươi khi chọn đúng, hoàn thành thử thách</div>
            </div>
          </div>
          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Parental Screen Time Limit */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>GIỚI HẠN THỜI GIAN HỌC MỖI NGÀY</span>
          </div>
          <span className="text-xs font-bold text-purple-400 font-mono">{settings.dailyTimeLimitMinutes} phút</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Giúp bé cân bằng thời gian sử dụng thiết bị và bảo vệ thị lực theo khuyến nghị khoa học.
        </p>
      </div>

      {/* Reset Data */}
      <div className="pt-2">
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại dữ liệu luyện tập</span>
        </button>
      </div>
    </div>
  );
};
