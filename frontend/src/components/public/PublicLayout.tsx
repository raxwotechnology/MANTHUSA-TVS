"use client";

import React from 'react';
import { SiteAnnouncementBar } from './SiteAnnouncementBar';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { useSettings } from '@/lib/useSettings';

interface Props {
  children: React.ReactNode;
  brand?: any;
}

export function PublicLayout({ children }: Props) {
  const { settings: brand } = useSettings();

  return (
    <div className="public-site min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors duration-200">
      <SiteAnnouncementBar brand={brand} />
      <SiteHeader brand={brand} />
      <main className="flex-1 w-full">{children}</main>
      <SiteFooter brand={brand} />
    </div>
  );
}
