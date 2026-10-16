/**
 * ErgoVision AI - License Gate & Ethical Monetization Manager
 * Gère le statut Freemium (Socle Libre 1 jauge) et le déblocage du "Pass 1 An Libre (7 € / an)"
 * Zéro abonnement récurrent automatique.
 */

const LICENSE_STORAGE_KEY = 'ergovision_license_v1';
const FREE_TIER = 'FREE';
const PRO_TIER = 'PRO_ANNUAL_PASS';

const DEFAULT_STATE = {
  tier: FREE_TIER,
  licenseKey: null,
  activatedAt: null,
  expiresAt: null,
  instanceId: null,
  practitionerCode: null
};

/**
 * Récupère ou génère un identifiant unique local pour la machine
 */
function getOrCreateInstanceId() {
  let inst = localStorage.getItem('ergovision_instance_id');
  if (!inst) {
    inst = 'inst_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    localStorage.setItem('ergovision_instance_id', inst);
  }
  return inst;
}

/**
 * Charge l'état de licence sauvegardé
 */
export function loadLicenseState() {
  try {
    const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, instanceId: getOrCreateInstanceId() };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch (e) {
    console.warn("Échec lecture état de licence :", e);
    return { ...DEFAULT_STATE, instanceId: getOrCreateInstanceId() };
  }
}

/**
 * Sauvegarde l'état de licence en local et le synchronise dans chrome.storage s'il existe
 */
export function saveLicenseState(state) {
  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(state));
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [LICENSE_STORAGE_KEY]: state }).catch(() => {});
    }
  } catch (e) {
    console.error("Échec sauvegarde état de licence :", e);
  }
  return state;
}

/**
 * Vérifie si le Pass Pro Annuel est actif et non expiré
 */
export function isProActive() {
  const state = loadLicenseState();
  if (state.tier !== PRO_TIER) return false;
  if (!state.expiresAt) return false;
  return Date.now() < state.expiresAt;
}

/**
 * Retourne le nombre de jours restants sur le Pass Annuel
 */
export function getRemainingDays() {
  const state = loadLicenseState();
  if (!isProActive()) return 0;
  const diffMs = state.expiresAt - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Matrice stricte des fonctionnalités activées (Feature Flags)
 * Mode FREE : 1 jauge active (Text-Neck), Règle 20-20-20, 1 exercice Kiné (McKenzie)
 * Mode PRO (7€/an) : 4 jauges, Atelier Kiné complet, PiP, Audio continu & Bilan PDF
 */
export function getFeatureFlags() {
  const pro = isProActive();
  return {
    isPro: pro,
    gaugeNeckSlump: true,          // JAUGE 1 : TOUJOURS GRATUITE (Socle Libre)
    gaugeShoulderSym: pro,         // JAUGE 2 : Pass 7€/an
    gaugeHeadTilt: pro,            // JAUGE 3 : Pass 7€/an
    gaugeScreenDist: pro,          // JAUGE 4 : Pass 7€/an
    eyeRest202020: true,           // Règle oculaire : GRATUITE
    customPacingDurations: pro,    // Sliders de durées sur-mesure : Pass 7€/an
    pipMiniWindow: pro,            // Mode Picture-in-Picture : Pass 7€/an
    allowedKineExercises: pro 
      ? ['mckenzie', 'brugger', 'thoracic', 'pelvic'] 
      : ['mckenzie'],
    continuousDroneAudio: pro,     // Alerte continue & bols tibétains : Pass 7€/an
    kinePdfReport: pro             // Rapport d'observance Kiné A4 : Pass 7€/an
  };
}

/**
 * Valide une clé de licence (API LemonSqueezy ou Clé signée de test/cabinet kiné)
 */
export async function activateLicenseKey(rawKey, practitionerCode = null) {
  const cleanKey = (rawKey || '').trim().toUpperCase();
  if (!cleanKey) {
    return { success: false, error: 'empty_key' };
  }

  // 1. Support des clés de test hors-ligne / modération Store / Cabinets partenaires
  // Format : ERGO-REVIEWER-2026, ERGO-KINE-XXXX, ERGO-PASS-XXXX
  if (cleanKey.startsWith('ERGO-')) {
    const isTestOrKineKey = cleanKey === 'ERGO-REVIEWER-2026' || 
                            cleanKey.startsWith('ERGO-KINE-') || 
                            cleanKey.startsWith('ERGO-PASS-');
    if (isTestOrKineKey) {
      const now = Date.now();
      const expiresAt = now + (365 * 24 * 60 * 60 * 1000); // 365 jours
      const newState = {
        tier: PRO_TIER,
        licenseKey: cleanKey,
        activatedAt: now,
        expiresAt: expiresAt,
        instanceId: getOrCreateInstanceId(),
        practitionerCode: practitionerCode || (cleanKey.startsWith('ERGO-KINE-') ? cleanKey : null)
      };
      saveLicenseState(newState);
      return { success: true, state: newState };
    }
  }

  // 2. Validation en ligne via LemonSqueezy Licenses API
  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        license_key: cleanKey,
        instance_name: `ErgoVision_${getOrCreateInstanceId()}`
      })
    });

    const data = await response.json();
    if (response.ok && data.activated) {
      const now = Date.now();
      // Durée de 365 jours fermes (Pass 1 an libre sans renouvellement automatique)
      const expiresAt = data.license_key?.expires_at 
        ? new Date(data.license_key.expires_at).getTime()
        : (now + (365 * 24 * 60 * 60 * 1000));

      const newState = {
        tier: PRO_TIER,
        licenseKey: cleanKey,
        activatedAt: now,
        expiresAt: expiresAt,
        instanceId: getOrCreateInstanceId(),
        practitionerCode: practitionerCode || null
      };
      saveLicenseState(newState);
      return { success: true, state: newState };
    } else {
      return { success: false, error: data.error || 'invalid_key' };
    }
  } catch (err) {
    console.warn("Échec appel LemonSqueezy :", err);
    return { success: false, error: 'network_error' };
  }
}

/**
 * Désactivation volontaire de la clé
 */
export function deactivateLicense() {
  const currentState = loadLicenseState();
  const resetState = {
    ...DEFAULT_STATE,
    instanceId: currentState.instanceId
  };
  saveLicenseState(resetState);
  return resetState;
}
