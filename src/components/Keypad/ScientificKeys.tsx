import { useState } from 'react';
import { KeyButton } from './KeyButton';

interface ScientificKeysProps {
  onInsertText: (text: string) => void;
  onInsertFunction: (fnName: string) => void;
}

export function ScientificKeys({ onInsertText, onInsertFunction }: ScientificKeysProps) {
  const [isShift, setIsShift] = useState(false);
  const [isHyp, setIsHyp] = useState(false);

  return (
    <div className="space-y-2">
      {/* Shift / Hyp Toggle Controls */}
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          id="btn-shift-2nd"
          onClick={() => setIsShift(!isShift)}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            isShift
              ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border-white/10'
          }`}
        >
          {isShift ? '2nd [ACTIVE]' : '2nd / Shift'}
        </button>

        <button
          type="button"
          id="btn-hyp-toggle"
          onClick={() => setIsHyp(!isHyp)}
          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            isHyp
              ? 'bg-white/20 text-white border-white/30 shadow-xs'
              : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border-white/10'
          }`}
        >
          {isHyp ? 'hyp [ACTIVE]' : 'hyp'}
        </button>
      </div>

      {/* Grid of Scientific Function Keys */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
        
        {/* Row 1: Trigonometry */}
        <KeyButton
          variant="function"
          label={isShift ? (isHyp ? 'asinh' : 'sin⁻¹') : (isHyp ? 'sinh' : 'sin')}
          onClick={() => {
            if (isShift) onInsertFunction(isHyp ? 'asinh' : 'asin');
            else onInsertFunction(isHyp ? 'sinh' : 'sin');
          }}
        />
        <KeyButton
          variant="function"
          label={isShift ? (isHyp ? 'acosh' : 'cos⁻¹') : (isHyp ? 'cosh' : 'cos')}
          onClick={() => {
            if (isShift) onInsertFunction(isHyp ? 'acosh' : 'acos');
            else onInsertFunction(isHyp ? 'cosh' : 'cos');
          }}
        />
        <KeyButton
          variant="function"
          label={isShift ? (isHyp ? 'atanh' : 'tan⁻¹') : (isHyp ? 'tanh' : 'tan')}
          onClick={() => {
            if (isShift) onInsertFunction(isHyp ? 'atanh' : 'atan');
            else onInsertFunction(isHyp ? 'tanh' : 'tan');
          }}
        />
        <KeyButton
          variant="function"
          label={isShift ? '10ˣ' : 'log'}
          onClick={() => {
            if (isShift) onInsertText('10^(');
            else onInsertFunction('log');
          }}
        />
        <KeyButton
          variant="function"
          label={isShift ? 'eˣ' : 'ln'}
          onClick={() => {
            if (isShift) onInsertText('e^(');
            else onInsertFunction('ln');
          }}
        />

        {/* Row 2: Powers & Roots */}
        <KeyButton
          variant="function"
          label={isShift ? 'x³' : 'x²'}
          onClick={() => onInsertText(isShift ? '^3' : '^2')}
        />
        <KeyButton
          variant="function"
          label={isShift ? 'ⁿ√x' : 'xʸ'}
          onClick={() => onInsertText(isShift ? '^(1/' : '^')}
        />
        <KeyButton
          variant="function"
          label={isShift ? '∛x' : '√x'}
          onClick={() => onInsertFunction(isShift ? 'cbrt' : 'sqrt')}
        />
        <KeyButton
          variant="function"
          label={isShift ? '2ˣ' : 'log₂'}
          onClick={() => {
            if (isShift) onInsertText('2^(');
            else onInsertFunction('log2');
          }}
        />
        <KeyButton
          variant="function"
          label="1/x"
          onClick={() => onInsertText('1/(')}
        />

        {/* Row 3: Constants & Probability */}
        <KeyButton
          variant="function"
          label="π"
          onClick={() => onInsertText('π')}
        />
        <KeyButton
          variant="function"
          label="e"
          onClick={() => onInsertText('e')}
        />
        <KeyButton
          variant="function"
          label="φ"
          onClick={() => onInsertText('φ')}
        />
        <KeyButton
          variant="function"
          label={isShift ? 'nCr' : 'nPr'}
          onClick={() => onInsertFunction(isShift ? 'ncr' : 'npr')}
        />
        <KeyButton
          variant="function"
          label="x!"
          onClick={() => onInsertText('!')}
        />

        {/* Row 4: Advanced Math Functions */}
        <KeyButton
          variant="function"
          label="|x|"
          onClick={() => onInsertFunction('abs')}
        />
        <KeyButton
          variant="function"
          label="mod"
          onClick={() => onInsertFunction('mod')}
        />
        <KeyButton
          variant="function"
          label="gcd"
          onClick={() => onInsertFunction('gcd')}
        />
        <KeyButton
          variant="function"
          label="lcm"
          onClick={() => onInsertFunction('lcm')}
        />
        <KeyButton
          variant="function"
          label="rand"
          onClick={() => onInsertText(Math.random().toFixed(4))}
        />
      </div>
    </div>
  );
}
