import { useState } from 'react';
import { AngleUnit, NumberFormatMode } from '../../types';
import { DisplayScreen } from '../Display/DisplayScreen';
import { MemoryBar } from '../Display/MemoryBar';
import { ScientificKeys } from '../Keypad/ScientificKeys';
import { Keypad } from '../Keypad/Keypad';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BasicScientificModeProps {
  expression: string;
  setExpression: (val: string | ((prev: string) => string)) => void;
  result: string;
  error: string | null;
  angleUnit: AngleUnit;
  setAngleUnit: (unit: AngleUnit) => void;
  formatMode: NumberFormatMode;
  setFormatMode: (mode: NumberFormatMode) => void;
  memoryVal: number;
  setMemoryVal: (val: number | ((prev: number) => number)) => void;
  currentResultNum: number;
  onEvaluate: () => void;
  onClear: () => void;
  onAllClear: () => void;
  onBackspace: () => void;
}

export function BasicScientificMode({
  expression,
  setExpression,
  result,
  error,
  angleUnit,
  setAngleUnit,
  formatMode,
  setFormatMode,
  memoryVal,
  setMemoryVal,
  currentResultNum,
  onEvaluate,
  onClear,
  onAllClear,
  onBackspace
}: BasicScientificModeProps) {
  const [scientificExpanded, setScientificExpanded] = useState(true);

  const handleInsertText = (text: string) => {
    setExpression(prev => prev + text);
  };

  const handleInsertFunction = (fnName: string) => {
    setExpression(prev => `${prev}${fnName}(`);
  };

  const handleToggleSign = () => {
    if (!expression) {
      setExpression('-');
      return;
    }
    // Toggle overall expression sign or last number
    if (expression.startsWith('-(') && expression.endsWith(')')) {
      setExpression(expression.substring(2, expression.length - 1));
    } else {
      setExpression(`-(${expression})`);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Display Screen */}
      <DisplayScreen
        expression={expression}
        setExpression={setExpression}
        result={result}
        error={error}
        angleUnit={angleUnit}
        setAngleUnit={setAngleUnit}
        formatMode={formatMode}
        setFormatMode={setFormatMode}
        memoryVal={memoryVal}
        onEvaluate={onEvaluate}
      />

      {/* Memory Control Bar */}
      <MemoryBar
        memoryVal={memoryVal}
        setMemoryVal={setMemoryVal}
        currentResult={currentResultNum}
        onInsertValue={handleInsertText}
      />

      {/* Scientific Keys Toggle Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
          Scientific Functions
        </span>
        <button
          type="button"
          onClick={() => setScientificExpanded(!scientificExpanded)}
          className="text-xs text-white/50 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 focus:outline-none cursor-pointer"
        >
          {scientificExpanded ? (
            <>
              Hide Keys <ChevronUp className="w-3.5 h-3.5 text-amber-500" />
            </>
          ) : (
            <>
              Show Keys <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
            </>
          )}
        </button>
      </div>

      {/* Scientific Keys Panel */}
      {scientificExpanded && (
        <div className="bg-[#1A1D23] p-4 rounded-2xl border border-white/10 shadow-xl transition-all">
          <ScientificKeys
            onInsertText={handleInsertText}
            onInsertFunction={handleInsertFunction}
          />
        </div>
      )}

      {/* Main Standard Keypad */}
      <div className="bg-[#1A1D23] p-4 rounded-2xl border border-white/10 shadow-xl">
        <Keypad
          onInsertText={handleInsertText}
          onClear={onClear}
          onAllClear={onAllClear}
          onBackspace={onBackspace}
          onToggleSign={handleToggleSign}
          onEvaluate={onEvaluate}
        />
      </div>
    </div>
  );
}
