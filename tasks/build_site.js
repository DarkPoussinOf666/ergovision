/**
 * ErgoVision AI — Static Website & GitHub Pages Distribution Builder
 * Generates the bilingual (FR / EN) static marketing & legal website + bundles the Web App into public_dist/
 * Zero external dependencies.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, '90_Code_Source');
const SITE_DIR = path.join(SRC_DIR, 'site');
const OUT_DIR = path.join(ROOT_DIR, 'public_dist');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const BRAND_LOGO_SVG = `<svg viewBox="0 0 128 128" width="32" height="32" aria-hidden="true">
  <defs>
    <linearGradient id="siteLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0060ab"/>
      <stop offset="45%" stop-color="#0f6cbd"/>
      <stop offset="85%" stop-color="#107c41"/>
      <stop offset="100%" stop-color="#2d9d5f"/>
    </linearGradient>
  </defs>
  <rect x="8" y="8" width="112" height="112" rx="28" fill="url(#siteLogoGrad)"/>
  <circle cx="64" cy="64" r="34" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.35"/>
  <line x1="64" y1="22" x2="64" y2="106" stroke="#ffffff" stroke-width="1.8" stroke-opacity="0.35" stroke-dasharray="3 3"/>
  <circle cx="64" cy="35" r="7" fill="#ffffff"/>
  <circle cx="64" cy="35" r="3" fill="#0f6cbd"/>
  <path d="M 53 49 Q 64 45 75 49 Q 71 54 64 54 Q 57 54 53 49 Z" fill="#ffffff"/>
  <path d="M 47 62 Q 64 57 81 62 Q 77 68 64 68 Q 51 68 47 62 Z" fill="#ffffff"/>
  <path d="M 50 76 Q 64 72 78 76 Q 74 82 64 82 Q 54 82 50 76 Z" fill="#ffffff"/>
  <path d="M 54 90 Q 64 86 74 90 Q 71 95 64 95 Q 57 95 54 90 Z" fill="#ffffff"/>
</svg>`;

function renderLayout({ content, pageFile, activeNav, metaTitle, metaDesc, bodyHtml }) {
  const prefix = content.rootPrefix;
  const otherLangHref = `${content.otherLangPrefix}${pageFile}`;

  return `<!DOCTYPE html>
<html lang="${content.lang}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metaTitle)}</title>
  <meta name="description" content="${escapeHtml(metaDesc)}">
  <link rel="icon" type="image/svg+xml" href="${prefix}assets/icons/icon.svg">
  <link rel="stylesheet" href="${prefix}css/tokens.css">
  <link rel="stylesheet" href="${prefix}css/site.css">
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('ergovision_theme_v2');
        if (saved === 'dark' || saved === 'light') {
          document.documentElement.setAttribute('data-theme', saved);
        }
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <header class="site-header" role="banner">
    <div class="site-header-inner">
      <a href="./index.html" class="site-brand">
        ${BRAND_LOGO_SVG}
        <span>ErgoVision <span class="site-brand-chip">AI</span></span>
      </a>

      <nav class="site-nav" aria-label="Navigation principale">
        <a href="./index.html" class="site-nav-link ${activeNav === 'home' ? 'active' : ''}">${escapeHtml(content.nav.home)}</a>
        <a href="./guide.html" class="site-nav-link ${activeNav === 'guide' ? 'active' : ''}">${escapeHtml(content.nav.guide)}</a>
        <a href="./privacy.html" class="site-nav-link ${activeNav === 'privacy' ? 'active' : ''}">${escapeHtml(content.nav.privacy)}</a>
        <a href="./legal.html" class="site-nav-link ${activeNav === 'legal' ? 'active' : ''}">${escapeHtml(content.nav.legal)}</a>
        <a href="${content.githubIssuesUrl}" target="_blank" rel="noopener noreferrer" class="site-nav-link">${escapeHtml(content.nav.contact)}</a>
      </nav>

      <div class="site-actions">
        <a href="${content.appUrl}" class="btn btn-primary">${escapeHtml(content.nav.launchApp)}</a>
        <a href="${otherLangHref}" class="btn btn-icon" title="Switch language / Changer de langue">${escapeHtml(content.otherLangLabel)}</a>
        <button type="button" id="btnSiteTheme" class="btn btn-icon" title="${escapeHtml(content.nav.toggleTheme)}" aria-label="${escapeHtml(content.nav.toggleTheme)}">🌓</button>
      </div>
    </div>
  </header>

  <main class="site-main" role="main">
${bodyHtml}
  </main>

  <footer class="site-footer" role="contentinfo">
    <div class="site-footer-inner">
      <div class="site-footer-top">
        <strong>${escapeHtml(content.footer.tagline)}</strong>
        <div class="site-footer-links">
          <a href="./index.html">${escapeHtml(content.nav.home)}</a>
          <a href="./guide.html">${escapeHtml(content.nav.guide)}</a>
          <a href="./privacy.html">${escapeHtml(content.nav.privacy)}</a>
          <a href="./legal.html">${escapeHtml(content.nav.legal)}</a>
          <a href="${content.githubIssuesUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(content.nav.contact)}</a>
          <a href="${content.githubRepoUrl}" target="_blank" rel="noopener noreferrer">GitHub (MIT)</a>
        </div>
      </div>
      <p class="site-footer-disclaimer">${escapeHtml(content.footer.disclaimer)}</p>
    </div>
  </footer>

  <script>
    (function() {
      var btn = document.getElementById('btnSiteTheme');
      if (btn) {
        btn.addEventListener('click', function() {
          var current = document.documentElement.getAttribute('data-theme') || 'light';
          var next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          try { localStorage.setItem('ergovision_theme_v2', next); } catch (e) {}
        });
      }
    })();
  </script>
</body>
</html>`;
}

function renderLandingPage(content) {
  const l = content.landing;
  const stepsHtml = l.steps.map(s => `
        <div class="card">
          <div class="card-icon">${escapeHtml(s.num)}</div>
          <h3 class="card-title">${escapeHtml(s.title)}</h3>
          <p class="card-text">${escapeHtml(s.text)}</p>
        </div>`).join('');

  const featuresHtml = l.features.map(f => `
        <div class="card">
          <div class="card-icon" aria-hidden="true">${f.icon}</div>
          <h3 class="card-title">${escapeHtml(f.title)}</h3>
          <p class="card-text">${escapeHtml(f.text)}</p>
        </div>`).join('');

  const trustHtml = l.trustItems.map(item => `<li>${escapeHtml(item)}</li>`).join('');

  const faqsHtml = l.faqs.map(faq => `
        <div class="faq-item">
          <h3 class="faq-q">${escapeHtml(faq.q)}</h3>
          <p class="faq-a">${escapeHtml(faq.a)}</p>
        </div>`).join('');

  const bodyHtml = `
    <section class="hero">
      <div class="hero-badge">${escapeHtml(l.badge)}</div>
      <h1 class="hero-title">${escapeHtml(l.heroTitle)}</h1>
      <p class="hero-subtitle">${escapeHtml(l.heroSubtitle)}</p>
      <div class="hero-cta-row">
        <a href="${content.appUrl}" class="btn btn-primary">${escapeHtml(l.ctaLaunch)}</a>
        <a href="./guide.html" class="btn btn-secondary">${escapeHtml(l.ctaGuide)}</a>
        <a href="${content.githubRepoUrl}" target="_blank" rel="noopener noreferrer" class="btn">${escapeHtml(l.ctaGithub)}</a>
      </div>
      <ul class="hero-trust-list">
        ${trustHtml}
      </ul>
    </section>

    <div class="callout">
      <h2 class="callout-title">${escapeHtml(l.privacyCalloutTitle)}</h2>
      <p class="callout-text">${escapeHtml(l.privacyCalloutText)}</p>
    </div>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">${escapeHtml(l.howTitle)}</h2>
        <p class="section-desc">${escapeHtml(l.howDesc)}</p>
      </div>
      <div class="grid-3">
        ${stepsHtml}
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">${escapeHtml(l.featuresTitle)}</h2>
        <p class="section-desc">${escapeHtml(l.featuresDesc)}</p>
      </div>
      <div class="grid-3">
        ${featuresHtml}
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2 class="section-title">${escapeHtml(l.faqTitle)}</h2>
      </div>
      <div class="faq-list">
        ${faqsHtml}
      </div>
    </section>`;

  return renderLayout({
    content,
    pageFile: 'index.html',
    activeNav: 'home',
    metaTitle: l.metaTitle,
    metaDesc: l.metaDesc,
    bodyHtml
  });
}

function renderProsePage(content, pageKey, pageFile, includeContactCta = false) {
  const pageData = content[pageKey];
  const sectionsHtml = pageData.sections.map(sec => {
    const pHtml = sec.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('\n        ');
    return `
      <section>
        <h2>${escapeHtml(sec.heading)}</h2>
        ${pHtml}
      </section>`;
  }).join('\n');

  const contactBlock = includeContactCta ? `
      <div class="callout" style="margin-top: 2rem;">
        <h2 class="callout-title" style="margin-top:0;">💬 ${escapeHtml(content.nav.contact)}</h2>
        <p class="callout-text" style="margin-bottom: 1rem;">
          ${content.lang === 'fr'
            ? 'Ouvrez un ticket sur GitHub Issues pour signaler un bug, poser une question ou contacter le mainteneur du projet :'
            : 'Open a ticket on GitHub Issues to report a bug, ask a question, or contact the project maintainer:'}
        </p>
        <a href="${content.githubIssuesUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          ${escapeHtml(content.nav.contact)}
        </a>
      </div>` : '';

  const bodyHtml = `
    <article class="prose-container">
      <h1>${escapeHtml(pageData.title)}</h1>
      <div class="prose-meta">${escapeHtml(pageData.subtitle)}</div>
      ${sectionsHtml}
      ${contactBlock}
    </article>`;

  return renderLayout({
    content,
    pageFile,
    activeNav: pageKey,
    metaTitle: pageData.metaTitle,
    metaDesc: pageData.metaDesc,
    bodyHtml
  });
}

function buildSite() {
  console.log('🌐 ErgoVision AI — Construction du site vitrine bilingue (FR / EN) et de la distribution GitHub Pages...');

  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, 'en'), { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, 'css'), { recursive: true });

  // 1. Copier les CSS et assets nécessaires
  fs.copyFileSync(path.join(SRC_DIR, 'css', 'tokens.css'), path.join(OUT_DIR, 'css', 'tokens.css'));
  fs.copyFileSync(path.join(SITE_DIR, 'css', 'site.css'), path.join(OUT_DIR, 'css', 'site.css'));
  copyDirRecursive(path.join(SRC_DIR, 'assets'), path.join(OUT_DIR, 'assets'));
  copyDirRecursive(path.join(SRC_DIR, 'vendor'), path.join(OUT_DIR, 'vendor'));

  // 2. Copier l'application autonome dans public_dist/app.html
  const standaloneAppPath = path.join(ROOT_DIR, 'index.html');
  if (!fs.existsSync(standaloneAppPath)) {
    throw new Error('index.html standalone introuvable. Exécutez node tasks/build_standalone.js au préalable.');
  }
  fs.copyFileSync(standaloneAppPath, path.join(OUT_DIR, 'app.html'));

  // 3. Charger les contenus FR et EN
  const frContent = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'content', 'fr.json'), 'utf8'));
  const enContent = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'content', 'en.json'), 'utf8'));

  // 4. Générer les pages FR à la racine de public_dist/
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), renderLandingPage(frContent), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'guide.html'), renderProsePage(frContent, 'guide', 'guide.html', false), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'privacy.html'), renderProsePage(frContent, 'privacy', 'privacy.html', true), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'legal.html'), renderProsePage(frContent, 'legal', 'legal.html', true), 'utf8');

  // 5. Générer les pages EN dans public_dist/en/
  fs.writeFileSync(path.join(OUT_DIR, 'en', 'index.html'), renderLandingPage(enContent), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'en', 'guide.html'), renderProsePage(enContent, 'guide', 'guide.html', false), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'en', 'privacy.html'), renderProsePage(enContent, 'privacy', 'privacy.html', true), 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'en', 'legal.html'), renderProsePage(enContent, 'legal', 'legal.html', true), 'utf8');

  // 6. Fichier .nojekyll pour GitHub Pages
  fs.writeFileSync(path.join(OUT_DIR, '.nojekyll'), '', 'utf8');

  console.log('✅ Site vitrine généré avec succès dans public_dist/ (FR + EN + app.html + assets + vendor).');
}

try {
  buildSite();
} catch (err) {
  console.error('❌ Erreur lors de la génération du site :', err);
  process.exit(1);
}
