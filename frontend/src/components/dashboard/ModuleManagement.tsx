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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<any>({ totalPages: 1 });
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);

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

  const handleDeleteClick = (mod: any, e: any) => {
    e.stopPropagation();
    setModuleToDelete(mod);
  };

  const confirmDelete = async () => {
    if (!moduleToDelete) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      await fetch(`${baseUrl}/modules/${moduleToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      setModuleToDelete(null);
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
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
      
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
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
          </div>
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-800">
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
              className="px-5 py-2.5 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:  text-sm whitespace-nowrap"
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
              className="bg-slate-800 border border-slate-800 p-6 rounded-[1.5rem] hover:bg-slate-900 cursor-pointer transition-colors flex flex-col relative"
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
              
              <div className="flex justify-between items-end border-t border-slate-800 pt-4 mt-auto">
                <div className="flex gap-2">
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <button onClick={(e) => openForm(mod, e)} className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onClick={(e) => handleDeleteClick(mod, e)} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {modules.length === 0 && (
            <div className="col-span-full py-12 text-center text-white/50 bg-slate-800 rounded-2xl border border-slate-800">
              No modules found.
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-white/5">
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
            className="p-2 rounded-xl bg-white/5 hover:bg-slate-900 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <span className="text-white/70 font-medium text-sm">
            Page {page} of {metadata.totalPages}
          </span>
          <button 
            disabled={page >= metadata.totalPages}
            onClick={() => setPage(p => Math.min(metadata.totalPages, p + 1))}
            className="p-2 rounded-xl bg-white/5 hover:bg-slate-900 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit Module' : 'Add Module'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-white/50 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6">
              <form id="modForm" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Module Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Module Code (Prefix) *</label>
                  <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. AUTH" className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-black/30 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-white/20 text-white font-medium transition-colors">Cancel</button>
              <button type="submit" form="modForm" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-sm hover:">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {moduleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-slate-900 border border-rose-500/20 rounded-2xl w-full max-w-sm shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-rose-500/10">
              <div className="flex items-center gap-3 text-rose-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h2 className="text-xl font-bold">Delete Module</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-white/80 text-sm mb-2">Are you sure you want to delete module <strong>{moduleToDelete.name}</strong>?</p>
              <p className="text-rose-400/80 text-xs italic">This action cannot be undone. All test cases inside this module might be affected.</p>
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setModuleToDelete(null)} className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-white/20 text-white font-medium transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-sm hover:">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
