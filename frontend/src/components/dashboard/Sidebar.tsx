'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CreateSessionModal } from './CreateSessionModal';

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [attentionCount, setAttentionCount] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setCurrentUser(parsed.user);

        // Fetch My Tasks summary for badge
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        fetch(`${baseUrl}/sessions/my-tasks`, {
          headers: { 'Authorization': `Bearer ${parsed.access_token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data.data?.summary?.statusBreakdown) {
            const breakdown = data.data.summary.statusBreakdown;
            let count = 0;
            for (const status in breakdown) {
              const s = status.toUpperCase();
              if (s !== 'PASSED' && s !== 'DROPPED' && s !== 'PASSED WITH NOTES') {
                count += breakdown[status];
              }
            }
            setAttentionCount(count > 0 ? count : null);
          }
        })
        .catch(e => console.error(e));

      } catch (e) {}
    }
  }, []);

  const getLinkClasses = (path: string) => {
    // Exact match for dashboard, partial match for others
    const isActive = path === '/dashboard' ? pathname === path : pathname?.startsWith(path);
    
    if (isActive) {
      return "flex items-center gap-4 px-5 py-4 bg-slate-900 text-white rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-slate-800 ";
    }
    return "flex items-center gap-4 px-5 py-4 text-indigo-100/70 hover:text-white rounded-2xl  hover:bg-white/5 group";
  };

  return (
    <div className="relative z-10 w-72 h-screen border-r border-slate-700 bg-slate-900  flex flex-col pt-8 pb-4">
      <div className="px-8 mb-12 flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm ">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">CoreQA</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {currentUser?.role !== 'QA Member' && (
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 mb-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-sm  hover:bg-indigo-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Session
        </button>
        )}

        <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span className="font-semibold text-lg">Dashboard</span>
        </Link>

        <Link href="/dashboard/sessions" className={getLinkClasses('/dashboard/sessions')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/sessions') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="font-medium text-lg">Execution Log</span>
        </Link>
        <Link href="/dashboard/tasks" className={getLinkClasses('/dashboard/tasks')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/tasks') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3-10l-4 4-2-2"></path></svg>
          <div className="flex-1 flex items-center justify-between">
            <span className="font-medium text-lg">My Tasks</span>
            {attentionCount !== null && (
              <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                {attentionCount}
              </span>
            )}
          </div>
        </Link>
        <Link href="/dashboard/modules" className={getLinkClasses('/dashboard/modules')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/modules') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className="font-medium text-lg">Modules</span>
        </Link>
        <Link href="/dashboard/testcases" className={getLinkClasses('/dashboard/testcases')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/testcases') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          <span className="font-medium text-lg">Testcases</span>
        </Link>
        <Link href="/dashboard/import-export" className={getLinkClasses('/dashboard/import-export')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/import-export') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <span className="font-medium text-lg">Import / Export TC</span>
        </Link>
        <Link href="/dashboard/team" className={getLinkClasses('/dashboard/team')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/team') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span className="font-medium text-lg">Team</span>
        </Link>
        <Link href="/dashboard/trash" className={getLinkClasses('/dashboard/trash')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/trash') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          <span className="font-medium text-lg">Trash</span>
        </Link>
      </nav>

      <CreateSessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
