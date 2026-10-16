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
  getIsCameraActive, setIsCameraActive, enumerateVideoDevices, startCameraStream, stopCameraStream, togglePictureInPicture 
} from './vision/camera-stream.js';
import { KineRoutineManager } from './kine/routine-timer.js';
import { KineStudioView } from './ui/kine-studio-view.js';
import { EyeRestManager } from './pacing/eye-rest-timer.js';
import { 
  isProActive, getRemainingDays, getFeatureFlags, activateLicenseKey, loadLicenseState 
} from './license/license-gate.js';
import { printKineClinicalReport } from './reports/kine-report.js';

// DOM References
const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const pipVideo = document.getElementById('pip_video');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const cameraSelect = document.getElementById('cameraSelect');
const btnStopCam = document.getElementById('btnStopCam');
const btnTheme = document.getElementById('btnTheme');
const btnSound = document.getElementById('btnSound');
const btnNotif = document.getElementById('btnNotif');
const btnPiP = document.querySelector('.btn-pip');
const sensitivitySelect = document.getElementById('sensitivitySelect');

// State
let currentMode = 'assis';
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
let remainingSeconds = 45 * 60;
let elapsedStanding = 0;

let pacingConfig = loadPacingConfig();
let audioSettings = loadAudioSettings();

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
}

// ----------------------------------------------------
// PACING & TIMER
// ----------------------------------------------------
function updateTimerDisplayTitles() {
  const titleEl = document.getElementById('timerTitle');
  const subEl = document.getElementById('timerSub');
  if (!titleEl || !subEl) return;

  if (currentMode === 'assis') {
    titleEl.innerText = t('title_sit');
    subEl.innerText = `${t('sub_sit_prefix')}${pacingConfig.sittingMinutes}${t('sub_sit_suffix')}`;
  } else if (currentMode === 'debout') {
    titleEl.innerText = t('title_stand');
    subEl.innerText = `${t('sub_stand_prefix')}${pacingConfig.standingAlertMinutes}${t('sub_stand_suffix')}`;
  } else {
    titleEl.innerText = t('title_pause');
    subEl.innerText = t('sub_pause');
  }
}

function renderTimerDigits(sec) {
  const digits = document.getElementById('timerDigits');
  if (sec < 0) {
    digits.innerText = `-${formatSec(Math.abs(sec))}`;
  } else {
    digits.innerText = formatSec(sec);
  }
}

function startCountdown(durationSec) {
  clearInterval(timerInterval);
  remainingSeconds = durationSec;
  renderTimerDigits(remainingSeconds);

  timerInterval = setInterval(() => {
    remainingSeconds--;
    renderTimerDigits(remainingSeconds);

    const widget = document.getElementById('pacingWidget');
    const digits = document.getElementById('timerDigits');
    const subEl = document.getElementById('timerSub');

    if (remainingSeconds === 0) {
      playCycleChime();
      if (sessionTotalFrames > 20 && !sessionCycleLogged) {
        sessionCycleLogged = true;
        const cycleScore = Math.round((sessionGoodFrames / sessionTotalFrames) * 100);
        addDailyLog('summary', `${t('cycle_summary_title')} ${t('title_' + currentMode)}`, currentMode, cycleScore);
      }
    }

    if (remainingSeconds < 0) {
      widget.style.borderColor = 'var(--status-warning)';
      digits.style.color = 'var(--status-warning)';
      digits.classList.add('overtime');
      subEl.innerText = t('sub_overtime');
    }
  }, 1000);
}

function startStandingCountUp() {
  clearInterval(timerInterval);
  elapsedStanding = 0;
  renderTimerDigits(0);

  timerInterval = setInterval(() => {
    elapsedStanding++;
    renderTimerDigits(elapsedStanding);

    const warnSec = pacingConfig.standingAlertMinutes * 60;
    const subEl = document.getElementById('timerSub');
    const widget = document.getElementById('pacingWidget');
    const digits = document.getElementById('timerDigits');

    if (elapsedStanding === warnSec) {
      playCycleChime();
      if (sessionTotalFrames > 20 && !sessionCycleLogged) {
        sessionCycleLogged = true;
        const cycleScore = Math.round((sessionGoodFrames / sessionTotalFrames) * 100);
        addDailyLog('summary', `${t('cycle_summary_title')} ${t('title_stand')}`, 'debout', cycleScore);
      }
    }

    if (elapsedStanding >= warnSec) {
      widget.style.borderColor = 'var(--status-warning)';
      digits.style.color = 'var(--status-warning)';
      digits.classList.add('overtime');
      subEl.innerText = `${Math.floor(elapsedStanding / 60)} ${t('standing_alert_sub')}`;
    } else if (elapsedStanding >= warnSec * 0.8) {
      subEl.innerText = `${Math.floor(elapsedStanding / 60)} ${t('standing_warning_sub')}`;
    }
  }, 1000);
}

