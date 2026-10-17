/**
 * ErgoVision AI - Vision & Camera Stream Manager
 * Encapsulates MediaPipe Pose, WebRTC getUserMedia, Canvas Mirroring & PiP.
 */

let cameraInstance = null;
let poseInstance = null;
let isCameraActive = false;

export function getIsCameraActive() {
  return isCameraActive;
}

export function setIsCameraActive(val) {
  isCameraActive = val;
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
  isCameraActive = false;
}

export function isPopoutMode() {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('mode') === 'popout';
}

export function openPopoutWindow() {
  const width = 420;
  const height = 640;
  const availWidth = (window.screen && window.screen.availWidth) || window.screen.width || 1920;
  const left = Math.max(0, availWidth - width - 24);
  const top = 50;

  // 1. Tenter via l'API WebExtension windows (Chrome MV3 & Firefox)
  if (typeof chrome !== 'undefined' && chrome.windows && chrome.windows.create) {
    try {
      const popoutUrl = chrome.runtime.getURL('index.html?mode=popout');
      chrome.windows.create({
        url: popoutUrl,
        type: 'popup',
        width,
        height,
        left,
        top,
        focused: true
      }).catch(err => {
        console.warn("Échec chrome.windows.create direct, tentative via background :", err);
        if (chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ type: 'OPEN_POPOUT_WINDOW', width, height, left, top });
        } else {
          fallbackWindowOpen(width, height, left, top);
        }
      });
      return;
    } catch (e) {
      console.warn("Exception chrome.windows.create :", e);
    }
  }

  // 2. Tenter via message runtime au Service Worker si disponible
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: 'OPEN_POPOUT_WINDOW', width, height, left, top }, () => {
      if (chrome.runtime.lastError) {
        fallbackWindowOpen(width, height, left, top);
      }
    });
    return;
  }

  // 3. Repli Web standard
  fallbackWindowOpen(width, height, left, top);
}

function fallbackWindowOpen(width, height, left, top) {
  const url = new URL(window.location.href);
  url.searchParams.set('mode', 'popout');
  const win = window.open(
    url.toString(),
    'ErgoVision_Popout_Window',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
  );
  if (win) {
    win.focus();
  }
}

export async function togglePictureInPicture(canvasElement, pipVideoElement) {
  if (!isCameraActive) {
    throw new Error("Activez d'abord la caméra avant d'ouvrir la miniature.");
  }

  // 1. Si déjà en PiP standard, on le ferme
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
    return;
  }

  // 2. Tentative avec l'API W3C Picture-in-Picture standard
  try {
    if (pipVideoElement && pipVideoElement.requestPictureInPicture) {
      if (!pipVideoElement.srcObject) {
        pipVideoElement.srcObject = canvasElement.captureStream ? canvasElement.captureStream(25) : null;
      }
      if (pipVideoElement.srcObject) {
        await pipVideoElement.play().catch(() => {});
        await pipVideoElement.requestPictureInPicture();
        return;
      }
    }
  } catch (pipErr) {
    console.warn("Échec Picture-in-Picture natif, passage en fenêtre Pop-out :", pipErr);
  }

  // 3. Repli Pop-out détaché OS
  openPopoutWindow();
}
