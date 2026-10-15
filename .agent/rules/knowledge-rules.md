# Gouvernance de la Connaissance, Exécution SKILL.state & Architecture Cognitive

## 1. Architecture d'Exécution Procédurale SKILL.state (O(1) Prompt / O(T) Tokens)
- **Modèle de Transition d'État Explicite** : Remplacer l'historique conversationnel append-only par des transitions d'état explicites. À l'étape $t$, l'agent reçoit uniquement :
  $$A_t = (P, \Sigma_t, O_t)$$
  où $P$ est la spécification procédurale immuable, $\Sigma_t$ est l'état structuré courant, et $O_t$ est la dernière observation.
- **Raisonnement Éphémère (Ephemeral CoT)** :
  L'agent génère $(R_t, \Delta\Sigma_t, a_t)$ où $R_t$ est la réflexion pas-à-pas Chain-of-Thought. Une fois le patch d'état $\Delta\Sigma_t$ validé et appliqué, **$R_t$ est immédiatement et définitivement détruit**. Il ne doit jamais être réinjecté dans les prompts suivants.
- **Opérateur de Fusion Déterministe ($\oplus$) & Sémantique Null-Delete** :
  $$\Sigma_{t+1} \leftarrow \Sigma_t \oplus \Delta\Sigma_t$$
  Le patch $\Delta\Sigma_t$ est un dictionnaire JSON de mutations. Pour supprimer une clé, lui assigner explicitement la valeur `null`.
- **Validation Runtime du Schéma** : La validation du schéma et la propriété de l'état persistant résident dans le runtime déterministe (jamais dans le modèle LLM seul). Tout patch JSON invalide déclenche un cycle de rollback-retry sans corrompre $\Sigma_t$.
- **Résilience au Bruit et à la Dérive Environnementale** : Les télémétries et bruits de fond sont filtrés lors de la génération du patch et n'entrent jamais dans les prompts suivants. En cas de modification externe imprévue du monde, la correction est appliquée immédiatement (0 recovery step).

## 2. Boucles Agentiques & Disjoncteurs
- **Prévention des IAL (Infinite Agentic Loops)** : Toute itération autonome d'un agent doit posséder un disjoncteur formel (`max_iterations`).
- **Validation d'Intentions (Sovereign Loop)** : Évaluer systématiquement les retours d'erreurs d'outils sans répéter la même action erronée.

## 3. Graphes d'État (State Graphs - Orchestration Métier)
- **Déterminisme Métier** : Utiliser un état partagé strictement typé (TypedDict / Pydantic / JSON Schema) avec reducers pour fusionner les branches de workflows multi-étapes.
- **Persistance & HITL** : Assurer la persistance via un checkpointer dans `20_Data_et_Bases/` et placer des points d'arrêt (`interrupt_before`) pour les validations humaines (ex: validation du PRD, confirmation de refactor).

## 4. Graphes de Connaissances (Knowledge Graphs & GraphRAG)
- **Cartographie Structurelle (Graphify)** : Utiliser des parseurs AST locaux pour la topologie du code sans surcoût d'inférence.
- **Mémoire Sémantique (GraphRAG)** : S'appuyer sur des représentations de graphes relationnels pour les requêtes multi-sauts, en extrayant uniquement les sous-graphes pertinents.
