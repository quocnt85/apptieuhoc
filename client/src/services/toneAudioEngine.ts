import * as Tone from 'tone';
import { BgmStyle } from '../types';
import { AudioSafetyGraph } from './audioSafety';

/**
 * NovaStars High-Fidelity Audio Engine Powered by Tone.js
 * 100% Procedural & Offline - Studio-grade Synths & Spatial FX
 */
export class ToneAudioEngine {
  private bgmEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private isBgmPlaying: boolean = false;
  private currentBgmStyle: BgmStyle = 'ambient';
  private isContextStarted: boolean = false;
  private firstInteractionHandler: (() => void) | null = null;

  // The only permitted output path for every BGM and SFX source.
  private safetyGraph: AudioSafetyGraph | null = null;
  private bgmRestartTimer: ReturnType<typeof setTimeout> | null = null;
  private bgmGeneration = 0;

  // BGM Synths & Sequences
  private ambientPadSynth: Tone.PolySynth | null = null;
  private ambientArpSynth: Tone.PolySynth | null = null;
  private ambientDroneSynth: Tone.MonoSynth | null = null;
  private ambientSequence: Tone.Sequence | null = null;
  private ambientArpSequence: Tone.Sequence | null = null;

  private adventureChordSynth: Tone.PolySynth | null = null;
  private adventureBassSynth: Tone.MonoSynth | null = null;
  private adventureDrumSynth: Tone.MembraneSynth | null = null;
  private adventureNoiseSynth: Tone.NoiseSynth | null = null;
  private adventureChordSeq: Tone.Sequence | null = null;
  private adventureBassSeq: Tone.Sequence | null = null;
  private adventureDrumSeq: Tone.Sequence | null = null;

  // SFX Synths
  private clickSynth: Tone.MembraneSynth | null = null;
  private chimeSynth: Tone.PolySynth | null = null;
  private wrongSynth: Tone.PolySynth | null = null;
  private coinSynth: Tone.Synth | null = null;
  private fanfareSynth: Tone.PolySynth | null = null;
  private sirenSynth: Tone.Synth | null = null;

  // Spaceship Flight Continuous Nodes
  private engineNoise: Tone.Noise | null = null;
  private engineFilter: Tone.Filter | null = null;
  private engineLowOsc: Tone.Oscillator | null = null;
  private engineGain: Tone.Gain | null = null;
  private isEngineRunning: boolean = false;
  private readonly onDiagnostic?: (event: string, details?: Record<string, unknown>) => void;
  private contextStateHandler: (() => void) | null = null;

  constructor(options?: {
    bgmEnabled?: boolean;
    sfxEnabled?: boolean;
    bgmStyle?: BgmStyle;
    onDiagnostic?: (event: string, details?: Record<string, unknown>) => void;
  }) {
    this.bgmEnabled = options?.bgmEnabled ?? true;
    this.sfxEnabled = options?.sfxEnabled ?? true;
    this.currentBgmStyle = options?.bgmStyle ?? 'ambient';
    this.onDiagnostic = options?.onDiagnostic;
    const rawContext = Tone.context.rawContext as AudioContext;
    if (typeof rawContext.addEventListener === 'function') {
      this.contextStateHandler = () => {
        this.onDiagnostic?.('context-state-change', { state: rawContext.state });
      };
      rawContext.addEventListener('statechange', this.contextStateHandler);
    }
  }

  /**
   * Unlock AudioContext on first gesture
   */
  public isAudioRunning(): boolean {
    return Tone.context.state === 'running';
  }

  public getAudioDiagnostics() {
    const rawContext = Tone.context.rawContext as AudioContext;
    return {
      contextState: Tone.context.state,
      rawContextState: rawContext.state,
      sampleRate: rawContext.sampleRate,
      baseLatency: rawContext.baseLatency ?? 'unsupported',
      contextStarted: this.isContextStarted,
      bgmPlaying: this.isBgmPlaying,
      transportState: Tone.Transport.state,
      graphReady: Boolean(this.safetyGraph),
      outputLevel: this.safetyGraph?.getOutputLevel() ?? 0,
    };
  }

  public async suspendAudioForDiagnostics(): Promise<void> {
    const rawContext = Tone.context.rawContext as AudioContext;
    if (typeof rawContext.suspend === 'function') await rawContext.suspend();
  }

