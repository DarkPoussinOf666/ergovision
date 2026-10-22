/**
 * ErgoVision AI - Analytics Dashboard View Component
 * Rendu SVG & HTML vectoriel natif, sans bibliothèque externe (0 Ko de dépendance).
 * Compatible Fluent UI 2, thèmes Light/Dark et conformité WCAG 2.1 AA.
 */

import { t, getCurrentLanguage } from '../i18n/translations.js';
import {
  loadMultiDayLogs,
  calculateAnalyticsSummary,
  clearAllMultiDayHistory
} from '../analytics/posture-analytics.js';

let currentPeriodDays = 7;

/**
 * Génère le SVG de l'histogramme quotidien
 * @param {Array} daysData 
 * @param {string} lang 
 * @returns {string} SVG HTML string
 */
function renderDailyHistogramSvg(daysData, lang) {
  const width = 560;
  const height = 180;
  const chartTop = 24;
  const chartBottom = 150;
  const chartHeight = chartBottom - chartTop; // 126px
  const count = daysData.length;
  
  // Ligne cible 80%
  const targetY = chartBottom - (chartHeight * 0.80);

  // Espacement des barres
  const barSlotWidth = width / count;
  const barWidth = Math.max(12, Math.min(36, barSlotWidth * 0.55));

  let barsHtml = '';
  daysData.forEach((day, index) => {
    const cx = index * barSlotWidth + barSlotWidth / 2;
    const x = cx - barWidth / 2;
    const score = day.score;

    if (score !== null && score > 0) {
      const h = (score / 100) * chartHeight;
      const y = chartBottom - h;
      
      // Couleur selon palier
      let barFill = 'var(--status-success, #107c41)';
      if (score < 65) {
        barFill = 'var(--status-danger, #d13438)';
      } else if (score < 80) {
        barFill = 'var(--status-warning, #d83b01)';
      }

      barsHtml += `
        <g class="chart-col" tabindex="0">
          <title>${day.dateKey} (${day.dayLabel}): ${score}% (${day.sessions} sessions, ${day.alerts} alertes)</title>
          <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="4" fill="${barFill}" class="chart-bar-rect">
            <animate attributeName="height" from="0" to="${h}" dur="0.4s" fill="freeze" />
            <animate attributeName="y" from="${chartBottom}" to="${y}" dur="0.4s" fill="freeze" />
          </rect>
          <text x="${cx}" y="${y - 6}" font-size="10" font-weight="700" fill="var(--fluent-fg-primary)" text-anchor="middle" class="chart-val-text">${score}%</text>
          <text x="${cx}" y="${chartBottom + 16}" font-size="11" font-weight="600" fill="var(--fluent-fg-secondary)" text-anchor="middle">${day.dayLabel}</text>
          <text x="${cx}" y="${chartBottom + 28}" font-size="9" fill="var(--fluent-fg-muted)" text-anchor="middle">${day.dateShort}</text>
        </g>
      `;
    } else {
      // Jour sans session
      barsHtml += `
        <g class="chart-col empty" tabindex="0">
          <title>${day.dateKey} (${day.dayLabel}): Aucune session</title>
          <rect x="${x}" y="${chartBottom - 4}" width="${barWidth}" height="4" rx="2" fill="var(--fluent-stroke-subtle, rgba(0,0,0,0.1))" />
          <text x="${cx}" y="${chartBottom - 8}" font-size="9" fill="var(--fluent-fg-muted)" text-anchor="middle">—</text>
          <text x="${cx}" y="${chartBottom + 16}" font-size="11" font-weight="600" fill="var(--fluent-fg-muted)" text-anchor="middle">${day.dayLabel}</text>
          <text x="${cx}" y="${chartBottom + 28}" font-size="9" fill="var(--fluent-fg-muted)" text-anchor="middle">${day.dateShort}</text>
        </g>
      `;
    }
  });

  return `
    <svg class="analytics-histogram-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t('analytics_chart_title')}">
      <defs>
        <pattern id="gridPattern" width="10" height="25" patternUnits="userSpaceOnUse">
          <path d="M 0 25 L 10 25" fill="none" stroke="var(--fluent-stroke-subtle, rgba(0,0,0,0.05))" stroke-width="1" />
        </pattern>
      </defs>

      <!-- Grille d'arrière-plan -->
      <line x1="0" y1="${chartTop}" x2="${width}" y2="${chartTop}" stroke="var(--fluent-stroke-subtle, rgba(0,0,0,0.08))" stroke-width="1" />
      <line x1="0" y1="${chartBottom}" x2="${width}" y2="${chartBottom}" stroke="var(--fluent-stroke-subtle, rgba(0,0,0,0.15))" stroke-width="1.5" />

      <!-- Ligne cible 80% INRS -->
      <line x1="0" y1="${targetY}" x2="${width}" y2="${targetY}" stroke="var(--status-success, #107c41)" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.8" />
      <text x="${width - 8}" y="${targetY - 5}" font-size="10" font-weight="700" fill="var(--status-success, #107c41)" text-anchor="end">${t('analytics_chart_target')}</text>

      <!-- Barres des jours -->
      ${barsHtml}
    </svg>
  `;
}

