import { useState, useMemo } from 'react';
import { calculateStatistics } from '../../features/statistics/statsEngine';
import { BarChart3, ListFilter, Trash2 } from 'lucide-react';

export function StatisticsMode() {
  const [rawInput, setRawInput] = useState<string>('12, 15, 18, 22, 25, 30, 35, 40, 40, 45');

  // Parse list of numbers from input
  const numberList = useMemo(() => {
    return rawInput
      .split(/[\s,;\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !Number.isNaN(n) && isFinite(n));
  }, [rawInput]);

  const stats = useMemo(() => {
    return calculateStatistics(numberList);
  }, [numberList]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Input Panel */}
      <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">Statistics Engine</h2>
          </div>
          {rawInput && (
            <button
              type="button"
              onClick={() => setRawInput('')}
              className="text-xs text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Data
            </button>
          )}
        </div>

        <label className="block text-xs font-bold uppercase tracking-wider text-white/50">
          Dataset Values (comma, space, or newline separated):
        </label>
        <textarea
          rows={3}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="e.g. 10, 20, 30, 40, 50"
          className="w-full p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-sm text-white focus:outline-none focus:border-amber-500 resize-y"
        />

        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Valid Data Points: <strong className="text-amber-500 font-mono font-bold">{stats.count}</strong></span>
          <span>Sample Datasets: 
            <button 
              type="button" 
              onClick={() => setRawInput('85, 90, 78, 92, 88, 95, 70, 84')}
              className="ml-2 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider cursor-pointer"
            >
              Test Scores
            </button>
          </span>
        </div>
      </div>

      {/* Stats Results Dashboard */}
      {stats.count > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Mean */}
            <div className="p-5 bg-[#1A1D23] rounded-2xl border border-white/10 shadow-xl">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Mean (x̄)</span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-amber-500">
                {stats.mean.toFixed(4)}
              </div>
            </div>

            {/* Median */}
            <div className="p-5 bg-[#1A1D23] rounded-2xl border border-white/10 shadow-xl">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Median</span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-amber-500">
                {stats.median.toFixed(4)}
              </div>
            </div>

            {/* Mode */}
            <div className="p-5 bg-[#1A1D23] rounded-2xl border border-white/10 shadow-xl">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Mode</span>
              <div className="font-mono text-lg font-black text-white truncate">
                {stats.mode.length > 0 ? stats.mode.join(', ') : 'No Mode'}
              </div>
            </div>

            {/* Sum */}
            <div className="p-5 bg-[#1A1D23] rounded-2xl border border-white/10 shadow-xl">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Sum (Σx)</span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                {stats.sum}
              </div>
            </div>
          </div>

          {/* Detailed Dispersion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Dispersion Metrics */}
            <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <h3 className="font-black text-xs text-amber-500 border-b border-white/10 pb-2 uppercase tracking-widest">
                Dispersion & Deviation
              </h3>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Sample Std Deviation (s):</span>
                  <span className="font-black text-amber-500">{stats.stdDevSample.toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Sample Variance (s²):</span>
                  <span className="font-bold text-white">{stats.varianceSample.toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Population Std Dev (σ):</span>
                  <span className="font-bold text-white">{stats.stdDevPopulation.toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Population Variance (σ²):</span>
                  <span className="font-bold text-white">{stats.variancePopulation.toFixed(4)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-white/40">Range (Max - Min):</span>
                  <span className="font-bold text-white">{stats.range} ({stats.min} to {stats.max})</span>
                </div>
              </div>
            </div>

            {/* Sorted Dataset View */}
            <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <ListFilter className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-xs text-amber-500 uppercase tracking-widest">
                  Ordered Data ({stats.count} items)
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {stats.sortedList.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-black/60 text-amber-500 font-mono text-xs font-bold rounded-xl border border-white/10"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1A1D23] p-8 rounded-2xl border border-white/10 text-center text-white/30 font-bold uppercase tracking-widest text-xs">
          Enter numbers above to process statistical metrics.
        </div>
      )}
    </div>
  );
}
