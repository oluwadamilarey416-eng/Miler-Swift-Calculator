import { StatsResult } from '../../types';

export function calculateStatistics(numbers: number[]): StatsResult {
  if (!numbers || numbers.length === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      mode: [],
      min: 0,
      max: 0,
      range: 0,
      varianceSample: 0,
      variancePopulation: 0,
      stdDevSample: 0,
      stdDevPopulation: 0,
      sortedList: []
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / count;

  // Median
  let median = 0;
  const mid = Math.floor(count / 2);
  if (count % 2 === 0) {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    median = sorted[mid];
  }

  // Mode
  const frequencyMap = new Map<number, number>();
  let maxFreq = 0;
  for (const num of sorted) {
    const freq = (frequencyMap.get(num) || 0) + 1;
    frequencyMap.set(num, freq);
    if (freq > maxFreq) {
      maxFreq = freq;
    }
  }

  const mode: number[] = [];
  if (maxFreq > 1) {
    frequencyMap.forEach((freq, key) => {
      if (freq === maxFreq) mode.push(key);
    });
  }

  // Min, Max, Range
  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  // Variance & StdDev
  const sumSquaredDiffs = sorted.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  
  const variancePopulation = sumSquaredDiffs / count;
  const stdDevPopulation = Math.sqrt(variancePopulation);

  const varianceSample = count > 1 ? sumSquaredDiffs / (count - 1) : 0;
  const stdDevSample = Math.sqrt(varianceSample);

  return {
    count,
    sum,
    mean,
    median,
    mode,
    min,
    max,
    range,
    varianceSample,
    variancePopulation,
    stdDevSample,
    stdDevPopulation,
    sortedList: sorted
  };
}
