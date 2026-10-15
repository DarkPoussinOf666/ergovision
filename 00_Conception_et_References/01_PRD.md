# Product Requirements Document (PRD) — ErgoVision AI

> **Statut du Garde-fou** : [x] PRD Validé (Garde-fou levé le 14/10/2026 — Création de code débloquée dans 90_Code_Source/)

---

## 1. Contexte & Problématique
- **Problème à résoudre** : Les longues sessions de travail assis devant écran entraînent des contraintes mécaniques sévères sur la chaîne rachidienne. Cela se traduit par une projection antérieure de la tête (*Text-Neck*), un affaissement cervical, des tensions trapézoïdales prolongées et des asymétries posturales chroniques (épaules haussées, inclinaisons latérales prolongées).
- **Public cible / Personas** :
  - Professionnels du numérique (développeurs, designers, product managers, télétravailleurs) passant plus de 6 heures par jour sur écran.
  - Utilisateurs de bureaux réglables assis/debout souhaitant structurer leur alternance posturale et leurs pauses actives.

---

## 2. Objectifs & Métriques de Succès
- **Objectif principal** : Fournir un copilote ergonomique et biomécanique temps réel, 100% local, confidentiel et autonome, guidant la posture via vision par ordinateur légère, alertes discrètes et pacing adaptatif.
- **Critères d'acceptation (KPIs)** :
  - [x] **Surveillance Cervicale & Text-Neck** : Précision du ratio distance nez-épaules et détection d'inclinaison latérale sans faux positif lors des mouvements naturels de tête.
  - [x] **Surveillance Scapulaire & Épaules** : Calibration sur-mesure d'un « Point Zéro » tenant compte de l'anatomie de l'utilisateur et détection des hausses réflexes d'épaules.
  - [x] **Anti-rebond (Debouncing / Latch)** : Zéro duplication des alertes et des logs lors d'une mauvaise posture continue (1 alerte par dérive).
  - [x] Pacing dynamique & personnalisable : Respect des plages de travail (Assis, Debout, Pause active) avec durées configurables dans l'interface et persistées en `localStorage`.
  - [x] **Timer à défilement négatif (Overtime Pacing)** : Défilement sous zéro (`-01:23`) en fin de cycle sans interruption brutale, avec style d'avertissement et consigne automatique du score de posture neutre du cycle.
  - [x] **Alerte Sonore Continue Dynamique** : Tonalité ou pulse rythmé persistant tant que la posture n'est pas revenue en neutre, avec extinction instantanée dès retour au point zéro.
  - [x] **Carillon de Fin de Cycle Distinct** : Triple carillon harmonieux (Do-Mi-Sol) marquant la réussite du cycle sans agressivité cognitive.
  - [x] **Internationalisation Native (FR / EN)** : Bascule réactive bilingue intégrale (HUD, jauges, réglages, timeline).
  - [x] **Journal Quotidien Enrichi & Persistant** : Sauvegarde locale journalière (`localStorage`) des alertes, passages de modes et bilans de maintien neutre.
  - [x] **Centre de Contrôle Fluent UI 2** : Modal à onglets avec presets ergonomiques (Pomodoro 25/5, 45/15, 50/10), curseurs synchronisés et tests audio intégrés.
  - [x] Pause active intelligente : Suspension automatique des alertes en mode Pause & Étirement pour libre mouvement.
  - [x] Picture-in-Picture (PiP) : Rendu miroir naturel avec HUD lisible et non inversé.
  - [x] Confidentialité absolue : 0 trame vidéo sortante du navigateur (traitement local client-side).

---

## 3. Scope & Fonctionnalités (v2.0)
- **Fonctionnalités Clés (In-Scope)** :
  - [x] Détection temps réel MediaPipe Pose via Canvas WebGL/Wasm avec filtrage de visibilité (`visibility > 0.45`).
  - [x] Calibration guidée interactive (3-2-1 sonore) mémorisant le point zéro physiologique.
  - [x] Moteur audio Web Audio API polyphonique : alertes continues/pulsées dynamiques, carillon de cycle et bols zen kiné (432Hz).
  - [x] Pacing postural multi-modes : Bureau Assis, Station Debout, Pause & Étirement active avec gestion du dépassement (overtime).
  - [x] **Atelier Kiné du Dos & Pause Active Intelligente (v2.0)** : Catalogue clinique d'exercices de décharge du rachis (McKenzie, Brügger, Extension thoracique, Bascule pelvienne) avec guidage visuel SVG, timing de maintien, répétitions et respiration guidée.
  - [x] Modal Centre de Contrôle Fluent UI 2 : presets 1-clic, réglage volume, test son, latence et sensibilité.
  - [x] Switch de langue instantané Français / Anglais.
  - [x] Mode Picture-in-Picture (PiP) avec incrustation du HUD de feedback.
  - [x] Journal chronologique persistant des alertes, transitions, séances kiné et scores de cycles avec export CSV.
- **Hors Périmètre (Out-of-Scope)** :
  - Pas de backend cloud, pas de base de données distante, pas de compte utilisateur obligatoire.
  - Pas d'évaluation invasive ou punitive des exercices (guidage bienveillant non bloquant).

---

## 4. Contraintes Techniques & Dépendances
- **Stack recommandée** :
  - Frontend : Vanilla HTML5, CSS moderne (CSS Variables, Flexbox/Grid, Design sombre Studio), JavaScript ES6+ modulaire.
  - Vision : Google MediaPipe Pose `@mediapipe/pose` (chargement CDN asynchrone).
  - Audio : Web Audio API native.
  - Persistance : Web Storage API (`localStorage`).
- **Contraintes de sécurité / performance** :
  - Exécution fluide à 30 FPS minimum sans latence de rendu UI.
  - Absence totale d'envoi de télémétrie ou de flux vidéo externe (Zero-Trust Privacy).
  - Pas d'allocations mémoire excessives par trame (réutilisation des buffers Canvas).
- **Modèle d'état SKILL.state** : Schéma d'état canonique défini dans `design.md` et `20_Data_et_Bases/state_schema.json`.
