'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

interface Environment {
  id: number;
  name: string;
}

interface Module {
  id: string;
  name: string;
  testcaseCount: number;
}

export function CreateSessionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [environmentId, setEnvironmentId] = useState('');
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [search, setSearch] = useState('');
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<any>({ totalPages: 1 });
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [qaMembers, setQaMembers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMasterData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchModulesData();
    }, 300);
    return () => clearTimeout(timer);
  }, [isOpen, search, page]);

  const fetchMasterData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const headers = { 'Authorization': `Bearer ${authData.access_token}` };

      const [envRes, userRes] = await Promise.all([
        fetch(`${baseUrl}/master/environments`, { headers }),
        fetch(`${baseUrl}/master/users`, { headers })
      ]);
      const envData = await envRes.json();
      const userData = await userRes.json();
      
      setEnvironments(envData.data || []);
      setQaMembers((userData.data || []).filter((u: any) => u.role?.name === 'QA Member' || u.role?.name === 'Leader'));
      if (envData.data?.length > 0) {
        setEnvironmentId(envData.data[0].id.toString());
      }
    } catch (e) {
      console.error('Failed to fetch master data', e);
    }
  };

  const fetchModulesData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const headers = { 'Authorization': `Bearer ${authData.access_token}` };

      const modRes = await fetch(`${baseUrl}/modules?limit=20&page=${page}&search=${encodeURIComponent(search)}`, { headers });
      const modData = await modRes.json();
      
      setModules(modData.data || []);
      setMetadata(modData.metadata || { totalPages: 1 });
    } catch (e) {
      console.error('Failed to fetch modules data', e);
    }
  };

  if (!isOpen || !mounted) return null;

  const allSelected = modules.length > 0 && modules.every(m => selectedModules.has(m.id));

  const handleSelectAll = () => {
    const newSelected = new Set(selectedModules);
    if (allSelected) {
      modules.forEach(m => newSelected.delete(m.id));
    } else {
      modules.forEach(m => newSelected.add(m.id));
    }
    setSelectedModules(newSelected);
  };

  const toggleModule = (id: string) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedModules(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedModules.size === 0) {
      alert('Please select at least one module');
      return;
    }
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const finalAssignments = Object.fromEntries(Object.entries(assignments).filter(([_, v]) => v !== ''));
      
      const res = await fetch(`${baseUrl}/sessions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`
        },
        body: JSON.stringify({
          name,
          environmentId: Number(environmentId),
          moduleIds: Array.from(selectedModules),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          assignments: finalAssignments
        })
      });
      if (res.ok) {
        const data = await res.json();
        onClose();
        router.push(`/dashboard/sessions/${data.data.id}`);
        router.refresh();
      } else {
        alert('Failed to create session');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 " onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/90 border border-slate-700 rounded-[2rem] p-8 shadow-sm  flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-2xl font-bold text-white">Create New Session</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-hidden flex-1">
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-indigo-200 mb-2">Session Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 "
                placeholder="e.g. Q4 Release Regression"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-indigo-200 mb-2">Environment</label>
              <select 
                value={environmentId}
                onChange={(e) => setEnvironmentId(e.target.value)}
                className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500  appearance-none"
                required
              >
                {environments.map(env => (
                  <option key={env.id} value={env.id} className="bg-slate-900">{env.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-indigo-200 mb-2">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-indigo-200 mb-2">Target End Date <span className="text-white/30 text-xs font-normal">(Optional)</span></label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              />
            </div>
          </div>

          <div className="flex flex-col overflow-hidden flex-1 border border-slate-800 rounded-xl p-4 bg-white/5">
             <div className="flex justify-between items-center mb-4 shrink-0">
               <label className="text-sm font-medium text-indigo-200">Select Modules</label>
               <div className="relative">
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => {
                     setSearch(e.target.value);
                     setPage(1);
                   }}
                   className="bg-black/30 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-8"
                   placeholder="Search modules..."
                 />
                 <svg className="w-4 h-4 text-white/50 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
             </div>
             
             <div className="flex items-center gap-2 mb-3 shrink-0">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-700 bg-black/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                />
                <span className="text-sm text-white">Select All on Page</span>
             </div>

              <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">
                {modules.map(m => (
                  <div key={m.id} className={`flex flex-col rounded-lg border  ${selectedModules.has(m.id) ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 bg-slate-800 hover:bg-slate-800'}`}>
                    <label className="flex items-center justify-between p-3 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={selectedModules.has(m.id)}
                          onChange={() => toggleModule(m.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-black/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                        />
                        <span className="text-white font-medium">{m.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md">{m.testcaseCount} TCs</span>
                    </label>
                    {selectedModules.has(m.id) && (
                      <div className="pl-10 pr-3 pb-3">
                        <select
                          value={assignments[m.id] || ''}
                          onChange={(e) => setAssignments({ ...assignments, [m.id]: e.target.value })}
                          className="w-full bg-slate-800 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-indigo-200 focus:outline-none focus:border-indigo-500 transition-colors"
                        >
                          <option value="">-- Unassigned (Assign Later) --</option>
                          {qaMembers.map(qa => (
                            <option key={qa.id} value={qa.id}>{qa.name} ({qa.role?.name})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
                {modules.length === 0 && (
                  <div className="text-center py-8 text-white/50">No modules found</div>
                )}
             </div>

             {metadata.totalPages > 1 && (
               <div className="flex justify-between items-center bg-slate-800 p-2 rounded-lg shrink-0 mt-3 border border-slate-800">
                  <button 
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-1.5 rounded-md bg-white/5 hover:bg-slate-900 text-white disabled:opacity-30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <span className="text-white/70 text-xs font-medium tracking-wide">Page {page} of {metadata.totalPages}</span>
                  <button 
                    type="button"
                    disabled={page >= metadata.totalPages}
                    onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))}
                    className="p-1.5 rounded-md bg-white/5 hover:bg-slate-900 text-white disabled:opacity-30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
               </div>
             )}
          </div>

          <div className="pt-2 shrink-0">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-sm  hover:   disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Creating...' : `Create Session with ${selectedModules.size} Modules`}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
