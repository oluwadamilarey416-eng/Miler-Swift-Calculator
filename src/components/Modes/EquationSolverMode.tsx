import { useState } from 'react';
import { solveLinear2x2, solveLinearSingle, solveQuadratic } from '../../features/equations/equationSolver';
import { LinearSystemResult, QuadraticResult } from '../../types';
import { CheckCircle2, AlertCircle, HelpCircle, Variable } from 'lucide-react';

export function EquationSolverMode() {
  const [eqType, setEqType] = useState<'quadratic' | 'linear_single' | 'system_2x2'>('quadratic');

  // Quadratic state
  const [quadA, setQuadA] = useState<string>('1');
  const [quadB, setQuadB] = useState<string>('-5');
  const [quadC, setQuadC] = useState<string>('6');
  const [quadResult, setQuadResult] = useState<QuadraticResult | null>(null);
  const [quadError, setQuadError] = useState<string | null>(null);

  // Linear Single state
  const [linearExpr, setLinearExpr] = useState<string>('2x + 5 = 15');
  const [linearResult, setLinearResult] = useState<{ x: number; steps: string[] } | null>(null);
  const [linearError, setLinearError] = useState<string | null>(null);

  // System 2x2 state
  const [sysA1, setSysA1] = useState<string>('2');
  const [sysB1, setSysB1] = useState<string>('1');
  const [sysC1, setSysC1] = useState<string>('5');
  const [sysA2, setSysA2] = useState<string>('1');
  const [sysB2, setSysB2] = useState<string>('-1');
  const [sysC2, setSysC2] = useState<string>('1');
  const [sysResult, setSysResult] = useState<LinearSystemResult | null>(null);
  const [sysError, setSysError] = useState<string | null>(null);

  // Solve Quadratic
  const handleSolveQuadratic = () => {
    setQuadError(null);
    try {
      const a = parseFloat(quadA);
      const b = parseFloat(quadB);
      const c = parseFloat(quadC);
      if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c)) {
        throw new Error('Please enter valid numerical coefficients.');
      }
      const res = solveQuadratic(a, b, c);
      setQuadResult(res);
    } catch (err: unknown) {
      setQuadError(err instanceof Error ? err.message : 'Failed to solve quadratic equation');
      setQuadResult(null);
    }
  };

  // Solve Linear Single
  const handleSolveLinear = () => {
    setLinearError(null);
    try {
      const res = solveLinearSingle(linearExpr);
      setLinearResult(res);
    } catch (err: unknown) {
      setLinearError(err instanceof Error ? err.message : 'Failed to solve linear equation');
      setLinearResult(null);
    }
  };

  // Solve System 2x2
  const handleSolveSystem = () => {
    setSysError(null);
    try {
      const a1 = parseFloat(sysA1), b1 = parseFloat(sysB1), c1 = parseFloat(sysC1);
      const a2 = parseFloat(sysA2), b2 = parseFloat(sysB2), c2 = parseFloat(sysC2);
      if ([a1, b1, c1, a2, b2, c2].some(Number.isNaN)) {
        throw new Error('Please enter valid numerical values for all coefficients.');
      }
      const res = solveLinear2x2(a1, b1, c1, a2, b2, c2);
      setSysResult(res);
    } catch (err: unknown) {
      setSysError(err instanceof Error ? err.message : 'Failed to solve linear system');
      setSysResult(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Selector Header */}
      <div className="bg-[#1A1D23] p-5 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Variable className="w-5 h-5 text-amber-500" />
          <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">Equation Solver</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setEqType('quadratic')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              eqType === 'quadratic'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Quadratic (ax² + bx + c)
          </button>
          <button
            type="button"
            onClick={() => setEqType('linear_single')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              eqType === 'linear_single'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Linear Single Var
          </button>
          <button
            type="button"
            onClick={() => setEqType('system_2x2')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              eqType === 'system_2x2'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            2×2 System
          </button>
        </div>
      </div>

      {/* QUADRATIC EQUATION FORM */}
      {eqType === 'quadratic' && (
        <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/60">
            Coefficients for <span className="font-mono font-black text-amber-500">ax² + bx + c = 0</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Coeff a</label>
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-white text-base focus:outline-none focus:border-amber-500"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Coeff b</label>
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-white text-base focus:outline-none focus:border-amber-500"
                placeholder="-5"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Const c</label>
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-white text-base focus:outline-none focus:border-amber-500"
                placeholder="6"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSolveQuadratic}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer text-xs"
          >
            Solve Quadratic Equation
          </button>

          {quadError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {quadError}
            </div>
          )}

          {quadResult && (
            <div className="space-y-4 pt-2">
              {/* Roots Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Root 1 (x₁)</span>
                  <div className="font-mono text-xl font-black text-amber-500">
                    {quadResult.root1.imag !== 0
                      ? `${quadResult.root1.real.toFixed(4)} + ${Math.abs(quadResult.root1.imag).toFixed(4)}i`
                      : quadResult.root1.real.toFixed(4)}
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Root 2 (x₂)</span>
                  <div className="font-mono text-xl font-black text-amber-500">
                    {quadResult.root2.imag !== 0
                      ? `${quadResult.root2.real.toFixed(4)} - ${Math.abs(quadResult.root2.imag).toFixed(4)}i`
                      : quadResult.root2.real.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Step-by-Step Breakdown */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <h4 className="font-black text-[10px] text-amber-500 uppercase tracking-widest mb-2">
                  Resolution Protocol
                </h4>
                <ul className="space-y-1 font-mono text-xs text-white/70">
                  {quadResult.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LINEAR SINGLE VARIABLE FORM */}
      {eqType === 'linear_single' && (
        <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/60">
            Single Variable Equation (e.g., <span className="font-mono text-amber-500 font-bold">2x + 5 = 15</span>)
          </h3>

          <div>
            <input
              type="text"
              value={linearExpr}
              onChange={(e) => setLinearExpr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 font-mono text-base text-white focus:outline-none focus:border-amber-500"
              placeholder="2x + 5 = 15"
            />
          </div>

          <button
            type="button"
            onClick={handleSolveLinear}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer text-xs"
          >
            Solve Linear Equation
          </button>

          {linearError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {linearError}
            </div>
          )}

          {linearResult && (
            <div className="space-y-4 pt-2">
              <div className="p-5 bg-black/40 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Solution</span>
                <div className="font-mono text-3xl font-black text-amber-500">
                  x = {linearResult.x}
                </div>
              </div>

              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <h4 className="font-black text-[10px] text-amber-500 uppercase tracking-widest mb-2">
                  Resolution Steps
                </h4>
                <ul className="space-y-1 font-mono text-xs text-white/70">
                  {linearResult.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SYSTEM 2X2 FORM */}
      {eqType === 'system_2x2' && (
        <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <h3 className="font-bold text-xs uppercase tracking-widest text-white/60">
            System: <span className="font-mono font-bold text-amber-500">a₁x + b₁y = c₁</span> & <span className="font-mono font-bold text-amber-500">a₂x + b₂y = c₂</span>
          </h3>

          <div className="space-y-3">
            {/* Equation 1 */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500 w-24">Eq 1:</span>
              <input
                type="number"
                value={sysA1}
                onChange={(e) => setSysA1(e.target.value)}
                className="w-16 px-2 py-1 bg-black border border-white/20 rounded font-mono text-center text-sm text-white focus:border-amber-500"
              />
              <span className="font-mono text-xs font-bold text-white/70">x +</span>
              <input
                type="number"
                value={sysB1}
                onChange={(e) => setSysB1(e.target.value)}
                className="w-16 px-2 py-1 bg-black border border-white/20 rounded font-mono text-center text-sm text-white focus:border-amber-500"
              />
              <span className="font-mono text-xs font-bold text-white/70">y =</span>
              <input
                type="number"
                value={sysC1}
                onChange={(e) => setSysC1(e.target.value)}
                className="w-20 px-2 py-1 bg-black border border-white/20 rounded font-mono text-center text-sm text-white focus:border-amber-500"
              />
            </div>

            {/* Equation 2 */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500 w-24">Eq 2:</span>
              <input
                type="number"
                value={sysA2}
                onChange={(e) => setSysA2(e.target.value)}
                className="w-16 px-2 py-1 bg-black border border-white/20 rounded font-mono text-center text-sm text-white focus:border-amber-500"
              />
              <span className="font-mono text-xs font-bold text-white/70">x +</span>
              <input
                type="number"
                value={sysB2}
                onChange={(e) => setSysB2(e.target.value)}
                className="w-16 px-2 py-1 bg-black border border-white/20 rounded font-mono text-center text-sm text-white focus:border-amber-500"
              />
              <span className="font-mono text-xs font-bold text-white/70">y =</span>
              <input
                type="number"
                value={sysC2}
                onChange={(e) => setSysC2(e.target.value)}
                className="w-20 px-2 py-1 bg-black border border-white/20 rounded font-mono text-center text-sm text-white focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSolveSystem}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer text-xs"
          >
            Solve System (Cramer's Rule)
          </button>

          {sysError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {sysError}
            </div>
          )}

          {sysResult && (
            <div className="space-y-4 pt-2">
              {sysResult.isSolvable ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-black/40 rounded-xl border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Variable x</span>
                    <div className="font-mono text-2xl font-black text-amber-500">
                      {sysResult.x}
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/10 text-center">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Variable y</span>
                    <div className="font-mono text-2xl font-black text-amber-500">
                      {sysResult.y}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-bold">
                  {sysResult.message}
                </div>
              )}

              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <h4 className="font-black text-[10px] text-amber-500 uppercase tracking-widest mb-2">
                  Determinant Steps
                </h4>
                <ul className="space-y-1 font-mono text-xs text-white/70">
                  {sysResult.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
