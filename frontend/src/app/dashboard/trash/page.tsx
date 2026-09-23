import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { HeaderProfile } from '@/components/dashboard/HeaderProfile';
import { TrashManagement } from '@/components/dashboard/TrashManagement';

export const metadata = {
  title: 'Trash - CoreQA',
};

export default function TrashPage() {
  return (
    <div className="min-h-screen relative flex bg-slate-950">
      <Sidebar />

      <div className="relative z-10 flex-1 p-8 text-white font-sans overflow-y-auto">
        <div className="w-full mx-auto space-y-8 pb-12">
          
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-700 p-6 rounded-[2rem] shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white">
                    Trash
                  </h1>
                  <p className="text-white/60 mt-1 font-medium text-sm">
                    Manage and restore soft-deleted items.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <HeaderProfile />
               <NotificationBell />
              <div className="h-8 w-px bg-white/20"></div>
              <LogoutButton />
            </div>
          </header>

          <TrashManagement />
          
        </div>
      </div>
    </div>
  );
}
