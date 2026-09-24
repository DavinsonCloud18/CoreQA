'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function ModuleList({ modules, sessionId }: { modules: any[], sessionId: string }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [takeoverModal, setTakeoverModal] = useState<{ isOpen: boolean, moduleId: string | null, moduleName: string | null, currentOwner: string | null }>({
    isOpen: false,
    moduleId: null,
    moduleName: null,
    currentOwner: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setCurrentUser(parsed.user);
      } catch (e) {}
    }
  }, []);

  const executeClaim = async (moduleId: string) => {
    if (!currentUser) return alert('No user available to claim module');
    setIsSubmitting(true);
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
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while claiming the module');
      setIsSubmitting(false);
    }
  };

  const handleClaimClick = (e: React.MouseEvent, m: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (m.isClaimed) {
      setTakeoverModal({
        isOpen: true,
        moduleId: m.id,
        moduleName: m.name,
        currentOwner: m.claimedBy
      });
    } else {
      executeClaim(m.id);
    }
  };

  const confirmTakeover = () => {
    if (takeoverModal.moduleId) {
      executeClaim(takeoverModal.moduleId);
    }
  };

  const cancelTakeover = () => {
    setTakeoverModal({ isOpen: false, moduleId: null, moduleName: null, currentOwner: null });
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="w-full h-32 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl">
        <p className="text-white/50 text-center font-medium">No modules assigned to this session.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {modules.map((m: any) => {
          const passedCount = m.statusBreakdown?.['PASSED'] || 0;
          const notesCount = m.statusBreakdown?.['PASSED WITH NOTES'] || 0;
          const failedCount = m.statusBreakdown?.['FAILED'] || 0;
          const blockedCount = m.statusBreakdown?.['BLOCKED'] || 0;
          const droppedCount = m.statusBreakdown?.['DROPPED'] || 0;
          const todoCount = m.statusBreakdown?.['TO DO'] || 0;
          const untestedCount = m.statusBreakdown?.['UNTESTED'] || 0;

          const totalTestcases = m.testcaseCount || 0;
          const effectiveTotal = totalTestcases - droppedCount;
          const executedCount = totalTestcases - (todoCount + untestedCount);
          const totalPassed = passedCount + notesCount;
          
          const completionPct = totalTestcases > 0 ? Math.round((executedCount / totalTestcases) * 100) : 0;
          const passedPct = effectiveTotal > 0 ? Math.round((totalPassed / effectiveTotal) * 100) : 0;
          
          const isDone = (todoCount + untestedCount) === 0 && failedCount === 0 && blockedCount === 0 && effectiveTotal > 0;
          
          return (
            <Link 
              href={`/dashboard/sessions/${sessionId}/execution?moduleId=${m.id}`}
              key={m.id}
              className="group p-5 rounded-3xl bg-slate-900 border border-slate-700 hover:border-indigo-400 transition-colors relative flex flex-col justify-between"
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">{m.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-medium tracking-wide bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">{m.code || 'MOD'}</span>
                        {isDone && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2 h-8">{m.description || 'No description available for this module.'}</p>
                
                {/* Progress Indicators */}
                <div className="mb-4 space-y-3">
                  {/* Executed Progress */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">Executed</span>
                      <span className="text-indigo-300 font-bold">{completionPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${completionPct}%` }}></div>
                    </div>
                  </div>

                  {/* Passed Progress */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">Passed Rate</span>
                      <span className="text-emerald-300 font-bold">{passedPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${passedPct}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Claim / Execution Action */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                  
                  {/* Claim Status */}
                  <div className="flex items-center gap-2">
                    {m.isClaimed ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-[10px]">
                          {m.claimedBy.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Claimed by</span>
                          <span className="text-[11px] text-white font-medium truncate max-w-[60px]">{m.claimedBy}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Status</span>
                        <span className="text-[11px] text-amber-400 font-medium">Unclaimed</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {(!m.isClaimed || (m.isClaimed && m.claimedById !== currentUser?.id)) ? (
                     <button 
                       onClick={(e) => handleClaimClick(e, m)}
                       className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition-colors z-20 relative"
                     >
                       {m.isClaimed ? 'Take Over' : 'Claim'}
                     </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                      Execute <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                  )}
                </div>

              </div>
            </Link>
          );
        })}
      </div>

      {/* Takeover Confirmation Modal */}
      {takeoverModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-xl relative">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/30 mb-6 mx-auto shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-black text-white text-center mb-2">Takeover Module?</h2>
            <p className="text-slate-300 text-center text-sm mb-8 leading-relaxed">
              Module <strong className="text-white font-bold">{takeoverModal.moduleName}</strong> is currently claimed by <strong className="text-rose-300 font-bold">{takeoverModal.currentOwner}</strong>. Are you sure you want to take over their claim?
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={cancelTakeover}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 border border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={confirmTakeover}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-500 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)] disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Yes, Take Over'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
