import { LinearSystemResult, QuadraticResult } from '../../types';

export function solveQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) {
    throw new Error("'a' cannot be 0 in a quadratic equation (it would be a linear equation).");
  }

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);

  const steps: string[] = [
    `Equation: ${a}x² + ${b >= 0 ? '+' : ''}${b}x + ${c >= 0 ? '+' : ''}${c} = 0`,
    `Step 1: Identify coefficients -> a = ${a}, b = ${b}, c = ${c}`,
    `Step 2: Calculate Discriminant (Δ = b² - 4ac)`,
    `Δ = (${b})² - 4(${a})(${c}) = ${discriminant}`
  ];

  let root1 = { real: 0, imag: 0 };
  let root2 = { real: 0, imag: 0 };

  if (discriminant > 0) {
    const sqrtD = Math.sqrt(discriminant);
    root1.real = (-b + sqrtD) / (2 * a);
    root2.real = (-b - sqrtD) / (2 * a);

    steps.push(`Δ > 0: Two distinct real roots.`);
    steps.push(`x₁ = (-b + √Δ) / 2a = (${-b} + ${sqrtD.toFixed(4)}) / ${2 * a} = ${root1.real.toFixed(4)}`);
    steps.push(`x₂ = (-b - √Δ) / 2a = (${-b} - ${sqrtD.toFixed(4)}) / ${2 * a} = ${root2.real.toFixed(4)}`);
  } else if (discriminant === 0) {
    root1.real = -b / (2 * a);
    root2.real = root1.real;

    steps.push(`Δ = 0: One repeated real root.`);
    steps.push(`x₁ = x₂ = -b / 2a = ${-b} / ${2 * a} = ${root1.real.toFixed(4)}`);
  } else {
    const sqrtD = Math.sqrt(-discriminant);
    const realPart = -b / (2 * a);
    const imagPart = sqrtD / (2 * a);

    root1 = { real: realPart, imag: imagPart };
    root2 = { real: realPart, imag: -imagPart };

    steps.push(`Δ < 0: Two complex conjugate roots.`);
    steps.push(`x₁ = ${realPart.toFixed(4)} + ${Math.abs(imagPart).toFixed(4)}i`);
    steps.push(`x₂ = ${realPart.toFixed(4)} - ${Math.abs(imagPart).toFixed(4)}i`);
  }

  steps.push(`Vertex of parabola: (${vertexX.toFixed(4)}, ${vertexY.toFixed(4)})`);

  return {
    a, b, c,
    discriminant,
    root1,
    root2,
    vertex: { x: vertexX, y: vertexY },
    steps
  };
}

export function solveLinearSingle(expr: string): { x: number; steps: string[] } {
  // Handles equations like "2x + 5 = 15" or "3x - 9 = 0" or "4x = 20"
  const parts = expr.split('=').map(p => p.trim());
  if (parts.length !== 2) {
    throw new Error('Equation must contain exactly one equals sign (=)');
  }

  const steps: string[] = [`Original equation: ${expr}`];

  // Quick parser for single linear equation ax + b = c
  // We can simplify left side - right side = 0
  // Or parse terms
  // Simple regex parser for linear form ax + b = c
  const leftStr = parts[0];
  const rightStr = parts[1];

  // Helper to parse side expression into a*x + b
  function parseSide(side: string) {
    let a = 0;
    let b = 0;
    // Replace spaces and normalize signs
    const normalized = side.replace(/\s+/g, '').replace(/-/g, '+-');
    const terms = normalized.split('+').filter(Boolean);

    for (const term of terms) {
      if (term.includes('x')) {
        const coefStr = term.replace('x', '');
        let coef = 1;
        if (coefStr === '' || coefStr === '+') coef = 1;
        else if (coefStr === '-') coef = -1;
        else coef = parseFloat(coefStr);

        if (Number.isNaN(coef)) throw new Error(`Invalid x term '${term}'`);
        a += coef;
      } else {
        const num = parseFloat(term);
        if (Number.isNaN(num)) throw new Error(`Invalid number term '${term}'`);
        b += num;
      }
    }
    return { a, b };
  }

  const left = parseSide(leftStr);
  const right = parseSide(rightStr);

  // (left.a)x + left.b = (right.a)x + right.b
  // => (left.a - right.a)x = right.b - left.b
  const totalA = left.a - right.a;
  const totalB = right.b - left.b;

  if (totalA === 0) {
    if (totalB === 0) {
      throw new Error('Infinite solutions (identity equation)');
    } else {
      throw new Error('No solution (contradiction equation)');
    }
  }

  steps.push(`Combine x terms to left side: ${totalA}x`);
  steps.push(`Combine constant terms to right side: ${totalB}`);

  const x = totalB / totalA;
  steps.push(`Divide both sides by ${totalA}: x = ${totalB} / ${totalA} = ${x}`);

  return { x, steps };
}

export function solveLinear2x2(
  a1: number, b1: number, c1: number,
  a2: number, b2: number, c2: number
): LinearSystemResult {
  // System:
  // a1*x + b1*y = c1
  // a2*x + b2*y = c2
  const det = a1 * b2 - a2 * b1;
  const steps: string[] = [
    `System of Equations:`,
    `1) ${a1}x + ${b1}y = ${c1}`,
    `2) ${a2}x + ${b2}y = ${c2}`,
    `Step 1: Calculate Main Determinant D = (a1·b2) - (a2·b1)`,
    `D = (${a1}×${b2}) - (${a2}×${b1}) = ${det}`
  ];

  if (det === 0) {
    return {
      x: 0,
      y: 0,
      determinant: 0,
      isSolvable: false,
      message: 'System has no unique solution (lines are parallel or coincident).',
      steps
    };
  }

  const detX = c1 * b2 - c2 * b1;
  const detY = a1 * c2 - a2 * c1;

  const x = detX / det;
  const y = detY / det;

  steps.push(`Step 2: Calculate Dx = (c1·b2) - (c2·b1) = ${detX}`);
  steps.push(`Step 3: Calculate Dy = (a1·c2) - (a2·c1) = ${detY}`);
  steps.push(`Step 4: x = Dx / D = ${detX} / ${det} = ${x}`);
  steps.push(`Step 5: y = Dy / D = ${detY} / ${det} = ${y}`);

  return {
    x,
    y,
    determinant: det,
    isSolvable: true,
    steps
  };
}
