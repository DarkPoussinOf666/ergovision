# ErgoVision AI - Plan d'Action & Tracking

## Ressources mobilisées
- **Agent** : Architecte Système & Agentique Senior (Pair Programming & Antigravity Initializer)
- **Compétences / Skills** : `antigravity-initializer`, `SKILL.state`, Architecture Cognitive (State Graphs, GraphRAG), Arborescence Industrielle 00-99.
- **Standards** : Typage strict, garde-fou PRD First, réduction de tokens O(1) prompt / O(T) total, traçabilité continue.

---

## Tâches d'implémentation (Initialisation Antigravity 00-99)

- [x] **Phase 0 : Audit & Détection de l'existant**
  - [x] Inspection du workspace (`e:\01 - PROJETS\ErgoVision`).
  - [x] Détection du prototype `index.html`, du `README.md` et des leçons `tasks/lessons.md`.
  - [x] Décision : Conserver le prototype existant, pré-remplir la documentation avec le contexte clinique réel d'ErgoVision AI.

- [x] **Phase 1 : Déploiement de l'Arborescence Numérotée (00 à 99)**
  - [x] Création de `00_Conception_et_References/`
  - [x] Création de `10_Design_et_Assets/`
  - [x] Création de `20_Data_et_Bases/`
  - [x] Création de `80_Tests_et_Deploiement/`
  - [x] Création de `90_Code_Source/`

