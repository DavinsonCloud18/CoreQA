'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function TrashManagement() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'modules' | 'testcases' | 'users'>('sessions');
  const [data, setData] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTrashData();
  }, [activeTab]);

  const fetchTrashData = async () => {
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${baseUrl}/trash?type=${activeTab}`, {
        headers: { 'Authorization': `Bearer ${authData.access_token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setSelectedIds([]); // Reset selection when tab changes
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const executePermanentDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${baseUrl}/trash/delete-permanent`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: activeTab, ids: selectedIds })
      });
      
      if (res.ok) {
        fetchTrashData();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const res = await fetch(`${baseUrl}/trash/restore`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${authData.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: activeTab, ids: selectedIds })
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        alert(`Failed to restore: ${json.message}`);
      } else {
        alert('Data successfully restored!');
        fetchTrashData();
      }
    } catch (err) {
      alert('An error occurred during restoration');
    }
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'sessions':
        return (
          <>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Session Name</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Environment</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Status</th>
          </>
        );
      case 'modules':
        return (
          <>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Code</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Name</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Description</th>
          </>
        );
      case 'testcases':
        return (
          <>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">TC ID</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Title</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Module (Parent)</th>
          </>
        );
      case 'users':
        return (
          <>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Name</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Email</th>
            <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold">Role</th>
          </>
        );
    }
  };

  const renderTableRow = (item: any) => {
    switch (activeTab) {
      case 'sessions':
        return (
          <>
            <td className="py-4 px-6 font-bold text-white">{item.name}</td>
            <td className="py-4 px-6 text-white/70">{item.environment?.name || '-'}</td>
            <td className="py-4 px-6 text-white/70">{item.status}</td>
          </>
        );
      case 'modules':
        return (
          <>
            <td className="py-4 px-6 font-bold text-indigo-300">{item.code}</td>
            <td className="py-4 px-6 font-bold text-white">{item.name}</td>
            <td className="py-4 px-6 text-white/70">{item.description || '-'}</td>
          </>
        );
      case 'testcases':
        return (
          <>
            <td className="py-4 px-6 font-bold text-indigo-300">{item.testcaseId}</td>
            <td className="py-4 px-6 font-bold text-white">{item.title}</td>
            <td className="py-4 px-6 text-white/70">
              {item.module?.name} 
              {item.module?.isDeleted && <span className="ml-2 text-xs bg-rose-500/20 text-rose-300 px-2 py-1 rounded-md">Deleted</span>}
            </td>
          </>
        );
      case 'users':
        return (
          <>
            <td className="py-4 px-6 font-bold text-white">{item.name}</td>
            <td className="py-4 px-6 text-white/70">{item.email}</td>
            <td className="py-4 px-6 text-white/70">{item.role?.name || '-'}</td>
          </>
        );
    }
  };

  return (
    <>
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex gap-4">
          {['sessions', 'modules', 'testcases', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-bold rounded-lg whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-white/60 hover:text-white'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <h2 className="text-3xl font-black text-white mb-2">
          {activeTab === 'testcases' ? 'Test Cases' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Trash
        </h2>
        <p className="text-white/60 text-sm">View and restore soft-deleted {activeTab}.</p>
      </div>

      <div className="relative z-10 mb-4 flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-800">
        <div className="text-sm text-white/70">
          <span className="font-bold text-white">{selectedIds.length}</span> item(s) selected
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold hover:bg-rose-600/30 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Permanently Delete
          </button>
          <button 
            onClick={handleRestore}
            disabled={selectedIds.length === 0}
            className="px-6 py-2 bg-indigo-600 rounded-xl font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Restore Selected
          </button>
        </div>
      </div>

      <div className="relative z-10 bg-slate-800 border border-slate-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-800 bg-white/5">
              <th className="py-4 px-6 w-16">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={handleSelectAll}
                />
              </th>
              {renderTableHeaders()}
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-white/50 font-bold text-right">Deleted At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-white/50">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-white/50">No deleted {activeTab} found.</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-800 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  {renderTableRow(item)}
                  <td className="py-4 px-6 text-white/50 text-sm text-right">
                    {new Date(item.deletedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/50 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl shadow-rose-900/20 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-rose-500/20">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white text-center mb-2 tracking-tight">Permanently Delete?</h3>
            <p className="text-slate-400 text-center mb-8 font-medium leading-relaxed">
              You are about to permanently delete <strong className="text-rose-400">{selectedIds.length} item(s)</strong>. This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={executePermanentDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}