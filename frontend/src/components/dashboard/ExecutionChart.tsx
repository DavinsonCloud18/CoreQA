'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS: Record<string, string> = {
  'PASSED': '#34d399', // emerald-400
  'FAILED': '#fb7185', // rose-400
  'PASSED WITH NOTES': '#fbbf24', // amber-400
  'BLOCKED': '#94a3b8', // slate-400
  'DROPPED': '#71717a', // zinc-500
  'TO DO': '#818cf8', // indigo-400
  'UNTESTED': '#64748b', // slate-500
};

export function ExecutionChart({ summary }: { summary: Record<string, number> }) {
  // Transform summary object into array for Recharts, excluding 'total'
  const data = Object.entries(summary || {})
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({
      name: key,
      value: value,
    }));

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="w-full h-[160px] flex items-center justify-center text-white/50 text-sm">
        No execution data available.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-2">
      <div className="w-[140px] h-[140px] shrink-0 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={66}
              paddingAngle={3}
              dataKey="value"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={2}
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '12px' }}
              itemStyle={{ color: 'white', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-white tracking-tight">{total}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[130px] justify-center px-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[entry.name] || '#94a3b8' }}></span>
              <span className="text-slate-300 font-medium truncate">
                {entry.name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </span>
            </div>
            <span className="font-bold text-white tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
