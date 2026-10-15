# Règles du Développeur (dev-rules) — ErgoVision AI

## 1. Standards de Code & Typage
- Typage explicite (TypeScript ou JSDoc exhaustif avec types stricts).
- Gestion défensive des cas limites (webcam non branchée, permission refusée, navigateur incompatible avec `captureStream`).
- Gestion propre du cycle de vie des flux média : toujours stopper les `MediaStreamTrack` lors de la fermeture de la caméra.

## 2. Invariants Biomécaniques & Audio
- `AudioContext` : Déblocage uniquement sur interaction explicite (clic / touche).
- MediaPipe : Vérifier `visibility > 0.45` sur le nez et les épaules avant tout calcul. Si non visible, considérer la pose comme indéterminée sans fausse alerte.
- Latch Anti-Rebond : 1 seule sonnerie / notification par épisode de mauvaise posture.
