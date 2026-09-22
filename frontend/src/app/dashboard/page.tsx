import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { UserAssignments } from '@/components/dashboard/UserAssignments';
import { SessionSelector } from '@/components/dashboard/SessionSelector';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { ExecutionChart } from '@/components/dashboard/ExecutionChart';
import { ModuleList } from '@/components/dashboard/ModuleList';

async function fetchGlobalAnalytics(sessionId?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const url = sessionId ? `${baseUrl}/analytics?sessionId=${sessionId}` : `${baseUrl}/analytics`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    return { summary: { total: 0 }, userAssignments: [] };
  }
  const json = await res.json();
  return json.data;
}

async function fetchSessionModules(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/sessions/${sessionId}/modules`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function fetchAllSessions() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/sessions`, { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

function getWorkingDaysLeft(endDate: string | Date) {
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (end.getTime() < now.getTime()) {
    let overdueCount = 0;
    let cur = new Date(end);
    while (cur < now) {
      cur.setDate(cur.getDate() + 1);
      if (cur.getDay() !== 0 && cur.getDay() !== 6) overdueCount++;
    }
    return -overdueCount;
  } else {
    let leftCount = 0;
    let cur = new Date(now);
    while (cur < end) {
      cur.setDate(cur.getDate() + 1);
      if (cur.getDay() !== 0 && cur.getDay() !== 6) leftCount++;
    }
    return leftCount;
  }
}

export default async function GlobalDashboardPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const resolvedParams = await searchParams;
  const allSessions = await fetchAllSessions();
  const activeSessions = allSessions.filter((s: any) => s.isOpen);

  const selectedSessionId = resolvedParams.session;
  const isSingleSessionMode = !!selectedSessionId || activeSessions.length === 1;
  const targetSessionId = selectedSessionId || (activeSessions.length === 1 ? activeSessions[0].id : undefined);

  // If we are showing a specific session (selected or only 1 active)
  const data = await fetchGlobalAnalytics(targetSessionId);
  const sessionModules = targetSessionId ? await fetchSessionModules(targetSessionId) : [];

  // If we are showing multiple active sessions, we need analytics for each to draw their charts
  let activeSessionsWithAnalytics: any[] = [];
  if (!isSingleSessionMode) {
    activeSessionsWithAnalytics = await Promise.all(
      activeSessions.map(async (s: any) => {
        const analytics = await fetchGlobalAnalytics(s.id);
        return { ...s, analytics };
      })
    );
  }
  
  return (
    <div className="min-h-screen relative flex bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      

      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10  border border-white/20 p-6 rounded-[2rem] shadow-2xl">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Dashboard</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">High-Level Testing Summary</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <NotificationBell />
               <SessionSelector currentSession={resolvedParams.session} />
               <LogoutButton />
            </div>
          </header>

          <SummaryCards summary={data.summary} />
          
          {!isSingleSessionMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeSessionsWithAnalytics.map(session => (
                <section key={session.id} className="bg-white/10  border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col items-center">
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                  
                  <div className="w-full flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">{session.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {session.status}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 text-white/70 border border-white/5">
                          {new Date(session.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {session.endDate ? new Date(session.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Ongoing'}
                        </span>
                        {session.status !== 'Finished' && session.status !== 'Done' && session.endDate && (
                          (() => {
                            const days = getWorkingDaysLeft(session.endDate);
                            if (days < 0) {
                              return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">{Math.abs(days)} Working Days Overdue</span>;
                            }
                            return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">{days} Working Days Left</span>;
                          })()
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full relative z-10 mb-6">
                    <ExecutionChart summary={session.analytics.summary} />
                  </div>

                  <a 
                    href={`/dashboard/execution?session=${session.id}`}
                    className="relative z-10 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-center shadow-lg hover:shadow-indigo-500/50 transition-all flex justify-center items-center gap-2"
                  >
                    Execute Session
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </a>
                </section>
              ))}
              {activeSessionsWithAnalytics.length === 0 && (
                <div className="col-span-full text-white/50 py-8 text-center bg-black/20 rounded-xl border border-white/5">
                  No active sessions found.
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart on the left */}
              <section className="bg-white/10  border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
                <div className="w-full flex flex-col items-start mb-8 relative z-10">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Execution Status Distribution
                  </h2>
                  {targetSessionId && data && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/10 text-white/70 border border-white/5">
                        {(() => {
                          const s = allSessions.find((s: any) => s.id === targetSessionId);
                          if (!s) return 'Timeline Unknown';
                          return `${new Date(s.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${s.endDate ? new Date(s.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Ongoing'}`;
                        })()}
                      </span>
                      {(() => {
                        const s = allSessions.find((s: any) => s.id === targetSessionId);
                        if (!s || s.status === 'Finished' || s.status === 'Done' || !s.endDate) return null;
                        const days = getWorkingDaysLeft(s.endDate);
                        if (days < 0) {
                          return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">{Math.abs(days)} Working Days Overdue</span>;
                        }
                        return <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">{days} Working Days Left</span>;
                      })()}
                    </div>
                  )}
                </div>
                <ExecutionChart summary={data.summary} />
              </section>

              {/* User assignments on the right */}
              <section className="bg-white/10  border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white relative z-10">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block shadow-[0_0_10px_rgba(99,102,241,0.6)]"></span>
                  Team Assignments
                </h2>
                <div className="relative z-10">
                  <UserAssignments assignments={data.userAssignments} />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
