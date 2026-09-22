import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { ExecutionTable } from '@/components/dashboard/ExecutionTable';
import Link from 'next/link';

async function fetchSessionStatus(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${baseUrl}/sessions/${sessionId}/analytics`, { cache: 'no-store' });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.session?.status;
}

export default async function ExecutionMenuPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = await params;
  const status = await fetchSessionStatus(resolvedParams.sessionId);
  
  return (
    <div className="min-h-screen relative flex bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      

      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10  border border-white/20 p-6 rounded-[2rem] shadow-2xl">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <Link href={`/dashboard/execution?session=${resolvedParams.sessionId}`} className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </Link>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Execution Menu</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Execute testcases and update statuses</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
          </header>

          <section className="bg-white/10  border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <ExecutionTable sessionId={resolvedParams.sessionId} sessionStatus={status} />
          </section>
        </div>
      </div>
    </div>
  );
}
