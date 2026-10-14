"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="customer-account-content">{children}</div>
    </DashboardLayout>
  );
}
