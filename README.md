# 🛡️ ErgoVision AI — Desk Posture & Mobility Coach

<p align="center">
  <strong>Real-time, 100% client-side ergonomic workstation copilot designed for desk posture comfort, 20-20-20 eye breaks, and guided mobility stretches.</strong>
</p>

<p align="center">
  <a href="./README.fr.md"><strong>🇫🇷 Lire la documentation en Français</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local%20(Zero%20Telemetry)-success.svg" alt="100% Local Privacy">
  <img src="https://img.shields.io/badge/Engine-MediaPipe%20Pose%20(Wasm%20%2B%20WebGL)-orange.svg" alt="MediaPipe Pose">
  <img src="https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blueviolet.svg" alt="WCAG 2.1 AA">
  <img src="https://img.shields.io/badge/Design-Fluent%20UI%202%20Mica-0f6cbd.svg" alt="Fluent UI 2">
  <img src="https://img.shields.io/badge/i18n-English%20%7C%20Fran%C3%A7ais-brightgreen.svg" alt="i18n EN/FR">
</p>

---

## 💡 Why ErgoVision AI?

Prolonged screen work leads to repetitive musculoskeletal strain (RSI), upper trapezius fatigue, and chronic postural compensation—particularly for sedentary professionals and individuals coping with spinal or orthopedic sensitivities.

**ErgoVision AI** acts as a gentle, intelligent guardian. Using lightweight computer vision directly in your browser, it tracks key biomechanical landmarks to alert you before bad habits trigger physical pain, all while preserving your privacy with zero external video streaming.

---

## 🌟 Key Features

### 1. 🔬 Targeted Biomechanical Analysis (4 Live Gauges)
- **Cervical Spine & "Text-Neck" Detection**: Calculates the normalized distance ratio between nose and acromioclavicular line to detect forward head slump.
- **Scapular Symmetry & Trapezius Protection**: Detects asymmetric shoulder shrugging and reflex compensations caused by fatigue or uneven arm rests.
- **Lateral Head Tilt Monitoring**: Prevents prolonged lateral neck leaning that strains cervical foramina.
- **Screen-to-Eye Distance & Z-Depth (v2.1 New Feature)**: 4th biomechanical gauge tracking forward hunching towards the monitor (<50cm / 20 in, OSHA/INRS threshold) to curb visual fatigue and spinal compression.
- **Interactive 3-Second Zero-Point Calibration**: Adapts instantly to individual morphology, camera angle, and seating height.

### 2. 👁️ 20-20-20 Eye Rest & Visual Hygiene Guardian (v2.1 New Feature)
- **Clinical Eye Rest Protocol**: Every 20 minutes, a discreet floating banner and a restorative 528 Hz bell remind you to soften ocular ciliary focus by gazing at 20 feet (6 meters) for 20 seconds.
- **Thoughtful Alert Suspension**: Postural drift alerts are muted during the 20-second eye rest to let you freely gaze out the window or across the room without false alarms.
- **Quick "Skip" Control**: Instant one-click dismiss for meetings or urgent workflow moments.

### 3. 🧘 Mobility & Stretch Studio (v2.0)
- **Guided Desk Mobility Micro-Exercises**:
  - **McKenzie Axial Chin Tuck**: Releases neck tension (C5-C7) and counteracts forward leaning.
  - **Brügger Postural Opening**: Scapular opening and reversal of rounded shoulder posture.
  - **Upper Back Extension**: Mobilizes stiff upper back and promotes deep breathing.
  - **Gentle Pelvic Tilts**: Restores lower back mobility after prolonged sitting.
- **Visual Guidance & Guided Breathing**: Crisp SVG vector anatomical illustrations, circular hold timer, repetition counter, and rhythmic breath prompts (inhale/exhale).
- **Zen Soundscape**: Gentle resonant Tibetan singing bowl chimes (~432Hz) marking movement transitions without audio fatigue.

### 4. ⏱️ Adaptive Workstation Pacing
- **💻 Sitting Desk Mode**: Customizable session duration (default: 45 min).
- **🧍 Standing Desk Mode**: Dynamic count-up with posture change advisory (default: 15 min).
- **🧘 Active Break & Stretch Mode**: 5-minute dedicated timer with **automatic alert suspension** so you can stretch and move freely without false alarms.
- **⏳ Overtime Negative Counting**: When time expires, the timer counts into the negative (`-01:23`) with a visual warning without abruptly halting your focus, rewarding your neutral posture ratio upon completion.

