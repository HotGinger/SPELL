# Pitch Perfect Training App

A web-based ear training application that helps you develop perfect pitch by listening to musical notes and singing them back.

## Features

- **Audio Playback**: Plays random musical notes (C through B with sharps)
- **Pitch Detection**: Uses your microphone to detect the note you sing
- **Real-time Feedback**: Instantly shows whether you got the pitch right
- **Score Tracking**: Keeps track of your score and streak
- **Two Input Methods**:
  - Sing the note and let the app detect it automatically
  - Click the note buttons to manually select your answer

## How to Use

1. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, or Safari)
2. Click "Start Training" to begin
3. Allow microphone access when prompted
4. Listen to the note that plays automatically
5. Either:
   - Click "Sing the Note" and sing the pitch you heard
   - Click one of the note buttons to make your selection
6. Get instant feedback on your answer
7. The next round starts automatically after 3 seconds

## Technical Details

### Technologies Used

- **HTML5** for structure
- **CSS3** for styling with gradient backgrounds and animations
- **Vanilla JavaScript** for game logic
- **Web Audio API** for:
  - Playing tones
  - Capturing microphone input
  - Pitch detection using autocorrelation algorithm

### Files

- `index.html` - Main HTML structure and UI
- `style.css` - Styling and animations
- `app.js` - Main application logic and game flow
- `pitchDetector.js` - Pitch detection using autocorrelation

### Pitch Detection Algorithm

The app uses an autocorrelation-based pitch detection algorithm that:
1. Captures audio from your microphone in real-time
2. Analyzes the frequency spectrum
3. Identifies the fundamental frequency
4. Maps it to the nearest musical note

## Browser Requirements

- Modern browser with Web Audio API support
- Microphone access
- HTTPS connection (or localhost for development)

**Note**: Some browsers require HTTPS for microphone access. If testing locally, use a local server or browsers like Chrome which allow microphone on localhost.

## Running Locally

### Option 1: Simple HTTP Server (Python)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

### Option 2: Node.js HTTP Server

```bash
npx http-server
```

### Option 3: VS Code Live Server

If using VS Code, install the "Live Server" extension and click "Go Live".

## Tips for Best Results

- Use headphones to prevent the played note from being picked up by your microphone
- Sing clearly and hold the note for at least 1-2 seconds
- Find a quiet environment to minimize background noise
- Practice matching the pitch as accurately as possible

## Future Enhancements

Potential improvements could include:
- Difficulty levels (showing/hiding the correct note)
- Octave training
- Interval training
- Custom note ranges
- Progress tracking over time
- Leaderboard
- Different sound waveforms (sine, square, triangle, etc.)

## License

MIT License - feel free to use and modify as needed!
