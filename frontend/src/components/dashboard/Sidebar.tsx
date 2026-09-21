'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CreateSessionModal } from './CreateSessionModal';

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    // Exact match for dashboard, partial match for others
    const isActive = path === '/dashboard' ? pathname === path : pathname?.startsWith(path);
    
    if (isActive) {
      return "flex items-center gap-4 px-5 py-4 bg-white/10 text-white rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/10 transition-all";
    }
    return "flex items-center gap-4 px-5 py-4 text-indigo-100/70 hover:text-white rounded-2xl transition-all hover:bg-white/5 group";
  };

  return (
    <div className="relative z-10 w-72 h-screen border-r border-white/20 bg-white/5 backdrop-blur-2xl flex flex-col pt-8 pb-4">
      <div className="px-8 mb-12 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-tr from-rose-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">CoreQA</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Session
        </button>

        <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span className="font-semibold text-lg">Dashboard</span>
        </Link>

        <Link href="/dashboard/sessions" className={getLinkClasses('/dashboard/sessions')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/sessions') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <span className="font-medium text-lg">Execution Log</span>
        </Link>
        <Link href="/dashboard/team" className={getLinkClasses('/dashboard/team')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/team') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          <span className="font-medium text-lg">Team</span>
        </Link>
        <Link href="#" className={getLinkClasses('/dashboard/settings')}>
          <svg className={`w-5 h-5 ${!pathname?.startsWith('/dashboard/settings') ? 'group-hover:scale-110 transition-transform' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="font-medium text-lg">Settings</span>
        </Link>
      </nav>

      <div className="p-4 mx-4 mb-2 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white/20 shadow-md">
             <span className="text-sm font-bold text-white">AD</span>
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-semibold text-white">Admin User</span>
             <span className="text-xs text-indigo-200/70 font-medium">admin@coreqa.com</span>
           </div>
        </div>
      </div>

      <CreateSessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