/**
 * Rendu de la barre de répartition biomécanique
 * @param {Object} deviationCounts 
 * @param {Object} deviationPct 
 * @param {number} totalDeviations 
 * @returns {string} HTML
 */
function renderDistributionBarHtml(deviationCounts, deviationPct, totalDeviations) {
  if (totalDeviations === 0) {
    return `<div style="font-size:0.8rem; color:var(--fluent-fg-muted); text-align:center; padding:0.5rem;">${t('status_optimal')} — 0 dérive enregistrée.</div>`;
  }

  return `
    <div class="deviation-stacked-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" title="${totalDeviations} dérives totales">
      ${deviationPct.neck > 0 ? `<div class="dev-seg seg-neck" style="width:${deviationPct.neck}%;" title="${t('analytics_zone_neck')}: ${deviationCounts.neck} (${deviationPct.neck}%)"></div>` : ''}
      ${deviationPct.shoulder > 0 ? `<div class="dev-seg seg-shoulder" style="width:${deviationPct.shoulder}%;" title="${t('analytics_zone_shoulder')}: ${deviationCounts.shoulder} (${deviationPct.shoulder}%)"></div>` : ''}
      ${deviationPct.tilt > 0 ? `<div class="dev-seg seg-tilt" style="width:${deviationPct.tilt}%;" title="${t('analytics_zone_tilt')}: ${deviationCounts.tilt} (${deviationPct.tilt}%)"></div>` : ''}
      ${deviationPct.distance > 0 ? `<div class="dev-seg seg-distance" style="width:${deviationPct.distance}%;" title="${t('analytics_zone_distance')}: ${deviationCounts.distance} (${deviationPct.distance}%)"></div>` : ''}
    </div>
    <div class="deviation-legend-grid">
      <div class="dev-legend-item">
        <span class="legend-dot dot-neck"></span>
        <span class="legend-name">${t('analytics_zone_neck')}</span>
        <span class="legend-pct">${deviationPct.neck}% (${deviationCounts.neck})</span>
      </div>
      <div class="dev-legend-item">
        <span class="legend-dot dot-shoulder"></span>
        <span class="legend-name">${t('analytics_zone_shoulder')}</span>
        <span class="legend-pct">${deviationPct.shoulder}% (${deviationCounts.shoulder})</span>
      </div>
      <div class="dev-legend-item">
        <span class="legend-dot dot-tilt"></span>
        <span class="legend-name">${t('analytics_zone_tilt')}</span>
        <span class="legend-pct">${deviationPct.tilt}% (${deviationCounts.tilt})</span>
      </div>
      <div class="dev-legend-item">
        <span class="legend-dot dot-distance"></span>
        <span class="legend-name">${t('analytics_zone_distance')}</span>
        <span class="legend-pct">${deviationPct.distance}% (${deviationCounts.distance})</span>
      </div>
    </div>
  `;
}

/**
 * Rendu principal du conteneur Analytics
 * @param {HTMLElement} containerEl 
 * @param {Function} onDataChanged - Callback en cas de modification des données (ex: seed ou clear)
 */
