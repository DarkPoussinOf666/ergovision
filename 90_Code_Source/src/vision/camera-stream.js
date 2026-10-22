/**
 * ErgoVision AI - Vision & Camera Stream Manager
 * Encapsulates MediaPipe Pose, WebRTC getUserMedia, Canvas Mirroring & PiP.
 */

let cameraInstance = null;
let poseInstance = null;
let isCameraActive = false;
let activeDocumentPipWindow = null;

export function getIsCameraActive() {
  return isCameraActive;
}

export function setIsCameraActive(val) {
  isCameraActive = val;
}

export function isAlwaysOnTopPiPActive() {
  if (activeDocumentPipWindow && !activeDocumentPipWindow.closed) return true;
  if (typeof document !== 'undefined' && document.pictureInPictureElement) return true;
  return false;
}

export function updateAlwaysOnTopPiPStatus(statusText, statusColor = '#34d399') {
  if (activeDocumentPipWindow && !activeDocumentPipWindow.closed) {
    try {
      const pill = activeDocumentPipWindow.document.getElementById('pipStatusPill');
      const text = activeDocumentPipWindow.document.getElementById('pipStatusText');
      const dot = activeDocumentPipWindow.document.getElementById('pipStatusDot');
      if (text) text.textContent = statusText;
      if (dot) dot.style.background = statusColor;
      if (pill) pill.style.borderColor = statusColor;
    } catch (_) {}
  }
}

export async function enumerateVideoDevices(selectElement) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(d => d.kind === 'videoinput');
    if (selectElement && videoInputs.length > 1) {
      selectElement.innerHTML = '';
      videoInputs.forEach((dev, idx) => {
        const opt = document.createElement('option');
        opt.value = dev.deviceId;
        opt.text = dev.label || `Caméra ${idx + 1}`;
        selectElement.appendChild(opt);
      });
      selectElement.style.display = 'inline-block';
    }
    return videoInputs;
  } catch (e) {
    console.warn("Énumération caméras non disponible :", e);
    return [];
  }
}

export async function initPoseModel(onResultsCallback) {
  if (!poseInstance) {
    poseInstance = new window.Pose({
      locateFile: (file) => {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
          return chrome.runtime.getURL(`vendor/mediapipe/${file}`);
        }
        return `./vendor/mediapipe/${file}`;
      }
    });
    poseInstance.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    poseInstance.onResults(onResultsCallback);
  }
  return poseInstance;
}

export async function startCameraStream(videoElement, onResultsCallback, deviceId = null) {
  await initPoseModel(onResultsCallback);

  await stopCameraStream(videoElement);

  if (deviceId) {
    try {
      const constraints = { video: { deviceId: { exact: deviceId }, width: 640, height: 400 } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElement.srcObject = stream;
      await videoElement.play();
    } catch (e) {
      console.warn("Échec getUserMedia deviceId spécifique, repli sur Camera utils :", e);
    }
  }

  cameraInstance = new window.Camera(videoElement, {
    onFrame: async () => {
      if (isCameraActive && poseInstance) {
        await poseInstance.send({ image: videoElement });
      }
    },
    width: 640,
    height: 400
  });

  await cameraInstance.start();
  isCameraActive = true;
  return cameraInstance;
}

export async function stopCameraStream(videoElement, pipVideoElement = null) {
  if (cameraInstance) {
    try {
      await cameraInstance.stop();
    } catch (_) {}
    cameraInstance = null;
  }
  if (videoElement && videoElement.srcObject) {
    try {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(t => t.stop());
    } catch (_) {}
    videoElement.srcObject = null;
  }
  if (pipVideoElement && pipVideoElement.srcObject) {
    try {
      const tracks = pipVideoElement.srcObject.getTracks();
      tracks.forEach(t => t.stop());
    } catch (_) {}
    pipVideoElement.srcObject = null;
  }
  if (document.pictureInPictureElement) {
    try {
      await document.exitPictureInPicture();
    } catch (_) {}
  }
  if (activeDocumentPipWindow && !activeDocumentPipWindow.closed) {
    try {
      activeDocumentPipWindow.close();
    } catch (_) {}
    activeDocumentPipWindow = null;
  }
  isCameraActive = false;
}

export function isPopoutMode() {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') === 'popout' || urlParams.get('mode') === 'mini';
}

export function openMiniWindow() {
  const width = 340;
  const height = 240;
  const availWidth = (typeof screen !== 'undefined' && screen.availWidth) || 1920;
  const left = Math.max(0, availWidth - width - 24);
  const top = 50;

  // Support WebExtensions (Firefox browser.windows ou Chrome windows)
  const ext = typeof browser !== 'undefined' ? browser : (typeof chrome !== 'undefined' ? chrome : null);
  if (ext && ext.windows && ext.windows.create) {
    try {
      const miniUrl = ext.runtime.getURL('index.html?mode=mini');
      ext.windows.create({
        url: miniUrl,
        type: 'popup',
        width,
        height,
        left,
        top,
        focused: true
      }).catch(() => {
        fallbackMiniWindow(width, height, left, top);
      });
      return;
    } catch (_) {}
  }

  fallbackMiniWindow(width, height, left, top);
}

function fallbackMiniWindow(width, height, left, top) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('mode', 'mini');
  window.open(url.toString(), 'ErgoVision_Mini_Window', `width=${width},height=${height},left=${left},top=${top},resizable=yes`);
}

