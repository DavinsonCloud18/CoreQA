const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/UserAssignments.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update sessionGroups mapping
const oldGroupLogic = `        // Group modules by session for this user
        const sessionGroups: Record<string, any[]> = {};
        assignment.modules.forEach((m: any) => {
          const sName = m.session.name;
          if (!sessionGroups[sName]) sessionGroups[sName] = [];
          sessionGroups[sName].push(m.module);
        });`;
const newGroupLogic = `        // Group modules by session for this user
        const sessionGroups: Record<string, any[]> = {};
        assignment.modules.forEach((m: any) => {
          const sName = m.session.name;
          if (!sessionGroups[sName]) sessionGroups[sName] = [];
          sessionGroups[sName].push({ ...m.module, stats: m.stats });
        });`;
content = content.replace(oldGroupLogic, newGroupLogic);

// 2. Add stats text to UI
const oldExpanded = `                          <span className="bg-slate-900/80 text-indigo-300/80 px-1.5 py-0.5 rounded shadow-sm">
                            {mod._count?.testcases || 0} TCs
                          </span>
                        </span>
                      ))}`;
const newExpanded = `                          <span className="bg-slate-900/80 text-indigo-300/80 px-1.5 py-0.5 rounded shadow-sm">
                            {mod._count?.testcases || 0} TCs
                          </span>
                          {mod.stats && Object.keys(mod.stats).length > 0 && (
                            <span className="text-[9px] text-white/40 border-l border-slate-700/50 pl-1.5 ml-0.5">
                              {Object.entries(mod.stats).map(([k, v]) => \`\${v} \${k}\`).join(', ')}
                            </span>
                          )}
                        </span>
                      ))}`;
content = content.replace(oldExpanded, newExpanded);

fs.writeFileSync(file, content, 'utf8');
console.log('Frontend update successful');
