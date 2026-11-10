"use client";

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  Filter,
  ChevronDown,
  Flame,
  ChevronRight,
  ShieldCheck,
  Check,
  Zap,
  Sparkles
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { VehicleCard } from '@/components/public/VehicleCard';
import { VehicleCardSkeleton } from '@/components/public/VehicleCardSkeleton';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { EmptyState } from '@/components/public/EmptyState';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import { PublicVehicle, fetchPublicVehicles, formatLKR, getUniquePublicVehicles } from '@/lib/publicApi';

function BikesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bikes, setBikes] = useState<PublicVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Inquire dialog
  const [inquiryVehicle, setInquiryVehicle] = useState<PublicVehicle | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Filters read from URL params
  const keyword = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'ALL';
  const selectedEngineCc = searchParams.get('engineCc') || 'ALL';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || 'featured';

  const [searchTerm, setSearchTerm] = useState(keyword);

  useEffect(() => {
    setSearchTerm(keyword);
  }, [keyword]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchPublicVehicles();
        setBikes(data);
      } catch (err) {
        console.error('Failed to load bikes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const updateParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(newParams)) {
      if (!val || val === 'ALL' || val === '') {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    }
    router.push(`/bikes?${current.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchTerm.trim() || null });
  };

  const resetFilters = () => {
    setSearchTerm('');
    router.push('/bikes');
  };

  // Distinct filter options derived from actual database records
  const categories = useMemo(() => {
    const set = new Set<string>();
    bikes.forEach((b) => {
      if (b.category) set.add(b.category.trim());
    });
    return Array.from(set).sort();
  }, [bikes]);

  const uniqueBikes = useMemo(() => {
    return getUniquePublicVehicles(bikes);
  }, [bikes]);

  // Filter bikes
  const filteredBikes = useMemo(() => {
    return uniqueBikes.filter((b) => {
      // Keyword search
      if (keyword) {
        const query = keyword.toLowerCase();
        const matchTitle = (b.model || '').toLowerCase().includes(query);
        const matchVariant = (b.variant || '').toLowerCase().includes(query);
        const matchCategory = (b.category || '').toLowerCase().includes(query);
        const matchDescription = (b.description || '').toLowerCase().includes(query);
        if (!matchTitle && !matchVariant && !matchCategory && !matchDescription) return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && b.category !== selectedCategory) {
        return false;
      }

      // Engine Capacity filter
      if (selectedEngineCc !== 'ALL') {
        const cc = parseInt(b.engineCapacity || '0', 10);
        if (selectedEngineCc === '100' && cc > 115) return false;
        if (selectedEngineCc === '125' && (cc < 115 || cc > 140)) return false;
        if (selectedEngineCc === '160' && (cc < 140 || cc > 180)) return false;
        if (selectedEngineCc === '200' && (cc < 180 || cc > 215)) return false;
        if (selectedEngineCc === '225' && cc < 215) return false;
        if (selectedEngineCc === 'electric' && b.fuelType !== 'Electric') return false;
      }

      // Price filter
      if (minPrice && b.sellingPrice < Number(minPrice)) return false;
      if (maxPrice && b.sellingPrice > Number(maxPrice)) return false;

      return true;
    });
  }, [uniqueBikes, keyword, selectedCategory, selectedEngineCc, minPrice, maxPrice]);

  // Sort bikes
  const sortedBikes = useMemo(() => {
    const list = [...filteredBikes];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.sellingPrice - b.sellingPrice);
      case 'price-desc':
        return list.sort((a, b) => b.sellingPrice - a.sellingPrice);
      case 'name-asc':
        return list.sort((a, b) => a.model.localeCompare(b.model));
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredBikes, sortBy]);

  const activeFilterCount = [
    keyword,
    selectedCategory !== 'ALL' ? selectedCategory : '',
    selectedEngineCc !== 'ALL' ? selectedEngineCc : '',
    minPrice,
    maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'TVS Motorcycles' }]} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/20">
            <Flame className="w-3.5 h-3.5 fill-red-600 dark:fill-red-400" />
            <span>TVS Motorcycle Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            EXPLORE TVS MOTORCYCLES
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Browse genuine TVS models with variant pricing, color palettes, and live branch availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/configure"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Configure & Book</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-6 sticky top-28 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                <span>Filters ({activeFilterCount})</span>
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Model Name</label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="e.g. Apache, NTORQ, Raider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => updateParams({ category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Engine Capacity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Engine Capacity</label>
              <select
                value={selectedEngineCc}
                onChange={(e) => updateParams({ engineCc: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="ALL">All Capacities</option>
                <option value="100">100cc (XL 100)</option>
                <option value="125">125cc (NTORQ, Raider, Jupiter)</option>
                <option value="160">160cc (Apache RTR 160 4V)</option>
                <option value="200">200cc (Apache RTR 200 4V)</option>
                <option value="225">225cc - 310cc (Ronin, RR 310)</option>
                <option value="electric">Electric (iQube)</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Price Range (LKR)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParams({ minPrice: e.target.value || null })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* LISTINGS CONTAINER */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-white">{sortedBikes.length}</span> TVS Motorcycles
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-red-500" />
                <span>Filters ({activeFilterCount})</span>
              </button>

              {/* Sorting */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Model: A to Z</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bikes Grid / List */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          ) : sortedBikes.length === 0 ? (
            <EmptyState
              title="No TVS Motorcycles Found"
              description="Try adjusting your filter options or search term to discover available TVS bikes."
              actionText="Reset All Filters"
              onReset={resetFilters}
            />
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {sortedBikes.map((bike) => (
                <VehicleCard
                  key={bike._id}
                  vehicle={bike}
                  viewMode={viewMode}
                  onQuickInquire={(v) => {
                    setInquiryVehicle(v);
                    setIsInquiryOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Dialog */}
      {inquiryVehicle && (
        <InquiryDialog
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          vehicle={inquiryVehicle}
        />
      )}

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-red-500" />
                  <span>Filters ({activeFilterCount})</span>
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Model Name</label>
                <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileFilterOpen(false); }} className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Apache, NTORQ, Raider..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => updateParams({ category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Engine Capacity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Engine Capacity</label>
                <select
                  value={selectedEngineCc}
                  onChange={(e) => updateParams({ engineCc: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="ALL">All Capacities</option>
                  <option value="100">100cc (XL 100)</option>
                  <option value="125">125cc (NTORQ, Raider, Jupiter)</option>
                  <option value="160">160cc (Apache RTR 160 4V)</option>
                  <option value="200">200cc (Apache RTR 200 4V)</option>
                  <option value="225">225cc - 310cc (Ronin, RR 310)</option>
                  <option value="electric">Electric (iQube)</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Price Range (LKR)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParams({ minPrice: e.target.value || null })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 min-h-[44px] rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                View {sortedBikes.length} Bikes
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }}
                  className="w-full py-2.5 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BikesPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading TVS Catalog...</div>}>
        <BikesContent />
      </Suspense>
    </PublicLayout>
  );
}
