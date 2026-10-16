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
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
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
    throw new Error("Camera not active");
  }
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture();
  } else {
    if (!pipVideoElement.srcObject) {
      pipVideoElement.srcObject = canvasElement.captureStream(20);
      await pipVideoElement.play();
    }
    await pipVideoElement.requestPictureInPicture();
  }
}
