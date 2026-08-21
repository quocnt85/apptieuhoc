import { create } from 'zustand';
import { UserProfile, GameSettings, DomainId, DomainProgress, QuestionItem, ActiveTab, PlanetCoordinateNode, BgmStyle } from '../types';
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
  toggleBgm: () => void;
  toggleSfx: () => void;
  setBgmStyle: (style: 'ambient' | 'adventure') => void;

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
  isPlanetUnlocked: (planetId: string) => boolean;
  isNodeUnlocked: (node: PlanetCoordinateNode, planetId?: string) => boolean;
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

  // Dev God Mode State & Actions
  isGodModeUnlocked: boolean;
  isDevPanelOpen: boolean;
  isUnlimitedMode: boolean;
  showFpsOverlay: boolean;
  devBackupUser: UserProfile | null;

  unlockGodMode: () => void;
  toggleGodMode: () => void;
  toggleDevPanel: (open?: boolean) => void;
  toggleUnlimitedMode: () => void;
  toggleFpsOverlay: (show?: boolean) => void;
  setEnergy: (amount: number) => void;
  setNovaCoins: (amount: number) => void;
  setDiamonds: (amount: number) => void;
  setStars: (amount: number) => void;
  setLevel: (level: number) => void;
  instantCompleteCurrentLesson: (nodeId?: string) => void;
  unlockAllPlanetNodes: () => void;
  unlockAllCosmetics: () => void;
  resetAllProgress: () => void;

  // Daily Quests State & Actions
  isGreetingQuestDone: boolean;
  setGreetingQuestDone: (done: boolean) => void;

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const STORAGE_KEY = 'novastars_space_state_v2';

const normalizeAudioSettings = (raw: Record<string, any>) => {
  const isV2 = raw.audioSettingsVersion === 2;
  const legacySound = typeof raw.soundEnabled === 'boolean' ? raw.soundEnabled : true;
  const bgmStyle: BgmStyle = raw.bgmStyle === 'adventure' ? 'adventure' : 'ambient';
  const currentSettings = { ...raw };
  delete currentSettings.soundEnabled;
  delete currentSettings.musicEnabled;
  const normalized = {
    ...currentSettings,
    audioSettingsVersion: 2 as const,
    sfxEnabled: isV2 && typeof raw.sfxEnabled === 'boolean' ? raw.sfxEnabled : legacySound,
    bgmEnabled: isV2 && typeof raw.bgmEnabled === 'boolean'
      ? raw.bgmEnabled
      : legacySound && (typeof raw.musicEnabled === 'boolean' ? raw.musicEnabled : true),
    bgmStyle,
  };
  const changed = !isV2
    || raw.sfxEnabled !== normalized.sfxEnabled
    || raw.bgmEnabled !== normalized.bgmEnabled
    || raw.bgmStyle !== normalized.bgmStyle
    || 'soundEnabled' in raw
    || 'musicEnabled' in raw;
  return { normalized, changed };
};

const defaultProgress: Record<DomainId, DomainProgress> = {
  'DOM-FIN': { domainId: 'DOM-FIN', masteryPercentage: 20, questionsAnswered: 1, totalQuestions: 5, streak: 1 },
  'DOM-SEL': { domainId: 'DOM-SEL', masteryPercentage: 35, questionsAnswered: 2, totalQuestions: 5, streak: 2 },
  'DOM-CRT': { domainId: 'DOM-CRT', masteryPercentage: 15, questionsAnswered: 1, totalQuestions: 5, streak: 1 },
  'DOM-DIG': { domainId: 'DOM-DIG', masteryPercentage: 40, questionsAnswered: 2, totalQuestions: 5, streak: 3 },
  'DOM-HAB': { domainId: 'DOM-HAB', masteryPercentage: 25, questionsAnswered: 1, totalQuestions: 5, streak: 2 },
};

const initialUser: UserProfile = {
  id: 'guest_space_pilot',
  name: 'Phi Hành Gia Nhí',
  grade: 3,
  avatar: '👨‍🚀',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  energy: 50,
  maxEnergy: 50,
  lastEnergyTimestamp: Date.now(),
  novaCoins: 0,
  diamonds: 0,
  gems: 0,
  stars: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
  freeBossPassCount: 1,
  customization: {
    equippedShip: 'explorer_v1',
    equippedColor: '#38bdf8',
    hasVietnamFlag: true,
    unlockedShips: ['explorer_v1'],
    unlockedColors: ['default', '#38bdf8'],
    unlockedAccessories: ['flag_vn'],
    unlockedAvatars: ['👨‍🚀', '👩‍🚀', '🧑‍🚀', '⭐', '🤖', '🦊', '🦁', '🐼', '🦄', '🦖'],
  },
};