export function renderAnalyticsDashboard(containerEl, onDataChanged = null) {
  if (!containerEl) return;

  const lang = getCurrentLanguage();
  const multiDayData = loadMultiDayLogs(currentPeriodDays);
  const summary = calculateAnalyticsSummary(multiDayData, lang);

  const hasData = summary.totalSessions > 0 || summary.totalAlerts > 0;

  // Calcul du badge de tendance
  let trendBadgeHtml = '';
  if (summary.trendDelta > 0) {
    trendBadgeHtml = `<span class="analytics-trend-pill trend-up">↗ +${summary.trendDelta}% ${t('analytics_trend_up')}</span>`;
  } else if (summary.trendDelta < 0) {
    trendBadgeHtml = `<span class="analytics-trend-pill trend-down">↘ ${summary.trendDelta}% ${t('analytics_trend_down')}</span>`;
  } else if (summary.averageNeutralScore !== null) {
    trendBadgeHtml = `<span class="analytics-trend-pill trend-stable">→ 0% ${t('analytics_trend_stable')}</span>`;
  }

  // Formatage des heures de sessions
  const hours = Math.floor(summary.totalSessionMinutes / 60);
  const mins = summary.totalSessionMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm' : ''}` : `${mins} min`;

  containerEl.innerHTML = `
    <div class="analytics-dashboard-card bento-card">
      <!-- Header Dashboard -->
      <div class="analytics-header">
        <div class="analytics-header-left">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <svg class="icon" style="color:var(--brand-primary); width:18px; height:18px;" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            <h3 style="margin:0; font-size:0.95rem; font-weight:800; color:var(--fluent-fg-primary);">${t('analytics_title')}</h3>
          </div>
          <p style="margin:0.2rem 0 0; font-size:0.75rem; color:var(--fluent-fg-muted);">${t('analytics_subtitle')}</p>
        </div>

        <!-- Sélecteur Période & Actions -->
        <div class="analytics-actions-bar">
          <div class="segmented-control period-selector" role="tablist">
            <button type="button" class="seg-btn ${currentPeriodDays === 7 ? 'active' : ''}" data-days="7" role="tab">${t('analytics_period_7d')}</button>
            <button type="button" class="seg-btn ${currentPeriodDays === 14 ? 'active' : ''}" data-days="14" role="tab">${t('analytics_period_14d')}</button>
            <button type="button" class="seg-btn ${currentPeriodDays === 30 ? 'active' : ''}" data-days="30" role="tab">${t('analytics_period_30d')}</button>
          </div>
          <div style="display:flex; gap:0.4rem; align-items:center;">
            <button type="button" id="btnClearAnalytics" class="btn-analytics-action btn-danger-subtle" title="${t('analytics_btn_clear_history')}">
              <svg class="icon" style="width:12px; height:12px;" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>
              <span>${t('analytics_btn_clear_history')}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="analytics-kpi-grid">
        <div class="analytics-kpi-card">
          <div class="kpi-label">${t('analytics_kpi_score')}</div>
          <div class="kpi-value-row">
            <span class="kpi-number">${summary.averageNeutralScore !== null ? summary.averageNeutralScore + '%' : '—'}</span>
            ${trendBadgeHtml}
          </div>
          <div class="kpi-subtext">${t('analytics_kpi_score_sub')}</div>
        </div>

        <div class="analytics-kpi-card">
          <div class="kpi-label">${t('analytics_kpi_sessions')}</div>
          <div class="kpi-value-row">
            <span class="kpi-number">${summary.totalSessions}</span>
            <span class="kpi-tag">${timeFormatted}</span>
          </div>
          <div class="kpi-subtext">${t('analytics_kpi_sessions_sub')}</div>
        </div>

        <div class="analytics-kpi-card">
          <div class="kpi-label">${t('analytics_kpi_alerts')}</div>
          <div class="kpi-value-row">
            <span class="kpi-number" style="color:var(--status-danger);">${summary.totalAlerts}</span>
          </div>
          <div class="kpi-subtext">${t('analytics_kpi_alerts_sub')}</div>
        </div>

        <div class="analytics-kpi-card">
          <div class="kpi-label">${t('analytics_kpi_kine')}</div>
          <div class="kpi-value-row">
            <span class="kpi-number" style="color:var(--status-success);">${summary.kineStretches}</span>
          </div>
          <div class="kpi-subtext">${t('analytics_kpi_kine_sub')}</div>
        </div>
      </div>

      <!-- Graphique Quotidien SVG -->
      <div class="analytics-chart-wrapper">
        <div class="chart-header-row">
          <span class="chart-title">${t('analytics_chart_title')}</span>
        </div>
        ${hasData 
          ? renderDailyHistogramSvg(summary.daysData, lang)
          : `<div class="analytics-empty-hint">${t('analytics_no_data')}</div>`
        }
      </div>

      <!-- Distribution des Dérives -->
      <div class="analytics-distribution-wrapper">
        <div class="chart-header-row">
          <span class="chart-title">${t('analytics_dist_title')}</span>
        </div>
        ${renderDistributionBarHtml(summary.deviationCounts, summary.deviationPct, summary.totalDeviations)}
      </div>
    </div>
  `;

  // Écouteurs de changement de période
  const periodBtns = containerEl.querySelectorAll('.period-selector .seg-btn');
  periodBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const days = parseInt(btn.getAttribute('data-days'), 10);
      if (days && days !== currentPeriodDays) {
        currentPeriodDays = days;
        renderAnalyticsDashboard(containerEl, onDataChanged);
      }
    });
  });

  // Écouteur Clear History
  const btnClear = containerEl.querySelector('#btnClearAnalytics');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm(t('analytics_clear_confirm'))) {
        clearAllMultiDayHistory(60);
        renderAnalyticsDashboard(containerEl, onDataChanged);
        if (onDataChanged) onDataChanged();
      }
    });
  }
}
