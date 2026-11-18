// Tactile Web Audio Engine (Zero external audio files)
class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  // 1. Subtle UI Tick / Tone (Pill Hover, Key Tap)
  playTone(freq: number = 600, duration = 0.08, type: OscillatorType = 'sine', gainVal = 0.06) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      /* Autoplay fallback */
    }
  }

  // 2. Holographic Snap (Drawer Open, 3D Face Lock)
  playSnapHolo() {
    if (this.muted) return;
    this.playTone(520, 0.12, 'sine', 0.07);
    setTimeout(() => this.playTone(780, 0.18, 'sine', 0.09), 55);
  }

  // 3. Laser Sweep (Action Trigger, Confirmation, Download Launch)
  playLaserShoot() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      /* Ignore */
    }
  }

  // 4. Futuristic Telemetry Click
  playClick() {
    if (this.muted) return;
    this.playTone(850, 0.04, 'triangle', 0.05);
  }

  // 5. Cybernetic Chime (Success / Filter Select)
  playChime() {
    if (this.muted) return;
    this.playTone(440, 0.1, 'sine', 0.05);
    setTimeout(() => this.playTone(660, 0.12, 'sine', 0.06), 40);
    setTimeout(() => this.playTone(880, 0.16, 'sine', 0.07), 80);
  }
}

export const soundEngine = new SoundEngine();

