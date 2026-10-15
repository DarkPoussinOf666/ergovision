# Contexte Général & Vision du Projet — ErgoVision AI

## Vision Produit
ErgoVision AI est né d'un constat critique en ergonomie du poste de travail : les rappels de posture statiques ou génériques sont inefficaces car ils ignorent la réalité biomécanique individuelle (variations morphologiques, asymétries naturelles, confort articulaire) et induisent un agacement cognitif.

ErgoVision AI offre un **gardien ergonomique et biomécanique temps réel non invasif**, capable d'apprendre l'alignement neutre de l'utilisateur grâce à une calibration en un clic (« Point Zéro »), tout en cadençant intelligemment le temps passé dans chaque configuration de travail (bureau assis, bureau debout, pauses actives et étirements).

---

## Personas & Utilisateurs

### 1. Persona Principal : Le Développeur / Concepteur Numérique sur Écran
- **Profil** : Travail prolongé devant 1 à 3 écrans, concentration intense avec perte progressive de proprioception.
- **Besoins** : Être alerté avec discernement dès que la tête plonge vers l'avant ou qu'une épaule se crispe, sans être interrompu brutalement dans son flow de réflexion.
- **Frustrations** : Les applications qui s'affolent pour un hochement de tête naturel ou qui spamment des bips agressifs en boucle.

### 2. Persona Secondaire : L'Utilisateur de Bureau Réglable (Assis / Debout)
- **Profil** : Équipé d'un standing desk, alternant régulièrement entre station assise et station debout.
- **Besoins** : Un outil qui cadence l'alternance sans contrainte rigide, avec des seuils temporels personnalisables et des alertes de surutilisation de la station debout.

### 3. Persona Tertiaire : Le Travailleur Sédentaire en Quête de Pauses Actives
- **Profil** : Posture figée plusieurs heures d'affilée, sujet aux raideurs de nuque et tensions d'épaules.
- **Besoins** : Un mode « Pause & Étirement » dédié suspendant automatiquement les alertes pour bouger, mobiliser le haut du corps et s'étirer librement.

---

## Environnement & Métier

### Règles Métier Critiques
1. **Normalisation Dimensionnelle** : Ne jamais comparer des pixels bruts. Tout calcul d'écart est normalisé par la distance inter-acromiale (largeur entre les épaules), garantissant la robustesse quelle que soit la distance à la caméra ou la résolution vidéo.
2. **Filtrage Anti-Rebond (Debounce / Latch)** : Une mauvaise posture continue déclenche une notification unique et une alerte sonore unique au passage du seuil temporel (ex: 2.5 secondes). Une nouvelle alerte ne peut intervenir qu'après retour à une posture conforme.
3. **Point Zéro Adaptatif** : L'algorithme ne présume pas d'un corps théorique standardisé. La calibration capture l'alignement physiologique neutre propre à chaque morphologie et mesure uniquement les **dérives relatives**.
4. **Pacing Temporel Personnalisable** :
   - Assis : Période de concentration avec alternance recommandée (configurable, ex: 45 min).
   - Debout : Compteur d'effort avec palier d'alerte pour éviter la fatigue articulaire (configurable, ex: 15 min).
   - Pause & Étirement : Compte à rebours de pause active (configurable, ex: 5 min) avec désactivation temporaire des alertes.

### Glossaire Biomécanique
- **Projection Antérieure (Text-Neck)** : Avancement du bloc crânien par rapport au plan des épaules, démultipliant la charge mécanique exercée sur les disques et la musculature cervicale.
- **Asymétrie Scapulaire & Tensions Trapézoïdales** : Élévation anormale ou asymétrique d'une épaule, signe de fatigue, stress postural ou compensation musculaire unilatérale.
- **Inclinaison Latérale de Tête** : Maintien prolongé de la tête penchée d'un côté (ex: écran secondaire décalé, appui coude), source de déséquilibres cervicaux.
- **Point Zéro** : Vecteur des coordonnées biomécaniques de référence capturées lors d'une posture idéale déclarée par l'utilisateur.
