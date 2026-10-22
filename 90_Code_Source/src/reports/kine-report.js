/**
 * ErgoVision AI - Posture Report Generator (PDF / Print View)
 * Génère une synthèse d'habitudes ergonomiques et d'endurance posturale
 * prête à être imprimée ou sauvegardée en PDF.
 */

import { t, getCurrentLanguage } from '../i18n/translations.js';

/**
 * Agréger les logs récents pour la fiche clinique
 */
export function aggregateClinicalData(logs) {
  const summary = {
    totalAlerts: 0,
    neckAlerts: 0,
    shoulderAlerts: 0,
    tiltAlerts: 0,
    distanceAlerts: 0,
    completedCycles: 0,
    kineStretches: 0,
    averageNeutralScore: 0
  };

  if (!Array.isArray(logs) || logs.length === 0) {
    return summary;
  }

  let totalScoreSum = 0;
  let scoreCount = 0;

  logs.forEach(log => {
    if (log.type === 'alert') {
      summary.totalAlerts++;
      const r = (log.reason || '').toLowerCase();
      if (r.includes('nuque') || r.includes('neck') || r.includes('cervic')) summary.neckAlerts++;
      else if (r.includes('épaule') || r.includes('shoulder') || r.includes('trapèze')) summary.shoulderAlerts++;
      else if (r.includes('inclin') || r.includes('tilt')) summary.tiltAlerts++;
      else if (r.includes('distance') || r.includes('écran') || r.includes('screen')) summary.distanceAlerts++;
    } else if (log.type === 'cycle_end') {
      summary.completedCycles++;
      if (typeof log.score === 'number') {
        totalScoreSum += log.score;
        scoreCount++;
      }
    } else if (log.type === 'kine_exercise' || log.type === 'stretch') {
      summary.kineStretches++;
    }
  });

  summary.averageNeutralScore = scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 85;
  return summary;
}

/**
 * Génère le HTML imprimable et ouvre la boîte de dialogue d'impression native (Save as PDF)
 */