  public async unlockAudio(): Promise<boolean> {
    try {
      if (!this.isAudioRunning()) {
        const rawContext = Tone.context.rawContext as AudioContext;
        const resumeStartedAt = performance.now();
        try {
          // Do not await this promise: WebKit can leave it pending forever when
          // its non-standard state is `interrupted`. Polling the real state
          // keeps this attempt bounded and lets the next gesture retry.
          void rawContext.resume().catch((error) => {
            this.onDiagnostic?.('raw-context-resume-rejected', {
              name: error instanceof Error ? error.name : 'UnknownError',
              message: error instanceof Error ? error.message : String(error),
            });
          });
        } catch (error) {
          this.onDiagnostic?.('raw-context-resume-threw', {
            name: error instanceof Error ? error.name : 'UnknownError',
            message: error instanceof Error ? error.message : String(error),
          });
        }
        const deadline = resumeStartedAt + 1500;
        while (!this.isAudioRunning() && performance.now() < deadline) {
          await new Promise((resolve) => window.setTimeout(resolve, 50));
        }
        this.onDiagnostic?.('raw-context-resume-observed', {
          durationMs: Math.round(performance.now() - resumeStartedAt),
          state: rawContext.state,
        });
      }
      if (!this.isAudioRunning()) {
        this.onDiagnostic?.('tone-start-did-not-run', this.getAudioDiagnostics());
        return false;
      }
      this.initAudioGraph();
      if (!this.safetyGraph) return false;
      this.isContextStarted = true;
      if (this.bgmEnabled && !this.isBgmPlaying) {
        this.startBGM(this.currentBgmStyle);
      }
      return true;
    } catch (error) {
      this.onDiagnostic?.('tone-unlock-error', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      console.warn('Tone.js could not resume AudioContext.', error);
      return false;
    }
  }

  public playDiagnosticTone(): boolean {
    if (!this.isAudioRunning()) return false;
    this.initAudioGraph();
    if (!this.safetyGraph) return false;
    try {
      const synth = this.safetyGraph.routeSfx(new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.02, decay: 0.12, sustain: 0.15, release: 0.25 },
        volume: -12,
      }));
      synth.triggerAttackRelease('A4', '0.3s', Tone.now(), 0.55);
      window.setTimeout(() => synth.dispose(), 800);
      return true;
    } catch (error) {
      this.onDiagnostic?.('diagnostic-tone-error', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  private initAudioGraph() {
    if (this.safetyGraph) return;

    try {
      this.safetyGraph = new AudioSafetyGraph();
      this.safetyGraph.setSfxEnabled(this.sfxEnabled);
      this.initSfxInstruments();
    } catch (e) {
      console.warn('Tone.js Audio Graph Init Error:', e);
    }
  }

  private initSfxInstruments() {
    if (!this.safetyGraph) return;

    // A. Tactile UI Click (Soft rounded transient)
    this.clickSynth = this.safetyGraph.routeSfx(new Tone.MembraneSynth({
      pitchDecay: 0.02,
      octaves: 2.5,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.07, sustain: 0.01, release: 0.04 },
      volume: -10,
    }));

    // B. Celestial Correct Chime
    this.chimeSynth = this.safetyGraph.routeSfx(new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.015, decay: 0.35, sustain: 0.2, release: 0.8 },
      volume: -10,
    }), 'reverb');

    // C. Non-punitive Wrong Indicator (warm marimba-like)
    this.wrongSynth = this.safetyGraph.routeSfx(new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.22, sustain: 0.1, release: 0.3 },
      volume: -9,
    }));

    // D. Coin / Star Sparkle
    this.coinSynth = this.safetyGraph.routeSfx(new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.005, decay: 0.15, sustain: 0.1, release: 0.35 },
      volume: -12,
    }), 'reverb');

    // E. Fanfare / Level Up
    this.fanfareSynth = this.safetyGraph.routeSfx(new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.7 },
      volume: -10,
    }), 'reverb');

    // F. Boss Siren
    this.sirenSynth = this.safetyGraph.routeSfx(new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.1, decay: 0.4, sustain: 0.3, release: 0.2 },
      volume: -10,
    }));
  }

  // ==========================================
  // BGM CONTROLLER & STYLES
  // ==========================================

  public setBgmStyle(style: BgmStyle) {
    if (this.currentBgmStyle === style) return;
    this.currentBgmStyle = style;
    this.bgmGeneration += 1;
    const generation = this.bgmGeneration;
    const shouldRestart = this.isBgmPlaying || this.bgmRestartTimer !== null;
    if (this.bgmRestartTimer) {
      clearTimeout(this.bgmRestartTimer);
      this.bgmRestartTimer = null;
    }
    if (shouldRestart && this.bgmEnabled) {
      if (this.isBgmPlaying) this.stopBGM();
      this.bgmRestartTimer = setTimeout(() => {
        this.bgmRestartTimer = null;
        if (this.bgmEnabled && generation === this.bgmGeneration && this.currentBgmStyle === style) {
          this.startBGM(style);
        }
      }, 400);
    }
  }

  public getBgmStyle(): BgmStyle {
    return this.currentBgmStyle;
  }

  public startBGM(style?: BgmStyle) {
    try {
      if (!this.bgmEnabled || !this.isContextStarted) return;
      this.initAudioGraph();
      if (!this.safetyGraph) return;

      const targetStyle = style || this.currentBgmStyle;
      this.currentBgmStyle = targetStyle;

      if (this.isBgmPlaying) {
        this.stopBGM(0.08);
      }

      this.isBgmPlaying = true;
      this.bgmGeneration += 1;

      Tone.Transport.stop();
      Tone.Transport.cancel(0);
      Tone.Transport.position = 0;
      this.safetyGraph.fadeBgmIn(2.5);

      if (targetStyle === 'adventure') {
        this.startAdventureBGM();
      } else {
        this.startAmbientBGM();
      }
      Tone.Transport.start('+0.05');
    } catch (e) {
      console.warn('Tone BGM Start Error:', e);
    }
  }

  public stopBGM(fadeDuration = 0.8) {
    try {
      this.isBgmPlaying = false;
      Tone.Transport.stop();
      Tone.Transport.cancel(0);

      const sequences = [
        this.ambientSequence,
        this.ambientArpSequence,
        this.adventureChordSeq,
        this.adventureBassSeq,
        this.adventureDrumSeq,
      ].filter((sequence): sequence is Tone.Sequence => sequence !== null);
      sequences.forEach((sequence) => {
        sequence.stop();
        sequence.dispose();
      });
      this.ambientSequence = null;
      this.ambientArpSequence = null;
      this.adventureChordSeq = null;
      this.adventureBassSeq = null;
      this.adventureDrumSeq = null;

      const synths = [
        this.ambientPadSynth,
        this.ambientArpSynth,
        this.ambientDroneSynth,
        this.adventureChordSynth,
        this.adventureBassSynth,
        this.adventureDrumSynth,
        this.adventureNoiseSynth,
      ].filter(Boolean) as Tone.ToneAudioNode[];
      this.ambientPadSynth?.releaseAll();
      this.ambientArpSynth?.releaseAll();
      this.adventureChordSynth?.releaseAll();
      this.ambientDroneSynth?.triggerRelease();
      this.adventureBassSynth?.triggerRelease();
      this.ambientPadSynth = null;
      this.ambientArpSynth = null;
      this.ambientDroneSynth = null;
      this.adventureChordSynth = null;
      this.adventureBassSynth = null;
      this.adventureDrumSynth = null;
      this.adventureNoiseSynth = null;

      this.safetyGraph?.fadeBgmOut(fadeDuration);
      setTimeout(() => synths.forEach((synth) => synth.dispose()), (fadeDuration + 0.15) * 1000);
    } catch {}
  }

  /**
   * Style 1: Ambient Space Odyssey (Chill & Relaxing)
   */
  private startAmbientBGM() {
    if (!this.safetyGraph) return;

    Tone.Transport.bpm.rampTo(66, 1);

    // Warm Analog Pad
    this.ambientPadSynth = this.safetyGraph.routeBgm(new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 1.2, decay: 1.8, sustain: 0.85, release: 2.8 },
      volume: -6,
    }), 'chorus');

    // Shimmering High Bell Arpeggios
    this.ambientArpSynth = this.safetyGraph.routeBgm(new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.4, sustain: 0.2, release: 1.2 },
      volume: -14,
    }), 'reverb');

    // Low Grounding Drone
    this.ambientDroneSynth = this.safetyGraph.routeBgm(new Tone.MonoSynth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.8, decay: 1.5, sustain: 0.9, release: 2.5 },
      filterEnvelope: { attack: 0.6, decay: 1.2, sustain: 0.5, release: 2, baseFrequency: 120, octaves: 2 },
      volume: -10,
    }));

    // Lush space chords: Dm9 -> Bbmaj9 -> Fadd9 -> Cadd9 -> Gm7 -> Bbmaj7 -> A7sus4 -> A7
    const ambientChords = [
      { chord: ['D3', 'A3', 'C4', 'E4', 'F4'], root: 'D2' },
      { chord: ['Bb2', 'F3', 'A3', 'C4', 'D4'], root: 'Bb1' },
      { chord: ['F2', 'C3', 'G3', 'A3', 'C4'], root: 'F1' },
      { chord: ['C3', 'G3', 'D4', 'E4', 'G4'], root: 'C2' },
      { chord: ['G2', 'D3', 'F3', 'Bb3', 'D4'], root: 'G1' },
      { chord: ['Bb2', 'F3', 'A3', 'D4', 'F4'], root: 'Bb1' },
      { chord: ['A2', 'E3', 'G3', 'D4', 'E4'], root: 'A1' },
      { chord: ['A2', 'E3', 'G3', 'C#4', 'E4'], root: 'A1' },
    ];

    const arpNotes = [
      ['A5', null, 'D6', 'E6', 'F6', null, 'E6', 'C6'],
      ['D5', 'F5', 'A5', null, 'D6', 'C6', 'A5', null],
      ['C5', null, 'G5', 'A5', 'C6', null, 'G5', 'E5'],
      ['E5', 'G5', 'D6', null, 'E6', 'D6', 'B5', null],
    ];

    this.ambientSequence = new Tone.Sequence(
      (time, item) => {
        if (!this.isBgmPlaying || !this.ambientPadSynth || !this.ambientDroneSynth) return;
        this.ambientPadSynth.triggerAttackRelease(item.chord, '1m', time, 0.45);
        this.ambientDroneSynth.triggerAttackRelease(item.root, '1m', time, 0.4);
      },
      ambientChords,
      '1m'
    ).start(0);

    this.ambientArpSequence = new Tone.Sequence(
      (time, note) => {
        if (!this.isBgmPlaying || !this.ambientArpSynth || !note) return;
        this.ambientArpSynth.triggerAttackRelease(note, '8n', time, 0.25);
      },
      arpNotes[0],
      '8n'
    ).start(0);
  }

  /**
   * Style 2: Galactic Adventure (Uplifting & Inspiring)
   */
  private startAdventureBGM() {
    if (!this.safetyGraph) return;

    Tone.Transport.bpm.rampTo(106, 1);

    // Heroic Synth Brass / Chords
    this.adventureChordSynth = this.safetyGraph.routeBgm(new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.08, decay: 0.4, sustain: 0.6, release: 0.8 },
      volume: -7,
    }), 'reverb');

    // Rhythmic Bass Synth
    this.adventureBassSynth = this.safetyGraph.routeBgm(new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.02, decay: 0.18, sustain: 0.3, release: 0.2 },
      filterEnvelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.2, baseFrequency: 180, octaves: 2.5 },
      volume: -9,
    }));

    // Cinematic Timpani / Space Kick
    this.adventureDrumSynth = this.safetyGraph.routeBgm(new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 3,
      envelope: { attack: 0.005, decay: 0.4, sustain: 0.01, release: 0.4 },
      volume: -6,
    }));

    // Soft Hi-hat Filtered Pulse
    this.adventureNoiseSynth = this.safetyGraph.routeBgm(new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.005, decay: 0.05, sustain: 0 },
      volume: -20,
    }));

    const adventureChords = [
      { chord: ['D3', 'F3', 'A3', 'D4'], root: 'D2' },
      { chord: ['F3', 'A3', 'C4', 'F4'], root: 'F2' },
      { chord: ['C3', 'E3', 'G3', 'C4'], root: 'C2' },
      { chord: ['G2', 'B2', 'D3', 'G3'], root: 'G1' },
      { chord: ['Bb2', 'D3', 'F3', 'Bb3'], root: 'Bb1' },
      { chord: ['C3', 'E3', 'G3', 'C4'], root: 'C2' },
      { chord: ['D3', 'F3', 'A3', 'D4'], root: 'D2' },
      { chord: ['A2', 'E3', 'G3', 'C#4'], root: 'A1' },
    ];

    this.adventureChordSeq = new Tone.Sequence(
      (time, item) => {
        if (!this.isBgmPlaying || !this.adventureChordSynth) return;
        this.adventureChordSynth.triggerAttackRelease(item.chord, '2n', time, 0.42);
      },
      adventureChords,
      '1m'
    ).start(0);

    const bassPattern = ['D2', 'D2', 'D3', 'D2', 'F2', 'F2', 'F3', 'F2', 'C2', 'C2', 'C3', 'C2', 'G2', 'G2', 'G1', 'G2'];
    this.adventureBassSeq = new Tone.Sequence(
      (time, note) => {
        if (!this.isBgmPlaying || !this.adventureBassSynth) return;
        this.adventureBassSynth.triggerAttackRelease(note, '16n', time, 0.38);
      },
      bassPattern,
      '8n'
    ).start(0);

    const drumPattern = ['D1', null, 'D2', null, 'D1', null, 'D2', null];
    this.adventureDrumSeq = new Tone.Sequence(
      (time, note) => {
        if (!this.isBgmPlaying) return;
        if (note && this.adventureDrumSynth) {
          this.adventureDrumSynth.triggerAttackRelease(note, '8n', time, 0.45);
        }
        if (this.adventureNoiseSynth) {
          this.adventureNoiseSynth.triggerAttackRelease('16n', time, 0.15);
        }
      },
      drumPattern,
      '8n'
    ).start(0);
  }

  /**
   * Temporary duck BGM volume when a critical SFX plays
   */
  private duckBGM(duration = 1.0, depth = 0.35) {
    if (!this.safetyGraph || !this.isBgmPlaying) return;
    this.safetyGraph.duckBgm(duration, depth);
  }

  // ==========================================
  // SFX IMPLEMENTATIONS
  // ==========================================

  public playClick() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.clickSynth) return;
      this.clickSynth.triggerAttackRelease('G4', '0.04s', undefined, 0.35);
    } catch {}
  }

  public playTap() {
    this.playClick();
  }

  public playSelect() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.clickSynth) return;
      this.clickSynth.triggerAttackRelease('D5', '0.05s', undefined, 0.4);
    } catch {}
  }

  public playCorrect() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.chimeSynth) return;

      const now = Tone.now();
      const notes = ['D5', 'F#5', 'A5', 'D6'];
      notes.forEach((note, index) => {
        this.chimeSynth?.triggerAttackRelease(note, '0.4s', now + index * 0.06, 0.45);
      });
    } catch {}
  }

  public playWrong() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.wrongSynth) return;

      const now = Tone.now();
      this.wrongSynth.triggerAttackRelease(['G3', 'Eb3'], '0.18s', now, 0.35);
      this.wrongSynth.triggerAttackRelease(['F3', 'D3'], '0.22s', now + 0.12, 0.3);
    } catch {}
  }

  public playCoin() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.coinSynth) return;

      const now = Tone.now();
      this.coinSynth.triggerAttackRelease('B5', '0.1s', now, 0.35);
      this.coinSynth.triggerAttackRelease('E6', '0.25s', now + 0.07, 0.45);
    } catch {}
  }

  public playLevelUp() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.fanfareSynth) return;

      this.duckBGM(2.2, 0.2);
      const now = Tone.now();
      const melody = [
        { note: 'D4', time: 0, dur: '8n' },
        { note: 'F#4', time: 0.12, dur: '8n' },
        { note: 'A4', time: 0.24, dur: '8n' },
        { note: 'D5', time: 0.4, dur: '4n' },
        { note: 'F#5', time: 0.65, dur: '4n' },
        { note: 'A5', time: 0.95, dur: '2n' },
      ];

      melody.forEach((m) => {
        this.fanfareSynth?.triggerAttackRelease(m.note, m.dur, now + m.time, 0.5);
      });
    } catch {}
  }

  public playVictory() {
    this.playLevelUp();
  }

  public playBossAlarmSiren() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.sirenSynth) return;

      const now = Tone.now();
      for (let i = 0; i < 3; i++) {
        const start = now + i * 0.8;
        this.sirenSynth.triggerAttackRelease('F#4', '0.35s', start, 0.45);
        this.sirenSynth.triggerAttackRelease('C4', '0.35s', start + 0.38, 0.4);
      }
    } catch {}
  }

  // ==========================================
  // CONTINUOUS SPACESHIP ENGINE
  // ==========================================

  public startShipEngine(initialPower = 0.15) {
    try {
      if (!this.sfxEnabled || this.isEngineRunning) return;
      this.initAudioGraph();
      if (!this.safetyGraph) return;

      const now = Tone.now();
      this.engineGain = this.safetyGraph.routeSfx(new Tone.Gain(0.001));
      this.engineFilter = new Tone.Filter({
        frequency: 320,
        type: 'lowpass',
        rolloff: -12,
      }).connect(this.engineGain);

      this.engineNoise = new Tone.Noise('pink').connect(this.engineFilter);
      this.engineLowOsc = new Tone.Oscillator(68, 'sine').connect(this.engineGain);

      this.engineNoise.start(now);
      this.engineLowOsc.start(now);
      this.isEngineRunning = true;

      this.setShipEnginePower(initialPower, true);
    } catch {}
  }

  public setShipEnginePower(power: number, immediate = false) {
    if (!this.isEngineRunning || !this.engineGain || !this.engineFilter || !this.engineLowOsc) return;
    const p = Math.max(0.05, Math.min(1, power));
    const time = immediate ? 0.02 : 0.12;

    this.engineGain.gain.rampTo(0.025 + p * 0.13, time);
    this.engineFilter.frequency.rampTo(280 + p * 1600, time);
    this.engineLowOsc.frequency.rampTo(64 + p * 34, time);
  }

  public stopShipEngine(release = 0.5) {
    if (!this.isEngineRunning || !this.engineGain) return;
    this.isEngineRunning = false;
    const noise = this.engineNoise;
    const lowOsc = this.engineLowOsc;
    const filter = this.engineFilter;
    const gain = this.engineGain;
    this.engineNoise = null;
    this.engineLowOsc = null;
    this.engineFilter = null;
    this.engineGain = null;

    gain.gain.rampTo(0.0001, release);
    setTimeout(() => {
      try {
        noise?.stop();
        noise?.dispose();
        lowOsc?.stop();
        lowOsc?.dispose();
        filter?.dispose();
        gain.dispose();
      } catch {}
    }, release * 1000 + 100);
  }

  public playEngineStart() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.safetyGraph) return;

      this.duckBGM(0.8, 0.4);
      const now = Tone.now();

      // Spark Ignition
      const spark = this.safetyGraph.routeSfx(new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.08, sustain: 0 },
        volume: -8,
      }));

      spark.triggerAttackRelease('A5', '0.05s', now);
      spark.triggerAttackRelease('E5', '0.05s', now + 0.08);

      // Low Ignition Boom
      const boom = this.safetyGraph.routeSfx(new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2.5,
        envelope: { attack: 0.01, decay: 0.6, sustain: 0.1, release: 0.3 },
        volume: -12,
      }));

      boom.triggerAttackRelease('C2', '0.5s', now + 0.12, 0.5);

      setTimeout(() => {
        spark.dispose();
        boom.dispose();
      }, 1200);
    } catch {}
  }

  public playShipAccelerate() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.safetyGraph) return;

      this.duckBGM(1.2, 0.35);
      const now = Tone.now();
      const roarFilter = this.safetyGraph.routeSfx(new Tone.Filter(200, 'lowpass'));
      const roarGain = new Tone.Gain(0.01).connect(roarFilter);
      const roarNoise = new Tone.Noise('pink').connect(roarGain);

      roarNoise.start(now);
      roarGain.gain.rampTo(0.22, 0.4);
      roarGain.gain.rampTo(0.001, 1.1);
      roarFilter.frequency.rampTo(1800, 0.5);

      setTimeout(() => {
        roarNoise.stop();
        roarNoise.dispose();
        roarGain.dispose();
        roarFilter.dispose();
      }, 1300);
    } catch {}
  }

  public playShipDecelerate() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.safetyGraph) return;

      this.duckBGM(0.7, 0.5);
      const now = Tone.now();
      const filter = this.safetyGraph.routeSfx(new Tone.Filter(1400, 'lowpass'));
      const gain = new Tone.Gain(0.16).connect(filter);
      const noise = new Tone.Noise('brown').connect(gain);

      noise.start(now);
      gain.gain.rampTo(0.001, 0.85);
      filter.frequency.rampTo(150, 0.8);

      setTimeout(() => {
        noise.stop();
        noise.dispose();
        gain.dispose();
        filter.dispose();
      }, 950);
    } catch {}
  }

  public playShipCruising() {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.safetyGraph) return;

      const gain = this.safetyGraph.routeSfx(new Tone.Gain(0.0001));
      const osc = new Tone.Oscillator(180, 'sine').connect(gain);
      const now = Tone.now();
      osc.start(now);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.08);
      osc.frequency.rampTo(220, 0.3);
      osc.frequency.rampTo(180, 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);
      osc.stop(now + 0.72);

      setTimeout(() => {
        osc.dispose();
        gain.dispose();
      }, 800);
    } catch {}
  }

  public playHyperspeedJump(durationSeconds = 1.6) {
    try {
      if (!this.sfxEnabled) return;
      this.initAudioGraph();
      if (!this.safetyGraph) return;

      const duration = Math.max(1.2, Math.min(4, durationSeconds));
      this.duckBGM(duration + 0.8, 0.15);

      const now = Tone.now();
      const sweepSynth = this.safetyGraph.routeSfx(new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: duration * 0.5, sustain: 0.8, release: 0.3 },
        volume: -14,
      }), 'reverb');

      sweepSynth.triggerAttack('C3', now);
      sweepSynth.frequency.exponentialRampTo('G5', duration * 0.5, now);
      sweepSynth.triggerRelease(now + duration * 0.5);

      const boom = this.safetyGraph.routeSfx(new Tone.MembraneSynth({
        pitchDecay: 0.08,
        octaves: 2.5,
        envelope: { attack: 0.005, decay: 0.8, sustain: 0.1, release: 0.8 },
        volume: -14,
      }), 'reverb');

      boom.triggerAttackRelease('C2', '0.7s', now + duration * 0.45, 0.55);

      setTimeout(() => {
        sweepSynth.dispose();
        boom.dispose();
      }, (duration + 1) * 1000);
    } catch {}
  }

  // ==========================================
  // GENERAL SETTINGS & LIFECYCLE
  // ==========================================

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
    } else if (this.isContextStarted) {
      this.startBGM(this.currentBgmStyle);
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    this.safetyGraph?.setSfxEnabled(enabled);
    if (!enabled) {
      this.stopShipEngine(0.05);
    }
  }

  public dispose() {
    const rawContext = Tone.context.rawContext as AudioContext;
    if (this.contextStateHandler && typeof rawContext.removeEventListener === 'function') {
      rawContext.removeEventListener('statechange', this.contextStateHandler);
      this.contextStateHandler = null;
    }
    if (this.firstInteractionHandler) {
      window.removeEventListener('pointerdown', this.firstInteractionHandler);
      window.removeEventListener('keydown', this.firstInteractionHandler);
      this.firstInteractionHandler = null;
    }
    if (this.bgmRestartTimer) {
      clearTimeout(this.bgmRestartTimer);
      this.bgmRestartTimer = null;
    }
    this.stopBGM();
    this.stopShipEngine(0.05);
    [this.clickSynth, this.chimeSynth, this.wrongSynth, this.coinSynth, this.fanfareSynth, this.sirenSynth]
      .forEach((synth) => synth?.dispose());
    this.clickSynth = null;
    this.chimeSynth = null;
    this.wrongSynth = null;
    this.coinSynth = null;
    this.fanfareSynth = null;
    this.sirenSynth = null;
    this.safetyGraph?.dispose();
    this.safetyGraph = null;
  }
}
