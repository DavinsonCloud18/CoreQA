'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CompleteSessionButton({ sessionId, initialStatus, isReady }: { sessionId: string, initialStatus: string, isReady: boolean }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleReopen = async () => {
    setIsModalOpen(true);
  };

  const executeReopen = async () => {
    setLoading(true);
    setIsModalOpen(false);
    try {
      const authStr = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStr.access_token}`
        },
        body: JSON.stringify({ status: 'On Progress' })
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to reopen session');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while reopening session');
    } finally {
      setLoading(false);
    }
  };

  if (initialStatus === 'Finished') {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Session Finished
        </div>
        <button 
          onClick={handleReopen}
          disabled={loading}
          className="bg-slate-500/20 hover:bg-slate-500/40 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold  flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
          Reopen
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 ">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-sm">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Reopen Session</h3>
              <p className="text-slate-300 mb-6 text-sm">
                Are you sure you want to reopen this session? The status will change back to On Progress and testcases can be modified again.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeReopen}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-900 bg-amber-500 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-colors"
                >
                  Yes, Reopen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleComplete = async () => {
    if (!isReady) {
      alert('Cannot complete session: Not all active testcases are passed yet.');
      return;
    }
    
    setIsModalOpen(true);
  };

  const executeComplete = async () => {
    setLoading(true);
    setIsModalOpen(false);
    try {
      const authStr = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStr.access_token}`
        },
        body: JSON.stringify({ status: 'Finished' })
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to complete session');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while updating session status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <button 
      onClick={handleComplete}
      disabled={loading || !isReady}
      className={`px-6 py-2.5 rounded-xl font-bold  text-sm flex items-center gap-2 ${
        isReady 
          ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer' 
          : 'bg-white/5 text-white/30 border border-slate-800 cursor-not-allowed'
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Processing...
        </span>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Complete Session
        </>
      )}
    </button>
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 ">
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-sm">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Complete Session</h3>
          <p className="text-slate-300 mb-6 text-sm">
            Are you sure you want to mark this session as finished? This will lock all testcases in this session from further modifications.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={executeComplete}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors"
            >
              Yes, Complete Session
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
