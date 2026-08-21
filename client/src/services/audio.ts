// Web Audio Synthesizer Engine - 100% Offline & Instant Response

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private isBgmPlaying: boolean = false;
  private bgmMasterGain: GainNode | null = null;
  private bgmToneNodes: { highpass: BiquadFilterNode; lowShelf: BiquadFilterNode } | null = null;
  private bgmOstinatoInterval: ReturnType<typeof setInterval> | null = null;
  private bgmPadInterval: ReturnType<typeof setInterval> | null = null;
  private bgmDroneNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  private bgmNextStepTime = 0;
  private bgmStep = 0;
  private bgmSessionId = 0;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private reverb: ConvolverNode | null = null;
  private sfxInput: GainNode | null = null;
  private engineNodes: {
    noise: AudioBufferSourceNode;
    noiseGain: GainNode;
    noiseFilter: BiquadFilterNode;
    lowOsc: OscillatorNode;
    highOsc: OscillatorNode;
    toneGain: GainNode;
    output: GainNode;
  } | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private firstInteractionHandler: (() => void) | null = null;

  constructor() {
    // Context initializes on user gesture
    if (typeof window !== 'undefined') {
      const handleFirstInteraction = () => {
        if (this.soundEnabled && !this.isBgmPlaying) {
          this.startBGM();
        }
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
        this.firstInteractionHandler = null;
      };
      this.firstInteractionHandler = handleFirstInteraction;
      window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
      window.addEventListener('keydown', handleFirstInteraction, { once: true });
    }
  }

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.ctx && !this.noiseBuffer) {
        // Generate 2 seconds of high quality rocket combustion noise buffer
        const bufferSize = this.ctx.sampleRate * 2;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
      }
      if (this.ctx && !this.masterCompressor) {
        this.masterCompressor = this.ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.value = -16;
        this.masterCompressor.knee.value = 18;
        this.masterCompressor.ratio.value = 4;
        this.masterCompressor.attack.value = 0.006;
        this.masterCompressor.release.value = 0.22;
        this.masterCompressor.connect(this.ctx.destination);

        const impulse = this.ctx.createBuffer(2, this.ctx.sampleRate * 2.6, this.ctx.sampleRate);
        for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
          const data = impulse.getChannelData(channel);
          for (let i = 0; i < data.length; i++) {
            const decay = Math.pow(1 - i / data.length, 2.8);
            data[i] = (Math.random() * 2 - 1) * decay * (i < 180 ? i / 180 : 1);
          }
        }
        this.reverb = this.ctx.createConvolver();
        this.reverb.buffer = impulse;
        const reverbReturn = this.ctx.createGain();
        reverbReturn.gain.value = 0.22;
        this.reverb.connect(reverbReturn);
        reverbReturn.connect(this.masterCompressor);

        // One coherent, headphone-safe tonal boundary for every SFX.
        const sfxInput = this.ctx.createGain();
        const sfxHighpass = this.ctx.createBiquadFilter();
        const sfxPresenceDip = this.ctx.createBiquadFilter();
        const sfxLowpass = this.ctx.createBiquadFilter();
        sfxInput.gain.value = 0.78;
        sfxHighpass.type = 'highpass';
        sfxHighpass.frequency.value = 52;
        sfxPresenceDip.type = 'peaking';
        sfxPresenceDip.frequency.value = 2750;
        sfxPresenceDip.Q.value = 0.8;
        sfxPresenceDip.gain.value = -4;
        sfxLowpass.type = 'lowpass';
        sfxLowpass.frequency.value = 4800;
        sfxLowpass.Q.value = 0.55;
        sfxInput.connect(sfxHighpass);
        sfxHighpass.connect(sfxPresenceDip);
        sfxPresenceDip.connect(sfxLowpass);
        sfxLowpass.connect(this.masterCompressor);
        this.sfxInput = sfxInput;
      }
    } catch {}
  }

  private connectToOutput(node: AudioNode, reverbAmount = 0) {
    if (!this.ctx) return;
    node.connect(this.masterCompressor || this.ctx.destination);
    if (reverbAmount > 0 && this.reverb) {
      const send = this.ctx.createGain();
      send.gain.value = reverbAmount;
      node.connect(send);
      send.connect(this.reverb);
    }
  }

  private connectSfx(node: AudioNode, reverbAmount = 0) {
    if (!this.ctx) return;
    node.connect(this.sfxInput || this.masterCompressor || this.ctx.destination);
    if (reverbAmount > 0 && this.reverb) {
      const send = this.ctx.createGain();
      send.gain.value = reverbAmount;
      node.connect(send);
      send.connect(this.reverb);
    }
  }

  private duckBGM(duration = 1.2, depth = 0.42) {
    if (!this.ctx || !this.bgmMasterGain) return;
    const now = this.ctx.currentTime;
    const gain = this.bgmMasterGain.gain;
    gain.cancelScheduledValues(now);
    gain.setTargetAtTime(depth, now, 0.035);
    gain.setTargetAtTime(1, now + duration, 0.3);
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
  }

  // ==========================================
  // 1. EPIC CINEMATIC SPACE ODYSSEY BGM
  // Nhạc nền vũ trụ hoành tráng, hùng tráng, phiêu lưu
  // ==========================================
  public startBGM() {
    try {
      if (!this.soundEnabled || this.isBgmPlaying) return;
      this.initContext();
      if (!this.ctx) return;

      this.isBgmPlaying = true;
      const sessionId = ++this.bgmSessionId;
      const now = this.ctx.currentTime;
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(0.001, now);
      this.bgmMasterGain.gain.exponentialRampToValueAtTime(1, now + 3.2);
      // Remove continuous sub pressure before compression. Pure low-frequency
      // oscillators are especially fatiguing on sealed headphones.
      const bgmHighpass = this.ctx.createBiquadFilter();
      const bgmLowShelf = this.ctx.createBiquadFilter();
      bgmHighpass.type = 'highpass';
      bgmHighpass.frequency.value = 58;
      bgmHighpass.Q.value = 0.72;
      bgmLowShelf.type = 'lowshelf';
      bgmLowShelf.frequency.value = 145;
      bgmLowShelf.gain.value = -4.5;
      this.bgmMasterGain.connect(bgmHighpass);
      bgmHighpass.connect(bgmLowShelf);
      this.connectToOutput(bgmLowShelf);
      this.bgmToneNodes = { highpass: bgmHighpass, lowShelf: bgmLowShelf };

      // A warm, slowly breathing foundation. The low-pass keeps it cinematic,
      // instead of exposing the buzzy edge of a raw saw oscillator.
      const droneOsc1 = this.ctx.createOscillator();
      const droneOsc2 = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();
      const droneGain = this.ctx.createGain();
      droneOsc1.type = 'triangle';
      droneOsc1.frequency.value = 73.42; // D2 - no sustained sub octave
      droneOsc2.type = 'sine';
      droneOsc2.frequency.value = 146.83; // D3
      droneOsc2.detune.value = 4;
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 260;
      droneFilter.Q.value = 0.7;
      droneGain.gain.value = 0.042;
      droneOsc1.connect(droneFilter);
      droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.bgmMasterGain);
      droneOsc1.start(now);
      droneOsc2.start(now);
      this.bgmDroneNodes = { osc1: droneOsc1, osc2: droneOsc2, gain: droneGain, filter: droneFilter };

      // Slow orchestral harmony. Long envelopes and layered, filtered harmonics
      // replace the old short 1/8-note arpeggio that read as chip-tune.
      const progression = [
        { root: 73.42, strings: [146.83, 174.61, 220, 293.66], brass: [146.83, 220, 293.66] }, // Dm
        { root: 58.27, strings: [116.54, 146.83, 174.61, 233.08], brass: [116.54, 174.61, 233.08] }, // Bb
        { root: 87.31, strings: [130.81, 174.61, 220, 261.63], brass: [174.61, 261.63, 349.23] }, // F/C
        { root: 65.41, strings: [130.81, 164.81, 196, 261.63], brass: [130.81, 196, 261.63] }, // C
        { root: 49.00, strings: [98, 116.54, 146.83, 196], brass: [98, 146.83, 196] }, // Gm
        { root: 58.27, strings: [116.54, 146.83, 174.61, 233.08], brass: [116.54, 174.61, 233.08] }, // Bb
        { root: 55.00, strings: [110, 146.83, 164.81, 220], brass: [110, 164.81, 220] }, // Asus4
        { root: 55.00, strings: [110, 138.59, 164.81, 220], brass: [110, 164.81, 220] }, // A
      ];
      const beatDuration = 60 / 72;
      const barDuration = beatDuration * 4;

      const stringWave = this.ctx.createPeriodicWave(
        new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]),
        new Float32Array([0, 1, 0.46, 0.25, 0.14, 0.09, 0.055, 0.03]),
        { disableNormalization: false }
      );
      const brassWave = this.ctx.createPeriodicWave(
        new Float32Array([0, 0, 0, 0, 0, 0, 0]),
        new Float32Array([0, 1, 0.72, 0.48, 0.3, 0.16, 0.08]),
        { disableNormalization: false }
      );

      const scheduleStrings = (time: number, chord: typeof progression[number]) => {
        if (!this.ctx || !this.bgmMasterGain) return;
        chord.strings.forEach((frequency, noteIndex) => {
          if (!this.ctx || !this.bgmMasterGain) return;
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();
          const panner = this.ctx.createStereoPanner();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(620, time);
          filter.frequency.exponentialRampToValueAtTime(1550, time + barDuration * 0.45);
          filter.frequency.exponentialRampToValueAtTime(760, time + barDuration);
          filter.Q.value = 0.55;
          panner.pan.value = (noteIndex - 1.5) * 0.28;
          gain.gain.setValueAtTime(0.001, time);
          gain.gain.exponentialRampToValueAtTime(0.009, time + 1.15);
          gain.gain.setValueAtTime(0.009, time + barDuration - 0.65);
          gain.gain.exponentialRampToValueAtTime(0.001, time + barDuration + 1.05);
          filter.connect(gain);
          gain.connect(panner);
          panner.connect(this.bgmMasterGain);
          if (this.reverb) panner.connect(this.reverb);

          // Three subtly detuned players create a string-section chorus.
          [-7, 0, 6].forEach((detune) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            osc.setPeriodicWave(stringWave);
            osc.frequency.value = frequency;
            osc.detune.setValueAtTime(detune - 1.5, time);
            osc.detune.linearRampToValueAtTime(detune + 1.8, time + barDuration * 0.5);
            osc.detune.linearRampToValueAtTime(detune - 0.8, time + barDuration);
            osc.connect(filter);
            // Tiny start offsets avoid every synthesized player sharing one phase.
            const playerOffset = noteIndex * 0.004 + (detune + 7) * 0.0007;
            osc.start(time + playerOffset);
            osc.stop(time + barDuration + 1.1);
          });
        });
      };

      const scheduleBrassSwell = (time: number, chord: typeof progression[number], intensity: number) => {
        if (!this.ctx || !this.bgmMasterGain) return;
        chord.brass.forEach((frequency, index) => {
          if (!this.ctx || !this.bgmMasterGain) return;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();
          osc.setPeriodicWave(brassWave);
          osc.frequency.value = frequency;
          osc.detune.value = (index - 1) * 3;
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(420, time);
          filter.frequency.exponentialRampToValueAtTime(1350, time + 0.65);
          filter.frequency.exponentialRampToValueAtTime(520, time + 2.35);
          filter.Q.value = 1.1;
          gain.gain.setValueAtTime(0.001, time);
          gain.gain.exponentialRampToValueAtTime(0.035 * intensity, time + 0.55);
          gain.gain.setValueAtTime(0.035 * intensity, time + 1.35);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 2.5);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.bgmMasterGain);
          if (this.reverb) gain.connect(this.reverb);
          osc.start(time);
          osc.stop(time + 2.55);
        });
      };

      const scheduleTimpani = (time: number, root: number, intensity: number) => {
        if (!this.ctx || !this.bgmMasterGain) return;
        const drum = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        drum.type = 'sine';
        drum.frequency.setValueAtTime(root * 1.35, time);
        drum.frequency.exponentialRampToValueAtTime(root * 0.62, time + 0.34);
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.075 * intensity, time + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.58);
        drum.connect(gain);
        gain.connect(this.bgmMasterGain);
        if (this.reverb) gain.connect(this.reverb);
        drum.start(time);
        drum.stop(time + 0.62);
      };

      const scheduleStep = (time: number, step: number) => {
        if (!this.ctx || !this.bgmMasterGain) return;
        const chordIndex = Math.floor(step / 4) % progression.length;
        const chord = progression[chordIndex];
        const beat = step % 4;
        if (beat === 0) {
          scheduleStrings(time, chord);
          this.bgmDroneNodes?.osc1.frequency.setTargetAtTime(chord.root, time, 0.28);
          this.bgmDroneNodes?.osc2.frequency.setTargetAtTime(chord.root * 2, time, 0.28);
          this.bgmDroneNodes?.filter.frequency.setTargetAtTime(190 + chord.root, time, 0.45);
          scheduleTimpani(time, chord.root, chordIndex === 0 || chordIndex === 6 ? 1 : 0.68);

          // Brass enters as phrases, leaving alternate bars airy and spacious.
          if (chordIndex === 0 || chordIndex === 2 || chordIndex === 4 || chordIndex === 6) {
            scheduleBrassSwell(time + 0.12, chord, chordIndex === 6 ? 1.18 : 0.82);
          }
        }
        if (beat === 2) {
          scheduleTimpani(time, chord.root, 0.32);
        }
      };

      this.bgmStep = 0;
      this.bgmNextStepTime = now + 0.08;
      const scheduler = () => {
        if (!this.ctx || !this.isBgmPlaying || sessionId !== this.bgmSessionId) return;
        while (this.bgmNextStepTime < this.ctx.currentTime + 0.12) {
          scheduleStep(this.bgmNextStepTime, this.bgmStep++);
          this.bgmNextStepTime += beatDuration;
        }
      };
      scheduler();
      this.bgmOstinatoInterval = setInterval(scheduler, 35);

    } catch {}
  }

  public stopBGM() {
    try {
      this.bgmSessionId++;
      if (this.bgmOstinatoInterval) {
        clearInterval(this.bgmOstinatoInterval);
        this.bgmOstinatoInterval = null;
      }
      if (this.bgmPadInterval) clearInterval(this.bgmPadInterval);
      this.bgmPadInterval = null;

      const fadingMaster = this.bgmMasterGain;
      const fadingDrone = this.bgmDroneNodes;
      const fadingTone = this.bgmToneNodes;
      this.bgmMasterGain = null;
      this.bgmDroneNodes = null;
      this.bgmToneNodes = null;
      this.isBgmPlaying = false;

      if (this.ctx && fadingMaster) {
        const now = this.ctx.currentTime;
        fadingMaster.gain.cancelScheduledValues(now);
        fadingMaster.gain.setValueAtTime(Math.max(0.0001, fadingMaster.gain.value), now);
        fadingMaster.gain.setTargetAtTime(0.0001, now, 0.22);
      }

      setTimeout(() => {
        if (fadingDrone) {
          try {
            fadingDrone.osc1.stop();
            fadingDrone.osc2.stop();
            fadingDrone.osc1.disconnect();
            fadingDrone.osc2.disconnect();
          } catch {}
        }
        if (fadingMaster) {
          try {
            fadingMaster.disconnect();
          } catch {}
        }
        if (fadingTone) {
          try {
            fadingTone.highpass.disconnect();
            fadingTone.lowShelf.disconnect();
          } catch {}
        }
      }, 1200);
    } catch {
      this.isBgmPlaying = false;
    }
  }

  // ==========================================
  // 2. SFX ĐỘNG CƠ TÊN LỬA ĐẨY VẬT LÝ THỰC TẾ
  // Khởi động đánh lửa, Phụt lửa mạnh dần, Giảm tốc yếu dần
  // ==========================================

  /** Continuous engine bed. Power can be animated without retriggering samples. */
  public startShipEngine(initialPower = 0.12) {
    try {
      if (!this.soundEnabled || this.engineNodes) return;
      this.initContext();
      if (!this.ctx || !this.noiseBuffer) return;
      const now = this.ctx.currentTime;
      const output = this.ctx.createGain();
      const noise = this.ctx.createBufferSource();
      const noiseFilter = this.ctx.createBiquadFilter();
      const noiseGain = this.ctx.createGain();
      const lowOsc = this.ctx.createOscillator();
      const highOsc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();

      noise.buffer = this.noiseBuffer;
      noise.loop = true;
      noiseFilter.type = 'lowpass';
      noiseFilter.Q.value = 0.65;
      lowOsc.type = 'sine';
      highOsc.type = 'triangle';
      highOsc.detune.value = 7;
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(output);
      lowOsc.connect(toneGain);
      highOsc.connect(toneGain);
      toneGain.connect(output);
      output.gain.setValueAtTime(0.001, now);
      this.connectSfx(output, 0.018);

      noise.start(now, Math.random() * 1.5);
      lowOsc.start(now);
      highOsc.start(now);
      this.engineNodes = { noise, noiseGain, noiseFilter, lowOsc, highOsc, toneGain, output };
      this.setShipEnginePower(initialPower, true);
    } catch {}
  }

  public setShipEnginePower(power: number, immediate = false) {
    if (!this.ctx || !this.engineNodes) return;
    const p = Math.max(0.04, Math.min(1, power));
    const now = this.ctx.currentTime;
    const timeConstant = immediate ? 0.01 : 0.09;
    this.engineNodes.output.gain.setTargetAtTime(0.035 + p * 0.19, now, timeConstant);
    this.engineNodes.noiseGain.gain.setTargetAtTime(0.08 + p * 0.32, now, timeConstant);
    this.engineNodes.toneGain.gain.setTargetAtTime(0.035 + p * 0.08, now, timeConstant);
    this.engineNodes.noiseFilter.frequency.setTargetAtTime(260 + p * 1650, now, timeConstant);
    this.engineNodes.lowOsc.frequency.setTargetAtTime(46 + p * 34, now, timeConstant);
    this.engineNodes.highOsc.frequency.setTargetAtTime(92 + p * 96, now, timeConstant);
  }

  public stopShipEngine(release = 0.65) {
    if (!this.ctx || !this.engineNodes) return;
    const nodes = this.engineNodes;
    this.engineNodes = null;
    const now = this.ctx.currentTime;
    nodes.output.gain.cancelScheduledValues(now);
    nodes.output.gain.setTargetAtTime(0.0001, now, Math.max(0.04, release / 4));
    window.setTimeout(() => {
      try {
        nodes.noise.stop();
        nodes.lowOsc.stop();
        nodes.highOsc.stop();
        nodes.output.disconnect();
      } catch {}
    }, release * 1000 + 220);
  }

  // A. Tiếng Khởi Động Đánh Lửa Tên Lửa Đẩy (Ignition Sparks & Booster Roar)
  public playEngineStart() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.duckBGM(0.9, 0.62);

      // Muted ignition relays: short and tactile, without a piercing spark.
      [0, 0.09].forEach((offset) => {
        if (!this.ctx) return;
        const sparkOsc = this.ctx.createOscillator();
        const sparkGain = this.ctx.createGain();
        const sparkFilter = this.ctx.createBiquadFilter();
        sparkOsc.type = 'triangle';
        sparkOsc.frequency.setValueAtTime(1050, now + offset);
        sparkOsc.frequency.exponentialRampToValueAtTime(380, now + offset + 0.065);
        sparkFilter.type = 'lowpass';
        sparkFilter.frequency.value = 1450;

        sparkGain.gain.setValueAtTime(0.001, now + offset);
        sparkGain.gain.linearRampToValueAtTime(0.045, now + offset + 0.008);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.065);

        sparkOsc.connect(sparkFilter);
        sparkFilter.connect(sparkGain);
        this.connectSfx(sparkGain, 0.025);

        sparkOsc.start(now + offset);
        sparkOsc.stop(now + offset + 0.07);
      });

      // 2. Buồng đốt bốc cháy & rền nổ tăng áp (Booster Ignition Deep Rumble)
      const rumbleOsc = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      const rumbleFilter = this.ctx.createBiquadFilter();

      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.setValueAtTime(74, now + 0.1);
      rumbleOsc.frequency.exponentialRampToValueAtTime(148, now + 0.85);

      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(210, now + 0.1);
      rumbleFilter.frequency.exponentialRampToValueAtTime(520, now + 0.85);
      rumbleFilter.Q.setValueAtTime(0.7, now + 0.1);

      rumbleGain.gain.setValueAtTime(0.01, now + 0.1);
      rumbleGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      rumbleGain.gain.exponentialRampToValueAtTime(0.002, now + 0.95);

      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      this.connectSfx(rumbleGain, 0.055);

      rumbleOsc.start(now + 0.1);
      rumbleOsc.stop(now + 1.0);

      // 3. Phun luồng khí nạp áp lực (Noise Burst)
      if (this.noiseBuffer) {
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = this.noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(450, now + 0.15);
        noiseFilter.frequency.linearRampToValueAtTime(850, now + 0.7);
        noiseFilter.Q.value = 0.7;

        noiseGain.gain.setValueAtTime(0.01, now + 0.15);
        noiseGain.gain.linearRampToValueAtTime(0.11, now + 0.45);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        this.connectSfx(noiseGain, 0.035);

        noiseNode.start(now + 0.15);
        noiseNode.stop(now + 1.0);
      }
    } catch {}
  }

  // B. Tiếng Tên Lửa Đẩy Phụt Lửa Mạnh Dần Ra (Rocket Thruster Roar - Ramp Up)
  public playShipAccelerate() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.duckBGM(1.2, 0.5);

      // 1. Phụt lửa buồng đốt gầm thét cực đại (Noise Roar Ramp Up)
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(250, now);
        // Quét mở rộng tần số lửa phụt mạnh dần ra
        noiseFilter.frequency.exponentialRampToValueAtTime(1750, now + 0.65);
        noiseFilter.Q.setValueAtTime(0.7, now);

        // Âm lượng phụt lửa mạnh dần ra (Ramp Up)
        noiseGain.gain.setValueAtTime(0.03, now);
        noiseGain.gain.linearRampToValueAtTime(0.16, now + 0.55);
        noiseGain.gain.exponentialRampToValueAtTime(0.015, now + 1.25);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        this.connectSfx(noiseGain, 0.025);

        noiseSource.start(now);
        noiseSource.stop(now + 1.3);
      }

      // Rounded plasma body; no buzzy saw or sub-heavy sweep.
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      const subFilter = this.ctx.createBiquadFilter();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(82, now);
      subOsc.frequency.exponentialRampToValueAtTime(172, now + 0.6);
      subOsc.frequency.exponentialRampToValueAtTime(118, now + 1.2);
      subFilter.type = 'lowpass';
      subFilter.frequency.value = 520;

      subGain.gain.setValueAtTime(0.02, now);
      subGain.gain.linearRampToValueAtTime(0.095, now + 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      this.connectSfx(subGain, 0.035);

      subOsc.start(now);
      subOsc.stop(now + 1.3);
    } catch {}
  }

  // C. Tiếng Lửa Phản Lực Yếu Dần Đi Khi Giảm Tốc (Thruster Decay & Retro-Brake)
  public playShipDecelerate() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this.duckBGM(0.8, 0.68);

      // 1. Lửa phản lực yếu dần đi (Noise Thruster Decay)
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(1800, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(160, now + 1.0);

        // Lửa yếu dần đi từ mạnh -> êm ả tắt hẳn
        noiseGain.gain.setValueAtTime(0.13, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        this.connectSfx(noiseGain, 0.025);

        noiseSource.start(now);
        noiseSource.stop(now + 1.1);
      }

      // 2. Tiếng van xả áp hãm phanh retro-rocket hạ dần
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(105, now + 0.95);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain);
      this.connectSfx(gain, 0.065);

      osc.start(now);
      osc.stop(now + 1.05);
    } catch {}
  }

  // D. Tiếng Phi Thuyền Đang Di Chuyển / Du Hành Quỹ Đạo (Orbital Cruising Hum)
  public playShipCruising() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.4);
      osc.frequency.linearRampToValueAtTime(190, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.65);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      this.connectSfx(gain, 0.035);

      osc.start(now);
      osc.stop(now + 0.88);
    } catch {}
  }

  // E. Hyperspace: charge -> launch transient -> sub impact -> distant tail.
  public playHyperspeedJump(durationSeconds = 1.6) {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = Math.max(1.2, Math.min(4, durationSeconds));
      const launch = now + duration * 0.45;
      const tail = duration * 0.48;
      this.duckBGM(duration * 0.92, 0.22);

      // Harmonic charge rises in pitch but stays rounded through a low-pass.
      [0, 7].forEach((detune, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = index === 0 ? 'triangle' : 'sawtooth';
        osc.detune.value = detune;
        osc.frequency.setValueAtTime(82, now);
        osc.frequency.exponentialRampToValueAtTime(index === 0 ? 620 : 880, launch);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(2400, launch);
        filter.Q.value = 0.75;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.085 : 0.035, launch - 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, launch + 0.07);
        osc.connect(filter);
        filter.connect(gain);
        this.connectSfx(gain, 0.13);
        osc.start(now);
        osc.stop(launch + 0.1);
      });

      // Broadband tunnel rush, widening as the ship commits to the jump.
      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        const band = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        noise.buffer = this.noiseBuffer;
        band.type = 'bandpass';
        band.frequency.setValueAtTime(420, now);
        band.frequency.exponentialRampToValueAtTime(3200, launch + tail * 0.2);
        band.Q.value = 0.65;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.105, launch);
        gain.gain.exponentialRampToValueAtTime(0.001, launch + tail * 0.9);
        noise.connect(band);
        band.connect(gain);
        this.connectSfx(gain, 0.1);
        noise.start(now);
        noise.stop(launch + tail);
      }

      // The launch transient is deliberately delayed to match the white flash.
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(105, launch);
      boom.frequency.exponentialRampToValueAtTime(52, launch + tail * 0.82);
      boomGain.gain.setValueAtTime(0.001, launch);
      boomGain.gain.exponentialRampToValueAtTime(0.17, launch + 0.028);
      boomGain.gain.exponentialRampToValueAtTime(0.001, launch + tail * 0.96);
      boom.connect(boomGain);
      this.connectSfx(boomGain, 0.2);
      boom.start(launch);
      boom.stop(launch + tail);
    } catch {}
  }

  // ==========================================
  // 3. UI & GAMEPLAY SOUNDS
  // ==========================================

  // Muted cockpit control: tactile and warm, never a bright UI beep.
  public playClick() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(285, now);
      osc.frequency.exponentialRampToValueAtTime(205, now + 0.085);
      filter.type = 'lowpass';
      filter.frequency.value = 850;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.038, now + 0.009);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(filter);
      filter.connect(gain);
      this.connectSfx(gain, 0.008);
      osc.start(now);
      osc.stop(now + 0.095);
    } catch {}
  }

  // Warm confirmation chord, voiced below the fatiguing upper register.
  public playCorrect() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [293.66, 369.99, 440]; // D4, F#4, A4

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.055;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        osc.detune.value = (idx - 1) * 2;
        filter.type = 'lowpass';
        filter.frequency.value = 1350;

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.046, start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.48);

        osc.connect(filter);
        filter.connect(gain);
        this.connectSfx(gain, 0.1);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch {}
  }

  // Gentle two-part warning; informative rather than punitive.
  public playWrong() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [0, 0.17].forEach((offset, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const start = now + offset;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(index === 0 ? 196 : 174.61, start);
        osc.frequency.exponentialRampToValueAtTime(index === 0 ? 174.61 : 155.56, start + 0.19);
        filter.type = 'lowpass';
        filter.frequency.value = 620;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.052, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.24);
        osc.connect(filter);
        filter.connect(gain);
        this.connectSfx(gain, 0.035);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    } catch {}
  }

  // Compact energy pickup with a rounded sci-fi shimmer.
  public playCoin() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [440, 554.37].forEach((frequency, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const start = now + index * 0.075;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency * 0.96, start);
        osc.frequency.exponentialRampToValueAtTime(frequency, start + 0.12);
        filter.type = 'lowpass';
        filter.frequency.value = 1550;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.048, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.34);
        osc.connect(filter);
        filter.connect(gain);
        this.connectSfx(gain, 0.085);
        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {}
  }

  // Restrained cinematic fanfare, sharing the BGM's orchestral register.
  public playLevelUp() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const melody = [
        { f: 293.66, d: 0.34 },
        { f: 369.99, d: 0.34 },
        { f: 440, d: 0.42 },
        { f: 587.33, d: 0.72 },
      ];

      let timeOffset = 0;
      melody.forEach(note => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        const start = now + timeOffset;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, start);
        filter.type = 'lowpass';
        filter.frequency.value = 1450;

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.052, start + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(filter);
        filter.connect(gain);
        this.connectSfx(gain, 0.14);

        osc.start(start);
        osc.stop(start + note.d + 0.02);

        timeOffset += note.d * 0.72;
      });
    } catch {}
  }

  // Low, filtered red-alert pulse matching the cinematic spacecraft palette.
  public playBossAlarmSiren() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const cycleStart = now + i * 1.0;

        const osc1 = this.ctx.createOscillator();
        const filter1 = this.ctx.createBiquadFilter();
        const gain1 = this.ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(185, cycleStart);
        osc1.frequency.linearRampToValueAtTime(246.94, cycleStart + 0.42);
        osc1.frequency.linearRampToValueAtTime(185, cycleStart + 0.9);
        filter1.type = 'lowpass';
        filter1.frequency.value = 760;

        gain1.gain.setValueAtTime(0.01, cycleStart);
        gain1.gain.linearRampToValueAtTime(0.065, cycleStart + 0.12);
        gain1.gain.setValueAtTime(0.065, cycleStart + 0.58);
        gain1.gain.exponentialRampToValueAtTime(0.001, cycleStart + 0.92);

        osc1.connect(filter1);
        filter1.connect(gain1);
        this.connectSfx(gain1, 0.08);
        osc1.start(cycleStart);
        osc1.stop(cycleStart + 0.94);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(92.5, cycleStart);
        osc2.frequency.linearRampToValueAtTime(123.47, cycleStart + 0.42);
        osc2.frequency.linearRampToValueAtTime(92.5, cycleStart + 0.9);

        gain2.gain.setValueAtTime(0.01, cycleStart);
        gain2.gain.linearRampToValueAtTime(0.042, cycleStart + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, cycleStart + 0.92);

        osc2.connect(gain2);
        this.connectSfx(gain2, 0.04);
        osc2.start(cycleStart);
        osc2.stop(cycleStart + 0.94);
      }
    } catch {}
  }

  public playVictory() {
    this.playLevelUp();
  }

  public playSelect() {
    this.playClick();
  }

  public playTap() {
    this.playClick();
  }

  public toggleSound(enabled?: boolean) {
    if (typeof enabled === 'boolean') {
      this.soundEnabled = enabled;
    } else {
      this.soundEnabled = !this.soundEnabled;
    }
    if (this.soundEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
  }

  public dispose() {
    if (this.firstInteractionHandler) {
      window.removeEventListener('pointerdown', this.firstInteractionHandler);
      window.removeEventListener('keydown', this.firstInteractionHandler);
      this.firstInteractionHandler = null;
    }
    this.stopBGM();
    this.stopShipEngine(0.05);
    const context = this.ctx;
    this.ctx = null;
    if (context && context.state !== 'closed') {
      window.setTimeout(() => context.close().catch(() => {}), 80);
    }
  }
}

declare global {
  interface Window {
    __novaStarsSoundEngine?: SoundEngine;
  }
}

export const soundService = typeof window === 'undefined'
  ? new SoundEngine()
  : (window.__novaStarsSoundEngine ??= new SoundEngine());

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    soundService.dispose();
    delete window.__novaStarsSoundEngine;
  });
}
