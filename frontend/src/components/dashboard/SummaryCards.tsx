import React from 'react';

export function SummaryCards({ summary }: { summary: any }) {
  const getPercentage = (count: number) => {
    if (!summary || !summary.total || summary.total === 0) return 0;
    return Math.round((count / summary.total) * 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Passed */}
      <div className="p-6 rounded-[2rem] bg-emerald-500/10 backdrop-blur-xl border border-emerald-400/20 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-emerald-400/40 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full group-hover:bg-emerald-400/30 transition-all duration-500"></div>
        <span className="text-emerald-300 font-bold text-sm tracking-wide uppercase relative z-10">Passed</span>
        <div className="mt-8 flex items-end justify-between relative z-10">
          <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">{summary?.['PASSED'] || 0}</span>
          <span className="text-emerald-200/90 font-bold bg-emerald-500/30 px-3 py-1.5 rounded-lg border border-emerald-400/30 shadow-inner">{getPercentage(summary?.['PASSED'] || 0)}%</span>
        </div>
      </div>
      
      {/* Passed with Notes */}
      <div className="p-6 rounded-[2rem] bg-amber-500/10 backdrop-blur-xl border border-amber-400/20 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-amber-400/40 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[50px] rounded-full group-hover:bg-amber-400/30 transition-all duration-500"></div>
        <span className="text-amber-300 font-bold text-sm tracking-wide uppercase relative z-10">Passed (Notes)</span>
        <div className="mt-8 flex items-end justify-between relative z-10">
          <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">{summary?.['PASSED WITH NOTES'] || 0}</span>
          <span className="text-amber-200/90 font-bold bg-amber-500/30 px-3 py-1.5 rounded-lg border border-amber-400/30 shadow-inner">{getPercentage(summary?.['PASSED WITH NOTES'] || 0)}%</span>
        </div>
      </div>

      {/* Failed */}
      <div className="p-6 rounded-[2rem] bg-rose-500/10 backdrop-blur-xl border border-rose-400/20 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-rose-400/40 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[50px] rounded-full group-hover:bg-rose-400/30 transition-all duration-500"></div>
        <span className="text-rose-300 font-bold text-sm tracking-wide uppercase relative z-10">Failed</span>
        <div className="mt-8 flex items-end justify-between relative z-10">
          <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">{summary?.['FAILED'] || 0}</span>
          <span className="text-rose-200/90 font-bold bg-rose-500/30 px-3 py-1.5 rounded-lg border border-rose-400/30 shadow-inner">{getPercentage(summary?.['FAILED'] || 0)}%</span>
        </div>
      </div>
      
      {/* Untested */}
      <div className="p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full group-hover:bg-white/10 transition-all duration-500"></div>
        <span className="text-indigo-200 font-bold text-sm tracking-wide uppercase relative z-10">Untested</span>
        <div className="mt-8 flex items-end justify-between relative z-10">
          <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{summary?.['UNTESTED'] || 0}</span>
          <span className="text-indigo-200/90 font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">{getPercentage(summary?.['UNTESTED'] || 0)}%</span>
        </div>
      </div>
    </div>
  );
}