function resetCurrentModeTimer() {
  const widget = document.getElementById('pacingWidget');
  const digits = document.getElementById('timerDigits');
  widget.style.borderColor = 'var(--fluent-stroke-subtle)';
  digits.style.color = 'var(--fluent-fg-primary)';
  digits.classList.remove('overtime');

  sessionGoodFrames = 0;
  sessionTotalFrames = 0;
  sessionCycleLogged = false;

  updateTimerDisplayTitles();

  if (currentMode === 'assis') {
    startCountdown(pacingConfig.sittingMinutes * 60);
  } else if (currentMode === 'debout') {
    startStandingCountUp();
  } else {
    startCountdown(pacingConfig.pauseMinutes * 60);
  }
}

function setMode(mode) {
  if (currentMode !== mode) {
    if (sessionTotalFrames > 30 && !sessionCycleLogged) {
      const partialScore = Math.round((sessionGoodFrames / sessionTotalFrames) * 100);
      addDailyLog('transition', `${t('transition_to')} ${t('title_' + mode)} (${partialScore}% ${t('title_neutral').toLowerCase()})`, mode, partialScore);
    } else {
      addDailyLog('transition', `${t('transition_to')} ${t('title_' + mode)}`, mode);
    }
  }

  currentMode = mode;
  document.getElementById('segAssis').classList.toggle('active', mode === 'assis');
  document.getElementById('segAssis').setAttribute('aria-selected', mode === 'assis');
  document.getElementById('segDebout').classList.toggle('active', mode === 'debout');
  document.getElementById('segDebout').setAttribute('aria-selected', mode === 'debout');
  document.getElementById('segPause').classList.toggle('active', mode === 'pause');
  document.getElementById('segPause').setAttribute('aria-selected', mode === 'pause');

  stopContinuousPostureAlert();
  resetCurrentModeTimer();

  if (kineStudioView) {
    if (mode === 'pause') {
      kineStudioView.show();
      kineRoutineManager.start();
    } else {
      kineStudioView.hide();
      kineRoutineManager.stop();
    }
  }
}

// ----------------------------------------------------
// BIOMECHANICS & GAUGES
// ----------------------------------------------------
const gaugeCache = {};

function updateGauge(cardId, badgeId, fillId, ratioToThreshold) {
  const pct = Math.min(100, Math.max(0, Math.round(ratioToThreshold * 100)));
  const isBad = pct >= 100;
  
  const cacheKey = `${cardId}_${badgeId}_${fillId}`;
  const prev = gaugeCache[cacheKey];
  if (prev && prev.pct === pct && prev.isBad === isBad) {
    return;
  }
  gaugeCache[cacheKey] = { pct, isBad };

  const card = document.getElementById(cardId);
  const badge = document.getElementById(badgeId);
  const fill = document.getElementById(fillId);

  if (card) card.classList.toggle('bad', isBad);
  if (badge) badge.innerText = isBad ? t('badge_alert') : `${pct}%`;
  if (fill) {
    fill.style.width = `${pct}%`;
    fill.style.backgroundColor = pct > 95 ? 'var(--status-danger)' : (pct > 65 ? 'var(--status-warning)' : 'var(--status-success)');
  }
}

