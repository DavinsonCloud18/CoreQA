"use client";
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'coreqa_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-5 py-2.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-xl hover:bg-rose-500/30 hover:border-rose-500/50 hover:text-white transition-all font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-900/20 active:scale-95"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      Sign Out
    </button>
  );
}
