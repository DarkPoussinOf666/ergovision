# 🤝 Contributing to ErgoVision AI

First off, thank you for considering contributing to **ErgoVision AI**! Projects like this thrive because of community contributors who care about ergonomics, health, and accessibility.

---

## 🧭 Guiding Principles

1. **Zero-Trust Privacy**: All computer vision algorithms and landmark calculations **must execute 100% locally** in the client browser (via WebAssembly and WebGL). No video stream, image, or telemetry may ever leave the user's machine.
2. **Zero-Build Overhead**: Keep the project accessible. Contributions to `90_Code_Source/src/` use native ES6 modules without mandatory complex compilation toolchains.
3. **Accessibility First (WCAG 2.1 AA)**: All interface components must maintain adequate color contrast, focus outlines, and keyboard navigation.
4. **Bilingual Completeness**: Whenever introducing new text or UI strings, ensure both `fr` and `en` translations are supplied in `src/i18n/translations.js`.

---

## 🛠️ Development Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/ErgoVision.git
cd ErgoVision
```

### 2. Local Server
Run a lightweight HTTP server:
```bash
# Option A: Python 3
python -m http.server 8000

# Option B: Node.js
npx serve .
```

- Navigate to `http://localhost:8000/90_Code_Source/` to test the modular architecture.
- Navigate to `http://localhost:8000/` to test the standalone single-file distribution.

### 3. Modifying Code
- **Biomechanical logic**: Edit `90_Code_Source/src/biomechanics/posture-engine.js`.
- **Audio engine**: Edit `90_Code_Source/src/audio/audio-engine.js`.
- **Translations**: Edit `90_Code_Source/src/i18n/translations.js`.
- **UI & Layout**: Edit `90_Code_Source/css/style.css` and `90_Code_Source/src/ui/`.
- **Pacing**: Edit `90_Code_Source/src/pacing/pacing-timer.js`.

---

## 📝 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new user-facing feature or capability.
- `fix:` A bug fix.
- `docs:` Documentation-only changes.
- `style:` Formatting, missing semicolons, CSS adjustments without logic changes.
- `refactor:` Code change that neither fixes a bug nor adds a feature.
- `perf:` A code change that improves performance or reduces latency.
- `chore:` Maintenance tasks or repository tooling.

*Example:* `feat(audio): add exponential decay to posture alert tone`

---

## 🚀 Submitting a Pull Request

1. Create a feature branch: `git checkout -b feat/my-new-feature`
2. Commit your changes: `git commit -m "feat(pacing): add configurable stretch interval"`
3. Push to your fork: `git push origin feat/my-new-feature`
4. Open a Pull Request on GitHub against the `main` branch.
5. Fill out the PR template with clear reproduction steps or screenshots.

Thank you for helping people maintain healthy posture worldwide!