function startCalibrationCountdown() {
  if (!getIsCameraActive() || !currentLandmarks) {
    alert("Activez d'abord la caméra et placez-vous bien dans le cadre face à l'écran.");
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
      setStatusUI('var(--status-success)', `Point Zéro verrouillé (${currentMode.toUpperCase()})`);
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
    } else if (currentMode === 'pause') {
      hudStatus = t('hud_pause') || "🧘 PAUSE ACTIVE EN COURS • BOUGEZ ET ÉTIREZ-VOUS LIBREMENT";
      hudColor = "rgba(40, 134, 222, 0.92)";
      document.body.classList.remove('alert-active');
      badPostureStart = null;
      alertLatched = false;
      stopContinuousPostureAlert();
      setStatusUI('var(--fluent-brand)', 'Pause active en cours — alertes suspendues');
      updateGauge('cardNeck', 'badgeNeck', 'fillNeck', 0);
      updateGauge('cardShoulder', 'badgeShoulder', 'fillShoulder', 0);
      updateGauge('cardTilt', 'badgeTilt', 'fillTilt', 0);
      updateGauge('cardDistance', 'badgeDistance', 'fillDistance', 0);
    } else if (baseline) {
      const sens = parseFloat(sensitivitySelect.value);

      const neckDelta = (baseline.neckHeightRatio - current.neckHeightRatio);
      const shoulderDelta = Math.abs(current.shoulderDiffRatio - baseline.shoulderDiffRatio);
      const tiltDelta = Math.abs(current.headTiltRatio - baseline.headTiltRatio);
      const distanceIncrease = baseline.faceWidth > 0 ? (current.faceWidth - baseline.faceWidth) / baseline.faceWidth : 0;

      const neckThreshold = 0.13 * sens;
      const shoulderThreshold = 0.08 * sens;
      const tiltThreshold = 0.11 * sens;
      const distanceThreshold = 0.22 * sens;

      const flags = getFeatureFlags();

      updateGauge('cardNeck', 'badgeNeck', 'fillNeck', neckDelta / neckThreshold);
      if (flags.gaugeShoulderSym) {
        updateGauge('cardShoulder', 'badgeShoulder', 'fillShoulder', shoulderDelta / shoulderThreshold);
      }
      if (flags.gaugeHeadTilt) {
        updateGauge('cardTilt', 'badgeTilt', 'fillTilt', tiltDelta / tiltThreshold);
      }
      if (flags.gaugeScreenDist) {
        updateGauge('cardDistance', 'badgeDistance', 'fillDistance', Math.max(0, distanceIncrease / distanceThreshold));
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
        scoreEl.innerText = `${score}%`;
        scoreEl.style.color = score > 80 ? 'var(--status-success)' : (score > 60 ? 'var(--status-warning)' : 'var(--status-danger)');
      }

      if (anyBad) {
        let reasonKey = isNeckBad ? "reason_neck" : (isShoulderBad ? "reason_shoulder" : (isTiltBad ? "reason_tilt" : "reason_distance"));
        let reason = t(reasonKey);
        hudStatus = t('hud_deviation') + " " + reason.toUpperCase();
        hudColor = "rgba(245, 158, 11, 0.92)";

        if (!badPostureStart) {
          badPostureStart = Date.now();
        }

        const alertThresholdMs = (audioSettings.delaySeconds || 2.5) * 1000;
        if (Date.now() - badPostureStart > alertThresholdMs) {
          document.body.classList.add('alert-active');
          hudStatus = t('hud_correct') + " " + reason.toUpperCase();
          hudColor = "rgba(239, 68, 68, 0.96)";
          setStatusUI('var(--status-danger)', `${t('status_alert_prefix')}${reason})`);

          startContinuousPostureAlert();

          if (!alertLatched) {
            alertLatched = true;
            addDailyLog('alert', reason, currentMode);
            triggerAlertNotification(reason);
          }
        }
      } else {
        badPostureStart = null;
        alertLatched = false;
        stopContinuousPostureAlert();
        document.body.classList.remove('alert-active');
        const modeKeyMap = { assis: 'title_sit', debout: 'title_stand', pause: 'title_pause' };
        const modeLabel = t(modeKeyMap[currentMode]) || currentMode;
        hudStatus = `${t('hud_neutral')} (${modeLabel.toUpperCase()})`;
        hudColor = "rgba(16, 185, 129, 0.88)";
        setStatusUI('var(--status-success)', `${t('status_optimal')} (${modeLabel})`);
      }
    }
  } else {
    hudStatus = t('hud_waiting');
    hudColor = "rgba(15, 23, 42, 0.88)";
    stopContinuousPostureAlert();
    document.body.classList.remove('alert-active');
  }

  canvasCtx.restore();

  // Bandeau HUD superposé
  canvasCtx.save();
  canvasCtx.fillStyle = hudColor;
  canvasCtx.fillRect(0, 0, canvasElement.width, 38);
  canvasCtx.fillStyle = "#ffffff";
  canvasCtx.font = "bold 13px 'Segoe UI Variable Text', -apple-system, sans-serif";
  canvasCtx.textBaseline = "middle";
  canvasCtx.fillText(hudStatus, 14, 19);
  canvasCtx.restore();
}

