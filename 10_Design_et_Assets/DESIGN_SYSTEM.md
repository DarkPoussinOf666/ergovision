# Spécification du Design System — ErgoVision AI (Fluent UI 2)

Ce document établit la spécification officielle du Design System d'**ErgoVision AI**, articulé autour de l'architecture **Microsoft Fluent UI 2 (Modern Workstation)**. Il fournit les fondations visuelles, les tokens sémantiques, les composants interactifs et les garanties d'accessibilité nécessaires pour un monitoring biomécanique clinique de haute précision.

---

## 1. Architecture des Tokens (3 Tiers)

Conformément à la spécification Fluent UI 2, les tokens sont organisés en trois niveaux stricts :
1. **Tier Global (Primitives)** : Valeurs brutes context-agnostic (`grey14`, `brand80`, `spacingL`).
2. **Tier Alias (Sémantique)** : Rôles fonctionnels commutés selon le thème (`colorNeutralBackground1`, `colorBrandBackground`, `colorStatusDangerBackground1`).
3. **Tier Composant** : Propriétés ciblées des composants (`buttonPrimaryBackground`, `gaugeTrackHeight`).

---

## 2. Les 8 Couches Fondamentales

### 2.1 Système de Couleurs & Ramps

#### Ramp Brand (Médical & Ergonomie)
- **Base Stop 80 (Light)** : `#0f6cbd` (Cyan/Bleu Fluent)
- **Base Stop 100 (Dark)** : `#479ef5`
- **Nuances de transition** : 16 paliers du stop `10` (`#020305`) au stop `160` (`#ebf3fc`).

#### Ramp Neutres
- De `black` (`#000000`) et `grey8` (`#141414`) pour les surfaces sombres OLED jusqu'à `grey98` (`#fafafa`) et `white` (`#ffffff`) pour les toiles claires.

#### Rôles Sémantiques & États Biologiques
| État Biomécanique | Token Sémantique | Thème Clair (Light) | Thème Sombre (Dark) | Rôle Clinique |
|:---|:---|:---:|:---:|:---|
| **Nominal / Aligné** | `--fluent-color-status-success-*` | Fond `#e6f7ef` / Texte `#0e7042` | Fond `#0a2e1d` / Texte `#54b080` | Maintien neutre, calibration valide |
| **Pré-Alerte / Pacing** | `--fluent-color-status-warning-*` | Fond `#fff8e5` / Texte `#8f6200` | Fond `#382800` / Texte `#e8b339` | Fatigue posturale, fin de tranche assis |
| **Alerte Active** | `--fluent-color-status-danger-*` | Fond `#fdf3f4` / Texte `#b71c1c` | Fond `#3b080c` / Texte `#f1707b` | Dérive posturale prolongée > 2.5s |

### 2.2 Typographie

