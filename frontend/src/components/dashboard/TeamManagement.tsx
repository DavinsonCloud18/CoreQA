'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function TeamManagement({ initialUsers, initialRoles, initialStatuses }: { initialUsers: any[], initialRoles: any[], initialStatuses: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [statuses, setStatuses] = useState(initialStatuses);
  
  const [currentUser, setCurrentUser] = useState<any>(null); // from local storage token info
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      setCurrentUser(parsed.user);
    }
  }, []);

  const isAdmin = currentUser?.role === 'Admin';
  const isLeader = currentUser?.role === 'Leader';
  const canEditUser = isAdmin || isLeader;

  const refreshData = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    const headers = { 'Authorization': `Bearer ${authData.access_token}` };
    const [uRes, rRes, sRes] = await Promise.all([
      fetch(`${baseUrl}/master/users`, { headers }),
      fetch(`${baseUrl}/master/roles`, { headers }),
      fetch(`${baseUrl}/master/statuses`, { headers }),
    ]);
    if (uRes.ok) setUsers((await uRes.json()).data);
    if (rRes.ok) setRoles((await rRes.json()).data);
    if (sRes.ok) setStatuses((await sRes.json()).data);
  };

  const handleSaveUser = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data: any = Object.fromEntries(formData);
    data.isActive = data.isActive === 'true';

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authData.access_token}`
    };

    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `${baseUrl}/master/users/${editingItem.id}` : `${baseUrl}/master/users`;

    // Leader can only send isActive, but for simplicity we send what form gives. API will process or fail based on guard.
    // Wait, leader can only update. We shouldn't send password if empty.
    if (!data.password) delete data.password;

    const res = await fetch(url, { method, headers, body: JSON.stringify(data) });
    if (res.ok) {
      setIsUserModalOpen(false);
      refreshData();
    } else {
      alert('Action failed');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    await fetch(`${baseUrl}/master/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authData.access_token}` }
    });
    refreshData();
  };

  const handleSaveRole = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.access_token}` };

    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `${baseUrl}/master/roles/${editingItem.id}` : `${baseUrl}/master/roles`;

    const res = await fetch(url, { method, headers, body: JSON.stringify(data) });
    if (res.ok) {
      setIsRoleModalOpen(false);
      refreshData();
    }
  };

  const handleSaveStatus = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const authData = JSON.parse(localStorage.getItem('auth') || '{}');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.access_token}` };

    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `${baseUrl}/master/statuses/${editingItem.id}` : `${baseUrl}/master/statuses`;

    const res = await fetch(url, { method, headers, body: JSON.stringify(data) });
    if (res.ok) {
      setIsStatusModalOpen(false);
      refreshData();
    }
  };

  const filteredUsers = users.filter((u: any) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRoles = roles.filter((r: any) => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStatuses = statuses.filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section className="bg-white/10  border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-4 relative z-10">
        <div className="flex gap-4">
          <button onClick={() => {setActiveTab('users'); setSearchQuery('');}} className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>Users</button>
          <button onClick={() => {setActiveTab('roles'); setSearchQuery('');}} className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'roles' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>Roles</button>
          <button onClick={() => {setActiveTab('statuses'); setSearchQuery('');}} className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'statuses' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>Statuses</button>
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      <div className="relative z-10">
        {activeTab === 'users' && (
          <div>
            {canEditUser && (
              <button onClick={() => { setEditingItem(null); setIsUserModalOpen(true); }} className="mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold text-white shadow-lg hover:shadow-cyan-500/50 transition-shadow">
                + Add User
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user: any) => (
                <div key={user.id} className={`bg-gradient-to-b from-white/5 to-transparent border p-6 rounded-[2rem] hover:bg-white/5 transition-colors group relative overflow-hidden flex flex-col ${currentUser?.id === user.id ? 'border-indigo-500/40 border-l-4 border-l-indigo-500' : 'border-white/10'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-2 border-white/10 shadow-xl ${user.isActive ? 'bg-gradient-to-tr from-indigo-500 to-purple-600' : 'bg-slate-700 grayscale'}`}>
                      <span className="text-xl font-black text-white">{user.name.substring(0,2).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-row items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${user.role?.name === 'Leader' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : user.role?.name === 'Admin' ? 'bg-rose-500/20 border-rose-500/30 text-rose-300' : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'}`}>
                        {user.role?.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                        <span className={`text-xs font-bold ${user.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xl text-white tracking-tight">{user.name}</h3>
                      {currentUser?.id === user.id && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-black bg-indigo-500 text-white">You</span>
                      )}
                    </div>
                    <p className="text-indigo-200/60 text-sm font-medium mt-1">{user.email}</p>
                  </div>
                  
                  {(isAdmin || (isLeader && user.role?.name === 'QA Member')) && (
                    <div className="flex gap-2 mt-auto border-t border-white/10 pt-4">
                      <button onClick={() => { setEditingItem(user); setIsUserModalOpen(true); }} className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors">Edit</button>
                      <button onClick={() => handleDeleteUser(user.id)} className="flex-1 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-sm transition-colors border border-rose-500/20">Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            {isAdmin && (
              <button onClick={() => { setEditingItem(null); setIsRoleModalOpen(true); }} className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white shadow-lg transition-shadow">
                + Add Role
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRoles.map((role: any) => (
                <div key={role.id} className="bg-black/20 border border-white/10 p-6 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-lg">{role.name}</span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(role); setIsRoleModalOpen(true); }} className="text-cyan-400">Edit</button>
                      <button onClick={() => { if(confirm('Sure?')) { /* delete */ } }} className="text-red-400">Del</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'statuses' && (
          <div>
            {isAdmin && (
              <button onClick={() => { setEditingItem(null); setIsStatusModalOpen(true); }} className="mb-6 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl font-bold text-white shadow-lg transition-shadow">
                + Add Status
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredStatuses.map((status: any) => (
                <div key={status.id} className="bg-black/20 border border-white/10 p-6 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-lg">{status.name}</span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(status); setIsStatusModalOpen(true); }} className="text-cyan-400">Edit</button>
                      <button onClick={() => { if(confirm('Sure?')) { /* delete */ } }} className="text-red-400">Del</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
          <div className="bg-slate-800 p-8 rounded-2xl border border-white/10 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSaveUser} className="space-y-4">
              {(!editingItem || isAdmin) && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input name="email" type="email" defaultValue={editingItem?.email} required className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password {editingItem && '(leave blank to keep)'}</label>
                    <input name="password" type="password" required={!editingItem} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select name="roleId" defaultValue={editingItem?.roleId || roles.find((r: any) => r.name === 'QA Member')?.id} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white">
                      {(isLeader ? roles.filter((r: any) => r.name === 'QA Member') : roles).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="isActive" defaultValue={editingItem ? (editingItem.isActive ? 'true' : 'false') : 'true'} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
          <div className="bg-slate-800 p-8 rounded-2xl border border-white/10 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Edit Role' : 'Add Role'}</h2>
            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsRoleModalOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
          <div className="bg-slate-800 p-8 rounded-2xl border border-white/10 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Edit Status' : 'Add Status'}</h2>
            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
