"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Scale, ArrowRight, Plus, RotateCcw } from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { VehicleComparisonTable } from '@/components/public/VehicleComparisonTable';
import { EmptyState } from '@/components/public/EmptyState';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import { PublicVehicle, fetchPublicVehicles } from '@/lib/publicApi';
import { useComparison } from '@/hooks/useComparison';

export default function ComparePage() {
  const { comparisonIds, removeVehicle, clearComparison } = useComparison();
  const [allVehicles, setAllVehicles] = useState<PublicVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inquiry modal state
  const [inquiryVehicle, setInquiryVehicle] = useState<PublicVehicle | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchPublicVehicles();
        setAllVehicles(data);
      } catch (err) {
        console.error('Failed to load comparison inventory:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filter out vehicles that are in comparisonIds
  const comparedVehicles = allVehicles.filter((v) => comparisonIds.includes(v._id));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Vehicle Comparison' }]} />

        {isLoading ? (
          <div className="py-20 text-center animate-pulse text-slate-400">
            Loading vehicle comparison specifications...
          </div>
        ) : comparedVehicles.length > 0 ? (
          <VehicleComparisonTable
            vehicles={comparedVehicles}
            onRemoveVehicle={removeVehicle}
            onClearAll={clearComparison}
            onOpenInquiry={(v) => {
              setInquiryVehicle(v);
              setIsInquiryOpen(true);
            }}
          />
        ) : (
          <EmptyState
            icon="car"
            title="No Vehicles in Comparison"
            description="You have not selected any vehicles for comparison yet. Select up to 4 vehicles from our inventory to evaluate specifications and pricing side by side."
            actionText="Browse Inventory to Compare"
            actionHref="/vehicles"
          />
        )}
      </div>

      <InquiryDialog
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicle={inquiryVehicle}
      />
    </PublicLayout>
  );
}
