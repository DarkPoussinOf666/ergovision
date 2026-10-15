# Règles Globales du Projet (Global Rules) — ErgoVision AI

## ⛔ Garde-fou Strict : Bloquer le code avant PRD
- **Interdiction Formelle** : Il est strictement INTERDIT de créer, modifier ou générer des fichiers de code applicatif dans `90_Code_Source/` tant que le fichier `00_Conception_et_References/01_PRD.md` contient des placeholders non résolus ou tant que la case `[ ] PRD Validé` n'est pas cochée par l'utilisateur.
- **Obligation d'Information** : Si une demande invite à coder prématurément dans `90_Code_Source/`, l'agent doit interrompre l'exécution, expliquer poliment la contrainte et proposer d'aider à finaliser le PRD.

## 📐 Standards Qualité & Architecture
- **Typage Strict & Robustesse** : Typage TypeScript strict ou contrats d'interfaces explicites avec JSDoc/Type Hints.
- **Séparation des Responsabilités** : Aucune logique monolithique. Découplage strict entre capture vidéo, traitement mathématique biomécanique, moteur d'état et rendu UI/Audio.
- **Élégance & Simplicité** : Préférer les solutions natives Web (Canvas, Web Audio, LocalStorage) aux frameworks tiers lourds non justifiés.
- **Conventional Commits** : Messages à l'impératif (`feat:`, `fix:`, `refactor:`, `test:`).
