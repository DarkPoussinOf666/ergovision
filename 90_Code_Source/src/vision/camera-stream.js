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
        // Démarre la lecture si nécessaire
        await pipVideoElement.play().catch(() => {});
        await pipVideoElement.requestPictureInPicture();
        return;
      }
    }
  } catch (pipErr) {
    console.warn("Échec Picture-in-Picture natif, passage en mode Pop-out flottant :", pipErr);
  }

  // 3. Repli Pop-out détaché (Idéal pour Firefox Sidebar ou quand requestPictureInPicture est restreint)
  openFloatingPopout(canvasElement);
}

let popoutWindow = null;
function openFloatingPopout(canvasElement) {
  if (popoutWindow && !popoutWindow.closed) {
    popoutWindow.focus();
    return;
  }

  const w = 480;
  const h = 320;
  const left = window.screen.width - w - 20;
  const top = 40;

  popoutWindow = window.open(
    '',
    'ErgoVision_MiniPiP',
    `width=${w},height=${h},top=${top},left=${left},resizable=yes,scrollbars=no,status=no`
  );

  if (!popoutWindow) {
    throw new Error("Impossible d'ouvrir la miniature. Veuillez autoriser les fenêtres pop-up.");
  }

  popoutWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ErgoVision AI — Miniature</title>
      <style>
        body { margin: 0; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; }
        canvas { width: 100%; height: 100%; object-fit: contain; }
      </style>
    </head>
    <body>
      <canvas id="popCanvas" width="${canvasElement.width}" height="${canvasElement.height}"></canvas>
    </body>
    </html>
  `);
  popoutWindow.document.close();

  const popCanvas = popoutWindow.document.getElementById('popCanvas');
  const popCtx = popCanvas ? popCanvas.getContext('2d') : null;

  function renderPopout() {
    if (!popoutWindow || popoutWindow.closed || !isCameraActive) return;
    if (popCtx) {
      popCtx.drawImage(canvasElement, 0, 0);
    }
    requestAnimationFrame(renderPopout);
  }
  requestAnimationFrame(renderPopout);
}
