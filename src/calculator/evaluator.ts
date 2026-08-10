import { Token, tokenize } from './tokenizer';
import { AngleUnit, NumberFormatMode } from '../types';

export interface EvaluateOptions {
  angleUnit?: AngleUnit;
  ans?: number;
  formatMode?: NumberFormatMode;
}

// Precision helper to fix standard IEEE 754 precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
export function sanitizeNumber(num: number): number {
  if (!isFinite(num) || Number.isNaN(num)) return num;
  // If extremely close to an integer or clean decimal (within 1e-12)
  const rounded = Math.round(num);
  if (Math.abs(num - rounded) < 1e-12) {
    return rounded;
  }
  // Format to 12 decimal places and parse back to strip trailing floating point artifacts
  return parseFloat(num.toPrecision(12));
}

// Factorial calculation
function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial of negative number is undefined');
  if (!Number.isInteger(n)) throw new Error('Factorial is only defined for non-negative integers');
  if (n > 170) throw new Error('Overflow: Factorial result too large');
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// GCD calculation
export function gcdTwo(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// LCM calculation
export function lcmTwo(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  if (a === 0 || b === 0) return 0;
  return (a * b) / gcdTwo(a, b);
}

// nCr combinations
function nCr(n: number, r: number): number {
  n = Math.round(n);
  r = Math.round(r);
  if (r < 0 || r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

// nPr permutations
function nPr(n: number, r: number): number {
  n = Math.round(n);
  r = Math.round(r);
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

// Convert angle to Radians based on mode
function toRadians(angle: number, unit: AngleUnit): number {
  if (unit === 'RAD') return angle;
  if (unit === 'DEG') return (angle * Math.PI) / 180;
  if (unit === 'GRAD') return (angle * Math.PI) / 200;
  return angle;
}

// Convert Radians back to active angle mode
function fromRadians(rad: number, unit: AngleUnit): number {
  if (unit === 'RAD') return rad;
  if (unit === 'DEG') return (rad * 180) / Math.PI;
  if (unit === 'GRAD') return (rad * 200) / Math.PI;
  return rad;
}

// Operator Precedence and Associativity
interface OpInfo {
  precedence: number;
  assoc: 'LEFT' | 'RIGHT';
  unary?: boolean;
}

const OPERATORS: Record<string, OpInfo> = {
  'u+': { precedence: 5, assoc: 'RIGHT', unary: true },
  'u-': { precedence: 5, assoc: 'RIGHT', unary: true },
  '!':  { precedence: 6, assoc: 'LEFT', unary: true }, // postfix factorial
  '^':  { precedence: 4, assoc: 'RIGHT' },
  '*':  { precedence: 3, assoc: 'LEFT' },
  '/':  { precedence: 3, assoc: 'LEFT' },
  '+':  { precedence: 2, assoc: 'LEFT' },
  '-':  { precedence: 2, assoc: 'LEFT' },
};

/**
 * Shunting-Yard Algorithm to convert Tokens into RPN (Reverse Polish Notation)
 */
export function parseToRPN(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : null;

    if (token.type === 'NUMBER' || token.type === 'CONSTANT') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'PERCENT') {
      outputQueue.push(token);
    } else if (token.type === 'COMMA') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new Error('Mismatched parenthesis or comma error');
      }
    } else if (token.type === 'OPERATOR') {
      let opVal = token.value;

      // Handle unary plus and minus
      const isUnary =
        !prev ||
        prev.type === 'OPERATOR' ||
        prev.type === 'LPAREN' ||
        prev.type === 'COMMA';

      if (isUnary && (opVal === '+' || opVal === '-')) {
        opVal = opVal === '+' ? 'u+' : 'u-';
      }

      const tokenOpInfo = OPERATORS[opVal] || { precedence: 1, assoc: 'LEFT' };

      // Handle factorial ! postfix operator directly
      if (opVal === '!') {
        outputQueue.push({ ...token, value: '!' });
        continue;
      }

      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'LPAREN') break;

        let topPrecedence = 0;
        let topAssoc = 'LEFT';

        if (top.type === 'OPERATOR') {
          const topOp = OPERATORS[top.value] || { precedence: 1, assoc: 'LEFT' };
          topPrecedence = topOp.precedence;
          topAssoc = topOp.assoc;
        } else if (top.type === 'FUNCTION') {
          topPrecedence = 5; // functions have high precedence
        }

        if (
          (tokenOpInfo.assoc === 'LEFT' && tokenOpInfo.precedence <= topPrecedence) ||
          (tokenOpInfo.assoc === 'RIGHT' && tokenOpInfo.precedence < topPrecedence)
        ) {
          outputQueue.push(operatorStack.pop()!);
        } else {
          break;
        }
      }

      operatorStack.push({ ...token, value: opVal });
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new Error('Mismatched parentheses');
      }
      operatorStack.pop(); // Pop LPAREN

      // If top of stack is a function, pop it to output queue
      if (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === 'FUNCTION'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

/**
 * Evaluate RPN Token Queue
 */
export function evaluateRPN(rpn: Token[], options: EvaluateOptions = {}): number {
  const angleUnit = options.angleUnit || 'DEG';
  const ans = options.ans !== undefined ? options.ans : 0;
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const val = parseFloat(token.value);
      if (Number.isNaN(val)) throw new Error(`Invalid number: ${token.value}`);
      stack.push(val);
    } else if (token.type === 'CONSTANT') {
      switch (token.value) {
        case 'pi':
          stack.push(Math.PI);
          break;
        case 'e':
          stack.push(Math.E);
          break;
        case 'phi':
          stack.push(1.618033988749895);
          break;
        case 'ans':
          stack.push(ans);
          break;
        default:
          throw new Error(`Unknown constant '${token.value}'`);
      }
    } else if (token.type === 'PERCENT') {
      if (stack.length === 0) throw new Error('Invalid percentage operation');
      const val = stack.pop()!;
      stack.push(val / 100);
    } else if (token.type === 'OPERATOR') {
      const op = token.value;

      if (op === 'u+') {
        // Unary plus: no-op
        continue;
      }
      if (op === 'u-') {
        if (stack.length < 1) throw new Error('Missing operand for negative operator');
        const val = stack.pop()!;
        stack.push(-val);
        continue;
      }
      if (op === '!') {
        if (stack.length < 1) throw new Error('Missing operand for factorial');
        const val = stack.pop()!;
        stack.push(factorial(val));
        continue;
      }

      // Binary operators require 2 operands
      if (stack.length < 2) throw new Error(`Missing operands for operator '${op}'`);
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (op) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          stack.push(a / b);
          break;
        case '^':
          if (a === 0 && b < 0) throw new Error('Division by zero in exponent');
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unsupported operator '${op}'`);
      }
    } else if (token.type === 'FUNCTION') {
      const fn = token.value;

      // Handle 2-argument functions (e.g., nPr, nCr, gcd, lcm, mod)
      if (['npr', 'ncr', 'gcd', 'lcm', 'mod', 'log'].includes(fn)) {
        // log base n: if 2 args on stack, top is base, second is x. If 1 arg, base 10
        if (fn === 'log') {
          // Check stack size. Single-arg log is handled below if stack has 1 or base isn't separate
          // Let's standardise: if 2 args supplied (e.g. log(100, 10)), evaluate
        }
      }

      if (fn === 'npr' || fn === 'ncr' || fn === 'gcd' || fn === 'lcm' || fn === 'mod') {
        if (stack.length < 2) throw new Error(`Function ${fn} requires two arguments`);
        const b = stack.pop()!;
        const a = stack.pop()!;
        if (fn === 'npr') stack.push(nPr(a, b));
        else if (fn === 'ncr') stack.push(nCr(a, b));
        else if (fn === 'gcd') stack.push(gcdTwo(a, b));
        else if (fn === 'lcm') stack.push(lcmTwo(a, b));
        else if (fn === 'mod') {
          if (b === 0) throw new Error('Modulo by zero');
          stack.push(a % b);
        }
        continue;
      }

      // 1-argument functions
      if (stack.length < 1) throw new Error(`Missing argument for function '${fn}'`);
      const x = stack.pop()!;

      switch (fn) {
        case 'sin':
          stack.push(sanitizeNumber(Math.sin(toRadians(x, angleUnit))));
          break;
        case 'cos':
          stack.push(sanitizeNumber(Math.cos(toRadians(x, angleUnit))));
          break;
        case 'tan': {
          const rad = toRadians(x, angleUnit);
          // Check for undefined tan at (k + 0.5) * pi
          if (Math.abs(Math.cos(rad)) < 1e-15) throw new Error('Tangent undefined at this angle');
          stack.push(sanitizeNumber(Math.tan(rad)));
          break;
        }
        case 'asin':
          if (x < -1 || x > 1) throw new Error('Domain error: asin argument must be between -1 and 1');
          stack.push(sanitizeNumber(fromRadians(Math.asin(x), angleUnit)));
          break;
        case 'acos':
          if (x < -1 || x > 1) throw new Error('Domain error: acos argument must be between -1 and 1');
          stack.push(sanitizeNumber(fromRadians(Math.acos(x), angleUnit)));
          break;
        case 'atan':
          stack.push(sanitizeNumber(fromRadians(Math.atan(x), angleUnit)));
          break;
        case 'csc': {
          const sinVal = Math.sin(toRadians(x, angleUnit));
          if (Math.abs(sinVal) < 1e-15) throw new Error('Cosecant undefined');
          stack.push(sanitizeNumber(1 / sinVal));
          break;
        }
        case 'sec': {
          const cosVal = Math.cos(toRadians(x, angleUnit));
          if (Math.abs(cosVal) < 1e-15) throw new Error('Secant undefined');
          stack.push(sanitizeNumber(1 / cosVal));
          break;
        }
        case 'cot': {
          const tanVal = Math.tan(toRadians(x, angleUnit));
          if (Math.abs(tanVal) < 1e-15) throw new Error('Cotangent undefined');
          stack.push(sanitizeNumber(1 / tanVal));
          break;
        }
        case 'sinh':
          stack.push(sanitizeNumber(Math.sinh(x)));
          break;
        case 'cosh':
          stack.push(sanitizeNumber(Math.cosh(x)));
          break;
        case 'tanh':
          stack.push(sanitizeNumber(Math.tanh(x)));
          break;
        case 'asinh':
          stack.push(sanitizeNumber(Math.asinh(x)));
          break;
        case 'acosh':
          if (x < 1) throw new Error('Domain error: acosh requires argument >= 1');
          stack.push(sanitizeNumber(Math.acosh(x)));
          break;
        case 'atanh':
          if (x <= -1 || x >= 1) throw new Error('Domain error: atanh requires argument between -1 and 1');
          stack.push(sanitizeNumber(Math.atanh(x)));
          break;
        case 'log':
          if (x <= 0) throw new Error('Domain error: logarithm of non-positive number');
          stack.push(sanitizeNumber(Math.log10(x)));
          break;
        case 'log2':
          if (x <= 0) throw new Error('Domain error: logarithm of non-positive number');
          stack.push(sanitizeNumber(Math.log2(x)));
          break;
        case 'ln':
          if (x <= 0) throw new Error('Domain error: natural logarithm of non-positive number');
          stack.push(sanitizeNumber(Math.log(x)));
          break;
        case 'sqrt':
          if (x < 0) throw new Error('Domain error: square root of negative number');
          stack.push(sanitizeNumber(Math.sqrt(x)));
          break;
        case 'cbrt':
          stack.push(sanitizeNumber(Math.cbrt(x)));
          break;
        case 'abs':
          stack.push(Math.abs(x));
          break;
        case 'floor':
          stack.push(Math.floor(x));
          break;
        case 'ceil':
          stack.push(Math.ceil(x));
          break;
        case 'exp':
          stack.push(sanitizeNumber(Math.exp(x)));
          break;
        case 'fact':
          stack.push(factorial(x));
          break;
        case 'rad':
          stack.push((x * Math.PI) / 180);
          break;
        case 'deg':
          stack.push((x * 180) / Math.PI);
          break;
        default:
          throw new Error(`Unknown function '${fn}'`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid calculation: syntax error');
  }

  return sanitizeNumber(stack[0]);
}

/**
 * Main evaluation entrypoint
 */
export function evaluateExpression(expression: string, options: EvaluateOptions = {}): number {
  if (!expression || expression.trim() === '') {
    return 0;
  }
  const tokens = tokenize(expression);
  if (tokens.length === 0) return 0;
  const rpn = parseToRPN(tokens);
  return evaluateRPN(rpn, options);
}
