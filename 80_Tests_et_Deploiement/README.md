# Tests et Déploiement — 80_Tests_et_Deploiement

Ce dossier regroupe les scripts de tests automatisés (syntaxe, unitaires, end-to-end), fixtures de landmarks MediaPipe simulés, et configurations de déploiement (CI/CD GitHub Actions, Dockerfile si applicable).

## Contenu prévu
- `unit/` : Tests des fonctions mathématiques pures (calcul de ratio, normalisation inter-acromiale, debouncing).
- `e2e/` : Scénarios de test avec flux vidéo simulé ou capture statique.
- `fixtures/` : Coordonnées de repères synthétiques simulant une posture idéale et diverses dérives (projection nuque, hausses d'épaules, inclinaison latérale).
