export type CalcMode = 
  | 'scientific' 
  | 'equation' 
  | 'statistics' 
  | 'programmer' 
  | 'converter'
  | 'advanced_math';

export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

export type NumberFormatMode = 'STD' | 'SCI' | 'ENG' | 'FRAC';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: CalcMode;
  angleUnit?: AngleUnit;
}

export interface UnitCategory {
  id: string;
  name: string;
  units: {
    id: string;
    name: string;
    symbol: string;
    ratioToBase: number; // For linear conversions: base value = value * ratio
    offset?: number;     // For temperature: base value = (value + offset) * ratio
  }[];
}

export interface QuadraticResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  root1: { real: number; imag: number };
  root2: { real: number; imag: number };
  vertex: { x: number; y: number };
  steps: string[];
}

export interface LinearSystemResult {
  x: number;
  y: number;
  z?: number;
  determinant: number;
  isSolvable: boolean;
  message?: string;
  steps: string[];
}

export interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  varianceSample: number;
  variancePopulation: number;
  stdDevSample: number;
  stdDevPopulation: number;
  sortedList: number[];
}

export interface PrimeFactorResult {
  number: number;
  isPrime: boolean;
  factors: { prime: number; exponent: number }[];
  allDivisors: number[];
}

export interface GCDLCMResult {
  numbers: number[];
  gcd: number;
  lcm: number;
  steps: string[];
}

export type Radix = 2 | 8 | 10 | 16;
export type BitWordSize = 8 | 16 | 32 | 64;
