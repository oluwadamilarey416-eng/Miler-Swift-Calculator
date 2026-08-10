import { GCDLCMResult, PrimeFactorResult } from '../types';
import { gcdTwo, lcmTwo } from './evaluator';

export function checkPrimeAndFactorize(n: number): PrimeFactorResult {
  const num = Math.abs(Math.round(n));

  if (num < 2) {
    return {
      number: num,
      isPrime: false,
      factors: [],
      allDivisors: num === 1 ? [1] : []
    };
  }

  // Trial division for prime check
  let isPrime = true;
  const limit = Math.floor(Math.sqrt(num));
  for (let i = 2; i <= limit; i++) {
    if (num % i === 0) {
      isPrime = false;
      break;
    }
  }

  // Prime factors breakdown
  let temp = num;
  const factorMap = new Map<number, number>();

  let d = 2;
  while (d * d <= temp) {
    while (temp % d === 0) {
      factorMap.set(d, (factorMap.get(d) || 0) + 1);
      temp /= d;
    }
    d = d === 2 ? 3 : d + 2;
  }
  if (temp > 1) {
    factorMap.set(temp, (factorMap.get(temp) || 0) + 1);
  }

  const factors = Array.from(factorMap.entries()).map(([prime, exponent]) => ({
    prime,
    exponent
  }));

  // Find all divisors
  const allDivisorsSet = new Set<number>();
  for (let i = 1; i * i <= num; i++) {
    if (num % i === 0) {
      allDivisorsSet.add(i);
      allDivisorsSet.add(num / i);
    }
  }
  const allDivisors = Array.from(allDivisorsSet).sort((a, b) => a - b);

  return {
    number: num,
    isPrime,
    factors,
    allDivisors
  };
}

export function calculateGCDLCM(numbers: number[]): GCDLCMResult {
  const clean = numbers.map(n => Math.abs(Math.round(n))).filter(n => !Number.isNaN(n));

  if (clean.length === 0) {
    return { numbers: [], gcd: 0, lcm: 0, steps: [] };
  }

  let currentGCD = clean[0];
  let currentLCM = clean[0];
  const steps: string[] = [`Input list: [${clean.join(', ')}]`];

  for (let i = 1; i < clean.length; i++) {
    const nextGCD = gcdTwo(currentGCD, clean[i]);
    steps.push(`gcd(${currentGCD}, ${clean[i]}) = ${nextGCD}`);
    currentGCD = nextGCD;

    const nextLCM = lcmTwo(currentLCM, clean[i]);
    steps.push(`lcm(${currentLCM}, ${clean[i]}) = ${nextLCM}`);
    currentLCM = nextLCM;
  }

  return {
    numbers: clean,
    gcd: currentGCD,
    lcm: currentLCM,
    steps
  };
}
