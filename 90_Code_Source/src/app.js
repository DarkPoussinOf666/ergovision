/**
 * ErgoVision AI - Application Conductor (ES6 Modular Entry Point)
 */

import { TRANSLATIONS, getCurrentLanguage, setCurrentLanguage, t } from './i18n/translations.js';
import { getSavedTheme, applyTheme, toggleTheme } from './ui/theme.js';
import { 
  DEFAULT_AUDIO_SETTINGS, loadAudioSettings, saveAudioSettings, getAudioSettings, 
  setSoundEnabled, isSoundEnabled, getAudioContext, playTone, 
  startContinuousPostureAlert, stopContinuousPostureAlert, playCycleChime, testAudioAlert 
} from './audio/audio-engine.js';
import { computeMetrics, evaluatePosture } from './biomechanics/posture-engine.js';
import { DEFAULT_PACING_CONFIG, loadPacingConfig, savePacingConfig, formatSec } from './pacing/pacing-timer.js';
import { getTodayKey, loadDailyLogs, saveDailyLogs, clearDailyLogs, createCSVContent, downloadCSV } from './storage/activity-logger.js';
import { 
  getIsCameraActive, setIsCameraActive, enumerateVideoDevices, startCameraStream, stopCameraStream, 
  toggleAlwaysOnTopPiP, updateAlwaysOnTopPiPStatus, isAlwaysOnTopPiPActive, 
  isPopoutMode 
} from './vision/camera-stream.js';
import { KineRoutineManager } from './kine/routine-timer.js';
import { KineStudioView } from './ui/kine-studio-view.js';
import { EyeRestManager } from './pacing/eye-rest-timer.js';
import { 
  isProActive, getRemainingDays, getFeatureFlags, activateLicenseKey, loadLicenseState 
} from './license/license-gate.js';
import { printKineClinicalReport } from './reports/kine-report.js';
import { renderAnalyticsDashboard } from './ui/analytics-view.js';

// DOM References
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const pipVideo = document.getElementById('pip_video');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const cameraSelect = document.getElementById('cameraSelect');
const btnStopCam = document.getElementById('btnStopCam');
const btnTheme = document.getElementById('btnTheme');
const btnNotifMenu = document.getElementById('btnNotifMenu');
const notifsDropdown = document.getElementById('notifsDropdown');
const chkAudioToggle = document.getElementById('chkAudioToggle');
const rangeDropdownVol = document.getElementById('rangeDropdownVol');
const labelDropdownVol = document.getElementById('labelDropdownVol');
const chkNotifToggle = document.getElementById('chkNotifToggle');
const btnPiP = document.getElementById('btnPiP') || document.querySelector('.btn-pip');
const popoutActiveCard = document.getElementById('popoutActiveCard');
const btnReclaimPopout = document.getElementById('btnReclaimPopout');
const btnExpandPopout = document.getElementById('btnExpandPopout');

// Canal de synchronisation inter-fenêtres (BroadcastChannel)
const syncChannel = (typeof window !== 'undefined' && typeof window.BroadcastChannel !== 'undefined')
  ? new window.BroadcastChannel('ergovision_sync')
  : { postMessage: () => {}, addEventListener: () => {} };

// State
let currentMode = 'session';
let baseline = null;
let currentLandmarks = null;
let badPostureStart = null;
let alertLatched = false;
let lastNotifTime = 0;
let todayKey = getTodayKey();
let dailyLogs = [];

let goodFrames = 0;
let totalFrames = 0;
let alertCount = 0;

let sessionGoodFrames = 0;
let sessionTotalFrames = 0;
let sessionCycleLogged = false;

let timerInterval = null;
let pacingConfig = loadPacingConfig();
let sessionDurationMinutes = pacingConfig.sessionMinutes || 30;
let remainingSeconds = sessionDurationMinutes * 60;
let isSessionRunning = false;
let sensitivity = 1.0;

let appAudioConfig = loadAudioSettings();

// Kiné Studio Instance
const kineRoutineManager = new KineRoutineManager();
let kineStudioView = null;
if (document.getElementById('kineStudioContainer')) {
  kineStudioView = new KineStudioView('kineStudioContainer', kineRoutineManager);
  kineRoutineManager.setCallbacks({
    onRoutineComplete: () => {
      if (kineStudioView) {
        kineStudioView.updateComplete();
      }
      addDailyLog('summary', t('kine_phase_done'), 'pause');
    }
  });
}

// Eye Rest 20-20-20 Instance
const eyeRestManager = new EyeRestManager();
const eyeRestBanner = document.getElementById('eyeRestBanner');
const eyeRestDigits = document.getElementById('eyeRestDigits');
const btnSkipEyeRest = document.getElementById('btnSkipEyeRest');

if (btnSkipEyeRest) {
  btnSkipEyeRest.addEventListener('click', () => eyeRestManager.skipRest());
}

eyeRestManager.setCallbacks({
  onTick: ({ restSecondsRemaining, isEyeRestActive }) => {
    if (isEyeRestActive && eyeRestDigits) {
      eyeRestDigits.innerText = `${restSecondsRemaining}s`;
    }
  },
  onRestStart: () => {
    if (eyeRestBanner) eyeRestBanner.style.display = 'flex';
    stopContinuousPostureAlert();
    document.body.classList.remove('alert-active');
  },
  onRestEnd: () => {
    if (eyeRestBanner) eyeRestBanner.style.display = 'none';
    addDailyLog('summary', t('eye_rest_complete'), currentMode);
  },
  onRestSkip: () => {
    if (eyeRestBanner) eyeRestBanner.style.display = 'none';
  }
});
eyeRestManager.start();

// Init Theme
applyTheme(getSavedTheme(), btnTheme);
btnTheme.addEventListener('click', () => toggleTheme(btnTheme));

// UI Status Helper
function setStatusUI(color, text) {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  if (dot) {
    dot.style.background = color;
    dot.style.color = color;
  }
  if (txt) txt.innerText = text;
}

