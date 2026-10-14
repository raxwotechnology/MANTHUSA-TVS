"use client";

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  X,
  Filter,
  ChevronDown,
  Car,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { VehicleCard } from '@/components/public/VehicleCard';
import { VehicleCardSkeleton } from '@/components/public/VehicleCardSkeleton';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { EmptyState } from '@/components/public/EmptyState';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import { PublicVehicle, fetchPublicVehicles, formatLKR } from '@/lib/publicApi';

function VehiclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Inquire dialog
  const [inquiryVehicle, setInquiryVehicle] = useState<PublicVehicle | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Filters read from URL params
  const keyword = searchParams.get('q') || '';
  const selectedMake = searchParams.get('make') || 'ALL';
  const selectedCategory = searchParams.get('category') || 'ALL';
  const selectedCondition = searchParams.get('condition') || 'ALL';
  const selectedFuel = searchParams.get('fuelType') || 'ALL';
  const selectedTransmission = searchParams.get('transmission') || 'ALL';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minYear = searchParams.get('minYear') || '';
  const maxYear = searchParams.get('maxYear') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  // Keyword input local state for smooth typing
  const [searchTerm, setSearchTerm] = useState(keyword);

  useEffect(() => {
    setSearchTerm(keyword);
  }, [keyword]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchPublicVehicles();
        setVehicles(data);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Update URL search parameters
  const updateParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(newParams)) {
      if (!val || val === 'ALL' || val === '') {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    }
    router.push(`/vehicles?${current.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchTerm.trim() || null });
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    router.push('/vehicles');
  };

  // Distinct filter options extracted from inventory
  const filterOptions = useMemo(() => {
    const makes = new Set<string>();
    const categories = new Set<string>();
    const conditions = new Set<string>();
    const fuels = new Set<string>();
    const transmissions = new Set<string>();

    vehicles.forEach((v) => {
      if (v.make) makes.add(v.make.trim());
      if (v.bodyType || v.vehicleType) categories.add((v.bodyType || v.vehicleType || '').trim());
      if (v.condition) conditions.add(v.condition.trim());
      if (v.fuelType) fuels.add(v.fuelType.trim());
      if (v.transmission) transmissions.add(v.transmission.trim());
    });

    return {
      makes: Array.from(makes).sort(),
      categories: Array.from(categories).sort(),
      conditions: Array.from(conditions).sort(),
      fuels: Array.from(fuels).sort(),
      transmissions: Array.from(transmissions).sort(),
    };
  }, [vehicles]);

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        // Keyword search
        if (keyword) {
          const q = keyword.toLowerCase();
          const matchTitle = `${v.make} ${v.model} ${v.variant || ''}`.toLowerCase().includes(q);
          const matchStock = (v.stockNumber || '').toLowerCase().includes(q);
          const matchColor = (v.color || '').toLowerCase().includes(q);
          if (!matchTitle && !matchStock && !matchColor) return false;
        }

        // Make filter
        if (selectedMake !== 'ALL' && v.make.trim().toLowerCase() !== selectedMake.toLowerCase()) {
          return false;
        }

        // Category
        if (selectedCategory !== 'ALL') {
          const cat = (v.bodyType || v.vehicleType || '').toLowerCase();
          if (!cat.includes(selectedCategory.toLowerCase())) return false;
        }

        // Condition
        if (selectedCondition !== 'ALL') {
          const cond = (v.condition || '').toLowerCase();
          if (!cond.includes(selectedCondition.toLowerCase())) return false;
        }

        // Fuel Type
        if (selectedFuel !== 'ALL' && (v.fuelType || '').toLowerCase() !== selectedFuel.toLowerCase()) {
          return false;
        }

        // Transmission
        if (selectedTransmission !== 'ALL' && (v.transmission || '').toLowerCase() !== selectedTransmission.toLowerCase()) {
          return false;
        }

        // Price range
        if (minPrice && v.sellingPrice < Number(minPrice)) return false;
        if (maxPrice && v.sellingPrice > Number(maxPrice)) return false;

        // Year range
        const vehicleYear = v.year || v.manufacturingYear || 0;
        if (minYear && vehicleYear < Number(minYear)) return false;
        if (maxYear && vehicleYear > Number(maxYear)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price_desc') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'year_desc') return (b.year || 0) - (a.year || 0);
        if (sortBy === 'mileage_asc') return (a.mileage || 0) - (b.mileage || 0);
        // Default newest arrivals
        return (b._id > a._id ? 1 : -1);
      });
  }, [
    vehicles,
    keyword,
    selectedMake,
    selectedCategory,
    selectedCondition,
    selectedFuel,
    selectedTransmission,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    sortBy,
  ]);

  // Active filter count for badge indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (keyword) count++;
    if (selectedMake !== 'ALL') count++;
    if (selectedCategory !== 'ALL') count++;
    if (selectedCondition !== 'ALL') count++;
    if (selectedFuel !== 'ALL') count++;
    if (selectedTransmission !== 'ALL') count++;
    if (minPrice || maxPrice) count++;
    if (minYear || maxYear) count++;
    return count;
  }, [
    keyword,
    selectedMake,
    selectedCategory,
    selectedCondition,
    selectedFuel,
    selectedTransmission,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
  ]);

  const FilterPanelContent = () => (
    <div className="space-y-6 text-xs text-slate-300">
      {/* Make Filter */}
      <div>
        <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
          Make
        </label>
        <select
          value={selectedMake}
          onChange={(e) => updateParams({ make: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
        >
          <option value="ALL">All Makes ({vehicles.length})</option>
          {filterOptions.makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Body Category Filter */}
      <div>
        <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
          Body Style
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
        >
          <option value="ALL">All Categories</option>
          <option value="SUV">SUV & Crossover</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Luxury">Luxury</option>
          <option value="Van">Van / Commercial</option>
        </select>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
          Condition
        </label>
        <select
          value={selectedCondition}
          onChange={(e) => updateParams({ condition: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
        >
          <option value="ALL">All Conditions</option>
          <option value="Brand New">Brand New</option>
          <option value="Reconditioned">Reconditioned</option>
          <option value="Pre-Owned">Pre-Owned / Used</option>
        </select>
      </div>

      {/* Fuel Type Filter */}
      <div>
        <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
          Fuel & Powertrain
        </label>
        <select
          value={selectedFuel}
          onChange={(e) => updateParams({ fuelType: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
        >
          <option value="ALL">All Powertrains</option>
          <option value="Petrol">Petrol</option>
          <option value="Hybrid">Hybrid (e:HEV)</option>
          <option value="Electric">Electric (EV)</option>
          <option value="Diesel">Diesel</option>
        </select>
      </div>

      {/* Transmission Filter */}
      <div>
        <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
          Transmission
        </label>
        <select
          value={selectedTransmission}
          onChange={(e) => updateParams({ transmission: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
        >
          <option value="ALL">All Transmissions</option>
          <option value="Automatic">Automatic / CVT</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
          Price Range (LKR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => updateParams({ minPrice: e.target.value || null })}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="block font-bold uppercase tracking-wider text-slate-400 mb-2">
          Model Year
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="From (e.g. 2020)"
            value={minYear}
            onChange={(e) => updateParams({ minYear: e.target.value || null })}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
          <input
            type="number"
            placeholder="To (e.g. 2026)"
            value={maxYear}
            onChange={(e) => updateParams({ maxYear: e.target.value || null })}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Reset Button */}
      {activeFiltersCount > 0 && (
        <button
          type="button"
          onClick={handleClearAllFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold border border-rose-500/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Browse Vehicles' }]} />

      {/* Header section with total count and title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Certified Inventory
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Browse Available Vehicles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Displaying <span className="text-white font-bold">{filteredVehicles.length}</span> of {vehicles.length} inspected vehicles available for viewing and delivery.
          </p>
        </div>

        {/* Search Bar & View Mode Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Keyword Search form */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search make, model, stock#..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  updateParams({ q: null });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-medium focus:outline-none focus:border-amber-400"
          >
            <option value="newest">Sort: Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="year_desc">Newest Model Year</option>
            <option value="mileage_asc">Lowest Mileage</option>
          </select>

          {/* View toggle (Grid / List) */}
          <div className="hidden sm:flex items-center rounded-xl bg-slate-800 border border-slate-700 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-400 font-semibold">Active Filters:</span>
          {keyword && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-white">
              Keyword: "{keyword}"
              <button onClick={() => updateParams({ q: null })} className="hover:text-amber-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedMake !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-white">
              Make: {selectedMake}
              <button onClick={() => updateParams({ make: null })} className="hover:text-amber-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-white">
              Category: {selectedCategory}
              <button onClick={() => updateParams({ category: null })} className="hover:text-amber-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCondition !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-white">
              Condition: {selectedCondition}
              <button onClick={() => updateParams({ condition: null })} className="hover:text-amber-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedFuel !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-white">
              Fuel: {selectedFuel}
              <button onClick={() => updateParams({ fuelType: null })} className="hover:text-amber-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTransmission !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-white">
              Gearbox: {selectedTransmission}
              <button onClick={() => updateParams({ transmission: null })} className="hover:text-amber-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleClearAllFilters}
            className="text-xs text-amber-400 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Filters (3 cols) + Vehicles Listing (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar Filter Panel */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Filter Inventory</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            {FilterPanelContent()}
          </div>
        </aside>

        {/* Vehicles Grid / List Results */}
        <div className="lg:col-span-9">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
            </div>
          ) : filteredVehicles.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  viewMode={viewMode}
                  onQuickInquire={(v) => {
                    setInquiryVehicle(v);
                    setIsInquiryOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Vehicles Matched Your Search"
              description="We could not find any available vehicles meeting your specific combination of filters. Try widening your price range or clearing selected criteria."
              onReset={handleClearAllFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <span>Filters ({activeFiltersCount})</span>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {FilterPanelContent()}

            <div className="mt-8 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Show {filteredVehicles.length} Vehicles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Dialog Modal */}
      <InquiryDialog
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicle={inquiryVehicle}
      />
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading inventory...</div>}>
        <VehiclesContent />
      </Suspense>
    </PublicLayout>
  );
}
