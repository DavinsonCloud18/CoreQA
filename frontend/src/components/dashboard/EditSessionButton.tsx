'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { EditSessionModal } from './EditSessionModal';

export function EditSessionButton({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        setCurrentUser(JSON.parse(authData).user);
      } catch (e) {}
    }

    const savedToast = sessionStorage.getItem('session_toast_message');
    if (savedToast) {
      setToastMessage(savedToast);
      sessionStorage.removeItem('session_toast_message');
    }
  }, []);

  // Timer auto-dismiss 3 detik yang tahan terhadap React StrictMode / re-render
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const toastElement = mounted && toastMessage ? createPortal(
    <div className="fixed top-6 right-6 z-[99999] pointer-events-auto flex items-center gap-3 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(16,185,129,0.25)]">
      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <div className="font-bold text-sm text-emerald-400">Berhasil!</div>
        <div className="text-xs text-white/80">{toastMessage}</div>
      </div>
      <button 
        onClick={() => setToastMessage(null)} 
        className="ml-3 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        title="Tutup"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>,
    document.body
  ) : null;

  if (!session || session.status === 'Finished' || session.status === 'Done' || !currentUser || currentUser.role === 'QA Member') {
    return toastElement;
  }

  return (
    <>
      <button 
        id="edit-session-btn"
        data-testid="edit-session-btn"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-4 h-10 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-bold rounded-xl transition-colors border border-indigo-500/30 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        Edit Session
      </button>
      {isOpen && (
        <EditSessionModal isOpen={isOpen} onClose={() => setIsOpen(false)} session={session} />
      )}
      {toastElement}
    </>
  );
}