// ----------------------------------------------------
// SYSTEM NOTIFICATIONS
// ----------------------------------------------------
async function requestNotifPermission() {
  if (!("Notification" in window)) {
    alert("Les notifications système ne sont pas supportées par votre navigateur.");
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === "granted") {
    btnNotif.classList.add('active-toggle');
    btnNotif.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Notifs OK</span>';
    new Notification("ErgoVision AI Activé", {
      body: "Les alertes posturales s'afficheront même lorsque vous travaillez sur une autre application."
    });
  } else {
    btnNotif.classList.remove('active-toggle');
    btnNotif.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg><span>Notifs Bloquées</span>';
  }
}

function triggerAlertNotification(reason) {
  const now = Date.now();
  if (now - lastNotifTime < 15000) return;
  lastNotifTime = now;
  playTone(560, 0.22, 'triangle', 0.12);

  if ("Notification" in window && Notification.permission === "granted") {
    const notifTitle = `${t('status_alert_prefix')}${reason})`;
    const notifBody = getCurrentLanguage() === 'fr' 
      ? "Réalignez doucement votre posture et retrouvez votre point zéro."
      : "Gently realign your posture and return to neutral.";
    new Notification(notifTitle, {
      body: notifBody,
      silent: true
    });
  }
}

// ----------------------------------------------------
// TIMELINE LOGS
// ----------------------------------------------------
function escapeText(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

function createTimelineRow(entry) {
  const row = document.createElement('div');
  row.className = `timeline-item item-${escapeText(entry.type)}`;

  let badgeText = t('badge_alert');
  let badgeClass = 'badge-alert';
  if (entry.type === 'transition') {
    badgeText = t('badge_transition');
    badgeClass = 'badge-transition';
  } else if (entry.type === 'summary') {
    badgeText = t('badge_summary');
    badgeClass = 'badge-summary';
  }

  const scorePart = entry.score !== null && entry.score !== undefined ? ` <strong style="color:var(--status-success)">${escapeText(entry.score)}%</strong>` : '';

  row.innerHTML = `
    <div class="timeline-content">
      <span class="timeline-badge ${badgeClass}">${escapeText(badgeText)}</span>
      <span><strong>${escapeText(entry.title)}</strong>${scorePart} <span style="color:var(--fluent-fg-muted)">(${escapeText(entry.mode)})</span></span>
    </div>
    <span class="timeline-time">${escapeText(entry.time)}</span>
  `;
  return row;
}

function renderAllLogs() {
  const box = document.getElementById('timelineLog');
  if (!box) return;

  if (dailyLogs.length === 0) {
    box.innerHTML = `<div style="color:var(--fluent-fg-muted); font-size:0.8rem; text-align:center; margin:auto;">${t('log_empty')}</div>`;
    document.getElementById('alertCounterBadge').innerText = `0 ${t('badge_alert').toLowerCase()}`;
    return;
  }

  box.innerHTML = '';
  let alertsToday = 0;

  dailyLogs.forEach(entry => {
    if (entry.type === 'alert') alertsToday++;
    box.appendChild(createTimelineRow(entry));
  });

  alertCount = alertsToday;
  const badge = document.getElementById('alertCounterBadge');
  badge.innerText = `${alertsToday} ${t('badge_alert').toLowerCase()}${alertsToday > 1 ? 's' : ''}`;
  badge.style.color = alertsToday > 0 ? 'var(--status-warning)' : 'var(--status-success)';
}

function addDailyLog(type, title, mode, score = null) {
  const time = new Date().toLocaleTimeString(getCurrentLanguage() === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const entry = { id: Date.now(), time, type, title, mode, score };

  dailyLogs.unshift(entry);
  saveDailyLogs(dailyLogs, todayKey);

  const box = document.getElementById('timelineLog');
  if (dailyLogs.length === 1) box.innerHTML = '';
  box.prepend(createTimelineRow(entry));

  if (type === 'alert') {
    alertCount++;
    const badge = document.getElementById('alertCounterBadge');
    badge.innerText = `${alertCount} ${t('badge_alert').toLowerCase()}${alertCount > 1 ? 's' : ''}`;
    badge.style.color = 'var(--status-warning)';
  }

  if (type === 'summary' || type === 'kine_exercise') {
    refreshAnalyticsDashboard();
  }
}

// ----------------------------------------------------
// SESSION DE RÉÉDUCATION KINÉ (30 MIN)
// ----------------------------------------------------
function updateSessionBadge(text, color = 'var(--fluent-fg-muted)') {
  const badge = document.getElementById('sessionStatusBadge');
  if (badge) {
    badge.innerText = text;
    badge.style.color = color;
  }
}

function renderTimerDigits(sec) {
  const digits = document.getElementById('timerDigits');
  const ring = document.getElementById('sessionRingFill');
  const clampedSec = Math.max(0, sec);
  if (digits) {
    digits.innerText = formatSec(clampedSec);
  }
  if (ring) {
    const total = (sessionDurationMinutes || 30) * 60;
    const circumference = 113.1;
    const progress = total > 0 ? Math.min(1, Math.max(0, (total - clampedSec) / total)) : 0;
    ring.style.strokeDashoffset = (circumference * (1 - progress)).toFixed(1);
  }
}

function startSessionCountdown() {
  clearInterval(timerInterval);
  isSessionRunning = true;
  updateSessionBadge('Session en cours', 'var(--status-success)');
  const digits = document.getElementById('timerDigits');
  if (digits) {
    digits.style.color = 'var(--status-success)';
  }

  timerInterval = setInterval(() => {
    if (!isSessionRunning) return;

    remainingSeconds--;
    renderTimerDigits(remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isSessionRunning = false;
      playCycleChime();

      let finalScore = 100;
      if (sessionTotalFrames > 20) {
        finalScore = Math.round((sessionGoodFrames / sessionTotalFrames) * 100);
      }
      addDailyLog('summary', t('session_log_title').replace('{min}', sessionDurationMinutes), 'session', finalScore);

      updateSessionBadge(t('session_completed_badge'), 'var(--fluent-brand)');
      if (digits) digits.style.color = 'var(--fluent-brand)';

      // Arrêt préventif de la caméra pour éviter la fatigue musculaire
      stopCamera();
      setStatusUI('var(--fluent-brand)', t('session_completed_msg'));
      
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(t('session_notif_title'), {
          body: t('session_notif_body').replace('{min}', sessionDurationMinutes).replace('{score}', finalScore)
        });
      }
    }
  }, 1000);
}

function pauseSessionTimer() {
  isSessionRunning = false;
  clearInterval(timerInterval);
  updateSessionBadge('Session en pause', 'var(--status-warning)');
  const digits = document.getElementById('timerDigits');
  if (digits) digits.style.color = 'var(--status-warning)';
}

function resetCurrentModeTimer() {
  clearInterval(timerInterval);
  isSessionRunning = false;
  sessionDurationMinutes = pacingConfig.sessionMinutes || 30;
  remainingSeconds = sessionDurationMinutes * 60;
  renderTimerDigits(remainingSeconds);

  sessionGoodFrames = 0;
  sessionTotalFrames = 0;
  sessionCycleLogged = false;

  const digits = document.getElementById('timerDigits');
  if (digits) digits.style.color = 'var(--fluent-fg-primary)';
  updateSessionBadge(t('session_waiting_calib'), 'var(--fluent-fg-muted)');
}

function openKineRoutineFromUI() {
  if (!kineStudioView) return;
  const container = document.getElementById('kineStudioContainer');
  if (!container) return;

  const isVisible = container.style.display !== 'none';
  if (isVisible) {
    container.style.display = 'none';
    kineRoutineManager.stop();
  } else {
    container.style.display = 'block';
    kineStudioView.show();
    kineRoutineManager.start();
    // Scroll doux vers l'atelier kiné
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ----------------------------------------------------
// BIOMECHANICS & GAUGES
// ----------------------------------------------------
const gaugeCache = {};

function updateGauge(cardId, badgeId, fillId, ratioToThreshold, pillId) {
  const pct = Math.min(100, Math.max(0, Math.round(ratioToThreshold * 100)));
  const isBad = pct >= 100;
  
  const cacheKey = `${cardId}_${badgeId}_${fillId}_${pillId || ''}`;
  const prev = gaugeCache[cacheKey];
  if (prev && prev.pct === pct && prev.isBad === isBad) {
    return;
  }
  gaugeCache[cacheKey] = { pct, isBad };

  const card = document.getElementById(cardId);
  const badge = document.getElementById(badgeId);
  const fill = document.getElementById(fillId);
  const pill = pillId ? document.getElementById(pillId) : null;

  if (card) card.classList.toggle('bad', isBad);
  if (badge) badge.innerText = isBad ? t('badge_alert') : `${pct}%`;
  if (fill) {
    fill.style.width = `${pct}%`;
    fill.style.backgroundColor = pct > 95 ? 'var(--status-danger)' : (pct > 65 ? 'var(--status-warning)' : 'var(--status-success)');
  }
  if (pill) {
    if (pct < 70) {
      pill.textContent = t('pill_ok');
      pill.className = 'gauge-deviation-pill pill-ok';
    } else if (pct < 100) {
      pill.textContent = t('pill_attn');
      pill.className = 'gauge-deviation-pill pill-warn';
    } else {
      pill.textContent = t('pill_derive');
      pill.className = 'gauge-deviation-pill pill-danger';
    }
  }
}

function startCalibrationCountdown() {
  if (!getIsCameraActive() || !currentLandmarks) {
    alert(getCurrentLanguage() === 'fr' 
      ? "Activez d'abord la caméra et placez-vous bien dans le cadre face à l'écran." 
      : "Please start the camera first and frame yourself facing the screen.");
    return;
  }

  const overlay = document.getElementById('countdownOverlay');
  const numEl = document.getElementById('countdownNum');
  overlay.classList.add('visible');
  let count = 3;
  numEl.innerText = count;
  playTone(440, 0.12);

  const cd = setInterval(() => {
    count--;
    if (count > 0) {
      numEl.innerText = count;
      playTone(440, 0.12);
    } else {
      clearInterval(cd);
      overlay.classList.remove('visible');
      baseline = computeMetrics(currentLandmarks);
      playTone(880, 0.25, 'triangle', 0.15);
      setStatusUI('var(--status-success)', t('point_zero_locked'));
      startSessionCountdown();
    }
  }, 1000);
}

// ----------------------------------------------------
// MEDIAPIPE ONRESULTS CALLBACK
// ----------------------------------------------------
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.translate(canvasElement.width, 0);
  canvasCtx.scale(-1, 1);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  let hudStatus = "POINT ZÉRO NON CALIBRÉ";
  let hudColor = "rgba(15, 23, 42, 0.88)";

  if (results.poseLandmarks) {
    currentLandmarks = results.poseLandmarks;

    if (window.drawConnectors && window.POSE_CONNECTIONS) {
      window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, {
        color: 'rgba(40, 134, 222, 0.7)',
        lineWidth: 2
      });
    }
    if (window.drawLandmarks) {
      window.drawLandmarks(canvasCtx, [
        results.poseLandmarks[0],
        results.poseLandmarks[7],
        results.poseLandmarks[8],
        results.poseLandmarks[11],
        results.poseLandmarks[12]
      ], {
        color: '#34d399',
        fillColor: '#ffffff',
        lineWidth: 2,
        radius: 4
      });
    }

    const current = computeMetrics(currentLandmarks);

    if (!current) {
      hudStatus = t('hud_partial') || "POSTURE PARTIELLE • RECADREZ-VOUS";
      hudColor = "rgba(245, 158, 11, 0.88)";
      badPostureStart = null;
      alertLatched = false;
      stopContinuousPostureAlert();
      document.body.classList.remove('alert-active');
    } else if (baseline) {
      const sens = sensitivity || 1.0;

      const neckDelta = (baseline.neckHeightRatio - current.neckHeightRatio);
      const shoulderDelta = Math.abs(current.shoulderDiffRatio - baseline.shoulderDiffRatio);
      const tiltDelta = Math.abs(current.headTiltRatio - baseline.headTiltRatio);
      const distanceIncrease = baseline.faceWidth > 0 ? (current.faceWidth - baseline.faceWidth) / baseline.faceWidth : 0;

      const neckThreshold = 0.13 * sens;
      const shoulderThreshold = 0.08 * sens;
      const tiltThreshold = 0.11 * sens;
      const distanceThreshold = 0.22 * sens;

      const flags = getFeatureFlags();

      updateGauge('cardNeck', 'badgeNeck', 'fillNeck', neckDelta / neckThreshold, 'pillNeck');
      if (flags.gaugeShoulderSym) {
        updateGauge('cardShoulder', 'badgeShoulder', 'fillShoulder', shoulderDelta / shoulderThreshold, 'pillShoulder');
      }
      if (flags.gaugeHeadTilt) {
        updateGauge('cardTilt', 'badgeTilt', 'fillTilt', tiltDelta / tiltThreshold, 'pillTilt');
      }
      if (flags.gaugeScreenDist) {
        updateGauge('cardDistance', 'badgeDistance', 'fillDistance', Math.max(0, distanceIncrease / distanceThreshold), 'pillDistance');
      }

      const isNeckBad = neckDelta > neckThreshold;
      const isShoulderBad = flags.gaugeShoulderSym && (shoulderDelta > shoulderThreshold);
      const isTiltBad = flags.gaugeHeadTilt && (tiltDelta > tiltThreshold);
      const isDistanceBad = flags.gaugeScreenDist && (distanceIncrease > distanceThreshold);
      const anyBad = (isNeckBad || isShoulderBad || isTiltBad || isDistanceBad) && !eyeRestManager.isEyeRestActive;

      totalFrames++;
      sessionTotalFrames++;
      if (!anyBad) {
        goodFrames++;
        sessionGoodFrames++;
      }

      if (totalFrames % 15 === 0) {
        const score = Math.round((goodFrames / totalFrames) * 100);
        const scoreEl = document.getElementById('scoreDigits');
        const scoreFillEl = document.getElementById('scoreMiniFill');
        const scoreColor = score > 80 ? 'var(--status-success)' : (score > 60 ? 'var(--status-warning)' : 'var(--status-danger)');
        if (scoreEl) {
          scoreEl.innerText = `${score}%`;
          scoreEl.style.color = scoreColor;
        }
        if (scoreFillEl) {
          scoreFillEl.style.width = `${score}%`;
          scoreFillEl.style.backgroundColor = scoreColor;
        }
      }

      if (anyBad) {
        let reasonKey = isNeckBad ? "reason_neck" : (isShoulderBad ? "reason_shoulder" : (isTiltBad ? "reason_tilt" : "reason_distance"));
        let reason = t(reasonKey);
        hudStatus = t('hud_deviation') + " " + reason.toUpperCase();
        hudColor = "rgba(245, 158, 11, 0.92)";

        if (!badPostureStart) {
          badPostureStart = Date.now();
        }

        const alertThresholdMs = (appAudioConfig.delaySeconds || 2.5) * 1000;
        if (Date.now() - badPostureStart > alertThresholdMs) {
          document.body.classList.add('alert-active');
          hudStatus = t('hud_correct') + " " + reason.toUpperCase();
          hudColor = "rgba(239, 68, 68, 0.96)";
          setStatusUI('var(--status-danger)', `${t('status_alert_prefix')}${reason})`);

          startContinuousPostureAlert();

          if (!alertLatched) {
            alertLatched = true;
            addDailyLog('alert', reason, 'session');
            triggerAlertNotification(reason);
          }
        }
      } else {
        badPostureStart = null;
        alertLatched = false;
        stopContinuousPostureAlert();
        document.body.classList.remove('alert-active');
        hudStatus = t('hud_neutral') || "✓ POSTURE NEUTRE";
        hudColor = "rgba(16, 185, 129, 0.88)";
        setStatusUI('var(--status-success)', t('status_optimal') || "Posture optimale");
      }
    }
  } else {
    hudStatus = t('hud_waiting');
    hudColor = "rgba(15, 23, 42, 0.88)";
    stopContinuousPostureAlert();
    document.body.classList.remove('alert-active');
  }

  canvasCtx.restore();

  // Mise à jour de la miniature Always-On-Top si active
  updateAlwaysOnTopPiPStatus(hudStatus, hudColor);

  // Bandeau HUD superposé (haute lisibilité en miniature)
  canvasCtx.save();
  canvasCtx.fillStyle = hudColor;
  canvasCtx.fillRect(0, 0, canvasElement.width, 40);
  canvasCtx.fillStyle = "#ffffff";
  canvasCtx.font = "bold 14px 'Segoe UI Variable Text', -apple-system, sans-serif";
  canvasCtx.textBaseline = "middle";
  canvasCtx.fillText(hudStatus, 14, 20);
  canvasCtx.restore();
}

// ----------------------------------------------------
// CAMERA WORKFLOW
// ----------------------------------------------------
async function startCamera(deviceId = null) {
  getAudioContext();
  setStatusUI('var(--status-warning)', t('sensor_starting'));

  try {
    await startCameraStream(videoElement, onResults, deviceId);
    cameraPlaceholder.classList.add('hidden');
    btnStopCam.style.display = 'inline-flex';
    const telemetryBadge = document.getElementById('videoTelemetryBadge');
    if (telemetryBadge) telemetryBadge.style.display = 'flex';
    await enumerateVideoDevices(cameraSelect);
    if (deviceId && cameraSelect) {
      cameraSelect.value = deviceId;
    }
    setStatusUI('var(--status-success)', t('sensor_active'));
    playTone(600, 0.15);
  } catch (err) {
    console.error("Erreur caméra :", err);
    setStatusUI('var(--status-danger)', t('sensor_error'));
    alert(getCurrentLanguage() === 'fr' ? "Impossible d'accéder à la webcam." : "Unable to access the webcam.");
  }
}

async function stopCamera() {
  await stopCameraStream(videoElement, pipVideo);
  stopContinuousPostureAlert();
  document.body.classList.remove('alert-active');
  cameraPlaceholder.classList.remove('hidden');
  btnStopCam.style.display = 'none';
  const telemetryBadge = document.getElementById('videoTelemetryBadge');
  if (telemetryBadge) telemetryBadge.style.display = 'none';
  setStatusUI('var(--fluent-fg-muted)', t('sensor_standby'));
}

async function switchCamera(deviceId) {
  if (!deviceId) return;
  await startCamera(deviceId);
}

// ----------------------------------------------------
// INTERNATIONALIZATION
// ----------------------------------------------------
function setLanguage(lang) {
  setCurrentLanguage(lang);
  document.documentElement.lang = lang;
  
  const labelLang = document.getElementById('labelLang');
  if (labelLang) labelLang.innerText = lang === 'fr' ? 'EN' : 'FR';
  
  const modalLangSelect = document.getElementById('selectModalLanguage');
  if (modalLangSelect) modalLangSelect.value = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.innerText = TRANSLATIONS[lang][key];
    }
  });

  const brandSub = document.querySelector('.brand-sub');
  if (brandSub) brandSub.innerText = lang === 'fr' ? 'Rééducation Posturale • Sessions Ciblées' : 'Postural Rehabilitation • Targeted Sessions';

  // Gauges titles & descriptions
  const cardNeckTitle = document.querySelector('#cardNeck .gauge-title-box span');
  if (cardNeckTitle) cardNeckTitle.innerText = t('gauge_neck_title') ? t('gauge_neck_title').replace(/^[0-9]\.\s*/, '') : 'Projection Nuque';

  const cardShoulderTitle = document.querySelector('#cardShoulder .gauge-title-box span');
  if (cardShoulderTitle) cardShoulderTitle.innerText = t('gauge_shoulder_title') ? t('gauge_shoulder_title').replace(/^[0-9]\.\s*/, '') : 'Épaules & Trapèzes';

  const cardTiltTitle = document.getElementById('titleGaugeTilt');
  if (cardTiltTitle) cardTiltTitle.innerText = t('gauge_tilt_title') ? t('gauge_tilt_title').replace(/^[0-9]\.\s*/, '') : 'Inclinaison Tête';

  const titleDist = document.getElementById('titleGaugeDistance');
  if (titleDist) titleDist.innerText = t('gauge_distance_title') ? t('gauge_distance_title').replace(/^[0-9]\.\s*/, '') : 'Distance Écran';

  // Eye rest banner
  const eyeTitle = document.getElementById('eyeRestTitle');
  const eyeDesc = document.getElementById('eyeRestDesc');
  const btnSkipEye = document.querySelector('#btnSkipEyeRest span');
  if (eyeTitle) eyeTitle.innerText = t('eye_rest_title');
  if (eyeDesc) eyeDesc.innerText = t('eye_rest_desc');
  if (btnSkipEye) btnSkipEye.innerText = t('btn_skip_eye_rest');

  // Viewport and buttons
  const heroH2 = document.querySelector('#cameraPlaceholder h2');
  const heroP = document.querySelector('#cameraPlaceholder p');
  const btnStartSpan = document.querySelector('#btnStartCamera span');
  if (heroH2) heroH2.innerText = t('hero_title');
  if (heroP) heroP.innerText = t('hero_desc');
  if (btnStartSpan) btnStartSpan.innerText = t('btn_start_sensor');

  const btnCalibrateSpan = document.querySelector('#btnCalibrate span');
  const btnStopCamSpan = document.querySelector('#btnStopCam span');
  if (btnCalibrateSpan) btnCalibrateSpan.innerText = t('btn_calibrate');
  if (btnStopCamSpan) btnStopCamSpan.innerText = t('btn_stop');

  // Popout active card
  const popTitle = document.getElementById('popoutActiveTitle');
  const popDesc = document.getElementById('popoutActiveDesc');
  const labelReclaim = document.getElementById('labelReclaimPopout');
  const btnExp = document.getElementById('btnExpandPopout');
  if (popTitle) popTitle.innerText = t('popout_active_title');
  if (popDesc) popDesc.innerText = t('popout_active_desc');
  if (labelReclaim) labelReclaim.innerText = t('btn_reclaim_popout');
  if (btnExp) btnExp.setAttribute('title', t('btn_popout_expand'));

  // Session & Journal widgets
  const btnSettingsSpan = document.querySelector('#btnPacingSettings span');
  const btnResetSpan = document.querySelector('#btnResetTimer span');
  const btnExportSpan = document.querySelector('#btnExportCsv span');
  const btnClearSpan = document.querySelector('#btnClearLogs span');
  const btnToggleAnalyticsSpan = document.querySelector('#btnToggleAnalytics span');
  if (btnSettingsSpan) btnSettingsSpan.innerText = t('btn_settings');
  if (btnResetSpan) btnResetSpan.innerText = t('btn_reset');
  if (btnExportSpan) btnExportSpan.innerText = t('btn_export_csv');
  if (btnClearSpan) btnClearSpan.innerText = t('btn_clear_logs');
  if (btnToggleAnalyticsSpan) btnToggleAnalyticsSpan.innerText = t('analytics_toggle_btn');

  const footer = document.querySelector('footer');
  if (footer) footer.innerText = t('footer_text');

  // Mise à jour des pilules d'état cliniques
  document.querySelectorAll('.gauge-deviation-pill').forEach(pill => {
    if (pill.classList.contains('pill-ok')) pill.textContent = t('pill_ok');
    else if (pill.classList.contains('pill-warn')) pill.textContent = t('pill_attn');
    else if (pill.classList.contains('pill-danger')) pill.textContent = t('pill_derive');
  });

  // Badge d'alerte
  const alertBadge = document.getElementById('alertCounterBadge');
  if (alertBadge) {
    alertBadge.innerText = `${alertCount} ${t('badge_alert').toLowerCase()}${alertCount > 1 ? 's' : ''}`;
  }

  // Statut session et capteur si inactifs
  const sessionStatus = document.getElementById('sessionStatusBadge');
  if (sessionStatus && !isSessionRunning) {
    sessionStatus.innerText = t('session_waiting_calib');
  }
  if (!getIsCameraActive()) {
    setStatusUI('var(--fluent-fg-muted)', t('sensor_standby'));
  }

  renderAllLogs();
  refreshAnalyticsDashboard();
  updateLicenseUI();
}

