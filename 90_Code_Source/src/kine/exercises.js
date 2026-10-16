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
    iconSvg: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="32" cy="18" r="9" stroke="var(--fluent-brand)" stroke-width="2.5" />
      <path d="M38 18 H46 M42 14 L46 18 L42 22" stroke="var(--status-success)" stroke-width="2" />
      <path d="M32 27 V42" stroke="var(--fluent-fg-primary)" stroke-width="2.5" />
      <path d="M22 36 L32 30 L42 36" stroke="var(--fluent-fg-muted)" stroke-width="2" />
      <path d="M26 54 L32 42 L38 54" stroke="var(--fluent-fg-secondary)" stroke-width="2" />
      <path d="M18 48 C24 40, 24 32, 28 28" stroke="var(--fluent-brand-tint)" stroke-dasharray="2 2" />
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
    iconSvg: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="32" cy="16" r="8" stroke="var(--fluent-fg-primary)" stroke-width="2" />
      <path d="M32 24 V44" stroke="var(--fluent-fg-primary)" stroke-width="2.5" />
      <path d="M14 36 L24 28 L32 26 L40 28 L50 36" stroke="var(--fluent-brand)" stroke-width="2.5" />
      <circle cx="12" cy="38" r="2.5" fill="var(--status-success)" stroke="none" />
      <circle cx="52" cy="38" r="2.5" fill="var(--status-success)" stroke="none" />
      <path d="M22 56 L32 44 L42 56" stroke="var(--fluent-fg-muted)" stroke-width="2" />
      <path d="M28 32 C30 35, 34 35, 36 32" stroke="var(--status-warning)" stroke-width="2" />
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
    iconSvg: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="36" cy="16" r="8" stroke="var(--fluent-fg-primary)" stroke-width="2" />
      <path d="M30 18 Q36 12 40 18" stroke="var(--fluent-brand)" stroke-width="2" />
      <path d="M34 24 C28 32, 28 38, 30 46" stroke="var(--fluent-brand)" stroke-width="2.5" />
      <path d="M22 28 V52 H32" stroke="var(--fluent-stroke-strong)" stroke-width="2.5" />
      <path d="M30 46 L38 58" stroke="var(--fluent-fg-muted)" stroke-width="2" />
      <path d="M42 22 L48 18" stroke="var(--status-success)" stroke-width="2" stroke-dasharray="1 2" />
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
    iconSvg: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="32" cy="14" r="7" stroke="var(--fluent-fg-muted)" stroke-width="2" />
      <path d="M32 21 V36" stroke="var(--fluent-fg-secondary)" stroke-width="2" />
      <path d="M24 38 C28 34, 36 34, 40 38 L38 45 C34 47, 30 47, 26 45 Z" fill="var(--fluent-brand-tint)" stroke="var(--fluent-brand)" stroke-width="2" />
      <path d="M20 44 C22 38, 42 38, 44 44" stroke="var(--status-success)" stroke-width="2" stroke-dasharray="2 2" />
      <path d="M28 46 L24 58" stroke="var(--fluent-fg-muted)" stroke-width="2" />
      <path d="M36 46 L40 58" stroke="var(--fluent-fg-muted)" stroke-width="2" />
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
