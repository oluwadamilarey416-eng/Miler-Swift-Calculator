import { useState, useMemo } from 'react';
import { convertUnit, UNIT_CATEGORIES } from '../../features/converter/unitConverter';
import { ArrowLeftRight } from 'lucide-react';

export function UnitConverterMode() {
  const [selectedCatId, setSelectedCatId] = useState<string>('length');

  const activeCategory = useMemo(() => {
    return UNIT_CATEGORIES.find(c => c.id === selectedCatId) || UNIT_CATEGORIES[0];
  }, [selectedCatId]);

  const [fromUnitId, setFromUnitId] = useState<string>(activeCategory.units[0]?.id || '');
  const [toUnitId, setToUnitId] = useState<string>(activeCategory.units[1]?.id || '');
  const [val, setVal] = useState<string>('1');

  // Handle category change reset
  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = UNIT_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  const handleSwapUnits = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const numVal = parseFloat(val) || 0;
  const conversion = useMemo(() => {
    return convertUnit(numVal, activeCategory, fromUnitId, toUnitId);
  }, [numVal, activeCategory, fromUnitId, toUnitId]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Category Selection Tabs */}
      <div className="bg-[#1A1D23] p-5 rounded-2xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-amber-500" />
          <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">Unit Converter</h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {UNIT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCatId === cat.id
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Converter Panel */}
      <div className="bg-[#1A1D23] p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          
          {/* FROM UNIT */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40">From Unit</label>
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full px-3 py-3 bg-black/60 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-amber-500"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#1A1D23] text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>

            <input
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full p-3.5 bg-black/60 border border-white/10 rounded-xl font-mono text-xl font-black text-white focus:outline-none focus:border-amber-500"
              placeholder="0"
            />
          </div>

          {/* SWAP BUTTON */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleSwapUnits}
              title="Swap units"
              className="p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* TO UNIT */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40">To Unit</label>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full px-3 py-3 bg-black/60 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-amber-500"
            >
              {activeCategory.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#1A1D23] text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>

            <div className="w-full p-3.5 bg-black/80 border border-amber-500/30 rounded-xl font-mono text-2xl font-black text-amber-500 overflow-x-auto">
              {conversion.result}
            </div>
          </div>
        </div>

        {/* Formula Explanation Banner */}
        {conversion.formula && (
          <div className="p-4 bg-black/40 rounded-xl border border-white/10 text-center text-xs text-white/60 font-mono">
            Conversion Formula: <span className="font-black text-amber-500">{conversion.formula}</span>
          </div>
        )}
      </div>
    </div>
  );
}
