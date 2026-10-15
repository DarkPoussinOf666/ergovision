# Boucle d'Exécution Procédurale SKILL.state (skill-state-loop)

## Objectif
Garantir une empreinte de prompt bornée $O(1)$ et une consommation de tokens linéaire $O(T)$ pour toutes les tâches procédurales longues sans dérive d'attention.

## Algorithme de la Boucle
1. **Construction du Triplet Runtime $A_t$** :
   - Spécification procédurale immuable $P$.
   - État explicite courant $\Sigma_t$ extrait du schéma JSON.
   - Dernière observation $O_t$ (sortie d'outil, télémétrie, capteur).
2. **Génération LLM $(R_t, \Delta\Sigma_t, a_t)$** :
   - Raisonnement pas-à-pas $R_t$ (Chain-of-Thought).
   - Patch JSON de mutation $\Delta\Sigma_t$.
   - Action ou outil $a_t$.
3. **Transition d'État Déterministe Runtime** :
   - Validation du patch $\Delta\Sigma_t$ contre le schéma JSON.
   - Application de la fusion : $\Sigma_{t+1} \leftarrow \Sigma_t \oplus \Delta\Sigma_t$.
   - Destruction immédiate et définitive de $R_t$ (jamais réinjecté dans $t+1$).
4. **Persistance & Itération** :
   - Sauvegarde dans le checkpointer.
   - Vérification du disjoncteur (`max_iterations`).
   - Passage à l'étape $t+1$.
