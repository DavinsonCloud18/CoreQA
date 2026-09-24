'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className="w-12 h-12 bg-white/5 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center transition-colors shrink-0"
      title="Go Back"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
    </button>
  );
}