export const useGameStore = create<GameState>((set, get) => ({
  user: initialUser,
  hasSeenFTUE: false,
  completedNodes: {},
  nodeStars: {},
  isGreetingQuestDone: false,
  settings: {
    audioSettingsVersion: 2,
    bgmEnabled: true,
    sfxEnabled: true,
    hapticEnabled: true,
    bgmStyle: 'ambient',
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

  // Dev God Mode State
  isGodModeUnlocked: false,
  isDevPanelOpen: false,
  isUnlimitedMode: false,
  showFpsOverlay: false,
  devBackupUser: null,

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
    const { user, completedNodes, isUnlimitedMode } = get();

    // Dev Unlimited Mode bypass
    if (isUnlimitedMode) {
      return { success: true, cost: 0 };
    }

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
    const { user, isUnlimitedMode } = get();
    if (isUnlimitedMode) return true;
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
    const { user, isUnlimitedMode } = get();
    if (!isUnlimitedMode && user.novaCoins < priceCoins) return false;

    soundService.playVictory();
    set((state) => ({
      user: {
        ...state.user,
        novaCoins: isUnlimitedMode ? state.user.novaCoins : state.user.novaCoins - priceCoins,
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
    const { user, isUnlimitedMode } = get();
    if (!isUnlimitedMode && user.novaCoins < priceCoins) return false;

    soundService.playVictory();
    set((state) => ({
      user: {
        ...state.user,
        novaCoins: isUnlimitedMode ? state.user.novaCoins : state.user.novaCoins - priceCoins,
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
    const { user, isUnlimitedMode } = get();
    if (!isUnlimitedMode && user.diamonds < costDiamonds) return false;

    soundService.playVictory();
    const now = Date.now();

    set((state) => {
      const updatedUser = { 
        ...state.user, 
        diamonds: isUnlimitedMode ? state.user.diamonds : state.user.diamonds - costDiamonds 
      };

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
    soundService.playClick();
    set({
      activePlanetId: planetId,
      selectedCoordinateNode: null,
      isFlyingToNode: false,
    });
    get().saveToLocalStorage();
  },

  isPlanetUnlocked: (planetId: string) => {
    const { isUnlimitedMode, completedNodes, user } = get();
    if (isUnlimitedMode) return true;
    if (planetId === 'bravery_prime') return true;

    const planet = PLANETS_DATA.find((p) => p.id === planetId);
    if (!planet?.unlockRequirement) return true;

    const req = planet.unlockRequirement;
    // Condition 1: Completed required boss node from preceding planet
    if (req.requiredBossNodeId && completedNodes[req.requiredBossNodeId]) {
      return true;
    }
    // Condition 2: Accumulated required total stars
    if (req.requiredStars !== undefined && user.stars >= req.requiredStars) {
      return true;
    }

    return false;
  },

  isNodeUnlocked: (node: PlanetCoordinateNode, planetId?: string) => {
    const { isUnlimitedMode, isPlanetUnlocked, user } = get();
    if (isUnlimitedMode) return true;

    const targetPlanetId = planetId || get().activePlanetId;
    // If planet itself is locked, all its lesson nodes remain locked
    if (!isPlanetUnlocked(targetPlanetId)) {
      return false;
    }

    // If planet is unlocked, check node star requirement
    return user.stars >= (node.starsRequiredToUnlock || 0);
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

  toggleBgm: () => {
    const { settings } = get();
    const enabled = !settings.bgmEnabled;
    if (settings.sfxEnabled) soundService.playClick();
    soundService.setBgmEnabled(enabled);
    set({ settings: { ...settings, bgmEnabled: enabled } });
    get().saveToLocalStorage();
  },

  toggleSfx: () => {
    const { settings } = get();
    const enabled = !settings.sfxEnabled;
    soundService.setSfxEnabled(enabled);
    set({ settings: { ...settings, sfxEnabled: enabled } });
    get().saveToLocalStorage();
    if (enabled) soundService.playClick();
  },

  setBgmStyle: (style) => {
    const { settings } = get();
    soundService.playClick();
    soundService.setBgmStyle(style);
    set({
      settings: { ...settings, bgmStyle: style }
    });
    get().saveToLocalStorage();
  },

  // Dev God Mode Implementations
  unlockGodMode: () => {
    const { devBackupUser, user } = get();
    soundService.playVictory();
    set({
      isGodModeUnlocked: true,
      isDevPanelOpen: true,
      devBackupUser: devBackupUser || JSON.parse(JSON.stringify(user)),
    });
    get().saveToLocalStorage();
  },

  toggleGodMode: () => {
    const { isGodModeUnlocked, devBackupUser, user } = get();
    soundService.playVictory();
    if (isGodModeUnlocked) {
      // Đang BẬT -> TẮT: Khôi phục mọi chỉ số về trạng thái thực tế
      const restoredUser = devBackupUser ? { ...devBackupUser } : { ...user };
      set({
        isGodModeUnlocked: false,
        isDevPanelOpen: false,
        isUnlimitedMode: false,
        showFpsOverlay: false,
        user: restoredUser,
        devBackupUser: null,
      });
    } else {
      // Đang TẮT -> BẬT: Sao lưu chỉ số thực tế hiện tại
      set({
        isGodModeUnlocked: true,
        isDevPanelOpen: true,
        devBackupUser: JSON.parse(JSON.stringify(user)),
      });
    }
    get().saveToLocalStorage();
  },

  toggleDevPanel: (open) => {
    set((state) => ({ isDevPanelOpen: open !== undefined ? open : !state.isDevPanelOpen }));
  },

  toggleUnlimitedMode: () => {
    const { isUnlimitedMode } = get();
    soundService.playVictory();
    set({
      isUnlimitedMode: !isUnlimitedMode,
    });
    get().saveToLocalStorage();
  },

  toggleFpsOverlay: (show) => {
    set((state) => ({ showFpsOverlay: show !== undefined ? show : !state.showFpsOverlay }));
    get().saveToLocalStorage();
  },

  setEnergy: (amount) => {
    soundService.playClick();
    const cleanAmount = Math.max(0, amount);
    set((state) => ({
      user: { ...state.user, energy: cleanAmount, maxEnergy: Math.max(state.user.maxEnergy, cleanAmount), lastEnergyTimestamp: Date.now() }
    }));
    get().saveToLocalStorage();
  },

  setNovaCoins: (amount) => {
    soundService.playCoin();
    const cleanAmount = Math.max(0, amount);
    set((state) => ({
      user: { ...state.user, novaCoins: cleanAmount }
    }));
    get().saveToLocalStorage();
  },

  setDiamonds: (amount) => {
    soundService.playCoin();
    const cleanAmount = Math.max(0, amount);
    set((state) => ({
      user: { ...state.user, diamonds: cleanAmount, gems: cleanAmount }
    }));
    get().saveToLocalStorage();
  },

  setStars: (amount) => {
    soundService.playCoin();
    const cleanAmount = Math.max(0, amount);
    set((state) => ({
      user: { ...state.user, stars: cleanAmount }
    }));
    get().saveToLocalStorage();
  },

  setLevel: (level) => {
    soundService.playVictory();
    const cleanLevel = Math.max(1, level);
    set((state) => ({
      user: { ...state.user, level: cleanLevel }
    }));
    get().saveToLocalStorage();
  },

  instantCompleteCurrentLesson: (nodeId) => {
    soundService.playVictory();
    const currentPlanet = PLANETS_DATA.find((p) => p.id === get().activePlanetId);
    const targetNodeId = nodeId || get().activeLessonId || currentPlanet?.nodes[0]?.id || 'bravery_prime_node_1';
    
    get().completeLessonNode(targetNodeId, 3);
    set({ isLessonRunning: false, activeLessonId: null, selectedCoordinateNode: null });
    get().saveToLocalStorage();
  },

  unlockAllPlanetNodes: () => {
    soundService.playVictory();
    const newCompleted: Record<string, boolean> = {};
    const newNodeStars: Record<string, number> = {};
    let totalStars = 0;

    PLANETS_DATA.forEach((planet) => {
      planet.nodes.forEach((node) => {
        newCompleted[node.id] = true;
        newNodeStars[node.id] = 3;
        totalStars += 3;
      });
    });

    set((state) => ({
      completedNodes: { ...state.completedNodes, ...newCompleted },
      nodeStars: { ...state.nodeStars, ...newNodeStars },
      user: {
        ...state.user,
        stars: Math.max(state.user.stars, totalStars),
      }
    }));
    get().saveToLocalStorage();
  },

  unlockAllCosmetics: () => {
    soundService.playVictory();
    const allShips = ['explorer_v1', 'falcon_apex', 'solar_phoenix', 'starlight_runner', 'astral_shuttle'];
    const allColors = ['#38bdf8', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];
    const allAvatars = ['👨‍🚀', '👩‍🚀', '🧑‍🚀', '⭐', '🤖', '🦊', '🦁', '🐼', '🦄', '🦖'];
    const allAccessories = ['flag_vn', 'cosmic_wings', 'hyper_drive'];

    set((state) => ({
      user: {
        ...state.user,
        customization: {
          ...state.user.customization,
          unlockedShips: allShips,
          unlockedColors: allColors,
          unlockedAvatars: allAvatars,
          unlockedAccessories: allAccessories,
        }
      }
    }));
    get().saveToLocalStorage();
  },

  setGreetingQuestDone: (done: boolean) => {
    set({ isGreetingQuestDone: done });
    if (done) {
      localStorage.setItem('novastars_quest_greeting_done', 'true');
    } else {
      localStorage.removeItem('novastars_quest_greeting_done');
    }
    get().saveToLocalStorage();
  },

  resetAllProgress: () => {
    soundService.playClick();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('novastars_quest_greeting_done');
    localStorage.removeItem('novastars_app_state_v1');
    set({
      user: initialUser,
      hasSeenFTUE: false,
      completedNodes: {},
      nodeStars: {},
      isGreetingQuestDone: false,
      isUnlimitedMode: false,
      devBackupUser: null,
      activePlanetId: 'bravery_prime',
      selectedCoordinateNode: null,
      isFlyingToNode: false,
      isLessonRunning: false,
      activeLessonId: null,
    });
  },

  saveToLocalStorage: () => {
    try {
      const { user, hasSeenFTUE, completedNodes, nodeStars, isGreetingQuestDone, settings, activePlanetId, isGodModeUnlocked, showFpsOverlay, devBackupUser } = get();
      const payload = { user, hasSeenFTUE, completedNodes, nodeStars, isGreetingQuestDone, settings, activePlanetId, isGodModeUnlocked, showFpsOverlay, devBackupUser };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save space state to localStorage', e);
    }
  },

  loadFromLocalStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const greetingQuestDoneFromLocal = localStorage.getItem('novastars_quest_greeting_done') === 'true';
      if (raw) {
        const parsed = JSON.parse(raw);
        const loadedUser = parsed.user || {};
        if (loadedUser.avatar === '🚀') {
          loadedUser.avatar = '👨‍🚀';
        }
        const persistedSettings = parsed.settings || {};
        const { normalized: migratedSettings, changed: audioSettingsChanged } = normalizeAudioSettings(persistedSettings);
        set((state) => ({
          ...state,
          user: { ...state.user, ...loadedUser },
          hasSeenFTUE: parsed.hasSeenFTUE ?? state.hasSeenFTUE,
          completedNodes: parsed.completedNodes || {},
          nodeStars: parsed.nodeStars || {},
          isGreetingQuestDone: parsed.isGreetingQuestDone ?? greetingQuestDoneFromLocal,
          settings: { ...state.settings, ...migratedSettings },
          activePlanetId: parsed.activePlanetId || 'bravery_prime',
          isGodModeUnlocked: parsed.isGodModeUnlocked ?? state.isGodModeUnlocked,
          showFpsOverlay: parsed.showFpsOverlay ?? state.showFpsOverlay,
          devBackupUser: parsed.devBackupUser ?? null,
        }));
        if (persistedSettings) {
          soundService.setSfxEnabled(migratedSettings.sfxEnabled ?? true);
          if (migratedSettings.bgmStyle) {
            soundService.setBgmStyle(migratedSettings.bgmStyle);
          }
          soundService.setBgmEnabled(migratedSettings.bgmEnabled ?? true);
        }
        if (audioSettingsChanged) get().saveToLocalStorage();
      } else {
        set((state) => ({
          ...state,
          isGreetingQuestDone: greetingQuestDoneFromLocal,
        }));
      }
      get().refreshEnergy();
    } catch (e) {
      console.warn('Failed to load space state from localStorage', e);
    }
  },
}));

if (typeof window !== 'undefined') {
  (window as any).__gameStore = useGameStore;
}
