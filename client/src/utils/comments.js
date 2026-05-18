// src/utils/comments.js
import { QUARTERS } from '../config/constants';

/**
 * Normalises the checkInComments map from MongoDB — strips empties,
 * guards against unexpected shapes (arrays, nulls).
 */
export function safeComments(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out = {};
  for (const q of QUARTERS) {
    const v = raw[q];
    if (typeof v === 'string' && v.trim()) out[q] = v;
  }
  return out;
}
