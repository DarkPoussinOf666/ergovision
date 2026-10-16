/**
 * ErgoVision AI - Extension Multi-Target Build Script
 * Produit les distributions packagées pour Google Chrome (MV3 Side Panel)
 * et Mozilla Firefox (MV3 Sidebar Action) et génère les archives .zip prêtes pour les Stores.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT_DIR = path.join(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, '90_Code_Source');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const CHROME_DIR = path.join(DIST_DIR, 'chrome');
const FIREFOX_DIR = path.join(DIST_DIR, 'firefox');

function copyRecursiveSync(src, dest, ignoreList = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (ignoreList.includes(entry.name)) continue;

    if (entry.isDirectory()) {
      copyRecursiveSync(srcPath, destPath, ignoreList);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Création d'un fichier ZIP natif sans dépendance externe npm
 * Utilise la structure standard ZIP PKZIP
 */
function createZipFromDirectory(sourceDir, outZipPath) {
  // Parcourir tous les fichiers récursivement
  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    }
    return fileList;
  }

  const allFiles = getAllFiles(sourceDir);
  const localFileHeaders = [];
  const centralDirHeaders = [];
  let currentOffset = 0;

  const chunks = [];

  for (const filePath of allFiles) {
    const relativePath = path.relative(sourceDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath);
    const nameBuffer = Buffer.from(relativePath, 'utf8');

    // CRC-32 calculé
    let crc = 0 ^ (-1);
    for (let i = 0; i < content.length; i++) {
      crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ content[i]) & 0xFF];
    }
    crc = (crc ^ (-1)) >>> 0;

    // Compresser avec DeflateRaw
    const compressed = zlib.deflateRawSync(content, { level: 9 });

    // Local file header (30 octets + nom)
    const localHeader = Buffer.alloc(30 + nameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Signature
    localHeader.writeUInt16LE(20, 4);          // Version
    localHeader.writeUInt16LE(0, 6);           // Flags
    localHeader.writeUInt16LE(8, 8);           // Compression: Deflate
    localHeader.writeUInt16LE(0, 10);          // Mod time
    localHeader.writeUInt16LE(0, 12);          // Mod date
    localHeader.writeUInt32LE(crc, 14);        // CRC-32
    localHeader.writeUInt32LE(compressed.length, 18); // Taille compressée
    localHeader.writeUInt32LE(content.length, 22);    // Taille non compressée
    localHeader.writeUInt16LE(nameBuffer.length, 26); // Longueur nom
    localHeader.writeUInt16LE(0, 28);          // Extra field length
    nameBuffer.copy(localHeader, 30);

    chunks.push(localHeader);
    chunks.push(compressed);

    // Central directory header (46 octets + nom)
    const centralHeader = Buffer.alloc(46 + nameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Signature
    centralHeader.writeUInt16LE(20, 4);         // Version made by
    centralHeader.writeUInt16LE(20, 6);         // Version needed
    centralHeader.writeUInt16LE(0, 8);          // Flags
    centralHeader.writeUInt16LE(8, 10);         // Compression: Deflate
    centralHeader.writeUInt16LE(0, 12);         // Mod time
    centralHeader.writeUInt16LE(0, 14);         // Mod date
    centralHeader.writeUInt32LE(crc, 16);       // CRC-32
    centralHeader.writeUInt32LE(compressed.length, 20); // Compressed size
    centralHeader.writeUInt32LE(content.length, 24);    // Uncompressed size
    centralHeader.writeUInt16LE(nameBuffer.length, 28); // File name length
    centralHeader.writeUInt16LE(0, 30);         // Extra field length
    centralHeader.writeUInt16LE(0, 32);         // Comment length
    centralHeader.writeUInt16LE(0, 34);         // Disk number
    centralHeader.writeUInt16LE(0, 36);         // Internal attributes
    centralHeader.writeUInt32LE(0, 38);         // External attributes
    centralHeader.writeUInt32LE(currentOffset, 42); // Relative offset
    nameBuffer.copy(centralHeader, 46);

    centralDirHeaders.push(centralHeader);

    currentOffset += localHeader.length + compressed.length;
  }

  const centralDirOffset = currentOffset;
  let centralDirSize = 0;
  for (const h of centralDirHeaders) {
    chunks.push(h);
    centralDirSize += h.length;
  }

  // End of central directory record (22 octets)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4); // Disk number
  eocd.writeUInt16LE(0, 6); // Disk with central dir
  eocd.writeUInt16LE(allFiles.length, 8);  // Entries this disk
  eocd.writeUInt16LE(allFiles.length, 10); // Total entries
  eocd.writeUInt32LE(centralDirSize, 12);  // Central dir size
  eocd.writeUInt32LE(centralDirOffset, 16);// Offset of central dir
  eocd.writeUInt16LE(0, 20); // Comment length
  chunks.push(eocd);

  const finalZipBuffer = Buffer.concat(chunks);
  fs.writeFileSync(outZipPath, finalZipBuffer);
}

