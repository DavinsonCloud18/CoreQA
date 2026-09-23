import React from 'react';

export function ModuleProgress({ modules }: { modules: any[] }) {
  if (!modules || modules.length === 0) {
    return <p className="text-white/40 italic text-center py-8">No failed modules detected yet. Great job!</p>;
  }

  return (
    <div className="space-y-8">
      {modules.map((mod, idx) => (
        <div key={idx} className="group">
          <div className="flex justify-between items-end mb-3">
            <span className="text-white/90 font-bold text-lg group-hover:text-white transition-colors">{mod.moduleName}</span>
            <div className="text-right">
              <span className="block text-rose-400 font-bold text-sm drop-shadow-sm">{mod.failedRate}% Failed</span>
              <span className="text-white/50 text-xs font-medium">{mod.failedCount} / {mod.totalTestcases} testcases</span>
            </div>
          </div>
          <div className="w-full bg-slate-900/50 rounded-full h-4 overflow-hidden border border-slate-800 shadow-inner">
            <div 
              className="bg-indigo-600 h-full rounded-full   ease-out shadow-[0_0_15px_rgba(244,63,94,0.6)]" 
              style={{ width: `${mod.failedRate}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
