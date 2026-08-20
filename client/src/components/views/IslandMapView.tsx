import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Sparkles, Lock, CheckCircle2, Play, Star, Shield, Flame } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Props {
  onStartLessonZero: () => void;
}

export const IslandMapView: React.FC<Props> = ({ onStartLessonZero }) => {
  const { completedNodes } = useGameStore();
  const isNode1Completed = Boolean(completedNodes['island_1_node_1']);

  const handleStart = () => {
    interactionService.playTap();
    onStartLessonZero();
  };

  return (
    <div className="flex-1 p-4 sm:p-5 bg-gradient-to-b from-sky-100 via-teal-50 to-blue-50 relative overflow-y-auto flex flex-col items-center gap-4 pb-24 animate-fadeIn">
      
      {/* Island Title Banner */}
      <div className="w-full text-center pt-1">
        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-full shadow-md">
          <span>🏝️</span>
          <span>Đảo 1: Đảo Dũng Cảm & Tự Tin</span>
        </span>
      </div>

      {/* Node 1: Lesson Zero - Active Master Node */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        <div
          onClick={handleStart}
          className="w-full ns-card-3d p-5 text-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 bg-white border-3 border-blue-500 shadow-xl shadow-blue-500/25 relative overflow-hidden"
        >
          <div className="text-5xl mb-2 animate-bounce-slow">🌟</div>
          <h3 className="font-black text-base text-[#1e1b4b]">Bài 1: Lời Chào Ngôi Sao</h3>
          <p className="text-xs font-bold text-slate-500 my-1.5">Chào Hỏi Lịch Sự & Tự Tin</p>

          <div className="flex justify-center items-center gap-2 mt-3">
            <span className="bg-amber-100 text-amber-900 border-2 border-amber-300 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>3 Stars</span>
            </span>
            <span className={`font-black text-xs px-3 py-1 rounded-full border-2 shadow-sm ${
              isNode1Completed 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400' 
                : 'bg-blue-600 text-white border-blue-700 animate-pulse'
            }`}>
              {isNode1Completed ? '✅ Đã Hoàn Thành' : '🚀 Học Ngay'}
            </span>
          </div>
        </div>
      </div>

      {/* Connecting Line with Glow */}
      <div className="w-2 h-10 bg-gradient-to-b from-blue-400 to-teal-400 rounded-full shadow-sm" />

      {/* Node 2: Unlocked if Node 1 completed */}
      <div className={`w-full max-w-xs flex flex-col items-center gap-2 ${isNode1Completed ? 'opacity-100' : 'opacity-65'}`}>
        <div className="w-full ns-card-3d p-4 text-center bg-white border-2 border-slate-300 shadow-md">
          <div className="text-4xl mb-1.5">🛡️</div>
          <h3 className="font-black text-sm text-slate-800">Bài 2: Từ Chối Người Lạ</h3>
          <p className="text-xs font-bold text-slate-500 mt-1 flex items-center justify-center gap-1.5">
            {!isNode1Completed && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isNode1Completed ? '✨ Sẵn sàng mở bài' : 'Mở khóa khi xong Bài 1'}</span>
          </p>
        </div>
      </div>

      {/* Connecting Line */}
      <div className="w-2 h-10 bg-slate-300 rounded-full" />

      {/* Island Boss Node */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 opacity-60">
        <div className="w-full ns-card-3d p-4 text-center bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white border-2 border-indigo-700 shadow-lg">
          <div className="text-4xl mb-1.5">🐉</div>
          <h3 className="font-black text-sm text-yellow-300">Boss Đảo Dũng Cảm</h3>
          <p className="text-xs text-indigo-200 font-bold mt-1 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5 text-yellow-400" />
            <span>Cần 5 Ngôi Sao để mở khóa</span>
          </p>
        </div>
      </div>

    </div>
  );
};

