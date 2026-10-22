/**
 * ErgoVision AI - Physiotherapy Exercises Module (Kiné du Dos)
 * Clinically validated micro-exercises for desk workers.
 */

/**
 * @typedef {'cervical' | 'thoracic' | 'lumbar' | 'full_spine'} TargetArea
 * @typedef {'repetition' | 'hold'} ExerciseType
 * 
 * @typedef {Object} KineExercise
 * @property {string} id
 * @property {TargetArea} targetArea
 * @property {string} protocol
 * @property {ExerciseType} type
 * @property {number} reps
 * @property {number} holdSec
 * @property {number} restSec
 * @property {number} totalDurationSec
 * @property {string} iconSvg
 */

export const KINE_EXERCISES = [
  {
    id: "mckenzie_chin_tuck",
    targetArea: "cervical",
    protocol: "McKenzie (Rétraction Cervicale)",
    type: "repetition",
    reps: 5,
    holdSec: 3,
    restSec: 2,
    totalDurationSec: 45,
    iconSvg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="kine-svg kine-svg-mckenzie" aria-label="Rétraction cervicale McKenzie">
      <!-- Repère vertical de référence (Plan neutre du dos) -->
      <line x1="42" y1="20" x2="42" y2="108" stroke="var(--fluent-stroke-subtle)" stroke-width="1.5" stroke-dasharray="3 3" />
      
      <!-- Buste et épaule stables (immobiles) -->
      <path d="M42 68 C42 62, 50 60, 62 60 C74 60, 80 65, 82 74 L84 105" stroke="var(--fluent-fg-muted)" stroke-width="2.5" stroke-linecap="round" />
      <path d="M42 68 L36 105" stroke="var(--fluent-fg-muted)" stroke-width="2.5" stroke-linecap="round" />

      <!-- Flèche directionnelle animée de glissement horizontal -->
      <g class="anim-arrow-mckenzie">
        <path d="M78 40 L60 40 M65 35 L60 40 L65 45" stroke="var(--status-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <text x="76" y="32" font-size="8" font-weight="700" fill="var(--status-success)">RECUL AXIAL</text>
      </g>

      <!-- Bloc Tête et Rachis Cervical (mobile en translation arrière) -->
      <g class="anim-head-mckenzie">
        <!-- Crâne et profil visage -->
        <path d="M52 26 C52 14, 76 14, 78 26 C79 32, 75 38, 70 42 C67 43, 64 45, 62 48" stroke="var(--fluent-fg-primary)" stroke-width="2.5" stroke-linecap="round" fill="var(--fluent-bg-surface-card)" />
        <path d="M76 25 L82 28 L76 31" stroke="var(--fluent-fg-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> <!-- Nez -->
        <path d="M74 37 L78 37 C77 41, 72 43, 68 43" stroke="var(--fluent-fg-primary)" stroke-width="2" stroke-linecap="round" /> <!-- Menton -->

        <!-- Vertèbres Cervicales C1-C7 -->
        <rect x="49" y="33" width="7" height="3" rx="1" fill="var(--fluent-stroke-strong)" />
        <rect x="48" y="38" width="7" height="3" rx="1" fill="var(--fluent-stroke-strong)" />
        <rect x="47" y="43" width="7" height="3" rx="1" fill="var(--fluent-stroke-strong)" />
        <!-- Disques C5-C6-C7 décomprimés (surbrillance émeraude) -->
        <rect x="46" y="48" width="8" height="3.5" rx="1" fill="var(--status-success)" class="vertebra-pulse" />
        <rect x="45" y="53" width="8.5" height="3.5" rx="1" fill="var(--status-success)" class="vertebra-pulse" />
        <rect x="44" y="58" width="9" height="3.5" rx="1" fill="var(--status-success)" class="vertebra-pulse" />
        
        <!-- Badge C5-C7 -->
        <rect x="18" y="50" width="24" height="12" rx="3" fill="var(--fluent-brand-tint)" stroke="var(--fluent-brand)" stroke-width="1" />
        <text x="30" y="59" font-size="7.5" font-weight="800" fill="var(--fluent-brand)" text-anchor="middle">C5-C7</text>
        <line x1="42" y1="56" x2="45" y2="56" stroke="var(--fluent-brand)" stroke-width="1" />
      </g>
    </svg>`
  },
  {
    id: "brugger_relief",
    targetArea: "thoracic",
    protocol: "Brügger (Décharge Posturale)",
    type: "hold",
    reps: 2,
    holdSec: 20,
    restSec: 5,
    totalDurationSec: 50,
    iconSvg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="kine-svg kine-svg-brugger" aria-label="Posture de Brügger">
      <!-- Assise de chaise ergonomique -->
      <rect x="30" y="82" width="60" height="6" rx="2" fill="var(--fluent-stroke-subtle)" />
      <line x1="38" y1="88" x2="38" y2="108" stroke="var(--fluent-stroke-subtle)" stroke-width="2" />
      <line x1="82" y1="88" x2="82" y2="108" stroke="var(--fluent-stroke-subtle)" stroke-width="2" />

      <!-- Tête et regard à l'horizon -->
      <circle cx="60" cy="22" r="9" stroke="var(--fluent-fg-primary)" stroke-width="2.5" fill="var(--fluent-bg-surface-card)" />
      
      <!-- Buste et Rachis Dorsal T1-T12 (Érigé) -->
      <path d="M60 31 L60 80" stroke="var(--fluent-fg-primary)" stroke-width="3" stroke-linecap="round" />
      
      <!-- Cage thoracique & Vertèbres thoraciques actives -->
      <g class="anim-chest-brugger">
        <path d="M48 44 C48 38, 72 38, 72 44 C72 58, 48 58, 48 44 Z" fill="rgba(16, 124, 65, 0.12)" stroke="var(--status-success)" stroke-width="1.5" />
        <circle cx="60" cy="42" r="2.5" fill="var(--status-success)" />
        <circle cx="60" cy="49" r="2.5" fill="var(--status-success)" />
        <circle cx="60" cy="56" r="2.5" fill="var(--status-success)" />
      </g>

      <!-- Bras gauche avec rotation externe 45° -->
      <g class="anim-arm-left-brugger">
        <path d="M48 38 L30 52 L16 68" stroke="var(--fluent-brand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Paume ouverte vers l'avant -->
        <circle cx="14" cy="70" r="3.5" fill="var(--status-success)" stroke="var(--fluent-brand)" stroke-width="1.5" />
        <path d="M12 76 C16 78, 22 76, 26 70" stroke="var(--status-success)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2" />
      </g>

      <!-- Bras droit avec rotation externe 45° -->
      <g class="anim-arm-right-brugger">
        <path d="M72 38 L90 52 L104 68" stroke="var(--fluent-brand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Paume ouverte vers l'avant -->
        <circle cx="106" cy="70" r="3.5" fill="var(--status-success)" stroke="var(--fluent-brand)" stroke-width="1.5" />
        <path d="M108 76 C104 78, 98 76, 94 70" stroke="var(--status-success)" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="2 2" />
      </g>

      <!-- Rétraction des omoplates (flèches vers le centre-bas) -->
      <path d="M44 48 L52 52 M52 52 L47 54 M52 52 L50 47" stroke="var(--status-warning)" stroke-width="2" stroke-linecap="round" />
      <path d="M76 48 L68 52 M68 52 L73 54 M68 52 L70 47" stroke="var(--status-warning)" stroke-width="2" stroke-linecap="round" />

      <!-- Badge T1-T12 -->
      <rect x="47" y="66" width="26" height="11" rx="3" fill="var(--fluent-brand-tint)" stroke="var(--fluent-brand)" stroke-width="1" />
      <text x="60" y="74.5" font-size="7.5" font-weight="800" fill="var(--fluent-brand)" text-anchor="middle">T1-T12</text>
    </svg>`
  },
  {
    id: "thoracic_extension",
    targetArea: "thoracic",
    protocol: "Extension Dorsale sur Dossier",
    type: "repetition",
    reps: 5,
    holdSec: 4,
    restSec: 3,
    totalDurationSec: 45,
    iconSvg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="kine-svg kine-svg-extension" aria-label="Extension thoracique sur dossier">
      <!-- Chaise ergonomique avec dossier pivot au niveau T6-T8 -->
      <path d="M28 86 H70 L72 108 M34 86 L34 108" stroke="var(--fluent-stroke-subtle)" stroke-width="2" stroke-linecap="round" />
      <path d="M44 86 V56" stroke="var(--fluent-stroke-strong)" stroke-width="4" stroke-linecap="round" /> <!-- Dossier haut -->
      
      <!-- Coussin / point pivot charnière T6-T8 -->
      <circle cx="44" cy="56" r="4.5" fill="var(--status-warning)" class="pivot-glow" />

      <!-- Buste et tête en extension sur le dossier -->
      <g class="anim-trunk-extension">
        <!-- Rachis inférieur stable -->
        <path d="M54 86 C52 74, 48 64, 46 56" stroke="var(--fluent-fg-muted)" stroke-width="3" stroke-linecap="round" />

        <!-- Rachis thoracique et cervical qui s'arque en arrière -->
        <path d="M46 56 C44 46, 50 36, 56 28" stroke="var(--status-success)" stroke-width="3.5" stroke-linecap="round" />
        
        <!-- Tête avec mains en berceau cervical protecteur -->
        <circle cx="62" cy="22" r="8" stroke="var(--fluent-fg-primary)" stroke-width="2.5" fill="var(--fluent-bg-surface-card)" />
        
        <!-- Bras croisés derrière la nuque protégeant C1-C7 -->
        <path d="M50 42 L66 30 L64 20" stroke="var(--fluent-brand)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M54 38 L68 28 L66 18" stroke="var(--fluent-brand)" stroke-width="2" stroke-linecap="round" />

        <!-- Arc d'ouverture thoracique -->
        <path d="M68 34 C76 38, 78 48, 74 54" stroke="var(--status-success)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2" />
        <path d="M73 54 L76 50 M73 54 L78 55" stroke="var(--status-success)" stroke-width="2" stroke-linecap="round" />

        <!-- Badge T4-T8 -->
        <rect x="14" y="44" width="24" height="12" rx="3" fill="var(--fluent-brand-tint)" stroke="var(--fluent-brand)" stroke-width="1" />
        <text x="26" y="53" font-size="7.5" font-weight="800" fill="var(--fluent-brand)" text-anchor="middle">T4-T8</text>
      </g>
    </svg>`
  },
  {
    id: "pelvic_tilt",
    targetArea: "lumbar",
    protocol: "Bascule Pelvienne (Lombaires)",
    type: "repetition",
    reps: 6,
    holdSec: 3,
    restSec: 2,
    totalDurationSec: 45,
    iconSvg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="kine-svg kine-svg-pelvic" aria-label="Bascule pelvienne lombo-sacrée">
      <!-- Assise de chaise -->
      <line x1="20" y1="92" x2="100" y2="92" stroke="var(--fluent-stroke-subtle)" stroke-width="3" stroke-linecap="round" />
      
      <!-- Cuisse et jambe assise stable -->
      <path d="M55 86 L85 86 L95 110" stroke="var(--fluent-fg-muted)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Tronc supérieur -->
      <path d="M42 22 L44 48" stroke="var(--fluent-fg-primary)" stroke-width="3" stroke-linecap="round" />
      <circle cx="42" cy="16" r="7" stroke="var(--fluent-fg-primary)" stroke-width="2.5" fill="var(--fluent-bg-surface-card)" />

      <!-- Complexe Pelvis / Sacrum oscillant en bascule -->
      <g class="anim-pelvis-rocking">
        <!-- Rachis Lombaire L1-L5 (alternance lordose / décompression) -->
        <g class="anim-lumbar-curve">
          <rect x="42" y="50" width="8" height="4" rx="1.5" fill="var(--fluent-stroke-strong)" />
          <rect x="43" y="56" width="8" height="4" rx="1.5" fill="var(--fluent-stroke-strong)" />
          <!-- Disques L4-L5 et L5-S1 en décompression active -->
          <rect x="44" y="62" width="8.5" height="4.5" rx="1.5" fill="var(--status-success)" class="vertebra-pulse" />
          <rect x="45" y="68" width="9" height="4.5" rx="1.5" fill="var(--status-success)" class="vertebra-pulse" />
        </g>

        <!-- Bassin / Ilium & Sacrum S1 -->
        <path d="M38 74 C40 68, 54 68, 58 74 L54 88 C48 91, 42 90, 36 86 Z" fill="var(--fluent-brand-tint)" stroke="var(--fluent-brand)" stroke-width="2.5" stroke-linejoin="round" />

        <!-- Double flèche courbe de bascule antéro-postérieure -->
        <path d="M26 80 C24 72, 30 64, 34 62" stroke="var(--status-success)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2" />
        <path d="M34 62 L30 63 M34 62 L33 67" stroke="var(--status-success)" stroke-width="2" stroke-linecap="round" />
        <path d="M64 68 C68 74, 66 82, 60 88" stroke="var(--status-success)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 2" />
        <path d="M60 88 L63 85 M60 88 L64 89" stroke="var(--status-success)" stroke-width="2" stroke-linecap="round" />

        <!-- Badge L4-S1 -->
        <rect x="64" y="54" width="26" height="12" rx="3" fill="var(--fluent-brand-tint)" stroke="var(--fluent-brand)" stroke-width="1" />
        <text x="77" y="63" font-size="7.5" font-weight="800" fill="var(--fluent-brand)" text-anchor="middle">L4-S1</text>
        <line x1="53" y1="65" x2="64" y2="60" stroke="var(--fluent-brand)" stroke-width="1" />
      </g>
    </svg>`
  }
];

/**
 * Returns all exercises
 * @returns {KineExercise[]}
 */
export function getKineExercises() {
  return KINE_EXERCISES;
}

/**
 * Find an exercise by id
 * @param {string} id
 * @returns {KineExercise | undefined}
 */
export function getKineExerciseById(id) {
  return KINE_EXERCISES.find(ex => ex.id === id);
}
