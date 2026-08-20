import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { DOMAINS_DATA } from '../../data/mockQuestions';
import { DomainId } from '../../types';
import { Sparkles, ChevronRight, Award, Flame, Play } from 'lucide-react';

interface Props {
  onStartLessonZero?: () => void;
}

export const WorldMap: React.FC<Props> = ({ onStartLessonZero }) => {
  const { 
    domainProgress, 
    selectDomain, 
    selectedDomain, 
    allQuestions, 
    setActiveQuestion, 
    answeredHistory, 
    consumeEnergy 
  } = useGameStore();

  const handleStartQuestion = (domainId: DomainId) => {
    // Tìm câu hỏi trong domain này chưa làm hoặc câu đầu tiên
    const domainQuestions = allQuestions.filter(q => q.domainId === domainId);
    if (domainQuestions.length === 0) return;

    const uncompleted = domainQuestions.find(q => !answeredHistory[q.id]);
    const targetQ = uncompleted || domainQuestions[0];

    const canPlay = consumeEnergy(1);
    if (!canPlay) {
      alert('⚡ Bé đã hết năng lượng rồi! Hãy nghỉ ngơi một chút hoặc đợi phụ huynh thưởng thêm nhé.');
      return;
    }

    setActiveQuestion(targetQ);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Featured Quest Banner: Gold Standard 10 Stages Lesson 0 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/60 via-purple-900/50 to-indigo-900/70 border-2 border-amber-400/40 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
              <span>⭐ Sứ Mệnh Đặc Biệt Chuẩn Vàng (10 Giai Đoạn)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Bài Học 0: Lời Chào Ngôi Sao & Tự Tin
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-xl">
              Cùng bé Su 👧 và Sao Nova 🌟 trải nghiệm hành trình 10 bước: Câu chuyện, 3 Mini-game kéo thả/ghép đôi, Đấu Boss công viên và nhận Huy chương 🏅!
            </p>
          </div>

          <button
            onClick={onStartLessonZero}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all btn-kid-3d shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Bắt Đầu Hành Trình 10 Bước</span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hành Trình Khám Phá Năng Lực 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Chào mừng bé đến với <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">NovaStars</span>!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Khám phá 5 Vùng Đất Kỹ Năng Sống diệu kỳ, vượt qua các thử thách thực tế để trở thành Nhà Thám Hiểm Thông Thái.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/60 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl">
              👑
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Tổng năng lực đạt được</div>
              <div className="text-base font-extrabold text-amber-400">Mastery Level 2 (27%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Domains Adventure Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>🗺️</span> 5 Vùng Đất Phiêu Lưu
          </h2>
          <span className="text-xs text-slate-400">Chọn 1 vùng đất để bắt đầu</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS_DATA.map((domain, index) => {
            const prog = domainProgress[domain.id] || { masteryPercentage: 0, streak: 0 };
            const domainQuestions = allQuestions.filter(q => q.domainId === domain.id);

            return (
              <div
                key={domain.id}
                className="group relative rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                {/* Top Badge & Domain Icon */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                    {domain.icon}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Streak {prog.streak}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-indigo-400 tracking-wide uppercase">
                    Vùng đất {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-0.5 group-hover:text-indigo-300 transition-colors">
                    {domain.nameVi}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-400">Tiến độ thành thục</span>
                    <span className="font-bold text-slate-200">{prog.masteryPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${prog.masteryPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Action CTA Button */}
                <button
                  onClick={() => handleStartQuestion(domain.id)}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all btn-kid-3d"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Khám phá ngay (Tiêu hao 1 ⚡)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
