'use client';

import React, { useState, useEffect } from 'react';
import { TestcaseForm } from './TestcaseForm';

export function ModuleDetail({ moduleId, onBack }: { moduleId: string, onBack: () => void }) {
  const [module, setModule] = useState<any>(null);
  const [expandedTc, setExpandedTc] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchModuleDetail();
  }, [moduleId]);

  const fetchModuleDetail = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${baseUrl}/modules/${moduleId}`, {
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      if (res.ok) {
        setModule((await res.json()).data);
      }
    } catch(err) {}
  };

  if (!module) return (
    <div className="flex justify-center py-20 text-white/50 ">Loading module...</div>
  );

  const displayedTestcases = module.testcases
    .filter((tc: any) => !tc.isDeleted)
    .filter((tc: any) => 
      tc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tc.testcaseId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSave = async (data: any) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const headers = { 
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json'
      };
      
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${baseUrl}/testcases/${editingItem.id}` : `${baseUrl}/testcases`;
      
      const res = await fetch(url, { method, headers, body: JSON.stringify(data) });
      if (res.ok) {
        setIsFormOpen(false);
        fetchModuleDetail();
      } else {
        alert("Failed to save testcase");
      }
    } catch(err) {}
  };

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this testcase?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      await fetch(`${baseUrl}/testcases/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      fetchModuleDetail();
    } catch(err) {}
  };

  if (isFormOpen) {
    return (
      <TestcaseForm 
        initialData={editingItem || { moduleId: module.id }} 
        modules={[{ id: module.id, name: module.name, code: module.code }]} 
        onSave={handleSave} 
        onClose={() => setIsFormOpen(false)} 
      />
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
      
      
      <div className="relative z-10 mb-8 pb-6 border-b border-slate-800 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex gap-4 items-center">
          <button onClick={onBack} className="p-3 bg-white/5 hover:bg-slate-900 rounded-xl text-white/70 hover:text-white transition-colors border border-slate-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 font-bold text-xs rounded-md border border-indigo-500/30">
                {module.code}
              </span>
              <h2 className="text-2xl font-bold text-white">{module.name}</h2>
            </div>
            <p className="text-white/50 text-sm mt-1">{module.description}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-800 mb-6 pb-6">
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Search testcases..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button 
          onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
          className="px-5 py-2.5 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:  text-sm whitespace-nowrap w-full sm:w-auto"
        >
          + Add Testcase
        </button>
      </div>

      <div className="relative z-10 overflow-x-auto bg-slate-800 rounded-2xl border border-slate-800">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-800 bg-white/5">
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">ID</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Title</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Module</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Expected Result</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Priority</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Creator</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedTestcases.map((tc: any) => (
              <React.Fragment key={tc.id}>
                <tr 
                  className={`hover:bg-white/5 transition-colors group cursor-pointer ${expandedTc === tc.id ? 'bg-white/5' : ''}`}
                  onClick={() => setExpandedTc(expandedTc === tc.id ? null : tc.id)}
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <svg className={`w-4 h-4 text-indigo-400 transition-transform ${expandedTc === tc.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-900 rounded-md text-white/70 border border-slate-800">{tc.testcaseId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-white leading-tight">{tc.title}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-indigo-300 text-xs font-semibold">{module.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white/70 text-xs line-clamp-2 w-48" title={tc.expectedResult}>{tc.expectedResult || '-'}</p>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${tc.priority === 'High' || tc.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : tc.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                      {tc.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs font-semibold text-white/70">{tc.createdBy?.name || '-'}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingItem(tc); setIsFormOpen(true); }} 
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-slate-900 text-white font-medium text-xs transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => handleDelete(tc.id, e)} 
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-xs transition-colors border border-rose-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedTc === tc.id && (
                  <tr className="bg-slate-800 border-b border-slate-800">
                    <td colSpan={6} className="p-0">
                      <div className="p-6 m-4 ml-12 rounded-xl border border-indigo-500/20 bg-indigo-950/20 shadow-inner">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs font-bold text-indigo-200/50 uppercase tracking-wider mb-1">Description</h4>
                              <p className="text-white/80 text-sm whitespace-pre-line">{tc.description || '-'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-indigo-200/50 uppercase tracking-wider mb-1">Precondition</h4>
                              <p className="text-white/80 text-sm whitespace-pre-line">{tc.precondition || '-'}</p>
                            </div>
                          </div>
                          
                          {tc.steps && tc.steps.length > 0 && (
                            <div>
                              <h4 className="text-indigo-200 font-bold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                Test Steps
                              </h4>
                              <ul className="border border-indigo-500/20 rounded-lg overflow-hidden bg-slate-800">
                                <li className="grid grid-cols-12 gap-4 p-2.5 border-b border-indigo-500/20 bg-indigo-500/10 text-indigo-200 text-[11px] font-bold uppercase tracking-wider">
                                  <div className="col-span-1 text-center">Step</div>
                                  <div className="col-span-5">Action</div>
                                  <div className="col-span-6">Expected Result</div>
                                </li>
                                {tc.steps.map((step: any) => (
                                  <li key={step.id} className="grid grid-cols-12 gap-4 p-3 border-b border-slate-800 last:border-b-0 hover:bg-white/5 transition-colors">
                                    <div className="col-span-1 text-center text-indigo-200/50 font-mono text-sm">{step.sequence}</div>
                                    <div className="col-span-5 text-white/80 text-sm whitespace-pre-line">{step.action}</div>
                                    <div className="col-span-6 text-white/80 text-sm whitespace-pre-line">{step.expectedResult}</div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                            <div className="pt-2 flex justify-end">
                              <span className="text-xs text-indigo-200/40 italic">
                                Terakhir diupdate oleh: <span className="font-semibold text-indigo-200/60">{tc.updatedBy?.name || tc.createdBy?.name || '-'}</span>
                              </span>
                            </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {displayedTestcases.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-white/40">
                  No testcases found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
