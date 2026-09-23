'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function ModuleList({ modules, sessionId }: { modules: any[], sessionId: string }) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setCurrentUser(parsed.user);
      } catch (e) {}
    }
  }, []);

  const handleClaim = async (e: React.MouseEvent, moduleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return alert('No user available to claim module');

    try {
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/sessions/${sessionId}/modules/${moduleId}/claim`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`
        },
        body: JSON.stringify({ userId: currentUser.id })
      });
      
      if (res.ok) {
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to claim module');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while claiming the module');
    }
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl">
        <p className="text-white/50 text-center font-medium">No modules assigned to this session.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {modules.map((m: any) => (
        <Link 
          href={`/dashboard/sessions/${sessionId}/execution?moduleId=${m.id}`}
          key={m.id}
          className="group p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/10  border border-slate-700 shadow-sm hover: hover:border-indigo-400/50  relative overflow-hidden flex flex-col justify-between"
        >
          
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-500/20 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">{m.name}</h3>
                </div>
                {m.isClaimed && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-emerald-400/80 tracking-wider">Claimed by</span>
                    <span className="text-sm font-semibold text-emerald-300">{m.claimedBy}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-indigo-100/70 mb-4 line-clamp-2">{m.description || 'No description available for this module.'}</p>
              
              <div className="flex gap-2 flex-wrap mb-4">
                {m.statusBreakdown?.['PASSED'] > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Passed: {m.statusBreakdown['PASSED']}
                  </span>
                )}
                {m.statusBreakdown?.['FAILED'] > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Failed: {m.statusBreakdown['FAILED']}
                  </span>
                )}
                {m.statusBreakdown?.['PASSED WITH NOTES'] > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Notes: {m.statusBreakdown['PASSED WITH NOTES']}
                  </span>
                )}
                {m.statusBreakdown?.['BLOCKED'] > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-300 border border-slate-500/30">
                    Blocked: {m.statusBreakdown['BLOCKED']}
                  </span>
                )}
                {m.statusBreakdown?.['TO DO'] > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    TO DO: {m.statusBreakdown['TO DO']}
                  </span>
                )}
                {m.statusBreakdown?.['DROPPED'] > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-500/20 text-zinc-300 border border-zinc-500/30">
                    Dropped: {m.statusBreakdown['DROPPED']}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
              {!m.isClaimed || (m.isClaimed && m.claimedById !== currentUser?.id) ? (
                 <button 
                   onClick={(e) => handleClaim(e, m.id)}
                   className="px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 hover:text-white text-sm font-bold rounded-full border border-rose-500/30 transition-colors z-20 relative shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                 >
                   {m.isClaimed ? 'Take Over Claim' : 'Claim Module'}
                 </button>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/80 group-hover:text-emerald-300 transition-colors">Execute Now →</span>
              )}
              
              <div className="flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                <span className="text-indigo-200 font-bold text-sm">{m.testcaseCount}</span>
                <span className="text-indigo-300/70 text-xs font-semibold">Testcases</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
