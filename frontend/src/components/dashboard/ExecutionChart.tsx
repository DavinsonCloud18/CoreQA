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

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, value, name, percent } = props;
  if (!value) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20; 
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill={COLORS[name] || '#fff'} 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central" 
      className="text-[11px] font-bold font-sans tracking-wide drop-shadow-md capitalize"
    >
      {value} {name.toLowerCase()} ({(percent * 100).toFixed(0)}%)
    </text>
  );
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
      <div className="w-full h-[300px] flex items-center justify-center text-white/50">
        No execution data available.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={2}
            label={renderCustomizedLabel}
            labelLine={(props: any) => {
              if (!props.value) return <></>;
              return <path stroke="rgba(255,255,255,0.2)" strokeWidth={1} d={`M${props.points?.[0]?.x},${props.points?.[0]?.y}L${props.points?.[1]?.x},${props.points?.[1]?.y}`} fill="none" />;
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'white' }} 
            itemStyle={{ color: 'white', fontWeight: 'bold' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
