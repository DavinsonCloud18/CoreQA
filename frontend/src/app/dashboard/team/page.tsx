import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { TeamManagement } from '@/components/dashboard/TeamManagement';
import { cookies } from 'next/headers';

async function fetchInitialData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('coreqa_token')?.value;
  const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [usersRes, rolesRes, statusesRes] = await Promise.all([
    fetch(`${baseUrl}/master/users`, { headers, cache: 'no-store' }).catch(() => null),
    fetch(`${baseUrl}/master/roles`, { headers, cache: 'no-store' }).catch(() => null),
    fetch(`${baseUrl}/master/statuses`, { headers, cache: 'no-store' }).catch(() => null),
  ]);

  const users = usersRes && usersRes.ok ? (await usersRes.json()).data : [];
  const roles = rolesRes && rolesRes.ok ? (await rolesRes.json()).data : [];
  const statuses = statusesRes && statusesRes.ok ? (await statusesRes.json()).data : [];

  return { users, roles, statuses };
}

export default async function TeamPage() {
  const { users, roles, statuses } = await fetchInitialData();
  
  return (
    <div className="min-h-screen relative flex bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      

      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full mx-auto space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10  border border-white/20 p-6 rounded-[2rem] shadow-2xl">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Team Management</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">View and manage Accounts, Roles, and Statuses</p>
                </div>
              </div>
            </div>
            <LogoutButton />
          </header>

          <TeamManagement initialUsers={users} initialRoles={roles} initialStatuses={statuses} />
        </div>
      </div>
    </div>
  );
}
