# ErgoVision AI - Leçons Apprises & Bonnes Pratiques

## 1. Web Audio API & Autoplay Policy
- Ne jamais instancier ni démarrer immédiatement un `AudioContext` au chargement de script.
- Instancier de manière lazy ou appeler `audioCtx.resume()` lors du premier clic utilisateur (ex: clic sur "Activer Capteur", "Calibrer", etc.).

## 2. MediaPipe Canvas & Picture-in-Picture (PiP)
- La transformation miroir par CSS `transform: scaleX(-1)` ne se propage pas au flux `canvas.captureStream()`.
- Pour que le PiP soit un vrai miroir naturel, le retournement doit être fait dans le contexte 2D Canvas (`translate(w, 0); scale(-1, 1)`).
- Tout texte ou HUD superposé doit être dessiné après un `restore()`, sinon le texte est affiché à l'envers.

## 3. Détection Biomécanique & Filtrage Bruit
- Ne jamais évaluer la posture si les repères clés (nez, épaules, oreilles) ont une visibilité `visibility < 0.5`.
- Implémenter un verrou anti-rebond (latch) : déclencher l'alerte sonore et la notification une seule fois lors du dépassement du seuil temporel (ex: 2.5s en mauvaise posture), et ne pas ré-inscrire un log à chaque frame d'une même dérive.

## 4. Design System & Ergonomie Visuelle (Fluent UI 2 & WCAG AA)
- **Typographie numérique tabulaire** : Toujours utiliser des fontes à espacement numérique fixe (`Bahnschrift`, monospace ou `font-variant-numeric: tabular-nums`) pour les compteurs et jauges en temps réel. Cela évite le tressautement visuel (jittering) qui parasite l'attention de l'utilisateur.
- **Double Focus Ring A11y** : Pour assurer une navigabilité clavier 100% conforme WCAG AA sur des fonds alternant entre clair et sombre, adopter le pattern d'anneau imbriqué (`--focus-ring-inner` et `--focus-ring-outer`).
- **Thème sans latence** : Initialiser la lecture du thème dans le `<head>` ou dès le chargement du DOM via `localStorage` pour éviter tout effet de flash blanc ou noir indésirable (FOUC).
- **Matérialité Mica & Acrylique** : Pour dépasser l'aspect "dark mode plat", superposer 3 couches : (1) un mesh radial ambiant sur le canvas, (2) un biseau spéculaire supérieur (`border-top: 1px solid rgba(255, 255, 255, 0.12)`), (3) un dégradé vertical subtil sur les cartes (`linear-gradient(180deg, card-inner 0%, card-bottom 100%)`).
## 5. Universalisation Ergonomique & Gestion du Contexte d'Activité
- **Suspension contextuelle des alertes** : Lorsqu'un mode « Pause & Étirement » est actif, suspendre formellement les alertes sonores et visuelles de déviation. Un système d'observation biomécanique ne doit pas pénaliser un utilisateur qui bouge et s'étire volontairement.
- **Paramétrage des cycles de travail (Pacing)** : Ne jamais hard-coder des durées de pacing arbitraires (ex: 45m assis, 12m debout). Fournir un modal de réglage léger accessible en un clic avec sauvegarde locale (`localStorage`), garantissant l'adéquation avec divers rythmes de travail (Pomodoro 25/5, 45/15, 52/17).
- **Universalité du modèle sémantique** : Bannir les pathologies médicales ou prescriptions orthopédiques nominatives au sein des libellés d'interface et des schémas d'état généraux. Privilégier des descripteurs fonctionnels anatomiques universels (« Projection cervicale », « Asymétrie scapulaire », « Inclinaison latérale »).

## 6. Feedback Audio Dynamique, Pacing Négatif & Persistance Télémétrique
- **Alerte Continue vs Agressivité Cognitive** : Une tonalité ininterrompue pure (500Hz) génère une fatigue auditive réflexe en moins de 5 secondes. Privilégier par défaut une pulsation cadencée (double bip doux toutes les 1,2s) avec arrêt instantané dès le retour au neutre. Offrir le choix de l'onde continue et le réglage du volume dans les paramètres.
- **Carillon de Fin de Cycle distinct** : Ne jamais utiliser le même timbre pour l'alerte posturale punitive et la fin d'un cycle de travail. Employer un accord majeur ascendant ou descendant harmonieux (Do-Mi-Sol) à résonance douce pour féliciter l'effort ergonomique.
- **Timer à Dépassement Négatif (Overtime Pacing)** : Bloquer un timer à 00:00 ou forcer une bascule de mode sans confirmation casse le flux de concentration (Deep Work). Faire défiler le timer en valeurs négatives (`-01:23`) avec style visuel d'avertissement et consigner le score exact de maintien neutre au moment du déclenchement.
- **Persistance Quotidienne Indépendante de Session** : Les utilisateurs rafraîchissent fréquemment leur navigateur. Les logs d'alertes, transitions et bilans de session doivent être sérialisés sous une clé journalière (`ergovision_daily_log_YYYY-MM-DD`) pour préserver l'historique sur toute la journée de travail.

