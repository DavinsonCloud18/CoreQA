'use client';

export function UserAssignments({ assignments }: { assignments: any[] }) {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 bg-black/20 rounded-xl border border-white/5">
        <svg className="w-8 h-8 text-white/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <span className="text-white/50 text-xs font-medium">No team assignments found</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
      {assignments.map((assignment, i) => (
        <div 
          key={i} 
          className="group relative flex flex-col p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 rounded-xl transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                 <span className="text-[10px] font-bold text-white">{assignment.user.name.substring(0,2).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-xs tracking-wide truncate">{assignment.user.name}</p>
                <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                   {assignment.modules.slice(0, 2).map((m: any, idx: number) => (
                     <span 
                       key={idx} 
                       className="text-[9px] font-semibold text-white/70 bg-black/40 px-2 py-0.5 rounded border border-white/10 truncate max-w-[100px]"
                       title={m.module.name}
                     >
                       {m.module.name}
                     </span>
                   ))}
                   {assignment.modules.length > 2 && (
                     <span className="text-[9px] font-semibold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/20 shrink-0">
                       +{assignment.modules.length - 2}
                     </span>
                   )}
                </div>
              </div>
            </div>
            
            <div className="pl-3 shrink-0">
              <span className="text-[10px] font-bold text-white/60 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                {assignment.modules.length} Mods
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
