"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Plus,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Bike
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { VehicleComparisonTable } from '@/components/public/VehicleComparisonTable';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import { PublicVehicle, fetchPublicVehicles, formatLKR, getVehicleSlug } from '@/lib/publicApi';
import { useComparison } from '@/hooks/useComparison';

export default function ComparePage() {
  const {
    comparisonIds,
    addVehicle,
    removeVehicle,
    toggleVehicle,
    clearComparison,
    setComparisonList,
    isLoaded
  } = useComparison();
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

  // Synchronize and prune any stale or mismatched IDs from localStorage
  useEffect(() => {
    if (!isLoaded || allVehicles.length === 0) return;
    const validIds = comparisonIds.filter((id) =>
      allVehicles.some((v) => v._id === id || (v as any).id === id)
    );
    if (validIds.length !== comparisonIds.length) {
      setComparisonList(validIds);
    }
  }, [allVehicles, comparisonIds, isLoaded, setComparisonList]);

  // Filter matched vehicles preserving user selection order
  const comparedVehicles = comparisonIds
    .map((id) => allVehicles.find((v) => v._id === id || (v as any).id === id))
    .filter((v): v is PublicVehicle => Boolean(v));

  // Quick preset helper
  const handleApplyPreset = (modelNames: string[]) => {
    const matched = modelNames
      .map((name) => allVehicles.find((v) => v.model.toLowerCase().includes(name.toLowerCase())))
      .filter((v): v is PublicVehicle => Boolean(v))
      .slice(0, 4)
      .map((v) => v._id);

    if (matched.length > 0) {
      setComparisonList(matched);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Motorcycle Comparison' }]} />

        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading TVS motorcycle specifications and inventory...
            </div>
          </div>
        ) : comparedVehicles.length > 0 ? (
          <div className="space-y-10">
            {/* Main Comparison Table */}
            <VehicleComparisonTable
              vehicles={comparedVehicles}
              allAvailableVehicles={allVehicles}
              onAddVehicle={addVehicle}
              onRemoveVehicle={removeVehicle}
              onClearAll={clearComparison}
              onOpenInquiry={(v) => {
                setInquiryVehicle(v);
                setIsInquiryOpen(true);
              }}
            />

            {/* Quick-Switch Pill Bar for all available showroom models */}
            {allVehicles.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>Quick Add / Remove from Showroom Lineup</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {comparedVehicles.length} of 4 selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allVehicles.map((bike) => {
                    const isSelected = comparisonIds.includes(bike._id);
                    return (
                      <button
                        key={bike._id}
                        type="button"
                        onClick={() => toggleVehicle(bike._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{bike.model}</span>
                        <span className="text-[10px] opacity-75 font-normal">({formatLKR(bike.sellingPrice)})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Interactive Comparison Selector when 0 motorcycles are currently selected */
          <div className="space-y-10">
            {/* Header Banner */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center border border-red-500/20 shadow-xs">
                <Scale className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                TVS Motorcycle Side-by-Side Comparison
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Evaluate power, torque, RT-Fi fuel injection, braking technology, and pricing. Select up to 4 TVS models below to compare them instantly.
              </p>
            </div>

            {/* Popular Matchup Presets */}
            {allVehicles.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-amber-400">
                  <Zap className="w-4 h-4" />
                  <span>Popular Dealership Matchups (1-Click Compare)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(['Apache RTR 160', 'Apache RTR 200', 'Apache RR 310'])}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500/50 text-left transition-all shadow-xs hover:shadow-md cursor-pointer group"
                  >
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors">
                      Sport Racing Trilogy
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Apache RTR 160 4V vs 200 4V vs RR 310
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                      <span>Compare Racing Lineup</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset(['Raider 125', 'NTORQ 125', 'Jupiter 125'])}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500/50 text-left transition-all shadow-xs hover:shadow-md cursor-pointer group"
                  >
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors">
                      Smart City Commuters
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      TVS Raider 125 vs NTORQ 125 vs Jupiter 125
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                      <span>Compare Commuters</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPreset(['Ronin 225', 'iQube Electric', 'XL 100'])}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500/50 text-left transition-all shadow-xs hover:shadow-md cursor-pointer group"
                  >
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors">
                      Lifestyle & Utility
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      TVS Ronin 225 vs iQube Electric vs XL 100
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                      <span>Compare Lineup</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Visual Grid of All TVS Motorcycles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  Select Models from Showroom Lineup
                </h2>
                <Link
                  href="/bikes"
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Bikes</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {allVehicles.map((bike) => {
                  const isSelected = comparisonIds.includes(bike._id);
                  const mainImg = bike.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80';
                  return (
                    <div
                      key={bike._id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-slate-950 relative overflow-hidden">
                          <img
                            src={mainImg}
                            alt={bike.model}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-red-400 border border-white/10">
                            {bike.category || 'Motorcycle'}
                          </div>
                        </div>
                        <div className="p-4 space-y-1.5">
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                            {bike.make} {bike.model}
                          </h3>
                          {bike.variant && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {bike.variant}
                            </p>
                          )}
                          <div className="text-xs font-black text-red-600 dark:text-red-400 pt-1">
                            {formatLKR(bike.sellingPrice)}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>{bike.engineCapacity || 'Racing Engine'}</span>
                            <span>•</span>
                            <span>{bike.maxPower || 'High Output'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <button
                          type="button"
                          onClick={() => toggleVehicle(bike._id)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                              : 'bg-red-600 hover:bg-red-500 text-white shadow-xs'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>In Comparison</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Compare</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
