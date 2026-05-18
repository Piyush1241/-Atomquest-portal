// src/utils/csv.js
import { computeScore } from './scoring';

const HEADERS = [
  'Employee ID', 'Employee Name', 'Sheet Status',
  'Thrust Area', 'Goal Title', 'Description', 'UoM', 'Target',
  'Actual Achievement', 'Score (%)', 'Goal Status', 'Weightage (%)',
  'Q1 Comment', 'Q2 Comment', 'Q3 Comment', 'Q4 Comment',
];

function escapeCell(cell) {
  const val = String(cell).replace(/"/g, '""');
  return val.includes(',') || val.includes('\n') || val.includes('"') ? `"${val}"` : val;
}

function sheetToRows(sheet) {
  return sheet.goals.map(g => {
    const score = computeScore(g.uom, g.target, g.actualAchievement);
    return [
      sheet.employeeId, sheet.employeeName, sheet.status,
      g.thrustArea, g.title, g.description || '', g.uom, g.target,
      g.actualAchievement ?? '', score !== null ? `${score}%` : '',
      g.goalStatus || 'Not Started', `${g.weightage}%`,
      sheet.checkInComments?.Q1 || '', sheet.checkInComments?.Q2 || '',
      sheet.checkInComments?.Q3 || '', sheet.checkInComments?.Q4 || '',
    ];
  });
}

function download(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildCSV(rows) {
  return [HEADERS, ...rows]
    .map(row => row.map(escapeCell).join(','))
    .join('\n');
}

export function exportSheetToCSV(sheet) {
  const filename = `${sheet.employeeId}_${sheet.employeeName.replace(/\s+/g, '_')}_goals.csv`;
  download(buildCSV(sheetToRows(sheet)), filename);
}

export function exportAllSheetsToCSV(sheets) {
  const rows = sheets.flatMap(sheetToRows);
  const filename = `atomquest_all_goals_${new Date().toISOString().slice(0, 10)}.csv`;
  download(buildCSV(rows), filename);
}