- [x] **Phase 2 : Génération des Fichiers de Cadrage de Base**
  - [x] `00_Conception_et_References/01_PRD.md` (Spécifications biomécaniques C7-C8, T6-T10, Pacing, Orthèses + Garde-fou)
  - [x] `00_Conception_et_References/02_Contexte.md` (Vision produit, personas développeur/guitariste, contraintes cliniques)
  - [x] `90_Code_Source/README.md` (Garde-fou strict interdisant le code avant validation PRD)
  - [x] `gemini.md` & `00_Conception_et_References/gemini.md` (Carte d'identité du projet)
  - [x] `design.md` & `00_Conception_et_References/design.md` (Architecture, schémas de données et protocole SKILL.state)
  - [x] `20_Data_et_Bases/state_schema.json` (Schéma d'état formel)

- [x] **Phase 3 : Installation du Socle Agentique Antigravity**
  - [x] `.agent/agents/` (`lead-agent.md`, `architecte.md`, `dev.md`)
  - [x] `.agent/rules/` (`global-rules.md`, `knowledge-rules.md`, `architecte-rules.md`, `dev-rules.md`)
  - [x] `.agent/workflows/` (`init-workflow.md`, `dev-workflow.md`, `skill-state-loop.md`, `review-workflow.md`)

- [x] **Phase 4 : Validation & Synthèse**
  - [x] Vérification de la cohérence de l'arborescence et des liens.
  - [x] Restitution du bilan d'initialisation et activation du garde-fou.
  - [x] **Validation formelle du PRD par l'utilisateur** : Statut passé à `[x] PRD Validé` dans [01_PRD.md](file:///e:/01%20-%20PROJETS/ErgoVision/00_Conception_et_References/01_PRD.md).
  - [x] **Levée du garde-fou** sur `90_Code_Source/`.

---

## Prochaines Étapes : Refonte UI/UX Fluent UI 2 (Design System Forge)

- [x] **Phase 5 : Déploiement du Design System Fluent UI 2 (`10_Design_et_Assets/`)**
  - [x] 5.1 Génération des Design Tokens DTCG standard (`10_Design_et_Assets/tokens/tokens.json`) avec palettes Brand, Neutrals, Sémantiques (Light/Dark), Typo, Spacing, Radius, Shadows, Motion.
  - [x] 5.2 Export des CSS Custom Properties (`10_Design_et_Assets/tokens/tokens.css`) conformes WCAG 2.1 AA avec variables `:root` (Light) et `[data-theme="dark"]` (Dark).
  - [x] 5.3 Documentation complète du Design System (`10_Design_et_Assets/DESIGN_SYSTEM.md`) : 8 couches fondamentales, patterns de composants Fluent (Boutons, Cartes, Gauges, Segments), audit de contraste WCAG AA, directives Do/Don't.

- [x] **Phase 6 : Refonte Intégrale de l'Interface Utilisateur (`index.html`)**
  - [x] 6.1 Intégration des tokens CSS Fluent UI 2 et des styles de surfaces modernes (acrylique / mica, double focus ring A11y, contrastes AA).
  - [x] 6.2 Topbar professionnelle : Header Fluent, sélecteur de modes segmenté, quick actions enrichies (bascule Dark/Light, sensibilité, audio, notifs, PiP).
  - [x] 6.3 Bento Grid & Viewport vidéo : Canvas HUD haute précision, bandeau de contrôle ergonomique, affichage des caméras et calibration zéro fluide.
  - [x] 6.4 Jauges biomécaniques haute lisibilité (C7-C8 nuque, T6-T10 épaule/trapèze, inclinaison foramen) avec micro-animations et seuils visuels nets.
  - [x] 6.5 Widgets ergonomiques : Chronomètre de cadence assis/debout/guitare, score de maintien neutre en temps réel, trackers d'orthèses (5h/j max) avec contrôles Play/Pause accessibles.
  - [x] 6.6 Journal d'alertes & Timeline : Structure de flux d'activité Fluent avec horodatage monospacé, badges de criticité et export CSV.

- [x] **Phase 7 : Validation, Tests Fonctionnels & Accessibilité**
  - [x] 7.1 Vérification de la persistance de toutes les fonctionnalités biomécaniques et audio.
  - [x] 7.2 Validation WCAG 2.1 AA (contraste, cibles tactiles >= 34px desktop / 48px touch, navigation clavier tab/focus).
  - [x] 7.3 Revue des leçons apprises et mise à jour de `tasks/lessons.md`.

---

## Phase 8 : Dé-personnalisation & Universalisation d'ErgoVision AI

- [x] **Phase 8.1 : Refonte du Code Applicatif (`index.html`)**
  - [x] 8.1.1 Suppression intégrale du bloc et des états d'orthèses (Collier cervical & Gaine baleinée, stockage local, alertes associées).
  - [x] 8.1.2 Remplacement du mode « Guitare » par le mode « Pause / Étirement » (icône SVG, durée configurable, timer dédié).
  - [x] 8.1.3 Suspension intelligente des alertes posturales (audio/visuelles) en mode « Pause / Étirement » pour libre mouvement.
  - [x] 8.1.4 Intégration de la configuration personnalisée des durées de pacing (Assis / Debout / Pause) via `<dialog>` Fluent et persistance `localStorage`.
  - [x] 8.1.5 Actualisation du branding (« Copilote Ergonomique • Prévention des TMS en Temps Réel ») et des légendes biomécaniques universelles.
- [x] **Phase 8.2 : Alignement de la Documentation & des Fichiers de Cadrage**
  - [x] 8.2.1 Mise à jour de `00_Conception_et_References/01_PRD.md` et `02_Contexte.md`.
  - [x] 8.2.2 Mise à jour de `design.md` et `00_Conception_et_References/design.md`.
  - [x] 8.2.3 Mise à jour de `20_Data_et_Bases/state_schema.json` et `10_Design_et_Assets/DESIGN_SYSTEM.md`.
  - [x] 8.2.4 Mise à jour de `README.md`, `10_Design_et_Assets/README.md`, `80_Tests_et_Deploiement/README.md` et `.agent/agents/architecte.md`.
- [x] **Phase 8.3 : Validation Fonctionnelle & Review**
  - [x] 8.3.1 Vérification de l'intégrité JavaScript (4 scripts validés sans erreur de syntaxe) et nettoyage de 100% des références mortes.
  - [x] 8.3.2 Mise à jour finale du todo et leçon de transmission dans `tasks/lessons.md`.

---

## Phase 9 : Alerte Continue, Internationalisation (FR/EN), Télémétrie Enrichie & Centre de Réglages

- [x] **Phase 9.1 : Moteur Audio & Alerte Continue Dynamique**
  - [x] 9.1.1 Conception de la boucle sonore continue/pulsée (Web Audio API) active dès le seuil de 2.5s de mauvaise posture.
  - [x] 9.1.2 Extinction instantanée de l'onde sonore dès que la posture repasse en neutre (`anyBad === false`).
  - [x] 9.1.3 Contrôle du volume et du type de signal sonore (bip pulsé vs tonalité continue) pour préserver l'ergonomie cognitive.

- [x] **Phase 9.2 : Internationalisation Bilingue (FR / EN)**
  - [x] 9.2.1 Création du module de dictionnaire i18n (`TRANSLATIONS = { fr: {...}, en: {...} }`).
  - [x] 9.2.2 Intégration du sélecteur de langue dans la topbar/header (FR | EN).
  - [x] 9.2.3 Traduction dynamique intégrale (HUD, jauges, réglages, journal, notifications, tooltips).
  - [x] 9.2.4 Persistance du choix de langue dans `localStorage`.

- [x] **Phase 9.3 : Journal d'Activité Quotidien & Télémétrie de Cycle Postural**
  - [x] 9.3.1 Journalisation des transitions de modes (Passage Assis -> Debout, Début Pause).
  - [x] 9.3.2 Calcul du score de maintien neutre dédié par session/cycle de travail (cadence en cours).
  - [x] 9.3.3 Enregistrement d'un événement récapitulatif à chaque fin de timer de cycle avec le pourcentage de maintien neutre et carillon harmonieux.
  - [x] 9.3.4 Persistance journalière du journal dans `localStorage` (clé par date du jour) et export CSV enrichi.

- [x] **Phase 9.4 : Refonte de la Popup de Réglages (Centre de Contrôle Fluent UI 2)**
  - [x] 9.4.1 Refonte visuelle du modal avec navigation par onglets ou sections catégorisées (Rythme, Audio, Sensibilité biomécanique, Langue).
  - [x] 9.4.2 Ajout de presets ergonomiques de pacing (Pomodoro 25/5, Standard 45/15, Alternance active 50/10).
  - [x] 9.4.3 Contrôles sliders + inputs numériques synchronisés avec feedback visuel en direct.
  - [x] 9.4.4 Bouton de test audio et gestion du volume / mode sonore.

- [x] **Phase 9.5 : Validation, Tests Fonctionnels & Documentation**
  - [x] 9.5.1 Validation de la syntaxe JS (58k car. validés) et intégrité des 48 IDs DOM.
  - [x] 9.5.2 Mise à jour de la documentation (`01_PRD.md`, `tasks/lessons.md`, `tasks/todo.md`).
  - [x] 9.5.3 Review finale et transmission didactique.

- [x] **Phase 10 : Préparation Open-Source, Structuration Modulaire & Internationalisation GitHub**
  - [x] 10.1 Structuration Modulaire du Code dans `90_Code_Source/`
    - [x] 10.1.1 Extraire les modules ES6 (`i18n`, `audio`, `biomechanics`, `pacing`, `storage`, `ui`, `vision`, `app.js`).
    - [x] 10.1.2 Extraire les feuilles de styles (`css/style.css` et tokens Fluent UI 2).
    - [x] 10.1.3 Créer la version modulaire de test `90_Code_Source/index.html` pour le développement itératif.
    - [x] 10.1.4 Valider la stricte équivalence fonctionnelle et l'indépendance de `index.html` racine pour GitHub Pages direct.
  - [x] 10.2 Outillage Open-Source & Standards GitHub
    - [x] 10.2.1 Créer `LICENSE` (Licence MIT).
    - [x] 10.2.2 Configurer `.gitignore` (exclure caches OS, temporaires, logs).
    - [x] 10.2.3 Mettre en place `.github/workflows/deploy.yml` pour le déploiement GitHub Pages.
    - [x] 10.2.4 Déployer les templates de contribution : `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md`.
  - [x] 10.3 Documentation Internationale (Bilingue EN / FR)
    - [x] 10.3.1 Rédiger le `README.md` principal en Anglais (badges, pitch, démo, fonctionnalités, disclaimer médical/ergonomie, guide d'installation, roadmap).
    - [x] 10.3.2 Rédiger le `README.fr.md` miroir en Français intégral.
  - [x] 10.4 Initialisation Git & Premier Commit Propre
    - [x] 10.4.1 Initialiser le dépôt git (`git init -b main`).
    - [x] 10.4.2 Commit initial standardisé selon Conventional Commits (`feat: initial open-source release with modular architecture and international docs`).
  - [x] 10.5 Validation globale, tests et compte-rendu didactique.

---

## 🚀 Feuille de Route V2.0 — Atelier Kiné du Dos & Pause Active Intelligente

- [x] **Phase 11.0 : Préservation & Scellement Formel de la V1**
  - [x] 11.0.1 Poser un tag Git `v1.0.0` sur le commit de référence stable.
  - [x] 11.0.2 Créer une branche Git `release/v1-stable`.
  - [x] 11.0.3 Créer un dossier miroir autonome `v1/` contenant la distribution autonome complète V1 (`v1/index.html`, README V1) pour exécution directe sans checkout.

- [x] **Phase 11.1 : Référentiel Clinique Kiné & Modèle de Données (Dos & Rachis)**
  - [x] 11.1.1 Définir le schéma et le catalogue d'exercices dans `20_Data_et_Bases/kine_exercises.json`.
  - [x] 11.1.2 Rédiger les 4 protocoles cliniques clés (Rétraction McKenzie, Posture Brügger, Extension thoracique active, Bascule pelvienne lombo-sacrée).
  - [x] 11.1.3 Enrichir les dictionnaires i18n (`src/i18n/translations.js`) avec toutes les consignes, bénéfices, respirations et durées en FR et EN.
  - [x] 11.1.4 Créer le module clinique modulaire `src/kine/exercises.js`.

- [x] **Phase 11.2 : Moteur de Routine & Pacing Kiné (`src/kine/routine-timer.js`)**
  - [x] 11.2.1 Concevoir le gestionnaire de cycle d'exercice (phases : Préparation 5s, Maintien actif 20-30s ou Répétitions x5, Relâchement, Transition).
  - [x] 11.2.2 Intégrer les signaux Web Audio doux dédiés au coaching (gong tibétain / cloche douce de début/fin d'étirement, respiration guidée).
  - [x] 11.2.3 Permettre la navigation manuelle (Suivant, Précédent, Pause/Reprise, Passer l'exercice).

- [x] **Phase 11.3 : Composant UI Fluent UI 2 — Studio Kiné de Pause**
  - [x] 11.3.1 Concevoir le conteneur immersif "Pause & Mobilisation Kiné" (surface Mica, bento card dédiée s'ouvrant en mode Pause).
  - [x] 11.3.2 Illustrer chaque mouvement avec des pictogrammes/schémas SVG vectoriels haute clarté anatomique.
  - [x] 11.3.3 Intégrer la jauge circulaire de maintien temporel / compteur de répétitions avec typographie tabulaire sans tremblement.
  - [x] 11.3.4 Afficher les conseils de respiration guidée (Inspirer / Expirer) et la zone anatomique ciblée en temps réel.

- [x] **Phase 11.4 : Intégration Système & Pacing Automatique**
  - [x] 11.4.1 Déclenchement automatique de la routine kiné lors de la sélection du Mode Pause ou à l'expiration du temps assis/debout.
  - [x] 11.4.2 Maintien strict de la suspension des alertes biomécaniques intrusives pendant la pause.
  - [x] 11.4.3 Enregistrement dans le journal quotidien (`activity-logger.js`) des exercices complétés et du temps d'étirement actif.

- [x] **Phase 11.5 : Rétro-portage Standalone, Validation WCAG & Documentation**
  - [x] 11.5.1 Valider le bon fonctionnement dans `90_Code_Source/` (modules ES6).
  - [x] 11.5.2 Rétro-porter les modules et styles dans la version autonome `index.html` (V2).
  - [x] 11.5.3 Valider l'accessibilité WCAG 2.1 AA (contraste, focus clavier, ARIA live regions pour les malvoyants).
  - [x] 11.5.4 Mettre à jour `01_PRD.md`, `README.md`, `README.fr.md` et `tasks/lessons.md`.

---

## 🔮 Phase 12 (V2.1 - Extensions Biomécaniques Avancées) [TERMINÉE]

- [x] **Phase 12.1 : Surveillance de la Proximité Écran-Yeux (Profondeur Z)**
  - [x] 12.1.1 Calculer la distance inter-oculaire / faciale normalisée par la largeur d'épaules dans `posture-engine.js`.
  - [x] 12.1.2 Capturer la distance faciale de référence lors de la calibration "Point Zéro".
  - [x] 12.1.3 Intégrer la 4ème jauge biomécanique "Distance Écran" (Seuil INRS > 50-70cm) avec alertes visuelles et audio latchées.

- [x] **Phase 12.2 : Gardien Visuel & Règle Oculaire 20-20-20**
  - [x] 12.2.1 Créer le gestionnaire de cycle oculaire 20-20-20 (`src/pacing/eye-rest-timer.js`).
  - [x] 12.2.2 Concevoir le composant d'incitation visuelle douce (overlay ou bannière non agressive "Regardez au loin à 6m pendant 20s").
  - [x] 12.2.3 Enrichir les dictionnaires i18n (`translations.js`) en FR et EN.

- [x] **Phase 12.3 : Synchronisation Duale, Validation & Documentation**
  - [x] 12.3.1 Valider le bon fonctionnement dans `90_Code_Source/`.
  - [x] 12.3.2 Rétro-porter les modules et composants dans la version autonome `index.html`.
  - [x] 12.3.3 Tests automatisés de non-régression et mise à jour de la documentation.

---

## 🛠️ Phase 13 : Plan de Remédiation & Stabilisation v2.2 (Post-Audit 360°)

- [x] **Chantier 1 : Parité Duale & Rétablissement de `90_Code_Source/` (Bloquant)**
  - [x] 13.1.1 Nettoyer `90_Code_Source/index.html` (suppression du double `</head>`, alignement des 14 IDs DOM avec `app.js`, retrait des `onclick` inline).
  - [x] 13.1.2 Corriger l'état du bouton audio dans `app.js` et porter les fonctions modales manquantes (`switchCamera`, synchronisation temps réel des sliders).
  - [x] 13.1.3 Neutraliser les scripts `tasks/build_*.js` obsolètes et créer un script de build sécurisé et déterministe (`tasks/build_standalone.js`).
- [x] **Chantier 2 : Exactitude Biomécanique, Audio, Kiné & i18n**
  - [x] 13.2.1 Supprimer le code mort dans `posture-engine.js` et corriger l'asymétrie de détection de l'épaule droite (`Math.abs` sur le delta par rapport au `baseline`).
  - [x] 13.2.2 Corriger l'angle mort sur l'inclinaison latérale et stabiliser la Profondeur Z face aux rotations de tête.
  - [x] 13.2.3 Éliminer la race condition Web Audio (oscillateur continu orphelin) et couper le son/halo sur perte de repères (`!current`) ou arrêt caméra.
  - [x] 13.2.4 Préserver `KineStudioView.updateComplete()` en fin de routine Kiné et distinguer `skipRest()` de `endRest()` dans le gardien oculaire.
  - [x] 13.2.5 Corriger le bug des clés `t('title_' + currentMode)` et connecter les 12 éléments orphelins au switch de langue bilingue FR/EN.
- [x] **Chantier 3 : Design System Fluent UI 2 & Accessibilité WCAG 2.1 AA**
  - [x] 13.3.1 Déclarer les 4 variables CSS manquantes (`--fluent-bg-surface-flyout`, `--fluent-stroke-surface`, `--radius-xl`, `--transition-normal`) et réparer les SVG de `src/kine/exercises.js`.
  - [x] 13.3.2 Corriger 100 % des ruptures de contraste Light et Dark (texte sur `#cameraPlaceholder`, boutons `#btnCalibrate` et badges d'alerte en Dark Mode, bandeaux HUD Canvas).
  - [x] 13.3.3 Convertir `.btn-preset` en `<button>`, agrandir les cibles tactiles < 32px, ajouter `aria-selected`, `aria-live="polite"` et stopper le tressautement numérique avec `tabular-nums`.
  - [x] 13.3.4 Réorganiser `.gauges-grid` en 2×2 sous 1480px pour les écrans portables 13"/14".
- [x] **Chantier 4 : Sécurité, Performance 30 FPS & CI/CD**
  - [x] 13.4.1 Sécuriser `createTimelineRow` contre le DOM XSS, épingler les scripts MediaPipe CDN et assainir l'export CSV.
  - [x] 13.4.2 Mettre en cache les nœuds DOM dans `onResults` et fiabiliser les décomptes temporels en arrière-plan via `Date.now()`.
  - [x] 13.4.3 Restreindre le déploiement GitHub Pages dans `.github/workflows/deploy.yml` pour masquer les dossiers internes.

---

## 🧩 Phase 14 : Extension Navigateur (Chrome & Firefox) & Monétisation Éthique (Pass 7 €/an) [TERMINÉE]

- [x] **Phase 14.1 : Socle WebExtension Cross-Browser (Manifest V3 Chrome & Firefox)**
  - [x] **14.1.1 Création des Manifestes Spécifiques (`90_Code_Source/manifest.chrome.json` & `manifest.firefox.json`)**
    - [x] Configurer `"manifest_version": 3`, `"version": "3.0.0"`, permissions minimales `["storage", "alarms", "notifications", "sidePanel"]` (sans `"sidePanel"` sur Firefox).
    - [x] Définir la CSP stricte : `"extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; connect-src 'self' https://api.lemonsqueezy.com;"`.
    - [x] Déclarer `"side_panel": { "default_path": "index.html" }` pour Chrome et `"sidebar_action"` + `"browser_specific_settings.gecko"` (`id: "ergovision-ai@ergovision.app"`, `strict_min_version: "115.0"`) pour Firefox.
  - [x] **14.1.2 Rapatriement Local des Binaires MediaPipe Wasm (`90_Code_Source/vendor/mediapipe/`)**
    - [x] Créer `tasks/fetch_mediapipe_vendor.js` pour télécharger localement `pose.js`, `camera_utils.js`, `drawing_utils.js`, `pose_solution_packed_assets.data`, `pose_solution_simd_wasm_bin.js/.wasm` et les modèles `.tflite`.
    - [x] Remplacer les 3 balises `<script src="https://cdn.jsdelivr.net/...">` dans `90_Code_Source/index.html` par les chemins locaux `./vendor/mediapipe/*.js`.
    - [x] Mettre à jour `locateFile` dans `90_Code_Source/src/app.js` et `camera-stream.js` pour résoudre les binaires via `chrome.runtime.getURL('vendor/mediapipe/' + file)` en contexte extension et `./vendor/mediapipe/` en contexte web.
  - [x] **14.1.3 Service Worker d'Arrière-Plan (`90_Code_Source/src/extension/background.js`)**
    - [x] Activer `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` sur Chrome et `browser.sidebarAction.toggle()` au clic sur l'icône sur Firefox.
    - [x] Implémenter le récepteur `chrome.runtime.onMessage` (`POSTURE_STATUS_CHANGED`, `PACING_TICK`) pour mettre à jour le badge de l'icône en temps réel (`OK` vert `#107c41`, `!` rouge `#d13438`, ou minutes restantes `45m`).
    - [x] Programmer `chrome.alarms` (`ergovision-eye-rest`) pour maintenir les notifications 20-20-20 même si le panneau latéral est fermé.
  - [x] **14.1.4 Adaptation Responsive « Side Panel Mode » (`90_Code_Source/css/style.css`)**
    - [x] Créer le breakpoint `@media (max-width: 520px)` adaptant `.topbar` en colonne compacte, `.bento-grid` en `1fr`, `.gauges-grid` en `2x2` condensé et le viewport vidéo en `4/3` sans aucun scroll horizontal jusqu'à `320px` de large.
  - [x] **14.1.5 Pack d'Icônes Store (`90_Code_Source/assets/icons/`)**
    - [x] Générer `icon.svg` et les déclinaisons PNG `16x16`, `32x32`, `48x48` et `128x128`.

- [x] **Phase 14.2 : Moteur de Licence « Socle Libre + Pass 7 €/an » (`90_Code_Source/src/license/`)**
  - [x] **14.2.1 Module `src/license/license-gate.js`**
    - [x] Définir le schéma de persistance `ergovision_license_v1` (`tier`, `licenseKey`, `activatedAt`, `expiresAt` à +365 jours sans renouvellement auto, `instanceId`, `practitionerCode`).
    - [x] Implémenter `getFeatureFlags()` : débloquer uniquement la Jauge 1 (`gaugeNeckSlump: true`), le 20-20-20 (`eyeRest202020: true`) et le 1er exercice Kiné (`['mckenzie']`) en mode `FREE` ; tout débloquer en mode `PRO_ANNUAL_PASS`.
    - [x] Implémenter `activateLicenseKey(key)` avec support de l'API LemonSqueezy (`POST /v1/licenses/activate`) + vérificateur de clés hors-ligne signées (`ERGO-...`) pour les tests cabinets kiné et les reviewers Google/Mozilla.
  - [x] **14.2.2 Verrouillage Visuel Bienveillant dans le DOM & le Moteur (`app.js`, `kine-studio-view.js`, `style.css`)**
    - [x] Appliquer la classe `.gauge-locked` et un badge cliquable `🔒 Pass 7€/an` sur les cartes `#cardShoulder`, `#cardTilt` et `#cardDepth` en mode Gratuit.
    - [x] Restreindre le déclenchement de l'alerte sonore `anyBad` dans `app.js` à la seule jauge active (`badNeck`) en mode Gratuit pour éviter toute alerte fantôme.
    - [x] Ajouter le verrou sur le bouton `#btnPiP` (Mini-Fenêtre) et sur les exercices Kiné 2, 3 et 4 (Brügger, Extension thoracique, Bascule pelvienne) avec ouverture directe de la modale d'activation au clic.
  - [x] **14.2.3 Modale Fluent UI 2 d'Activation (`#licenseModal` dans `index.html`)**
    - [x] Ajouter le bouton d'état `#btnProStatus` dans la `.topbar` (`✨ Pass Complet · 7€/an` vs `🛡️ Pass Actif · XXXj`).
    - [x] Construire `<dialog id="licenseModal">` présentant la charte éthique (*7 €/an fixe, zéro abonnement automatique, 100 % local*), le récapitulatif des fonctionnalités débloquées, le lien d'achat et le champ de saisie de clé `#inputLicenseKey`.
  - [x] **14.2.4 Internationalisation FR / EN (`src/i18n/translations.js`)**
    - [x] Ajouter les ~25 clés de traduction relatives au Pass 7 €/an, aux cadenas d'aperçu et aux messages de validation de clé.

- [x] **Phase 14.3 : Bilan Postural Imprimable / PDF pour le Kiné (`src/reports/kine-report.js`)**
  - [x] **14.3.1 Agrégateur & Vue d'Impression Clinique A4**
    - [x] Créer `90_Code_Source/src/reports/kine-report.js` agrégeant les logs `ergovision_daily_log_*` sur 7 à 30 jours (score moyen de posture neutre, répartition des dérives C7-C8 / Trapèzes / Inclinaison / Proximité, nombre de routines Kiné complétées, ratio Assis/Debout).
    - [x] Concevoir la feuille de style `@media print` générant un bilan A4 d'une page avec graphiques SVG vectoriels et encart d'observations pour le kinésithérapeute via `window.print()`.

- [x] **Phase 15 : Refonte UI/UX Épurée & Repositionnement Rééducation Kiné (v3.3)**
  - [x] **15.1 : Migration Thème Light par Défaut & Design System Épuré**
    - [x] 15.1.1 Définir le thème `'light'` par défaut dans `90_Code_Source/index.html` (`data-theme="light"`) et migrer la clé de stockage `ergovision_theme_v2` dans `90_Code_Source/src/ui/theme.js` pour purger l'ancien cache sombre.
    - [x] 15.1.2 Rehausser la palette Light dans `90_Code_Source/css/style.css` : fond Mica clinique (`#f8fafc`), cartes blanches pures (`#ffffff`) avec ombres douces (0 1px 3px rgba(0,0,0,0.05)), suppression de la couleur jaune boueuse au profit d'un ambre chaud lisible.
    - [x] 15.1.3 Éliminer le fond noir `rgba(9, 12, 20, 0.85)` de `.viewport-bar` au profit d'une barre d'action externe claire sous le flux vidéo.
  - [x] **15.2 : Header Minimaliste & Menu « Notifs & Alertes » Popover**
    - [x] 15.2.1 Supprimer les 3 boutons de posture (`#segAssis`, `#segDebout`, `#segPause`), le badge technique `Fluent Workstation v3.2` et le sélecteur `Tolérance / Sensibilité` de la topbar.
    - [x] 15.2.2 Concevoir le menu popover **« Notifs & Alertes » (`#btnNotifsMenu`)** regroupant : Switch Alerte Audio (On/Off), Curseur de Volume (0-100%), Sélecteur de profil sonore (Pulse doux / Continu), et Switch Notifications OS.
    - [x] 15.2.3 Réorganiser les actions rapides en 1 seule ligne compacte : Bouclier + Titre à gauche, Badge Pass + Bouton PiP + Menu Notifs (`🔔`) + Réglages (`⚙️`) + Thème + Langue à droite.
  - [x] **15.3 : Dégagement Intégral du Cadre Caméra & Barre d'Action Externe**
    - [x] 15.3.1 Sortir `.viewport-bar` du flux vidéo pour créer la barre externe `.camera-controls-bar` sous le canvas.
    - [x] 15.3.2 Éliminer la mention `(BUREAU ASSIS)` du HUD vidéo et des badges d'état (`POSTURE NEUTRE` épuré).
    - [x] 15.3.3 Structurer la barre de contrôle : Bouton primaire `🎯 Calibrer Point Zéro (3s)` + Bouton secondaire `⏹️ Arrêter`, et sélecteur de caméra discret.
  - [x] **15.4 : Repositionnement « Session de Rééducation (30 min) » & Accès Kiné**
    - [x] 15.4.1 Modifier la logique du timer dans `app.js` et `pacing-timer.js` : Bloquer le défilement automatique au chargement ; ne démarrer le compte à rebours 30:00 qu'après verrouillage effectif du Point Zéro.
    - [x] 15.4.2 Gérer la fin de session (30 min) : arrêt automatique bienveillant du capteur, carillon doux, félicitations et sauvegarde du score de session.
    - [x] 15.4.3 Reloger l'accès à l'Atelier Kiné : ajouter un bouton d'action directe **`🧘 Étirements Kiné (5 min)`** dans la carte de session et à l'expiration des 30 minutes.
  - [x] **15.5 : Allègement des 4 Jauges & Nettoyage du Journal**
    - [x] 15.5.1 Supprimer les numéros `1.`, `2.`, `3.`, `4.` et condenser les cartes de jauges (supprimer les paragraphes de 2 lignes sous chaque jauge et les basculer en infobulles/tooltips).
    - [x] 15.5.2 Corriger le bug des clés de traduction `title_assis` / `title_debout` et supprimer les logs de changement de posture intempestifs dans `app.js`.
  - [x] **15.6 : Synchronisation Standalone, Compilation Extension (`dist/`) & Validation**
    - [x] 15.6.1 Rétro-porter les améliorations dans le script de build ou `index.html`.
    - [x] 15.6.2 Exécuter `node tasks/build_extension.js` pour mettre à jour `dist/chrome/` et `dist/firefox/`.
    - [x] 15.6.3 Valider la conformité de l'extension Firefox MV3 et la propreté visuelle.

---

## 🪟 Phase 16 : Mode « Fenêtre Décrochée » / Pop-out Autonome OS (Solution A)

- [x] **Phase 16.1 : Moteur Pop-out & Cycle de Vie Indépendant (`src/ui/popout.js` / `camera-stream.js`)**
  - [x] 16.1.1 Conception de `openPopoutWindow()` : ouverture d'une fenêtre OS dédiée (`chrome.windows.create({ type: 'popup', width: 420, height: 640 })` ou `window.open('index.html?mode=popout')`).
  - [x] 16.1.2 Canal de synchronisation inter-fenêtres `BroadcastChannel('ergovision_sync')` pour coordonner l'ouverture, la fermeture et le rapatriement sans conflit d'accès webcam.
  - [x] 16.1.3 Décharge propre de la caméra dans le panneau latéral hôte (`stopCamera()`) et affichage d'un panneau d'état rassurant (« Actif dans votre mini-fenêtre ») avec bouton « ↩️ Rapatrier ici ».
- [x] **Phase 16.2 : Adaptation UI/UX & Responsive Décroché (`mode-popout`)**
  - [x] 16.2.1 Détection automatique de `?mode=popout` dans l'URL pour appliquer `.mode-popout` sur `<body>` et démarrage automatique du capteur optique.
  - [x] 16.2.2 Styles CSS Fluent UI 2 dédiés dans `90_Code_Source/css/style.css` pour `.mode-popout` (topbar chirurgicale, canvas vidéo haute lisibilité, jauges 2×2 condensées, masquage des blocs encombrants).
  - [x] 16.2.3 Bouton de ré-ancrage / plein écran dans la popout permettant de repasser en vue standard ou fermer la mini-fenêtre proprement.
- [x] **Phase 16.3 : Extension Background & Messages MV3 (`src/extension/background.js`)**
  - [x] 16.3.1 Prise en charge du message `OPEN_POPOUT_WINDOW` dans `src/extension/background.js` pour Chrome MV3.
  - [x] 16.3.2 Maintien des badges d'icône d'extension synchronisés depuis la mini-fenêtre popout.
- [x] **Phase 16.4 : Intégration i18n & Traductions (FR / EN)**
  - [x] 16.4.1 Clés de traduction pour les infobulles, bandeaux d'état déporté (« ErgoVision tourne dans votre mini-fenêtre ») et boutons d'action (« Rapatrier », « Fenêtre Décrochée »).
- [x] **Phase 16.5 : Compilation Standalone, Build Extension, Validation & Leçons**
  - [x] 16.5.1 Intégration dans `tasks/build_standalone.js` et compilation déterministe de `index.html`.
  - [x] 16.5.2 Exécution de `node tasks/build_extension.js` pour actualiser `dist/chrome/` et `dist/firefox/`.
  - [x] 16.5.3 Validation syntaxique, intégrité JS/CSS et mise à jour de `tasks/lessons.md`.

---

## 🎨 Phase 17 : Identité Visuelle Officielle, Améliorations UI Stitch & Actifs Stores

- [x] **Phase 17.1 : Création du Logo Officiel & Actifs Multi-Résolutions**
  - [x] 17.1.1 Conception du logo master vectoriel SVG (`90_Code_Source/assets/icons/logo.svg`) : fusion de l'alignement rachidien (5 vertèbres biomécaniques C1-L5) et de l'ouverture optique/iris protectrice.
  - [x] 17.1.2 Génération de l'icône carrée vectorielle (`90_Code_Source/assets/icons/icon.svg`) et des rendus 3D glassmorphism haute résolution (`10_Design_et_Assets/`).
  - [x] 17.1.3 Génération des icônes PNG nettes (16, 32, 48, 128 px) pour Chrome Web Store et Firefox AMO.
- [x] **Phase 17.2 : Améliorations UI/UX issues de Google Stitch (`projects/6043396530362013034`)**
  - [x] 17.2.1 Intégration du logo officiel dans le header de l'application, l'écran d'accueil du capteur et la mini-fenêtre popout.
  - [x] 17.2.2 Badge de télémétrie live `🟢 LIVE • 30 FPS • MediaPipe Wasm` dans le viewport vidéo.
  - [x] 17.2.3 Jauges biomécaniques avec pilules d'état cliniques (`OK`, `ATTN`, `DÉRIVE`), élévation au survol (soft lift -2px) et ombres douces à deux biseaux.
  - [x] 17.2.4 Anneau circulaire SVG de progression temporelle sur la session de rééducation (30 min) et jauge de maintien neutre en temps réel.
- [x] **Phase 17.3 : Compilation, Synchronisation & Validation Multi-Plateformes**
  - [x] 17.3.1 Compilation standalone (`index.html` root, 229 Ko) sans erreur de syntaxe.
  - [x] 17.3.2 Compilation des archives Store (`dist/ergovision-chrome-mv3.zip` et `dist/ergovision-firefox-mv3.zip`).
  - [x] 17.3.3 Rapport de synthèse et présentation visuelle à l'utilisateur.

---

## 📊 Phase 18 : Dashboard Graphique & Analytics Locaux (7 à 30 jours) [TERMINÉE]

- [x] **Phase 18.1 : Moteur Analytique & Agrégation Multijour (`src/analytics/posture-analytics.js`)**
  - [x] 18.1.1 Définir les fonctions de requête multijours (`getMultiDayKeys`, `loadMultiDayLogs`).
  - [x] 18.1.2 Calculer les métriques synthétiques : score moyen, delta tendance vs période antérieure, durée totale, dérive dominante.
  - [x] 18.1.3 Implémenter le générateur de simulation de données démo sur 7 jours (`seedMockHistory7Days`) et le nettoyage (`clearAllMultiDayHistory`).
- [x] **Phase 18.2 : Dictionnaires de Traduction Bilingue (`src/i18n/translations.js`)**
  - [x] 18.2.1 Ajouter les ~20 clés bilingues FR/EN pour les KPI cards, les périodes (7j, 14j, 30j), les légendes et actions.
- [x] **Phase 18.3 : Composant UI & Visualisation Graphique SVG Native (`src/ui/analytics-view.js`)**
  - [x] 18.3.1 Concevoir le conteneur du tableau de bord avec sélecteur de périodes (7j, 14j, 30j) et 4 KPI cards.
  - [x] 18.3.2 Concevoir l'histogramme SVG vectoriel réactif avec seuil INRS 80%, dégradés de score et graduations journalières.
  - [x] 18.3.3 Concevoir la barre de répartition biomécanique des dérives (Nuque, Épaules, Inclinaison, Distance) avec légende.
- [x] **Phase 18.4 : Styles Fluent UI 2 & Responsive (`css/style.css`)**
  - [x] 18.4.1 Définir les styles des cartes KPI, barres SVG, badges de tendance et tooltips en mode Light et Dark.
  - [x] 18.4.2 Optimiser l'affichage responsive et le repli accordéon.
- [x] **Phase 18.5 : Câblage Applicatif & Événements (`app.js`, `index.html`)**
  - [x] 18.5.1 Insérer le conteneur et le bouton d'accordéon dans `90_Code_Source/index.html`.
  - [x] 18.5.2 Câbler l'initialisation, le rafraîchissement automatique lors des fins de cycle et les écouteurs de boutons dans `app.js`.
- [x] **Phase 18.6 : Compilation Standalone, Builds Extension & Validation Finale**
  - [x] 18.6.1 Mettre à jour `tasks/build_standalone.js` pour intégrer les nouveaux modules.
  - [x] 18.6.2 Exécuter `node tasks/build_standalone.js` et valider la syntaxe du standalone `index.html`.
  - [x] 18.6.3 Exécuter `node tasks/build_extension.js` pour actualiser `dist/chrome/` et `dist/firefox/`.
  - [x] 18.6.4 Validation fonctionnelle et mise à jour de `tasks/lessons.md`.

---

## Logique et Apprentissage

### Phases 11 & 12 : V2.0 et V2.1 — Kiné du Dos & Hygiène Visuelle Oculaire
1. **Estimation Monoculaire de Profondeur Z sans Capteur LiDAR** : En exploitant l'écartement des repères faciaux (yeux/oreilles) normalisé par l'envergure scapulaire et comparé à l'état calibré initial, on déduit précisément le rapprochement vers l'écran sans recourir à un capteur physique 3D coûteux.
2. **Suspension Croisée Bienveillante des Alertes (Ciliary Rest UX)** : L'application de la règle 20-20-20 impose d'orienter le regard vers un horizon dégagé (au moins 6 mètres). Durant ces 20 secondes, suspendre temporairement les alertes sonores de dérive posturale évite d'induire un stress paradoxal chez l'utilisateur et renforce l'adoption du tuteur ergonomique.
3. **Architecture Duale Inviolable** : La stricte synchronisation entre les modules ES6 documentés (`90_Code_Source/`) et le fichier de déploiement direct sans bundler (`index.html`), conjuguée à la sanctuarisation de la V1 (`v1/` et tag `v1.0.0`), offre à la fois maintenabilité pour les ingénieurs et portabilité universelle pour les utilisateurs finaux.
4. **Ergonomie Fréquentielle** : L'utilisation de tonalités sinusoïdales à 432 Hz pour la décompression kinésithérapique et 528 Hz pour la pause oculaire crée un ancrage sensoriel doux, distinct des alertes d'avertissement postural plus percutantes.





