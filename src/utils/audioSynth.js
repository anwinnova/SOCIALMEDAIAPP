// Web Audio API Synthesizer & Audio Context Manager for HarmoniSync
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.currentTrackId = null;
    this.timer = null;
    this.frequencyData = new Uint8Array(64);

    // Audio element fallback for MP3s / uploaded files
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = "anonymous";
    this.sourceNode = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.5;

      this.analyser.connect(this.ctx.destination);
      this.gainNode.connect(this.analyser);

      try {
        this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.gainNode);
      } catch (e) {
        // Source already created or handled
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getFrequencyData() {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.frequencyData);
      return this.frequencyData;
    }
    return new Uint8Array(64).fill(0);
  }

  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
    this.audioElement.volume = volume;
  }

  playSyntheticTrack(track) {
    this.initContext();
    this.stop();
    this.currentTrackId = track.id;
    this.isPlaying = true;

    if (track.url) {
      this.audioElement.src = track.url;
      this.audioElement.play().catch(() => {
        this.startSynthPattern(track.genre || 'lofi');
      });
    } else {
      this.startSynthPattern(track.genre || 'lofi');
    }
  }

  startSynthPattern(genre) {
    if (this.timer) clearInterval(this.timer);
    let step = 0;

    const chords = {
      lofi: [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 349.23], // G7
      ],
      synthwave: [
        [110.00, 164.81, 220.00, 277.18], // A minor dark
        [130.81, 196.00, 261.63, 329.63], // C major
        [146.83, 220.00, 293.66, 349.23], // D minor
        [98.00, 146.83, 196.00, 246.94],  // G major
      ],
      chill: [
        [293.66, 369.99, 440.00, 554.37], // Dmaj7
        [246.94, 311.13, 369.99, 440.00], // Bm7
        [196.00, 246.94, 293.66, 369.99], // Gmaj7
        [220.00, 277.18, 329.63, 440.00], // A7
      ]
    };

    const pattern = chords[genre] || chords.lofi;

    const playNote = () => {
      if (!this.isPlaying) return;
      const currentChord = pattern[step % pattern.length];
      step++;

      currentChord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = genre === 'synthwave' ? (i % 2 === 0 ? 'sawtooth' : 'square') : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 1.9);
      });
    };

    playNote();
    this.timer = setInterval(playNote, 2000);
  }

  pause() {
    this.isPlaying = false;
    if (this.audioElement) this.audioElement.pause();
    if (this.timer) clearInterval(this.timer);
  }

  resume() {
    this.initContext();
    this.isPlaying = true;
    if (this.audioElement.src) {
      this.audioElement.play();
    } else {
      this.startSynthPattern('lofi');
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const audioEngine = new AudioEngine();