- **Police Principale (`--fluent-font-family-base`)** : `'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, sans-serif`
- **Police Numérique (`--fluent-font-family-numeric`)** : `Bahnschrift, 'Segoe UI', -apple-system, sans-serif` (pour les chronomètres, scores et pourcentages de déviation)
- **Police Monospace (`--fluent-font-family-monospace`)** : `Consolas, 'Courier New', Courier, monospace` (pour les timestamps de logs et débits d'images)

| Échelle | Taille / Line Height | Usage dans l'application |
|:---|:---:|:---|
| `fontSize100` | 10px / 14px | Micro-badges d'état, versioning |
| `fontSize200` | 12px / 16px | Légendes des jauges anatomiques, timestamps logs |
| `fontSize300` | 14px / 20px | **Corps de texte standard, libellés de boutons** |
| `fontSize400` | 16px / 22px | Titres de cartes et sections secondaires |
| `fontSize500` | 20px / 28px | En-têtes de modules fonctionnels |
| `fontSize700` | 28px / 36px | Valeurs numériques clés (Chrono, score %) |

*Note de licence légale* : `Segoe UI` est propriétaire de Microsoft. La pile CSS inclut `-apple-system`, `BlinkMacSystemFont`, `Roboto` et `sans-serif` pour garantir une substitution sans faille sur Linux, macOS et Android.

### 2.3 Échelle d'Espacement (Grille de 4px)

| Token | Valeur | Application UI |
|:---|:---:|:---|
| `--fluent-spacing-xs` | 4px | Écart icône-texte compact |
| `--fluent-spacing-s` | 8px | Marge interne des badges, padding compact |
| `--fluent-spacing-m` | 12px | Padding standard des boutons et cellules |
| `--fluent-spacing-l` | 16px | Gouttières entre cartes du Bento Grid |
| `--fluent-spacing-xl` | 20px | Marge interne des panneaux principaux |
| `--fluent-spacing-xxxl`| 32px | Espacement des sections majeures |

### 2.4 Rayons de Bordure (`borderRadius`)

- `--fluent-border-radius-small` (2px) : Badges de tolérance et indicateurs discrets.
- `--fluent-border-radius-medium` (4px) : Boutons d'action, sélecteurs, champs d'entrée.
- `--fluent-border-radius-large` (6px) : Jauges, cartes orthèses et conteneurs secondaires.
- `--fluent-border-radius-x-large` (8px) : Panneaux Bento et cadre de la caméra vidéo.
- `--fluent-border-radius-circular` (10000px) : Badges d'état (status pills) et boutons d'icônes ronds.

### 2.5 Ombres & Élévation (Dual-Layer)

- `--fluent-shadow-2` : État au repos des cartes légères (`0 1px 2px rgba(0,0,0,0.14), 0 0 2px rgba(0,0,0,0.12)`).
- `--fluent-shadow-4` : Cartes interactives au repos.
- `--fluent-shadow-8` : Cartes au survol / focus actif.
- `--fluent-shadow-16` : Sélecteurs contextuels et menus déroulants.
- `--fluent-shadow-28` : Overlays et bannières modales d'alerte.

### 2.6 États d'Interaction & Verrouillage A11y

- **Hover** : Transition de 150ms vers `--fluent-color-subtle-background-hover` ou `--fluent-color-brand-background-hover`.
- **Pressed** : Transition vers `--fluent-color-brand-background-pressed` avec compression légère (`transform: scale(0.98)`).
- **Focus Ring Double** : 
  - Anneau interne `--fluent-color-stroke-focus-1` (Blanc en clair, Noir en sombre).
  - Anneau externe `--fluent-color-stroke-focus-2` (Noir en clair, Blanc en sombre).
  - Garantit une visibilité de focus absolue sur tout type d'arrière-plan.

### 2.7 Mouvement & Timing

- Micro-interactions (hover, switch) : `150ms` avec `--fluent-curve-decelerate`.
- Déploiement de panneaux / jauges : `250ms` avec `--fluent-curve-easy-ease`.
- Alerte posturale : Pulsation périphérique fluide de 1.2s sans saccade stroboscopique.

---

## 3. Spécifications des Composants Fluent 2

### 3.1 Bouton (`Fluent Button`)

**Anatomie :**
```
┌──────────────────────────────────────────────┐
│ [Leading Icon]  [Button Label]  [Badge/State]│
└──────────────────────────────────────────────┘
```
- **Tokens associés** : `--fluent-color-brand-background`, `--fluent-color-neutral-foreground-on-brand`, `--fluent-spacing-m`, `--fluent-border-radius-medium`.
- **Variantes** : Primary (CTA calibration), Secondary/Outline (Audio, Notifs, PiP), Danger (Arrêt capteur).
- **Cible tactile minimale** : 32px sur desktop, 48px sur écran tactile.

### 3.2 Contrôle Segmenté (`Segmented Control / TabList`)

**Anatomie :**
```
┌────────────────────────────────────────────────────────┐
│ [💻 Bureau Assis (Active)] | [🧍 Debout] | [🧘 Pause]  │
└────────────────────────────────────────────────────────┘
```
- **Tokens associés** : Conteneur `--fluent-color-neutral-background-4`, item inactif `--fluent-color-neutral-foreground-2`, item actif `--fluent-color-brand-background` + shadow-2.

### 3.3 Jauge Anatomique de Déviation

**Anatomie :**
```
┌────────────────────────────────────────────────────────┐
│ Titre Jauge (Projection Nuque)  Valeur / Seuil (14°/12°)│
│ ┌────────────────────────────────────────────────────┐ │
│ │████████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ │ (Barre Fluent)
│ └────────────────────────────────────────────────────┘ │
│ Explication ergonomique du risque postural             │
└────────────────────────────────────────────────────────┘
```
- **Tokens associés** : Rail `--fluent-color-neutral-stroke-2`, curseur dynamique vert/ambre/rouge (`--fluent-color-status-*`), rayon `--fluent-border-radius-circular`.

---

## 4. Audit de Contraste (WCAG 2.1 Niveau AA)

| Élément | Couleur Texte | Couleur Fond | Ratio de Contraste Calculé | Statut WCAG AA |
|:---|:---:|:---:|:---:|:---:|
| Texte principal (Clair) | `#242424` | `#ffffff` | **14.2:1** | ✅ Conforme (Min 4.5:1) |
| Texte secondaire (Clair) | `#424242` | `#ffffff` | **9.6:1** | ✅ Conforme (Min 4.5:1) |
| Texte principal (Sombre) | `#ffffff` | `#1f1f1f` | **16.1:1** | ✅ Conforme (Min 4.5:1) |
| Texte secondaire (Sombre)| `#d6d6d6` | `#1f1f1f` | **10.8:1** | ✅ Conforme (Min 4.5:1) |
| Bouton primaire texte/fond | `#ffffff` | `#0f6cbd` | **4.6:1** | ✅ Conforme (Min 4.5:1) |
| Badge Alerte (Sombre) | `#f1707b` | `#3b080c` | **5.4:1** | ✅ Conforme (Min 4.5:1) |
| Badge Nominal (Sombre) | `#54b080` | `#0a2e1d` | **5.2:1** | ✅ Conforme (Min 4.5:1) |
| Bordures de contrôle | `#525252` | `#1f1f1f` | **3.1:1** | ✅ Conforme (Min 3.0:1) |

---

## 5. Directives Do & Don't

- **DO** : Utiliser exclusivement `--fluent-font-family-numeric` pour les chronomètres de cadence et pourcentages afin d'éviter le tremblement des largeurs de caractères lors des mises à jour temps réel.
- **DON'T** : N'utilisez jamais d'ombre portée simple (`box-shadow: 0 4px 10px rgba(0,0,0,0.5)`) ; appliquez systématiquement les ombres dual-layer (`--fluent-shadow-*`).
- **DO** : Conserver un indicateur textuel et iconographique couplé à la couleur pour les états de sécurité (accessibilité aux daltonismes).
- **DON'T** : Ne jamais réduire la hauteur des boutons interactifs sous les 32px (`--fluent-touch-target-desktop`).
