# 🛡️ ErgoVision AI — Coach Postural & Pause Mobilité

<p align="center">
  <strong>Copilote ergonomique au poste de travail en temps réel, 100 % exécuté dans le navigateur, conçu pour le confort postural, les pauses oculaires 20-20-20 et la mobilité au bureau.</strong>
</p>

<p align="center">
  <a href="./README.md"><strong>🇬🇧 Read documentation in English</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Licence-MIT-blue.svg" alt="Licence : MIT">
  <img src="https://img.shields.io/badge/Confidentialit%C3%A9-100%25%20Locale%20(Z%C3%A9ro%20T%C3%A9l%C3%A9m%C3%A9trie)-success.svg" alt="100% Local">
  <img src="https://img.shields.io/badge/Moteur-MediaPipe%20Pose%20(Wasm%20%2B%20WebGL)-orange.svg" alt="MediaPipe Pose">
  <img src="https://img.shields.io/badge/Accessibilit%C3%A9-WCAG%202.1%20AA-blueviolet.svg" alt="WCAG 2.1 AA">
  <img src="https://img.shields.io/badge/Design-Fluent%20UI%202%20Mica-0f6cbd.svg" alt="Fluent UI 2">
  <img src="https://img.shields.io/badge/i18n-Fran%C3%A7ais%20%7C%20English-brightgreen.svg" alt="i18n FR/EN">
</p>

---

## 💡 Pourquoi ErgoVision AI ?

Le travail prolongé devant écran engendre des contraintes mécaniques chroniques sur la chaîne rachidienne, des surtensions des trapèzes et des dérives posturales insidieuses — particulièrement pour les profils sédentaires et les personnes ayant des sensibilités articulaires ou squelettiques.

