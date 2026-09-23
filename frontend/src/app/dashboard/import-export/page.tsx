import { HeaderProfile } from '@/components/dashboard/HeaderProfile';
import { ImportExportTC } from '@/components/dashboard/ImportExportTC';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';

export const metadata = {
  title: 'Import / Export Test Case - CoreQA',
};

export default function ImportExportPage() {
  return (
    <div className="min-h-screen relative flex bg-slate-950">
      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full mx-auto space-y-8 pb-12">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-700 p-6 rounded-[2rem] shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-sm ">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Import / Export TC</h1>
                  <p className="text-indigo-200 font-medium text-sm mt-0.5">Manajemen data testcase secara massal menggunakan file Excel</p>
                </div>
              </div>
            </div>
            <LogoutButton />
          </header>

          <ImportExportTC />
        </div>
      </div>
    </div>
  );
}
