import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Sparkles, Lock, CheckCircle2, Play } from 'lucide-react';

interface Props {
  onStartLessonZero: () => void;
}

export const IslandMapView: React.FC<Props> = ({ onStartLessonZero }) => {
  const { completedNodes } = useGameStore();
  const isNode1Completed = Boolean(completedNodes['island_1_node_1']);

  return (
    <div className="flex-1 p-5 bg-gradient-to-b from-sky-100 to-teal-50 relative overflow-y-auto flex flex-col items-center gap-4 pb-20 animate-fadeIn">
      
      {/* Island Title Banner */}
      <div className="w-full text-center py-2">
        <span className="inline-block bg-blue-600 text-white font-extrabold text-xs px-4 py-1.5 rounded-full shadow-sm">
          🏝️ Đảo 1: Đảo Dũng Cảm
        </span>
      </div>

      {/* Node 1: Lesson Zero */}
      <div className="flex flex-col items-center gap-2">
        <div
          onClick={onStartLessonZero}
          className="ns-card-3d p-4 w-64 text-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-98 bg-white border-blue-500 shadow-md shadow-blue-500/20"
        >
          <div className="text-4xl mb-1 animate-bounce-slow">🌟</div>
          <h3 className="font-black text-sm text-[#1e1b4b]">Bài 1: Lời Chào Ngôi Sao</h3>
          <p className="text-xs font-bold text-slate-500 my-1">Chào Hỏi Lịch Sự & Tự Tin</p>

          <div className="flex justify-center gap-2 mt-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full">
              ⭐ 3 Stars
            </span>
            <span className={`font-extrabold text-[10px] px-2.5 py-1 rounded-full border ${
              isNode1Completed 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
            }`}>
              {isNode1Completed ? '✅ Đã Học' : '🚀 Học Ngay'}
            </span>
          </div>
        </div>
      </div>

      {/* Connecting Line */}
      <div className="w-1.5 h-8 bg-blue-300 rounded-full" />

      {/* Node 2: Unlocked if Node 1 completed */}
      <div className={`flex flex-col items-center gap-2 ${isNode1Completed ? 'opacity-100' : 'opacity-60'}`}>
        <div className="ns-card-3d p-4 w-60 text-center bg-white border-slate-300">
          <div className="text-3xl mb-1">🛡️</div>
          <h3 className="font-extrabold text-xs text-slate-800">Bài 2: Từ Chối Người Lạ</h3>
          <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center justify-center gap-1">
            {!isNode1Completed && <Lock className="w-3 h-3" />}
            <span>{isNode1Completed ? 'Sẵn sàng học' : 'Mở khóa khi xong Bài 1'}</span>
          </p>
        </div>
      </div>

      {/* Connecting Line */}
      <div className="w-1.5 h-8 bg-slate-300 rounded-full" />

      {/* Island Boss Node */}
      <div className="flex flex-col items-center gap-2 opacity-50">
        <div className="ns-card-3d p-4 w-56 text-center bg-[#1e1b4b] text-white border-indigo-900">
          <div className="text-3xl mb-1">🐉</div>
          <h3 className="font-black text-xs text-yellow-300">Boss Đảo Dũng Cảm</h3>
          <p className="text-[10px] text-indigo-300 font-bold mt-1">🔒 Cần 5 Ngôi Sao Đảo</p>
        </div>
      </div>

    </div>
  );
};
