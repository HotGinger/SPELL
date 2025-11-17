# CLAUDE.md - AI Assistant Guide for SPELL (Pitch Perfect Training)

## Project Overview

**SPELL** is a web-based ear training application that helps users develop perfect pitch by listening to musical notes and singing them back. The application uses Web Audio API for pitch detection and provides real-time feedback on pitch accuracy.

**Repository**: HotGinger/SPELL
**Primary Language**: JavaScript (ES6+)
**Type**: Static Web Application
**Deployment**: Vercel

## Codebase Structure

```
SPELL/
├── index.html          # Main HTML structure and UI
├── app.js             # Main application logic (PitchPerfectApp class)
├── pitchDetector.js   # Pitch detection algorithm (PitchDetector class)
├── style.css          # Styling, animations, and responsive design
├── vercel.json        # Vercel deployment configuration
├── .vercelignore      # Files to exclude from Vercel deployment
└── README.md          # User-facing documentation
```

### File Purposes

- **index.html** (90 lines): Contains the complete UI structure including score board, game controls, note buttons, volume meter, and instructions
- **app.js** (272 lines): Main game logic with `PitchPerfectApp` class handling game flow, user interactions, scoring, and audio playback
- **pitchDetector.js** (190 lines): Contains `PitchDetector` class implementing autocorrelation-based pitch detection algorithm
- **style.css** (348 lines): Full styling with gradient backgrounds, animations (pulse, bounceIn, shake), and responsive design
- **vercel.json** (18 lines): Deployment configuration with microphone permissions header

## Technology Stack

### Core Technologies
- **HTML5**: Semantic markup, data attributes
- **CSS3**: Grid/Flexbox layouts, animations, gradients, media queries
- **Vanilla JavaScript (ES6+)**: Classes, async/await, arrow functions, modules

### Web APIs
- **Web Audio API**:
  - AudioContext for audio processing
  - OscillatorNode for tone generation
  - AnalyserNode for frequency analysis
  - MediaStreamSource for microphone input
- **MediaDevices API**: getUserMedia for microphone access
- **requestAnimationFrame**: For continuous pitch detection loop

### No Build System
This project uses vanilla JavaScript with no bundler, transpiler, or package manager. All code runs directly in modern browsers.

## Key Classes and Architecture

### PitchPerfectApp Class (app.js:1-272)

Main application controller managing game state and user interactions.

