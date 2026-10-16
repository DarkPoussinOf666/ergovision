# 🏪 Guide de Soumission & Textes Réglementaires — Stores d'Extensions

Ce guide fournit l'ensemble des textes, justifications et procédures à copier-coller lors de la soumission d'**ErgoVision AI** sur le **Chrome Web Store** et **Mozilla Firefox Add-ons (AMO)**.

---

## 1. Google Chrome Web Store

- **Fichier à téléverser** : `dist/ergovision-chrome-mv3.zip` (12.3 Mo, incluant Wasm MediaPipe et modèles hors-ligne)
- **Frais de compte développeur** : 5 $ (paiement unique)
- **Catégorie** : *Productivité* ou *Santé & Bien-être*

### Titre & Descriptions Officielles

#### Français (FR)
- **Nom de l'extension** : `ErgoVision AI — Studio Postural & Prévention TMS`
- **Résumé court (132 car. max)** :
  > Copilote biomécanique 100% local prévenant l'affaissement cervical (Text-Neck) et guidant les étirements kiné du dos au poste de travail.
- **Description détaillée** :
  ```markdown
  ErgoVision AI transforme votre navigateur en un copilote ergonomique et biomécanique bienveillant, conçu pour soulager la colonne vertébrale des professionnels passant plus de 6 heures par jour sur écran.

  🔬 PRINCIPALES FONCTIONNALITÉS
  • 4 Jauges Biomécaniques en Direct : Projection cervicale (C7-C8), asymétrie trapèzes/épaules, inclinaison latérale de la tête et distance écran (<50cm).
  • Studio Kiné du Dos : Protocoles cliniques guidés (Rétraction McKenzie, Posture Brügger, Extension thoracique, Bascules pelviennes) avec respiration calée.
  • Règle Oculaire 20-20-20 : Micro-pauses automatiques toutes les 20 minutes pour défatiguer la vision.
  • Panneau Latéral & Miniature Flottante (PiP) : Gardez un œil sur votre posture par-dessus VS Code, Teams, Slack ou Figma.
  • Bilan Kiné Imprimable (PDF) : Exportez votre rapport hebdomadaire d'observance à montrer à votre kinésithérapeute ou ostéopathe.

  🔒 100% CONFIDENTIEL & LOCAL (ZÉRO SERVEUR)
  Toutes les analyses de vision par ordinateur sont exécutées sur votre propre processeur via WebAssembly. Aucun flux vidéo n'est enregistré, transmis ou partagé sur Internet.
  ```

### Justification des Permissions (Revue de Sécurité Google)

| Permission | Justification exacte à copier dans la console Google |
| :--- | :--- |
| `sidePanel` | Utilisé pour maintenir l'interface de contrôle et le retour postural de l'utilisateur ouverts de manière persistante sur le côté pendant sa navigation multitâche sur le web. |
| `storage` | Utilisé pour mémoriser localement sur l'ordinateur de l'utilisateur ses réglages de pauses, son seuil de tolérance et son historique d'activité sous forme chiffrée locale. |
| `alarms` | Utilisé pour cadencer les micro-pauses oculaires 20-20-20 et les rappels de changement de posture même si le panneau latéral est momentanément masqué. |
| `notifications` | Utilisé pour prévenir discrètement l'utilisateur lors d'une mauvaise posture prolongée (>2.5s) sans interrompre son travail. |
| `Webcam (getUserMedia)` | Utilisé exclusivement en local pour l'estimation de pose par MediaPipe WebAssembly. Aucun flux vidéo ne quitte la machine de l'utilisateur. |

### Procédure de Test pour les Équipes de Modération Google & Mozilla
- Indiquez dans les notes de test pour le reviewer :
  > *« Pour tester l'intégralité des 4 jauges et fonctionnalités du Pass annuel, vous pouvez activer la clé de démonstration fournie pour les équipes de modération : `ERGO-REVIEWER-2026`. Cliquez sur le bouton "Pass Complet · 7€/an" en haut à droite et validez cette clé. »*

---

## 2. Mozilla Firefox Add-ons (AMO)

- **Fichier à téléverser** : `dist/ergovision-firefox-mv3.zip`
- **Frais de compte développeur** : Gratuit
- **Identifiant d'extension** : `ergovision-ai@ergovision.app`
- **Validation** : Renseignez la description bilingue identique à ci-dessus.

---

## 3. Politique de Confidentialité (Zero-Data Privacy Policy)

L'URL publique hébergeable sur GitHub Pages : `https://YOUR_USER.github.io/ErgoVision/SECURITY.html`

**Engagement Formel** :
1. Aucune donnée personnelle, biométrique ou vidéo n'est collectée, analysée sur un serveur distant ou vendue.
2. Le modèle Google MediaPipe Pose s'exécute entièrement dans la mémoire vive locale du navigateur (WebAssembly).
3. Aucune balise de tracking Google Analytics, cookie publicitaire ou télémétrie tierce n'est présente dans le code.
