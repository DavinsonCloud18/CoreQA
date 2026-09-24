const fs = require('fs');

function updateModal(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace header section
  const headerRegex = /<div className="flex justify-between items-center mb-4 shrink-0">[\s\S]*?<label className="text-sm font-medium text-indigo-200">Select Modules<\/label>[\s\S]*?<div className="relative">[\s\S]*?<input[\s\S]*?className="bg-black\/30 border border-slate-800 rounded-lg px-3 py-1\.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-8"[\s\S]*?placeholder="Search modules\.\.\."[\s\S]*?\/>[\s\S]*?<svg[\s\S]*?<\/svg>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

  const newHeader = `<div className="flex flex-col mb-4 shrink-0 gap-3">
               <div className="flex justify-between items-end">
                 <div>
                   <label className="flex items-center gap-2 text-sm font-bold text-indigo-200">
                     Modules to Include
                     <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs font-semibold border border-indigo-500/20">
                       {selectedModules.size} Selected
                     </span>
                   </label>
                   <p className="text-xs text-white/40 mt-1">
                     Showing modules from master data. <a href="/dashboard/modules" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors ml-1 font-medium" target="_blank" rel="noopener noreferrer">Manage Master Modules &rarr;</a>
                   </p>
                 </div>
                 <div className="relative">
                   <input 
                     type="text" 
                     value={search}
                     onChange={(e) => {
                       setSearch(e.target.value);
                       setPage(1);
                     }}
                     className="bg-black/30 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-8 w-[200px]"
                     placeholder="Search master modules..."
                   />
                   <svg className="w-4 h-4 text-white/50 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>
               </div>
             </div>`;

  content = content.replace(headerRegex, newHeader);

  // Replace row section
  const rowRegex = /<span className="text-white font-medium">\{m\.name\}<\/span>\s*<\/div>\s*<span className="text-xs font-semibold text-indigo-300 bg-indigo-500\/20 px-2 py-1 rounded-md">\{m\.testcaseCount\} TCs<\/span>\s*<\/label>/;
  
  const newRow = `<span className="text-white font-medium">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedModules.has(m.id) && (
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Included</span>
                        )}
                        <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md">{m.testcaseCount} TCs</span>
                      </div>
                    </label>`;
                    
  content = content.replace(rowRegex, newRow);

  fs.writeFileSync(filePath, content, 'utf8');
}

updateModal('c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/EditSessionModal.tsx');
updateModal('c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/CreateSessionModal.tsx');
console.log('UI updated for modals via regex');
