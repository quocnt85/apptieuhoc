import { create } from 'zustand';
import { UserProfile, GameSettings, DomainId, DomainProgress, QuestionItem, ActiveTab, PlanetCoordinateNode } from '../types';
import { soundService } from '../services/audio';
import { DOMAINS_DATA, INITIAL_QUESTIONS } from '../data/mockQuestions';
import { PLANETS_DATA } from '../data/planetsData';

interface GameState {
  user: UserProfile;
  settings: GameSettings;
  activeTab: ActiveTab;
  hasSeenFTUE: boolean;
  completedNodes: Record<string, boolean>;
  nodeStars: Record<string, number>; // Stars achieved per node (1-3)
  selectedDomain: DomainId | null;
  activeQuestion: QuestionItem | null;
  domainProgress: Record<DomainId, DomainProgress>;
  answeredHistory: Record<string, { isCorrect: boolean; selectedOptionId: string; timestamp: number }>;
  allQuestions: QuestionItem[];

  // 3D Space Navigation State
  activePlanetId: string;
  selectedCoordinateNode: PlanetCoordinateNode | null;
  isFlyingToNode: boolean;
  flightProgress: number; // 0 to 1

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setFTUESeen: () => void;
  completeLessonNode: (nodeId: string, starsEarned?: number) => void;
  selectDomain: (domainId: DomainId | null) => void;
  setActiveQuestion: (q: QuestionItem | null) => void;
  toggleSound: () => void;

  // Energy & Timer System
  refreshEnergy: () => void;
  consumeEnergyForNode: (nodeId: string, isBoss?: boolean) => { success: boolean; cost: number; reason?: string };
  addNovaCoins: (amount: number) => void;
  addDiamonds: (amount: number) => void;
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
  addStars: (amount: number) => void;

  // Customization & Shop
  equipShip: (shipId: string) => void;
  buyShip: (shipId: string, priceCoins: number) => boolean;
  equipColor: (colorHex: string) => void;
  buyColor: (colorHex: string, priceCoins: number) => boolean;
  toggleVietnamFlag: () => void;
  equipAvatar: (avatarEmoji: string) => void;
  buyBooster: (type: 'double_regen' | 'boss_pass' | 'instant_refuel', costDiamonds: number) => boolean;

  // 3D Navigation
  selectPlanet: (planetId: string) => void;
  startFlyingToCoordinate: (node: PlanetCoordinateNode) => void;
  finishFlyingToCoordinate: () => void;
  closeCoordinateModal: () => void;

  // Lesson Runner
  isLessonRunning: boolean;
  activeLessonId: string | null;
  startLesson: (lessonId: string) => void;
  closeLesson: () => void;