export function openPopoutWindow() {
  openMiniWindow();
}

/**
 * Bascule le mode Miniature Toujours au Premier Plan (Always-On-Top)
 * 1. Sur Chrome / Edge / Chromium : API standard W3C Picture-in-Picture (OS Always-On-Top natif).
 * 2. Sur Firefox (qui lève 'DOMException: Picture-in-Picture request failed' sur les MediaStreams) :
 *    repli transparent et immédiat vers la mini-fenêtre ultra-compacte (mode mini 340x240 px).
 */
export async function toggleAlwaysOnTopPiP({ canvasElement, pipVideoElement, t }) {
  if (!isCameraActive) {
    const errMsg = t ? t('sensor_inactive_error') : "Activez d'abord la caméra avant d'ouvrir la miniature.";
    throw new Error(errMsg || "Activez d'abord la caméra avant d'ouvrir la miniature.");
  }

  // 1. Si déjà actif en PiP standard (Chrome / Edge), on le ferme
  if (typeof document !== 'undefined' && document.pictureInPictureElement) {
    await document.exitPictureInPicture();
    return false;
  }

  // 2. Détection stricte : Firefox bloque l'API scriptée requestPictureInPicture sur canvas.captureStream
  const isFirefox = typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
  const hasNativePiP = !isFirefox && 
                       typeof document !== 'undefined' && 
                       document.pictureInPictureEnabled && 
                       !!(pipVideoElement && typeof pipVideoElement.requestPictureInPicture === 'function');

  if (hasNativePiP) {
    try {
      if (!pipVideoElement.srcObject) {
        const stream = canvasElement.captureStream 
          ? canvasElement.captureStream(25) 
          : (canvasElement.mozCaptureStream ? canvasElement.mozCaptureStream(25) : null);
        if (!stream) {
          throw new Error("Impossible de capturer le flux du canvas.");
        }
        pipVideoElement.srcObject = stream;
      }

      await pipVideoElement.play().catch(() => {});
      await pipVideoElement.requestPictureInPicture();
      return true;
    } catch (pipErr) {
      console.warn("Échec Picture-in-Picture W3C, repli sur la mini-fenêtre compacte :", pipErr);
    }
  }

  // 3. Repli Firefox & navigateurs sans support direct :
  // Ouverture immédiate de la mini-fenêtre webcam compacte (mode mini 340x240 px)
  openMiniWindow();
  return true;
}

/**
 * Rétro-compatibilité W3C
 */
export async function togglePictureInPicture(canvasElement, pipVideoElement) {
  return toggleAlwaysOnTopPiP({ canvasElement, pipVideoElement });
}
