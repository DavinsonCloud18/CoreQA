'use client';

import { useState, useEffect } from 'react';

export function ModuleDetail({ moduleId, onBack }: { moduleId: string, onBack: () => void }) {
  const [module, setModule] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');

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
    <div className="flex justify-center py-20 text-white/50 animate-pulse">Loading module...</div>
  );

  const activeTestcases = module.testcases.filter((tc: any) => !tc.isDeleted);
  const deletedTestcases = module.testcases.filter((tc: any) => tc.isDeleted);
  const displayedTestcases = activeTab === 'active' ? activeTestcases : deletedTestcases;

  return (
    <div className="bg-white/10 border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 mb-8 pb-6 border-b border-white/10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex gap-4 items-center">
          <button onClick={onBack} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors border border-white/10">
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

      <div className="relative z-10 flex gap-4 border-b border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-4 font-bold text-sm transition-colors relative ${activeTab === 'active' ? 'text-indigo-400' : 'text-white/50 hover:text-white/80'}`}
        >
          Active Testcases ({activeTestcases.length})
          {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-md shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('deleted')}
          className={`pb-3 px-4 font-bold text-sm transition-colors relative ${activeTab === 'deleted' ? 'text-indigo-400' : 'text-white/50 hover:text-white/80'}`}
        >
          Deleted ({deletedTestcases.length})
          {activeTab === 'deleted' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-md shadow-[0_-2px_10px_rgba(99,102,241,0.5)]"></div>}
        </button>
      </div>

      <div className="relative z-10 overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">ID</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Title</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Priority</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Creator</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayedTestcases.map((tc: any) => (
              <tr key={tc.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-md text-white/70 border border-white/5">{tc.testcaseId}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-bold text-white leading-tight">{tc.title}</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${tc.priority === 'High' || tc.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : tc.priority === 'Medium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                    {tc.priority}
                  </span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-xs font-semibold text-white/70">{tc.createdBy?.name}</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-right">
                  <a href={`/dashboard/testcases?highlight=${tc.id}`} className="px-4 py-2 bg-indigo-500/10 text-indigo-300 font-bold text-sm rounded-lg border border-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-500/20">
                    View details
                  </a>
                </td>
              </tr>
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
