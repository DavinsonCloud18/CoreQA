import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { HeaderProfile } from '@/components/dashboard/HeaderProfile';
import { SessionSelector } from '@/components/dashboard/SessionSelector';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ModuleList } from '@/components/dashboard/ModuleList';
import { CompleteSessionButton } from '@/components/dashboard/CompleteSessionButton';
import { EditSessionButton } from '@/components/dashboard/EditSessionButton';
import { CloneSessionButton } from '@/components/dashboard/CloneSessionButton';
import { DeleteSessionButton } from '@/components/dashboard/DeleteSessionButton';
import { BackButton } from '@/components/dashboard/BackButton';
import { ModuleProgress } from '@/components/dashboard/ModuleProgress';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchAnalytics(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/sessions/${sessionId}/analytics`, { cache: 'no-store' });
  if (!res.ok) {
    return { summary: { total: 0 }, topFailedModules: [] };
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

async function fetchSessionInfo(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/sessions`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data || []).find((s: any) => s.id === sessionId) || null;
}

export default async function SessionDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = await params;
  const sessionId = resolvedParams.sessionId;

  const [data, sessionModules, sessionFromList] = await Promise.all([
    fetchAnalytics(sessionId),
    fetchSessionModules(sessionId),
    fetchSessionInfo(sessionId),
  ]);

  const currentSession = sessionFromList || data?.session || null;

  const total = data?.summary?.total || 0;
  const passedCount = (data?.summary?.['PASSED'] || 0) + (data?.summary?.['PASSED WITH NOTES'] || 0);
  const droppedCount = data?.summary?.['DROPPED'] || 0;
  const isReady = (total - droppedCount) > 0 && passedCount === (total - droppedCount);

  return (
    <div className="min-h-screen relative flex bg-slate-950">
      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto" data-testid="session-analytics-content">
        <div className="w-full space-y-8 pb-12">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-700 p-6 rounded-[2rem] shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <BackButton />
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-sm ">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
                    {currentSession ? currentSession.name : 'Session Detail'}
                  </h1>
                  <div className="text-indigo-200 font-medium text-sm mt-1.5 flex items-center gap-2">
                    {currentSession ? (
                      <>
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] border border-indigo-500/30 uppercase font-bold tracking-wider">
                          {currentSession.environment?.name || 'Session'}
                        </span>
                        <span>Manage execution and update testcases</span>
                      </>
                    ) : (
                      <span>Session overview and execution modules</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <HeaderProfile />
              <NotificationBell />
              <SessionSelector currentSession={sessionId} />
              <LogoutButton />
            </div>
          </header>

          <section className="bg-slate-900 border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden min-h-[400px]">
            <div className="relative z-10">
              {currentSession ? (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                        <span className="w-2 h-6 bg-amber-500 rounded-full inline-block shadow-[0_0_10px_rgba(245,158,11,0.6)]"></span>
                        Session Summary
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {currentSession.startDate && (
                          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            Start: {new Date(currentSession.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        {currentSession.endDate && (
                          <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            End: {new Date(currentSession.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {currentSession.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <DeleteSessionButton session={currentSession} />
                      <CloneSessionButton sessionId={currentSession.id} />
                      <EditSessionButton session={currentSession} />
                      <CompleteSessionButton
                        sessionId={sessionId}
                        initialStatus={currentSession?.status || 'On Progress'}
                        isReady={isReady}
                      />
                    </div>
                  </div>

                  <SummaryCards summary={data?.summary || {}} />

                  <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-3 text-white">
                    <span className="w-2 h-6 bg-rose-500 rounded-full inline-block shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
                    Modules to Execute
                  </h2>
                  <ModuleList modules={sessionModules} sessionId={sessionId} />

                  {data?.topFailedModules && data.topFailedModules.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-800">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                        <span className="w-2 h-6 bg-rose-500 rounded-full inline-block shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
                        Top Failed Modules (Needs Attention)
                      </h2>
                      <ModuleProgress modules={data.topFailedModules} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-2xl">
                  <svg className="w-12 h-12 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-white/50 text-lg font-medium text-center">Session not found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
