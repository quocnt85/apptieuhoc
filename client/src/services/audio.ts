// Web Audio Synthesizer Engine - 100% Offline & Instant Response

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private isBgmPlaying: boolean = false;
  private bgmMasterGain: GainNode | null = null;
  private bgmOstinatoInterval: ReturnType<typeof setInterval> | null = null;
  private bgmPadInterval: ReturnType<typeof setInterval> | null = null;
  private bgmDroneNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  private bgmNextStepTime = 0;
  private bgmStep = 0;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private reverb: ConvolverNode | null = null;
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

  constructor() {
    // Context initializes on user gesture
    if (typeof window !== 'undefined') {
      const handleFirstInteraction = () => {
        if (this.soundEnabled && !this.isBgmPlaying) {
          this.startBGM();
        }
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
      };
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
      const now = this.ctx.currentTime;
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(0.001, now);
      this.bgmMasterGain.gain.exponentialRampToValueAtTime(1, now + 3.2);
      this.connectToOutput(this.bgmMasterGain);

      // A warm, slowly breathing foundation. The low-pass keeps it cinematic,
      // instead of exposing the buzzy edge of a raw saw oscillator.
      const droneOsc1 = this.ctx.createOscillator();
      const droneOsc2 = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();
      const droneGain = this.ctx.createGain();
      droneOsc1.type = 'triangle';
      droneOsc1.frequency.value = 36.71; // D1
      droneOsc2.type = 'sine';
      droneOsc2.frequency.value = 73.42; // D2
      droneOsc2.detune.value = 4;
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 260;
      droneFilter.Q.value = 0.7;
      droneGain.gain.value = 0.115;
      droneOsc1.connect(droneFilter);
      droneOsc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.bgmMasterGain);
      droneOsc1.start(now);
      droneOsc2.start(now);
      this.bgmDroneNodes = { osc1: droneOsc1, osc2: droneOsc2, gain: droneGain, filter: droneFilter };

      // Dm - Bb - F - C. Eight eighth-notes per chord at 108 BPM.
      // A look-ahead Web Audio scheduler makes timing stable even when React renders.
      const progression = [
        { root: 73.42, notes: [146.83, 220, 293.66, 349.23, 440, 349.23, 293.66, 220] },
        { root: 58.27, notes: [116.54, 174.61, 233.08, 293.66, 349.23, 293.66, 233.08, 174.61] },
        { root: 87.31, notes: [174.61, 261.63, 349.23, 440, 523.25, 440, 349.23, 261.63] },
        { root: 65.41, notes: [130.81, 196, 261.63, 329.63, 392, 329.63, 261.63, 196] },
      ];
      const stepDuration = 60 / 108 / 2;

      const schedulePad = (time: number, chord: typeof progression[number]) => {
        if (!this.ctx || !this.bgmMasterGain) return;
        [chord.notes[0], chord.notes[2], chord.notes[3]].forEach((frequency, index) => {
          if (!this.ctx || !this.bgmMasterGain) return;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();
          osc.type = index === 0 ? 'triangle' : 'sine';
          osc.frequency.value = frequency;
          osc.detune.value = (index - 1) * 5;
          filter.type = 'lowpass';
          filter.frequency.value = 1100;
          gain.gain.setValueAtTime(0.001, time);
          gain.gain.exponentialRampToValueAtTime(0.026, time + 0.8);
          gain.gain.setValueAtTime(0.026, time + 1.55);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 2.2);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.bgmMasterGain);
          if (this.reverb) gain.connect(this.reverb);
          osc.start(time);
          osc.stop(time + 2.25);
        });
      };

      const scheduleStep = (time: number, step: number) => {
        if (!this.ctx || !this.bgmMasterGain) return;
        const chord = progression[Math.floor(step / 8) % progression.length];
        const beat = step % 8;
        if (beat === 0) {
          schedulePad(time, chord);
          this.bgmDroneNodes?.osc1.frequency.setTargetAtTime(chord.root / 2, time, 0.18);
          this.bgmDroneNodes?.osc2.frequency.setTargetAtTime(chord.root, time, 0.18);
          this.bgmDroneNodes?.filter.frequency.setTargetAtTime(220 + chord.root, time, 0.3);
        }

        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = chord.notes[beat];
        filter.type = 'lowpass';
        filter.frequency.value = beat % 4 === 0 ? 1800 : 1250;
        filter.Q.value = 0.9;
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(beat % 4 === 0 ? 0.075 : 0.045, time + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.001, time + stepDuration * 0.82);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmMasterGain);
        if (this.reverb) gain.connect(this.reverb);
        osc.start(time);
        osc.stop(time + stepDuration);

        // Restrained cinematic pulse on beats 1 and 3.
        if (beat === 0 || beat === 4) {
          const pulse = this.ctx.createOscillator();
          const pulseGain = this.ctx.createGain();
          pulse.type = 'sine';
          pulse.frequency.setValueAtTime(chord.root, time);
          pulse.frequency.exponentialRampToValueAtTime(chord.root / 2, time + 0.22);
          pulseGain.gain.setValueAtTime(0.001, time);
          pulseGain.gain.exponentialRampToValueAtTime(0.12, time + 0.012);
          pulseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);
          pulse.connect(pulseGain);
          pulseGain.connect(this.bgmMasterGain);
          pulse.start(time);
          pulse.stop(time + 0.34);
        }
      };

      this.bgmStep = 0;
      this.bgmNextStepTime = now + 0.08;
      const scheduler = () => {
        if (!this.ctx || !this.isBgmPlaying) return;
        while (this.bgmNextStepTime < this.ctx.currentTime + 0.12) {
          scheduleStep(this.bgmNextStepTime, this.bgmStep++);
          this.bgmNextStepTime += stepDuration;
        }
      };
      scheduler();
      this.bgmOstinatoInterval = setInterval(scheduler, 35);

    } catch {}
  }

  public stopBGM() {
    try {
      if (this.bgmOstinatoInterval) {
        clearInterval(this.bgmOstinatoInterval);
        this.bgmOstinatoInterval = null;
      }
      if (this.bgmPadInterval) clearInterval(this.bgmPadInterval);
      this.bgmPadInterval = null;

      if (this.ctx && this.bgmMasterGain) {
        const now = this.ctx.currentTime;
        this.bgmMasterGain.gain.setValueAtTime(this.bgmMasterGain.gain.value, now);
        this.bgmMasterGain.gain.cancelScheduledValues(now);
        this.bgmMasterGain.gain.setTargetAtTime(0.0001, now, 0.22);
      }

      setTimeout(() => {
        if (this.bgmDroneNodes) {
          try {
            this.bgmDroneNodes.osc1.stop();
            this.bgmDroneNodes.osc2.stop();
            this.bgmDroneNodes.osc1.disconnect();
            this.bgmDroneNodes.osc2.disconnect();
          } catch {}
          this.bgmDroneNodes = null;
        }
        if (this.bgmMasterGain) {
          try {
            this.bgmMasterGain.disconnect();
          } catch {}
          this.bgmMasterGain = null;
        }
        this.isBgmPlaying = false;
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
      this.connectToOutput(output, 0.025);

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

      // 1. Tia điện cao áp đánh lửa buồng đốt (2 tiếng spark clicks)
      [0, 0.09].forEach((offset) => {
        if (!this.ctx) return;
        const sparkOsc = this.ctx.createOscillator();
        const sparkGain = this.ctx.createGain();
        sparkOsc.type = 'sawtooth';
        sparkOsc.frequency.setValueAtTime(2800, now + offset);
        sparkOsc.frequency.exponentialRampToValueAtTime(400, now + offset + 0.04);

        sparkGain.gain.setValueAtTime(0.25, now + offset);
        sparkGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);

        sparkOsc.connect(sparkGain);
        this.connectToOutput(sparkGain, 0.04);

        sparkOsc.start(now + offset);
        sparkOsc.stop(now + offset + 0.045);
      });

      // 2. Buồng đốt bốc cháy & rền nổ tăng áp (Booster Ignition Deep Rumble)
      const rumbleOsc = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      const rumbleFilter = this.ctx.createBiquadFilter();

      rumbleOsc.type = 'sawtooth';
      rumbleOsc.frequency.setValueAtTime(45, now + 0.1);
      rumbleOsc.frequency.exponentialRampToValueAtTime(260, now + 0.85);

      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(120, now + 0.1);
      rumbleFilter.frequency.exponentialRampToValueAtTime(550, now + 0.85);
      rumbleFilter.Q.setValueAtTime(2.5, now + 0.1);

      rumbleGain.gain.setValueAtTime(0.01, now + 0.1);
      rumbleGain.gain.linearRampToValueAtTime(0.38, now + 0.4);
      rumbleGain.gain.exponentialRampToValueAtTime(0.02, now + 0.95);

      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      this.connectToOutput(rumbleGain, 0.08);

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
        noiseFilter.frequency.linearRampToValueAtTime(1100, now + 0.7);

        noiseGain.gain.setValueAtTime(0.01, now + 0.15);
        noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.45);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

        noiseNode.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        this.connectToOutput(noiseGain, 0.05);

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
        noiseFilter.frequency.exponentialRampToValueAtTime(2400, now + 0.65);
        noiseFilter.Q.setValueAtTime(3.0, now);

        // Âm lượng phụt lửa mạnh dần ra (Ramp Up)
        noiseGain.gain.setValueAtTime(0.03, now);
        noiseGain.gain.linearRampToValueAtTime(0.48, now + 0.55); // Đỉnh điểm phụt lửa cực mạnh
        noiseGain.gain.exponentialRampToValueAtTime(0.05, now + 1.25);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        this.connectToOutput(noiseGain, 0.04);

        noiseSource.start(now);
        noiseSource.stop(now + 1.3);
      }

      // 2. Sub-bass Plasma Blast (Lực đẩy phản lực rền vang)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(90, now);
      subOsc.frequency.exponentialRampToValueAtTime(450, now + 0.6);
      subOsc.frequency.exponentialRampToValueAtTime(160, now + 1.2);

      subGain.gain.setValueAtTime(0.02, now);
      subGain.gain.linearRampToValueAtTime(0.35, now + 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.25);

      subOsc.connect(subGain);
      this.connectToOutput(subGain, 0.06);

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
        noiseGain.gain.setValueAtTime(0.38, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        this.connectToOutput(noiseGain, 0.04);

        noiseSource.start(now);
        noiseSource.stop(now + 1.1);
      }

      // 2. Tiếng van xả áp hãm phanh retro-rocket hạ dần
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.95);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain);
      this.connectToOutput(gain, 0.12);

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
      gain.gain.linearRampToValueAtTime(0.14, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.65);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.88);
    } catch {}
  }

  // E. Hyperspace: charge -> launch transient -> sub impact -> distant tail.
  public playHyperspeedJump() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const launch = now + 0.72;
      this.duckBGM(1.45, 0.22);

      // Harmonic charge rises in pitch but stays rounded through a low-pass.
      [0, 7].forEach((detune, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        osc.type = index === 0 ? 'triangle' : 'sawtooth';
        osc.detune.value = detune;
        osc.frequency.setValueAtTime(82, now);
        osc.frequency.exponentialRampToValueAtTime(index === 0 ? 760 : 1140, launch);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(4200, launch);
        filter.Q.value = 1.3;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.16 : 0.07, launch - 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, launch + 0.07);
        osc.connect(filter);
        filter.connect(gain);
        this.connectToOutput(gain, 0.22);
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
        band.frequency.exponentialRampToValueAtTime(6800, launch + 0.18);
        band.Q.value = 0.65;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, launch);
        gain.gain.exponentialRampToValueAtTime(0.001, launch + 0.65);
        noise.connect(band);
        band.connect(gain);
        this.connectToOutput(gain, 0.16);
        noise.start(now);
        noise.stop(launch + 0.7);
      }

      // The launch transient is deliberately delayed to match the white flash.
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(105, launch);
      boom.frequency.exponentialRampToValueAtTime(28, launch + 0.72);
      boomGain.gain.setValueAtTime(0.001, launch);
      boomGain.gain.exponentialRampToValueAtTime(0.42, launch + 0.018);
      boomGain.gain.exponentialRampToValueAtTime(0.001, launch + 0.86);
      boom.connect(boomGain);
      this.connectToOutput(boomGain, 0.32);
      boom.start(launch);
      boom.stop(launch + 0.9);
    } catch {}
  }

  // ==========================================
  // 3. UI & GAMEPLAY SOUNDS
  // ==========================================

  // Tiếng bấm nút vui tai
  public playClick() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  // Tiếng trả lời đúng (Keng keng vui vẻ)
  public playCorrect() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Hợp âm Đô trưởng)

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.07);

        gain.gain.setValueAtTime(0.01, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch {}
  }

  // Tiếng khi chọn sai (Âm trầm nhắc nhở nhẹ nhàng)
  public playWrong() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Tiếng nhận xu vàng
  public playCoin() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // Tiếng thăng cấp / hoàn thành bài học (Fanfare)
  public playLevelUp() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.1 }, // C5
        { f: 659.25, d: 0.1 }, // E5
        { f: 783.99, d: 0.1 }, // G5
        { f: 1046.50, d: 0.3 }, // C6
      ];

      let timeOffset = 0;
      melody.forEach(note => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + timeOffset);

        gain.gain.setValueAtTime(0.2, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + note.d);

        timeOffset += note.d * 0.8;
      });
    } catch {}
  }

  // Tiếng còi hú báo động Boss (Red Alert Sci-Fi Siren)
  public playBossAlarmSiren() {
    try {
      if (!this.soundEnabled) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const cycleStart = now + i * 1.0;

        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(440, cycleStart);
        osc1.frequency.linearRampToValueAtTime(880, cycleStart + 0.5);
        osc1.frequency.linearRampToValueAtTime(440, cycleStart + 0.95);

        gain1.gain.setValueAtTime(0.01, cycleStart);
        gain1.gain.linearRampToValueAtTime(0.18, cycleStart + 0.1);
        gain1.gain.setValueAtTime(0.18, cycleStart + 0.7);
        gain1.gain.exponentialRampToValueAtTime(0.001, cycleStart + 0.98);

        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(cycleStart);
        osc1.stop(cycleStart + 0.98);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(110, cycleStart);
        osc2.frequency.linearRampToValueAtTime(220, cycleStart + 0.5);
        osc2.frequency.linearRampToValueAtTime(110, cycleStart + 0.95);

        gain2.gain.setValueAtTime(0.01, cycleStart);
        gain2.gain.linearRampToValueAtTime(0.15, cycleStart + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, cycleStart + 0.98);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(cycleStart);
        osc2.stop(cycleStart + 0.98);
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
}

export const soundService = new SoundEngine();
