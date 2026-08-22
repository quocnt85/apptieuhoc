import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Award, Zap, Star, Flame, Sparkles, User, Shield } from 'lucide-react';
import { soundService } from '../../services/audio';
import { AvatarComposer } from '../personalization/AvatarComposer';
import { AvatarStudio } from '../personalization/AvatarStudio';
import { useParentZoneStore } from '../../stores/useParentZoneStore';
import { TerritoryFlagStudio } from '../personalization/TerritoryFlagStudio';
import { PERSONALIZATION_FEATURE_FLAGS } from '../../config/personalizationFeatureFlags';
import { CaptainIdStudio } from '../personalization/CaptainIdStudio';

export const ProfileView: React.FC = () => {
  const { user, completedNodes } = useGameStore();
  const activeChildId = useParentZoneStore((state) => state.activeProfileId);
  const isCompletedNode1 = Boolean(completedNodes['island_1_node_1']);

  const [showAvatarStudio, setShowAvatarStudio] = useState(false);
  const [showFlagStudio, setShowFlagStudio] = useState(false);
  const flagEnabled = import.meta.env.DEV || PERSONALIZATION_FEATURE_FLAGS.territoryFlag;
  const [showCaptainId, setShowCaptainId] = useState(false);
  const captainIdEnabled = import.meta.env.DEV || PERSONALIZATION_FEATURE_FLAGS.captainIdExport;
  const currentAvatar = user.avatar === '🚀' ? '👨‍🚀' : user.avatar;

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto pb-24 animate-fadeIn bg-gradient-to-b from-[#050814] via-[#0b1026] to-[#160e33] text-white select-none">
      {/* Cosmonaut Profile Card */}
      <div className="p-6 text-center bg-slate-900/90 backdrop-blur-xl border-2 border-sky-400/50 shadow-[0_12px_32px_rgba(56,189,248,0.2)] rounded-[32px] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-sky-400/20 to-transparent -z-10" />

        <div className="relative inline-block mx-auto mb-3">
          <button onClick={() => { soundService.playClick(); setShowAvatarStudio(true); }} aria-label="Mở xưởng avatar" className="block cursor-pointer transition-all hover:scale-105 active:scale-95">
            <AvatarComposer childId={activeChildId} presetAvatar={currentAvatar} className="h-24 w-24 rounded-3xl animate-float"/>
          </button>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full border border-white shadow-md cursor-pointer">
            Đổi ✨
          </div>
        </div>

        <h2 className="font-black text-2xl text-yellow-300">{user.name}</h2>
        <p className="font-extrabold text-xs text-sky-200 mt-0.5">Phi Hành Gia Lớp {user.grade}</p>

        {/* 3D Cosmic Stat Chips */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-slate-900/90 border border-sky-400/50 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-sky-200 shadow">
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-black text-xs sm:text-sm">{user.energy}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5">Năng Lượng</span>
          </div>

          <div className="bg-slate-900/90 border border-amber-400/50 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-yellow-300 shadow">
            <div className="flex items-center gap-1">
              <span className="text-xs">🟡</span>
              <span className="font-black text-xs sm:text-sm">{user.novaCoins}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5">Xu Nova</span>
          </div>

          <div className="bg-slate-900/90 border border-cyan-400/50 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-cyan-300 shadow">
            <div className="flex items-center gap-1">
              <span className="text-xs">💎</span>
              <span className="font-black text-xs sm:text-sm">{user.diamonds}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5">Kim Cương</span>
          </div>

          <div className="bg-slate-900/90 border border-orange-400/50 p-2.5 rounded-2xl flex flex-col items-center justify-center font-black text-xs text-orange-300 shadow">
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
              <span className="font-black text-xs sm:text-sm">{user.streakDays}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5">Chuỗi Ngày</span>
          </div>
        </div>
      </div>
      {showAvatarStudio && <AvatarStudio childId={activeChildId} onClose={() => setShowAvatarStudio(false)}/>}
      {flagEnabled && <button data-testid="open-flag-studio" onClick={() => setShowFlagStudio(true)} className="rounded-[28px] border-2 border-violet-400/40 bg-gradient-to-r from-indigo-950 to-violet-950 p-4 text-left shadow-xl"><div className="flex items-center gap-3"><span className="text-3xl">🚩</span><div><div className="font-black text-violet-200">Cờ Lãnh Địa</div><div className="text-xs text-slate-400">Tạo cờ local và gửi phụ huynh duyệt trước khi áp dụng</div></div></div></button>}
      {showFlagStudio && <TerritoryFlagStudio childId={activeChildId} onClose={() => setShowFlagStudio(false)}/>}
      {captainIdEnabled && <button data-testid="open-space-id" onClick={()=>setShowCaptainId(true)} className="rounded-[28px] border-2 border-cyan-400/40 bg-gradient-to-r from-cyan-950 to-blue-950 p-4 text-left shadow-xl"><div className="flex items-center gap-3"><span className="text-3xl">🪪</span><div><div className="font-black text-cyan-200">Space ID</div><div className="text-xs text-slate-400">Tạo thẻ thành tích local; cần PIN phụ huynh để xuất</div></div></div></button>}
      {showCaptainId&&<CaptainIdStudio childId={activeChildId} onClose={()=>setShowCaptainId(false)}/>}

      {/* 3D Cosmic Medals Collection */}
      <div className="p-5 sm:p-6 bg-slate-900/90 backdrop-blur-xl border-2 border-amber-400/40 shadow-xl rounded-[32px] space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-yellow-300 flex items-center gap-2">
            <span>🏅</span> Huy Chương Đã Đạt
          </h3>
          <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/50">
            {isCompletedNode1 ? '1 / 5' : '0 / 5'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {isCompletedNode1 ? (
            <div className="bg-gradient-to-r from-amber-950/80 via-yellow-950/70 to-slate-900 border-2 border-amber-400 p-4 rounded-3xl flex items-center gap-4 font-black text-xs sm:text-sm text-yellow-200 shadow-lg animate-scaleUp">
              <div className="relative shrink-0">
                <img 
                  src="/assets/3d/bravery_badge.png" 
                  alt="Huy Chương Dũng Cảm" 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_4px_12px_rgba(251,191,36,0.7)] animate-float" 
                />
              </div>
              <div>
                <p className="font-black text-sm sm:text-base text-yellow-300">Ngôi Sao Giao Tiếp</p>
                <p className="text-xs text-slate-300 font-bold mt-0.5">
                  Đã hoàn thành xuất sắc Bài 1 trên Tinh Cầu Dũng Khí!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-slate-950/60 border-2 border-dashed border-sky-400/40 rounded-3xl text-center space-y-2">
              <div className="text-3xl opacity-60 animate-bounce-slow">🏅</div>
              <p className="font-black text-sm text-slate-300">Chưa có huy chương</p>
              <p className="font-bold text-xs text-slate-500 max-w-xs mx-auto">
                Hoàn thành bài học trên bản đồ để nhận huy chương nhé!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
