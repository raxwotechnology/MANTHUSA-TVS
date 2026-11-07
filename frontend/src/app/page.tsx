"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CalendarCheck,
  Calculator,
  BadgeDollarSign,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ChevronRight,
  Zap,
  SlidersHorizontal,
  Award,
  Wrench,
  Fuel,
  Compass
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { VehicleCard } from '@/components/public/VehicleCard';
import { VehicleCardSkeleton } from '@/components/public/VehicleCardSkeleton';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import {
  PublicVehicle,
  fetchPublicVehicles,
  formatLKR
} from '@/lib/publicApi';
import { useSettings } from '@/lib/useSettings';

export default function HomePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { settings: brand } = useSettings();

  // Quick search form state
  const [searchCategory, setSearchCategory] = useState('ALL');
  const [searchEngineCc, setSearchEngineCc] = useState('ALL');
  const [searchPriceMax, setSearchPriceMax] = useState('ALL');

  // Quick inquiry modal state
  const [inquiryVehicle, setInquiryVehicle] = useState<PublicVehicle | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const vehiclesData = await fetchPublicVehicles();
        setVehicles(vehiclesData);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredBikes = useMemo(() => {
    const featured = vehicles.filter((v) => v.isFeatured);
    return featured.length > 0 ? featured : vehicles.slice(0, 4);
  }, [vehicles]);

  const latestArrivals = useMemo(() => {
    return vehicles.slice(0, 6);
  }, [vehicles]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCategory !== 'ALL') params.set('category', searchCategory);
    if (searchEngineCc !== 'ALL') params.set('engineCc', searchEngineCc);
    if (searchPriceMax !== 'ALL') params.set('maxPrice', searchPriceMax);
    router.push(`/bikes?${params.toString()}`);
  };

  const categories = [
    {
      name: 'Sport Motorcycles',
      key: 'Sport Motorcycles',
      models: 'Apache RTR 160 4V • RTR 200 4V',
      img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Smart Performance Scooters',
      key: 'Scooters',
      models: 'NTORQ 125 • Jupiter 125',
      img: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Daily Commuters & Utility',
      key: 'Commuter Motorcycles',
      models: 'Raider 125 • XL 100 Heavy Duty',
      img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Premium & Scrambler',
      key: 'Premium Motorcycles',
      models: 'Ronin 225 • Apache RR 310',
      img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Electric Two-Wheelers',
      key: 'Electric Two-Wheelers',
      models: 'TVS iQube S • 100km Range',
      img: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const dealershipName = brand?.dealershipName || 'MANTHUSA TV';
  const hotline = brand?.hotline || brand?.phone || '+94 11 268 4900';
  const whatsapp = brand?.whatsapp || '+94771234567';

  return (
    <PublicLayout brand={brand}>
      {/* 1. HERO SECTION */}
      <section className="site-hero relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#020617]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/80 to-[#020617]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/70 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 backdrop-blur-md text-red-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-red-500" />
              <span>Official TVS Motorcycle Dealership</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              <span className="text-white drop-shadow-md">ENGINEERED FOR THRILL.</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
                BUILT FOR EVERY RIDE.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed drop-shadow-sm">
              Experience the track-tested TVS Apache Racing series, high-tech connected NTORQ smart scooters, dependable commuter champions, and clean electric mobility.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/bikes"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-600/30"
              >
                <span>Explore TVS Lineup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/configure"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 backdrop-blur-md hover:border-red-500/50"
              >
                <SlidersHorizontal className="w-4 h-4 text-red-400" />
                <span>Configure & Book Online</span>
              </Link>
            </div>

            {/* TVS Highlights pills */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>3 Free Periodic Services</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Islandwide Branches</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Easy Leasing & Finance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK SEARCH BAR */}
      <section className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleQuickSearch}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="ALL">All Categories</option>
              <option value="Sport Motorcycles">Sport Motorcycles</option>
              <option value="Scooters">Scooters</option>
              <option value="Commuter Motorcycles">Commuter Motorcycles</option>
              <option value="Premium Motorcycles">Premium Motorcycles</option>
              <option value="Electric Two-Wheelers">Electric Two-Wheelers</option>
            </select>
          </div>

          {/* Engine Capacity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Engine Capacity
            </label>
            <select
              value={searchEngineCc}
              onChange={(e) => setSearchEngineCc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="ALL">All Engine Sizes</option>
              <option value="100">100cc (XL 100)</option>
              <option value="125">125cc (NTORQ, Raider, Jupiter)</option>
              <option value="160">160cc (Apache RTR 160 4V)</option>
              <option value="200">200cc (Apache RTR 200 4V)</option>
              <option value="225">225cc+ (Ronin, Apache RR 310)</option>
              <option value="electric">Electric (iQube)</option>
            </select>
          </div>

          {/* Max Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Budget (Max Price)
            </label>
            <select
              value={searchPriceMax}
              onChange={(e) => setSearchPriceMax(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="ALL">Any Budget</option>
              <option value="500000">Under Rs. 500,000</option>
              <option value="800000">Under Rs. 800,000</option>
              <option value="1200000">Under Rs. 1,200,000</option>
              <option value="1500000">Under Rs. 1,500,000</option>
              <option value="2500000">Up to Rs. 2,500,000</option>
            </select>
          </div>

          {/* Submit Search */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 shadow-md shadow-red-600/20"
          >
            <Search className="w-4 h-4" />
            <span>Search Bikes</span>
          </button>
        </form>
      </section>

      {/* 3. FEATURED TVS MOTORCYCLES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Performance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              FEATURED TVS MOTORCYCLES
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Top-selling models equipped with TVS Racing technology and SmartXonnect telemetry.
            </p>
          </div>

          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
          >
            <span>View All Bikes ({vehicles.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredBikes.map((bike) => (
              <VehicleCard
                key={bike._id}
                vehicle={bike}
                onQuickInquire={(v) => {
                  setInquiryVehicle(v);
                  setIsInquiryOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. MOTORCYCLE CATEGORIES GRID */}
      <section className="py-16 bg-slate-100/60 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              EXPLORE BY CATEGORY
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Find the perfect two-wheeler matched to your commuting needs, racing passions, or family journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/bikes?category=${encodeURIComponent(cat.key)}`}
                className="category-card dark-panel group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-end h-72 p-5"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-108"
                  style={{ backgroundImage: `url('${cat.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

                <div className="relative z-10 space-y-1">
                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors drop-shadow-sm">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-200 line-clamp-1 drop-shadow-sm font-medium">
                    {cat.models}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 pt-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Models</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. STEP-BY-STEP SELECTION BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl dark-panel bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-950 border border-red-500/30 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Interactive Bike Configurator</span>
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                SELECT YOUR TVS MODEL, VARIANT, COLOR & BRANCH.
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Take the guesswork out of booking your new bike. Choose your preferred model, variant specs, matching paint color, and dealership branch. Track every step live in your customer portal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 pt-2 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-600/40 text-red-300 flex items-center justify-center font-bold text-[10px] border border-red-500/30">
                    1
                  </div>
                  <span>Choose TVS Model</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-600/40 text-red-300 flex items-center justify-center font-bold text-[10px] border border-red-500/30">
                    2
                  </div>
                  <span>Select Variant (Disc/ABS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-600/40 text-red-300 flex items-center justify-center font-bold text-[10px] border border-red-500/30">
                    3
                  </div>
                  <span>Pick Factory Color</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-600/40 text-red-300 flex items-center justify-center font-bold text-[10px] border border-red-500/30">
                    4
                  </div>
                  <span>Select Nearest Branch</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/configure"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-xl shadow-red-600/30"
                >
                  <span>Launch Bike Configurator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80"
                  alt="TVS Apache RTR Configurator"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE TVS DEALERSHIP */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              WHY CHOOSE TVS MOTORCYCLE DEALERSHIP?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              We provide complete peace of mind with authorized manufacturer warranty, genuine parts, certified technicians, and seamless digital booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 hover:border-red-500/40 transition-colors shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">5-Year Manufacturer Warranty</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enjoy 5 years or 70,000 km warranty backing directly from TVS Motor Company, covering engine, transmission, and major components.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 hover:border-red-500/40 transition-colors shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">3 Free Periodic Services</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every TVS bike sold comes with 3 free maintenance services executed by factory-certified motorcycle technicians using genuine TVS oil.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 hover:border-red-500/40 transition-colors shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center">
                <BadgeDollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Instant Low-Rate Leasing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Special arrangements with leading commercial banks and leasing companies offering up to 85% financing with same-day pre-approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEALERSHIP BRANCH LOCATOR */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Islandwide Presence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              OUR SHOWROOMS & SERVICE BRANCHES
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Visit our fully equipped TVS motorcycle showrooms for test rides, bike handovers, and genuine TVS service.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors uppercase tracking-wider"
          >
            <span>All Branch Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Colombo Flagship Hub</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">No. 142/B, Baseline Road, Colombo 09</p>
            <div className="text-xs text-red-600 dark:text-red-400 font-bold pt-1">+94 11 268 4900</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">In Stock: Apache, NTORQ, Raider, Ronin</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kandy City Showroom</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">No. 88, Peradeniya Road, Kandy</p>
            <div className="text-xs text-red-600 dark:text-red-400 font-bold pt-1">+94 81 223 4500</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">In Stock: Apache 160/200, NTORQ, Jupiter</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Galle Coastal Center</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">No. 215, Colombo Road, Galle</p>
            <div className="text-xs text-red-600 dark:text-red-400 font-bold pt-1">+94 91 224 5600</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">In Stock: NTORQ 125, Jupiter 125, XL 100</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kurunegala Sales Hub</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">No. 54, Negombo Road, Kurunegala</p>
            <div className="text-xs text-red-600 dark:text-red-400 font-bold pt-1">+94 37 228 9100</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">In Stock: Raider 125, XL 100, Apache 160</div>
          </div>
        </div>
      </section>

      {/* Inquiry Dialog */}
      {inquiryVehicle && (
        <InquiryDialog
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          vehicle={inquiryVehicle}
        />
      )}
    </PublicLayout>
  );
}
