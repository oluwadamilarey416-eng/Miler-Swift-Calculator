import { BitWordSize, Radix } from '../../types';

export interface BitwiseResult {
  dec: bigint;
  bin: string;
  oct: string;
  hex: string;
}

// Convert BigInt value to padded string representation for specific radix & bit size
export function formatRadix(val: bigint, radix: Radix, bitSize: BitWordSize = 32): string {
  // Apply bitmask for target bit size
  const mask = (1n << BigInt(bitSize)) - 1n;
  const maskedVal = val & mask;

  let str = maskedVal.toString(radix).toUpperCase();

  if (radix === 2) {
    str = str.padStart(bitSize, '0');
    // Group into 4 bits for easy visual reading
    return str.match(/.{1,4}/g)?.join(' ') || str;
  }
  if (radix === 8) {
    const octDigits = Math.ceil(bitSize / 3);
    return str.padStart(octDigits, '0');
  }
  if (radix === 16) {
    const hexDigits = Math.ceil(bitSize / 4);
    return str.padStart(hexDigits, '0');
  }
  // Decimal
  return val.toString(10);
}

// Parse string from specific radix into BigInt
export function parseRadix(input: string, radix: Radix): bigint {
  const clean = input.replace(/\s+/g, '');
  if (!clean || clean === '-') return 0n;

  try {
    if (radix === 10) return BigInt(clean);
    if (radix === 16) return BigInt(`0x${clean}`);
    if (radix === 8) return BigInt(`0o${clean}`);
    if (radix === 2) return BigInt(`0b${clean}`);
  } catch {
    return 0n;
  }
  return 0n;
}

// Bitwise operations
export function executeBitwise(
  val1: bigint,
  op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR' | 'XNOR' | 'LSH' | 'RSH',
  val2?: bigint,
  bitSize: BitWordSize = 32
): bigint {
  const mask = (1n << BigInt(bitSize)) - 1n;
  const a = val1 & mask;
  const b = (val2 || 0n) & mask;

  let result = 0n;

  switch (op) {
    case 'AND':
      result = a & b;
      break;
    case 'OR':
      result = a | b;
      break;
    case 'XOR':
      result = a ^ b;
      break;
    case 'NOT':
      result = ~a;
      break;
    case 'NAND':
      result = ~(a & b);
      break;
    case 'NOR':
      result = ~(a | b);
      break;
    case 'XNOR':
      result = ~(a ^ b);
      break;
    case 'LSH':
      result = a << (b > 64n ? 64n : b);
      break;
    case 'RSH':
      result = a >> (b > 64n ? 64n : b);
      break;
  }

  return result & mask;
}
