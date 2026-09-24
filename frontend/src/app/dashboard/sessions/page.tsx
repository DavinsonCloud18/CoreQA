import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { HeaderProfile } from '@/components/dashboard/HeaderProfile';
import Link from 'next/link';
import { SessionsTable } from '@/components/dashboard/SessionsTable';

async function fetchSessions() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/sessions`, { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  return json.data || [];
}

async function fetchSessionAnalytics(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const url = `${baseUrl}/analytics?sessionId=${sessionId}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    return { summary: { total: 0 } };
  }
  const json = await res.json();
  return json.data;
}

export default async function SessionsHistoryPage() {
  const sessions = await fetchSessions();
  const sessionsWithAnalytics = await Promise.all(
    sessions.map(async (s: any) => {
      const analytics = await fetchSessionAnalytics(s.id);
      return { ...s, analytics };
    })
  );

  return (
    <div className="min-h-screen relative flex bg-slate-950">
      
      <Sidebar />
      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900  border border-slate-700 p-6 rounded-[2rem] shadow-sm">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Log</h1>
              <p className="text-indigo-200 font-medium text-sm mt-0.5">Manage and view all testing sessions</p>
            </div>
            <div className="flex items-center gap-4">
               <HeaderProfile />
               <NotificationBell />
               <LogoutButton />
            </div>
          </header>

          <section className="bg-slate-900  border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
            <SessionsTable initialSessions={sessionsWithAnalytics} />
          </section>
        </div>
      </div>
    </div>
  );
}
