'use client';

import { useRouter } from 'next/navigation';

export function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
      router.refresh();
    } else {
      router.back();
      setTimeout(() => {
        router.refresh();
      }, 50);
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className="w-12 h-12 bg-white/5 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center transition-colors shrink-0"
      title="Go Back"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
    </button>
  );
}
