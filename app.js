class PitchPerfectApp {
    constructor() {
        this.pitchDetector = new PitchDetector();
        this.audioContext = null;
        this.currentNote = null;
        this.score = 0;
        this.streak = 0;
        this.isListening = false;
        this.isGameActive = false;
        this.detectedNotes = [];
        this.detectionTimeout = null;

        this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        this.initializeUI();
    }

    initializeUI() {
        // Get UI elements
        this.elements = {
            startBtn: document.getElementById('startBtn'),
            playNoteBtn: document.getElementById('playNoteBtn'),
            listenBtn: document.getElementById('listenBtn'),
            currentNote: document.getElementById('currentNote'),
            feedback: document.getElementById('feedback'),
            status: document.getElementById('status'),
            score: document.getElementById('score'),
            streak: document.getElementById('streak'),
            micStatus: document.getElementById('micStatus'),
            noteButtons: document.querySelectorAll('.note-btn')
        };

        // Add event listeners
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.playNoteBtn.addEventListener('click', () => this.playCurrentNote());
        this.elements.listenBtn.addEventListener('click', () => this.toggleListening());

        // Add event listeners to note buttons
        this.elements.noteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isGameActive && !btn.classList.contains('disabled')) {
                    const note = btn.dataset.note;
                    this.checkAnswer(note);
                }
            });
        });
    }

    async startGame() {
        // Initialize audio context
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Initialize pitch detector
        this.updateStatus('Requesting microphone access...');
        const initialized = await this.pitchDetector.initialize();

        if (!initialized) {
            this.updateStatus('Error: Could not access microphone. Please allow microphone access and try again.');
            return;
        }

        this.isGameActive = true;
        this.elements.startBtn.disabled = true;
        this.elements.playNoteBtn.disabled = false;

        this.updateStatus('Training started! Listen to the note and sing it back.');
        this.nextRound();
    }

    nextRound() {
        // Reset feedback
        this.elements.feedback.textContent = '';
        this.elements.feedback.className = 'feedback';

        // Select random note
        this.currentNote = this.notes[Math.floor(Math.random() * this.notes.length)];

        // Show note (or hide it for harder mode - currently showing)
        this.elements.currentNote.textContent = '?';

        // Enable controls
        this.elements.playNoteBtn.disabled = false;
        this.elements.listenBtn.disabled = false;
        this.enableNoteButtons();

        // Play the note
        this.playCurrentNote();
    }

    playCurrentNote() {
        if (!this.currentNote || !this.audioContext) return;

        const frequency = PitchDetector.getNoteFrequency(this.currentNote);
        this.playTone(frequency, 1.5);

        this.updateStatus(`Listen to the note... Now sing it back or click the matching note!`);
    }

    playTone(frequency, duration) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        // Envelope for smoother sound
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        this.isListening = true;
        this.detectedNotes = [];

        this.elements.listenBtn.textContent = 'Stop Listening';
        this.elements.listenBtn.classList.remove('btn-success');
        this.elements.listenBtn.classList.add('btn-danger');
        this.elements.status.classList.add('listening');
        this.elements.micStatus.textContent = '🎤 Listening... Sing the note!';
        this.elements.micStatus.classList.add('active');

        this.disableNoteButtons();

        this.pitchDetector.startListening((note, frequency) => {
            this.detectedNotes.push(note);
            this.elements.micStatus.textContent = `🎤 Detected: ${note} (${Math.round(frequency)}Hz)`;

            // Clear previous timeout
            if (this.detectionTimeout) {
                clearTimeout(this.detectionTimeout);
            }

            // After 2 seconds of consistent detection, check the answer
            this.detectionTimeout = setTimeout(() => {
                if (this.detectedNotes.length > 0) {
                    const mostCommonNote = this.getMostCommonNote(this.detectedNotes);
                    this.stopListening();
                    this.checkAnswer(mostCommonNote);
                }
            }, 2000);
        });
    }

    stopListening() {
        this.isListening = false;
        this.pitchDetector.stopListening();

        this.elements.listenBtn.textContent = 'Sing the Note';
        this.elements.listenBtn.classList.remove('btn-danger');
        this.elements.listenBtn.classList.add('btn-success');
        this.elements.status.classList.remove('listening');
        this.elements.micStatus.textContent = '';
        this.elements.micStatus.classList.remove('active');

        this.enableNoteButtons();

        if (this.detectionTimeout) {
            clearTimeout(this.detectionTimeout);
        }
    }

    getMostCommonNote(notes) {
        const frequency = {};
        let maxCount = 0;
        let mostCommon = notes[0];

        notes.forEach(note => {
            frequency[note] = (frequency[note] || 0) + 1;
            if (frequency[note] > maxCount) {
                maxCount = frequency[note];
                mostCommon = note;
            }
        });

        return mostCommon;
    }

    checkAnswer(userNote) {
        const correct = userNote === this.currentNote;

        // Show the correct note
        this.elements.currentNote.textContent = this.currentNote;

        if (correct) {
            this.score += 10;
            this.streak++;
            this.elements.feedback.textContent = `✓ Correct! It was ${this.currentNote}!`;
            this.elements.feedback.className = 'feedback correct';

            // Play a success sound
            this.playTone(523.25, 0.3); // High C
        } else {
            this.streak = 0;
            this.elements.feedback.textContent = `✗ Not quite. You sang ${userNote}, but it was ${this.currentNote}`;
            this.elements.feedback.className = 'feedback incorrect';

            // Play a lower tone
            this.playTone(196, 0.3); // Low G
        }

        this.updateScore();
        this.disableNoteButtons();

        // Next round after delay
        setTimeout(() => {
            this.nextRound();
        }, 3000);
    }

    updateScore() {
        this.elements.score.textContent = this.score;
        this.elements.streak.textContent = this.streak;
    }

    updateStatus(message) {
        this.elements.status.textContent = message;
    }

    enableNoteButtons() {
        this.elements.noteButtons.forEach(btn => {
            btn.classList.remove('disabled');
        });
    }

    disableNoteButtons() {
        this.elements.noteButtons.forEach(btn => {
            btn.classList.add('disabled');
        });
    }
}

// Initialize app when page loads
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new PitchPerfectApp();
});
