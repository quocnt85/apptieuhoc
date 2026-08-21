import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { LESSON_ZERO_DATA } from '../../data/lessonZeroData';
import { interactionService } from '../../services/interaction';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, ArrowUp, ArrowDown, Award, Trophy, Play } from 'lucide-react';
import { QuickDevBar } from '../dev/QuickDevBar';
import confetti from 'canvas-confetti';

interface Props {
  onClose: () => void;
}

export const TenStageLessonRunner: React.FC<Props> = ({ onClose }) => {
  const { addXP, addGems, addStars, completeLessonNode, instantCompleteCurrentLesson } = useGameStore();

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
  const matchedPairIds = React.useRef<Set<number>>(new Set());
  const selectedDragIds = React.useRef<Set<string>>(new Set());

  // Sequence Reorder State
  const [sequenceSteps, setSequenceSteps] = useState([
    { id: "s2", text: "Bước 2: Cất lời chào lịch sự (Chào bạn/Thầy cô)", correctOrder: 2 },
    { id: "s1", text: "Bước 1: Dừng lại, nhìn bạn và Mỉm Cười", correctOrder: 1 },
    { id: "s3", text: "Bước 3: Tự giới thiệu tên hoặc hỏi thăm ngắn", correctOrder: 3 },
  ]);
  const [selectedSwapIdx, setSelectedSwapIdx] = useState<number | null>(null);

  const stages = LESSON_ZERO_DATA.stages;
  const currentStage = stages[currentStageIndex];

  const handleNextStage = () => {
    interactionService.playTap();
    if (currentStageIndex + 1 < stages.length) {
      setCurrentStageIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleDevSkipStage = () => {
    if (currentStageIndex + 1 < stages.length) {
      setCurrentStageIndex(prev => prev + 1);
    } else {
      handlePosttestAnswer(0);
    }
  };

  const handleDevInstantComplete = () => {
    instantCompleteCurrentLesson();
    onClose();
  };

  // 1. Pretest
  const handlePretestSelect = (idx: number) => {
    setSelectedPretest(idx);
    const isCorrect = idx === 1;
    if (isCorrect) {
      interactionService.playSuccess();
      setTimeout(() => handleNextStage(), 150);
    } else {
      interactionService.playError();
    }
  };

  // 2. Story Decision
  const handleStoryDecision = (correct: boolean) => {
    if (correct) {
      interactionService.playSuccess();
      setTimeout(() => handleNextStage(), 150);
    } else {
      interactionService.playError();
    }
  };

  // 3. Drag & Drop Click
  const handleToggleDragItem = (id: string, isCorrect: boolean) => {
    if (isCorrect) {
      interactionService.playSuccess();
      selectedDragIds.current.add(id);
      setDragItemsState(prev => prev.map(item => selectedDragIds.current.has(item.id) ? { ...item, selected: true } : item));
      if (selectedDragIds.current.size >= 2) {
        setTimeout(() => handleNextStage(), 150);
      }
    } else {
      interactionService.playError();
    }
  };

  // 4. Matching Grid
  const handleSelectMatchLeft = (id: number) => {
    interactionService.playSelect();
    setMatchSelectedLeft(id);
    checkMatch(id, matchSelectedRight);
  };

  const handleSelectMatchRight = (id: number) => {
    interactionService.playSelect();
    setMatchSelectedRight(id);
    checkMatch(matchSelectedLeft, id);
  };

  const checkMatch = (left: number | null, right: number | null) => {
    if (left && right) {
      if (left === right) {
        interactionService.playSuccess();
        matchedPairIds.current.add(left);
        setMatchedPairs(Array.from(matchedPairIds.current));
        setMatchSelectedLeft(null);
        setMatchSelectedRight(null);
        if (matchedPairIds.current.size >= 3) {
          setTimeout(() => handleNextStage(), 150);
        }
      } else {
        interactionService.playError();
        setTimeout(() => {
          setMatchSelectedLeft(null);
          setMatchSelectedRight(null);
        }, 150);
      }
    }
  };

  // 5. Sequence Reorder (Arrow Up/Down + Tap-to-Swap)
  const moveSequenceStep = (index: number, direction: 'up' | 'down') => {
    interactionService.playSelect();
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sequenceSteps.length) return;
    const updated = [...sequenceSteps];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setSequenceSteps(updated);
  };

  const handleTapStepForSwap = (index: number) => {
    interactionService.playSelect();
    if (selectedSwapIdx === null) {
      setSelectedSwapIdx(index);
    } else if (selectedSwapIdx === index) {
      setSelectedSwapIdx(null);
    } else {
      const updated = [...sequenceSteps];
      const temp = updated[selectedSwapIdx];
      updated[selectedSwapIdx] = updated[index];
      updated[index] = temp;
      setSequenceSteps(updated);
      setSelectedSwapIdx(null);
    }
  };

  const verifySequence = () => {
    const isOrdered = sequenceSteps[0].correctOrder === 1 && sequenceSteps[1].correctOrder === 2 && sequenceSteps[2].correctOrder === 3;
    if (isOrdered) {
      interactionService.playSuccess();
      setTimeout(() => handleNextStage(), 150);
    } else {
      interactionService.playError();
    }
  };

  // 6. Boss Battle
  const handleBossChoice = (correct: boolean, damage: number) => {
    if (correct) {
      interactionService.playVictory();
      setBossHp(0);
      setTimeout(() => handleNextStage(), 750);
    } else {
      interactionService.playError();
      setBossHp(prev => Math.max(20, prev - damage));
    }
  };

  // 9. Parent Confirm
  const handleParentConfirm = () => {
    interactionService.playVictory();
    handleNextStage();
  };

  // 10. Posttest & Celebration
  const handlePosttestAnswer = (idx: number) => {
    if (idx === 0) {
      interactionService.playVictory();
      addXP(100);
      addGems(5);
      addStars(3);
      completeLessonNode('island_1_node_1');
      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#3b82f6', '#fbbf24', '#10b981', '#f43f5e', '#a855f7']
        });
      } catch {}
      setTimeout(() => handleNextStage(), 1600);
    } else {
      interactionService.playError();
    }
  };

  const progressPercentage = Math.round(((currentStageIndex + 1) / stages.length) * 100);

  return (
    <div data-testid="ten-stage-runner" className="absolute inset-0 z-50 bg-[#080c14] text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Dev Quick Action Bar */}
      <QuickDevBar
        onSkipStage={handleDevSkipStage}
        onInstantComplete={handleDevInstantComplete}
        currentStageIndex={currentStageIndex}
        totalStages={stages.length}
      />

      {/* Top Header & Stage Progress with Safe-Area Inset */}
      <div className="sticky top-0 z-20 bg-[#080c14]/95 backdrop-blur-md border-b-2 border-slate-800 px-4 sm:px-6 pt-[max(0.85rem,var(--sat))] pb-3 shrink-0">
        <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => { interactionService.playTap(); onClose(); }}
            aria-label="Thoát bài học"
            className="w-10 h-10 rounded-2xl bg-slate-800 border-2 border-slate-700 active:scale-90 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-black text-slate-300 mb-1.5">
              <span className="truncate">{LESSON_ZERO_DATA.competencyName}</span>
              <span className="text-amber-400 font-mono ml-2 shrink-0">Chặng {currentStageIndex + 1}/{stages.length}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Body Container with Scrollable Area */}
      <div className="w-full max-w-xl mx-auto flex-1 px-4 sm:px-6 py-4 overflow-y-auto flex flex-col justify-between animate-fadeIn">
        
        {/* Chặng 1: Thử tài */}
        {currentStage.type === 'pretest' && (
          <div className="space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black">
              <Sparkles className="w-4 h-4" />
              <span>Chặng 1: Thử tài</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {currentStage.questions?.[0].question}
            </h2>
            <div className="space-y-3 pt-2">
              {currentStage.questions?.[0].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePretestSelect(idx)}
                  className={`w-full min-h-[56px] p-4 rounded-2xl border-2 text-left text-sm font-bold transition-all active:scale-95 flex items-center justify-between ${
                    selectedPretest === idx
                      ? idx === 1 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-rose-950/80 border-rose-500 text-rose-200'
                      : 'bg-slate-900 border-slate-800 hover:border-blue-500 text-slate-200'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedPretest === idx && (idx === 1 ? '✅' : '❌')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chặng 2: Câu chuyện */}
        {currentStage.type === 'story' && (
          <div className="space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black">
              <span>📖 Chặng 2: Câu chuyện</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{currentStage.title}</h2>

            <div className="space-y-3">
              {currentStage.dialogues?.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-3xl p-2 rounded-2xl bg-slate-800 shrink-0">{d.avatar}</div>
                  <div>
                    <div className="font-black text-xs text-indigo-400 mb-0.5">{d.speaker}</div>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{d.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="text-xs font-black text-amber-300 mb-2">
                {currentStage.decision?.prompt}
              </div>
              <div className="space-y-2.5">
                {currentStage.decision?.choices.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStoryDecision(c.correct)}
                    className="w-full min-h-[52px] p-3.5 rounded-2xl bg-indigo-950/70 border-2 border-indigo-500/40 hover:bg-indigo-900/60 text-left text-xs sm:text-sm font-black text-indigo-200 transition-all active:scale-95 ns-btn-3d ns-btn-primary"
                  >
                    👉 {c.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chặng 3: Chọn hành động đúng */}
        {currentStage.type === 'minigame_drag' && (
          <div className="space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black">
              <span>🎮 Chặng 3: Chọn hành động đúng</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{currentStage.title}</h2>
            <p className="text-xs text-slate-300 font-medium">{currentStage.instruction}</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {dragItemsState.map((item) => (
                <button
                  key={item.id}
                  disabled={item.selected}
                  onClick={() => handleToggleDragItem(item.id, item.isCorrect)}
                  className={`min-h-[64px] p-4 rounded-2xl border-2 text-xs sm:text-sm font-black text-center transition-all flex items-center justify-center gap-1 active:scale-95 ${
                    item.selected
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 opacity-70'
                      : 'bg-slate-900 border-slate-800 text-slate-200 ns-btn-3d'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.selected && <span>✅</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chặng 4: Nối cặp */}
        {currentStage.type === 'minigame_match' && (
          <div className="space-y-3.5 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
              <span>🧩 Chặng 4: Nối cặp</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{currentStage.title}</h2>
            <p className="text-xs text-slate-300">{currentStage.instruction}</p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">TÌNH HUỐNG</div>
                {currentStage.pairs?.map((p) => {
                  const isMatched = matchedPairs.includes(p.id);
                  const isSelected = matchSelectedLeft === p.id;
                  return (
                    <button
                      key={p.id}
                      disabled={isMatched}
                      onClick={() => handleSelectMatchLeft(p.id)}
                      className={`w-full min-h-[54px] p-3 rounded-2xl border-2 text-xs font-black text-left transition-all active:scale-95 flex items-center justify-between ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 line-through opacity-50'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-105'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{p.left}</span>
                      {isMatched && '✅'}
                    </button>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <div className="text-[11px] font-black text-purple-400 uppercase tracking-wider">LỜI CHÀO</div>
                {currentStage.pairs?.map((p) => {
                  const isMatched = matchedPairs.includes(p.id);
                  const isSelected = matchSelectedRight === p.id;
                  return (
                    <button
                      key={p.id}
                      disabled={isMatched}
                      onClick={() => handleSelectMatchRight(p.id)}
                      className={`w-full min-h-[54px] p-3 rounded-2xl border-2 text-xs font-black text-left transition-all active:scale-95 flex items-center justify-between ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 line-through opacity-50'
                          : isSelected
                          ? 'bg-purple-600 border-purple-400 text-white shadow-lg scale-105'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{p.right}</span>
                      {isMatched && '✅'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chặng 5: Xếp thứ tự */}
        {currentStage.type === 'minigame_sequence' && (
          <div className="space-y-3.5 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black">
              <span>🔢 Chặng 5: Xếp thứ tự</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{currentStage.title}</h2>
            <p className="text-xs text-slate-300">Chạm thẻ để đổi chỗ hoặc dùng nút mũi tên nhé!</p>

            <div className="space-y-2.5 pt-1">
              {sequenceSteps.map((step, idx) => {
                const isSwapTarget = selectedSwapIdx === idx;
                return (
                  <div
                    key={step.id}
                    onClick={() => handleTapStepForSwap(idx)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSwapTarget
                        ? 'bg-indigo-950 border-indigo-400 shadow-lg scale-102'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 mr-2">
                      <span className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-400 text-blue-300 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black text-slate-200">{step.text}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        disabled={idx === 0}
                        onClick={() => moveSequenceStep(idx, 'up')}
                        aria-label="Di chuyển lên"
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 active:scale-90 disabled:opacity-20 flex items-center justify-center text-indigo-400"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                      <button
                        disabled={idx === sequenceSteps.length - 1}
                        onClick={() => moveSequenceStep(idx, 'down')}
                        aria-label="Di chuyển xuống"
                        className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 active:scale-90 disabled:opacity-20 flex items-center justify-center text-indigo-400"
                      >
                        <ArrowDown className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={verifySequence}
              className="w-full min-h-[54px] mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/30 active:scale-95 ns-btn-3d ns-btn-green"
            >
              Xác Nhận ✨
            </button>
          </div>
        )}

        {/* Chặng 6: Đấu Boss */}
        {currentStage.type === 'boss' && (
          <div className="space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black">
              <span>⚔️ Chặng 6: Đấu Boss</span>
            </div>
            
            {/* Boss HP Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-rose-900/60 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="text-xl">🐉</span> {currentStage.bossName}
                </span>
                <span className="text-rose-300 font-mono">HP: {bossHp}/100</span>
              </div>
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${bossHp}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm font-black text-slate-100 leading-relaxed">
              {currentStage.scenarios?.[0].question}
            </div>

            <div className="space-y-2.5">
              {currentStage.scenarios?.[0].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBossChoice(opt.correct, opt.hpDamage)}
                  className="w-full min-h-[52px] p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-800 active:bg-rose-950 active:border-rose-500 text-left text-xs sm:text-sm font-black text-slate-100 transition-all active:scale-95 ns-btn-3d flex items-center gap-2"
                >
                  <span>⚡</span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chặng 7: Bài học */}
        {currentStage.type === 'reflection' && (
          <div className="space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black">
              <span>💭 Chặng 7: Bài học</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{currentStage.question}</h2>
            <div className="space-y-2.5 pt-2">
              {currentStage.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => { interactionService.playSuccess(); handleNextStage(); }}
                  className="w-full min-h-[54px] p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-indigo-500 text-left text-xs sm:text-sm font-black text-indigo-200 transition-all active:scale-95 ns-btn-3d"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chặng 8: Việc tốt hôm nay */}
        {currentStage.type === 'challenge' && (
          <div className="space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black">
              <span>🎯 Chặng 8: Việc tốt hôm nay</span>
            </div>
            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/40 space-y-3 shadow-xl">
              <h2 className="text-lg sm:text-xl font-black text-amber-300">Việc Tốt Hôm Nay</h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-bold">
                {currentStage.missionText}
              </p>
              <div className="text-xs text-amber-200 bg-amber-950/70 p-3 rounded-2xl border border-amber-500/30 font-medium">
                💡 {currentStage.guideText}
              </div>
            </div>
            <button
              onClick={handleNextStage}
              className="w-full min-h-[54px] py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-blue-500/30 active:scale-95 ns-btn-3d ns-btn-primary"
            >
              Sẵn Sàng 🚀
            </button>
          </div>
        )}

        {/* Chặng 9: Bố mẹ duyệt */}
        {currentStage.type === 'parent_confirm' && (
          <div className="space-y-4 my-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black">
              <ShieldCheck className="w-4 h-4" />
              <span>Chặng 9: Bố mẹ duyệt</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900 border-2 border-purple-500/40 text-center space-y-3.5 shadow-xl">
              <div className="text-5xl animate-bounce-slow">👨‍👩‍👧</div>
              <h2 className="text-lg font-black text-white">Bố Mẹ Xác Nhận</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {currentStage.parentPrompt}
              </p>
              <button
                onClick={handleParentConfirm}
                className="w-full min-h-[54px] py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-purple-600/30 active:scale-95 ns-btn-3d ns-btn-purple"
              >
                Bố Mẹ Xác Nhận ✨
              </button>
            </div>
          </div>
        )}

        {/* Chặng 10: Nhận huy chương */}
        {currentStage.type === 'posttest' && (
          <div className="space-y-4 my-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
              <span>🏆 Chặng 10: Nhận huy chương</span>
            </div>
            <div className="text-6xl my-2 animate-bounce-slow">🏅</div>
            <h2 className="text-lg sm:text-xl font-black text-white">{currentStage.question}</h2>
            <div className="space-y-2.5 pt-2">
              {currentStage.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePosttestAnswer(idx)}
                  className="w-full min-h-[54px] p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 text-left text-xs sm:text-sm font-black text-slate-200 transition-all active:scale-95 ns-btn-3d"
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

