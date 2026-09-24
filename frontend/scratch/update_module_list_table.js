const fs = require('fs');
const file = 'c:/Davin/Kuliah/Semester 5/STSI4440 - Capstone Project/CoreQA/frontend/src/components/dashboard/ModuleManagement.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the early return for selectedModuleId
const earlyReturn = `  if (selectedModuleId) {
    return <ModuleDetail moduleId={selectedModuleId} onBack={() => setSelectedModuleId(null)} />;
  }`;
content = content.replace(earlyReturn, '');

// 2. Change the table headers to match ExecutionTable + add No
const oldThead = `            <thead>
              <tr className="border-b border-slate-800 bg-white/5">
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Code</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Name</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Description</th>
                {canEdit && <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold text-right">Actions</th>}
              </tr>
            </thead>`;

const newThead = `            <thead>
              <tr className="border-b border-slate-800 bg-white/5">
                <th className="py-4 px-6 text-indigo-200 font-semibold w-16 text-center">No</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-32">Code</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold">Name</th>
                <th className="py-4 px-6 text-indigo-200 font-semibold w-1/3">Description</th>
                {canEdit && <th className="py-4 px-6 text-indigo-200 font-semibold text-right">Actions</th>}
              </tr>
            </thead>`;
content = content.replace(oldThead, newThead);

// 3. Change the table body to handle expand/collapse + No column
const oldTbody = `            <tbody>
              {modules.map(mod => (
                <tr 
                  key={mod.id} 
                  onClick={() => setSelectedModuleId(mod.id)}
                  className="border-b border-slate-800 hover:bg-white/5 cursor-pointer transition-colors"
                >
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
              ))}
              {modules.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-white/50">
                    No modules found.
                  </td>
                </tr>
              )}
            </tbody>`;

const newTbody = `            <tbody>
              {modules.map((mod, index) => {
                const no = (page - 1) * 12 + index + 1;
                const isExpanded = selectedModuleId === mod.id;
                
                return (
                  <import_react_fragment key={mod.id}>
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
                  </import_react_fragment>
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
content = content.replace(oldTbody, newTbody.replace(/import_react_fragment/g, 'Fragment'));

// Add Fragment to imports if not there
if (!content.includes('Fragment')) {
  content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect, Fragment } from 'react';");
}

fs.writeFileSync(file, content, 'utf8');
console.log('Update successful');