// ----------------------------------------------------
// CAMERA WORKFLOW
// ----------------------------------------------------
async function startCamera(deviceId = null) {
  getAudioContext();
  setStatusUI('var(--status-warning)', 'Démarrage du capteur...');

  try {
    await startCameraStream(videoElement, onResults, deviceId);
    cameraPlaceholder.classList.add('hidden');
    btnStopCam.style.display = 'inline-flex';
    await enumerateVideoDevices(cameraSelect);
    if (deviceId && cameraSelect) {
      cameraSelect.value = deviceId;
    }
    setStatusUI('var(--status-success)', 'Capteur actif • Calibrez votre point zéro');
    playTone(600, 0.15);
  } catch (err) {
    console.error("Erreur caméra :", err);
    setStatusUI('var(--status-danger)', "Échec de l'accès à la caméra");
    alert("Impossible d'accéder à la webcam.");
  }
}

async function stopCamera() {
  await stopCameraStream(videoElement, pipVideo);
  stopContinuousPostureAlert();
  document.body.classList.remove('alert-active');
  cameraPlaceholder.classList.remove('hidden');
  btnStopCam.style.display = 'none';
  setStatusUI('var(--fluent-fg-muted)', 'Capteur en veille');
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

  document.querySelector('.brand-sub').innerText = t('brand_sub');
  document.getElementById('segAssis').childNodes[2].nodeValue = " " + t('mode_sit');
  document.getElementById('segDebout').childNodes[2].nodeValue = " " + t('mode_stand');
  document.getElementById('segPause').childNodes[2].nodeValue = " " + t('mode_pause');

  if (btnSound) {
    const span = btnSound.querySelector('span');
    if (span) span.innerText = isSoundEnabled() ? t('btn_audio') : t('btn_mute');
  }

  if (btnNotif) {
    const span = btnNotif.querySelector('span');
    if (span && !btnNotif.classList.contains('active-toggle')) span.innerText = t('btn_notif');
  }

  if (btnPiP) {
    const span = btnPiP.querySelector('span');
    if (span) span.innerText = t('btn_pip');
  }

  if (kineStudioView && currentMode === 'pause') {
    kineStudioView.renderInitialStructure();
    kineStudioView.updateExercise(kineRoutineManager.getCurrentExercise(), kineRoutineManager.currentIndex, kineRoutineManager.exercises.length);
  }

  // Gauges titles & descriptions
  const cardNeckTitle = document.querySelector('#cardNeck .gauge-title-box span');
  const cardNeckCaption = document.querySelector('#cardNeck .gauge-caption');
  if (cardNeckTitle) cardNeckTitle.innerText = t('gauge_neck_title');
  if (cardNeckCaption) cardNeckCaption.innerText = t('gauge_neck_desc');

  const cardShoulderTitle = document.querySelector('#cardShoulder .gauge-title-box span');
  const cardShoulderCaption = document.querySelector('#cardShoulder .gauge-caption');
  if (cardShoulderTitle) cardShoulderTitle.innerText = t('gauge_shoulder_title');
  if (cardShoulderCaption) cardShoulderCaption.innerText = t('gauge_shoulder_desc');

  const cardTiltTitle = document.getElementById('titleGaugeTilt');
  const cardTiltCaption = document.getElementById('descGaugeTilt');
  if (cardTiltTitle) cardTiltTitle.innerText = t('gauge_tilt_title');
  if (cardTiltCaption) cardTiltCaption.innerText = t('gauge_tilt_desc');

  const titleDist = document.getElementById('titleGaugeDistance');
  const descDist = document.getElementById('descGaugeDistance');
  if (titleDist) titleDist.innerText = t('gauge_distance_title');
  if (descDist) descDist.innerText = t('gauge_distance_desc');

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

  // Pacing & Journal widgets
  const btnSettingsSpan = document.querySelector('#btnPacingSettings span');
  const btnResetSpan = document.querySelector('#btnResetTimer span');
  const btnExportSpan = document.querySelector('#btnExportCsv span');
  const btnClearSpan = document.querySelector('#btnClearLogs span');
  if (btnSettingsSpan) btnSettingsSpan.innerText = t('btn_settings');
  if (btnResetSpan) btnResetSpan.innerText = t('btn_reset');
  if (btnExportSpan) btnExportSpan.innerText = t('btn_export_csv');
  if (btnClearSpan) btnClearSpan.innerText = t('btn_clear_logs');

  const footer = document.querySelector('footer');
  if (footer) footer.innerText = t('footer_text');

  updateTimerDisplayTitles();
  renderAllLogs();
  updateLicenseUI();
}