function toggleLanguage() {
  const current = getCurrentLanguage();
  setLanguage(current === 'fr' ? 'en' : 'fr');
}

// ----------------------------------------------------
// MODAL TABS & SESSION SETTINGS
// ----------------------------------------------------
function openPacingModal() {
  const modal = document.getElementById('pacingModal');
  const sessionMin = pacingConfig.sessionMinutes || 30;
  
  const rangeSession = document.getElementById('rangeSessionMinutes');
  const inputSession = document.getElementById('inputSessionMinutes');
  const hintSession = document.getElementById('hintSessionVal');
  if (rangeSession) rangeSession.value = sessionMin;
  if (inputSession) inputSession.value = sessionMin;
  if (hintSession) hintSession.innerText = sessionMin + ' min';

  if (appAudioConfig.mode === 'continuous') {
    const rCont = document.getElementById('audioModeContinuous');
    if (rCont) rCont.checked = true;
  } else {
    const rPulse = document.getElementById('audioModePulse');
    if (rPulse) rPulse.checked = true;
  }
  const volInt = Math.round(appAudioConfig.volume * 100);
  const rangeVol = document.getElementById('rangeAudioVolume');
  const valVol = document.getElementById('valAudioVolume');
  if (rangeVol) rangeVol.value = volInt;
  if (valVol) valVol.innerText = volInt + '%';
  const delaySelect = document.getElementById('selectAlertDelay');
  if (delaySelect) delaySelect.value = String(appAudioConfig.delaySeconds);

  const langSelect = document.getElementById('selectModalLanguage');
  if (langSelect) langSelect.value = getCurrentLanguage();

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closePacingModal() {
  const modal = document.getElementById('pacingModal');
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

function switchModalTab(tabId) {
  document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.modal-tab-pane').forEach(pane => pane.classList.remove('active'));

  if (tabId === 'pacing') {
    document.getElementById('tabBtnPacing').classList.add('active');
    document.getElementById('tabPanePacing').classList.add('active');
  } else if (tabId === 'audio') {
    document.getElementById('tabBtnAudio').classList.add('active');
    document.getElementById('tabPaneAudio').classList.add('active');
  } else if (tabId === 'prefs') {
    document.getElementById('tabBtnPrefs').classList.add('active');
    document.getElementById('tabPanePrefs').classList.add('active');
  }
}

// ----------------------------------------------------
// LICENSE GATE & FREEMIUM UI
// ----------------------------------------------------
function updateLicenseUI() {
  const flags = getFeatureFlags();
  const proActive = isProActive();
  const remainingDays = getRemainingDays();

  // Topbar badge
  const btnProStatus = document.getElementById('btnProStatus');
  const labelProBadge = document.getElementById('labelProBadge');
  if (btnProStatus && labelProBadge) {
    if (proActive) {
      btnProStatus.classList.add('active-pro');
      labelProBadge.innerText = `🛡️ ${remainingDays}j`;
    } else {
      btnProStatus.classList.remove('active-pro');
      labelProBadge.innerText = t('pro_badge_free') || '✨ Pass 7€/an';
    }
  }

  // Jauges verrouillées
  ['cardShoulder', 'cardTilt', 'cardDistance'].forEach(cardId => {
    const cardEl = document.getElementById(cardId);
    if (!cardEl) return;

    let overlay = cardEl.querySelector('.gauge-lock-overlay');
    if (!flags.gaugeShoulderSym) {
      cardEl.classList.add('gauge-locked');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'gauge-lock-overlay';
        overlay.setAttribute('title', t('lock_tooltip_gauge'));
        overlay.innerHTML = `
          <span class="lock-badge">🔒 ${t('pro_badge_free')}</span>
        `;
        overlay.addEventListener('click', openLicenseModal);
        cardEl.appendChild(overlay);
      }
    } else {
      cardEl.classList.remove('gauge-locked');
      if (overlay) overlay.remove();
    }
  });

  // Bouton PiP
  if (btnPiP) {
    btnPiP.setAttribute('title', flags.pipMiniWindow ? t('btn_pip') : `🔒 ${t('btn_pip')}`);
  }
}

function openLicenseModal() {
  const modal = document.getElementById('licenseModal');
  if (!modal) return;
  const feedback = document.getElementById('licenseFeedback');
  if (feedback) feedback.innerText = '';
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

function closeLicenseModal() {
  const modal = document.getElementById('licenseModal');
  if (!modal) return;
  if (typeof modal.close === 'function') {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
}

// ----------------------------------------------------
// EVENT LISTENERS BINDING
// ----------------------------------------------------
document.getElementById('btnStartCamera').addEventListener('click', () => startCamera());
btnStopCam.addEventListener('click', () => {
  stopCamera();
  pauseSessionTimer();
});
document.getElementById('btnCalibrate').addEventListener('click', startCalibrationCountdown);

function showPopoutActiveState(active) {
  if (popoutActiveCard) {
    popoutActiveCard.style.display = active ? 'flex' : 'none';
  }
  if (cameraPlaceholder) {
    cameraPlaceholder.style.display = active ? 'none' : (!getIsCameraActive() ? 'flex' : 'none');
  }
  if (canvasElement) {
    canvasElement.style.display = active ? 'none' : (getIsCameraActive() ? 'block' : 'none');
  }
  const controlsBar = document.querySelector('.camera-controls-bar');
  if (controlsBar) {
    controlsBar.style.display = active ? 'none' : 'flex';
  }
}

if (btnPiP) {
  btnPiP.addEventListener('click', async () => {
    const flags = getFeatureFlags();
    if (!flags.pipMiniWindow) {
      openLicenseModal();
      return;
    }

    try {
      const active = await toggleAlwaysOnTopPiP({
        canvasElement,
        pipVideoElement: pipVideo,
        t
      });
      btnPiP.classList.toggle('active', !!active);
    } catch (e) {
      console.error("Erreur lors de l'activation de la miniature Always-On-Top :", e);
      alert(e.message || "Erreur lors de l'activation de la miniature Always-On-Top.");
    }
  });
}

if (pipVideo) {
  pipVideo.addEventListener('enterpictureinpicture', () => {
    if (btnPiP) btnPiP.classList.add('active');
  });
  pipVideo.addEventListener('leavepictureinpicture', () => {
    if (btnPiP) btnPiP.classList.remove('active');
  });
}

if (btnReclaimPopout) {
  btnReclaimPopout.addEventListener('click', async () => {
    syncChannel.postMessage({ type: 'RECLAIM_REQUESTED' });
    showPopoutActiveState(false);
    await startCamera();
  });
}

if (btnExpandPopout) {
  btnExpandPopout.addEventListener('click', () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.open(cleanUrl, '_blank');
    window.close();
  });
}

// Popover Notifs & Audio
if (btnNotifMenu && notifsDropdown) {
  btnNotifMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = notifsDropdown.style.display === 'none';
    notifsDropdown.style.display = isHidden ? 'flex' : 'none';
    btnNotifMenu.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!notifsDropdown.contains(e.target) && e.target !== btnNotifMenu) {
      notifsDropdown.style.display = 'none';
      btnNotifMenu.setAttribute('aria-expanded', 'false');
    }
  });
}

