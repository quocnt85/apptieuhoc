import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { QuestionItem } from '../../types';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, Home, Lightbulb, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  question: QuestionItem;
  onClose: () => void;
}

export const InteractiveQuizPlayer: React.FC<Props> = ({ question, onClose }) => {
  const { answerQuestion, user } = useGameStore();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; xpEarned: number; gemsEarned: number } | null>(null);

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    const res = answerQuestion(question, selectedOptionId);
    setResult(res);
    setIsSubmitted(true);

    if (res.isCorrect) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#f59e0b', '#10b981', '#ec4899']
        });
      } catch (e) {
        // Fallback if confetti not supported
      }
    }
  };

  const selectedOption = question.options.find(o => o.id === selectedOptionId);

  return (
    <div className="fixed inset-0 z-50 bg-[#080c14]/95 backdrop-blur-md overflow-y-auto px-4 py-6 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              Lớp {question.gradeLevel} • {question.domainNameVi}
            </span>
          </div>
        </div>

        {/* Question Header Card */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>{question.subdomainNameVi}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-100 leading-snug">
            {question.title}
          </h2>

          {/* Situation Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-200 leading-relaxed">
            <div className="font-semibold text-indigo-300 text-xs mb-1 uppercase tracking-wider">Tình huống:</div>
            {question.situation}
          </div>

          {/* Character Dialogue Box */}
          {question.characterDialogue && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
              <div className="text-2xl">🦁</div>
              <div className="text-xs text-indigo-200 italic leading-relaxed pt-0.5">
                "{question.characterDialogue}"
              </div>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 px-1">LỰA CHỌN CỦA BÉ:</div>
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            let btnStyle = "bg-slate-900/80 border-slate-800 text-slate-200 hover:border-indigo-500/50";

            if (isSubmitted) {
              if (option.isCorrect) {
                btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-500/10";
              } else if (isSelected && !option.isCorrect) {
                btnStyle = "bg-rose-950/70 border-rose-500 text-rose-100";
              } else {
                btnStyle = "opacity-50 bg-slate-900 border-slate-800 text-slate-400";
              }
            } else if (isSelected) {
              btnStyle = "bg-indigo-950/80 border-indigo-400 text-indigo-100 shadow-md shadow-indigo-500/20 scale-[1.01]";
            }

            return (
              <button
                key={option.id}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3.5 ${btnStyle}`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 text-sm font-medium leading-relaxed">
                  {option.text}
                </div>
                {isSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Result & Pedagogical Advice Box */}
        {isSubmitted && result && (
          <div className={`rounded-3xl p-5 border-2 space-y-4 animate-slideUp ${
            result.isCorrect 
              ? 'bg-emerald-950/40 border-emerald-500/50' 
              : 'bg-amber-950/40 border-amber-500/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{result.isCorrect ? '🎉' : '💡'}</span>
                <span className={`font-extrabold text-base ${result.isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {result.isCorrect ? 'Tuyệt vời! Bé đã trả lời đúng' : 'Chưa chính xác rồi, cùng xem lời khuyên nhé'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-amber-300">+{result.xpEarned} XP</span>
                <span className="text-cyan-300">+{result.gemsEarned} 💎</span>
              </div>
            </div>

            {/* Explanation */}
            {selectedOption?.explanation && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {selectedOption.explanation}
              </p>
            )}

            {/* Core Advice */}
            <div className="flex items-start gap-2.5 text-xs text-indigo-200 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Lời khuyên của Chuyên gia: </span>
                {question.advice}
              </div>
            </div>

            {/* Real Life Task */}
            {question.realLifeTask && (
              <div className="flex items-start gap-2.5 text-xs text-emerald-200 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
                <Home className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-300">Nhiệm vụ thực hành cùng Bố Mẹ: </span>
                  {question.realLifeTask}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action CTA */}
      <div className="max-w-2xl mx-auto w-full pt-4 mt-4 border-t border-slate-800/80">
        {!isSubmitted ? (
          <button
            disabled={!selectedOptionId}
            onClick={handleSubmit}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all ${
              selectedOptionId
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 active:scale-98 btn-kid-3d'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Xác nhận câu trả lời
          </button>
        ) : (
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 btn-kid-3d flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Hoàn thành & Nhận thưởng</span>
          </button>
        )}
      </div>
    </div>
  );
};