function toggleLanguage() {
  const current = getCurrentLanguage();
  setLanguage(current === 'fr' ? 'en' : 'fr');
}

// ----------------------------------------------------
// MODAL TABS & PACING SETTINGS
// ----------------------------------------------------
function openPacingModal() {
  const modal = document.getElementById('pacingModal');
  document.getElementById('rangeSittingMinutes').value = pacingConfig.sittingMinutes;
  document.getElementById('inputSittingMinutes').value = pacingConfig.sittingMinutes;
  document.getElementById('hintSitVal').innerText = pacingConfig.sittingMinutes + ' min';

  document.getElementById('rangeStandingAlertMinutes').value = pacingConfig.standingAlertMinutes;
  document.getElementById('inputStandingAlertMinutes').value = pacingConfig.standingAlertMinutes;
  document.getElementById('hintStandVal').innerText = pacingConfig.standingAlertMinutes + ' min';

  document.getElementById('rangePauseMinutes').value = pacingConfig.pauseMinutes;
  document.getElementById('inputPauseMinutes').value = pacingConfig.pauseMinutes;
  document.getElementById('hintPauseVal').innerText = pacingConfig.pauseMinutes + ' min';

  if (audioSettings.mode === 'continuous') {
    document.getElementById('audioModeContinuous').checked = true;
  } else {
    document.getElementById('audioModePulse').checked = true;
  }
  const volInt = Math.round(audioSettings.volume * 100);
  document.getElementById('rangeAudioVolume').value = volInt;
  document.getElementById('valAudioVolume').innerText = volInt + '%';
  document.getElementById('selectAlertDelay').value = String(audioSettings.delaySeconds);

  document.getElementById('selectModalLanguage').value = getCurrentLanguage();
  document.getElementById('selectModalSensitivity').value = sensitivitySelect.value;

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
      labelProBadge.innerText = `${t('pro_badge_active_prefix')}${remainingDays}${t('pro_badge_active_suffix')}`;
    } else {
      btnProStatus.classList.remove('active-pro');
      labelProBadge.innerText = t('pro_badge_free');
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
          <span class="lock-sub">${t('lock_tooltip_gauge')}</span>
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
    const span = btnPiP.querySelector('span');
    if (span) {
      span.innerText = flags.pipMiniWindow ? t('btn_pip') : `🔒 ${t('btn_pip')}`;
    }
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
document.getElementById('btnStartCamera').addEventListener('click', startCamera);
btnStopCam.addEventListener('click', stopCamera);
document.getElementById('btnCalibrate').addEventListener('click', startCalibrationCountdown);

btnPiP.addEventListener('click', () => {
  const flags = getFeatureFlags();
  if (!flags.pipMiniWindow) {
    openLicenseModal();
    return;
  }
  togglePictureInPicture(canvasElement, pipVideo).catch(e => alert(e.message));
});

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
btnNotif.addEventListener('click', requestNotifPermission);

document.getElementById('btnToggleLang').addEventListener('click', toggleLanguage);

btnSound.addEventListener('click', () => {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  btnSound.classList.toggle('active-toggle', next);
  btnSound.setAttribute('aria-pressed', next ? 'true' : 'false');
  btnSound.querySelector('span').innerText = next ? t('btn_audio') : t('btn_mute');
  const iconSound = document.getElementById('iconSound');
  if (iconSound) {
    iconSound.innerHTML = next 
      ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>'
      : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
  }
});

cameraSelect.addEventListener('change', (e) => switchCamera(e.target.value));

document.getElementById('segAssis').addEventListener('click', () => setMode('assis'));
document.getElementById('segDebout').addEventListener('click', () => setMode('debout'));
document.getElementById('segPause').addEventListener('click', () => setMode('pause'));

document.getElementById('btnPacingSettings').addEventListener('click', openPacingModal);
document.getElementById('btnResetTimer').addEventListener('click', resetCurrentModeTimer);
document.getElementById('btnClosePacingModal').addEventListener('click', closePacingModal);
document.getElementById('btnCancelPacingModal').addEventListener('click', closePacingModal);

// Modal sliders 2-way sync
const rangeSit = document.getElementById('rangeSittingMinutes');
const inputSit = document.getElementById('inputSittingMinutes');
const hintSit = document.getElementById('hintSitVal');
rangeSit.addEventListener('input', () => { inputSit.value = rangeSit.value; hintSit.innerText = rangeSit.value + ' min'; });
inputSit.addEventListener('input', () => { rangeSit.value = inputSit.value; hintSit.innerText = inputSit.value + ' min'; });

const rangeStand = document.getElementById('rangeStandingAlertMinutes');
const inputStand = document.getElementById('inputStandingAlertMinutes');
const hintStand = document.getElementById('hintStandVal');
rangeStand.addEventListener('input', () => { inputStand.value = rangeStand.value; hintStand.innerText = rangeStand.value + ' min'; });
inputStand.addEventListener('input', () => { rangeStand.value = inputStand.value; hintStand.innerText = inputStand.value + ' min'; });

const rangePause = document.getElementById('rangePauseMinutes');
const inputPause = document.getElementById('inputPauseMinutes');
const hintPause = document.getElementById('hintPauseVal');
rangePause.addEventListener('input', () => { inputPause.value = rangePause.value; hintPause.innerText = rangePause.value + ' min'; });
inputPause.addEventListener('input', () => { rangePause.value = inputPause.value; hintPause.innerText = inputPause.value + ' min'; });

const rangeVol = document.getElementById('rangeAudioVolume');
const valVol = document.getElementById('valAudioVolume');
rangeVol.addEventListener('input', () => {
  valVol.innerText = rangeVol.value + '%';
  audioSettings.volume = parseInt(rangeVol.value, 10) / 100;
});

const modalSens = document.getElementById('selectModalSensitivity');
modalSens.addEventListener('change', () => {
  sensitivitySelect.value = modalSens.value;
});

const modalLang = document.getElementById('selectModalLanguage');
modalLang.addEventListener('change', () => {
  setLanguage(modalLang.value);
});

document.getElementById('btnResetDefaults').addEventListener('click', () => {
  document.getElementById('presetStandard').click();
  document.getElementById('audioModePulse').checked = true;
  rangeVol.value = 15;
  valVol.innerText = '15%';
  document.getElementById('selectAlertDelay').value = '2.5';
});

document.getElementById('tabBtnPacing').addEventListener('click', () => switchModalTab('pacing'));
document.getElementById('tabBtnAudio').addEventListener('click', () => switchModalTab('audio'));
document.getElementById('tabBtnPrefs').addEventListener('click', () => switchModalTab('prefs'));

document.getElementById('btnTestAudioAlert').addEventListener('click', testAudioAlert);
document.getElementById('btnTestCycleChime').addEventListener('click', playCycleChime);

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
  document.getElementById('scoreDigits').innerText = '100%';
});

