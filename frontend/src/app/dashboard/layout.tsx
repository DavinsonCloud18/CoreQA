import AuthSessionManager from '@/components/dashboard/AuthSessionManager';

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return <><AuthSessionManager />{children}</>;
}
