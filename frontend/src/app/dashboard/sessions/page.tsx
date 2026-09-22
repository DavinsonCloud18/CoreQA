import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import Link from 'next/link';

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
    <div className="min-h-screen relative flex bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      
      <Sidebar />
      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10  border border-white/20 p-6 rounded-[2rem] shadow-2xl">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Log</h1>
              <p className="text-indigo-200 font-medium text-sm mt-0.5">Manage and view all testing sessions</p>
            </div>
            <LogoutButton />
          </header>

          <section className="bg-white/10  border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-6 text-indigo-200 font-semibold">Name</th>
                    <th className="py-4 px-6 text-indigo-200 font-semibold">Environment</th>
                    <th className="py-4 px-6 text-indigo-200 font-semibold">Timeline</th>
                    <th className="py-4 px-6 text-indigo-200 font-semibold">Status</th>
                    <th className="py-4 px-6 text-indigo-200 font-semibold">% Executed</th>
                    <th className="py-4 px-6 text-indigo-200 font-semibold">% Passed</th>
                    <th className="py-4 px-6 text-indigo-200 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsWithAnalytics.map((session: any) => {
                    const summary = session.analytics?.summary || { total: 0 };
                    const total = summary.total || 0;
                    const passed = summary['PASSED'] || 0;
                    const passedNotes = summary['PASSED WITH NOTES'] || 0;
                    const dropped = summary['DROPPED'] || 0;
                    const todo = summary['TO DO'] || 0;
                    const completed = total - todo;
                    const effectiveTotal = total - dropped;
                    
                    const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
                    const passRate = effectiveTotal > 0 ? Math.round(((passed + passedNotes) / effectiveTotal) * 100) : 0;

                    return (
                    <tr key={session.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 font-medium">{session.name}</td>
                      <td className="py-4 px-6">
                        <span className="bg-white/10 px-2 py-1 rounded text-sm text-indigo-200">{session.environment.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-white/80">{new Date(session.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span className="text-xs text-white/50">to {session.endDate ? new Date(session.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          session.status === 'Finished' ? 'bg-emerald-500/20 text-emerald-400' :
                          session.status === 'On Progress' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-indigo-200/90 text-sm font-bold bg-indigo-500/20 px-2.5 py-1 rounded border border-indigo-400/20">
                          {completionPct}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-emerald-200/90 text-sm font-bold bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-400/20">
                          {passRate}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link 
                          href={`/dashboard/execution?session=${session.id}`}
                          className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all inline-block"
                        >
                          View Session
                        </Link>
                      </td>
                    </tr>
                  )})}
                  {sessions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/50">No sessions found. Create one from the sidebar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
