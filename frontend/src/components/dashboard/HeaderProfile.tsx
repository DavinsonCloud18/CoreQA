'use client';

import { useState, useEffect } from 'react';

export function HeaderProfile() {
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

  if (!currentUser) {
    return (
      <div className="flex items-center gap-3 pr-2">
         <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-sm"></div>
         <div className="hidden sm:flex flex-col gap-1.5">
           <div className="w-20 h-3 bg-slate-800 rounded"></div>
           <div className="w-28 h-2 bg-slate-800 rounded"></div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 pr-2 border-r border-slate-700/50 mr-2">
       <div className="flex flex-col items-end hidden sm:flex">
         <span className="text-sm font-semibold text-white leading-tight">{currentUser.name}</span>
         <span className="text-xs text-indigo-200/70 font-medium">{currentUser.role || currentUser.email}</span>
       </div>
       <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-500/30 shadow-md">
         <span className="text-sm font-bold text-white">{currentUser.name.substring(0,2).toUpperCase()}</span>
       </div>
    </div>
  );
}