if (chkAudioToggle) {
  chkAudioToggle.checked = isSoundEnabled();
  chkAudioToggle.addEventListener('change', (e) => {
    setSoundEnabled(e.target.checked);
  });
}

if (rangeDropdownVol && labelDropdownVol) {
  const initVol = Math.round(appAudioConfig.volume * 100);
  rangeDropdownVol.value = initVol;
  labelDropdownVol.innerText = initVol + '%';
  rangeDropdownVol.addEventListener('input', (e) => {
    labelDropdownVol.innerText = e.target.value + '%';
    appAudioConfig.volume = parseInt(e.target.value, 10) / 100;
    saveAudioSettings(appAudioConfig);
  });
}

if (chkNotifToggle) {
  chkNotifToggle.checked = ("Notification" in window) && Notification.permission === "granted";
  chkNotifToggle.addEventListener('change', async (e) => {
    if (e.target.checked) {
      await requestNotifPermission();
      chkNotifToggle.checked = Notification.permission === "granted";
    }
  });
}

const btnPro = document.getElementById('btnProStatus');
if (btnPro) btnPro.addEventListener('click', openLicenseModal);

const btnCloseLicense = document.getElementById('btnCloseLicenseModal');
if (btnCloseLicense) btnCloseLicense.addEventListener('click', closeLicenseModal);