## 7. Structuration Hybride Open-Source & Standardisation Internationale
- **Architecture Duale (Standalone vs Modulaire)** : Conserver à la fois une distribution `index.html` racine 100% autonome (zéro installation, déploiement immédiat en 1 clic sur GitHub Pages) et une architecture ES6 modulaire découplée dans `90_Code_Source/` (`audio`, `biomechanics`, `pacing`, `storage`, `ui`, `vision`). Cela supprime toute friction à l'adoption tout en permettant aux contributeurs internationaux de faire des PRs atomiques et testées.
- **Documentation Bilingue Miroir & Standard GitHub** : Pour maximiser l'impact mondial d'un projet de santé open source, placer le `README.md` principal en anglais (standard de facto des développeurs internationaux) avec un lien proéminent vers `README.fr.md` en français complet.
## 8. Coaching Kinésithérapique du Dos & Pacing de Pause Active
- **Guidage Bienveillant vs Surveillance Algorithmique Inquisitrice** : Lors d'une pause active, l'utilisateur a besoin de relâcher sa tension musculaire et mentale. Remplacer un chrono vide par des fiches d'exercices animées (McKenzie, Brügger, Extension thoracique, Bascule pelvienne) avec tempo respiratoire guidé et carillon zen bol tibétain (~432Hz) apporte une immense valeur réparatrice sans générer le stress d'une évaluation par caméra.
- **Micro-Étirements Découplés du FOV de la Webcam** : Les mouvements du dos (bascule du bassin sur chaise, décompression lombaire) se déroulent souvent hors du champ restreint d'une webcam de PC portable. Privilégier un guidage visuel/sonore autonome plutôt qu'une validation IA contraignante garantit un fonctionnement 100% robuste quel que soit l'angle ou la distance du poste de travail.

## 9. Surveillance Monoculaire de la Distance Écran & Règle Oculaire 20-20-20
- **Détection de Profondeur Z sans Capteur LiDAR** : En normalisant la largeur faciale inter-oculaire et bi-auriculaire par la largeur d'épaules et en comparant cette valeur relative à celle mesurée lors de la calibration, on détecte avec fiabilité l'avancement du buste vers l'écran (<50cm, seuil de risque visuel et cervical).
- **Suspension Croisée d'Alertes en Phase Oculaire** : Durant la pause 20-20-20, l'utilisateur tourne le regard vers l'horizon (au moins 6 mètres). Couper les alertes de posture durant ces 20 secondes évite les faux positifs et garantit une expérience utilisateur fluide et apaisante.

## 10. Architecture Duale Déterministe & Symétrie Biomécanique (v2.2)
- **Source Unique de Vérité Modulaire (`Single Source of Truth`)** : Ne jamais maintenir en parallèle et manuellement un fichier monolithique (`index.html`) et une arborescence ES6 modulaire (`90_Code_Source/`). Le code source réside exclusivement dans les modules ES6, et la distribution autonome de production est compilée par un script Node.js déterministe (`tasks/build_standalone.js`) validé en CI.
- **Symétrie Bilatérale des Deltas Posturaux** : Pour évaluer une asymétrie scapulaire ou cervicale, toujours appliquer `Math.abs(current - baseline)` sur le delta par rapport au point zéro, et non sur la coordonnée brute en amont.
- **Verrouillage de l'AudioContext contre les Race Conditions** : Lors de l'arrêt progressif (fade-out) d'un oscillateur sonore continu, annuler systématiquement les timeouts de coupure antérieurs lors d'un nouveau déclenchement pour éviter tout son orphelin infini dans l'AudioContext.
- **Conformité des Matériaux Fluent & Variables Fantômes** : Chaque variable CSS utilisée dans un composant (telle que `--fluent-bg-surface-flyout` ou `--fluent-stroke-surface`) doit posséder une définition explicite dans `:root` (Light) et `[data-theme="dark"]` pour bannir les fonds transparents accidentels.



