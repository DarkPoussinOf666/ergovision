# 🧩 ErgoVision AI — Source Code Architecture (`90_Code_Source/`)

[![Architecture: Modular ES6](https://img.shields.io/badge/Architecture-Modular%20ES6-0f6cbd.svg)](#)
[![Zero Build Required](https://img.shields.io/badge/Build-Zero%20Bundler%20Required-success.svg)](#)
[![WebAssembly & WebGL](https://img.shields.io/badge/Runtime-Wasm%20%2B%20WebGL-blueviolet.svg)](#)

This directory contains the decoupled, modular source code of **ErgoVision AI**, engineered for high maintainability, automated testing, and community-driven open-source iteration.

---

## 📂 Directory Structure

```text
90_Code_Source/
├── css/
│   ├── tokens.css               # Fluent UI 2 DTCG Design Tokens (Light & Dark)
│   └── style.css                # Component styling, layouts, acrylic/mica glassmorphism
├── src/
│   ├── audio/
│   │   └── audio-engine.js      # Web Audio API polyphonic engine (drone, pulse, cycle chime)
│   ├── biomechanics/
│   │   └── posture-engine.js    # C7-C8 neck slump, scapular shrug & lateral tilt algorithms
│   ├── i18n/
│   │   └── translations.js      # Bilingual dictionary (EN / FR) and reactive locale helpers
│   ├── pacing/
│   │   └── pacing-timer.js      # Workstation pacing state (Sit/Stand/Active Break & Overtime)
│   ├── storage/
│   │   └── activity-logger.js   # Local daily telemetry persistence & CSV export
│   ├── ui/
│   │   └── theme.js             # Mica dark/light theme switching & token synchronization
│   ├── vision/
│   │   └── camera-stream.js     # MediaPipe Pose wrapper, video devices & PiP mirror canvas
│   └── app.js                   # Application conductor & DOM event orchestrator
├── index.html                   # Modular dev entry point (ES6 <script type="module">)
└── README.md                    # Developer documentation
```

---

## ⚡ Architecture Principles

1. **Strict Decoupling**: Business logic (biomechanics, audio, timers, storage) is completely isolated from DOM operations.
2. **Native ES6 Modules**: No mandatory Webpack, Vite, or Babel bundlers are required to test or contribute.
3. **Dual Distribution**:
   - `90_Code_Source/index.html` loads modular ES6 scripts (`src/app.js`), facilitating unit edits and atomic pull requests.
   - Root `index.html` acts as a zero-dependency, single-file bundle ready for immediate 1-click execution on **GitHub Pages** or direct browser opening without any web server.

---

## 🧪 Local Development

Run any static local server from the root of the project:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

- Open `http://localhost:8000/90_Code_Source/` to test the modular development version.
- Open `http://localhost:8000/` to test the standalone distribution version.