export function printKineClinicalReport(logs, userName = "Utilisateur") {
  const data = aggregateClinicalData(logs);
  const lang = getCurrentLanguage();
  const isEn = lang === 'en';
  const dateStr = new Date().toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert(isEn 
      ? "Please allow pop-up windows to print your posture report." 
      : "Veuillez autoriser les fenêtres pop-up pour imprimer votre bilan postural.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${isEn ? 'ErgoVision AI — Desk Posture & Mobility Summary' : 'ErgoVision AI — Bilan d\'Habitudes Posturales & Mobilité'}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      line-height: 1.45;
      font-size: 13px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0f6cbd;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f6cbd;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #475569;
    }
    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .card-val {
      font-size: 26px;
      font-weight: 800;
      color: #0f6cbd;
    }
    .card-lbl {
      font-size: 11px;
      font-weight: 600;
      color: #475569;
      margin-top: 4px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      border-left: 4px solid #0f6cbd;
      padding-left: 8px;
      margin: 18px 0 10px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #334155;
    }
    .notes-box {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 12px;
      min-height: 90px;
      margin-top: 15px;
      background: #fafafa;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">🛡️ ErgoVision AI</div>
      <div class="brand-sub">${isEn ? 'Ergonomic Copilot • Desk Posture Comfort & Mobility Summary' : 'Copilote Ergonomique • Synthèse de Confort Postural & Mobilité au Bureau'}</div>
    </div>
    <div class="meta-box">
      <strong>${isEn ? 'Date:' : 'Date :'}</strong> ${dateStr}<br>
      <strong>${isEn ? 'User:' : 'Utilisateur :'}</strong> ${userName}<br>
      <strong>${isEn ? 'Execution:' : 'Exécution :'}</strong> ${isEn ? '100% Local (Zero Cloud)' : '100% Locale (Zéro Cloud)'}
    </div>
  </div>

  <div class="card-grid">
    <div class="card">
      <div class="card-val" style="color:#107c41;">${data.averageNeutralScore}%</div>
      <div class="card-lbl">${isEn ? 'Neutral Alignment Ratio' : 'Maintien en Posture Neutre'}</div>
    </div>
    <div class="card">
      <div class="card-val" style="color:#0f6cbd;">${data.completedCycles}</div>
      <div class="card-lbl">${isEn ? 'Completed Sessions' : 'Cycles Ergonomiques Réalisés'}</div>
    </div>
    <div class="card">
      <div class="card-val" style="color:#d13438;">${data.totalAlerts}</div>
      <div class="card-lbl">${isEn ? 'Corrected Slumps & Alerts' : 'Dérives Posturales Corrigées'}</div>
    </div>
  </div>

  <div class="section-title">${isEn ? '1. Distribution of Biomechanical Strain Observed' : '1. Répartition des Sollicitations Mécaniques Observées'}</div>
  <table>
    <thead>
      <tr>
        <th>${isEn ? 'Monitored Spinal Region' : 'Zone Rachidienne Surveillée'}</th>
        <th>${isEn ? 'Compensations Detected' : 'Compensations Détectées'}</th>
        <th>${isEn ? 'Recommended Decompression Protocol' : 'Protocole de Décharge Recommandé'}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${isEn ? 'Cervical Spine (C5-C7)' : 'Rachis Cervical (C5-C7)'}</strong> — ${isEn ? 'Text-Neck / Forward slump' : 'Text-Neck / Projection antérieure'}</td>
        <td>${data.neckAlerts} ${isEn ? 'alerts' : 'alertes'}</td>
        <td>${isEn ? 'Guided axial retractions (McKenzie chin tuck)' : 'Rétractions axiales guidées (McKenzie chin tuck)'}</td>
      </tr>
      <tr>
        <td><strong>${isEn ? 'Scapular Girdle' : 'Ceinture Scapulaire'}</strong> — ${isEn ? 'Trapezius shrug & tension' : 'Hausse réflexe des trapèzes'}</td>
        <td>${data.shoulderAlerts} ${isEn ? 'alerts' : 'alertes'}</td>
        <td>${isEn ? 'Scapular rolling & Brügger postural relief' : 'Déroulement scapulaire & posture Brügger'}</td>
      </tr>
      <tr>
        <td><strong>${isEn ? 'Lateral Asymmetry' : 'Asymétrie Latérale'}</strong> — ${isEn ? 'Sustained head tilt' : 'Inclinaison de la tête'}</td>
        <td>${data.tiltAlerts} ${isEn ? 'alerts' : 'alertes'}</td>
        <td>${isEn ? 'Bilateral realignment & trapezius stretch' : 'Réalignement bilatéral et étirement trapèze moyen'}</td>
      </tr>
      <tr>
        <td><strong>${isEn ? 'Visual Proximity & Screen Strain' : 'Proximité Visuelle & Charnière Dorsale'}</strong> (&lt;50cm)</td>
        <td>${data.distanceAlerts} ${isEn ? 'alerts' : 'alertes'}</td>
        <td>${isEn ? '20-20-20 eye rest & Chair back thoracic extension' : 'Règle oculaire 20-20-20 & Extension thoracique sur dossier'}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">${isEn ? '2. Active Mobility & Stretch Breaks' : '2. Pauses Mobilité & Étirements au Bureau'}</div>
  <p style="font-size: 12px; color: #475569;">
    ${isEn 
      ? `The user completed <strong>${data.kineStretches} active mobility routine(s)</strong> during desk work sessions.`
      : `L'utilisateur a réalisé <strong>${data.kineStretches} pause(s) mobilité et étirements</strong> au cours de ses sessions de bureau.`
    }
  </p>

  <div class="section-title">${isEn ? '3. Personal Notes & Ergonomic Observations' : '3. Notes Personnelles & Observations Ergonomiques'}</div>
  <div class="notes-box">
    <em style="color:#94a3b8; font-size:11px;">${isEn ? 'Dedicated area for personal or ergonomic advisor notes:' : 'Zone réservée aux annotations personnelles ou ergonomiques :'}</em>
  </div>

  <div class="footer">
    <span>${isEn ? 'General wellness & ergonomic comfort document (Non-medical, non-diagnostic) — ErgoVision AI (100% Free & Open-Source MIT)' : 'Document de bien-être et d\'ergonomie générale (Non médical, non diagnostique) — ErgoVision AI (100% Gratuit & Open-Source MIT)'}</span>
    <span>${isEn ? 'Local WebAssembly processing • Zero video storage' : 'Traitement local WebAssembly • Aucune image vidéo stockée'}</span>
  </div>

  <scr` + `ipt>
    window.addEventListener('load', () => {
      setTimeout(() => { window.print(); }, 400);
    });
  </scr` + `ipt>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
