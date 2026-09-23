'use client';

import { useState } from 'react';

// Color palette for avatar backgrounds — deterministic by index
const AVATAR_COLORS = [
  'from-indigo-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-purple-600',
  'from-lime-500 to-green-600',
  'from-sky-500 to-indigo-600',
];

export function UserAssignments({ assignments }: { assignments: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!assignments || assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-slate-800 rounded-2xl border border-dashed border-slate-800">
        <svg className="w-10 h-10 text-white/15 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <span className="text-white/40 text-sm font-medium">No team assignments yet</span>
        <span className="text-white/25 text-xs mt-1">Assign modules in a session to see them here</span>
      </div>
    );
  }

  // Unique session names across all assignments
  const allSessionNames = Array.from(
    new Set(assignments.flatMap(a => a.modules.map((m: any) => m.session.name)))
  );

  return (
    <div className="space-y-0 max-h-[420px] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 mb-2 sticky top-0 z-20 bg-slate-900  rounded-lg border border-slate-800">
        <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Member</span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">{assignments.length} assigned</span>
      </div>

      {assignments.map((assignment, i) => {
        const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length];
        const isExpanded = expandedId === assignment.user.id;

        // Group modules by session for this user
        const sessionGroups: Record<string, string[]> = {};
        assignment.modules.forEach((m: any) => {
          const sName = m.session.name;
          if (!sessionGroups[sName]) sessionGroups[sName] = [];
          sessionGroups[sName].push(m.module.name);
        });

        return (
          <div key={assignment.user.id}>
            {/* Row */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : assignment.user.id)}
              className={`
                group flex items-center gap-3 px-3 py-2.5 cursor-pointer
                rounded-xl transition-colors 
                ${isExpanded 
                  ? 'bg-indigo-500/10 border border-indigo-500/30' 
                  : 'hover:bg-white/5 border border-transparent'}
              `}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="text-[10px] font-black text-white leading-none">
                  {assignment.user.name.substring(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Name + email */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-[13px] truncate leading-tight">{assignment.user.name}</p>
                <p className="text-white/35 text-[10px] truncate leading-tight">{assignment.user.email}</p>
              </div>

              {/* Module count badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-indigo-300/90 bg-indigo-500/15 px-2 py-0.5 rounded-md">
                  {assignment.modules.length} {assignment.modules.length === 1 ? 'module' : 'modules'}
                </span>
                {/* Chevron */}
                <svg
                  className={`w-3.5 h-3.5 text-white/30 transition-transform  ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Detail */}
            {isExpanded && (
              <div className="ml-11 mr-3 mb-2 mt-1 space-y-2    ">
                {Object.entries(sessionGroups).map(([sessionName, moduleNames]) => (
                  <div key={sessionName} className="bg-black/30 rounded-lg p-2.5 border border-slate-800">
                    <p className="text-[9px] uppercase tracking-wider font-bold text-white/30 mb-1.5">{sessionName}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {moduleNames.map((modName, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold text-white/75 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-200 px-2 py-1 rounded-md border border-slate-800 hover:border-indigo-500/30 transition-colors cursor-default"
                        >
                          {modName}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
