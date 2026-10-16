const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '90_Code_Source', 'assets', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// SVG Clinical Shield
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f6cbd"/>
      <stop offset="100%" stop-color="#107c41"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="#090d16"/>
  <path d="M64 16 L104 32 V68 C104 92 64 112 64 112 C64 112 24 92 24 68 V32 Z" fill="url(#grad)" stroke="#ffffff" stroke-width="3" stroke-opacity="0.3"/>
  <circle cx="64" cy="52" r="12" fill="#ffffff"/>
  <path d="M64 68 V92 M46 80 L64 72 L82 80" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

fs.writeFileSync(path.join(dir, 'icon.svg'), svg, 'utf8');

// Buffer PNG valide 1x1 base64
const validPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPjfDwAEeQHzjM9nSAAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(validPngBase64, 'base64');

[16, 32, 48, 128].forEach(sz => {
  fs.writeFileSync(path.join(dir, `icon-${sz}.png`), pngBuffer);
});

console.log('✅ Pack d\'icônes généré avec succès dans :', dir);
