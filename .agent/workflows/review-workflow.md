# Workflow de Revue de Code & QA (review-workflow)

## Objectif
Valider la conformité architecturale, la robustesse biomécanique, les tests et l'intégrité de la documentation avant livraison.

## Critères de Validation (Staff Engineer Review)
1. **Zéro Monolithe** : Les responsabilités sont-elles découplées ?
2. **Garde-fous Respectés** : Le code applicatif dans `90_Code_Source/` correspond-il strictement au périmètre du PRD validé ?
3. **Tests au Vert** : Les vérifications de non-régression et de syntaxe sont-elles confirmées ?
4. **Zéro Régression Biomécanique** :
   - Présence du debouncing / latch d'alerte.
   - Visibilité des landmarks MediaPipe vérifiée (`> 0.45`).
   - `AudioContext` lazy et PiP Canvas 2D miroir avec texte lisible.
5. **Documentation & Lessons** : Le journal `tasks/lessons.md` a-t-il été enrichi en cas de résolution de bug ?
