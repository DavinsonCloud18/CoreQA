import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { ExecutionTable } from '@/components/dashboard/ExecutionTable';
import { SessionSelector } from '@/components/dashboard/SessionSelector';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
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

export default async function ExecutionMenuPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const resolvedParams = await searchParams;
  const data = resolvedParams.session ? await fetchGlobalAnalytics(resolvedParams.session) : null;
  const sessionModules = resolvedParams.session ? await fetchSessionModules(resolvedParams.session) : [];
  
  return (
    <div className="min-h-screen relative flex bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[20px]"></div>

      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-2xl">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Menu</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Execute testcases across your selected session</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <SessionSelector currentSession={resolvedParams.session} />
               <LogoutButton />
            </div>
          </header>

          <section className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden min-h-[400px]">
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none"></div>
             
             <div className="relative z-10">
               {resolvedParams.session ? (
                 <div className="space-y-8">
                   <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                     <span className="w-2 h-6 bg-amber-500 rounded-full inline-block shadow-[0_0_10px_rgba(245,158,11,0.6)]"></span>
                     Session Summary
                   </h2>
                   <SummaryCards summary={data?.summary || {}} />
                   
                   <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-3 text-white">
                     <span className="w-2 h-6 bg-rose-500 rounded-full inline-block shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
                     Modules to Execute
                   </h2>
                   <ModuleList modules={sessionModules} sessionId={resolvedParams.session} />
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/20 rounded-2xl">
                    <svg className="w-12 h-12 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-white/50 text-lg font-medium text-center">Please select a Session from the top right<br/>to start executing testcases.</p>
                 </div>
               )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