  // Legacy support
  demoStyleMode?: string;
  addGems: (amount: number) => void;
  consumeEnergy: (amount?: number) => boolean;
  answerQuestion: (question: QuestionItem, optionId: string) => { isCorrect: boolean; xpEarned: number; gemsEarned: number };

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const STORAGE_KEY = 'novastars_space_state_v2';

const defaultProgress: Record<DomainId, DomainProgress> = {
  'DOM-FIN': { domainId: 'DOM-FIN', masteryPercentage: 20, questionsAnswered: 1, totalQuestions: 5, streak: 1 },
  'DOM-SEL': { domainId: 'DOM-SEL', masteryPercentage: 35, questionsAnswered: 2, totalQuestions: 5, streak: 2 },
  'DOM-CRT': { domainId: 'DOM-CRT', masteryPercentage: 15, questionsAnswered: 1, totalQuestions: 5, streak: 1 },
  'DOM-DIG': { domainId: 'DOM-DIG', masteryPercentage: 40, questionsAnswered: 2, totalQuestions: 5, streak: 3 },
  'DOM-HAB': { domainId: 'DOM-HAB', masteryPercentage: 25, questionsAnswered: 1, totalQuestions: 5, streak: 2 },
};

const initialUser: UserProfile = {
  id: 'user_001',
  name: 'Phi Hành Gia Nhí',
  grade: 3,
  avatar: '🚀',
  level: 1,
  xp: 150,
  xpToNextLevel: 300,
  energy: 50,
  maxEnergy: 50,
  lastEnergyTimestamp: Date.now(),
  novaCoins: 350,
  diamonds: 45,
  gems: 45,
  stars: 3,
  streakDays: 3,
  lastActiveDate: new Date().toISOString(),
  freeBossPassCount: 1,
  customization: {
    equippedShip: 'explorer_v1',
    equippedColor: '#38bdf8',
    hasVietnamFlag: true,
    unlockedShips: ['explorer_v1'],
    unlockedColors: ['#38bdf8', '#f59e0b'],
    unlockedAccessories: ['flag_vn'],
    unlockedAvatars: ['🚀', '👧', '👦', '🤖', '🦊', '⭐'],
  },
};

export const useGameStore = create<GameState>((set, get) => ({
  user: initialUser,
  hasSeenFTUE: false,
  completedNodes: {},
  nodeStars: {},
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    hapticEnabled: true,
    parentPin: '1234',
    dailyTimeLimitMinutes: 30,
    todayPlayedMinutes: 12,
  },
  activeTab: 'home',
  selectedDomain: null,
  activeQuestion: null,
  domainProgress: defaultProgress,
  answeredHistory: {},
  allQuestions: INITIAL_QUESTIONS,

  // 3D Space Navigation State
  activePlanetId: 'bravery_prime',
  selectedCoordinateNode: null,
  isFlyingToNode: false,
  flightProgress: 0,

  // Lesson Runner State
  isLessonRunning: false,
  activeLessonId: null,
  startLesson: (lessonId: string) => {
    set({ isLessonRunning: true, activeLessonId: lessonId, selectedCoordinateNode: null });
  },
  closeLesson: () => {
    set({ isLessonRunning: false, activeLessonId: null });
  },

  setActiveTab: (tab) => {
    soundService.playClick();
    get().refreshEnergy();
    set({ activeTab: tab });
  },

  setFTUESeen: () => {
    set({ hasSeenFTUE: true });
    get().saveToLocalStorage();
  },

  refreshEnergy: () => {
    const { user } = get();
    if (user.energy >= user.maxEnergy) {
      set((state) => ({
        user: { ...state.user, lastEnergyTimestamp: Date.now() }
      }));
      return;
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - user.lastEnergyTimestamp) / 1000);
    const isDoubleRegen = user.doubleRegenUntil ? user.doubleRegenUntil > now : false;
    const secondsPerUnit = isDoubleRegen ? 30 : 60;

    const unitsToAdd = Math.floor(elapsedSeconds / secondsPerUnit);
    if (unitsToAdd > 0) {
      const newEnergy = Math.min(user.maxEnergy, user.energy + unitsToAdd);
      const remainingSeconds = elapsedSeconds % secondsPerUnit;
      set((state) => ({
        user: {
          ...state.user,
          energy: newEnergy,
          lastEnergyTimestamp: now - (remainingSeconds * 1000),
        }
      }));
      get().saveToLocalStorage();
    }
  },

  consumeEnergyForNode: (nodeId: string, isBoss = false) => {
    get().refreshEnergy();
    const { user, completedNodes } = get();
    const isFirstTry = !completedNodes[nodeId];

    // First attempt is free!
    if (isFirstTry) {
      return { success: true, cost: 0 };
    }

    // Boss battle logic
    if (isBoss) {
      if (user.freeBossPassCount > 0) {
        set((state) => ({
          user: { ...state.user, freeBossPassCount: state.user.freeBossPassCount - 1 }
        }));
        get().saveToLocalStorage();
        return { success: true, cost: 0, reason: 'Sử dụng Vé Boss Miễn Phí!' };
      }
      if (user.energy < 20) {
        return { success: false, cost: 20, reason: 'Không đủ năng lượng! Đấu Boss cần 20 Năng Lượng ⚡' };
      }
      set((state) => ({
        user: { ...state.user, energy: state.user.energy - 20, lastEnergyTimestamp: Date.now() }
      }));
      get().saveToLocalStorage();
      return { success: true, cost: 20 };
    }

    // Replaying regular lesson node
    if (user.energy < 10) {
      return { success: false, cost: 10, reason: 'Không đủ năng lượng! Chơi lại cần 10 Năng Lượng ⚡' };
    }

    set((state) => ({
      user: { ...state.user, energy: state.user.energy - 10, lastEnergyTimestamp: Date.now() }
    }));
    get().saveToLocalStorage();
    return { success: true, cost: 10 };
  },

  completeLessonNode: (nodeId: string, starsEarned = 3) => {
    const currentPlanet = PLANETS_DATA.find((p) => p.id === get().activePlanetId);
    const node = currentPlanet?.nodes.find((n) => n.id === nodeId);
    const coinsBonus = node?.rewardCoins || 50;
    const xpBonus = node?.rewardXp || 100;

    set((state) => {
      const prevStars = state.nodeStars[nodeId] || 0;
      const newStarsTotal = starsEarned > prevStars ? state.user.stars + (starsEarned - prevStars) : state.user.stars;

      return {
        completedNodes: { ...state.completedNodes, [nodeId]: true },
        nodeStars: { ...state.nodeStars, [nodeId]: Math.max(prevStars, starsEarned) },
        user: {
          ...state.user,
          stars: newStarsTotal,
          novaCoins: state.user.novaCoins + coinsBonus,
          xp: state.user.xp + xpBonus,
        },
      };
    });
    get().saveToLocalStorage();
  },

  addNovaCoins: (amount: number) => {
    soundService.playCoin();
    set((state) => ({
      user: { ...state.user, novaCoins: state.user.novaCoins + amount }
    }));
    get().saveToLocalStorage();
  },

  addDiamonds: (amount: number) => {
    soundService.playCoin();
    set((state) => ({
      user: { ...state.user, diamonds: state.user.diamonds + amount, gems: state.user.gems + amount }
    }));
    get().saveToLocalStorage();
  },

  addGems: (amount: number) => {
    get().addDiamonds(amount);
  },

  consumeEnergy: (amount = 1) => {
    const { user } = get();
    if (user.energy < amount) return false;
    set((state) => ({
      user: { ...state.user, energy: state.user.energy - amount, lastEnergyTimestamp: Date.now() }
    }));
    get().saveToLocalStorage();
    return true;
  },

  answerQuestion: (question: QuestionItem, optionId: string) => {
    const opt = question.options.find((o) => o.id === optionId);
    const isCorrect = Boolean(opt?.isCorrect);
    const xpEarned = isCorrect ? 50 : 10;
    const gemsEarned = isCorrect ? 5 : 1;

    get().addXP(xpEarned);
    get().addDiamonds(gemsEarned);
    return { isCorrect, xpEarned, gemsEarned };
  },

  addStars: (amount: number) => {
    soundService.playCoin();
    set((state) => ({
      user: { ...state.user, stars: state.user.stars + amount }
    }));
    get().saveToLocalStorage();
  },

  addXP: (amount: number) => {
    const { user } = get();
    let newXp = user.xp + amount;
    let newLevel = user.level;
    let xpToNext = user.xpToNextLevel;
    let leveledUp = false;

    while (newXp >= xpToNext) {
      newXp -= xpToNext;
      newLevel += 1;
      xpToNext = Math.round(xpToNext * 1.5);
      leveledUp = true;
    }

    set((state) => ({
      user: {
        ...state.user,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: xpToNext,
      }
    }));
    get().saveToLocalStorage();
    return { leveledUp, newLevel };
  },

  // Customization & Shop
  equipShip: (shipId: string) => {
    soundService.playClick();
    set((state) => ({
      user: {
        ...state.user,
        customization: { ...state.user.customization, equippedShip: shipId }
      }
    }));
    get().saveToLocalStorage();
  },

  buyShip: (shipId: string, priceCoins: number) => {
    const { user } = get();
    if (user.novaCoins < priceCoins) return false;

    soundService.playVictory();
    set((state) => ({
      user: {
        ...state.user,
        novaCoins: state.user.novaCoins - priceCoins,
        customization: {
          ...state.user.customization,
          unlockedShips: [...state.user.customization.unlockedShips, shipId],
          equippedShip: shipId,
        }
      }
    }));
    get().saveToLocalStorage();
    return true;
  },

  equipColor: (colorHex: string) => {
    soundService.playClick();
    set((state) => ({
      user: {
        ...state.user,
        customization: { ...state.user.customization, equippedColor: colorHex }
      }
    }));
    get().saveToLocalStorage();
  },

  buyColor: (colorHex: string, priceCoins: number) => {
    const { user } = get();
    if (user.novaCoins < priceCoins) return false;

    soundService.playVictory();
    set((state) => ({
      user: {
        ...state.user,
        novaCoins: state.user.novaCoins - priceCoins,
        customization: {
          ...state.user.customization,
          unlockedColors: [...state.user.customization.unlockedColors, colorHex],
          equippedColor: colorHex,
        }
      }
    }));
    get().saveToLocalStorage();
    return true;
  },

  toggleVietnamFlag: () => {
    soundService.playClick();
    set((state) => ({
      user: {
        ...state.user,
        customization: {
          ...state.user.customization,
          hasVietnamFlag: !state.user.customization.hasVietnamFlag,
        }
      }
    }));
    get().saveToLocalStorage();
  },

  equipAvatar: (avatarEmoji: string) => {
    soundService.playClick();
    set((state) => ({
      user: { ...state.user, avatar: avatarEmoji }
    }));
    get().saveToLocalStorage();
  },

  buyBooster: (type: 'double_regen' | 'boss_pass' | 'instant_refuel', costDiamonds: number) => {
    const { user } = get();
    if (user.diamonds < costDiamonds) return false;

    soundService.playVictory();
    const now = Date.now();

    set((state) => {
      const updatedUser = { ...state.user, diamonds: state.user.diamonds - costDiamonds };

      if (type === 'double_regen') {
        const currentEnd = updatedUser.doubleRegenUntil && updatedUser.doubleRegenUntil > now ? updatedUser.doubleRegenUntil : now;
        updatedUser.doubleRegenUntil = currentEnd + (30 * 60 * 1000); // +30 mins
      } else if (type === 'boss_pass') {
        updatedUser.freeBossPassCount += 1;
      } else if (type === 'instant_refuel') {
        updatedUser.energy = updatedUser.maxEnergy;
        updatedUser.lastEnergyTimestamp = now;
      }

      return { user: updatedUser };
    });

    get().saveToLocalStorage();
    return true;
  },

  // 3D Navigation
  selectPlanet: (planetId: string) => {
    set({ activePlanetId: planetId, selectedCoordinateNode: null });
  },

  startFlyingToCoordinate: (node: PlanetCoordinateNode) => {
    set({ selectedCoordinateNode: node, isFlyingToNode: true, flightProgress: 0 });
  },

  finishFlyingToCoordinate: () => {
    set({ isFlyingToNode: false, flightProgress: 1 });
  },

  closeCoordinateModal: () => {
    set({ selectedCoordinateNode: null, isFlyingToNode: false });
  },

  selectDomain: (domainId) => {
    soundService.playClick();
    set({ selectedDomain: domainId });
  },

  setActiveQuestion: (q) => {
    set({ activeQuestion: q });
  },

  toggleSound: () => {
    const { settings } = get();
    const newSound = !settings.soundEnabled;
    soundService.toggleSound(newSound);
    set({
      settings: { ...settings, soundEnabled: newSound }
    });
    get().saveToLocalStorage();
  },

  saveToLocalStorage: () => {
    try {
      const { user, hasSeenFTUE, completedNodes, nodeStars, settings, activePlanetId } = get();
      const payload = { user, hasSeenFTUE, completedNodes, nodeStars, settings, activePlanetId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save space state to localStorage', e);
    }
  },

  loadFromLocalStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        set((state) => ({
          ...state,
          user: { ...state.user, ...(parsed.user || {}) },
          hasSeenFTUE: parsed.hasSeenFTUE ?? state.hasSeenFTUE,
          completedNodes: parsed.completedNodes || {},
          nodeStars: parsed.nodeStars || {},
          settings: { ...state.settings, ...(parsed.settings || {}) },
          activePlanetId: parsed.activePlanetId || 'bravery_prime',
        }));
      }
      get().refreshEnergy();
    } catch (e) {
      console.warn('Failed to load space state from localStorage', e);
    }
  },
}));
