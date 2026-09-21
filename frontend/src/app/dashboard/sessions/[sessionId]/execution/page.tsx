import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { ExecutionTable } from '@/components/dashboard/ExecutionTable';
import Link from 'next/link';

export default async function ExecutionMenuPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen relative flex bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[20px]"></div>

      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2rem] shadow-2xl">
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
            <LogoutButton />
          </header>

          <section className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <ExecutionTable sessionId={resolvedParams.sessionId} />
          </section>
        </div>
      </div>
    </div>
  );
}