### 4. 🔊 Gentle, Non-Intrusive Audio Ergonomics
- **Dynamic Continuous/Pulsed Feedback**: Emits a subtle recurring pulse or gentle sine drone during sustained poor posture, and **silences instantly** the millisecond you return to your calibrated neutral posture.
- **Harmonious Cycle End Chime**: A friendly three-tone chime (C-E-G) celebrating completed cycles without cognitive shock.
- **Smart Debouncing (Latch)**: One continuous drift equals exactly one alert log and notification, eliminating duplicate alarms.

### 4. 🪟 Multitasking & Accessibility
- **Picture-in-Picture (PiP) Mirror Mode**: Floats a compact, mirrored video feed with live posture status on top of your IDE, Jira, or Teams meetings.
- **Fluent UI 2 Mica/Acrylic Theme**: WCAG 2.1 Level AA compliant contrast with instant Dark / Light mode switching.
- **Native Bilingual Support (EN / FR)**: One-click seamless language toggle across HUD, gauges, settings, and logs.
- **Daily Telemetry & CSV Export**: Preserves session logs locally in `localStorage` with full CSV download capabilities.

---

## 🔒 100% Local & Private by Design

- **Zero Video Stream Transmission**: Frame processing runs exclusively on your CPU/GPU using Google MediaPipe Pose via WebAssembly and WebGL.
- **No Remote Servers or Analytics**: No cookies, no external telemetry, and no user accounts required.
- **Local Data Only**: All configurations and logs remain inside your browser's `localStorage`.

---

## ⚕️ Biomechanical & Ergonomic Disclaimer

> [!NOTE]
> **ErgoVision AI is an ergonomic coaching and posture awareness tool, not a medical diagnostic device.**
> It is designed to assist computer workers in maintaining healthy movement habits and biomechanical awareness. It should not replace professional medical advice, physiotherapy, or orthopedic treatment. If you experience persistent chronic pain, consult a qualified healthcare professional.

---

## 🚀 Quick Start

No complex setup, build step, or package manager required!

### Option 1: Direct Local Use
1. Clone or download this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ErgoVision.git
   ```
2. Double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, or Brave.
3. Allow camera access, sit comfortably, and click **"Calibrate Zero Point (3s)"**.

### Option 2: Local HTTP Server (Recommended for Modular Development)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```
- Navigate to `http://localhost:8000/` for the standalone single-file version.
- Navigate to `http://localhost:8000/90_Code_Source/` for the modular ES6 development version.

---

## 🏗️ Architecture & Project Structure

The project follows a standardized numbered repository layout (00 to 99) for strict traceability:

```text
├── index.html                           # Standalone single-file build (Zero-install, GitHub Pages ready)
├── README.md                            # English documentation (International)
├── README.fr.md                         # French documentation
├── LICENSE                              # MIT License
├── CONTRIBUTING.md                      # Contribution guidelines
├── CODE_OF_CONDUCT.md                   # Community Code of Conduct
├── SECURITY.md                          # Zero-data privacy policy
├── .github/
│   ├── workflows/deploy.yml             # GitHub Pages automated deployment
│   ├── ISSUE_TEMPLATE/                  # Bug report & Feature request templates
│   └── pull_request_template.md         # PR validation checklist
├── 00_Conception_et_References/         # PRD (01_PRD.md), Clinical Context (02_Contexte.md)
├── 10_Design_et_Assets/                 # Fluent UI 2 DTCG Design Tokens (JSON/CSS) & Specs
├── 20_Data_et_Bases/                    # Formal State Schemas (state_schema.json)
├── 80_Tests_et_Deploiement/             # Deployment guides & validation plans
└── 90_Code_Source/                      # Decoupled ES6 modular source code
    ├── css/ (style.css, tokens.css)
    ├── src/ (audio, biomechanics, i18n, pacing, storage, ui, vision)
    └── index.html                       # Modular development entry point
```

---

## 🗺️ Roadmap & Next Iterations

- [x] Initial biomechanical detection (C7-C8 slump, lateral tilt, shoulder elevation).
- [x] Web Audio API dynamic continuous alert & cycle chimes.
- [x] Fluent UI 2 Mica redesign (WCAG 2.1 AA compliant).
- [x] Native English & French internationalization.
- [x] Decoupled modular ES6 architecture in `90_Code_Source/`.
- [ ] 📈 Weekly and monthly posture endurance trend graphs.
- [ ] 🧘 Guided active desk stretching mini-animations during break mode.
- [ ] 🌐 Optional PWA (Progressive Web App) offline desktop install.

---

## 🤝 Contributing

Contributions, issues, and feature ideas are warmly welcome! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) guide and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before submitting pull requests.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for full details.