const licenseForm = document.getElementById('licenseActivationForm');
if (licenseForm) {
  licenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('inputLicenseKey');
    const feedback = document.getElementById('licenseFeedback');
    const key = (input.value || '').trim();
    if (!key) return;

    feedback.style.color = 'var(--fluent-brand)';
    feedback.innerText = 'Vérification de la clé...';

    const res = await activateLicenseKey(key);
    if (res.success) {
      feedback.style.color = 'var(--status-success)';
      feedback.innerText = t('license_success_active');
      input.value = '';
      updateLicenseUI();
      setTimeout(() => closeLicenseModal(), 1800);
    } else {
      feedback.style.color = 'var(--status-danger)';
      feedback.innerText = res.error === 'network_error' 
        ? t('license_err_network') 
        : t('license_err_invalid');
    }
  });
}

document.getElementById('btnToggleLang').addEventListener('click', toggleLanguage);
cameraSelect.addEventListener('change', (e) => switchCamera(e.target.value));

document.getElementById('btnPacingSettings').addEventListener('click', openPacingModal);
document.getElementById('btnResetTimer').addEventListener('click', resetCurrentModeTimer);
document.getElementById('btnClosePacingModal').addEventListener('click', closePacingModal);
document.getElementById('btnCancelPacingModal').addEventListener('click', closePacingModal);

