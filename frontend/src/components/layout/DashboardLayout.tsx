"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useSettings } from '@/lib/useSettings';
import { useTheme } from 'next-themes';




export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { settings: brand } = useSettings();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const previousTheme = React.useRef<string | undefined>(undefined);

  useEffect(() => {
    previousTheme.current = theme;
    setTheme('dark');

    return () => {
      if (previousTheme.current && previousTheme.current !== 'dark') {
        setTheme(previousTheme.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
    } else {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        router.push('/login');
      }
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        <div className="flex items-center gap-3 font-medium">
          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading TVS Motorcycle Sales System...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        user={user}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          user={user}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">{children}</div>
          <footer className="mt-8 pt-4 pb-2 border-t border-slate-200/80 text-center text-xs text-slate-400 font-medium">
            {brand.footerText || '© 2026 MANTHUSA TVS. All rights reserved.'}
          </footer>
        </main>
      </div>
    </div>
  );
}
