"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight, Car } from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { VehicleCard } from '@/components/public/VehicleCard';
import { EmptyState } from '@/components/public/EmptyState';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import { PublicVehicle, fetchPublicVehicles } from '@/lib/publicApi';
import { useFavorites } from '@/hooks/useFavorites';

export default function SavedVehiclesPage() {
  const { favoriteIds, clearFavorites, count } = useFavorites();
  const [allVehicles, setAllVehicles] = useState<PublicVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inquiry dialog state
  const [inquiryVehicle, setInquiryVehicle] = useState<PublicVehicle | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    fetchPublicVehicles()
      .then(setAllVehicles)
      .finally(() => setIsLoading(false));
  }, []);

  const savedVehicles = allVehicles.filter((v) => favoriteIds.includes(v._id));

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Saved Motorcycles' }]} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 fill-current" />
              <span>My Wishlist</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Your Saved Motorcycles ({savedVehicles.length})
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              TVS motorcycles saved during your session. Live availability and pricing verified against our current inventory.
            </p>
          </div>

          {savedVehicles.length > 0 && (
            <button
              onClick={clearFavorites}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear Saved List</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-20 text-center animate-pulse text-slate-400">
            Checking live status of your saved vehicles...
          </div>
        ) : savedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onQuickInquire={(v) => {
                  setInquiryVehicle(v);
                  setIsInquiryOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="car"
            title="No Saved Vehicles Yet"
            description="You haven't saved any vehicles to your favorites yet. Tap the heart icon on any vehicle listing to keep track of prices and availability."
            actionText="Explore Vehicle Collection"
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
