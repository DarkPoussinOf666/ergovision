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

- [ ] **Phase 11.1 : Référentiel Clinique Kiné & Modèle de Données (Dos & Rachis)**
  - [ ] 11.1.1 Définir le schéma et le catalogue d'exercices dans `20_Data_et_Bases/kine_exercises.json`.
  - [ ] 11.1.2 Rédiger les 4 protocoles cliniques clés (Rétraction McKenzie, Posture Brügger, Extension thoracique active, Bascule pelvienne lombo-sacrée).
  - [ ] 11.1.3 Enrichir les dictionnaires i18n (`src/i18n/translations.js`) avec toutes les consignes, bénéfices, respirations et durées en FR et EN.
  - [ ] 11.1.4 Créer le module clinique modulaire `src/kine/exercises.js`.

- [ ] **Phase 11.2 : Moteur de Routine & Pacing Kiné (`src/kine/routine-timer.js`)**
  - [ ] 11.2.1 Concevoir le gestionnaire de cycle d'exercice (phases : Préparation 5s, Maintien actif 20-30s ou Répétitions x5, Relâchement, Transition).
  - [ ] 11.2.2 Intégrer les signaux Web Audio doux dédiés au coaching (gong tibétain / cloche douce de début/fin d'étirement, respiration guidée).
  - [ ] 11.2.3 Permettre la navigation manuelle (Suivant, Précédent, Pause/Reprise, Passer l'exercice).

- [ ] **Phase 11.3 : Composant UI Fluent UI 2 — Studio Kiné de Pause**
  - [ ] 11.3.1 Concevoir le conteneur immersif "Pause & Mobilisation Kiné" (surface Mica, bento card dédiée s'ouvrant en mode Pause).
  - [ ] 11.3.2 Illustrer chaque mouvement avec des pictogrammes/schémas SVG vectoriels haute clarté anatomique.
  - [ ] 11.3.3 Intégrer la jauge circulaire de maintien temporel / compteur de répétitions avec typographie tabulaire sans tremblement.
  - [ ] 11.3.4 Afficher les conseils de respiration guidée (Inspirer / Expirer) et la zone anatomique ciblée en temps réel.

- [ ] **Phase 11.4 : Intégration Système & Pacing Automatique**
  - [ ] 11.4.1 Déclenchement automatique de la routine kiné lors de la sélection du Mode Pause ou à l'expiration du temps assis/debout.
  - [ ] 11.4.2 Maintien strict de la suspension des alertes biomécaniques intrusives pendant la pause.
  - [ ] 11.4.3 Enregistrement dans le journal quotidien (`activity-logger.js`) des exercices complétés et du temps d'étirement actif.

- [ ] **Phase 11.5 : Rétro-portage Standalone, Validation WCAG & Documentation**
  - [ ] 11.5.1 Valider le bon fonctionnement dans `90_Code_Source/` (modules ES6).
  - [ ] 11.5.2 Rétro-porter les modules et styles dans la version autonome `index.html` (V2).
  - [ ] 11.5.3 Valider l'accessibilité WCAG 2.1 AA (contraste, focus clavier, ARIA live regions pour les malvoyants).
  - [ ] 11.5.4 Mettre à jour `01_PRD.md`, `README.md`, `README.fr.md` et `tasks/lessons.md`.

---

## 🔮 Phase 12 (V2.1 - Extensions Biomécaniques Avancées)
- [ ] 12.1 Surveillance de la Distance Écran-Yeux (Axe Z relatif via ratio crâne/épaules).
- [ ] 12.2 Règle Oculaire 20-20-20 & Détection du Clignement / Fatigue Visuelle.
- [ ] 12.3 Calibration Multi-Écrans (Poste de travail bi-écran).

---

## Logique et Apprentissage

L'introduction de la **Phase 9** confère à ErgoVision AI le niveau de finition d'une application professionnelle de santé au poste de travail :
1. **Ergonomie Cognitive du Son** : Remplacer un bip isolé par une boucle continue qui s'éteint *instantanément* à la correction posturale crée une boucle de rétroaction haptique/sonore ultra-efficace. La possibilité de choisir entre un double bip cadencé et un drone continu garantit le confort en espace partagé.
2. **Carillon de Fin de Cycle distinct & Overtime Pacing** : Permettre au chronomètre de passer en négatif (`-01:23`) au lieu d'une bascule forcée respecte l'état de flux de travail (Deep Work) tout en signalant clairement le dépassement et en récompensant le taux de posture neutre atteint.
3. **Persistance Locale Quotidienne** : L'indexation quotidienne des événements (`ergovision_daily_log_YYYY-MM-DD`) fiabilise l'application face aux fermetures d'onglets inopinées et offre une véritable télémétrie exportable pour le suivi d'ergonomie en entreprise.
4. **Internationalisation Native (i18n)** : L'application bascule instantanément entre le Français et l'Anglais sans rechargement de page, avec synchronisation complète du HUD vidéo, des indicateurs biomécaniques et du journal d'activité.




