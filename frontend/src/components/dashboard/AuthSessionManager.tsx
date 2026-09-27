"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ACTIVITY_KEY = 'coreqa_last_activity';

export default function AuthSessionManager() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/dashboard')) return;
    const configuredIdleMinutes = Number(getStoredIdleTimeout());
    const idleMs = (configuredIdleMinutes > 0 ? configuredIdleMinutes : 30) * 60 * 1000;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    let refreshing = false;

    const logout = () => {
      const auth = getAuth();
      if (auth.refresh_token) {
        void fetch(`${apiUrl}/auth/refresh`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: auth.refresh_token }),
        }).catch(() => undefined);
      }
      localStorage.removeItem('auth');
      localStorage.removeItem(ACTIVITY_KEY);
      document.cookie = 'coreqa_token=; path=/; max-age=0; samesite=strict';
      router.replace('/login');
    };
    const touch = () => localStorage.setItem(ACTIVITY_KEY, String(Date.now()));
    const getAuth = () => {
      try { return JSON.parse(localStorage.getItem('auth') || '{}'); } catch { return {}; }
    };
    function getStoredIdleTimeout() {
      try { return JSON.parse(localStorage.getItem('auth') || '{}').idle_timeout_minutes; } catch { return 30; }
    }
    const refresh = async () => {
      if (refreshing) return;
      const auth = getAuth();
      if (!auth.refresh_token) return logout();
      refreshing = true;
      try {
        const response = await fetch(`${apiUrl}/auth/refresh`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: auth.refresh_token }),
        });
        if (!response.ok) return logout();
        const result = await response.json();
        const updatedAuth = { ...auth, ...result.data };
        localStorage.setItem('auth', JSON.stringify(updatedAuth));
        document.cookie = `coreqa_token=${updatedAuth.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
      } catch { /* A transient network failure is retried on the next activity tick. */ }
      finally { refreshing = false; }
    };
    touch();
    const activityEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, touch, { passive: true }));
    const timer = window.setInterval(() => {
      const lastActivity = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
      if (!lastActivity || Date.now() - lastActivity >= idleMs) return logout();
      if (Date.now() - lastActivity < 70_000) void refresh();
    }, 60_000);
    const checkOnFocus = () => {
      const lastActivity = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
      if (Date.now() - lastActivity >= idleMs) logout();
    };
    window.addEventListener('focus', checkOnFocus);
    return () => {
      window.clearInterval(timer);
      activityEvents.forEach(event => window.removeEventListener(event, touch));
      window.removeEventListener('focus', checkOnFocus);
    };
  }, [pathname, router]);

  return null;
}
