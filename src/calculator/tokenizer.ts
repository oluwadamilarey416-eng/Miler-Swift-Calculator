export type TokenType = 
  | 'NUMBER'
  | 'OPERATOR'
  | 'FUNCTION'
  | 'CONSTANT'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'PERCENT';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'csc', 'sec', 'cot',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'log', 'ln', 'log2', 'sqrt', 'cbrt', 'abs', 'floor', 'ceil',
  'fact', 'npr', 'ncr', 'gcd', 'lcm', 'mod', 'rad', 'deg', 'exp'
]);

const CONSTANTS = new Set(['pi', 'π', 'e', 'phi', 'φ', 'ans']);

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const expr = expression.trim();

  while (i < expr.length) {
    const char = expr[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Number literal (e.g. 3.14159 or 1.2e-3)
    if (/[0-9.]/.test(char)) {
      let numStr = '';
      const start = i;
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        numStr += expr[i];
        i++;
      }
      // Check for scientific exponent in number literal like 1e5 or 2.5e-3
      if (i < expr.length && expr[i].toLowerCase() === 'e' && /[0-9+-]/.test(expr[i + 1] || '')) {
        // Only if followed by sign or digit
        if (expr[i+1] === '+' || expr[i+1] === '-' || /[0-9]/.test(expr[i+1])) {
          numStr += expr[i]; // 'e'
          i++;
          if (expr[i] === '+' || expr[i] === '-') {
            numStr += expr[i];
            i++;
          }
          while (i < expr.length && /[0-9]/.test(expr[i])) {
            numStr += expr[i];
            i++;
          }
        }
      }
      tokens.push({ type: 'NUMBER', value: numStr, position: start });
      continue;
    }

    // Parentheses & Commas & Percentage
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(', position: i });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')', position: i });
      i++;
      continue;
    }
    if (char === ',') {
      tokens.push({ type: 'COMMA', value: ',', position: i });
      i++;
      continue;
    }
    if (char === '%') {
      tokens.push({ type: 'PERCENT', value: '%', position: i });
      i++;
      continue;
    }

    // Constants & Functions & Operators
    // Operators
    if (['+', '-', '*', '×', '/', '÷', '^', '!', '√', '∛'].includes(char)) {
      let opVal = char;
      if (char === '×') opVal = '*';
      if (char === '÷') opVal = '/';
      tokens.push({ type: 'OPERATOR', value: opVal, position: i });
      i++;
      continue;
    }

    // Identifiers (words like sin, pi, ans, sqrt, etc) or special symbols (π, φ)
    if (/[a-zA-Z_πφ]/.test(char)) {
      let id = '';
      const start = i;
      while (i < expr.length && /[a-zA-Z0-9_πφ]/.test(expr[i])) {
        id += expr[i];
        i++;
      }

      const lowerId = id.toLowerCase();

      if (CONSTANTS.has(lowerId) || id === 'π' || id === 'φ') {
        let norm = lowerId;
        if (id === 'π') norm = 'pi';
        if (id === 'φ') norm = 'phi';
        tokens.push({ type: 'CONSTANT', value: norm, position: start });
      } else if (FUNCTIONS.has(lowerId)) {
        tokens.push({ type: 'FUNCTION', value: lowerId, position: start });
      } else {
        // Unknown function or symbol
        tokens.push({ type: 'FUNCTION', value: lowerId, position: start });
      }
      continue;
    }

    // If reached here, unknown character
    throw new Error(`Unexpected character '${char}' at position ${i + 1}`);
  }

  // Insert implicit multiplication tokens where needed:
  // NUMBER CONSTANT -> NUMBER * CONSTANT  e.g. 2pi
  // NUMBER FUNCTION -> NUMBER * FUNCTION  e.g. 5sin(30)
  // NUMBER LPAREN -> NUMBER * LPAREN      e.g. 2(3)
  // RPAREN NUMBER -> RPAREN * NUMBER      e.g. (2)3
  // RPAREN LPAREN -> RPAREN * LPAREN      e.g. (2)(3)
  // RPAREN FUNCTION -> RPAREN * FUNCTION  e.g. (2)sin(30)
  // CONSTANT LPAREN -> CONSTANT * LPAREN  e.g. pi(2)
  // CONSTANT FUNCTION -> CONSTANT * FUNCTION
  // PERCENT NUMBER/CONSTANT/FUNCTION/LPAREN
  const processed: Token[] = [];
  for (let j = 0; j < tokens.length; j++) {
    const curr = tokens[j];
    const prev = processed[processed.length - 1];

    if (prev) {
      const needsMult = (
        (prev.type === 'NUMBER' && (curr.type === 'CONSTANT' || curr.type === 'FUNCTION' || curr.type === 'LPAREN')) ||
        (prev.type === 'PERCENT' && (curr.type === 'NUMBER' || curr.type === 'CONSTANT' || curr.type === 'FUNCTION' || curr.type === 'LPAREN')) ||
        (prev.type === 'RPAREN' && (curr.type === 'NUMBER' || curr.type === 'CONSTANT' || curr.type === 'FUNCTION' || curr.type === 'LPAREN')) ||
        (prev.type === 'CONSTANT' && (curr.type === 'NUMBER' || curr.type === 'CONSTANT' || curr.type === 'FUNCTION' || curr.type === 'LPAREN'))
      );

      if (needsMult) {
        processed.push({ type: 'OPERATOR', value: '*', position: curr.position });
      }
    }

    processed.push(curr);
  }

  return processed;
}
