'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function SessionSelector({ currentSession }: { currentSession?: string }) {
  const [sessions, setSessions] = useState<{id: string, name: string}[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/sessions' || 'http://localhost:4000/sessions')
      .then(res => res.json())
      .then(json => setSessions(json.data || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setIsOpen(false);
    setSearchQuery('');
    if (val) {
      router.push(`${pathname}?session=${val}`);
    } else {
      router.push(`${pathname}`);
    }
  };

  const filteredSessions = sessions.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentSessionName = currentSession ? sessions.find(s => s.id === currentSession)?.name || 'Unknown Session' : 'Active Sessions';

  return (
    <div className="relative group inline-block z-50" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center bg-[#0f1117] border border-indigo-500/30 hover:border-indigo-400/80 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] w-[300px]"
      >
        {/* Context Icon */}
        <div className="pl-4 pr-3 py-3 flex items-center justify-center text-indigo-400 bg-indigo-500/10 border-r border-indigo-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        
        {/* Selected Value */}
        <div className="flex-1 px-4 py-3 text-white font-bold text-sm tracking-wide truncate">
          {currentSessionName}
        </div>
        
        {/* Custom Chevron */}
        <div className={`absolute right-3 pointer-events-none ${isOpen ? 'text-white rotate-180' : 'text-indigo-400 group-hover:text-white'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-slate-900 border border-indigo-500/30 rounded-xl shadow-sm overflow-hidden    ">
          <div className="p-2 border-b border-slate-800 bg-slate-800">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-full bg-black/30 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            <div 
              onClick={() => handleSelect('')}
              className={`px-4 py-3 text-sm cursor-pointer transition-colors ${!currentSession ? 'bg-indigo-500/20 text-indigo-300 font-bold border-l-2 border-indigo-500' : 'text-white hover:bg-white/5 font-medium'}`}
            >
              Active Sessions
            </div>
            
            {filteredSessions.length > 0 ? (
              <>
                {filteredSessions.slice(0, 10).map(s => (
                  <div 
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors ${s.id === currentSession ? 'bg-indigo-500/20 text-indigo-300 font-bold border-l-2 border-indigo-500' : 'text-white hover:bg-white/5 font-medium'}`}
                  >
                    {s.name}
                  </div>
                ))}
                {filteredSessions.length > 10 && (
                  <div className="px-4 py-3 text-xs text-center text-white/40 italic bg-slate-800">
                    + {filteredSessions.length - 10} more sessions. Type to refine.
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-white/40">
                No sessions found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
