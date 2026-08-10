import { useState, useEffect, useCallback, useMemo } from 'react';
import { AngleUnit, CalcMode, HistoryItem, NumberFormatMode } from './types';
import { evaluateExpression } from './calculator/evaluator';
import { formatResult } from './calculator/formatting';
import { 
  clearStoredHistory, 
  deleteHistoryItem, 
  getStoredHistory, 
  getStoredMemory, 
  saveHistory 
} from './utils/storage';
import { runTestSuite } from './tests/calculator.test';

import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { BasicScientificMode } from './components/Modes/BasicScientificMode';
import { EquationSolverMode } from './components/Modes/EquationSolverMode';
import { StatisticsMode } from './components/Modes/StatisticsMode';
import { ProgrammerMode } from './components/Modes/ProgrammerMode';
import { UnitConverterMode } from './components/Modes/UnitConverterMode';
import { AdvancedMathMode } from './components/Modes/AdvancedMathMode';

import { HistoryDrawer } from './components/Display/HistoryDrawer';
import { KeyboardShortcutsModal } from './components/Modals/KeyboardShortcutsModal';
import { AboutModal } from './components/Modals/AboutModal';

export default function App() {
  // Navigation Mode
  const [currentMode, setCurrentMode] = useState<CalcMode>('scientific');

  // Calculator State
  const [expression, setExpression] = useState<string>('');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [formatMode, setFormatMode] = useState<NumberFormatMode>('STD');
  const [memoryVal, setMemoryVal] = useState<number>(getStoredMemory());
  const [lastAns, setLastAns] = useState<number>(0);

  // History & Modals State
  const [history, setHistory] = useState<HistoryItem[]>(getStoredHistory());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Run automated test suite on startup for verification
  useEffect(() => {
    const suite = runTestSuite();
    console.log(`[Calculator Engine Test Suite] Passed: ${suite.passed}, Failed: ${suite.failed}`);
  }, []);

  // Compute live real-time evaluation
  const { resultStr, resultNum, errorMsg } = useMemo(() => {
    if (!expression || expression.trim() === '') {
      return { resultStr: '', resultNum: 0, errorMsg: null };
    }

    try {
      const val = evaluateExpression(expression, { angleUnit, ans: lastAns });
      const formatted = formatResult(val, formatMode);
      return { resultStr: formatted, resultNum: val, errorMsg: null };
    } catch (err: unknown) {
      // Don't show aggressive error if expression is currently being typed
      const msg = err instanceof Error ? err.message : 'Invalid expression';
      // Suppress temporary syntax errors during active typing
      if (
        msg.includes('Mismatched') || 
        msg.includes('Missing operand') || 
        msg.includes('syntax error') ||
        msg.includes('requires two arguments')
      ) {
        return { resultStr: '', resultNum: NaN, errorMsg: null };
      }
      return { resultStr: '', resultNum: NaN, errorMsg: msg };
    }
  }, [expression, angleUnit, formatMode, lastAns]);

  // Execute Evaluation and save to History
  const handleEvaluate = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    try {
      const val = evaluateExpression(expression, { angleUnit, ans: lastAns });
      const formatted = formatResult(val, formatMode);

      setLastAns(val);
      setExpression(formatted);

      // Save calculation to local history
      const updatedHistory = saveHistory({
        expression,
        result: formatted,
        mode: currentMode,
        angleUnit
      });
      setHistory(updatedHistory);
    } catch (err: unknown) {
      // Keep expression as is for user correction
    }
  }, [expression, angleUnit, formatMode, lastAns, currentMode]);

  const handleClear = () => {
    setExpression('');
  };

  const handleAllClear = () => {
    setExpression('');
  };

  const handleBackspace = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  // Keyboard shortcut event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only capture shortcuts when focused on root or body (not when typing in text inputs in solver/stats)
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' || 
        activeElement.tagName === 'SELECT'
      );

      // Allow calculator-expression-input to process keys directly
      if (activeElement?.id === 'calculator-expression-input') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleEvaluate();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          handleAllClear();
        }
        return;
      }

      if (isInputFocused) return;
      if (currentMode !== 'scientific') return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        setExpression(prev => prev + e.key);
      } else if (e.key === '+') {
        e.preventDefault();
        setExpression(prev => prev + ' + ');
      } else if (e.key === '-') {
        e.preventDefault();
        setExpression(prev => prev + ' - ');
      } else if (e.key === '*') {
        e.preventDefault();
        setExpression(prev => prev + ' * ');
      } else if (e.key === '/') {
        e.preventDefault();
        setExpression(prev => prev + ' / ');
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        setExpression(prev => prev + '.');
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        setExpression(prev => prev + e.key);
      } else if (e.key === '^') {
        e.preventDefault();
        setExpression(prev => prev + '^');
      } else if (e.key === '!') {
        e.preventDefault();
        setExpression(prev => prev + '!');
      } else if (e.key === '%') {
        e.preventDefault();
        setExpression(prev => prev + '%');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setExpression(prev => prev + 'sin(');
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setExpression(prev => prev + 'cos(');
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setExpression(prev => prev + 'tan(');
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setExpression(prev => prev + 'log(');
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setExpression(prev => prev + 'π');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMode, handleEvaluate]);

  // History handlers
  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    clearStoredHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F3F4F6] flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        onToggleHistory={() => setHistoryOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        historyCount={history.length}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentMode === 'scientific' && (
          <BasicScientificMode
            expression={expression}
            setExpression={setExpression}
            result={resultStr}
            error={errorMsg}
            angleUnit={angleUnit}
            setAngleUnit={setAngleUnit}
            formatMode={formatMode}
            setFormatMode={setFormatMode}
            memoryVal={memoryVal}
            setMemoryVal={setMemoryVal}
            currentResultNum={resultNum}
            onEvaluate={handleEvaluate}
            onClear={handleClear}
            onAllClear={handleAllClear}
            onBackspace={handleBackspace}
          />
        )}

        {currentMode === 'equation' && <EquationSolverMode />}

        {currentMode === 'statistics' && <StatisticsMode />}

        {currentMode === 'programmer' && <ProgrammerMode />}

        {currentMode === 'converter' && <UnitConverterMode />}

        {currentMode === 'advanced_math' && <AdvancedMathMode />}
      </main>

      {/* Footer */}
      <Footer
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
      />

      {/* Calculation History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectExpression={(expr) => setExpression(expr)}
        onSelectResult={(res) => setExpression(prev => prev + res)}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* About & Specs Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}
