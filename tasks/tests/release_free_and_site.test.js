/**
 * ErgoVision AI — Automated Verification Suite (100% Free Model, MDR Wording & Bilingual Static Site)
 * Run via: node --test tasks/tests/release_free_and_site.test.js
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(ROOT, '90_Code_Source');
const PUBLIC_DIST = path.join(ROOT, 'public_dist');

test('1. License gate is completely removed and no LemonSqueezy/paywall references remain', () => {
  const licensePath = path.join(SRC, 'src', 'license', 'license-gate.js');
  assert.equal(fs.existsSync(licensePath), false, 'license-gate.js must be deleted');

  const filesToScan = [
    path.join(SRC, 'src', 'app.js'),
    path.join(SRC, 'src', 'i18n', 'translations.js'),
    path.join(SRC, 'src', 'reports', 'kine-report.js'),
    path.join(SRC, 'index.html'),
    path.join(SRC, 'css', 'style.css'),
    path.join(SRC, 'manifest.chrome.json'),
    path.join(SRC, 'manifest.firefox.json'),
    path.join(ROOT, 'index.html')
  ];

  const forbiddenTokens = [
    'lemonsqueezy',
    'getFeatureFlags',
    'isProActive',
    'licenseModal',
    'btnProStatus',
    'ERGO-REVIEWER',
    'gauge-locked'
  ];

  for (const file of filesToScan) {
    const content = fs.readFileSync(file, 'utf8');
    for (const token of forbiddenTokens) {
      assert.equal(
        content.toLowerCase().includes(token.toLowerCase()),
        false,
        `Forbidden paywall token "${token}" found in ${path.relative(ROOT, file)}`
      );
    }
  }
});

test('2. Firefox & Chrome manifests have strict self CSP and Firefox declares zero data collection', () => {
  const chromeManifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.chrome.json'), 'utf8'));
  const firefoxManifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.firefox.json'), 'utf8'));

  assert.equal(
    chromeManifest.content_security_policy.extension_pages.includes("connect-src 'self';"),
    true
  );
  assert.equal(
    firefoxManifest.content_security_policy.extension_pages.includes("connect-src 'self';"),
    true
  );
  assert.deepEqual(
    firefoxManifest.browser_specific_settings.gecko.data_collection_permissions.required,
    ['none']
  );
});

test('3. Bilingual static website (FR & EN) and standalone Web App are generated in public_dist/', () => {
  const expectedFiles = [
    'index.html',
    'guide.html',
    'privacy.html',
    'legal.html',
    'app.html',
    'en/index.html',
    'en/guide.html',
    'en/privacy.html',
    'en/legal.html',
    'css/tokens.css',
    'css/site.css',
    'assets/icons/icon.svg',
    'vendor/mediapipe/pose.js'
  ];

  for (const rel of expectedFiles) {
    const full = path.join(PUBLIC_DIST, rel);
    assert.equal(fs.existsSync(full), true, `Missing generated file: public_dist/${rel}`);
  }
});

test('4. All internal links in generated FR and EN pages resolve to existing files in public_dist/', () => {
  const htmlPages = [
    'index.html',
    'guide.html',
    'privacy.html',
    'legal.html',
    'en/index.html',
    'en/guide.html',
    'en/privacy.html',
    'en/legal.html'
  ];

  const hrefRegex = /href="([^"]+)"/g;

  for (const pageRel of htmlPages) {
    const pagePath = path.join(PUBLIC_DIST, pageRel);
    const pageDir = path.dirname(pagePath);
    const html = fs.readFileSync(pagePath, 'utf8');

    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
        continue;
      }
      const resolved = path.resolve(pageDir, href);
      assert.equal(
        fs.existsSync(resolved),
        true,
        `Broken internal link "${href}" in public_dist/${pageRel} (resolved to ${resolved})`
      );
    }
  }
});

test('5. MDR 2017/745 wellness compliance: no medical device or rehabilitation claims in UI & locales', () => {
  const filesToCheck = [
    path.join(SRC, '_locales', 'fr', 'messages.json'),
    path.join(SRC, '_locales', 'en', 'messages.json'),
    path.join(SRC, 'src', 'i18n', 'translations.js'),
    path.join(PUBLIC_DIST, 'index.html'),
    path.join(PUBLIC_DIST, 'en', 'index.html')
  ];

  const forbiddenClaims = [
    'rééducation',
    'rehabilitation',
    'prévention des tms',
    'rsi prevention',
    'atelier kiné',
    'physiotherapy studio'
  ];

  for (const file of filesToCheck) {
    const text = fs.readFileSync(file, 'utf8').toLowerCase();
    for (const claim of forbiddenClaims) {
      assert.equal(
        text.includes(claim),
        false,
        `Forbidden medical claim "${claim}" found in ${path.relative(ROOT, file)}`
      );
    }
  }

  // Legal pages must explicitly include the non-medical device disclaimer
  const frLegal = fs.readFileSync(path.join(PUBLIC_DIST, 'legal.html'), 'utf8');
  const enLegal = fs.readFileSync(path.join(PUBLIC_DIST, 'en', 'legal.html'), 'utf8');
  assert.equal(frLegal.includes("N'EST PAS un dispositif médical"), true);
  assert.equal(enLegal.includes('IS NOT a medical device'), true);
});
