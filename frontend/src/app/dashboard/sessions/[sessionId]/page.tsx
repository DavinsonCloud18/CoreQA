import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ModuleProgress } from '@/components/dashboard/ModuleProgress';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { HeaderProfile } from '@/components/dashboard/HeaderProfile';
import { Sidebar } from '@/components/dashboard/Sidebar';

async function fetchAnalytics(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/sessions/${sessionId}/analytics`, { cache: 'no-store' });
  if (!res.ok) {
    return { summary: { total: 0 }, topFailedModules: [] };
  }
  const json = await res.json();
  return json.data;
}

export default async function DashboardPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = await params;
  const data = await fetchAnalytics(resolvedParams.sessionId);
  
  return (
    <div className="min-h-screen relative flex bg-slate-950">
      {/* Dark overlay matching login page */}
      

      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full space-y-8 pb-12">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900  border border-slate-700 p-6 rounded-[2rem] shadow-sm">
            <div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-sm ">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">CoreQA Analytics</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Real-time Session Monitoring</p>
                </div>
              </div>
            </div>
            <LogoutButton />
          </header>

          <SummaryCards summary={data.summary} />
          
          <section className="bg-slate-900  border border-slate-700 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
            
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white relative z-10">
              <span className="w-2 h-6 bg-rose-500 rounded-full inline-block shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>
              Top Failed Modules (Needs Attention)
            </h2>
            <div className="relative z-10">
              <ModuleProgress modules={data.topFailedModules} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
