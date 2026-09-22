'use client';

import { useState, useEffect } from 'react';
import { ModuleDetail } from './ModuleDetail';

export function ModuleManagement() {
  const [modules, setModules] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<any>({ totalPages: 1 });

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      setCurrentUser(JSON.parse(authData).user);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, page]);

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${baseUrl}/modules?page=${page}&limit=12&search=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setModules(json.data);
        setMetadata(json.metadata || { totalPages: 1 });
      }
    } catch(err) {}
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const headers = { 
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json'
      };
      
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${baseUrl}/modules/${editingItem.id}` : `${baseUrl}/modules`;
      
      const res = await fetch(url, { method, headers, body: JSON.stringify(formData) });
      if (res.ok) {
        setIsFormOpen(false);
        fetchData();
      } else {
        alert("Failed to save module");
      }
    } catch(err) {}
  };

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      await fetch(`${baseUrl}/modules/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      fetchData();
    } catch(err) {}
  };

  const openForm = (item?: any, e?: any) => {
    if (e) e.stopPropagation();
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, code: item.code, description: item.description || '' });
    } else {
      setEditingItem(null);
      setFormData({ name: '', code: '', description: '' });
    }
    setIsFormOpen(true);
  };

  const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Leader';

  if (selectedModuleId) {
    return <ModuleDetail moduleId={selectedModuleId} onBack={() => setSelectedModuleId(null)} />;
  }

  return (
    <div className="bg-white/10 border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
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
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex bg-black/20 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
          {canEdit && (
            <button 
              onClick={() => openForm()}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg hover:shadow-indigo-500/50 transition-shadow text-sm whitespace-nowrap"
            >
              + Add Module
            </button>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {modules.map(mod => (
            <div 
              key={mod.id} 
              onClick={() => setSelectedModuleId(mod.id)}
              className="bg-black/20 border border-white/10 p-6 rounded-[1.5rem] hover:bg-white/10 cursor-pointer transition-colors flex flex-col relative"
            >
              <div className="absolute top-4 right-4 text-white/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 px-4 min-w-[3rem] w-auto rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold border border-indigo-500/30 text-sm tracking-wider">
                  {mod.code}
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">{mod.name}</h3>
              </div>
              
              <p className="text-sm text-white/50 line-clamp-2 mb-6 flex-1">
                {mod.description || 'No description provided.'}
              </p>
              
              <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                <div className="flex gap-2">
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <button onClick={(e) => openForm(mod, e)} className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onClick={(e) => handleDelete(mod.id, e)} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {modules.length === 0 && (
            <div className="col-span-full py-12 text-center text-white/50 bg-black/20 rounded-2xl border border-white/5">
              No modules found.
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 bg-black/20 border border-white/10 rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Code</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Name</th>
                <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Description</th>
                {canEdit && <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {modules.map(mod => (
                <tr 
                  key={mod.id} 
                  onClick={() => setSelectedModuleId(mod.id)}
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
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
                        <button onClick={(e) => handleDelete(mod.id, e)} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors">
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
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {metadata.totalPages > 1 && (
        <div className="relative z-10 flex justify-center items-center gap-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <span className="text-white/70 font-medium text-sm">
            Page {page} of {metadata.totalPages}
          </span>
          <button 
            disabled={page >= metadata.totalPages}
            onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
              <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Module' : 'Add Module'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-white/50 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6">
              <form id="modForm" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Module Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Module Code (Prefix) *</label>
                  <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. AUTH" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">Cancel</button>
              <button type="submit" form="modForm" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg hover:shadow-indigo-500/50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
