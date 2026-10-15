# Workflow de Développement Standard (dev-workflow)

## Prérequis
- Garde-fou PRD levé (`[x] PRD Validé` dans `00_Conception_et_References/01_PRD.md`).
- Tâches décomposées de manière atomique dans `tasks/todo.md`.

## Étapes
1. **Sélection de la tâche atomique** dans `tasks/todo.md`.
2. **Implémentation & Typage strict** dans `90_Code_Source/`.
3. **Tests Unitaires & Non-Régression** dans `80_Tests_et_Deploiement/`.
4. **Validation de bon fonctionnement** (preuve d'exécution).
5. **Mise à jour documentaire** : Actualiser `tasks/todo.md`, et documenter les règles dans `tasks/lessons.md`.
6. **Commit conventionnel** : `feat: ...`, `fix: ...`.
