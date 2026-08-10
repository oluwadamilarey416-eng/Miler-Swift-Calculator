import { useState, useRef, useEffect } from 'react';
import { AngleUnit, NumberFormatMode } from '../../types';
import { Copy, Check, AlertCircle, CornerDownLeft } from 'lucide-react';

interface DisplayScreenProps {
  expression: string;
  setExpression: (val: string | ((prev: string) => string)) => void;
  result: string;
  error: string | null;
  angleUnit: AngleUnit;
  setAngleUnit: (unit: AngleUnit) => void;
  formatMode: NumberFormatMode;
  setFormatMode: (mode: NumberFormatMode) => void;
  memoryVal: number;
  onEvaluate: () => void;
}

export function DisplayScreen({
  expression,
  setExpression,
  result,
  error,
  angleUnit,
  setAngleUnit,
  formatMode,
  setFormatMode,
  memoryVal,
  onEvaluate
}: DisplayScreenProps) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check parenthesis count balance
  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  const parenDiff = openCount - closeCount;

  const handleCopy = () => {
    const textToCopy = result || expression;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Keep input focused when clicking display
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Scroll input to right when expression changes
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [expression]);

  return (
    <div
      onClick={handleContainerClick}
      className="bg-black/60 text-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10 transition-all cursor-text relative overflow-hidden"
    >
      {/* Top Status Bar: Angle Mode, Format Mode, Memory Indicator, Parenthesis Balance */}
      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3 mb-4 gap-2 flex-wrap">
        
        {/* Left: Angle Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black mr-1">Angle:</span>
          <div className="flex bg-black/40 rounded-full px-2 py-1 border border-white/10 text-[10px] font-bold gap-1">
            {(['DEG', 'RAD', 'GRAD'] as AngleUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                id={`angle-mode-${unit}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setAngleUnit(unit);
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider transition-colors cursor-pointer ${
                  angleUnit === unit
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'text-white/30 hover:text-white/70'
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Middle: Number Format Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black mr-1">Format:</span>
          <div className="flex bg-black/40 rounded-full px-2 py-1 border border-white/10 text-[10px] font-bold gap-1">
            {(['STD', 'SCI', 'ENG', 'FRAC'] as NumberFormatMode[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                id={`format-mode-${fmt}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setFormatMode(fmt);
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider transition-colors cursor-pointer ${
                  formatMode === fmt
                    ? 'bg-white/20 text-white shadow-xs'
                    : 'text-white/30 hover:text-white/70'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Memory & Parentheses Status */}
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase">
          {memoryVal !== 0 && (
            <span className="text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
              MEM: {memoryVal}
            </span>
          )}
          {parenDiff > 0 && (
            <span className="text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg">
              {parenDiff} OPEN '('
            </span>
          )}
        </div>
      </div>

      {/* Primary Expression Input Field */}
      <div className="relative mb-2">
        <input
          ref={inputRef}
          type="text"
          id="calculator-expression-input"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onEvaluate();
            }
          }}
          placeholder="0"
          className="w-full bg-transparent font-mono text-lg sm:text-2xl text-white/40 placeholder-white/20 focus:outline-none tracking-tight text-right pr-2 overflow-x-auto"
          aria-label="Calculator Expression Input"
        />
      </div>

      {/* Result Display & Error Notice */}
      <div className="flex items-center justify-between min-h-[56px] pt-2 border-t border-white/10">
        
        {/* Left: Copy result button */}
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            id="copy-result-btn"
            title="Copy Result"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none border border-white/5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Evaluated Output or Error */}
        <div className="text-right pl-2">
          {error ? (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs sm:text-sm font-bold font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="font-mono text-3xl sm:text-6xl font-black tracking-tighter text-white break-all flex items-center justify-end">
              <span>{result !== '' ? result : '0'}</span>
              <span className="animate-pulse text-amber-500 ml-1">_</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
