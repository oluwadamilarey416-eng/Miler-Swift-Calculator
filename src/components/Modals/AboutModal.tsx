import { X, ShieldCheck, Cpu, CheckCircle2, Calculator } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-[#1A1D23] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">About Scientific Calculator</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-white/70 leading-relaxed font-sans">
          <p>
            <strong className="text-white font-bold">Scientific Calculator</strong> is a high-precision, production-grade calculator application engineered with TypeScript, React 19, and Tailwind CSS.
          </p>

          <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-2">
            <h3 className="font-black text-amber-500 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-500" /> Expression Engine
            </h3>
            <p className="text-white/80 text-[11px]">
              Engineered with a Shunting-Yard tokenized parser & AST evaluator. Natively supports implicit multiplication (<code className="bg-black px-1.5 py-0.5 rounded border border-white/10 text-amber-500 font-mono">2π</code>), angle modes (DEG, RAD, GRAD), factorials, roots, and trigonometry without using unsafe <code className="bg-black px-1.5 py-0.5 rounded border border-white/10 text-amber-500 font-mono">eval()</code>.
            </p>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1">
            <h3 className="font-black text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" /> Privacy & Local Persistence
            </h3>
            <p className="text-amber-200/80 text-[11px]">
              100% Client-Side execution. Calculations, memory registers, and history logs stay entirely within your local browser storage.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <span className="font-black text-amber-500 text-xs uppercase tracking-widest block">Capabilities Matrix:</span>
            <ul className="grid grid-cols-2 gap-2 text-[11px] font-bold text-white/80">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Basic & Scientific Math</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Quadratic & Linear Solvers</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Descriptive Statistics</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Programmer Radix & Bits</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Multi-Unit Converter</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Primes, Factors, GCD/LCM</li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
