import { ShieldCheck, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
}

export function Footer({ onOpenShortcuts, onOpenAbout }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#1A1D23] py-3 px-6 text-white/30 text-[10px] font-bold uppercase tracking-widest transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left column */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            <strong className="text-white/80 font-black">PRECISION ENGINE v2.5</strong> — ARM-64 High Precision Math Engine
          </span>
        </div>

        {/* Middle privacy note */}
        <div className="flex items-center gap-1.5 text-white/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>100% Client-Side Privacy: No data stored externally</span>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenShortcuts}
            className="hover:text-amber-500 transition-colors uppercase cursor-pointer"
          >
            Keyboard Shortcuts
          </button>
          <span>•</span>
          <button
            onClick={onOpenAbout}
            className="hover:text-amber-500 transition-colors uppercase cursor-pointer"
          >
            Documentation
          </button>
        </div>
      </div>
    </footer>
  );
}
