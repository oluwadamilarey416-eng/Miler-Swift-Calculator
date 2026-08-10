import { NumberFormatMode } from '../types';
import { gcdTwo, sanitizeNumber } from './evaluator';

export function decimalToFraction(val: number, maxDenominator: number = 10000): { num: number; den: number; str: string } | null {
  if (!isFinite(val) || Number.isNaN(val)) return null;

  const sign = val < 0 ? -1 : 1;
  const absolute = Math.abs(val);

  // If integer
  if (Number.isInteger(absolute)) {
    return { num: val, den: 1, str: `${val}` };
  }

  // Continued fraction approximation
  let m00 = 1, m01 = 0, m10 = 0, m11 = 1;
  let x = absolute;

  for (let i = 0; i < 30; i++) {
    const a = Math.floor(x);
    const m00_next = a * m00 + m01;
    const m10_next = a * m10 + m11;

    if (m10_next > maxDenominator) break;

    m01 = m00;
    m00 = m00_next;
    m11 = m10;
    m10 = m10_next;

    const diff = x - a;
    if (diff < 1e-12) break;
    x = 1 / diff;
  }

  const num = m00 * sign;
  const den = m10;

  if (Math.abs(num / den - val) > 1e-5) {
    // Fraction approximation isn't accurate enough
    return null;
  }

  // Simplify
  const divisor = gcdTwo(Math.abs(num), den);
  const simNum = num / divisor;
  const simDen = den / divisor;

  return {
    num: simNum,
    den: simDen,
    str: `${simNum}/${simDen}`
  };
}

export function formatResult(value: number, mode: NumberFormatMode = 'STD'): string {
  if (Number.isNaN(value)) return 'Invalid calculation';
  if (!isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';

  const clean = sanitizeNumber(value);

  if (mode === 'FRAC') {
    const frac = decimalToFraction(clean);
    if (frac) return frac.str;
    // Fallback to standard
  }

  if (mode === 'SCI') {
    return clean.toExponential(6).replace('e+', 'e');
  }

  if (mode === 'ENG') {
    if (clean === 0) return '0';
    const exp = Math.floor(Math.log10(Math.abs(clean)));
    const engExp = Math.floor(exp / 3) * 3;
    const mantissa = clean / Math.pow(10, engExp);
    return `${sanitizeNumber(mantissa)} × 10^${engExp}`;
  }

  // Standard formatting
  if (Math.abs(clean) >= 1e12 || (Math.abs(clean) < 1e-7 && clean !== 0)) {
    return clean.toExponential(6).replace('e+', 'e');
  }

  // Handle high precision without unnecessary trailing zeros
  const str = clean.toString();
  if (str.includes('.')) {
    // If long decimal
    const parts = str.split('.');
    if (parts[1].length > 8) {
      return sanitizeNumber(parseFloat(clean.toFixed(8))).toString();
    }
  }

  return str;
}