**ErgoVision AI** agit comme un tuteur bienveillant et discret. Grâce à la vision par ordinateur directement intégrée dans votre navigateur, il surveille les repères biomécaniques clés pour vous avertir avant que les mauvaises postures ne se transforment en douleurs physiques, tout en respectant scrupuleusement votre vie privée (aucun flux vidéo n'est transmis sur Internet).

---

## 🌟 Fonctionnalités Clés

### 1. 🔬 Analyse Biomécanique Ciblée (4 Jauges Temps Réel)
- **Rachis Cervical & Détection du « Text-Neck »** : Mesure le ratio normalisé entre le nez et la ligne bi-acromiale pour détecter l'affaissement de la tête vers l'avant.
- **Symétrie Scapulaire & Protection des Trapèzes** : Surveille l'élévation réflexe d'une épaule causée par la fatigue ou un accoudoir asymétrique.
- **Surveillance de l'Inclinaison Latérale** : Prévient les torsions unilatérales prolongées de la nuque.
- **Distance Écran-Yeux & Profondeur Z (Nouveauté v2.1)** : 4ème jauge biomécanique mesurant le rapprochement excessif de l'écran (<50cm, seuil INRS) pour prévenir la cyphose de compensation et la fatigue visuelle.
- **Calibration Interactive 3 Secondes (« Point Zéro »)** : S'adapte instantanément à la morphologie, à la taille du bureau et à la position de votre écran.

### 2. 👁️ Gardien Visuel & Règle Oculaire 20-20-20 (Nouveauté v2.1)
- **Hygiène Visuelle Clinique** : Toutes les 20 minutes, un bandeau discret et un carillon doux (528 Hz) vous invitent à relâcher l'accommodation cilaire en regardant au loin (6 mètres) pendant 20 secondes.
- **Suspension Croisée Bienveillante** : Les alertes de posture sont automatiquement suspendues pendant la pause oculaire pour vous laisser contempler l'horizon sans fausse alerte.
- **Bouton Rapide « Passer »** : Reprise immédiate en cas de visioconférence ou de tâche urgente.

### 3. 🧘 Pause Mobilité & Étirements Guidés (v2.0)
- **Exercices Doux de Mobilité pour le Travail sur Écran** :
  - **Recul Axial du Menton (McKenzie)** : Relâchement de la nuque (C5-C7) et compensation de l'avancée vers l'écran.
  - **Ouverture Posturale de Brügger** : Ouverture scapulaire et inversion de l'enroulement d'épaules.
  - **Extension Dorsale sur Dossier** : Mobilisation du milieu du dos et ouverture respiratoire.
  - **Bascules Douces du Bassin** : Mobilité du bas du dos (L4-L5-S1) après station assise prolongée.
- **Guidage Visuel & Respiration Rythmée** : Pictogrammes anatomiques vectoriels SVG, jauge de maintien circulaire, décompte de répétitions et tempo respiratoire (inspire/expire).
- **Accompagnement Sonore Zen** : Sons doux de bol tibétain (~432Hz) marquant le début, la transition et la complétion des exercices sans surstimulation.

### 4. ⏱️ Pacing Postural Adaptatif
- **💻 Mode Bureau Assis** : Durée de session personnalisable (45 min par défaut).
- **🧍 Mode Bureau Debout** : Compteur croissant avec seuil d'alternance conseillé (15 min par défaut).
- **🧘 Mode Pause & Étirement Actif** : Compte à rebours dédié de 5 minutes avec **suspension automatique des alertes** pour bouger et vous étirer en toute liberté.
- **⏳ Dépassement de Session (Overtime)** : Lorsque le temps est écoulé, le chronomètre bascule en défilement négatif (`-01:23`) avec style d'avertissement sans interrompre brutalement votre concentration, et enregistre le score de maintien neutre atteint.

### 4. 🔊 Ergonomie Sonore Non Intrusive
- **Alerte Continue / Pulsée Dynamique** : Émet un bip cadencé discret ou une onde sinusoïdale douce en cas de mauvaise posture prolongée, et **s'éteint instantanément** dès que vous reprenez une posture conforme.
- **Carillon Harmonieux de Fin de Cycle** : Un carillon à trois tons (Do-Mi-Sol) marquant la fin du temps sans agressivité cognitive.
- **Anti-Rebond Intelligent (Debouncing / Latch)** : Une compensation continue génère exactement 1 log et 1 notification, éliminant les alertes répétitives en boucle.

### 4. 🪟 Multitâche & Accessibilité
- **Mode Picture-in-Picture (PiP) Miroir** : Affiche une miniature flottante avec HUD de posture par-dessus vos outils de travail (Teams, Slack, Jira, IDE).
- **Design System Fluent UI 2 Mica / Acrylique** : Respect strict des contrastes WCAG 2.1 AA et bascule instantanée Mode Sombre / Clair.
- **Internationalisation Bilingue Native (FR / EN)** : Bascule réactive en 1 clic de l'intégralité de l'interface, des jauges et des journaux.
- **Télémétrie Locale Quotidienne & Export CSV** : Enregistrement automatique des sessions dans `localStorage` avec export tabulaire.

---

## 🔒 Confidentialité 100% Locale (Zero-Trust)

- **Zéro Flux Vidéo Externe** : L'estimation de pose s'exécute exclusivement sur votre processeur via Google MediaPipe Pose en WebAssembly et WebGL.
- **Aucun Serveur Distant ni Télémétrie** : Aucun cookie, aucun tracker, aucun compte requis.
- **Données Conservées en Local** : Vos préférences et journaux restent sur votre propre machine (`localStorage`).

---

## ⚕️ Avertissement Ergonomique & Médical

> [!NOTE]
> **ErgoVision AI est un outil d'accompagnement ergonomique et de prise de conscience posturale, et non un dispositif médical de diagnostic.**
> Il a pour but d'aider les travailleurs sur écran à adopter des habitudes de mouvement saines. Il ne remplace en aucun cas un avis médical, un suivi en kinésithérapie ou un traitement orthopédique. En cas de douleurs persistantes, consultez un professionnel de santé qualifié.

---

## 🚀 Démarrage Rapide

Aucun bundler, aucune compilation ni installation de dépendances n'est requise !

### Option 1 : Utilisation Directe
1. Téléchargez ou clonez le dépôt :
   ```bash
   git clone https://github.com/VOTRE_COMPTE/ErgoVision.git
   ```
2. Double-cliquez directement sur `index.html` pour l'ouvrir dans Google Chrome, Microsoft Edge ou Brave.
3. Autorisez l'accès caméra, installez-vous confortablement et cliquez sur **« Calibrer Point Zéro (3s) »**.

### Option 2 : Serveur Local HTTP (Conseillé pour le développement modulaire)
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve .
```
- Ouvrez `http://localhost:8000/` pour la version autonome en un seul fichier.
- Ouvrez `http://localhost:8000/90_Code_Source/` pour la version de développement modulaire ES6.

---

## 🏗️ Architecture du Projet

Le dépôt suit une arborescence thématique numérotée (00 à 99) garantissant une traçabilité exemplaire :

```text
├── index.html                           # Version autonome prête pour GitHub Pages (sans bundler)
├── README.md                            # Documentation principale en Anglais
├── README.fr.md                         # Documentation miroir en Français
├── LICENSE                              # Licence MIT
├── CONTRIBUTING.md                      # Guide de contribution
├── CODE_OF_CONDUCT.md                   # Code de conduite communautaire
├── SECURITY.md                          # Politique de confidentialité et sécurité
├── .github/
│   ├── workflows/deploy.yml             # Workflow de déploiement automatique GitHub Pages
│   ├── ISSUE_TEMPLATE/                  # Modèles de rapports de bugs et de suggestions
│   └── pull_request_template.md         # Checklist de validation des PRs
├── 00_Conception_et_References/         # PRD (01_PRD.md), Contexte clinique (02_Contexte.md)
├── 10_Design_et_Assets/                 # Tokens DTCG Fluent UI 2 (JSON/CSS) & Specs
├── 20_Data_et_Bases/                    # Schémas d'état formels (state_schema.json)
├── 80_Tests_et_Deploiement/             # Plans de tests et guides de déploiement
└── 90_Code_Source/                      # Code source modulaire ES6 découplé
    ├── css/ (style.css, tokens.css)
    ├── src/ (audio, biomechanics, i18n, pacing, storage, ui, vision)
    └── index.html                       # Point d'entrée de développement modulaire
```

---

## 🤝 Contribuer

Les contributions, signalements de bugs et suggestions de fonctionnalités sont les bienvenus ! Consultez notre guide [CONTRIBUTING.md](./CONTRIBUTING.md) et notre [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

## 📄 Licence

Projet distribué sous la **Licence MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de précisions.
