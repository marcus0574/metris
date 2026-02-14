// ===== AUDIO MANAGER =====

class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.musicVolume = 0.2;
        this.sfxVolume = 0.3;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.musicNodes = [];
        this.isMusicPlaying = false;
        this.tempo = 125; // BPM
        this.currentNote = 0;
        this.nextNoteTime = 0;
        this.scheduleAheadTime = 0.1;
        this.lookahead = 25.0;
        this.timerID = null;

        // Cyberpunk Theme Melody (simplified Korobeiniki-ish in minor)
        // Note: frequency, duration (16th notes)
        this.melody = [
            // Measure 1
            { f: 659.25, d: 4 }, { f: 493.88, d: 2 }, { f: 523.25, d: 2 }, // E5, B4, C5
            { f: 587.33, d: 4 }, { f: 523.25, d: 2 }, { f: 493.88, d: 2 }, // D5, C5, B4
            // Measure 2
            { f: 440.00, d: 4 }, { f: 440.00, d: 2 }, { f: 523.25, d: 2 }, // A4, A4, C5
            { f: 659.25, d: 4 }, { f: 587.33, d: 2 }, { f: 523.25, d: 2 }, // E5, D5, C5
            // Measure 3
            { f: 493.88, d: 6 }, { f: 523.25, d: 2 }, // B4, C5
            { f: 587.33, d: 4 }, { f: 659.25, d: 4 }, // D5, E5
            // Measure 4
            { f: 523.25, d: 4 }, { f: 440.00, d: 4 }, // C5, A4
            { f: 440.00, d: 8 }, // A4
            // Bassline loop (implied in scheduler)
        ];
    }

    // Create simple beep sounds using Web Audio API
    createBeep(frequency, duration, volume = 0.3) {
        if (!this.sfxEnabled) return;
        this.resumeContext();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    resumeContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Better simple music player
    startMusic() {
        if (!this.musicEnabled || this.isMusicPlaying) return;
        this.resumeContext();
        this.isMusicPlaying = true;
        this.playMelodyLoop();
    }

    stopMusic() {
        this.isMusicPlaying = false;
        this.musicNodes.forEach(node => {
            try { node.stop(); } catch (e) { }
            try { node.disconnect(); } catch (e) { }
        });
        this.musicNodes = [];
        if (this.timerID) clearTimeout(this.timerID);
    }

    playMelodyLoop() {
        if (!this.isMusicPlaying) return;

        let totalDuration = 0;

        // Synthesize the whole melody loop at once
        const now = this.audioContext.currentTime;
        let noteTime = now;

        this.melody.forEach((note) => {
            if (!this.isMusicPlaying) return;

            const duration = note.d * (60 / this.tempo / 4); // 16th note duration

            // OSC 1 - Sawtooth (Lead)
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.value = note.f;

            // Filter for "cyberpunk" feel
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, noteTime);
            filter.frequency.exponentialRampToValueAtTime(2000, noteTime + 0.1);

            gain.gain.setValueAtTime(0, noteTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume, noteTime + 0.05);
            gain.gain.setValueAtTime(this.musicVolume * 0.8, noteTime + duration - 0.05);
            gain.gain.linearRampToValueAtTime(0, noteTime + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.start(noteTime);
            osc.stop(noteTime + duration);
            this.musicNodes.push(osc);

            // OSC 2 - Square (Bass/Harmony - lower octave)
            if (Math.random() > 0.5) { // Add some random texture
                const osc2 = this.audioContext.createOscillator();
                const gain2 = this.audioContext.createGain();
                osc2.type = 'square';
                osc2.frequency.value = note.f / 2;
                gain2.gain.value = this.musicVolume * 0.3;
                osc2.connect(gain2);
                gain2.connect(this.audioContext.destination);
                osc2.start(noteTime);
                osc2.stop(noteTime + duration);
                this.musicNodes.push(osc2);
            }

            noteTime += duration;
            totalDuration += duration;
        });

        // Bass Pulse (Kick-ish)
        for (let t = 0; t < totalDuration; t += (60 / this.tempo)) {
            this.playKick(now + t);
        }

        // Schedule next loop
        this.timerID = setTimeout(() => {
            this.playMelodyLoop();
        }, (totalDuration * 1000) - 50); // Small overlap adjustment
    }

    playKick(time) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
        gain.gain.setValueAtTime(this.musicVolume * 2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(time);
        osc.stop(time + 0.5);
    }

    playMove() {
        this.createBeep(200, 0.05, 0.2);
    }

    playRotate() {
        this.createBeep(300, 0.08, 0.25);
    }

    playDrop() {
        this.createBeep(150, 0.1, 0.3);
    }

    playLineClear(lines) {
        // Different sounds for different line clears
        const frequencies = [400, 500, 600, 800];
        const freq = frequencies[Math.min(lines - 1, 3)];
        this.createBeep(freq, 0.2, 0.4);
    }

    playLevelUp() {
        // Ascending tone
        setTimeout(() => this.createBeep(400, 0.1, 0.3), 0);
        setTimeout(() => this.createBeep(500, 0.1, 0.3), 100);
        setTimeout(() => this.createBeep(600, 0.15, 0.3), 200);
    }

    playGameOver() {
        this.stopMusic();
        // Descending tone
        setTimeout(() => this.createBeep(400, 0.15, 0.3), 0);
        setTimeout(() => this.createBeep(300, 0.15, 0.3), 150);
        setTimeout(() => this.createBeep(200, 0.3, 0.3), 300);
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startMusic();
        } else {
            this.stopMusic();
        }
        return this.musicEnabled;
    }

    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }
}
