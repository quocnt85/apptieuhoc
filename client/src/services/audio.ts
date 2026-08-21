import type { BgmStyle } from '../types';
import type { ToneAudioEngine } from './toneAudioEngine';

/** Lightweight facade: Tone.js is loaded only when audio is first needed. */
class SoundService {
  private engineModulePromise: Promise<typeof import('./toneAudioEngine')> | null = null;
  private enginePromise: Promise<ToneAudioEngine> | null = null;
  private engine: ToneAudioEngine | null = null;
  private unlockPromise: Promise<boolean> | null = null;
  private audioUnlocked = false;
  private bgmEnabled = true;
  private sfxEnabled = true;
  private bgmStyle: BgmStyle = 'ambient';
  private firstInteractionHandler: ((event: Event) => void) | null = null;
  private readonly diagnosticEvents: Array<{ at: string; event: string; details?: Record<string, unknown> }> = [];
  private readonly debugEnabled = typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).get('audioDebug') === '1';
  private lifecycleHandler: (() => void) | null = null;
  private errorHandler: ((event: ErrorEvent) => void) | null = null;
  private rejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  constructor() {
    if (typeof window === 'undefined') return;
    this.firstInteractionHandler = (event) => {
      const activation = navigator.userActivation;
      const activationIsValid = !activation || activation.isActive;
      if (!this.engine?.isAudioRunning()) {
        this.recordDiagnostic(activationIsValid ? 'gesture-unlock-request' : 'gesture-unlock-skipped', {
          type: event.type,
          userActivation: activation?.isActive ?? 'unsupported',
        });
      }
      if (!activationIsValid) return;
      void this.unlockAudio();
    };
    window.addEventListener('touchend', this.firstInteractionHandler, { capture: true, passive: true });
    window.addEventListener('click', this.firstInteractionHandler, { capture: true });
    window.addEventListener('keydown', this.firstInteractionHandler, { capture: true });
    // Start fetching the split chunk immediately. Mobile Safari only grants a
    // short-lived user activation, so Tone.js must already be available when
    // the first real touch arrives.
    void this.loadEngine().catch(() => undefined);

    if (this.debugEnabled) this.installDiagnosticListeners();
  }

  private recordDiagnostic(event: string, details?: Record<string, unknown>): void {
    if (!this.debugEnabled) return;
    this.diagnosticEvents.push({ at: new Date().toISOString(), event, details });
    if (this.diagnosticEvents.length > 80) this.diagnosticEvents.shift();
  }

  private installDiagnosticListeners(): void {
    this.recordDiagnostic('debugger-initialized');
    this.lifecycleHandler = () => {
      this.recordDiagnostic('page-lifecycle', {
        visibility: document.visibilityState,
        focused: document.hasFocus(),
        contextState: this.engine?.getAudioDiagnostics().contextState ?? 'engine-not-ready',
      });
    };
    window.addEventListener('pageshow', this.lifecycleHandler);
    window.addEventListener('pagehide', this.lifecycleHandler);
    window.addEventListener('focus', this.lifecycleHandler);
    window.addEventListener('blur', this.lifecycleHandler);
    document.addEventListener('visibilitychange', this.lifecycleHandler);

    this.errorHandler = (event) => {
      this.recordDiagnostic('window-error', {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    };
    this.rejectionHandler = (event) => {
      this.recordDiagnostic('unhandled-rejection', { reason: String(event.reason) });
    };
    window.addEventListener('error', this.errorHandler);
    window.addEventListener('unhandledrejection', this.rejectionHandler);
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
        onDiagnostic: (event, details) => this.recordDiagnostic(event, details),
      });
      this.recordDiagnostic('engine-loaded');
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
    window.removeEventListener('touchend', this.firstInteractionHandler, { capture: true });
    window.removeEventListener('click', this.firstInteractionHandler, { capture: true });
    window.removeEventListener('keydown', this.firstInteractionHandler, { capture: true });
    this.firstInteractionHandler = null;
  }

  private run(action: (engine: ToneAudioEngine) => void): void {
    if (this.audioUnlocked && this.engine?.isAudioRunning()) {
      action(this.engine);
      return;
    }
    this.audioUnlocked = false;
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
    if (this.audioUnlocked && this.engine?.isAudioRunning()) return Promise.resolve(true);
    this.audioUnlocked = false;
    if (this.unlockPromise) return this.unlockPromise;

    this.recordDiagnostic('unlock-attempt', {
      contextState: this.engine?.getAudioDiagnostics().contextState ?? 'engine-not-ready',
      userActivation: navigator.userActivation?.isActive ?? 'unsupported',
    });
    const startedAt = performance.now();
    const startEngine = (engine: ToneAudioEngine) => engine.unlockAudio();

    // The preloaded path is intentionally synchronous up to Tone.start(),
    // preserving transient user activation on Safari and mobile WebViews.
    const attempt = this.engine
      ? startEngine(this.engine)
      : this.loadEngine().then(startEngine);
    const boundedAttempt = new Promise<boolean>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        this.recordDiagnostic('unlock-timeout', { durationMs: 2000 });
        resolve(false);
      }, 2000);
      attempt.then(
        (unlocked) => {
          window.clearTimeout(timeout);
          resolve(unlocked);
        },
        (error) => {
          window.clearTimeout(timeout);
          reject(error);
        },
      );
    });
    this.unlockPromise = boundedAttempt
      .then((unlocked) => {
        this.audioUnlocked = unlocked;
        this.recordDiagnostic(unlocked ? 'unlock-success' : 'unlock-failed', {
          durationMs: Math.round(performance.now() - startedAt),
          ...(this.engine?.getAudioDiagnostics() ?? {}),
        });
        return unlocked;
      })
      .catch((error) => {
        this.recordDiagnostic('unlock-error', { error: String(error) });
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
  public isAudioDebugEnabled(): boolean { return this.debugEnabled; }
  public getAudioDiagnostics() {
    const engine = this.engine?.getAudioDiagnostics() ?? null;
    return {
      capturedAt: new Date().toISOString(),
      page: {
        url: `${window.location.origin}${window.location.pathname}`,
        visibility: document.visibilityState,
        focused: document.hasFocus(),
        displayModeStandalone: window.matchMedia('(display-mode: standalone)').matches,
      },
      device: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
        maxTouchPoints: navigator.maxTouchPoints,
        screen: `${window.screen.width}x${window.screen.height}@${window.devicePixelRatio}`,
      },
      userActivation: navigator.userActivation
        ? { isActive: navigator.userActivation.isActive, hasBeenActive: navigator.userActivation.hasBeenActive }
        : 'unsupported',
      service: {
        audioUnlocked: this.audioUnlocked,
        engineLoaded: Boolean(this.engine),
        unlockInFlight: Boolean(this.unlockPromise),
        bgmEnabled: this.bgmEnabled,
        sfxEnabled: this.sfxEnabled,
        bgmStyle: this.bgmStyle,
      },
      engine,
      events: [...this.diagnosticEvents],
    };
  }

  public async playDiagnosticTone(): Promise<boolean> {
    this.audioUnlocked = false;
    const unlocked = await this.unlockAudio();
    if (!unlocked || !this.engine) return false;
    const played = this.engine.playDiagnosticTone();
    this.recordDiagnostic(played ? 'diagnostic-tone-triggered' : 'diagnostic-tone-failed');
    return played;
  }
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
  public playGameShot(kind: 'single' | 'twin' | 'cluster' | 'spread' | 'missile'): void { if (this.sfxEnabled) this.run((engine) => engine.playGameShot(kind)); }
  public playGameImpact(strength?: number): void { if (this.sfxEnabled) this.run((engine) => engine.playGameImpact(strength)); }
  public playGameExplosion(size?: number): void { if (this.sfxEnabled) this.run((engine) => engine.playGameExplosion(size)); }
  public playGamePowerUp(): void { if (this.sfxEnabled) this.run((engine) => engine.playGamePowerUp()); }
  public playWormhole(): void { if (this.sfxEnabled) this.run((engine) => engine.playWormhole()); }
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
    if (this.lifecycleHandler && typeof window !== 'undefined') {
      window.removeEventListener('pageshow', this.lifecycleHandler);
      window.removeEventListener('pagehide', this.lifecycleHandler);
      window.removeEventListener('focus', this.lifecycleHandler);
      window.removeEventListener('blur', this.lifecycleHandler);
      document.removeEventListener('visibilitychange', this.lifecycleHandler);
    }
    if (this.errorHandler && typeof window !== 'undefined') window.removeEventListener('error', this.errorHandler);
    if (this.rejectionHandler && typeof window !== 'undefined') window.removeEventListener('unhandledrejection', this.rejectionHandler);
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
