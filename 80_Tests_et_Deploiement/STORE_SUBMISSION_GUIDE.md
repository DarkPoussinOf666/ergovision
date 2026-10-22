# 🏪 Guide de Soumission & Textes Réglementaires — Stores d'Extensions

Ce guide fournit l'ensemble des textes, justifications et procédures à copier-coller lors de la soumission d'**ErgoVision AI** (100 % Gratuit & Open-Source MIT) sur le **Chrome Web Store** et **Mozilla Firefox Add-ons (AMO)**.

---

## 1. Google Chrome Web Store

- **Fichier à téléverser** : `dist/ergovision-chrome-mv3.zip` (incluant Wasm MediaPipe et modèles hors-ligne)
- **Frais de compte développeur** : 5 $ (paiement unique à l'ouverture du compte Google Developer)
- **Catégorie** : *Productivité* ou *Bien-être*

### Titre & Descriptions Officielles

#### Français (FR)
- **Nom de l'extension** : `ErgoVision AI — Coach Postural & Pause Mobilité`
- **Résumé court (132 car. max)** :
  > Copilote ergonomique temps réel 100% local : rappels de posture, pauses oculaires 20-20-20 et étirements de mobilité au bureau.
- **Description détaillée** :
  ```markdown
  ErgoVision AI transforme votre navigateur en un copilote ergonomique bienveillant, conçu pour favoriser le confort postural des personnes travaillant longtemps sur écran.

  🔬 PRINCIPALES FONCTIONNALITÉS (100 % GRATUITES & DÉBLOQUÉES)
  • 4 Jauges Biomécaniques en Direct : Projection de la nuque, symétrie des épaules, inclinaison latérale de la tête et distance écran (<50 cm).
  • Pause Mobilité & Étirements : 4 routines guidées au bureau (Recul du menton McKenzie, Ouverture Brügger, Extension dorsale, Bascules du bassin) avec respiration rythmée.
  • Règle Oculaire 20-20-20 : Micro-pauses automatiques toutes les 20 minutes pour reposer vos yeux.
  • Panneau Latéral & Miniature Flottante (PiP) : Gardez un retour visuel discret par-dessus VS Code, Teams, Slack ou Figma.
  • Bilan Postural Imprimable (PDF) : Exportez en un clic votre synthèse d'habitudes posturales.

  🔒 100 % CONFIDENTIEL & LOCAL (ZÉRO SERVEUR)
  Toutes les analyses de vision par ordinateur sont exécutées sur votre propre processeur via WebAssembly. Aucun flux vidéo n'est enregistré, transmis ou partagé sur Internet.

  ⚠️ AVERTISSEMENT DE BIEN-ÊTRE
  ErgoVision AI est un outil de bien-être et d'ergonomie à usage général. Ce n'est pas un dispositif médical : il ne pose aucun diagnostic et ne remplace pas l'avis d'un professionnel de santé.
  ```

### Justification des Permissions (Revue de Sécurité Google)

| Permission | Justification exacte à copier dans la console Google |
| :--- | :--- |
| `sidePanel` | Utilisé pour maintenir l'interface de contrôle et le retour postural de l'utilisateur ouverts de manière persistante sur le côté pendant sa navigation multitâche sur le web. |
| `storage` | Utilisé pour mémoriser localement sur l'ordinateur de l'utilisateur ses réglages de pauses, son seuil de tolérance et son historique d'activité. |
| `alarms` | Utilisé pour cadencer les micro-pauses oculaires 20-20-20 même si le panneau latéral est momentanément masqué. |
| `notifications` | Utilisé pour prévenir discrètement l'utilisateur lors d'une dérive posturale prolongée (>2.5s) sans interrompre son travail. |
| `Webcam (getUserMedia)` | Utilisé exclusivement en local pour l'estimation de pose par MediaPipe WebAssembly. Aucun flux vidéo ne quitte la machine de l'utilisateur. |

### Notes pour les Équipes de Modération Google & Mozilla
- Indiquez dans les notes de revue :
  > *« ErgoVision AI est 100 % gratuit et open-source (MIT) sans création de compte ni verrou payant. Toutes les fonctionnalités (4 jauges, miniature Picture-in-Picture, Pause Mobilité et export PDF) sont immédiatement accessibles dès l'ouverture du panneau latéral. »*

---

## 2. Mozilla Firefox Add-ons (AMO)

- **Fichier à téléverser** : `dist/ergovision-firefox-mv3.zip`
- **Frais de compte développeur** : Gratuit
- **Identifiant d'extension** : `ergovision-ai@ergovision.app`
- **Collecte de données (`data_collection_permissions`)** : Déclarée à `["none"]` dans le manifeste.

---

## 3. Politique de Confidentialité & Mentions Légales (GitHub Pages)

- **URL de la Politique de Confidentialité (FR)** : `https://<VOTRE_COMPTE>.github.io/ErgoVision/privacy.html`
- **URL de la Politique de Confidentialité (EN)** : `https://<VOTRE_COMPTE>.github.io/ErgoVision/en/privacy.html`
- **URL des Mentions Légales & Contact** : `https://<VOTRE_COMPTE>.github.io/ErgoVision/legal.html`
- **Support Utilisateur** : `https://github.com/<VOTRE_COMPTE>/ErgoVision/issues`
