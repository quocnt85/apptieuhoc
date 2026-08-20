import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { LESSON_ZERO_DATA, LessonZeroStage } from '../../data/lessonZeroData';
import { soundService } from '../../services/audio';
import { ArrowLeft, Sparkles, CheckCircle2, XCircle, Heart, Trophy, ShieldCheck, HelpCircle, ArrowUp, ArrowDown, Award, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onClose: () => void;
}

export const TenStageLessonRunner: React.FC<Props> = ({ onClose }) => {
  const { addXP, addGems, user } = useGameStore();

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [bossHp, setBossHp] = useState(100);

  // States for mini-games
  const [selectedPretest, setSelectedPretest] = useState<number | null>(null);
  const [dragItemsState, setDragItemsState] = useState<{ id: string; label: string; isCorrect: boolean; selected: boolean }[]>([
    { id: "d1", label: "😊 Mỉm cười ấm áp", isCorrect: true, selected: false },
    { id: "d2", label: "👀 Nhìn thẳng mắt bạn", isCorrect: true, selected: false },
    { id: "d3", label: "😠 Nhăn mặt tức giận", isCorrect: false, selected: false },
    { id: "d4", label: "🙈 Quay lưng bỏ đi", isCorrect: false, selected: false },
  ]);

  const [matchSelectedLeft, setMatchSelectedLeft] = useState<number | null>(null);
  const [matchSelectedRight, setMatchSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  const [sequenceSteps, setSequenceSteps] = useState([
    { id: "s2", text: "Bước 2: Cất lời chào lịch sự (Chào bạn/Thầy cô)", correctOrder: 2 },
    { id: "s1", text: "Bước 1: Dừng lại, nhìn bạn và Mỉm Cười", correctOrder: 1 },
    { id: "s3", text: "Bước 3: Tự giới thiệu tên hoặc hỏi thăm ngắn", correctOrder: 3 },
  ]);

  const stages = LESSON_ZERO_DATA.stages;
  const currentStage = stages[currentStageIndex];

  const handleNextStage = () => {
    if (currentStageIndex + 1 < stages.length) {
      setCurrentStageIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  // 1. Pretest
  const handlePretestSelect = (idx: number) => {
    setSelectedPretest(idx);
    const isCorrect = idx === 1;
    if (isCorrect) {
      soundService.playCorrect();
      setTimeout(() => handleNextStage(), 600);
    } else {
      soundService.playWrong();
    }
  };

  // 2. Story Decision
  const handleStoryDecision = (correct: boolean) => {
    if (correct) {
      soundService.playCorrect();
      setTimeout(() => handleNextStage(), 500);
    } else {
      soundService.playWrong();
    }
  };

  // 3. Drag & Drop Click
  const handleToggleDragItem = (id: string, isCorrect: boolean) => {
    if (isCorrect) {
      soundService.playCorrect();
      setDragItemsState(prev => prev.map(item => item.id === id ? { ...item, selected: true } : item));
      const remainingCorrect = dragItemsState.filter(i => i.isCorrect && i.id !== id && !i.selected).length;
      if (remainingCorrect === 0) {
        setTimeout(() => handleNextStage(), 600);
      }
    } else {
      soundService.playWrong();
    }
  };

  // 4. Matching Grid
  const handleSelectMatchLeft = (id: number) => {
    soundService.playClick();
    setMatchSelectedLeft(id);
    checkMatch(id, matchSelectedRight);
  };

  const handleSelectMatchRight = (id: number) => {
    soundService.playClick();
    setMatchSelectedRight(id);
    checkMatch(matchSelectedLeft, id);
  };

  const checkMatch = (left: number | null, right: number | null) => {
    if (left && right) {
      if (left === right) {
        soundService.playCorrect();
        setMatchedPairs(prev => [...prev, left]);
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
        if (matchedPairs.length + 1 >= 3) {
          setTimeout(() => handleNextStage(), 600);
        }
      } else {
        soundService.playWrong();
        setTimeout(() => {
          setMatchSelectedLeft(null);
          setMatchSelectedRight(null);
        }, 500);
      }
    }
  };

  // 5. Sequence Reorder
  const moveSequenceStep = (index: number, direction: 'up' | 'down') => {
    soundService.playClick();
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sequenceSteps.length) return;
    const updated = [...sequenceSteps];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setSequenceSteps(updated);
  };

  const verifySequence = () => {
    const isOrdered = sequenceSteps[0].correctOrder === 1 && sequenceSteps[1].correctOrder === 2 && sequenceSteps[2].correctOrder === 3;
    if (isOrdered) {
      soundService.playCorrect();
      handleNextStage();
    } else {
      soundService.playWrong();
      alert('Thứ tự chưa đúng rồi, hãy nhớ: 1. Mỉm cười -> 2. Lời chào -> 3. Tự giới thiệu tên nhé!');
    }
  };

  // 6. Boss Battle
  const handleBossChoice = (correct: boolean, damage: number) => {
    if (correct) {
      soundService.playLevelUp();
      setBossHp(0);
      setTimeout(() => handleNextStage(), 700);
    } else {
      soundService.playWrong();
      setBossHp(prev => Math.max(20, prev - damage));
    }
  };

  // 9. Parent Confirm
  const handleParentConfirm = () => {
    soundService.playLevelUp();
    handleNextStage();
  };

  // 10. Posttest & Celebration
  const handlePosttestAnswer = (idx: number) => {
    if (idx === 0) {
      soundService.playLevelUp();
      addXP(100);
      addGems(5);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#6366f1', '#fbbf24', '#10b981', '#f43f5e']
        });
      } catch (e) {}
      setTimeout(() => handleNextStage(), 1500);
    } else {
      soundService.playWrong();
    }
  };

  const progressPercentage = Math.round(((currentStageIndex + 1) / stages.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#080c14] text-slate-100 flex flex-col justify-between overflow-y-auto">
      {/* Top Header & Stage Progress */}
      <div className="sticky top-0 z-10 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thoát</span>
          </button>

          <div className="flex-1 max-w-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
              <span>{LESSON_ZERO_DATA.competencyName}</span>
              <span className="text-indigo-400 font-mono">Màn {currentStageIndex + 1}/{stages.length}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Body Container */}
      <div className="max-w-2xl mx-auto w-full flex-1 px-4 py-6 flex flex-col justify-center animate-fadeIn">
        
        {/* Stage 1: Pretest */}
        {currentStage.type === 'pretest' && (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Giai Đoạn 1: Đánh Giá Ban Đầu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {currentStage.questions?.[0].question}
            </h2>
            <div className="space-y-2.5 pt-2">
              {currentStage.questions?.[0].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePretestSelect(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all ${
                    selectedPretest === idx
                      ? idx === 1 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-rose-950/80 border-rose-500 text-rose-200'
                      : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage 2: Story */}
        {currentStage.type === 'story' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
              <span>📖 Giai Đoạn 2: Câu Chuyện Phiêu Lưu</span>
            </div>
            <h2 className="text-xl font-black text-white">{currentStage.title}</h2>

            <div className="space-y-3">
              {currentStage.dialogues?.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                  <div className="text-3xl p-2 rounded-2xl bg-slate-800/80 shrink-0">{d.avatar}</div>
                  <div>
                    <div className="font-bold text-xs text-indigo-400 mb-0.5">{d.speaker}</div>
                    <div className="text-sm text-slate-200 leading-relaxed">{d.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <div className="text-xs font-bold text-amber-300 mb-2">
                {currentStage.decision?.prompt}
              </div>
              <div className="space-y-2">
                {currentStage.decision?.choices.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStoryDecision(c.correct)}
                    className="w-full p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 hover:bg-indigo-900/60 text-left text-xs sm:text-sm font-bold text-indigo-200 transition-all btn-kid-3d"
                  >
                    👉 {c.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Minigame Drag/Click */}
        {currentStage.type === 'minigame_drag' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
              <span>🎮 Giai Đoạn 3: Trò Chơi 1</span>
            </div>
            <h2 className="text-xl font-black text-white">{currentStage.title}</h2>
            <p className="text-xs text-slate-400">{currentStage.instruction}</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {dragItemsState.map((item) => (
                <button
                  key={item.id}
                  disabled={item.selected}
                  onClick={() => handleToggleDragItem(item.id, item.isCorrect)}
                  className={`p-4 rounded-2xl border-2 text-sm font-bold text-center transition-all ${
                    item.selected
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 opacity-60'
                      : 'bg-slate-900 border-slate-800 hover:border-cyan-500/60 text-slate-200 active:scale-95'
                  }`}
                >
                  {item.label}
                  {item.selected && ' ✅'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage 4: Minigame Matching */}
        {currentStage.type === 'minigame_match' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <span>🧩 Giai Đoạn 4: Trò Chơi 2</span>
            </div>
            <h2 className="text-xl font-black text-white">{currentStage.title}</h2>
            <p className="text-xs text-slate-400">{currentStage.instruction}</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400">HOÀN CẢNH</div>
                {currentStage.pairs?.map((p) => {
                  const isMatched = matchedPairs.includes(p.id);
                  const isSelected = matchSelectedLeft === p.id;
                  return (
                    <button
                      key={p.id}
                      disabled={isMatched}
                      onClick={() => handleSelectMatchLeft(p.id)}
                      className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 line-through opacity-50'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {p.left}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400">LỜI CHÀO</div>
                {currentStage.pairs?.map((p) => {
                  const isMatched = matchedPairs.includes(p.id);
                  const isSelected = matchSelectedRight === p.id;
                  return (
                    <button
                      key={p.id}
                      disabled={isMatched}
                      onClick={() => handleSelectMatchRight(p.id)}
                      className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 line-through opacity-50'
                          : isSelected
                          ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {p.right}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Stage 5: Minigame Sequence */}
        {currentStage.type === 'minigame_sequence' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
              <span>🔢 Giai Đoạn 5: Trò Chơi 3</span>
            </div>
            <h2 className="text-xl font-black text-white">{currentStage.title}</h2>
            <p className="text-xs text-slate-400">{currentStage.instruction}</p>

            <div className="space-y-2.5 pt-2">
              {sequenceSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-bold text-slate-200">{step.text}</span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveSequenceStep(idx, 'up')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      disabled={idx === sequenceSteps.length - 1}
                      onClick={() => moveSequenceStep(idx, 'down')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4 text-indigo-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={verifySequence}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 btn-kid-3d"
            >
              Xác Nhận Thứ Tự 3 Bước
            </button>
          </div>
        )}

        {/* Stage 6: Boss Battle */}
        {currentStage.type === 'boss' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
              <span>⚔️ Giai Đoạn 6: Thử Thách Boss</span>
            </div>
            
            {/* Boss HP Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-400">{currentStage.bossName}</span>
                <span className="text-rose-300 font-mono">HP: {bossHp}/100</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${bossHp}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm font-bold text-slate-200">
              {currentStage.scenarios?.[0].question}
            </div>

            <div className="space-y-2">
              {currentStage.scenarios?.[0].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBossChoice(opt.correct, opt.hpDamage)}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/60 text-left text-xs sm:text-sm font-bold text-slate-200 transition-all btn-kid-3d"
                >
                  ⚡ {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage 7: Reflection */}
        {currentStage.type === 'reflection' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              <span>💭 Giai Đoạn 7: Phản Tư & Bài Học</span>
            </div>
            <h2 className="text-xl font-black text-white">{currentStage.question}</h2>
            <div className="space-y-2.5 pt-2">
              {currentStage.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => { soundService.playCorrect(); handleNextStage(); }}
                  className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 text-left text-sm font-bold text-indigo-200 transition-all btn-kid-3d"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage 8: Real Life Challenge */}
        {currentStage.type === 'challenge' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
              <span>🎯 Giai Đoạn 8: Nhiệm Vụ Thực Tế</span>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 space-y-4">
              <h2 className="text-xl font-black text-amber-300">Nhiệm Vụ Hôm Nay Của Bé</h2>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {currentStage.missionText}
              </p>
              <div className="text-xs text-amber-200 bg-amber-950/60 p-3 rounded-xl border border-amber-500/20">
                💡 {currentStage.guideText}
              </div>
            </div>
            <button
              onClick={handleNextStage}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 btn-kid-3d"
            >
              Em Sẵn Sàng Thực Hành!
            </button>
          </div>
        )}

        {/* Stage 9: Parent Confirmation */}
        {currentStage.type === 'parent_confirm' && (
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Giai Đoạn 9: Góc Phụ Huynh</span>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/40 text-center space-y-4">
              <div className="text-4xl">👨‍👩‍👧</div>
              <h2 className="text-lg font-black text-white">Xác Nhận Năng Lực Của Bé</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStage.parentPrompt}
              </p>
              <button
                onClick={handleParentConfirm}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 btn-kid-3d"
              >
                {currentStage.confirmButtonText}
              </button>
            </div>
          </div>
        )}

        {/* Stage 10: Posttest & Reward */}
        {currentStage.type === 'posttest' && (
          <div className="space-y-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <span>🏆 Giai Đoạn 10: Nhận Huy Chương</span>
            </div>
            <h2 className="text-xl font-black text-white">{currentStage.question}</h2>
            <div className="space-y-2.5 pt-2">
              {currentStage.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePosttestAnswer(idx)}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-left text-sm font-bold text-slate-200 transition-all btn-kid-3d"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
