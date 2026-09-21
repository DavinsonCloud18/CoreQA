import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';

async function fetchUsers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/master/users`, { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  return json.data;
}

export default async function TeamPage() {
  const users = await fetchUsers();
  
  return (
    <div className="min-h-screen relative flex bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[20px]"></div>

      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-2xl">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Team Management</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">View and manage QA Team Members</p>
                </div>
              </div>
            </div>
            <LogoutButton />
          </header>

          <section className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
               {users.map((user: any) => (
                 <div key={user.id} className="bg-black/20 border border-white/10 p-6 rounded-2xl hover:bg-black/30 transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                        <span className="text-lg font-bold text-white">
                          {user.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{user.name}</h3>
                        <p className="text-indigo-200/70 text-sm">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.role.name === 'Leader' ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'}`}>
                        {user.role.name}
                      </span>
                      <div className="flex items-center gap-2 text-sm font-medium text-white/50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                        <span>{user._count.claimHistories} Claims</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
