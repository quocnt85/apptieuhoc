import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Award, Zap, Star } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, completedNodes } = useGameStore();
  const isCompletedNode1 = Boolean(completedNodes['island_1_node_1']);

  return (
    <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto pb-20 animate-fadeIn bg-slate-50">
      {/* Profile Card */}
      <div className="ns-card-3d p-6 text-center bg-white">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 border-3 border-blue-300 flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner">
          {user.avatar}
        </div>
        <h2 className="font-black text-xl text-[#1e1b4b]">{user.name}</h2>
        <p className="font-bold text-xs text-slate-500 mt-0.5">Cấp Độ: Ngôi Sao Tập Sự</p>

        <div className="flex justify-center gap-3 mt-4">
          <div className="bg-amber-50 border-2 border-amber-300 px-4 py-2 rounded-2xl flex items-center gap-1.5 font-extrabold text-xs text-amber-900 shadow-sm">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{user.xp} XP</span>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-300 px-4 py-2 rounded-2xl flex items-center gap-1.5 font-extrabold text-xs text-yellow-900 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
            <span>{user.stars} Stars</span>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="ns-card-3d p-5 bg-white space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
          <span>🏅</span> Huy Chương Đã Đạt
        </h3>

        <div className="flex gap-2 flex-wrap">
          {isCompletedNode1 ? (
            <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-2xl flex items-center gap-2 font-extrabold text-xs text-amber-900 shadow-sm animate-scaleUp">
              <span className="text-xl">🏅</span>
              <span>Ngôi Sao Giao Tiếp</span>
            </div>
          ) : (
            <p className="font-bold text-xs text-slate-400 py-2">
              Chưa có huy chương nào. Hãy hoàn thành Bài 1 để nhận huy chương đầu tiên nhé!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