const btnKineRoutine = document.getElementById('btnOpenKineRoutine');
if (btnKineRoutine) {
  btnKineRoutine.addEventListener('click', openKineRoutineFromUI);
}

// Modal sliders 2-way sync
const rangeSession = document.getElementById('rangeSessionMinutes');
const inputSession = document.getElementById('inputSessionMinutes');
const hintSession = document.getElementById('hintSessionVal');
if (rangeSession && inputSession && hintSession) {
  rangeSession.addEventListener('input', () => { inputSession.value = rangeSession.value; hintSession.innerText = rangeSession.value + ' min'; });
  inputSession.addEventListener('input', () => { rangeSession.value = inputSession.value; hintSession.innerText = inputSession.value + ' min'; });
}

const rangeVol = document.getElementById('rangeAudioVolume');
const valVol = document.getElementById('valAudioVolume');
if (rangeVol && valVol) {
  rangeVol.addEventListener('input', () => {
    valVol.innerText = rangeVol.value + '%';
    appAudioConfig.volume = parseInt(rangeVol.value, 10) / 100;
  });
}

const modalLang = document.getElementById('selectModalLanguage');
if (modalLang) {
  modalLang.addEventListener('change', () => {
    setLanguage(modalLang.value);
  });
}

document.getElementById('btnResetDefaults').addEventListener('click', () => {
  if (rangeSession) {
    rangeSession.value = 30;
    inputSession.value = 30;
    hintSession.innerText = '30 min';
  }
  const audioPulse = document.getElementById('audioModePulse');
  if (audioPulse) audioPulse.checked = true;
  if (rangeVol) {
    rangeVol.value = 15;
    valVol.innerText = '15%';
  }
  const delaySel = document.getElementById('selectAlertDelay');
  if (delaySel) delaySel.value = '2.5';
});

