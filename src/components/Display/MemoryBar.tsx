import { setStoredMemory } from '../../utils/storage';

interface MemoryBarProps {
  memoryVal: number;
  setMemoryVal: (val: number | ((prev: number) => number)) => void;
  currentResult: number;
  onInsertValue: (val: string) => void;
}

export function MemoryBar({
  memoryVal,
  setMemoryVal,
  currentResult,
  onInsertValue
}: MemoryBarProps) {
  const handleMC = () => {
    setMemoryVal(0);
    setStoredMemory(0);
  };

  const handleMR = () => {
    if (memoryVal !== 0) {
      onInsertValue(memoryVal.toString());
    }
  };

  const handleMPlus = () => {
    const valToAdd = !Number.isNaN(currentResult) ? currentResult : 0;
    setMemoryVal(prev => {
      const next = prev + valToAdd;
      setStoredMemory(next);
      return next;
    });
  };

  const handleMMinus = () => {
    const valToSub = !Number.isNaN(currentResult) ? currentResult : 0;
    setMemoryVal(prev => {
      const next = prev - valToSub;
      setStoredMemory(next);
      return next;
    });
  };

  const handleMS = () => {
    const valToStore = !Number.isNaN(currentResult) ? currentResult : 0;
    setMemoryVal(valToStore);
    setStoredMemory(valToStore);
  };

  return (
    <div className="grid grid-cols-5 gap-2 my-3">
      <button
        type="button"
        id="mem-btn-mc"
        onClick={handleMC}
        disabled={memoryVal === 0}
        className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-black uppercase tracking-wider text-amber-500 border border-white/5 transition-all focus:outline-none cursor-pointer"
        title="Memory Clear"
      >
        MC
      </button>

      <button
        type="button"
        id="mem-btn-mr"
        onClick={handleMR}
        disabled={memoryVal === 0}
        className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-black uppercase tracking-wider text-amber-500 border border-white/5 transition-all focus:outline-none cursor-pointer"
        title="Memory Recall"
      >
        MR
      </button>

      <button
        type="button"
        id="mem-btn-mplus"
        onClick={handleMPlus}
        className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-white border border-white/5 transition-all focus:outline-none cursor-pointer"
        title="Memory Add"
      >
        M+
      </button>

      <button
        type="button"
        id="mem-btn-mminus"
        onClick={handleMMinus}
        className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-white border border-white/5 transition-all focus:outline-none cursor-pointer"
        title="Memory Subtract"
      >
        M−
      </button>

      <button
        type="button"
        id="mem-btn-ms"
        onClick={handleMS}
        className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-amber-500 border border-white/5 transition-all focus:outline-none cursor-pointer"
        title="Memory Store"
      >
        MS
      </button>
    </div>
  );
}
