/**
 * ErgoVision AI - Pacing & Posture Workstation Timer
 * Sitting, Standing, and Active Break modes with overtime negative counting.
 */

export const DEFAULT_PACING_CONFIG = {
  sittingMinutes: 45,
  standingAlertMinutes: 15,
  pauseMinutes: 5
};

export function loadPacingConfig() {
  try {
    const saved = localStorage.getItem('ergovision_pacing_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.sittingMinutes && parsed.standingAlertMinutes && parsed.pauseMinutes) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Échec chargement pacing config :", e);
  }
  return { ...DEFAULT_PACING_CONFIG };
}

export function savePacingConfig(config) {
  try {
    localStorage.setItem('ergovision_pacing_config', JSON.stringify(config));
  } catch (err) {
    console.warn("Erreur sauvegarde localStorage pacing :", err);
  }
  return config;
}

export function formatSec(totalSec) {
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
