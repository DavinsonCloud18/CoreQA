const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/UserAssignments.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the sessionGroups creation to store the entire module object, not just the name
const oldGroupLogic = `        // Group modules by session for this user
        const sessionGroups: Record<string, string[]> = {};
        assignment.modules.forEach((m: any) => {
          const sName = m.session.name;
          if (!sessionGroups[sName]) sessionGroups[sName] = [];
          sessionGroups[sName].push(m.module.name);
        });`;
const newGroupLogic = `        // Group modules by session for this user
        const sessionGroups: Record<string, any[]> = {};
        assignment.modules.forEach((m: any) => {
          const sName = m.session.name;
          if (!sessionGroups[sName]) sessionGroups[sName] = [];
          sessionGroups[sName].push(m.module);
        });`;
content = content.replace(oldGroupLogic, newGroupLogic);

// 2. Add total TC count to the row badge
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

// 3. Update expanded view to render module name and TC count
const oldExpanded = `                    <div className="flex flex-wrap gap-1.5">
                      {moduleNames.map((modName, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold text-white/75 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-200 px-2 py-1 rounded-md border border-slate-800 hover:border-indigo-500/30 transition-colors cursor-default"
                        >
                          {modName}
                        </span>
                      ))}
                    </div>`;
const newExpanded = `                    <div className="flex flex-wrap gap-1.5">
                      {moduleNames.map((mod: any, idx: number) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 text-[10px] font-semibold text-white/75 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-200 px-2 py-1 rounded-md border border-slate-800 hover:border-indigo-500/30 transition-colors cursor-default"
                        >
                          <span>{mod.name}</span>
                          <span className="bg-slate-900/80 text-indigo-300/80 px-1.5 py-0.5 rounded shadow-sm">
                            {mod._count?.testcases || 0} TCs
                          </span>
                        </span>
                      ))}
                    </div>`;
// Replace `moduleNames` in map with `mod: any, idx: number` because sessionGroups is now an array of objects
content = content.replace(oldExpanded, newExpanded);

// We need to also rename moduleNames parameter in Object.entries.map
content = content.replace(
  `{Object.entries(sessionGroups).map(([sessionName, moduleNames]) => (`,
  `{Object.entries(sessionGroups).map(([sessionName, moduleNames]) => (`
); // No change needed for parameter name, we can leave it as moduleNames and type it as `any` or just rename it. Let's rename it to modules for clarity.
content = content.replace(
  `{Object.entries(sessionGroups).map(([sessionName, moduleNames]) => (`,
  `{Object.entries(sessionGroups).map(([sessionName, modules]) => (`
);
content = content.replace(
  `{moduleNames.map((mod: any, idx: number) => (`,
  `{modules.map((mod: any, idx: number) => (`
);


fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
