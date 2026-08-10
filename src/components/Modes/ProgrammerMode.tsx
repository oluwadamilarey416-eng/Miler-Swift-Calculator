import { useState } from 'react';
import { BitWordSize, Radix } from '../../types';
import { executeBitwise, formatRadix, parseRadix } from '../../features/programmer/programmerEngine';
import { Binary, Layers, RefreshCw } from 'lucide-react';

export function ProgrammerMode() {
  const [val, setVal] = useState<bigint>(255n);
  const [bitSize, setBitSize] = useState<BitWordSize>(32);
  const [activeRadix, setActiveRadix] = useState<Radix>(10);
  const [inputStr, setInputStr] = useState<string>('255');

  // Second operand for bitwise binary operations
  const [val2, setVal2] = useState<bigint>(15n);
  const [inputStr2, setInputStr2] = useState<string>('15');

  const handleUpdatePrimary = (newStr: string, radix: Radix) => {
    setInputStr(newStr);
    setActiveRadix(radix);
    const parsed = parseRadix(newStr, radix);
    setVal(parsed);
  };

  const handleUpdateSecondary = (newStr: string) => {
    setInputStr2(newStr);
    const parsed = parseRadix(newStr, activeRadix);
    setVal2(parsed);
  };

  const handleApplyBitwise = (op: 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR' | 'XNOR' | 'LSH' | 'RSH') => {
    const res = executeBitwise(val, op, val2, bitSize);
    setVal(res);
    setInputStr(formatRadix(res, activeRadix, bitSize).replace(/\s+/g, ''));
  };

  // Toggle individual bit at index
  const handleToggleBit = (bitIndex: number) => {
    const bitMask = 1n << BigInt(bitIndex);
    const newBigInt = val ^ bitMask;
    setVal(newBigInt);
    setInputStr(formatRadix(newBigInt, activeRadix, bitSize).replace(/\s+/g, ''));
  };

  const mask = (1n << BigInt(bitSize)) - 1n;
  const currentValMasked = val & mask;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header & Word Size Controls */}
      <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">
              Programmer Mode
            </h2>
          </div>

          {/* Word Size Toggle */}
          <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase tracking-widest font-black text-white/40 px-2">Word:</span>
            {([8, 16, 32, 64] as BitWordSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setBitSize(size)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  bitSize === size
                    ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {size}-BIT
              </button>
            ))}
          </div>
        </div>

        {/* Synchronized Bases Display Matrix */}
        <div className="space-y-2">
          
          {/* HEX */}
          <div
            onClick={() => setActiveRadix(16)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              activeRadix === 16
                ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="w-12 text-xs font-black tracking-widest text-amber-500">HEX</span>
            {activeRadix === 16 ? (
              <input
                type="text"
                value={inputStr}
                onChange={(e) => handleUpdatePrimary(e.target.value, 16)}
                className="w-full text-right font-mono text-xl font-black bg-transparent text-amber-500 focus:outline-none"
              />
            ) : (
              <span className="font-mono text-xl font-black text-white/80">
                {formatRadix(currentValMasked, 16, bitSize)}
              </span>
            )}
          </div>

          {/* DEC */}
          <div
            onClick={() => setActiveRadix(10)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              activeRadix === 10
                ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="w-12 text-xs font-black tracking-widest text-amber-500">DEC</span>
            {activeRadix === 10 ? (
              <input
                type="text"
                value={inputStr}
                onChange={(e) => handleUpdatePrimary(e.target.value, 10)}
                className="w-full text-right font-mono text-xl font-black bg-transparent text-amber-500 focus:outline-none"
              />
            ) : (
              <span className="font-mono text-xl font-black text-white/80">
                {formatRadix(currentValMasked, 10, bitSize)}
              </span>
            )}
          </div>

          {/* OCT */}
          <div
            onClick={() => setActiveRadix(8)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              activeRadix === 8
                ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="w-12 text-xs font-black tracking-widest text-amber-500">OCT</span>
            {activeRadix === 8 ? (
              <input
                type="text"
                value={inputStr}
                onChange={(e) => handleUpdatePrimary(e.target.value, 8)}
                className="w-full text-right font-mono text-xl font-black bg-transparent text-amber-500 focus:outline-none"
              />
            ) : (
              <span className="font-mono text-xl font-black text-white/80">
                {formatRadix(currentValMasked, 8, bitSize)}
              </span>
            )}
          </div>

          {/* BIN */}
          <div
            onClick={() => setActiveRadix(2)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              activeRadix === 2
                ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="w-12 text-xs font-black tracking-widest text-amber-500">BIN</span>
            {activeRadix === 2 ? (
              <input
                type="text"
                value={inputStr}
                onChange={(e) => handleUpdatePrimary(e.target.value, 2)}
                className="w-full text-right font-mono text-base sm:text-xl font-black bg-transparent text-amber-500 focus:outline-none tracking-wider"
              />
            ) : (
              <span className="font-mono text-base sm:text-xl font-black text-white/80 tracking-wider overflow-x-auto">
                {formatRadix(currentValMasked, 2, bitSize)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bitwise Controls & Operations */}
      <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        
        {/* Operand B Input for Binary Bitwise Operations */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-black uppercase tracking-wider text-amber-500 w-24">Operand B:</label>
          <input
            type="text"
            value={inputStr2}
            onChange={(e) => handleUpdateSecondary(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-sm text-white focus:outline-none focus:border-amber-500"
            placeholder="Operand B value"
          />
        </div>

        {/* Bitwise Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {(['AND', 'OR', 'XOR', 'NOT', 'NAND', 'NOR', 'XNOR', 'LSH', 'RSH'] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => handleApplyBitwise(op)}
              className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500 hover:text-black text-xs font-black font-mono transition-all text-white cursor-pointer uppercase tracking-wider"
            >
              {op}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setVal(0n);
              setInputStr('0');
            }}
            className="py-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            CLR
          </button>
        </div>
      </div>

      {/* Interactive Bit Toggle Grid */}
      <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-black text-xs text-amber-500 flex items-center gap-2 uppercase tracking-widest">
            <Layers className="w-4 h-4 text-amber-500" /> Interactive Bit Matrix
          </h3>
          <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">MSB ← LSB</span>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 pt-2">
          {Array.from({ length: bitSize }).map((_, idx) => {
            const bitPos = bitSize - 1 - idx;
            const bitVal = (currentValMasked >> BigInt(bitPos)) & 1n;
            const isSet = bitVal === 1n;

            return (
              <button
                key={bitPos}
                type="button"
                onClick={() => handleToggleBit(bitPos)}
                title={`Bit ${bitPos}: Click to toggle`}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                  isSet
                    ? 'bg-amber-500 text-black border-amber-400 font-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-black/40 text-white/40 border-white/10 hover:border-amber-500 hover:text-white'
                }`}
              >
                <span className="font-mono text-sm font-black">{isSet ? '1' : '0'}</span>
                <span className="text-[8px] opacity-60 font-mono mt-0.5">{bitPos}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
