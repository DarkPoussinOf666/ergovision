/**
 * Script de téléchargement local des dépendances et modèles MediaPipe Pose
 * Élimine toute dépendance à un CDN externe pour respecter la CSP Manifest V3
 */

const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', '90_Code_Source', 'vendor', 'mediapipe');

const FILES = [
  {
    name: 'camera_utils.js',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675466862/camera_utils.js'
  },
  {
    name: 'drawing_utils.js',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675466124/drawing_utils.js'
  },
  {
    name: 'pose.js',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js'
  },
  {
    name: 'pose_solution_packed_assets_loader.js',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_packed_assets_loader.js'
  },
  {
    name: 'pose_solution_packed_assets.data',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_packed_assets.data'
  },
  {
    name: 'pose_solution_simd_wasm_bin.js',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_simd_wasm_bin.js'
  },
  {
    name: 'pose_solution_simd_wasm_bin.wasm',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_simd_wasm_bin.wasm'
  },
  {
    name: 'pose_web.binarypb',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_web.binarypb'
  },
  {
    name: 'pose_landmark_full.tflite',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_landmark_full.tflite'
  },
  {
    name: 'pose_landmark_lite.tflite',
    url: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_landmark_lite.tflite'
  }
];

async function downloadFile(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Échec du téléchargement (${response.status}) pour : ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function main() {
  console.log(`📦 Préparation du dossier de destination : ${TARGET_DIR}`);
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  for (const item of FILES) {
    const dest = path.join(TARGET_DIR, item.name);
    process.stdout.write(`⬇️  Téléchargement de ${item.name}... `);
    try {
      await downloadFile(item.url, dest);
      const stat = fs.statSync(dest);
      console.log(`✅ OK (${(stat.size / 1024).toFixed(1)} Ko)`);
    } catch (err) {
      console.error(`❌ ERREUR: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('🎉 Tous les binaires MediaPipe Pose ont été rapatriés localement avec succès !');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
