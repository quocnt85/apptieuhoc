import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { QuestionItem } from '../../types';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, Home, Lightbulb, Trophy } from 'lucide-react';
import { interactionService } from '../../services/interaction';
import confetti from 'canvas-confetti';

interface Props {
  question: QuestionItem;
  onClose: () => void;
}

export const InteractiveQuizPlayer: React.FC<Props> = ({ question, onClose }) => {
  const { answerQuestion } = useGameStore();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; xpEarned: number; gemsEarned: number } | null>(null);

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    interactionService.playSelect();
    setSelectedOptionId(optId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    const res = answerQuestion(question, selectedOptionId);
    setResult(res);
    setIsSubmitted(true);

    if (res.isCorrect) {
      interactionService.playSuccess();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#fbbf24', '#10b981', '#f43f5e']
        });
      } catch {}
    } else {
      interactionService.playError();
    }
  };

  const handleClose = () => {
    interactionService.playVictory();
    onClose();
  };

  const selectedOption = question.options.find(o => o.id === selectedOptionId);

  return (
    <div className="absolute inset-0 z-40 bg-[#080c14] text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Top Header with Safe Area */}
      <div className="sticky top-0 z-20 bg-[#080c14]/95 backdrop-blur-md border-b-2 border-slate-800 px-4 sm:px-6 pt-[max(0.85rem,var(--sat))] pb-3 shrink-0">
        <div className="w-full max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={() => { interactionService.playTap(); onClose(); }}
            aria-label="Quay lại"
            className="w-10 h-10 rounded-2xl bg-slate-800 border-2 border-slate-700 active:scale-90 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-black text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            Lớp {question.gradeLevel} • {question.domainNameVi}
          </span>
        </div>
      </div>

      {/* Question Content (Scrollable) */}
      <div className="w-full max-w-xl mx-auto flex-1 px-4 sm:px-6 py-4 overflow-y-auto space-y-4 animate-fadeIn">
        {/* Question Header Card */}
        <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-1.5 text-blue-400 font-black text-xs">
            <Sparkles className="w-4 h-4" />
            <span>{question.subdomainNameVi}</span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-white leading-snug">
            {question.title}
          </h2>

          {/* Situation Box */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            <div className="font-black text-indigo-400 text-xs mb-1 uppercase tracking-wider">Tình huống:</div>
            {question.situation}
          </div>

          {/* Character Dialogue Box */}
          {question.characterDialogue && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="text-2xl">🦁</div>
              <div className="text-xs text-indigo-200 italic leading-relaxed pt-0.5 font-bold">
                "{question.characterDialogue}"
              </div>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          <div className="text-xs font-black text-slate-400 px-1">CHỌN ĐÁP ÁN:</div>
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            let btnStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700";

            if (isSubmitted) {
              if (option.isCorrect) {
                btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-500/10";
              } else if (isSelected && !option.isCorrect) {
                btnStyle = "bg-rose-950/80 border-rose-500 text-rose-100";
              } else {
                btnStyle = "opacity-40 bg-slate-900 border-slate-800 text-slate-400";
              }
            } else if (isSelected) {
              btnStyle = "bg-indigo-950 border-indigo-400 text-indigo-100 shadow-md scale-[1.01]";
            }

            return (
              <button
                key={option.id}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full min-h-[56px] text-left p-3.5 rounded-2xl border-2 transition-all duration-150 flex items-center gap-3 active:scale-98 ${btnStyle}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 text-xs sm:text-sm font-bold leading-relaxed">
                  {option.text}
                </div>
                {isSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Result & Pedagogical Advice Box */}
        {isSubmitted && result && (
          <div className={`rounded-3xl p-4 sm:p-5 border-2 space-y-3.5 animate-slide-up-fade ${
            result.isCorrect 
              ? 'bg-emerald-950/50 border-emerald-500/60' 
              : 'bg-amber-950/50 border-amber-500/60'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{result.isCorrect ? '🎉' : '💡'}</span>
                <span className={`font-black text-sm sm:text-base ${result.isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {result.isCorrect ? 'Đúng rồi! Bé giỏi quá' : 'Chưa đúng, đọc lời khuyên nhé'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-black">
                <span className="text-amber-300">+{result.xpEarned} XP</span>
                <span className="text-cyan-300">+{result.gemsEarned} 💎</span>
              </div>
            </div>

            {/* Explanation */}
            {selectedOption?.explanation && (
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-medium">
                {selectedOption.explanation}
              </p>
            )}

            {/* Core Advice */}
            <div className="flex items-start gap-2 text-xs text-indigo-200 bg-indigo-950/50 p-3 rounded-xl border border-indigo-500/20 font-bold">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-300">Lời khuyên: </span>
                {question.advice}
              </div>
            </div>

            {/* Real Life Task */}
            {question.realLifeTask && (
              <div className="flex items-start gap-2 text-xs text-emerald-200 bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/20 font-bold">
                <Home className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-300">Việc ở nhà: </span>
                  {question.realLifeTask}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar (Thumb Zone with Safe Area) */}
      <div className="sticky bottom-0 z-20 bg-[#080c14]/95 backdrop-blur-md border-t-2 border-slate-800 px-4 sm:px-6 pt-3 pb-[max(0.85rem,var(--sab))] shrink-0">
        <div className="max-w-xl mx-auto w-full">
          {!isSubmitted ? (
            <button
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={`w-full min-h-[54px] py-3.5 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-95 ${
                selectedOptionId
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30 ns-btn-3d ns-btn-primary'
                  : 'bg-slate-800 text-slate-500 border-2 border-slate-700 cursor-not-allowed'
              }`}
            >
              Xác Nhận ✨
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="w-full min-h-[54px] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/30 active:scale-95 ns-btn-3d ns-btn-green flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              <span>Nhận Thưởng 🎁</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

