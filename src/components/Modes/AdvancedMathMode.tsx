import { useState } from 'react';
import { calculateGCDLCM, checkPrimeAndFactorize } from '../../calculator/primeAndFactors';
import { decimalToFraction } from '../../calculator/formatting';
import { Sigma, CheckCircle2, AlertCircle } from 'lucide-react';

export function AdvancedMathMode() {
  const [activeTab, setActiveTab] = useState<'prime' | 'gcd_lcm' | 'fraction'>('prime');

  // Prime State
  const [primeInput, setPrimeInput] = useState<string>('360');

  // GCD/LCM State
  const [gcdInput, setGcdInput] = useState<string>('24, 36, 60');

  // Fraction State
  const [fracNum, setFracNum] = useState<string>('12');
  const [fracDen, setFracDen] = useState<string>('16');

  // Computed Prime
  const primeRes = checkPrimeAndFactorize(parseFloat(primeInput) || 0);

  // Computed GCD/LCM
  const gcdRes = calculateGCDLCM(
    gcdInput.split(/[\s,]+/).map(s => parseFloat(s.trim())).filter(n => !Number.isNaN(n))
  );

  // Computed Fraction
  const n = parseFloat(fracNum) || 0;
  const d = parseFloat(fracDen) || 1;
  const decimalVal = d !== 0 ? n / d : 0;
  const simFrac = decimalToFraction(decimalVal);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Tab Switcher Header */}
      <div className="bg-[#1A1D23] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sigma className="w-5 h-5 text-amber-500" />
          <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">Primes, Factors & Fractions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('prime')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'prime'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Prime & Factors
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gcd_lcm')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'gcd_lcm'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            GCD & LCM Solver
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fraction')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'fraction'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Fraction Simplifier
          </button>
        </div>
      </div>

      {/* TAB 1: PRIME CHECK & FACTORIZATION */}
      {activeTab === 'prime' && (
        <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/60">
            Integer Prime Check & Factorization
          </h3>

          <input
            type="number"
            value={primeInput}
            onChange={(e) => setPrimeInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xl text-white focus:outline-none focus:border-amber-500"
            placeholder="360"
          />

          <div className="space-y-4 pt-2">
            
            {/* Prime Status Badge */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              primeRes.isPrime
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-black/40 border-white/10 text-white'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <span className="font-black text-xs uppercase tracking-wider">
                  {primeRes.number} is {primeRes.isPrime ? 'a PRIME Number' : 'a COMPOSITE Number'}
                </span>
              </div>
            </div>

            {/* Prime Factorization Expression */}
            <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-2">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">
                Prime Factorization Protocol
              </span>
              <div className="font-mono text-2xl font-black text-amber-500">
                {primeRes.number} = {primeRes.factors.length > 0 ? (
                  primeRes.factors.map((f, i) => (
                    <span key={i}>
                      {f.prime}{f.exponent > 1 && <sup>{f.exponent}</sup>}
                      {i < primeRes.factors.length - 1 ? ' × ' : ''}
                    </span>
                  ))
                ) : 'None'}
              </div>
            </div>

            {/* All Divisors List */}
            <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-2">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                All Divisors ({primeRes.allDivisors.length} total)
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {primeRes.allDivisors.map((d, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-black border border-white/10 font-black text-amber-500">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GCD & LCM SOLVER */}
      {activeTab === 'gcd_lcm' && (
        <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/60">
            Commas-separated dataset for GCD / LCM
          </h3>

          <input
            type="text"
            value={gcdInput}
            onChange={(e) => setGcdInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xl text-white focus:outline-none focus:border-amber-500"
            placeholder="24, 36, 60"
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-5 bg-black/40 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Greatest Common Divisor (GCD)</span>
              <div className="font-mono text-3xl font-black text-amber-500">
                {gcdRes.gcd}
              </div>
            </div>

            <div className="p-5 bg-black/40 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Least Common Multiple (LCM)</span>
              <div className="font-mono text-3xl font-black text-amber-500">
                {gcdRes.lcm}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FRACTION SIMPLIFIER */}
      {activeTab === 'fraction' && (
        <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/60">
            Numerator & Denominator Reduction
          </h3>

          <div className="flex items-center gap-3 max-w-xs mx-auto">
            <input
              type="number"
              value={fracNum}
              onChange={(e) => setFracNum(e.target.value)}
              className="w-28 p-3 rounded-xl bg-black/60 border border-white/10 text-center font-mono text-xl font-black text-white focus:border-amber-500"
              placeholder="12"
            />
            <span className="font-black text-2xl text-amber-500">/</span>
            <input
              type="number"
              value={fracDen}
              onChange={(e) => setFracDen(e.target.value)}
              className="w-28 p-3 rounded-xl bg-black/60 border border-white/10 text-center font-mono text-xl font-black text-white focus:border-amber-500"
              placeholder="16"
            />
          </div>

          {d === 0 ? (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl text-center">
              Division by zero is undefined!
            </div>
          ) : (
            <div className="p-6 bg-black/40 rounded-xl border border-white/10 text-center space-y-2">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                Simplified Fraction Result
              </span>
              <div className="font-mono text-4xl font-black text-amber-500">
                {simFrac ? simFrac.str : `${n}/${d}`}
              </div>
              <div className="font-mono text-xs text-white/60 font-bold pt-1">
                Decimal: <span className="text-amber-500">{decimalVal}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
