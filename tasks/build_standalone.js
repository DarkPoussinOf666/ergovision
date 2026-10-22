/**
 * ErgoVision AI - Standalone Distribution Builder (v2.2)
 * Assembles the modular ES6 architecture from 90_Code_Source/ into the standalone root index.html.
 * Guarantees 100% parity and eliminates manual code duplication.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, '90_Code_Source');

function build() {
  console.log('🚀 ErgoVision AI - Début de la construction standalone...');

  const htmlTemplatePath = path.join(srcDir, 'index.html');
  const tokensCssPath = path.join(srcDir, 'css', 'tokens.css');
  const styleCssPath = path.join(srcDir, 'css', 'style.css');

  if (!fs.existsSync(htmlTemplatePath)) {
    throw new Error(`Fichier introuvable : ${htmlTemplatePath}`);
  }

  let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');
  const tokensCss = fs.readFileSync(tokensCssPath, 'utf8');
  const styleCss = fs.readFileSync(styleCssPath, 'utf8');

  // Replace external CSS links with inlined style
  const combinedCss = `\n  <style>\n${tokensCss}\n\n${styleCss}\n  </style>`;
  htmlContent = htmlContent.replace(
    /\s*<!-- Modular Styles -->\s*<link rel="stylesheet" href="\.\/css\/tokens\.css">\s*<link rel="stylesheet" href="\.\/css\/style\.css">/,
    combinedCss
  );

  console.log('✅ Feuilles de style Fluent UI 2 & tokens intégrés.');

  // Bundle JS modules in dependency order into an IIFE
  const modules = [
    { file: 'src/i18n/translations.js', name: 'i18n' },
    { file: 'src/ui/theme.js', name: 'theme' },
    { file: 'src/audio/audio-engine.js', name: 'audio' },
    { file: 'src/biomechanics/posture-engine.js', name: 'biomechanics' },
    { file: 'src/pacing/pacing-timer.js', name: 'pacing' },
    { file: 'src/storage/activity-logger.js', name: 'storage' },
    { file: 'src/vision/camera-stream.js', name: 'vision' },
    { file: 'src/kine/exercises.js', name: 'exercises' },
    { file: 'src/kine/routine-timer.js', name: 'routine' },
    { file: 'src/ui/kine-studio-view.js', name: 'kineStudioView' },
    { file: 'src/pacing/eye-rest-timer.js', name: 'eyeRest' },
    { file: 'src/reports/kine-report.js', name: 'kineReport' },
    { file: 'src/analytics/posture-analytics.js', name: 'analytics' },
    { file: 'src/ui/analytics-view.js', name: 'analyticsView' },
    { file: 'src/app.js', name: 'app' }
  ];

  let bundledJs = '\n  <script>\n  (function() {\n    "use strict";\n\n';

  for (const mod of modules) {
    const fullPath = path.join(srcDir, mod.file);
    let code = fs.readFileSync(fullPath, 'utf8');

    // Strip ES6 export and import statements
    code = code.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
    code = code.replace(/export\s+const\s+/g, 'const ');
    code = code.replace(/export\s+let\s+/g, 'let ');
    code = code.replace(/export\s+async\s+function\s+/g, 'async function ');
    code = code.replace(/export\s+function\s+/g, 'function ');
    code = code.replace(/export\s+class\s+/g, 'class ');
    code = code.replace(/export\s+default\s+/g, '');
    code = code.replace(/export\s*\{[\s\S]*?\};?/g, '');

    bundledJs += `    // ==========================================\n`;
    bundledJs += `    // MODULE: ${mod.file}\n`;
    bundledJs += `    // ==========================================\n`;
    bundledJs += `    ${code.trim().split('\n').join('\n    ')}\n\n`;
  }

  bundledJs += '  })();\n  </script>';

  // Replace modular script tag with bundled script
  htmlContent = htmlContent.replace(
    /\s*<!-- Modular ES6 Application Bootstrap -->\s*<script type="module" src="\.\/src\/app\.js"><\/script>/,
    bundledJs
  );

  const outputPath = path.join(rootDir, 'index.html');
  fs.writeFileSync(outputPath, htmlContent, 'utf8');

  console.log(`🎉 Distribution standalone générée avec succès dans : ${outputPath}`);
  console.log(`📊 Taille : ${(htmlContent.length / 1024).toFixed(1)} Ko`);
}

try {
  build();
} catch (err) {
  console.error('❌ Erreur de build :', err);
  process.exit(1);
}
