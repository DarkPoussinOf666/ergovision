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
  return urlParams.get('mode') === 'popout';
}

/**
 * Bascule le mode Miniature Toujours au Premier Plan (Always-On-Top)
 * Dual-Engine :
 * 1. Moteur Primaire (Chrome 116+, Edge) : Document Picture-in-Picture avec micro-HUD (Zéro, statut).
 * 2. Moteur Universel (Firefox, Safari, Standalone) : Video Picture-in-Picture W3C natif OS.
 * ZÉRO COUPURE : Le flux de la caméra ne s'interrompt pas.
 */
export async function toggleAlwaysOnTopPiP({ canvasElement, pipVideoElement, onZeroCalibrate, t }) {
  if (!isCameraActive) {
    const errMsg = t ? t('sensor_inactive_error') : "Activez d'abord la caméra avant d'ouvrir la miniature.";
    throw new Error(errMsg || "Activez d'abord la caméra avant d'ouvrir la miniature.");
  }

  // 1. Si déjà actif dans l'un des modes Always-On-Top, on le ferme
  if (activeDocumentPipWindow && !activeDocumentPipWindow.closed) {
    activeDocumentPipWindow.close();
    activeDocumentPipWindow = null;
    return false;
  }
  if (typeof document !== 'undefined' && document.pictureInPictureElement) {
    await document.exitPictureInPicture();
    return false;
  }

  // Obtenir le flux MediaStream depuis le canvas
  const stream = canvasElement.captureStream ? canvasElement.captureStream(25) : null;
  if (!stream) {
    throw new Error("Impossible de capturer le flux du canvas.");
  }

  // 2. MOTEUR A : Document Picture-in-Picture API (Chrome 116+, Edge)
  // Fenêtre flottante OS Always-On-Top dédiée avec micro-HUD interactif
  if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
    try {
      const pipWin = await window.documentPictureInPicture.requestWindow({
        width: 320,
        height: 230
      });
      activeDocumentPipWindow = pipWin;

      const doc = pipWin.document;
      doc.title = "ErgoVision AI — Miniature Posturale";

      const style = doc.createElement('style');
      style.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
        body {
          background: #090d16;
          color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", Roboto, sans-serif;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .pip-stage {
          position: relative;
          flex: 1;
          width: 100%;
          height: 100%;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pip-overlay-top {
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }
        .pip-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #34d399;
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          transition: border-color 0.2s ease;
        }
        .pip-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px currentColor;
        }
        .pip-overlay-bottom {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          gap: 6px;
          pointer-events: auto;
        }
        .pip-btn {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: background 0.15s, border-color 0.15s;
        }
        .pip-btn:hover {
          background: rgba(30, 41, 59, 0.95);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .pip-btn-zero {
          background: rgba(16, 185, 129, 0.25);
          border-color: rgba(16, 185, 129, 0.6);
          color: #34d399;
        }
        .pip-btn-zero:hover {
          background: rgba(16, 185, 129, 0.45);
        }
      `;
      doc.head.appendChild(style);

      const stage = doc.createElement('div');
      stage.className = 'pip-stage';

      const v = doc.createElement('video');
      v.autoplay = true;
      v.muted = true;
      v.playsInline = true;
      v.srcObject = stream;
      v.play().catch(() => {});
      stage.appendChild(v);

      const topOverlay = doc.createElement('div');
      topOverlay.className = 'pip-overlay-top';
      topOverlay.innerHTML = `
        <div class="pip-status-pill" id="pipStatusPill">
          <span class="pip-status-dot" id="pipStatusDot"></span>
          <span id="pipStatusText">Point Zéro Calibré</span>
        </div>
      `;
      stage.appendChild(topOverlay);

      const bottomOverlay = doc.createElement('div');
      bottomOverlay.className = 'pip-overlay-bottom';
      bottomOverlay.innerHTML = `
        <button type="button" class="pip-btn pip-btn-zero" id="pipBtnZero" title="Recalibrer le Point Zéro (3s)">🎯 Zéro</button>
      `;
      stage.appendChild(bottomOverlay);

      doc.body.appendChild(stage);

      const btnZero = doc.getElementById('pipBtnZero');
      if (btnZero && typeof onZeroCalibrate === 'function') {
        btnZero.addEventListener('click', () => {
          onZeroCalibrate();
        });
      }

      pipWin.addEventListener('pagehide', () => {
        activeDocumentPipWindow = null;
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('ergovision_pip_closed'));
        }
      });

      return true;
    } catch (docPipErr) {
      console.warn("Document Picture-in-Picture refusé ou indisponible, passage au Video PiP W3C :", docPipErr);
    }
  }

  // 3. MOTEUR B : Video Picture-in-Picture W3C standard (Firefox, Safari, Fallback)
  // Forcé au Premier Plan OS (Always-On-Top natif) avec squelette et bandeau HUD sur le canvas
  if (pipVideoElement && pipVideoElement.requestPictureInPicture) {
    try {
      if (!pipVideoElement.srcObject) {
        pipVideoElement.srcObject = stream;
      }
      await pipVideoElement.play().catch(() => {});
      await pipVideoElement.requestPictureInPicture();
      return true;
    } catch (videoPipErr) {
      console.warn("Échec Video Picture-in-Picture standard :", videoPipErr);
      throw new Error("Impossible d'activer la miniature Always-On-Top sur votre navigateur.");
    }
  }

  throw new Error("Picture-in-Picture non supporté par ce navigateur.");
}

/**
 * Rétro-compatibilité W3C
 */
export async function togglePictureInPicture(canvasElement, pipVideoElement) {
  return toggleAlwaysOnTopPiP({ canvasElement, pipVideoElement });
}