**Properties**:
- `pitchDetector`: Instance of PitchDetector class
- `audioContext`: Web Audio API context
- `currentNote`: Currently playing note (C, C#, D, etc.)
- `score`, `streak`: Game scoring state
- `isListening`, `isGameActive`: Boolean flags
- `detectedNotes`: Array of detected notes during listening
- `notes`: Array of 12 chromatic notes

**Key Methods**:
- `initializeUI()`: Sets up event listeners for all UI controls
- `startGame()`: Initializes audio context and microphone access
- `nextRound()`: Generates new random note and plays it
- `playTone(frequency, duration)`: Synthesizes audio tone using oscillator
- `startListening()` / `stopListening()`: Controls pitch detection
- `checkAnswer(userNote)`: Validates answer and updates score
- `getMostCommonNote(notes)`: Statistical analysis of detected notes

### PitchDetector Class (pitchDetector.js:1-190)

Handles microphone input and pitch detection using autocorrelation algorithm.

**Properties**:
- `audioContext`: Audio processing context
- `analyser`: AnalyserNode for frequency analysis
- `microphone`: MediaStreamSource from user's mic
- `buffer`: Float32Array for time-domain audio data

**Key Methods**:
- `initialize()`: Requests microphone access and sets up audio pipeline
- `startListening(callback, volumeCallback)`: Begins continuous pitch detection
- `autoCorrelate(buffer, sampleRate)`: Core pitch detection algorithm
  - Implements autocorrelation to find fundamental frequency
  - RMS threshold: 0.005 for noise gate
  - Frequency range: 80Hz - 1000Hz
  - Correlation threshold: 0.3
- `frequencyToNote(frequency)`: Converts Hz to note name using logarithmic scale
- `getNoteFrequency(noteName)`: Static lookup table for C4-B4 frequencies

## Development Workflows

### Local Development

**Option 1 - Python HTTP Server**:
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Option 2 - Node.js HTTP Server**:
```bash
npx http-server
```

**Option 3 - VS Code Live Server**:
Install "Live Server" extension and click "Go Live"

**Important**: Modern browsers require HTTPS for microphone access (localhost is exempt).

### Deployment to Vercel

**Automatic Deployment**:
```bash
vercel
```

**Configuration** (vercel.json):
- No build command (static files)
- Output directory: `.` (root)
- SPA rewrites to index.html
- Custom header: `Permissions-Policy: microphone=*` for microphone access

### Git Workflow

**Branch Strategy**:
- Main development happens on feature branches
- Branch naming: `claude/claude-md-<session-id>`
- Current branch: `claude/claude-md-mi3mfju5xycaarzl-01G6bQxcnVjbGMBZTc3rWw7x`

**Commit Messages**:
Recent commits follow concise, descriptive pattern:
- "Add Vercel deployment configuration"
- "Fix pitch detection sensitivity issues"
- "Add Pitch Perfect Training web app"

**When committing**:
1. Use descriptive messages focusing on "why" not "what"
2. Push to feature branches with: `git push -u origin <branch-name>`
3. Branch names must start with `claude/` and end with matching session ID

## Code Conventions and Patterns

### JavaScript Conventions

1. **ES6 Classes**: Use class-based architecture for major components
2. **Naming Conventions**:
   - Classes: PascalCase (`PitchPerfectApp`)
   - Methods/variables: camelCase (`startListening`)
   - DOM elements: Descriptive names (`listenBtn`, `currentNote`)
3. **Event Handling**: Arrow functions for event listeners to preserve `this` context
4. **Async Operations**: Use async/await for microphone initialization
5. **DOM Queries**: Cache element references in `elements` object

### CSS Conventions

1. **BEM-like naming**: Semantic class names (`.score-board`, `.note-btn`)
2. **Gradients**: Consistent use of 135deg linear gradients
3. **Animations**: Named keyframes (`pulse`, `bounceIn`, `shake`)
4. **Responsive**: Mobile-first with media queries at 768px breakpoint
5. **Colors**: Purple/pink theme (`#667eea`, `#764ba2`, `#f093fb`)

### Audio/Algorithm Patterns

1. **Pitch Detection Parameters**:
   - FFT Size: 2048 samples
   - RMS Threshold: 0.005 (lowered for better sensitivity)
   - Correlation Threshold: 0.3
   - Frequency Range: 80-1000 Hz
   - Detection Delay: 1000ms for stable reading

2. **Tone Synthesis**:
   - Waveform: Sine wave
   - Envelope: Attack (0.01s), Release (exponential decay)
   - Volume: 0.3 gain

## Common Tasks for AI Assistants

### Adding New Features

When adding features, consider:

1. **New Note Ranges**: Modify `notes` array and frequency mappings in `PitchDetector.getNoteFrequency()`
2. **Difficulty Levels**: Adjust `currentNote` visibility logic in `nextRound()`
3. **New Scoring Rules**: Modify `checkAnswer()` scoring calculations
4. **Visual Feedback**: Add CSS animations in style.css with keyframes
5. **Audio Effects**: Create new tone synthesis methods in `playTone()`

### Debugging Pitch Detection Issues

1. **Enable Debug Mode**: Check "Show debug info in console" checkbox
2. **Key Metrics to Monitor**:
   - RMS levels (should be > 0.005)
   - Best correlation (should be > 0.3)
   - Detected frequency (should be 80-1000 Hz)
3. **Common Issues**:
   - Low RMS: User not singing loud enough or mic gain too low
   - Poor correlation: Background noise or complex waveforms
   - Wrong note: Octave issues or harmonic confusion

### Testing Microphone Features

1. **Browser Compatibility**: Test in Chrome, Firefox, Edge, Safari
2. **HTTPS Requirement**: Always test deployed version for mic access
3. **Volume Meter**: Should show green bar when singing
4. **Detection Consistency**: Sing sustained notes for 2+ seconds

### Modifying Styles

1. **Color Scheme**: Update gradient values in .btn-* and .score-board classes
2. **Responsive Design**: Test at 768px breakpoint for mobile layouts
3. **Animations**: Use existing keyframes or create new ones
4. **Typography**: Currently using 'Segoe UI' system font stack

### Performance Optimization

1. **requestAnimationFrame**: Already used for pitch detection loop
2. **Event Delegation**: Consider for note buttons if adding many more
3. **Audio Context**: Reuse existing context, don't create new ones
4. **DOM Updates**: Batch updates when possible, cache selectors

## Security and Privacy Considerations

1. **Microphone Access**: Always request user permission, handle denials gracefully
2. **HTTPS Required**: Microphone API requires secure context
3. **Permissions-Policy**: Set in vercel.json to enable microphone
4. **No Data Storage**: App doesn't store audio data or send it anywhere
5. **Client-Side Only**: All processing happens in browser

## Browser Requirements

- **Minimum**: Modern browsers with Web Audio API support (Chrome 56+, Firefox 53+, Safari 11+, Edge 79+)
- **Microphone Access**: HTTPS connection (or localhost for development)
- **Recommended**: Chrome/Edge for best Web Audio API performance

## Testing Checklist

When making changes, verify:

- [ ] App starts without console errors
- [ ] Microphone permission dialog appears
- [ ] Volume meter shows levels when speaking
- [ ] Pitch detection identifies sung notes correctly
- [ ] Note buttons are clickable and register answers
- [ ] Score and streak update correctly
- [ ] Feedback animations play (green checkmark, red X)
- [ ] Next round starts after 3 seconds
- [ ] Responsive design works on mobile (< 768px)
- [ ] "Play Note Again" button works
- [ ] Debug mode shows console logs when enabled

## Future Enhancement Ideas

From README.md, potential improvements include:

1. **Difficulty Levels**: Show/hide correct note, different pitch ranges
2. **Octave Training**: Expand beyond C4-B4 range
3. **Interval Training**: Train on recognizing musical intervals
4. **Custom Note Ranges**: Let users select which notes to practice
5. **Progress Tracking**: LocalStorage for historical performance
6. **Leaderboard**: Share high scores
7. **Different Waveforms**: Sine, square, triangle, sawtooth options
8. **Settings Panel**: User preferences (volume, detection sensitivity)

## AI Assistant Guidelines

### DO:
- ✅ Test changes locally before committing
- ✅ Maintain vanilla JS approach (no frameworks)
- ✅ Follow existing class-based architecture
- ✅ Update this CLAUDE.md when adding major features
- ✅ Verify microphone access in HTTPS context
- ✅ Use descriptive variable/function names
- ✅ Add comments for complex algorithms
- ✅ Test on multiple browsers when changing Web Audio code
- ✅ Check responsive design on mobile viewports
- ✅ Commit with clear, concise messages

### DON'T:
- ❌ Add build tools, bundlers, or package managers without discussion
- ❌ Introduce framework dependencies (React, Vue, etc.)
- ❌ Store or transmit audio data externally
- ❌ Break microphone access by removing HTTPS headers
- ❌ Commit directly to main branch
- ❌ Make breaking changes to PitchDetector algorithm without testing
- ❌ Remove existing features without explicit request
- ❌ Change color scheme drastically without approval
- ❌ Add large dependencies or external libraries
- ❌ Modify vercel.json without understanding deployment impact

## Quick Reference: Key Files

| File | Lines | Purpose | Modify When |
|------|-------|---------|-------------|
| index.html | 90 | UI structure | Adding UI elements, changing layout |
| app.js | 272 | Game logic | Changing game flow, scoring, interactions |
| pitchDetector.js | 190 | Pitch detection | Tuning detection algorithm |
| style.css | 348 | Styling | Changing appearance, animations |
| vercel.json | 18 | Deployment | Changing deployment config, headers |

## Recent Changes

- **2025-11-17**: Added Vercel deployment configuration with microphone permissions
- **Previous**: Fixed pitch detection sensitivity (lowered thresholds for better detection)
- **Initial**: Created Pitch Perfect Training web app with autocorrelation-based pitch detection

---

**Last Updated**: 2025-11-17
**Maintained For**: Claude AI Assistant interactions with SPELL repository