document.getElementById('tabBtnPacing').addEventListener('click', () => switchModalTab('pacing'));
document.getElementById('tabBtnAudio').addEventListener('click', () => switchModalTab('audio'));
document.getElementById('tabBtnPrefs').addEventListener('click', () => switchModalTab('prefs'));

document.getElementById('btnTestAudioAlert').addEventListener('click', testAudioAlert);
document.getElementById('btnTestCycleChime').addEventListener('click', playCycleChime);

// Presets Session
const preset20 = document.getElementById('presetKine20');
const preset30 = document.getElementById('presetKine30');
const preset45 = document.getElementById('presetKine45');

function selectSessionPreset(mins, activeBtn) {
  if (rangeSession && inputSession && hintSession) {
    rangeSession.value = mins;
    inputSession.value = mins;
    hintSession.innerText = mins + ' min';
  }
  [preset20, preset30, preset45].forEach(b => { if (b) b.classList.remove('active'); });
  if (activeBtn) activeBtn.classList.add('active');
}

if (preset20) preset20.addEventListener('click', () => selectSessionPreset(20, preset20));
if (preset30) preset30.addEventListener('click', () => selectSessionPreset(30, preset30));
if (preset45) preset45.addEventListener('click', () => selectSessionPreset(45, preset45));

// Modal form submit
document.getElementById('pacingForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const sessionMin = parseInt(inputSession ? inputSession.value : '30', 10);

  if (sessionMin > 0) {
    pacingConfig = savePacingConfig({ sessionMinutes: sessionMin, sittingMinutes: sessionMin });
    sessionDurationMinutes = sessionMin;
  }

  const audioModeEl = document.querySelector('input[name="audioMode"]:checked');
  const audioMode = audioModeEl ? audioModeEl.value : 'pulse';
  const vol = rangeVol ? parseInt(rangeVol.value, 10) / 100 : 0.15;
  const delaySel = document.getElementById('selectAlertDelay');
  const delay = delaySel ? parseFloat(delaySel.value) : 2.5;

  appAudioConfig = saveAudioSettings({ mode: audioMode, volume: vol, delaySeconds: delay });

  if (modalLang) setLanguage(modalLang.value);

  resetCurrentModeTimer();
  closePacingModal();
});

