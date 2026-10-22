/**
 * ErgoVision AI - Posture Analytics Engine
 * Moteur d'agrégation statistique multi-jours (7 à 30 jours)
 * 100% local, privé et déterministe (zéro requête externe).
 */

/**
 * Génère la liste des clés de date ISO (YYYY-MM-DD) sur les N derniers jours
 * (du jour le plus ancien au jour actuel).
 * @param {number} numDays - Nombre de jours (ex: 7, 14, 30)
 * @returns {string[]}
 */
export function getMultiDayKeys(numDays = 7) {
  const keys = [];
  const now = new Date();
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

/**
 * Charge les logs de tous les jours demandés depuis le localStorage.
 * @param {number} numDays
 * @returns {{ dates: string[], logsByDate: Object.<string, Array> }}
 */
export function loadMultiDayLogs(numDays = 7) {
  const dates = getMultiDayKeys(numDays);
  const logsByDate = {};

  dates.forEach(dateKey => {
    try {
      const raw = localStorage.getItem('ergovision_daily_log_' + dateKey);
      logsByDate[dateKey] = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn(`Erreur lecture logs pour ${dateKey} :`, e);
      logsByDate[dateKey] = [];
    }
  });

  return { dates, logsByDate };
}

/**
 * Calcule la synthèse globale et les séries temporelles pour les graphiques.
 * @param {{ dates: string[], logsByDate: Object.<string, Array> }} multiDayData
 * @param {string} lang - 'fr' | 'en'
 * @returns {Object}
 */
export function calculateAnalyticsSummary(multiDayData, lang = 'fr') {
  const { dates, logsByDate } = multiDayData;
  const daysData = [];

  let grandTotalScoreSum = 0;
  let grandTotalScoreCount = 0;
  let totalSessions = 0;
  let totalSessionMinutes = 0;
  let totalAlerts = 0;
  let kineStretches = 0;

  const deviationCounts = {
    neck: 0,
    shoulder: 0,
    tilt: 0,
    distance: 0
  };

  const dayScores = [];

  dates.forEach(dateKey => {
    const logs = logsByDate[dateKey] || [];
    const dateObj = new Date(dateKey + 'T12:00:00');
    
    // Label jour court (ex: Lun, Mar / Mon, Tue)
    const dayLabel = dateObj.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'short'
    });
    // Format court jour/mois (ex: 18/10)
    const dateShort = dateObj.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'numeric'
    });

    let dayScoreSum = 0;
    let dayScoreCount = 0;
    let daySessions = 0;
    let dayAlerts = 0;

    logs.forEach(log => {
      if (log.type === 'alert') {
        dayAlerts++;
        totalAlerts++;
        const r = (log.reason || log.title || '').toLowerCase();
        if (r.includes('nuque') || r.includes('neck') || r.includes('cervic')) {
          deviationCounts.neck++;
        } else if (r.includes('épaule') || r.includes('shoulder') || r.includes('trapèze')) {
          deviationCounts.shoulder++;
        } else if (r.includes('inclin') || r.includes('tilt')) {
          deviationCounts.tilt++;
        } else if (r.includes('distance') || r.includes('écran') || r.includes('screen')) {
          deviationCounts.distance++;
        }
      } else if (log.type === 'summary' || log.type === 'cycle_end') {
        daySessions++;
        totalSessions++;
        totalSessionMinutes += 30; // standard session
        if (typeof log.score === 'number' && log.score > 0) {
          dayScoreSum += log.score;
          dayScoreCount++;
          grandTotalScoreSum += log.score;
          grandTotalScoreCount++;
        }
      } else if (log.type === 'kine_exercise' || log.type === 'stretch') {
        kineStretches++;
      }
    });

    const avgScoreForDay = dayScoreCount > 0 ? Math.round(dayScoreSum / dayScoreCount) : null;
    if (avgScoreForDay !== null) {
      dayScores.push(avgScoreForDay);
    }

    daysData.push({
      dateKey,
      dayLabel: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1).replace('.', ''),
      dateShort,
      score: avgScoreForDay,
      sessions: daySessions,
      alerts: dayAlerts
    });
  });

  // Calcul du score moyen global
  const averageNeutralScore = grandTotalScoreCount > 0
    ? Math.round(grandTotalScoreSum / grandTotalScoreCount)
    : (dayScores.length > 0 ? Math.round(dayScores.reduce((a, b) => a + b, 0) / dayScores.length) : null);

  // Calcul de la tendance (comparaison 1ère moitié vs 2nde moitié de période)
  let trendDelta = 0;
  if (dayScores.length >= 2) {
    const half = Math.floor(dayScores.length / 2);
    const firstHalf = dayScores.slice(0, half);
    const secondHalf = dayScores.slice(half);

    const avg1 = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avg2 = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    trendDelta = Math.round(avg2 - avg1);
  }

  // Distribution des dérives en pourcentage
  const totalDeviations = deviationCounts.neck + deviationCounts.shoulder + deviationCounts.tilt + deviationCounts.distance;
  const deviationPct = {
    neck: totalDeviations > 0 ? Math.round((deviationCounts.neck / totalDeviations) * 100) : 0,
    shoulder: totalDeviations > 0 ? Math.round((deviationCounts.shoulder / totalDeviations) * 100) : 0,
    tilt: totalDeviations > 0 ? Math.round((deviationCounts.tilt / totalDeviations) * 100) : 0,
    distance: totalDeviations > 0 ? Math.round((deviationCounts.distance / totalDeviations) * 100) : 0
  };

  // Identification de la dérive principale
  let dominantZone = null;
  let maxCount = 0;
  for (const [zone, count] of Object.entries(deviationCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantZone = zone;
    }
  }

  return {
    daysData,
    averageNeutralScore,
    trendDelta,
    totalSessions,
    totalSessionMinutes,
    totalAlerts,
    kineStretches,
    deviationCounts,
    deviationPct,
    totalDeviations,
    dominantZone
  };
}

/**
 * Nettoie toutes les clés de logs multi-jours dans localStorage.
 * @param {number} maxDaysLookback
 */
export function clearAllMultiDayHistory(maxDaysLookback = 60) {
  const dates = getMultiDayKeys(maxDaysLookback);
  dates.forEach(dateKey => {
    localStorage.removeItem('ergovision_daily_log_' + dateKey);
  });
}
