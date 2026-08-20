import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Award, Zap, Star, Flame, Trophy, Sparkles, User } from 'lucide-react';
import { interactionService } from '../../services/interaction';

export const ProfileView: React.FC = () => {
  const { user, completedNodes } = useGameStore();
  const isCompletedNode1 = Boolean(completedNodes['island_1_node_1']);

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatars = ['👧', '👦', '🦁', '🐼', '🦊', '🚀', '🤖', '🦖', '🦄', '⭐'];

  const handleSelectAvatar = (av: string) => {
    interactionService.playSelect();
    useGameStore.setState((state) => ({
      user: { ...state.user, avatar: av }
    }));
    setShowAvatarPicker(false);
  };

  return (
    <div className="flex-1 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-slate-50">
      {/* Profile Card */}
      <div className="ns-card-3d p-6 text-center bg-white border-2 border-slate-200 shadow-xl">
        <div className="relative inline-block mx-auto mb-3">
          <div 
            onClick={() => { interactionService.playTap(); setShowAvatarPicker(!showAvatarPicker); }}
            className="w-22 h-22 rounded-3xl bg-blue-50 border-3 border-blue-400 flex items-center justify-center text-5xl shadow-inner cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            {user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white font-black text-[11px] px-2 py-0.5 rounded-full border-2 border-white shadow">
            Đổi
          </div>
        </div>

        {/* Avatar Picker Modal Dropdown */}
        {showAvatarPicker && (
          <div className="bg-slate-900 border-2 border-indigo-500/50 p-3 rounded-2xl mb-4 shadow-xl animate-scaleUp">
            <div className="text-xs font-black text-slate-300 mb-2">CHỌN AVATAR MỚI</div>
            <div className="grid grid-cols-5 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-11 h-11 rounded-xl text-2xl border-2 flex items-center justify-center transition-all ${
                    user.avatar === av ? 'bg-indigo-600 border-white shadow scale-105' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}

        <h2 className="font-black text-2xl text-[#1e1b4b]">{user.name}</h2>
        <p className="font-bold text-xs text-slate-500 mt-0.5">Cấp Độ: Ngôi Sao Tập Sự (Lớp {user.grade})</p>

        {/* Stat Chips */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-amber-50 border-2 border-amber-300 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-amber-900 shadow-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="font-black text-sm">{user.xp}</span>
            </div>
            <span className="text-[11px] text-amber-700 font-bold mt-0.5">Điểm XP</span>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-yellow-900 shadow-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
              <span className="font-black text-sm">{user.stars}</span>
            </div>
            <span className="text-[11px] text-yellow-700 font-bold mt-0.5">Ngôi Sao</span>
          </div>

          <div className="bg-orange-50 border-2 border-orange-300 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-orange-900 shadow-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span className="font-black text-sm">{user.streakDays}</span>
            </div>
            <span className="text-[11px] text-orange-700 font-bold mt-0.5">Ngày Chuỗi</span>
          </div>
        </div>
      </div>

      {/* Badges Collection Gallery */}
      <div className="ns-card-3d p-5 bg-white border-2 border-slate-200 space-y-3">
        <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
          <span>🏅</span> Bộ Sưu Tập Huy Chương
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {isCompletedNode1 ? (
            <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl flex items-center gap-3 font-black text-xs sm:text-sm text-amber-900 shadow-sm animate-scaleUp">
              <span className="text-3xl">🏅</span>
              <div>
                <p className="font-black text-sm text-amber-950">Huy Chương: Ngôi Sao Giao Tiếp</p>
                <p className="text-xs text-amber-700 font-medium mt-0.5">Hoàn thành xuất sắc Bài 1: Lời Chào Ngôi Sao</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center">
              <p className="font-bold text-xs text-slate-400">
                Chưa có huy chương nào. Hoàn thành Bài 1 trên Bản Đồ để mở khóa huy chương đầu tiên nhé! 🌟
              </p>
            </div>
          )}

          {/* Locked Badge 2 */}
          <div className="bg-slate-50 border-2 border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 text-slate-400 opacity-60">
            <span className="text-3xl">🔒</span>
            <div>
              <p className="font-black text-xs sm:text-sm text-slate-600">Huy Chương: Khiên Dũng Cảm</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Mở khóa sau khi hoàn thành Bài 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

