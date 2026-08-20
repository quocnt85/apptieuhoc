import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { DOMAINS_DATA } from '../../data/mockQuestions';
import { DomainId, QuestionItem } from '../../types';
import { Search, Filter, Sparkles, CheckCircle2, Play, BookOpen } from 'lucide-react';

export const QuestionExplorer: React.FC = () => {
  const { allQuestions, answeredHistory, setActiveQuestion, consumeEnergy } = useGameStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'ALL'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');

  const filteredQuestions = allQuestions.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.subdomainNameVi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomain = selectedDomain === 'ALL' || q.domainId === selectedDomain;
    const matchGrade = selectedGrade === 'ALL' || q.gradeLevel === selectedGrade;

    return matchSearch && matchDomain && matchGrade;
  });

  const handleStartQuestion = (q: QuestionItem) => {
    const canPlay = consumeEnergy(1);
    if (!canPlay) {
      alert('⚡ Bé đã hết năng lượng rồi! Hãy nghỉ ngơi một chút nhé.');
      return;
    }
    setActiveQuestion(q);
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>Thư Viện Ngân Hàng Câu Hỏi Kỹ Năng</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Duyệt và luyện tập các tình huống thực tế theo từng khối lớp và nhóm kỹ năng.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tình huống, kỹ năng sống..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDomain('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDomain === 'ALL'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất cả miền
          </button>
          {DOMAINS_DATA.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedDomain === d.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{d.icon}</span>
              <span>{d.nameVi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400">
          HIỂN THỊ {filteredQuestions.length} THỬ THÁCH
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredQuestions.map((q) => {
            const isDone = Boolean(answeredHistory[q.id]);
            const isCorrect = answeredHistory[q.id]?.isCorrect;

            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-black text-indigo-400">{q.subdomainNameVi}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
                      Lớp {q.gradeLevel}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-100 leading-snug">
                    {q.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {q.situation}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                  {isDone ? (
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCorrect ? 'Đã làm đúng' : 'Đã luyện tập'}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 font-bold">Chưa làm</span>
                  )}

                  <button
                    onClick={() => handleStartQuestion(q)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all ns-btn-3d ns-btn-primary"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Làm bài</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
