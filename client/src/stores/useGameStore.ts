import { create } from 'zustand';
import { UserProfile, GameSettings, DomainId, DomainProgress, QuestionItem, ActiveTab } from '../types';
import { soundService } from '../services/audio';
import { DOMAINS_DATA, INITIAL_QUESTIONS } from '../data/mockQuestions';

interface GameState {
  user: UserProfile;
  settings: GameSettings;
  activeTab: ActiveTab;
  selectedDomain: DomainId | null;
  activeQuestion: QuestionItem | null;
  domainProgress: Record<DomainId, DomainProgress>;
  answeredHistory: Record<string, { isCorrect: boolean; selectedOptionId: string; timestamp: number }>;
  allQuestions: QuestionItem[];

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  selectDomain: (domainId: DomainId | null) => void;
  setActiveQuestion: (q: QuestionItem | null) => void;
  toggleSound: () => void;
  consumeEnergy: (amount?: number) => boolean;
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
  addGems: (amount: number) => void;
  answerQuestion: (question: QuestionItem, optionId: string) => { isCorrect: boolean; xpEarned: number; gemsEarned: number };
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const STORAGE_KEY = 'novastars_app_state_v1';

const defaultProgress: Record<DomainId, DomainProgress> = {
  'DOM-FIN': { domainId: 'DOM-FIN', masteryPercentage: 20, questionsAnswered: 1, totalQuestions: 5, streak: 1 },
  'DOM-SEL': { domainId: 'DOM-SEL', masteryPercentage: 35, questionsAnswered: 2, totalQuestions: 5, streak: 2 },
  'DOM-CRT': { domainId: 'DOM-CRT', masteryPercentage: 15, questionsAnswered: 1, totalQuestions: 5, streak: 1 },
  'DOM-DIG': { domainId: 'DOM-DIG', masteryPercentage: 40, questionsAnswered: 2, totalQuestions: 5, streak: 3 },
  'DOM-HAB': { domainId: 'DOM-HAB', masteryPercentage: 25, questionsAnswered: 1, totalQuestions: 5, streak: 2 },
};

export const useGameStore = create<GameState>((set, get) => ({
  user: {
    id: 'user_001',
    name: 'Bé Minh Triết',
    grade: 3,
    avatar: '🦁',
    level: 2,
    xp: 280,
    xpToNextLevel: 500,
    energy: 5,
    maxEnergy: 5,
    gems: 45,
    stars: 12,
    streakDays: 3,
    lastActiveDate: new Date().toISOString(),
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
    parentPin: '1234',
    dailyTimeLimitMinutes: 30,
    todayPlayedMinutes: 12,
  },
  activeTab: 'world',
  selectedDomain: null,
  activeQuestion: null,
  domainProgress: defaultProgress,
  answeredHistory: {},
  allQuestions: INITIAL_QUESTIONS,

  setActiveTab: (tab) => {
    soundService.playClick();
    set({ activeTab: tab });
  },

  selectDomain: (domainId) => {
    soundService.playClick();
    set({ selectedDomain: domainId });
  },

  setActiveQuestion: (q) => {
    set({ activeQuestion: q });
  },

  toggleSound: () => {
    const next = !get().settings.soundEnabled;
    soundService.setSoundEnabled(next);
    set((state) => ({
      settings: { ...state.settings, soundEnabled: next }
    }));
    if (next) soundService.playClick();
  },

  consumeEnergy: (amount = 1) => {
    const { energy } = get().user;
    if (energy >= amount) {
      set((state) => ({
        user: { ...state.user, energy: state.user.energy - amount }
      }));
      return true;
    }
    return false;
  },

  addXP: (amount) => {
    const { user } = get();
    let newXp = user.xp + amount;
    let newLevel = user.level;
    let newXpToNext = user.xpToNextLevel;
    let leveledUp = false;

    while (newXp >= newXpToNext) {
      newXp -= newXpToNext;
      newLevel += 1;
      newXpToNext = Math.round(newXpToNext * 1.5);
      leveledUp = true;
    }

    if (leveledUp) {
      soundService.playLevelUp();
    }

    set((state) => ({
      user: {
        ...state.user,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
      }
    }));

    return { leveledUp, newLevel };
  },

  addGems: (amount) => {
    soundService.playCoin();
    set((state) => ({
      user: { ...state.user, gems: state.user.gems + amount }
    }));
  },

  answerQuestion: (question, optionId) => {
    const selectedOpt = question.options.find((o) => o.id === optionId);
    const isCorrect = selectedOpt ? selectedOpt.isCorrect : false;

    let xpEarned = isCorrect ? 50 : 10;
    let gemsEarned = isCorrect ? 5 : 1;

    if (isCorrect) {
      soundService.playCorrect();
    } else {
      soundService.playWrong();
    }

    // Cập nhật XP và Gems
    get().addXP(xpEarned);
    if (gemsEarned > 0) get().addGems(gemsEarned);

    // Cập nhật Domain Progress
    set((state) => {
      const prevProg = state.domainProgress[question.domainId] || {
        domainId: question.domainId,
        masteryPercentage: 0,
        questionsAnswered: 0,
        totalQuestions: 5,
        streak: 0,
      };

      const newAnswered = prevProg.questionsAnswered + 1;
      const newStreak = isCorrect ? prevProg.streak + 1 : 0;
      const newMastery = Math.min(100, Math.round((newAnswered / prevProg.totalQuestions) * 100));

      return {
        domainProgress: {
          ...state.domainProgress,
          [question.domainId]: {
            ...prevProg,
            questionsAnswered: newAnswered,
            streak: newStreak,
            masteryPercentage: newMastery,
          }
        },
        answeredHistory: {
          ...state.answeredHistory,
          [question.id]: {
            isCorrect,
            selectedOptionId: optionId,
            timestamp: Date.now(),
          }
        }
      };
    });

    get().saveToLocalStorage();

    return { isCorrect, xpEarned, gemsEarned };
  },

  saveToLocalStorage: () => {
    try {
      const state = get();
      const payload = {
        user: state.user,
        settings: state.settings,
        domainProgress: state.domainProgress,
        answeredHistory: state.answeredHistory,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  },

  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        set((state) => ({
          ...state,
          user: { ...state.user, ...parsed.user },
          settings: { ...state.settings, ...parsed.settings },
          domainProgress: { ...state.domainProgress, ...parsed.domainProgress },
          answeredHistory: { ...state.answeredHistory, ...parsed.answeredHistory },
        }));
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
  },
}));
