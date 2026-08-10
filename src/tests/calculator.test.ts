import { evaluateExpression } from '../calculator/evaluator';
import { solveQuadratic, solveLinearSingle } from '../features/equations/equationSolver';
import { calculateStatistics } from '../features/statistics/statsEngine';
import { executeBitwise } from '../features/programmer/programmerEngine';
import { convertUnit, UNIT_CATEGORIES } from '../features/converter/unitConverter';
import { checkPrimeAndFactorize } from '../calculator/primeAndFactors';

export function runTestSuite(): { passed: number; failed: number; log: string[] } {
  let passed = 0;
  let failed = 0;
  const log: string[] = [];

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      passed++;
      log.push(`[PASS] ${testName}`);
    } else {
      failed++;
      log.push(`[FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
    }
  }

  try {
    // Basic Arithmetic & Precedence
    assert(evaluateExpression('2 + 2') === 4, 'Basic addition 2+2=4');
    assert(evaluateExpression('10 - 3') === 7, 'Basic subtraction 10-3=7');
    assert(evaluateExpression('5 * 6') === 30, 'Basic multiplication 5*6=30');
    assert(evaluateExpression('20 / 4') === 5, 'Basic division 20/4=5');
    assert(evaluateExpression('2 + 3 * 4') === 14, 'Operator precedence 2+3*4=14 (not 20)');
    assert(evaluateExpression('(2 + 3) * 4') === 20, 'Parentheses precedence (2+3)*4=20');

    // Powers & Roots & Factorials
    assert(evaluateExpression('2^10') === 1024, 'Exponent 2^10=1024');
    assert(evaluateExpression('sqrt(25)') === 5, 'Square root sqrt(25)=5');
    assert(evaluateExpression('5!') === 120, 'Factorial 5!=120');

    // Trigonometry (Deg)
    assert(Math.abs(evaluateExpression('sin(30)', { angleUnit: 'DEG' }) - 0.5) < 1e-6, 'sin(30deg) = 0.5');
    assert(Math.abs(evaluateExpression('cos(60)', { angleUnit: 'DEG' }) - 0.5) < 1e-6, 'cos(60deg) = 0.5');

    // Constants & Implicit Multiplication
    assert(Math.abs(evaluateExpression('2pi') - 2 * Math.PI) < 1e-6, 'Implicit multiplication 2pi');

    // Error handling
    let divZeroCaught = false;
    try {
      evaluateExpression('10 / 0');
    } catch {
      divZeroCaught = true;
    }
    assert(divZeroCaught, 'Division by zero throws error');

    // Quadratic Solver
    const quad = solveQuadratic(1, -5, 6);
    assert(quad.root1.real === 3 && quad.root2.real === 2, 'Quadratic x²-5x+6=0 roots x=3, x=2');

    // Linear Solver
    const lin = solveLinearSingle('2x + 5 = 15');
    assert(lin.x === 5, 'Linear equation 2x+5=15 x=5');

    // Statistics Engine
    const stats = calculateStatistics([10, 20, 30, 40, 50]);
    assert(stats.mean === 30, 'Statistics mean [10,20,30,40,50] = 30');
    assert(stats.median === 30, 'Statistics median [10,20,30,40,50] = 30');

    // Programmer Bitwise
    const bitAnd = executeBitwise(0b1100n, 'AND', 0b1010n, 32);
    assert(bitAnd === 0b1000n, 'Bitwise 1100 AND 1010 = 1000');

    // Unit Converter
    const lenCat = UNIT_CATEGORIES.find(c => c.id === 'length')!;
    const converted = convertUnit(1, lenCat, 'm', 'cm');
    assert(converted.result === 100, 'Unit conversion 1m = 100cm');

    // Prime Factorization
    const prime120 = checkPrimeAndFactorize(120);
    assert(!prime120.isPrime, '120 is composite');
    assert(prime120.factors.find(f => f.prime === 2)?.exponent === 3, '120 prime factor 2^3');

  } catch (err) {
    log.push(`[CRITICAL TEST ERROR]: ${err}`);
  }

  return { passed, failed, log };
}