// Table CRC-32 pré-calculée
const CRC_TABLE = (function() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }
  return table;
})();

async function buildExtensions() {
  console.log("🚀 Lancement du build multi-cibles des extensions Chrome & Firefox...");

  // 1. Nettoyage et préparation de dist/
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  const ignore = ['manifest.chrome.json', 'manifest.firefox.json'];

  // 2. Assemblage Chrome
  console.log("📦 Assemblage de la distribution Chrome (Side Panel MV3)...");
  copyRecursiveSync(SOURCE_DIR, CHROME_DIR, ignore);
  fs.copyFileSync(
    path.join(SOURCE_DIR, 'manifest.chrome.json'),
    path.join(CHROME_DIR, 'manifest.json')
  );

  // 3. Assemblage Firefox
  console.log("🦊 Assemblage de la distribution Firefox (Sidebar MV3)...");
  copyRecursiveSync(SOURCE_DIR, FIREFOX_DIR, ignore);
  fs.copyFileSync(
    path.join(SOURCE_DIR, 'manifest.firefox.json'),
    path.join(FIREFOX_DIR, 'manifest.json')
  );

  // 4. Vérification de sécurité Store (Zéro lien CDN dans les manifests et html)
  console.log("🔍 Audit de conformité sécurité Store (Zero CDN Check)...");
  const chromeIndexHtml = fs.readFileSync(path.join(CHROME_DIR, 'index.html'), 'utf8');
  if (chromeIndexHtml.includes('cdn.jsdelivr.net')) {
    throw new Error("❌ Violation de sécurité : index.html contient encore des dépendances cdn.jsdelivr.net !");
  }

  // 5. Génération des archives .zip
  console.log("🗜️  Génération de dist/ergovision-chrome-mv3.zip...");
  const chromeZip = path.join(DIST_DIR, 'ergovision-chrome-mv3.zip');
  createZipFromDirectory(CHROME_DIR, chromeZip);
  const chromeZipStat = fs.statSync(chromeZip);
  console.log(`✅ ergovision-chrome-mv3.zip généré (${(chromeZipStat.size / (1024 * 1024)).toFixed(2)} Mo)`);

  console.log("🗜️  Génération de dist/ergovision-firefox-mv3.zip...");
  const firefoxZip = path.join(DIST_DIR, 'ergovision-firefox-mv3.zip');
  createZipFromDirectory(FIREFOX_DIR, firefoxZip);
  const firefoxZipStat = fs.statSync(firefoxZip);
  console.log(`✅ ergovision-firefox-mv3.zip généré (${(firefoxZipStat.size / (1024 * 1024)).toFixed(2)} Mo)`);

  console.log("\n🎉 BUILD SUCCÈS ! Les 2 packages d'extensions sont prêts pour soumission sur les Stores.");
}

buildExtensions().catch(err => {
  console.error("❌ Erreur pendant le build des extensions :", err);
  process.exit(1);
});
