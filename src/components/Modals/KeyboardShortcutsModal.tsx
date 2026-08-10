import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 – 9', desc: 'Enter numbers' },
    { key: '+  -  *  /', desc: 'Basic arithmetic operators' },
    { key: '. or ,', desc: 'Decimal point' },
    { key: '(  )', desc: 'Parentheses' },
    { key: '^', desc: 'Power (Exponent xʸ)' },
    { key: '!', desc: 'Factorial' },
    { key: '%', desc: 'Percentage' },
    { key: 'Enter or =', desc: 'Calculate result' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Escape', desc: 'Clear expression (AC)' },
    { key: 's, c, t', desc: 'Shortcut for sin, cos, tan' },
    { key: 'l, e, p', desc: 'Shortcut for log, e, pi (π)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#1A1D23] w-full max-w-md rounded-2xl shadow-2xl border border-white/10 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">Keyboard Shortcuts</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs"
            >
              <kbd className="px-2.5 py-1 bg-black border border-amber-500/30 rounded-lg font-mono font-black text-amber-500 shadow-2xs">
                {s.key}
              </kbd>
              <span className="text-white/80 font-bold">{s.desc}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
}