// Modal presets
document.getElementById('presetPomodoro').addEventListener('click', () => {
  rangeSit.value = 25; inputSit.value = 25; hintSit.innerText = '25 min';
  rangeStand.value = 10; inputStand.value = 10; hintStand.innerText = '10 min';
  rangePause.value = 5; inputPause.value = 5; hintPause.innerText = '5 min';
});

document.getElementById('presetStandard').addEventListener('click', () => {
  rangeSit.value = 45; inputSit.value = 45; hintSit.innerText = '45 min';
  rangeStand.value = 15; inputStand.value = 15; hintStand.innerText = '15 min';
  rangePause.value = 5; inputPause.value = 5; hintPause.innerText = '5 min';
});

document.getElementById('presetActive').addEventListener('click', () => {
  rangeSit.value = 50; inputSit.value = 50; hintSit.innerText = '50 min';
  rangeStand.value = 20; inputStand.value = 20; hintStand.innerText = '20 min';
  rangePause.value = 10; inputPause.value = 10; hintPause.innerText = '10 min';
});

// Modal form submit
document.getElementById('pacingForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const sit = parseInt(inputSit.value, 10);
  const stand = parseInt(inputStand.value, 10);
  const pause = parseInt(inputPause.value, 10);

  if (sit > 0 && stand > 0 && pause > 0) {
    pacingConfig = savePacingConfig({ sittingMinutes: sit, standingAlertMinutes: stand, pauseMinutes: pause });
  }

  const audioMode = document.querySelector('input[name="audioMode"]:checked').value;
  const vol = parseInt(rangeVol.value, 10) / 100;
  const delay = parseFloat(document.getElementById('selectAlertDelay').value);

  audioSettings = saveAudioSettings({ mode: audioMode, volume: vol, delaySeconds: delay });

  setLanguage(modalLang.value);
  sensitivitySelect.value = modalSens.value;

  resetCurrentModeTimer();
  closePacingModal();
});

// App Bootstrap
setLanguage(getCurrentLanguage());
dailyLogs = loadDailyLogs(todayKey);
renderAllLogs();
resetCurrentModeTimer();
updateLicenseUI();
