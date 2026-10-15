/**
 * ErgoVision AI - Advanced Audio Engine (Web Audio API)
 * Supports continuous drone, pulsed rhythmic alert, cycle chime & countdown beeps.
 */

export const DEFAULT_AUDIO_SETTINGS = {
  mode: 'pulse', // 'pulse' | 'continuous'
  volume: 0.15,
  delaySeconds: 2.5
};

let audioCtx = null;
let postureAlertInterval = null;
let continuousOscillator = null;
let continuousGainNode = null;
let isContinuousAlertActive = false;
let soundEnabled = true;

let audioSettings = { ...DEFAULT_AUDIO_SETTINGS };

export function loadAudioSettings() {
  try {
    const saved = localStorage.getItem('ergovision_audio_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.mode && typeof parsed.volume === 'number') {
        audioSettings = parsed;
      }
    }
  } catch (e) {
    console.warn("Échec chargement audio settings :", e);
  }
  return audioSettings;
}

export function saveAudioSettings(newSettings) {
  audioSettings = { ...audioSettings, ...newSettings };
  try {
    localStorage.setItem('ergovision_audio_settings', JSON.stringify(audioSettings));
  } catch (err) {
    console.warn("Erreur sauvegarde localStorage audio :", err);
  }
  return audioSettings;
}

export function getAudioSettings() {
  return audioSettings;
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  if (!soundEnabled) {
    stopContinuousPostureAlert();
  }
  return soundEnabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTone(freq = 480, duration = 0.16, type = 'sine', volFactor = 1.0) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const effectiveVol = Math.max(0.01, audioSettings.volume * volFactor);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(effectiveVol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn("Erreur AudioContext playTone :", err);
  }
}

export function startContinuousPostureAlert() {
  if (!soundEnabled || isContinuousAlertActive) return;
  isContinuousAlertActive = true;

  if (audioSettings.mode === 'pulse') {
    const triggerPulse = () => {
      if (!soundEnabled || !isContinuousAlertActive) return;
      playTone(540, 0.12, 'triangle', 0.85);
      setTimeout(() => {
        if (isContinuousAlertActive) playTone(640, 0.14, 'triangle', 0.95);
      }, 150);
    };
    triggerPulse();
    clearInterval(postureAlertInterval);
    postureAlertInterval = setInterval(triggerPulse, 1200);
  } else {
    try {
      const ctx = getAudioContext();
      continuousOscillator = ctx.createOscillator();
      continuousGainNode = ctx.createGain();
      continuousOscillator.type = 'sine';
      continuousOscillator.frequency.setValueAtTime(440, ctx.currentTime);
      const vol = Math.max(0.01, audioSettings.volume * 0.7);
      continuousGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      continuousGainNode.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.3);
      continuousOscillator.connect(continuousGainNode);
      continuousGainNode.connect(ctx.destination);
      continuousOscillator.start();
    } catch (err) {
      console.warn("Erreur onde continue :", err);
    }
  }
}

export function stopContinuousPostureAlert() {
  if (!isContinuousAlertActive) return;
  isContinuousAlertActive = false;

  if (postureAlertInterval) {
    clearInterval(postureAlertInterval);
    postureAlertInterval = null;
  }

  if (continuousOscillator && continuousGainNode) {
    try {
      const ctx = getAudioContext();
      continuousGainNode.gain.setValueAtTime(continuousGainNode.gain.value, ctx.currentTime);
      continuousGainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      setTimeout(() => {
        if (continuousOscillator) {
          try { continuousOscillator.stop(); } catch(e) {}
          continuousOscillator.disconnect();
          continuousGainNode.disconnect();
          continuousOscillator = null;
          continuousGainNode = null;
        }
      }, 160);
    } catch (err) {
      console.warn("Erreur arrêt onde continue :", err);
    }
  }
}

export function playCycleChime() {
  if (!soundEnabled) return;
  const notes = [
    { freq: 523.25, time: 0 },
    { freq: 659.25, time: 200 },
    { freq: 783.99, time: 420 },
    { freq: 1046.50, time: 660 }
  ];
  notes.forEach(n => {
    setTimeout(() => {
      playTone(n.freq, 0.45, 'sine', 1.2);
    }, n.time);
  });
}

export function testAudioAlert() {
  const prevSound = soundEnabled;
  soundEnabled = true;
  startContinuousPostureAlert();
  setTimeout(() => {
    stopContinuousPostureAlert();
    soundEnabled = prevSound;
  }, 2400);
}
