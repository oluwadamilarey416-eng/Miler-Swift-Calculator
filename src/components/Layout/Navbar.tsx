import { useState, ReactNode } from 'react';
import { 
  Calculator, 
  Binary, 
  BarChart3, 
  ArrowLeftRight, 
  History, 
  HelpCircle, 
  Info, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Sigma,
  Variable
} from 'lucide-react';
import { CalcMode } from '../../types';
import { ThemeToggle } from './ThemeToggle';
import { isSoundEnabled, toggleSound } from '../../utils/sound';

interface NavbarProps {
  currentMode: CalcMode;
  onSelectMode: (mode: CalcMode) => void;
  onToggleHistory: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  historyCount: number;
}

export function Navbar({
  currentMode,
  onSelectMode,
  onToggleHistory,
  onOpenShortcuts,
  onOpenAbout,
  historyCount
}: NavbarProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSoundToggle = () => {
    const state = toggleSound();
    setSoundOn(state);
  };

  const navItems: { mode: CalcMode; label: string; icon: ReactNode }[] = [
    { mode: 'scientific', label: 'Scientific', icon: <Calculator className="w-3.5 h-3.5" /> },
    { mode: 'equation', label: 'Equations', icon: <Variable className="w-3.5 h-3.5" /> },
    { mode: 'statistics', label: 'Statistics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { mode: 'programmer', label: 'Programmer', icon: <Binary className="w-3.5 h-3.5" /> },
    { mode: 'converter', label: 'Converter', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
    { mode: 'advanced_math', label: 'Primes & Factors', icon: <Sigma className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#1A1D23] border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Calculator className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black tracking-tighter text-amber-500 uppercase">
                PRECISION<span className="text-white/40 font-mono text-xs ml-1 font-bold">.v2</span>
              </span>
              <div className="hidden sm:block h-4 w-[1px] bg-white/20"></div>
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/40">
                High Precision
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => {
              const active = currentMode === item.mode;
              return (
                <button
                  key={item.mode}
                  id={`nav-mode-${item.mode}`}
                  onClick={() => onSelectMode(item.mode)}
                  className={`flex items-center gap-1.5 py-1 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    active
                      ? 'text-amber-500 border-b-2 border-amber-500 pb-0.5'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-2">
            {/* History Drawer Toggle */}
            <button
              onClick={onToggleHistory}
              id="navbar-history-btn"
              title="Calculation History"
              className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none border border-transparent hover:border-white/10"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              id="navbar-sound-btn"
              title={soundOn ? 'Mute Key Clicks' : 'Enable Key Clicks'}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none border border-transparent hover:border-white/10"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4 text-white/30" />}
            </button>

            {/* Keyboard Shortcuts */}
            <button
              onClick={onOpenShortcuts}
              id="navbar-shortcuts-btn"
              title="Keyboard Shortcuts"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none hidden sm:inline-flex border border-transparent hover:border-white/10"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* About Modal */}
            <button
              onClick={onOpenAbout}
              id="navbar-about-btn"
              title="About Calculator"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none hidden sm:inline-flex border border-transparent hover:border-white/10"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="navbar-mobile-menu-btn"
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors lg:hidden focus:outline-none border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#1A1D23] px-4 pt-3 pb-4 space-y-1 shadow-2xl">
          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest px-3 py-1">
            Calculator Modes
          </div>
          {navItems.map((item) => {
            const active = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  onSelectMode(item.mode);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  active
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10 flex items-center justify-around text-xs text-white/60">
            <button onClick={onOpenShortcuts} className="flex items-center gap-1.5 py-2 px-3 hover:text-white">
              <HelpCircle className="w-4 h-4 text-amber-500" /> Shortcuts
            </button>
            <button onClick={onOpenAbout} className="flex items-center gap-1.5 py-2 px-3 hover:text-white">
              <Info className="w-4 h-4 text-amber-500" /> About
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