document.getElementById('btnPrintKineReport').addEventListener('click', () => {
  const flags = getFeatureFlags();
  if (!flags.kinePdfReport) {
    openLicenseModal();
    return;
  }
  printKineClinicalReport(dailyLogs);
});

document.getElementById('btnExportCsv').addEventListener('click', () => {
  if (dailyLogs.length === 0) {
    alert(t('log_empty'));
    return;
  }
  downloadCSV(createCSVContent(dailyLogs));
});

document.getElementById('btnClearLogs').addEventListener('click', () => {
  dailyLogs = [];
  alertCount = 0;
  goodFrames = 0;
  totalFrames = 0;
  sessionGoodFrames = 0;
  sessionTotalFrames = 0;
  clearDailyLogs(todayKey);
  renderAllLogs();
  refreshAnalyticsDashboard();
  const scoreDigits = document.getElementById('scoreDigits');
  if (scoreDigits) scoreDigits.innerText = '100%';
});

// ----------------------------------------------------
// CONDUCTEUR DU TABLEAU DE BORD & ANALYTICS (7 À 30 JOURS)
// ----------------------------------------------------
function refreshAnalyticsDashboard() {
  const container = document.getElementById('analyticsDashboardContainer');
  if (container && container.style.display !== 'none') {
    renderAnalyticsDashboard(container, () => {
      // Recharger le journal actuel après injection ou purge de données
      dailyLogs = loadDailyLogs(todayKey);
      renderAllLogs();
    });
  }
}

const analyticsContainer = document.getElementById('analyticsDashboardContainer');
let isAnalyticsOpen = localStorage.getItem('ergovision_analytics_open') !== 'false';
if (analyticsContainer) {
  analyticsContainer.style.display = isAnalyticsOpen ? 'block' : 'none';
  refreshAnalyticsDashboard();
}

const btnToggleAnalytics = document.getElementById('btnToggleAnalytics');
if (btnToggleAnalytics) {
  btnToggleAnalytics.addEventListener('click', () => {
    if (analyticsContainer) {
      isAnalyticsOpen = analyticsContainer.style.display === 'none';
      analyticsContainer.style.display = isAnalyticsOpen ? 'block' : 'none';
      localStorage.setItem('ergovision_analytics_open', isAnalyticsOpen ? 'true' : 'false');
      if (isAnalyticsOpen) {
        refreshAnalyticsDashboard();
      }
    }
  });
}

// App Bootstrap
setLanguage(getCurrentLanguage());
dailyLogs = loadDailyLogs(todayKey);
renderAllLogs();
resetCurrentModeTimer();
updateLicenseUI();

// ----------------------------------------------------
// INITIALISATION MODE POP-OUT & SYNCHRONISATION MULTI-FENÊTRES (SOLUTION A)
// ----------------------------------------------------
const inPopout = isPopoutMode();

if (inPopout) {
  document.body.classList.add('mode-popout');
  if (btnExpandPopout) {
    btnExpandPopout.style.display = 'inline-flex';
  }
  if (btnPiP) {
    btnPiP.setAttribute('title', 'Activer le Picture-in-Picture W3C');
  }

  // Démarrage automatique fluide dans la mini-fenêtre autonome
  setTimeout(() => {
    startCamera().catch(err => console.warn("Démarrage auto caméra popout :", err));
  }, 400);

  window.addEventListener('beforeunload', () => {
    try {
      syncChannel.postMessage({ type: 'POPOUT_CLOSED' });
    } catch (_) {}
  });

  syncChannel.addEventListener('message', (ev) => {
    if (ev.data && ev.data.type === 'RECLAIM_REQUESTED') {
      window.close();
    }
  });
} else {
  // Contexte Hôte (Panneau latéral / Sidebar)
  syncChannel.addEventListener('message', async (ev) => {
    if (!ev.data) return;
    if (ev.data.type === 'POPOUT_ACTIVATED') {
      if (getIsCameraActive()) {
        await stopCamera();
        pauseSessionTimer();
      }
      showPopoutActiveState(true);
    } else if (ev.data.type === 'POPOUT_CLOSED') {
      showPopoutActiveState(false);
    }
  });
}
