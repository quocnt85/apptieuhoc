import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Sparkles, Lock, CheckCircle2, Play, Star, Shield, Flame } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Props {
  onStartLessonZero: () => void;
}

export const IslandMapView: React.FC<Props> = ({ onStartLessonZero }) => {
  const { completedNodes, demoStyleMode } = useGameStore();
  const isNode1Completed = Boolean(completedNodes['island_1_node_1']);

  const handleStart = () => {
    interactionService.playTap();
    onStartLessonZero();
  };

  // 1. High-Gloss 3D Game Style
  if (demoStyleMode === 'gloss3d') {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 relative overflow-y-auto flex flex-col items-center gap-4 pb-24 animate-fadeIn select-none text-white">
        {/* Island Title Banner */}
        <div className="w-full text-center pt-1">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-full border-2 border-cyan-300 shadow-[0_4px_0_0_#075985,0_0_15px_rgba(6,182,212,0.5)]">
            <span className="text-base">🏝️</span>
            <span>Đảo 1: Đảo Dũng Cảm & Tự Tin</span>
          </span>
        </div>

        {/* Node 1: Lesson Zero - Active Master Node */}
        <div className="w-full max-w-xs flex flex-col items-center gap-2">
          <div
            onClick={handleStart}
            className="w-full p-5 text-center cursor-pointer transition-all duration-200 hover:scale-105 active:translate-y-1 bg-gradient-to-br from-slate-900/95 to-slate-950/95 border-3 border-cyan-400 shadow-[0_10px_0_0_#0e7490,0_15px_30px_rgba(6,182,212,0.4)] rounded-[28px] relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-[26px]" />
            <div className="text-5xl mb-2 animate-float filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">🌟</div>
            <h3 className="font-black text-base text-yellow-300 drop-shadow">Bài 1: Lời Chào Ngôi Sao</h3>
            <p className="text-xs font-bold text-slate-300 my-1.5">Chào Hỏi Lịch Sự & Tự Tin</p>

            <div className="flex justify-center items-center gap-2 mt-3">
              <span className="bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 border border-amber-200 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_2px_0_0_#78350f]">
                <Star className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
                <span>3 Stars</span>
              </span>
              <span className={`font-black text-xs px-3.5 py-1 rounded-full border-2 transition-all ${
                isNode1Completed 
                  ? 'bg-emerald-500 text-emerald-950 border-emerald-300 shadow-[0_2px_0_0_#065f46]' 
                  : 'bg-gradient-to-b from-cyan-400 to-blue-600 text-white border-cyan-200 shadow-[0_3px_0_0_#075985] animate-pulse'
              }`}>
                {isNode1Completed ? '✅ Đã Hoàn Thành' : '🚀 Học Ngay'}
              </span>
            </div>
          </div>
        </div>

        {/* Connecting Line with Glow */}
        <div className="w-2.5 h-10 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.6)]" />

        {/* Node 2 */}
        <div className={`w-full max-w-xs flex flex-col items-center gap-2 ${isNode1Completed ? 'opacity-100' : 'opacity-65'}`}>
          <div className="w-full p-4 text-center bg-slate-900 border-2 border-slate-700 shadow-[0_6px_0_0_#0f172a] rounded-[24px]">
            <div className="text-4xl mb-1.5">🛡️</div>
            <h3 className="font-black text-sm text-slate-300">Bài 2: Từ Chối Người Lạ</h3>
            <p className="text-xs font-bold text-slate-500 mt-1 flex items-center justify-center gap-1.5">
              {!isNode1Completed && <Lock className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isNode1Completed ? '✨ Sẵn sàng mở bài' : 'Mở khóa khi xong Bài 1'}</span>
            </p>
          </div>
        </div>

        {/* Connecting Line */}
        <div className="w-2.5 h-10 bg-slate-800 rounded-full" />

        {/* Boss Node */}
        <div className="w-full max-w-xs flex flex-col items-center gap-2 opacity-65">
          <div className="w-full p-5 text-center bg-gradient-to-br from-purple-950 to-indigo-950 text-white border-2 border-purple-500/60 shadow-[0_6px_0_0_#3b0764] rounded-[26px]">
            <div className="text-4xl mb-1.5 animate-bounce-slow">🐉</div>
            <h3 className="font-black text-sm text-yellow-300">Boss Đảo Dũng Cảm</h3>
            <p className="text-xs text-purple-300 font-bold mt-1 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-yellow-400" />
              <span>Cần 5 Ngôi Sao để mở khóa</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Playful Neo-Pop Style
  if (demoStyleMode === 'neopop') {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-[#fef9c3] relative overflow-y-auto flex flex-col items-center gap-4 pb-24 animate-fadeIn select-none text-slate-900">
        {/* Island Title Banner */}
        <div className="w-full text-center pt-1">
          <span className="inline-flex items-center gap-2 bg-[#fde047] text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-full border-3 border-slate-900 shadow-[4px_4px_0_0_#0f172a]">
            <span className="text-base">🏝️</span>
            <span>Đảo 1: Đảo Dũng Cảm & Tự Tin</span>
          </span>
        </div>

        {/* Node 1 */}
        <div className="w-full max-w-xs flex flex-col items-center gap-2">
          <div
            onClick={handleStart}
            className="w-full p-5 text-center cursor-pointer transition-all duration-200 hover:scale-105 active:translate-x-1 active:translate-y-1 bg-white border-3 border-slate-900 shadow-[6px_6px_0_0_#0f172a] rounded-[26px]"
          >
            <div className="text-5xl mb-2 animate-float">🌟</div>
            <h3 className="font-black text-base text-slate-900">Bài 1: Lời Chào Ngôi Sao</h3>
            <p className="text-xs font-bold text-slate-600 my-1.5">Chào Hỏi Lịch Sự & Tự Tin</p>

            <div className="flex justify-center items-center gap-2 mt-3">
              <span className="bg-[#fde047] text-slate-950 border-2 border-slate-900 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-[2px_2px_0_0_#0f172a]">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>3 Stars</span>
              </span>
              <span className={`font-black text-xs px-3.5 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] ${
                isNode1Completed ? 'bg-[#86efac] text-slate-950' : 'bg-[#fda4af] text-slate-950 animate-pulse'
              }`}>
                {isNode1Completed ? '✅ Đã Hoàn Thành' : '🚀 Học Ngay'}
              </span>
            </div>
          </div>
        </div>

        {/* Connecting Line */}
        <div className="w-2.5 h-10 bg-slate-900 rounded-full" />

        {/* Node 2 */}
        <div className={`w-full max-w-xs flex flex-col items-center gap-2 ${isNode1Completed ? 'opacity-100' : 'opacity-70'}`}>
          <div className="w-full p-4 text-center bg-white border-3 border-slate-900 shadow-[4px_4px_0_0_#0f172a] rounded-[22px]">
            <div className="text-4xl mb-1.5">🛡️</div>
            <h3 className="font-black text-sm text-slate-900">Bài 2: Từ Chối Người Lạ</h3>
            <p className="text-xs font-bold text-slate-600 mt-1 flex items-center justify-center gap-1.5">
              {!isNode1Completed && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isNode1Completed ? '✨ Sẵn sàng mở bài' : 'Mở khóa khi xong Bài 1'}</span>
            </p>
          </div>
        </div>

        {/* Connecting Line */}
        <div className="w-2.5 h-10 bg-slate-900 rounded-full" />

        {/* Boss Node */}
        <div className="w-full max-w-xs flex flex-col items-center gap-2 opacity-70">
          <div className="w-full p-5 text-center bg-[#c084fc] text-slate-950 border-3 border-slate-900 shadow-[5px_5px_0_0_#0f172a] rounded-[24px]">
            <div className="text-4xl mb-1.5">🐉</div>
            <h3 className="font-black text-sm text-slate-950">Boss Đảo Dũng Cảm</h3>
            <p className="text-xs text-slate-900 font-bold mt-1 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-900" />
              <span>Cần 5 Ngôi Sao để mở khóa</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Apple Arcade Glassmorphism Style
  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-b from-sky-100 via-indigo-50 to-pink-50 relative overflow-y-auto flex flex-col items-center gap-4 pb-24 animate-fadeIn select-none text-slate-900">
      {/* Island Title Banner */}
      <div className="w-full text-center pt-1">
        <span className="backdrop-blur-xl bg-white/80 border border-white text-indigo-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-[0_8px_20px_rgba(99,102,241,0.15)] inline-flex items-center gap-2">
          <span className="text-base">🏝️</span>
          <span>Đảo 1: Đảo Dũng Cảm & Tự Tin</span>
        </span>
      </div>

      {/* Node 1 */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2">
        <div
          onClick={handleStart}
          className="w-full backdrop-blur-2xl bg-white/80 border-2 border-white rounded-[32px] p-5 text-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_16px_40px_rgba(99,102,241,0.12)]"
        >
          <div className="text-5xl mb-2 animate-float">🌟</div>
          <h3 className="font-black text-base text-indigo-950">Bài 1: Lời Chào Ngôi Sao</h3>
          <p className="text-xs font-bold text-slate-500 my-1.5">Chào Hỏi Lịch Sự & Tự Tin</p>

          <div className="flex justify-center items-center gap-2 mt-3">
            <span className="bg-amber-100/90 text-amber-900 border border-amber-300 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>3 Stars</span>
            </span>
            <span className={`font-black text-xs px-3.5 py-1 rounded-full border shadow-sm ${
              isNode1Completed 
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-400 animate-pulse'
            }`}>
              {isNode1Completed ? '✅ Đã Hoàn Thành' : '🚀 Học Ngay'}
            </span>
          </div>
        </div>
      </div>

      {/* Connecting Line */}
      <div className="w-2.5 h-10 bg-gradient-to-b from-indigo-300 to-purple-300 rounded-full shadow-sm" />

      {/* Node 2 */}
      <div className={`w-full max-w-xs flex flex-col items-center gap-2 ${isNode1Completed ? 'opacity-100' : 'opacity-70'}`}>
        <div className="w-full backdrop-blur-xl bg-white/70 border border-white/80 rounded-[28px] p-4 text-center shadow-sm">
          <div className="text-4xl mb-1.5">🛡️</div>
          <h3 className="font-black text-sm text-slate-800">Bài 2: Từ Chối Người Lạ</h3>
          <p className="text-xs font-bold text-slate-500 mt-1 flex items-center justify-center gap-1.5">
            {!isNode1Completed && <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isNode1Completed ? '✨ Sẵn sàng mở bài' : 'Mở khóa khi xong Bài 1'}</span>
          </p>
        </div>
      </div>

      {/* Connecting Line */}
      <div className="w-2.5 h-10 bg-slate-300 rounded-full" />

      {/* Boss Node */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 opacity-65">
        <div className="w-full backdrop-blur-xl bg-indigo-950/85 text-white border border-indigo-500/50 rounded-[28px] p-5 text-center shadow-lg">
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

