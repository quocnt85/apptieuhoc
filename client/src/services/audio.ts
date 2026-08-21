import type { BgmStyle } from '../types';
import type { ToneAudioEngine } from './toneAudioEngine';

/** Lightweight facade: Tone.js is loaded only when audio is first needed. */
class SoundService {
  private engineModulePromise: Promise<typeof import('./toneAudioEngine')> | null = null;
  private enginePromise: Promise<ToneAudioEngine> | null = null;
  private engine: ToneAudioEngine | null = null;
  private unlockPromise: Promise<boolean> | null = null;
  private audioUnlocked = false;
  private preloadTimer: number | null = null;
  private bgmEnabled = true;
  private sfxEnabled = true;
  private bgmStyle: BgmStyle = 'ambient';
  private firstInteractionHandler: (() => void) | null = null;

  constructor() {
    if (typeof window === 'undefined') return;
    this.firstInteractionHandler = () => {
      void this.unlockAudio();
    };
    window.addEventListener('touchstart', this.firstInteractionHandler, { capture: true, passive: true });
    window.addEventListener('pointerdown', this.firstInteractionHandler, { capture: true });
    window.addEventListener('click', this.firstInteractionHandler, { capture: true });
    window.addEventListener('keydown', this.firstInteractionHandler, { capture: true });
    // Warm the split chunk after the main UI has loaded so the first real
    // gesture can call AudioContext.resume() while user activation is valid.
    this.preloadTimer = window.setTimeout(() => {
      this.preloadTimer = null;
      void this.loadEngine().catch(() => undefined);
    }, 800);
  }

  private loadEngine(): Promise<ToneAudioEngine> {
    this.engineModulePromise ??= import('./toneAudioEngine').catch((error) => {
      this.engineModulePromise = null;
      throw error;
    });
    this.enginePromise ??= this.engineModulePromise.then(({ ToneAudioEngine }) => {
      this.engine = new ToneAudioEngine({
        bgmEnabled: this.bgmEnabled,
        sfxEnabled: this.sfxEnabled,
        bgmStyle: this.bgmStyle,
      });
      return this.engine;
    }).catch((error) => {
      this.engine = null;
      this.enginePromise = null;
      throw error;
    });
    return this.enginePromise;
  }

  private removeUnlockListeners(): void {
    if (!this.firstInteractionHandler || typeof window === 'undefined') return;
    window.removeEventListener('touchstart', this.firstInteractionHandler, { capture: true });
    window.removeEventListener('pointerdown', this.firstInteractionHandler, { capture: true });
    window.removeEventListener('click', this.firstInteractionHandler, { capture: true });
    window.removeEventListener('keydown', this.firstInteractionHandler, { capture: true });
    this.firstInteractionHandler = null;
  }

  private run(action: (engine: ToneAudioEngine) => void): void {
    if (this.audioUnlocked && this.engine) {
      action(this.engine);
      return;
    }
    // Never silently drop a requested sound. When called from a click/touch
    // handler this invokes AudioContext.resume() in the same user gesture.
    void this.unlockAudio().then((unlocked) => {
      if (unlocked && this.engine) action(this.engine);
    }).catch(() => undefined);
  }

  private runIfLoaded(action: (engine: ToneAudioEngine) => void): void {
    if (this.enginePromise) void this.enginePromise.then(action).catch(() => undefined);
  }

  public unlockAudio(): Promise<boolean> {
    if (this.audioUnlocked) return Promise.resolve(true);
    if (this.unlockPromise) return this.unlockPromise;

    const startEngine = (engine: ToneAudioEngine) => engine.unlockAudio().then((unlocked) => {
      this.audioUnlocked = unlocked;
      if (unlocked) this.removeUnlockListeners();
      return unlocked;
    });

    // The preloaded path is intentionally synchronous up to Tone.start(),
    // preserving transient user activation on Safari and mobile WebViews.
    const attempt = this.engine
      ? startEngine(this.engine)
      : this.loadEngine().then(startEngine);
    this.unlockPromise = attempt
      .catch((error) => {
        console.warn('Unable to unlock Web Audio; waiting for the next user gesture.', error);
        return false;
      })
      .finally(() => {
        this.unlockPromise = null;
      });
    return this.unlockPromise;
  }

  public setBgmEnabled(enabled: boolean): void {
    this.bgmEnabled = enabled;
    this.runIfLoaded((engine) => engine.setBgmEnabled(enabled));
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    this.runIfLoaded((engine) => engine.setSfxEnabled(enabled));
  }

  public setBgmStyle(style: BgmStyle): void {
    this.bgmStyle = style;
    this.runIfLoaded((engine) => engine.setBgmStyle(style));
  }

  public getBgmStyle(): BgmStyle { return this.bgmStyle; }
  public startBGM(style?: BgmStyle): void { this.run((engine) => engine.startBGM(style)); }
  public stopBGM(): void { this.runIfLoaded((engine) => engine.stopBGM()); }
  public playClick(): void { if (this.sfxEnabled) this.run((engine) => engine.playClick()); }
  public playTap(): void { if (this.sfxEnabled) this.run((engine) => engine.playTap()); }
  public playSelect(): void { if (this.sfxEnabled) this.run((engine) => engine.playSelect()); }
  public playCorrect(): void { if (this.sfxEnabled) this.run((engine) => engine.playCorrect()); }
  public playWrong(): void { if (this.sfxEnabled) this.run((engine) => engine.playWrong()); }
  public playCoin(): void { if (this.sfxEnabled) this.run((engine) => engine.playCoin()); }
  public playLevelUp(): void { if (this.sfxEnabled) this.run((engine) => engine.playLevelUp()); }
  public playVictory(): void { if (this.sfxEnabled) this.run((engine) => engine.playVictory()); }
  public playBossAlarmSiren(): void { if (this.sfxEnabled) this.run((engine) => engine.playBossAlarmSiren()); }
  public startShipEngine(power?: number): void { if (this.sfxEnabled) this.run((engine) => engine.startShipEngine(power)); }
  public setShipEnginePower(power: number, immediate?: boolean): void { this.runIfLoaded((engine) => engine.setShipEnginePower(power, immediate)); }
  public stopShipEngine(release?: number): void { this.runIfLoaded((engine) => engine.stopShipEngine(release)); }
  public playEngineStart(): void { if (this.sfxEnabled) this.run((engine) => engine.playEngineStart()); }
  public playShipAccelerate(): void { if (this.sfxEnabled) this.run((engine) => engine.playShipAccelerate()); }
  public playShipDecelerate(): void { if (this.sfxEnabled) this.run((engine) => engine.playShipDecelerate()); }
  public playShipCruising(): void { if (this.sfxEnabled) this.run((engine) => engine.playShipCruising()); }
  public playHyperspeedJump(duration?: number): void { if (this.sfxEnabled) this.run((engine) => engine.playHyperspeedJump(duration)); }

  public dispose(): void {
    this.removeUnlockListeners();
    if (this.preloadTimer !== null && typeof window !== 'undefined') window.clearTimeout(this.preloadTimer);
    this.preloadTimer = null;
    if (this.enginePromise) void this.enginePromise.then((engine) => engine.dispose());
    this.engine = null;
    this.enginePromise = null;
    this.engineModulePromise = null;
    this.unlockPromise = null;
    this.audioUnlocked = false;
  }
}

declare global {
  interface Window { __novaStarsSoundService?: SoundService; }
}

export const soundService = typeof window === 'undefined'
  ? new SoundService()
  : (window.__novaStarsSoundService ??= new SoundService());

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    soundService.dispose();
    delete window.__novaStarsSoundService;
  });
}
