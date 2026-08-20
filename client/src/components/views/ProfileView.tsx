import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Award, Zap, Star, Flame, Trophy, Sparkles, User } from 'lucide-react';
import { interactionService } from '../../services/interaction';

export const ProfileView: React.FC = () => {
  const { user, completedNodes, demoStyleMode } = useGameStore();
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

  // 1. High-Gloss 3D Game Style
  if (demoStyleMode === 'gloss3d') {
    return (
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-slate-950 text-white select-none">
        {/* Profile Card */}
        <div className="p-6 text-center bg-gradient-to-br from-indigo-900/90 via-purple-950/90 to-slate-900/90 border-2 border-indigo-400/60 shadow-[0_10px_0_0_#1e1b4b,0_20px_35px_rgba(0,0,0,0.6)] rounded-[32px] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-[30px]" />
          
          <div className="relative inline-block mx-auto mb-3 z-10">
            <div 
              onClick={() => { interactionService.playTap(); setShowAvatarPicker(!showAvatarPicker); }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-b from-indigo-600 to-purple-800 border-3 border-indigo-300 flex items-center justify-center text-5xl shadow-[0_6px_20px_rgba(99,102,241,0.5)] cursor-pointer hover:scale-105 active:scale-95 transition-all animate-float"
            >
              {user.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-600 text-amber-950 font-black text-[11px] px-2.5 py-0.5 rounded-full border-2 border-amber-200 shadow-md">
              Đổi ✨
            </div>
          </div>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <div className="bg-slate-950 border-2 border-indigo-500 p-3 rounded-2xl mb-4 shadow-2xl animate-scaleUp relative z-20">
              <div className="text-xs font-black text-yellow-300 mb-2">CHỌN AVATAR MỚI</div>
              <div className="grid grid-cols-5 gap-2">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => handleSelectAvatar(av)}
                    className={`w-11 h-11 rounded-xl text-2xl border-2 flex items-center justify-center transition-all ${
                      user.avatar === av ? 'bg-indigo-600 border-yellow-300 shadow scale-105' : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <h2 className="font-black text-2xl text-yellow-300 drop-shadow">{user.name}</h2>
          <p className="font-extrabold text-xs text-slate-300 mt-0.5">Cấp Độ: Ngôi Sao Tập Sự (Lớp {user.grade})</p>

          {/* 3D Stat Chips */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 relative z-10">
            <div className="bg-slate-950/90 border-2 border-amber-500/60 p-3 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-amber-300 shadow-[0_4px_0_0_#78350f]">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                <span className="font-black text-sm text-white">{user.xp}</span>
              </div>
              <span className="text-[11px] text-amber-400 font-bold mt-0.5">Điểm XP</span>
            </div>

            <div className="bg-slate-950/90 border-2 border-yellow-500/60 p-3 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-yellow-300 shadow-[0_4px_0_0_#854d0e]">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-bounce-slow" />
                <span className="font-black text-sm text-white">{user.stars}</span>
              </div>
              <span className="text-[11px] text-yellow-400 font-bold mt-0.5">Ngôi Sao</span>
            </div>

            <div className="bg-slate-950/90 border-2 border-orange-500/60 p-3 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-orange-300 shadow-[0_4px_0_0_#9a3412]">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
                <span className="font-black text-sm text-white">{user.streakDays}</span>
              </div>
              <span className="text-[11px] text-orange-400 font-bold mt-0.5">Ngày Chuỗi</span>
            </div>
          </div>
        </div>

        {/* Badges Collection Gallery */}
        <div className="p-5 sm:p-6 bg-slate-900/90 border-2 border-slate-800 shadow-[0_8px_0_0_#090d16] rounded-[30px] space-y-3">
          <h3 className="font-black text-base text-yellow-300 flex items-center gap-1.5 drop-shadow">
            <span>🏅</span> Bộ Sưu Tập Huy Chương
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {isCompletedNode1 ? (
              <div className="bg-gradient-to-r from-amber-950/80 to-yellow-950/80 border-2 border-amber-400/80 p-3.5 rounded-2xl flex items-center gap-3 font-black text-xs sm:text-sm text-amber-200 shadow-[0_3px_0_0_#78350f] animate-scaleUp">
                <span className="text-3xl animate-float">🏅</span>
                <div>
                  <p className="font-black text-sm text-yellow-300">Huy Chương: Ngôi Sao Giao Tiếp</p>
                  <p className="text-xs text-amber-400 font-bold mt-0.5">Hoàn thành xuất sắc Bài 1: Lời Chào Ngôi Sao</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/60 border-2 border-dashed border-slate-800 rounded-2xl text-center">
                <p className="font-bold text-xs text-slate-500">
                  Chưa có huy chương nào. Hoàn thành Bài 1 trên Bản Đồ để mở khóa huy chương đầu tiên nhé! 🌟
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Playful Neo-Pop Style
  if (demoStyleMode === 'neopop') {
    return (
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-[#fef9c3] text-slate-900 select-none">
        {/* Profile Card */}
        <div className="p-6 text-center bg-white border-3 border-slate-900 shadow-[6px_6px_0_0_#0f172a] rounded-[28px]">
          <div className="relative inline-block mx-auto mb-3">
            <div 
              onClick={() => { interactionService.playTap(); setShowAvatarPicker(!showAvatarPicker); }}
              className="w-24 h-24 rounded-2xl bg-[#bae6fd] border-3 border-slate-900 shadow-[3px_3px_0_0_#0f172a] flex items-center justify-center text-5xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              {user.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#fde047] text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a]">
              Đổi ✨
            </div>
          </div>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <div className="bg-slate-900 border-3 border-slate-900 p-3 rounded-2xl mb-4 shadow-[4px_4px_0_0_#0f172a] animate-scaleUp">
              <div className="text-xs font-black text-white mb-2">CHỌN AVATAR MỚI</div>
              <div className="grid grid-cols-5 gap-2">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => handleSelectAvatar(av)}
                    className={`w-11 h-11 rounded-xl text-2xl border-2 flex items-center justify-center transition-all ${
                      user.avatar === av ? 'bg-[#fde047] border-white shadow scale-105' : 'bg-slate-800 border-slate-700 text-white'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <h2 className="font-black text-2xl text-slate-900">{user.name}</h2>
          <p className="font-extrabold text-xs text-slate-600 mt-0.5">Cấp Độ: Ngôi Sao Tập Sự (Lớp {user.grade})</p>

          {/* Stat Chips */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
            <div className="bg-[#fde047] border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-slate-950">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span className="font-black text-sm">{user.xp}</span>
              </div>
              <span className="text-[11px] font-bold mt-0.5">Điểm XP</span>
            </div>

            <div className="bg-[#86efac] border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-slate-950">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span className="font-black text-sm">{user.stars}</span>
              </div>
              <span className="text-[11px] font-bold mt-0.5">Ngôi Sao</span>
            </div>

            <div className="bg-[#fda4af] border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-slate-950">
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span className="font-black text-sm">{user.streakDays}</span>
              </div>
              <span className="text-[11px] font-bold mt-0.5">Ngày Chuỗi</span>
            </div>
          </div>
        </div>

        {/* Badges Collection Gallery */}
        <div className="p-5 sm:p-6 bg-white border-3 border-slate-900 shadow-[6px_6px_0_0_#0f172a] rounded-[28px] space-y-3">
          <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
            <span>🏅</span> Bộ Sưu Tập Huy Chương
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {isCompletedNode1 ? (
              <div className="bg-[#fef08a] border-2 border-slate-900 p-3.5 rounded-2xl flex items-center gap-3 font-black text-xs sm:text-sm text-slate-900 shadow-[3px_3px_0_0_#0f172a] animate-scaleUp">
                <span className="text-3xl animate-float">🏅</span>
                <div>
                  <p className="font-black text-sm text-slate-900">Huy Chương: Ngôi Sao Giao Tiếp</p>
                  <p className="text-xs text-slate-700 font-bold mt-0.5">Hoàn thành xuất sắc Bài 1: Lời Chào Ngôi Sao</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-400 rounded-2xl text-center">
                <p className="font-bold text-xs text-slate-600">
                  Chưa có huy chương nào. Hoàn thành Bài 1 trên Bản Đồ để mở khóa huy chương đầu tiên nhé! 🌟
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Apple Arcade Glassmorphism Style
  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-gradient-to-b from-indigo-50/60 via-sky-50/60 to-rose-50/60 text-slate-900 select-none">
      {/* Profile Card */}
      <div className="backdrop-blur-2xl bg-white/80 border-2 border-white rounded-[32px] p-6 text-center shadow-[0_16px_40px_rgba(99,102,241,0.12)]">
        <div className="relative inline-block mx-auto mb-3">
          <div 
            onClick={() => { interactionService.playTap(); setShowAvatarPicker(!showAvatarPicker); }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-b from-indigo-100 to-sky-100 border-2 border-indigo-200 flex items-center justify-center text-5xl shadow-inner cursor-pointer hover:scale-105 active:scale-95 transition-all animate-float"
          >
            {user.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full border border-white shadow-md">
            Đổi ✨
          </div>
        </div>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <div className="backdrop-blur-2xl bg-slate-900/90 border border-white/20 p-3 rounded-2xl mb-4 shadow-xl animate-scaleUp">
            <div className="text-xs font-black text-white mb-2">CHỌN AVATAR MỚI</div>
            <div className="grid grid-cols-5 gap-2">
              {avatars.map((av) => (
                <button
                  key={av}
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-11 h-11 rounded-xl text-2xl border flex items-center justify-center transition-all ${
                    user.avatar === av ? 'bg-indigo-600 border-white shadow scale-105' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}

        <h2 className="font-black text-2xl text-indigo-950">{user.name}</h2>
        <p className="font-bold text-xs text-slate-500 mt-0.5">Cấp Độ: Ngôi Sao Tập Sự (Lớp {user.grade})</p>

        {/* Stat Chips */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
          <div className="backdrop-blur-md bg-amber-500/10 border border-amber-300/80 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-amber-950 shadow-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span className="font-black text-sm">{user.xp}</span>
            </div>
            <span className="text-[11px] text-amber-800 font-bold mt-0.5">Điểm XP</span>
          </div>

          <div className="backdrop-blur-md bg-yellow-500/10 border border-yellow-300/80 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-yellow-950 shadow-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 animate-bounce-slow" />
              <span className="font-black text-sm">{user.stars}</span>
            </div>
            <span className="text-[11px] text-yellow-800 font-bold mt-0.5">Ngôi Sao</span>
          </div>

          <div className="backdrop-blur-md bg-orange-500/10 border border-orange-300/80 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-orange-950 shadow-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
              <span className="font-black text-sm">{user.streakDays}</span>
            </div>
            <span className="text-[11px] text-orange-800 font-bold mt-0.5">Ngày Chuỗi</span>
          </div>
        </div>
      </div>

      {/* Badges Collection Gallery */}
      <div className="backdrop-blur-2xl bg-white/80 border-2 border-white rounded-[32px] p-5 sm:p-6 space-y-3 shadow-[0_16px_40px_rgba(99,102,241,0.08)]">
        <h3 className="font-black text-base text-indigo-950 flex items-center gap-1.5">
          <span>🏅</span> Bộ Sưu Tập Huy Chương
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {isCompletedNode1 ? (
            <div className="bg-white/90 border border-amber-300 p-3.5 rounded-2xl flex items-center gap-3 font-black text-xs sm:text-sm text-amber-950 shadow-sm animate-scaleUp">
              <span className="text-3xl animate-float">🏅</span>
              <div>
                <p className="font-black text-sm text-amber-950">Huy Chương: Ngôi Sao Giao Tiếp</p>
                <p className="text-xs text-amber-700 font-bold mt-0.5">Hoàn thành xuất sắc Bài 1: Lời Chào Ngôi Sao</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white/50 border border-dashed border-slate-300 rounded-2xl text-center">
              <p className="font-bold text-xs text-slate-400">
                Chưa có huy chương nào. Hoàn thành Bài 1 trên Bản Đồ để mở khóa huy chương đầu tiên nhé! 🌟
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


