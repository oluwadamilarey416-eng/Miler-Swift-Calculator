import { HistoryItem } from '../../types';
import { Trash2, X, Clock, CornerDownLeft, ShieldCheck } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectExpression: (expr: string) => void;
  onSelectResult: (res: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectExpression,
  onSelectResult,
  onDeleteItem,
  onClearAll
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#1A1D23] h-full shadow-2xl flex flex-col border-l border-white/10 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-amber-500 text-sm uppercase tracking-widest">Calculation Log</h2>
            <span className="text-[10px] text-black bg-amber-500 px-2 py-0.5 rounded-full font-black">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                id="clear-all-history-btn"
                className="text-xs text-amber-500 hover:bg-amber-500/10 px-2.5 py-1 rounded-xl transition-colors flex items-center gap-1 font-bold uppercase tracking-wider border border-amber-500/20 cursor-pointer"
                title="Clear All History"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              id="close-history-drawer-btn"
              className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="px-4 py-2 bg-black/20 border-b border-white/5 flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Local storage persistence only</span>
        </div>

        {/* History Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-20 text-amber-500" />
              <p className="text-xs font-black uppercase tracking-widest">No calculation history yet</p>
              <p className="text-[11px] mt-1 text-white/20">Your recent calculations will appear here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 transition-all relative"
              >
                {/* Delete single item */}
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  title="Delete item"
                  className="absolute top-2 right-2 p-1 rounded text-white/30 hover:text-amber-500 hover:bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Mode Tag & Date */}
                <div className="flex items-center gap-2 text-[10px] text-white/30 mb-1 font-mono">
                  <span className="uppercase font-black tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded">
                    {item.mode}
                  </span>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>

                {/* Expression Clickable */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectExpression(item.expression);
                    onClose();
                  }}
                  className="w-full text-left font-mono text-xs text-white/60 hover:text-white transition-colors break-all cursor-pointer"
                  title="Click to load expression into editor"
                >
                  {item.expression}
                </button>

                {/* Result Clickable */}
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Result:</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectResult(item.result);
                      onClose();
                    }}
                    className="font-mono text-base font-black text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Click to insert result into editor"
                  >
                    = {item.result}
                    <CornerDownLeft className="w-3 h-3 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
