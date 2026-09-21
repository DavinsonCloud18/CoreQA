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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const [envRes, modRes] = await Promise.all([
        fetch(`${baseUrl}/master/environments`),
        fetch(`${baseUrl}/master/modules`)
      ]);
      const envData = await envRes.json();
      const modData = await modRes.json();
      
      setEnvironments(envData.data || []);
      setModules(modData.data || []);
      if (envData.data?.length > 0) {
        setEnvironmentId(envData.data[0].id.toString());
      }
    } catch (e) {
      console.error('Failed to fetch master data', e);
    }
  };

  if (!isOpen || !mounted) return null;

  const filteredModules = modules.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const allSelected = filteredModules.length > 0 && selectedModules.size === filteredModules.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedModules(new Set());
    } else {
      setSelectedModules(new Set(filteredModules.map(m => m.id)));
    }
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
      const res = await fetch(`${baseUrl}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          environmentId: Number(environmentId),
          moduleIds: Array.from(selectedModules)
        })
      });
      if (res.ok) {
        const data = await res.json();
        onClose();
        router.push(`/dashboard/sessions/${data.data.id}`);
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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/90 border border-white/20 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-2xl font-bold text-white">Create New Session</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 overflow-hidden flex-1">
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">Session Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g. Q4 Release Regression"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">Environment</label>
              <select 
                value={environmentId}
                onChange={(e) => setEnvironmentId(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                required
              >
                {environments.map(env => (
                  <option key={env.id} value={env.id} className="bg-slate-900">{env.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden flex-1 border border-white/10 rounded-xl p-4 bg-white/5">
             <div className="flex justify-between items-center mb-4 shrink-0">
               <label className="text-sm font-medium text-indigo-200">Select Modules</label>
               <div className="relative">
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-8"
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
                  className="w-4 h-4 rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                />
                <span className="text-sm text-white">Select All ({filteredModules.length})</span>
             </div>

             <div className="overflow-y-auto pr-2 space-y-2 flex-1 custom-scrollbar">
                {filteredModules.map(m => (
                  <label key={m.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${selectedModules.has(m.id) ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 bg-black/20 hover:bg-black/40'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={selectedModules.has(m.id)}
                        onChange={() => toggleModule(m.id)}
                        className="w-4 h-4 rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" 
                      />
                      <span className="text-white font-medium">{m.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md">{m.testcaseCount} TCs</span>
                  </label>
                ))}
                {filteredModules.length === 0 && (
                  <div className="text-center py-8 text-white/50">No modules found</div>
                )}
             </div>
          </div>

          <div className="pt-2 shrink-0">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
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
