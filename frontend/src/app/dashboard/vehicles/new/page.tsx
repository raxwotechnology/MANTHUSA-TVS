"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NewVehiclePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || params.get('edit');
      if (id) {
        router.replace(`/dashboard/vehicles?edit=${id}`);
      } else {
        router.replace('/dashboard/vehicles?new=1');
      }
    }
  }, [router]);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 text-sm gap-2">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p>Loading vehicle management...</p>
      </div>
    </DashboardLayout>
  );
}
