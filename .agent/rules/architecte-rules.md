# Règles de l'Architecte (architecte-rules) — ErgoVision AI

## 1. Conception Modulaire & Contrats
- Toute fonctionnalité biomécanique doit d'abord être modélisée sous forme d'équation mathématique ou de machine à états avant d'être confiée au développeur.
- Normalisation systématique des coordonnées par rapport à la largeur inter-acromiale ($L_{épaules} = \|P_{épaule\_G} - P_{épaule\_D}\|$).
- Découplage strict entre les constantes cliniques (seuils d'angle, temps de latence) et l'implémentation de la vue.

## 2. Règle du "Qui s'oppose, propose"
- Si une directive technique compromet la fluidité (30 FPS), la confidentialité (envoi réseau) ou l'ergonomie cognitive (bips agressifs), l'Architecte bloque la proposition et fournit une alternative élégante.
