import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { DOMAINS_DATA } from '../../data/mockQuestions';
import { ShieldCheck, Clock, Award, CheckCircle, TrendingUp, Sparkles, HeartHandshake } from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { user, settings, domainProgress } = useGameStore();

  const totalQuestionsDone = Object.values(domainProgress).reduce((acc, curr) => acc + curr.questionsAnswered, 0);
  const avgMastery = Math.round(
    Object.values(domainProgress).reduce((acc, curr) => acc + curr.masteryPercentage, 0) / DOMAINS_DATA.length
  );

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border border-purple-500/30 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Góc Đồng Hành Cùng Phụ Huynh</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Báo Cáo Năng Lực Của {user.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Theo dõi tiến độ phát triển 5 miền kỹ năng sống và gợi ý trò chuyện cùng bé mỗi ngày.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center min-w-[100px]">
              <div className="text-xs font-bold text-slate-400">Thời gian học</div>
              <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                {settings.todayPlayedMinutes}/{settings.dailyTimeLimitMinutes} p
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center min-w-[100px]">
              <div className="text-xs font-bold text-slate-400">Thành thục TB</div>
              <div className="text-lg font-black text-purple-400 font-mono mt-0.5">
                {avgMastery}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Domains Mastery Breakdown */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Phân Tích 5 Miền Năng Lực Cốt Lõi</span>
          </h2>
          <span className="text-xs text-slate-400">Đã hoàn thành {totalQuestionsDone} bài tập</span>
        </div>

        <div className="space-y-3">
          {DOMAINS_DATA.map((domain) => {
            const prog = domainProgress[domain.id] || { masteryPercentage: 0, streak: 0, questionsAnswered: 0 };
            return (
              <div key={domain.id} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{domain.icon}</span>
                    <span className="font-bold text-slate-200">{domain.nameVi}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-slate-400">{prog.questionsAnswered} câu</span>
                    <span className="text-purple-300 font-mono">{prog.masteryPercentage}%</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${prog.masteryPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items for Parents (Cầu nối Gia đình) */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 p-5 space-y-3">
        <h2 className="text-base font-bold text-indigo-300 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4" />
          <span>Gợi Ý Trò Chuyện & Thực Hành Gia Đình Hôm Nay</span>
        </h2>

        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <div className="text-xl">💰</div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-300">Về Tài chính: </span>
              Khi đi siêu thị, hãy cho bé cầm 20.000đ và nhờ bé chọn 1 món rau củ phù hợp với ngân sách.
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
            <div className="text-xl">❤️</div>
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-rose-300">Về Cảm xúc: </span>
              Hỏi bé: "Hôm nay điều gì ở trường làm con vui nhất và có điều gì làm con hơi bối rối không?".
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
