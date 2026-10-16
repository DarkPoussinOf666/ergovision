/**
 * ErgoVision AI - Background Service Worker (Manifest V3)
 * Gère l'ouverture du Panneau Latéral (Side Panel / Sidebar),
 * les alarmes périodiques de fond et les badges d'état sur l'icône de l'extension.
 */

// Initialisation au chargement / installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("🛡️ ErgoVision AI Background Service Worker installé.");

  // Sur Google Chrome : ouverture automatique du Side Panel au clic sur l'icône
  if (typeof chrome !== 'undefined' && chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
      .catch((err) => console.warn("Erreur configuration sidePanel behavior:", err));
  }

  // Initialisation du badge d'icône
  if (chrome.action && chrome.action.setBadgeText) {
    chrome.action.setBadgeText({ text: '' });
  }

  // Configuration de l'alarme périodique de pause oculaire (20-20-20)
  chrome.alarms.create('ergovision_eye_rest_alarm', {
    periodInMinutes: 20
  });
});

// Écouteur d'action de barre d'outils pour Firefox (sidebarAction fallback)
if (typeof browser !== 'undefined' && browser.sidebarAction && browser.sidebarAction.toggle) {
  browser.action.onClicked.addListener(() => {
    browser.sidebarAction.toggle();
  });
}

// Réception des messages de l'interface principale (app.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  switch (message.type) {
    case 'POSTURE_STATUS_CHANGED':
      handlePostureStatus(message);
      break;

    case 'PACING_TICK':
      handlePacingTick(message);
      break;

    case 'TRIGGER_SYSTEM_NOTIFICATION':
      handleSystemNotification(message);
      break;

    default:
      break;
  }

  sendResponse({ status: 'ok' });
});

// Gestion du badge visuel sur l'icône de l'extension
function handlePostureStatus({ status, detail }) {
  if (!chrome.action || !chrome.action.setBadgeText) return;

  if (status === 'GOOD') {
    chrome.action.setBadgeText({ text: 'OK' });
    chrome.action.setBadgeBackgroundColor({ color: '#107c41' }); // Vert émeraude Fluent
  } else if (status === 'DRIFT') {
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#d13438' }); // Rouge d'alerte Fluent
  } else if (status === 'PAUSED' || status === 'STOPPED') {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Mise à jour du badge avec le décompte du temps
function handlePacingTick({ remainingMinutes, mode }) {
  if (!chrome.action || !chrome.action.setBadgeText) return;
  if (typeof remainingMinutes === 'number' && remainingMinutes > 0 && remainingMinutes <= 99) {
    chrome.action.setBadgeText({ text: `${remainingMinutes}m` });
    chrome.action.setBadgeBackgroundColor({ color: '#0f6cbd' }); // Bleu Fluent
  }
}

// Déclencheur de notification système persistante
function handleSystemNotification({ title, body, iconUrl }) {
  if (!chrome.notifications || !chrome.notifications.create) return;

  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconUrl || 'assets/icons/icon-128.png',
    title: title || 'ErgoVision AI',
    message: body || 'Pensez à réaligner votre posture.',
    priority: 1
  });
}

// Alarme périodique de fond (si le Side Panel est momentanément fermé)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'ergovision_eye_rest_alarm') {
    handleSystemNotification({
      title: 'ErgoVision AI — Règle Oculaire 20-20-20',
      body: 'Prenez 20 secondes pour détendre vos yeux en regardant à 6 mètres au loin.'
    });
  }
});
