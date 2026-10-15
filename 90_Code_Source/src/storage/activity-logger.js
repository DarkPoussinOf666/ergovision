/**
 * ErgoVision AI - Activity Logger & LocalStorage Persistence
 * Manages daily logs, event entries, and CSV export.
 */

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function loadDailyLogs(todayKey = getTodayKey()) {
  try {
    const saved = localStorage.getItem('ergovision_daily_log_' + todayKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn("Échec chargement journal :", err);
  }
  return [];
}

export function saveDailyLogs(logs, todayKey = getTodayKey()) {
  try {
    localStorage.setItem('ergovision_daily_log_' + todayKey, JSON.stringify(logs));
  } catch (err) {
    console.warn("Échec sauvegarde journal :", err);
  }
}

export function clearDailyLogs(todayKey = getTodayKey()) {
  try {
    localStorage.removeItem('ergovision_daily_log_' + todayKey);
  } catch (e) {}
}

export function createCSVContent(logs) {
  let csv = "Heure,Type,Description,Mode,MaintienNeutre%\n";
  logs.forEach(i => {
    const scoreStr = i.score !== null && i.score !== undefined ? `${i.score}%` : "";
    csv += `"${i.time}","${i.type}","${i.title}","${i.mode}","${scoreStr}"\n`;
  });
  return csv;
}

export function downloadCSV(csvContent, filename = `ergovision-journal-${getTodayKey()}.csv`) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
