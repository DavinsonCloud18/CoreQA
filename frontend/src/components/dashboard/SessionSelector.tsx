'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function SessionSelector({ currentSession }: { currentSession?: string }) {
  const [sessions, setSessions] = useState<{id: string, name: string}[]>([]);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/sessions' || 'http://localhost:4000/sessions')
      .then(res => res.json())
      .then(json => setSessions(json.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`${pathname}?session=${val}`);
    } else {
      router.push(`${pathname}`);
    }
  };

  return (
    <div className="relative group inline-block">
      {/* Hover Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
      
      <div className="relative flex items-center bg-[#0f1117] border border-indigo-500/30 rounded-xl overflow-hidden cursor-pointer shadow-lg">
        {/* Context Icon */}
        <div className="pl-4 pr-3 py-2.5 flex items-center justify-center text-indigo-400 bg-indigo-500/10 border-r border-indigo-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        
        {/* Select Dropdown */}
        <select 
          className="w-full bg-transparent pl-4 pr-10 py-2.5 text-white font-bold text-sm tracking-wide focus:outline-none appearance-none min-w-[240px] cursor-pointer"
          value={currentSession || ''}
          onChange={handleChange}
        >
          <option value="" className="bg-slate-900 font-normal text-white/50">All Sessions</option>
          {sessions.map(s => (
            <option key={s.id} value={s.id} className="bg-slate-900 text-white font-semibold py-2">
              {s.name}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron */}
        <div className="absolute right-3 pointer-events-none text-indigo-400 group-hover:text-white transition-colors duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
}
