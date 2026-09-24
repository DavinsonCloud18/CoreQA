const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ModuleManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add back the early return
if (!content.includes('if (selectedModuleId) {')) {
  content = content.replace('  const canEdit = currentUser?.role === \'Admin\' || currentUser?.role === \'Leader\';', 
    `  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Leader';

  if (selectedModuleId) {
    return <ModuleDetail moduleId={selectedModuleId} onBack={() => setSelectedModuleId(null)} />;
  }`);
}

// 2. Fix the search bar UI styling to look like ExecutionTable
const oldSearchBar = `<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <h2 className="text-xl font-bold text-white shrink-0">System Modules</h2>
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative flex-1 md:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search modules..." 
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-800 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>`;
          
const newSearchBar = `<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 gap-4">
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-indigo-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search modules..." 
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-black/30 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex w-full md:w-auto items-center gap-4">`;

content = content.replace(oldSearchBar, newSearchBar);

// 3. Update table header (Add Jumlah Testcase)
const oldThead = `            <thead>
              <tr className="border-b border-slate-800 bg-white/5">
                <th className="py-4 px-6 text-indigo-200 font-semibold w-16 text-center">No</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-32">Code</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold">Name</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-1/3">Description</th>
                {canEdit && <th className="py-4 px-6 text-indigo-200 font-semibold text-right">Actions</th>}
              </tr>
            </thead>`;

const newThead = `            <thead>
              <tr className="border-b border-slate-800 bg-white/5">
                <th className="py-4 px-6 text-indigo-200 font-semibold w-16 text-center">No</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-32">Code</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold">Name</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-1/4">Description</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold text-center w-32">Jumlah Testcase</th>
                {canEdit && <th className="py-4 px-6 text-indigo-200 font-semibold text-right">Actions</th>}
              </tr>
            </thead>`;
content = content.replace(oldThead, newThead);

// 4. Update table body (Revert Expandable logic, add Jumlah Testcase)
const oldTbody = `            <tbody>
              {modules.map((mod, index) => {
                const no = (page - 1) * 12 + index + 1;
                const isExpanded = selectedModuleId === mod.id;
                
                return (
                  <Fragment key={mod.id}>
                    <tr 
                      onClick={() => setSelectedModuleId(isExpanded ? null : mod.id)}
                      className={\`border-b border-slate-800 hover:bg-white/5 cursor-pointer transition-colors \${isExpanded ? 'bg-white/5' : ''}\`}
                    >
                      <td className="py-4 px-6 text-center text-white/50 font-medium">{no}</td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 text-xs tracking-wider">
                          {mod.code}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-white">{mod.name}</td>
                      <td className="py-4 px-6 text-white/50 text-sm truncate max-w-xs">{mod.description || '-'}</td>
                      {canEdit && (
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={(e) => openForm(mod, e)} className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button onClick={(e) => handleDeleteClick(mod, e)} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    {isExpanded && (
                      <tr className="border-b border-slate-800 bg-black/20">
                        <td colSpan={canEdit ? 5 : 4} className="p-0">
                          <div className="p-4 md:p-8">
                            <ModuleDetail moduleId={mod.id} onBack={() => setSelectedModuleId(null)} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {modules.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 5 : 4} className="py-12 text-center text-white/50">
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>`;

const newTbody = `            <tbody>
              {modules.map((mod, index) => {
                const no = (page - 1) * 12 + index + 1;
                const tcCount = mod._count?.testcases || 0;
                
                return (
                  <tr 
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className="border-b border-slate-800 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 text-center text-white/50 font-medium">{no}</td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 text-xs tracking-wider">
                        {mod.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-white">{mod.name}</td>
                    <td className="py-4 px-6 text-white/50 text-sm truncate max-w-xs">{mod.description || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-xs font-bold rounded-full bg-slate-900 border border-slate-700 text-indigo-300">
                        {tcCount}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openForm(mod); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(mod, e); }} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {modules.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="py-12 text-center text-white/50">
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>`;
content = content.replace(oldTbody, newTbody);

// Ensure Fragment is removed or ignored since it's not strictly needed here now
fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
