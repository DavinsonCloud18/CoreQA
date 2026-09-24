const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/UserAssignments.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update the badge in the row (line 83)
const oldBadge = `              {/* Module count badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-indigo-300/90 bg-indigo-500/15 px-2 py-0.5 rounded-md">
                  {assignment.modules.length} {assignment.modules.length === 1 ? 'module' : 'modules'}
                </span>`;
const newBadge = `              {/* Module count badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-emerald-300/90 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                  {assignment.modules.reduce((sum: number, m: any) => sum + (m.module._count?.testcases || 0), 0)} TCs
                </span>
                <span className="text-[10px] font-bold text-indigo-300/90 bg-indigo-500/15 px-2 py-0.5 rounded-md">
                  {assignment.modules.length} {assignment.modules.length === 1 ? 'module' : 'modules'}
                </span>`;
content = content.replace(oldBadge, newBadge);

// Update the expanded detail (line 99)
const oldDetail = `                      {modules.map((mod: any, idx: number) => (
                        <li key={idx} className="text-xs text-indigo-200/80 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-indigo-500/50"></span>
                          <span className="truncate">{mod.name}</span>
                        </li>
                      ))}`;
const newDetail = `                      {modules.map((mod: any, idx: number) => (
                        <li key={idx} className="text-xs text-indigo-200/80 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-indigo-500/50"></span>
                          <span className="truncate">{mod.name}</span>
                          <span className="ml-auto text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 shadow-sm shrink-0">
                            {mod._count?.testcases || 0} TCs
                          </span>
                        </li>
                      ))}`;
content = content.replace(oldDetail, newDetail);

fs.writeFileSync(file, content, 'utf8');
console.log('Frontend update successful');
