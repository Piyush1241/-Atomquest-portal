// src/utils/scoring.js
// Pure functions — no React, no side-effects.

/**
 * Compute a 0-100 score for a single goal.
 * Returns null if actual is empty or inputs are unparseable.
 */
export function computeScore(uom, target, actual) {
  if (actual === null || actual === undefined || actual === '') return null;

  const isMax   = uom.endsWith('-max');
  const baseUom = isMax ? uom.replace('-max', '') : uom;

  if (baseUom === 'Timeline') {
    const targetDate = new Date(target);
    const actualDate = new Date(actual);
    if (isNaN(targetDate) || isNaN(actualDate)) return null;
    const diffDays = Math.round((actualDate - targetDate) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0)  return 100;
    if (diffDays <= 7)  return 80;
    if (diffDays <= 30) return 50;
    return 0;
  }

  const t = parseFloat(target);
  const a = parseFloat(actual);
  if (isNaN(t) || isNaN(a)) return null;

  switch (baseUom) {
    case '%':
    case 'Numeric':
      if (isMax) {
        if (a === 0) return 100;
        return Math.min(100, Math.round((t / a) * 100));
      }
      return Math.min(100, Math.round((a / t) * 100));
    case 'Zero-based':
      return a === 0 ? 100 : 0;
    default:
      return null;
  }
}

/**
 * Compute weighted-average score across all goals that have scores.
 * Returns null if no goals have been scored yet.
 */
export function computeWeightedScore(goals) {
  const scored = goals
    .map(g => ({ score: computeScore(g.uom, g.target, g.actualAchievement), weight: g.weightage }))
    .filter(d => d.score !== null);

  const totalWeight = scored.reduce((s, d) => s + d.weight, 0);
  if (totalWeight === 0) return null;

  return Math.round(scored.reduce((s, d) => s + d.score * d.weight, 0) / totalWeight);
}
