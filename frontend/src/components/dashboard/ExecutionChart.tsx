'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS: Record<string, string> = {
  'PASSED': '#34d399', // emerald-400
  'FAILED': '#fb7185', // rose-400
  'PASSED WITH NOTES': '#fbbf24', // amber-400
  'BLOCKED': '#94a3b8', // slate-400
  'TO DO': '#818cf8', // indigo-400
};

export function ExecutionChart({ summary }: { summary: Record<string, number> }) {
  // Transform summary object into array for Recharts, excluding 'total'
  const data = Object.entries(summary || {})
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => ({
      name: key,
      value: value,
    }));

  if (data.length === 0) {
    return (
      <div className="w-full h-[180px] flex items-center justify-center text-white/50">
        No execution data available.
      </div>
    );
  }

  // Calculate total to show inside the donut
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="45%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={5}
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
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white', fontSize: '12px' }} 
            itemStyle={{ color: 'white', fontWeight: 'bold' }}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            iconType="circle" 
            wrapperStyle={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '24px' }} 
            formatter={(value: string, entry: any) => (
              <span className="text-slate-300 font-medium ml-1">
                {value.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())} 
                <span className="font-bold text-white ml-2">
                  {entry.payload.value}
                </span>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
