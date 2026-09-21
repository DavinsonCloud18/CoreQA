'use client';

export function UserAssignments({ assignments }: { assignments: any[] }) {
  if (!assignments || assignments.length === 0) {
    return <div className="text-white/50 py-4 text-center">No modules assigned yet.</div>;
  }

  return (
    <ul className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 divide-y divide-white/10">
      {assignments.map((assignment, i) => (
        <li key={i} className="pt-3 first:pt-0 flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 shadow-md shrink-0">
               <span className="text-xs font-bold text-white">{assignment.user.name.substring(0,2).toUpperCase()}</span>
            </div>
            <p className="text-white font-semibold text-sm tracking-wide">{assignment.user.name}</p>
          </div>
          
          <div className="pl-11 text-xs text-white/60">
            <span className="font-semibold text-indigo-300/80">Assigned Modules:</span>{' '}
            {assignment.modules.map((m: any) => m.module.name).join(', ')}
          </div>
        </li>
      ))}
    </ul>
  );
}
