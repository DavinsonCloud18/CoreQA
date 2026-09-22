'use client';

import { useState, useEffect } from 'react';
import { TestcaseForm } from './TestcaseForm';
import { useSearchParams } from 'next/navigation';

export function TestcaseManagement() {
  const [testcases, setTestcases] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      setCurrentUser(parsed.user);
      setFilterUser(parsed.user.id);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
      fetchModulesAndUsers();
    }
  }, [currentUser, filterModule, filterUser, showDeleted]);

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const params = new URLSearchParams();
      if (filterModule) params.append('moduleId', filterModule);
      if (filterUser) params.append('createdById', filterUser);
      params.append('isDeleted', showDeleted ? 'true' : 'false');
      
      const res = await fetch(`${baseUrl}/testcases?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setTestcases(json.data);
      }
    } catch(err) {}
  };

  const fetchModulesAndUsers = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const headers = { 'Authorization': `Bearer ${authData.access_token}` };
      
      const [mRes, uRes] = await Promise.all([
        fetch(`${baseUrl}/modules`, { headers }),
        fetch(`${baseUrl}/master/users`, { headers })
      ]);
      
      if (mRes.ok) setModules((await mRes.json()).data);
      if (uRes.ok) setUsers((await uRes.json()).data);
    } catch(err) {}
  };

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
        fetchData();
      } else {
        alert("Failed to save testcase");
      }
    } catch(err) {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testcase?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      await fetch(`${baseUrl}/testcases/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      fetchData();
    } catch(err) {}
  };

  const handleRevive = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      await fetch(`${baseUrl}/testcases/${id}/revive`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      fetchData();
    } catch(err) {}
  };
  
  const filteredTestcases = testcases.filter(tc => 
    tc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tc.testcaseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/10 border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col xl:flex-row gap-6 mb-8 items-start xl:items-center justify-between border-b border-white/10 pb-6">
        <div className="flex gap-4 w-full xl:w-auto">
          <div className="flex-1 sm:w-64">
            <label className="text-xs font-bold text-white/50 mb-1 block uppercase tracking-wider">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="ID or Title..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 sm:w-48">
            <label className="text-xs font-bold text-white/50 mb-1 block uppercase tracking-wider">Module</label>
            <select 
              value={filterModule}
              onChange={e => setFilterModule(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Modules</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.code} - {m.name}</option>)}
            </select>
          </div>
          <div className="flex-1 sm:w-48">
            <label className="text-xs font-bold text-white/50 mb-1 block uppercase tracking-wider">Creator</label>
            <select 
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Users</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto">
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={showDeleted}
              onChange={e => setShowDeleted(e.target.checked)}
              className="w-4 h-4 rounded bg-black/20 border-white/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
            />
            Show Deleted
          </label>
          <button 
            onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
            className="flex-1 xl:flex-none px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-indigo-500/50 transition-shadow whitespace-nowrap text-sm"
          >
            + Add Testcase
          </button>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto bg-black/20 rounded-2xl border border-white/10">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">ID</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Title</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Module</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Priority</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs">Creator</th>
              <th className="py-4 px-6 font-bold text-white/50 uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTestcases.map(tc => {
              const isHighlighted = tc.id === highlightId;
              return (
                <tr key={tc.id} className={`hover:bg-white/5 transition-colors group ${isHighlighted ? 'bg-indigo-500/10' : ''}`}>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-md text-white/70 border border-white/5">{tc.testcaseId}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white leading-tight">{tc.title}</span>
                      {tc.isDeleted && <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded uppercase tracking-wider">Deleted</span>}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-indigo-300 text-xs font-semibold">{tc.module.name}</span>
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
                    <div className="flex justify-end gap-2">
                      {!tc.isDeleted && (
                        <>
                          <button onClick={async () => {
                             const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                             const authData = JSON.parse(localStorage.getItem('auth') || '{}');
                             const res = await fetch(`${baseUrl}/testcases/${tc.id}`, { headers: { 'Authorization': `Bearer ${authData.access_token}` } });
                             if (res.ok) {
                               setEditingItem((await res.json()).data);
                               setIsFormOpen(true);
                             }
                          }} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors">Edit</button>
                          
                          <button onClick={() => handleDelete(tc.id)} className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-xs transition-colors border border-rose-500/20">Delete</button>
                        </>
                      )}
                      {tc.isDeleted && (
                        <button onClick={() => handleRevive(tc.id)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium text-xs transition-colors border border-emerald-500/20">Revive</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTestcases.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-white/50">
                  No testcases found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <TestcaseForm 
          initialData={editingItem} 
          modules={modules}
          onSave={handleSave} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}
