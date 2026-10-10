// Web Audio API Synthesizer & Music Manager for Constellation of Us

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private bgGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;
  private audioEl: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 1.0;
  private activeTrackIndex: number = 0;

  // Romantic instrumental audio tracks (Primary: from assests folder)
  private tracks: { name: string; url: string }[] = [
    {
      name: "Mia & Seb's Theme (La La Land)",
      url: (import.meta.env.BASE_URL || './').replace(/\/$/, '') + '/la-la-land.mp3'
    },
    {
      name: "Starlight Ambient Piano",
      url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-ambient-112199.mp3"
    },
    {
      name: "Cosmic Serenade",
      url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=starlight-ambient-15949.mp3"
    }
  ];

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play starry chime FX on star tap
  public playStarChime(index: number = 0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Magical pentatonic scale notes (E4, G4, A4, B4, D5, E5, G5, A5, C6)
      const scale = [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00];
      const freq = scale[index % scale.length];

      // Arpeggio notes for extra celestial magic
      const frequencies = [freq, freq * 1.5, freq * 2];

      frequencies.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);

        const startTime = now + i * 0.08;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18 * this.volume, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.2);
      });
    } catch (e) {
      console.warn('Star chime play error:', e);
    }
  }

  // Play magical completion fanfare sound
  public playCompletionFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25]; // C major 7th ethereal chord

      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        const startTime = now + idx * 0.12;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15 * this.volume, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 3.0);
      });
    } catch (e) {
      console.warn('Fanfare error:', e);
    }
  }

  // Play arrow shoot sound (bow twang + starlight whoosh)
  public playArrowShoot() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // String twang oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Celestial arrow flight whistle
      const whistle = this.ctx.createOscillator();
      const wGain = this.ctx.createGain();
      whistle.type = 'sine';
      whistle.frequency.setValueAtTime(600, now + 0.05);
      whistle.frequency.exponentialRampToValueAtTime(1400, now + 0.5);

      wGain.gain.setValueAtTime(0.001, now);
      wGain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.15);
      wGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      whistle.connect(wGain);
      wGain.connect(this.ctx.destination);
      whistle.start(now + 0.05);
      whistle.stop(now + 0.55);
    } catch (e) {
      console.warn('Arrow sound error:', e);
    }
  }

  // Play heart pop sound effect upon arrow impact
  public playHeartPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Pop resonance
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(180, now);
      popOsc.frequency.exponentialRampToValueAtTime(650, now + 0.08);

      popGain.gain.setValueAtTime(0.25 * this.volume, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.12);

      // Magical fairy chime burst
      [1046.5, 1318.5, 1567.98].forEach((freq, idx) => {
        if (!this.ctx) return;
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(freq, now + 0.05 + idx * 0.06);

        cGain.gain.setValueAtTime(0, now + 0.05 + idx * 0.06);
        cGain.gain.linearRampToValueAtTime(0.15 * this.volume, now + 0.08 + idx * 0.06);
        cGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        chime.connect(cGain);
        cGain.connect(this.ctx.destination);
        chime.start(now + 0.05 + idx * 0.06);
        chime.stop(now + 0.8);
      });
    } catch (e) {
      console.warn('Heart pop sound error:', e);
    }
  }

  // Start ambient audio (both HTML5 Audio and fallback Web Audio synth pad)
  public startAmbientAudio() {
    this.initContext();

    // 1. Setup HTML5 Audio element
    if (!this.audioEl) {
      this.audioEl = new Audio();
      this.audioEl.loop = true;
      this.audioEl.volume = 0;
      this.audioEl.src = this.tracks[this.activeTrackIndex].url;
    }

    // Try playing HTML5 Audio with smooth fade in
    this.audioEl.play().then(() => {
      this.fadeInAudio();
    }).catch((err) => {
      console.warn('Audio autoplay prevented, falling back to synth pad:', err);
      // If audio fails, launch Web Audio synth ambient pad!
      this.startSynthAmbientPad();
    });
  }

  private fadeInAudio() {
    if (!this.audioEl) return;
    let v = 0;
    const target = this.isMuted ? 0 : this.volume;
    const interval = setInterval(() => {
      if (!this.audioEl) {
        clearInterval(interval);
        return;
      }
      v += 0.04;
      if (v >= target) {
        this.audioEl.volume = target;
        clearInterval(interval);
      } else {
        this.audioEl.volume = v;
      }
    }, 40);
  }

  // Ethereal ambient synth pad using Web Audio API
  private startSynthAmbientPad() {
    if (this.isAmbientPlaying || !this.ctx) return;
    try {
      this.isAmbientPlaying = true;
      this.bgGain = this.ctx.createGain();
      this.bgGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.bgGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.08 * this.volume, this.ctx.currentTime + 3);

      // Low ambient chord frequencies (A2, E3, A3, C#4)
      const freqs = [110.0, 164.81, 220.0, 277.18];
      freqs.forEach(f => {
        if (!this.ctx || !this.bgGain) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);

        // Subtle LFO modulation for breathing warmth
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.1, this.ctx.currentTime);

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(2.0, this.ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(this.bgGain);
        osc.start();
        lfo.start();

        this.ambientOscillators.push(osc);
      });

      this.bgGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Synth pad error:', e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.audioEl) {
      this.audioEl.volume = muted ? 0 : this.volume;
    }
    if (this.bgGain && this.ctx) {
      this.bgGain.gain.linearRampToValueAtTime(muted ? 0 : 0.08 * this.volume, this.ctx.currentTime + 0.3);
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.audioEl && !this.isMuted) {
      this.audioEl.volume = vol;
    }
    if (this.bgGain && this.ctx && !this.isMuted) {
      this.bgGain.gain.linearRampToValueAtTime(0.08 * vol, this.ctx.currentTime + 0.2);
    }
  }

  public toggleTrack() {
    this.activeTrackIndex = (this.activeTrackIndex + 1) % this.tracks.length;
    if (this.audioEl) {
      this.audioEl.src = this.tracks[this.activeTrackIndex].url;
      if (!this.isMuted) {
        this.audioEl.play().catch(() => {});
      }
    }
    return this.activeTrackIndex;
  }

  public getCurrentTrackName(): string {
    return this.tracks[this.activeTrackIndex]?.name || "Romantic Theme";
  }

  public getTracks() {
    return this.tracks;
  }
}

export const cosmicAudio = new CosmicAudioEngine();
