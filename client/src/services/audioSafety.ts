import * as Tone from 'tone';

/**
 * Mandatory output boundary for NovaStars audio.
 *
 * Every Tone.js source must be connected with routeBgm() or routeSfx(). Never
 * connect a source directly to Tone.Destination. Keeping the filters here makes
 * headphone protection apply automatically to future music and sound effects.
 */
export class AudioSafetyGraph {
  private readonly masterGain: Tone.Gain;
  private readonly limiter: Tone.Limiter;
  private readonly compressor: Tone.Compressor;
  private readonly outputMeter: Tone.Meter | null;

  private readonly bgmInput: Tone.Gain;
  private readonly bgmHighpass: Tone.Filter;
  private readonly bgmLowShelf: Tone.Filter;
  private readonly bgmGain: Tone.Gain;
  private readonly bgmReverb: Tone.Reverb | null;
  private readonly bgmChorus: Tone.Chorus | null;

  private readonly sfxInput: Tone.Gain;
  private readonly sfxHighpass: Tone.Filter;
  private readonly sfxPresenceDip: Tone.Filter;
  private readonly sfxLowpass: Tone.Filter;
  private readonly sfxGain: Tone.Gain;
  private readonly sfxReverb: Tone.Reverb | null;

  private readonly nominalBgmGain = 0.75;
  private readonly nominalSfxGain = 0.78;

  constructor() {
    this.masterGain = new Tone.Gain(0.9).toDestination();
    this.limiter = new Tone.Limiter(-1).connect(this.masterGain);
    this.compressor = new Tone.Compressor({
      threshold: -16,
      ratio: 3.5,
      attack: 0.005,
      release: 0.2,
    }).connect(this.limiter);
    let outputMeter: Tone.Meter | null = null;
    try {
      outputMeter = new Tone.Meter({ channelCount: 1, normalRange: true, smoothing: 0.65 });
      this.masterGain.connect(outputMeter);
    } catch (error) {
      outputMeter?.dispose();
      outputMeter = null;
      console.warn('Audio output diagnostics are unavailable.', error);
    }
    this.outputMeter = outputMeter;

    this.bgmGain = new Tone.Gain(this.nominalBgmGain).connect(this.compressor);
    this.bgmLowShelf = new Tone.Filter({
      type: 'lowshelf',
      frequency: 145,
      gain: -4.5,
    }).connect(this.bgmGain);
    this.bgmHighpass = new Tone.Filter({
      type: 'highpass',
      frequency: 58,
      Q: 0.72,
      rolloff: -24,
    }).connect(this.bgmLowShelf);
    this.bgmInput = new Tone.Gain(1).connect(this.bgmHighpass);
    let bgmReverb: Tone.Reverb | null = null;
    let bgmChorus: Tone.Chorus | null = null;
    try {
      bgmReverb = new Tone.Reverb({ decay: 3.2, preDelay: 0.02, wet: 0.32 }).connect(this.bgmInput);
      bgmChorus = new Tone.Chorus({
        frequency: 1.2,
        delayTime: 3.5,
        depth: 0.65,
        wet: 0.22,
      }).connect(bgmReverb).start();
    } catch (error) {
      bgmChorus?.dispose();
      bgmReverb?.dispose();
      bgmChorus = null;
      bgmReverb = null;
      console.warn('Optional BGM spatial effects are unavailable; using the protected dry bus.', error);
    }
    this.bgmReverb = bgmReverb;
    this.bgmChorus = bgmChorus;

    this.sfxGain = new Tone.Gain(this.nominalSfxGain).connect(this.compressor);
    this.sfxLowpass = new Tone.Filter({
      type: 'lowpass',
      frequency: 4800,
      Q: 0.55,
      rolloff: -12,
    }).connect(this.sfxGain);
    this.sfxPresenceDip = new Tone.Filter({
      type: 'peaking',
      frequency: 2750,
      Q: 0.8,
      gain: -4,
    }).connect(this.sfxLowpass);
    this.sfxHighpass = new Tone.Filter({
      type: 'highpass',
      frequency: 52,
      Q: 0.72,
      rolloff: -24,
    }).connect(this.sfxPresenceDip);
    this.sfxInput = new Tone.Gain(1).connect(this.sfxHighpass);
    let sfxReverb: Tone.Reverb | null = null;
    try {
      sfxReverb = new Tone.Reverb({ decay: 2.4, preDelay: 0.015, wet: 0.24 }).connect(this.sfxInput);
    } catch (error) {
      sfxReverb?.dispose();
      sfxReverb = null;
      console.warn('Optional SFX reverb is unavailable; using the protected dry bus.', error);
    }
    this.sfxReverb = sfxReverb;
  }

  public routeBgm<T extends Tone.ToneAudioNode>(source: T, spatial: 'dry' | 'reverb' | 'chorus' = 'dry'): T {
    const destination = spatial === 'chorus'
      ? (this.bgmChorus ?? this.bgmReverb ?? this.bgmInput)
      : spatial === 'reverb'
        ? (this.bgmReverb ?? this.bgmInput)
        : this.bgmInput;
    source.connect(destination);
    return source;
  }

  public routeSfx<T extends Tone.ToneAudioNode>(source: T, spatial: 'dry' | 'reverb' = 'dry'): T {
    source.connect(spatial === 'reverb' ? (this.sfxReverb ?? this.sfxInput) : this.sfxInput);
    return source;
  }

  public fadeBgmIn(duration = 2.5): void {
    const now = Tone.now();
    this.bgmGain.gain.cancelAndHoldAtTime(now);
    this.bgmGain.gain.setValueAtTime(0.0001, now);
    this.bgmGain.gain.exponentialRampToValueAtTime(this.nominalBgmGain, now + duration);
  }

  public fadeBgmOut(duration = 0.8): void {
    const now = Tone.now();
    this.bgmGain.gain.cancelAndHoldAtTime(now);
    this.bgmGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  }

  public duckBgm(holdDuration = 1, depth = 0.35): void {
    const now = Tone.now();
    this.bgmGain.gain.cancelAndHoldAtTime(now);
    this.bgmGain.gain.linearRampToValueAtTime(depth, now + 0.05);
    this.bgmGain.gain.setValueAtTime(depth, now + 0.05 + holdDuration);
    this.bgmGain.gain.linearRampToValueAtTime(this.nominalBgmGain, now + 0.3 + holdDuration);
  }

  public setSfxEnabled(enabled: boolean): void {
    const now = Tone.now();
    this.sfxGain.gain.cancelAndHoldAtTime(now);
    this.sfxGain.gain.linearRampToValueAtTime(enabled ? this.nominalSfxGain : 0, now + 0.04);
  }

  public getOutputLevel(): number {
    const value = this.outputMeter?.getValue() ?? 0;
    return Array.isArray(value) ? Math.max(...value) : value;
  }

  public dispose(): void {
    this.bgmChorus?.stop();
    [
      this.bgmChorus,
      this.bgmReverb,
      this.bgmInput,
      this.bgmHighpass,
      this.bgmLowShelf,
      this.bgmGain,
      this.sfxReverb,
      this.sfxInput,
      this.sfxHighpass,
      this.sfxPresenceDip,
      this.sfxLowpass,
      this.sfxGain,
      this.compressor,
      this.limiter,
      this.masterGain,
      this.outputMeter,
    ].forEach((node) => node?.dispose());
  }
}
