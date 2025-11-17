class PitchDetector {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.rafID = null;
        this.buffer = null;
        this.isListening = false;
    }

    async initialize() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;

            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);

            // Create buffer for time domain data
            this.buffer = new Float32Array(this.analyser.fftSize);

            return true;
        } catch (error) {
            console.error('Error initializing microphone:', error);
            return false;
        }
    }

    startListening(callback, volumeCallback) {
        if (!this.audioContext) {
            console.error('Audio context not initialized');
            return;
        }

        this.isListening = true;
        const detectPitch = () => {
            if (!this.isListening) return;

            // Get time domain data
            this.analyser.getFloatTimeDomainData(this.buffer);

            // Calculate volume (RMS) for visual feedback
            let rms = 0;
            for (let i = 0; i < this.buffer.length; i++) {
                rms += this.buffer[i] * this.buffer[i];
            }
            rms = Math.sqrt(rms / this.buffer.length);

            // Report volume level
            if (volumeCallback) {
                volumeCallback(rms);
            }

            // Detect pitch using autocorrelation
            const pitch = this.autoCorrelate(this.buffer, this.audioContext.sampleRate);

            if (pitch > -1) {
                const note = this.frequencyToNote(pitch);
                callback(note, pitch);
            }

            // Continue listening
            this.rafID = requestAnimationFrame(detectPitch);
        };

        detectPitch();
    }

    stopListening() {
        this.isListening = false;
        if (this.rafID) {
            cancelAnimationFrame(this.rafID);
        }
    }

    autoCorrelate(buffer, sampleRate) {
        // Implement autocorrelation pitch detection algorithm
        const SIZE = buffer.length;
        const MAX_SAMPLES = Math.floor(SIZE / 2);
        let best_offset = -1;
        let best_correlation = 0;
        let rms = 0;

        // Calculate RMS (root mean square) to check if there's enough signal
        for (let i = 0; i < SIZE; i++) {
            const val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);

        // DEBUG: Log RMS level
        if (window.debugPitch) {
            console.log('RMS:', rms.toFixed(4));
        }

        // Not enough signal - lowered threshold for better sensitivity
        if (rms < 0.005) return -1;

        // Find the first peak in autocorrelation
        // Limit search to reasonable pitch range (80Hz to 1000Hz)
        const MIN_OFFSET = Math.floor(sampleRate / 1000); // ~1000Hz max
        const MAX_OFFSET = Math.floor(sampleRate / 80);   // ~80Hz min

        let lastCorrelation = 1;
        for (let offset = MIN_OFFSET; offset < Math.min(MAX_OFFSET, MAX_SAMPLES); offset++) {
            let correlation = 0;

            for (let i = 0; i < MAX_SAMPLES; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }

            correlation = 1 - (correlation / MAX_SAMPLES);

            // Look for first good peak - much more forgiving threshold
            if (correlation > 0.5 && correlation > lastCorrelation) {
                if (correlation > best_correlation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            }

            lastCorrelation = correlation;
        }

        // DEBUG: Log correlation
        if (window.debugPitch) {
            console.log('Best correlation:', best_correlation.toFixed(4), 'Offset:', best_offset);
        }

        // Return frequency if we found a good correlation
        if (best_offset > 0 && best_correlation > 0.3) {
            const frequency = sampleRate / best_offset;
            // Filter out unreasonable frequencies
            if (frequency >= 80 && frequency <= 1000) {
                return frequency;
            }
        }

        return -1;
    }

    frequencyToNote(frequency) {
        // Convert frequency to note name
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Calculate note number (A4 = 440Hz is note 69)
        const noteNum = 12 * (Math.log2(frequency / 440)) + 69;
        const noteIndex = Math.round(noteNum) % 12;
        const noteName = noteNames[noteIndex];

        return noteName;
    }

    // Note frequencies (middle octave - C4 to B4)
    static getNoteFrequency(noteName) {
        const frequencies = {
            'C': 261.63,
            'C#': 277.18,
            'D': 293.66,
            'D#': 311.13,
            'E': 329.63,
            'F': 349.23,
            'F#': 369.99,
            'G': 392.00,
            'G#': 415.30,
            'A': 440.00,
            'A#': 466.16,
            'B': 493.88
        };

        return frequencies[noteName] || 440;
    }

    cleanup() {
        this.stopListening();
        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
