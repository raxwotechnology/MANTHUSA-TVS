"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
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
  Flame,
  Award,
  FileCheck
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
  const [searchMake, setSearchMake] = useState('ALL');
  const [searchCategory, setSearchCategory] = useState('ALL');
  const [searchPriceMax, setSearchPriceMax] = useState('ALL');
  const [searchFuel, setSearchFuel] = useState('ALL');

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

  // Distinct makes and categories for quick search
  const availableMakes = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.make) set.add(v.make.trim());
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Featured vehicles (first 3)
  const featuredVehicles = useMemo(() => {
    return vehicles.slice(0, 3);
  }, [vehicles]);

  // Latest arrivals (next 6)
  const latestArrivals = useMemo(() => {
    return vehicles.slice(0, 6);
  }, [vehicles]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchMake !== 'ALL') params.set('make', searchMake);
    if (searchCategory !== 'ALL') params.set('category', searchCategory);
    if (searchPriceMax !== 'ALL') params.set('maxPrice', searchPriceMax);
    if (searchFuel !== 'ALL') params.set('fuelType', searchFuel);
    router.push(`/vehicles?${params.toString()}`);
  };

  const categories = [
    { name: 'SUVs & Crossovers', key: 'SUV', count: 'High Clearance', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Executive Sedans', key: 'Sedan', count: 'Luxury & Comfort', img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80' },
    { name: 'Electric & Hybrids', key: 'Electric', count: 'Eco Performance', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80' },
    { name: 'Premium Luxury', key: 'Luxury', count: 'Elite Prestige', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80' },
  ];

  const whyChooseUs = [
    {
      title: '150-Point Certified Inspection',
      desc: 'Every vehicle undergoes comprehensive mechanical, chassis, electronics, and road-worthiness testing by certified technicians.',
      icon: ShieldCheck,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    },
    {
      title: 'Verified Ownership & Revenue Records',
      desc: 'Guaranteed clear titles, certified customs clearance, transparent previous owners, and verified revenue licenses.',
      icon: FileCheck,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    },
    {
      title: 'Competitive Leasing Partnerships',
      desc: 'Exclusive lower interest rates with leading banks including Commercial Bank, HNB, Sampath, and premier finance institutions.',
      icon: Calculator,
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    },
    {
      title: 'Transparent Pricing & Fair Valuations',
      desc: 'Strictly zero hidden dealer fees, direct market valuations for trade-ins, and realistic warranty protection packages.',
      icon: Award,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    },
  ];

  const buyingSteps = [
    {
      step: '01',
      title: 'Explore & Compare',
      desc: 'Browse our dynamic showroom inventory, compare specifications, and calculate tailored leasing installments.',
    },
    {
      step: '02',
      title: 'Book Inspection or Test Drive',
      desc: 'Schedule a private viewing at our showroom or request a test drive slot with one of our automotive consultants.',
    },
    {
      step: '03',
      title: 'Fast-Track Financing',
      desc: 'Submit your leasing paperwork with our on-site bank liaison officers for same-day evaluation and pre-approval.',
    },
    {
      step: '04',
      title: 'Handover & Warranty Delivery',
      desc: 'Receive your vehicle fully detailed with original documentation, service warranty booklet, and post-sale support.',
    },
  ];

  return (
    <PublicLayout>
      {/* 1. HERO SECTION */}
      <section className="dark-panel relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Background Luxury Vehicle Image with Dark Atmospheric Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={brand.website?.hero?.backgroundImage || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"}
            alt="Premium Vehicle Dealership Showroom"
            className="w-full h-full object-cover object-center opacity-30 filter scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{brand.tagline || "Sri Lanka's Premier Vehicle Dealership & Direct Importer"}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl font-sans">
            {brand.website?.hero?.headline || "Find the Right Vehicle for Your Next Journey."}
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
            {brand.website?.hero?.subheadline || "Explore our vehicle collection, compare your options, and connect with our team to find a vehicle that suits your needs and budget."}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href={brand.website?.hero?.ctaPrimaryLink || "/vehicles"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 hover:scale-102"
            >
              <span>{brand.website?.hero?.ctaPrimaryText || "Browse Vehicle Inventory"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={brand.website?.hero?.ctaSecondaryLink || "/sell-your-vehicle"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider transition-all border border-slate-700/80 backdrop-blur-md"
            >
              <BadgeDollarSign className="w-4 h-4 text-amber-400" />
              <span>{brand.website?.hero?.ctaSecondaryText || "Sell / Value Your Vehicle"}</span>
            </Link>
          </div>

          {/* Key Trust Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 border-t border-slate-800/80 pt-8 max-w-4xl w-full">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Title Inspected</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">150+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Point Diagnostics</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">48 Hrs</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Leasing Approval</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">24/7</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ADVANCED QUICK VEHICLE SEARCH FORM */}
      <section className="relative z-20 -mt-10 sm:-mt-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Search className="w-4 h-4" />
            <span>Search Our Live Showroom Inventory</span>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Make */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">
                Vehicle Make
              </label>
              <select
                value={searchMake}
                onChange={(e) => setSearchMake(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Makes (Toyota, Honda...)</option>
                {availableMakes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">
                Body Category
              </label>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Categories</option>
                <option value="SUV">SUV & Crossover</option>
                <option value="Sedan">Executive Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury & Sports</option>
                <option value="Van">Van & Commercial</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">
                Powertrain / Fuel
              </label>
              <select
                value={searchFuel}
                onChange={(e) => setSearchFuel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Pure Electric (EV)</option>
                <option value="Diesel">Diesel</option>
              </select>
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1.5">
                Max Budget
              </label>
              <select
                value={searchPriceMax}
                onChange={(e) => setSearchPriceMax(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">Any Budget</option>
                <option value="12000000">Under Rs. 12 Million</option>
                <option value="18000000">Under Rs. 18 Million</option>
                <option value="25000000">Under Rs. 25 Million</option>
                <option value="40000000">Under Rs. 40 Million</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-11 inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/10"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Find Vehicles</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. FEATURED VEHICLES */}
      {brand.website?.sections?.showFeatured !== false && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                <Flame className="w-4 h-4" />
                <span>Dealership Spotlight</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Inventory
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-lg">
                Handpicked vehicles offering exceptional value, verified condition, and instant showroom availability.
              </p>
            </div>

            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
            >
              <span>View All ({vehicles.length}) Vehicles</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
              <VehicleCardSkeleton />
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
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
            <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-8">
              <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold">New inventory arriving soon.</p>
              <p className="text-xs text-slate-400 mt-1">Contact our team to place a direct import order.</p>
            </div>
          )}
        </section>
      )}

      {/* 4. BROWSE BY CATEGORY */}
      {brand.website?.sections?.showCategories !== false && (
        <section className="py-16 bg-slate-950/60 border-y border-slate-850">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Discover by Style
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Explore Vehicle Categories
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Filter through our diverse collection tailored for luxury commuting, family travel, and electric mobility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={`/vehicles?category=${cat.key}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all shadow-lg"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-medium text-amber-400 block">
                        {cat.count}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700/80 flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. LATEST ARRIVALS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Just Added To Showroom</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Latest Arrivals
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-lg">
              Freshly imported shipments with low mileage, complete auction sheets, and verified inspection records.
            </p>
          </div>

          <Link
            href="/vehicles?sort=newest"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>See Newest Arrivals</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VehicleCardSkeleton />
            <VehicleCardSkeleton />
            <VehicleCardSkeleton />
          </div>
        ) : latestArrivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArrivals.map((vehicle) => (
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
          <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 p-8">
            <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold">Live inventory synchronized from VSMS.</p>
          </div>
        )}
      </section>

      {/* 6. WHY BUY FROM US */}
      <section className="py-20 bg-slate-950 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              The SalesPlus Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Why Discerning Drivers Choose Us
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              We eliminate uncertainty from automotive purchases through transparent inspections, clear revenue documentation, and tailored customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. HOW THE BUYING PROCESS WORKS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Seamless & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            How The Buying Process Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Four straightforward steps from browsing our digital showroom to driving home your certified vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {buyingSteps.map((step, idx) => (
            <div
              key={step.step}
              className="relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black text-amber-400/80 font-mono block mb-3">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINANCE & LEASING TEASER BANNER */}
      <section className="dark-panel py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Calculator className="w-4 h-4" />
                Tailored Auto Financing
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Flexible Leasing Packages with Major Banks
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Enjoy customized repayment periods from 12 to 84 months, competitive interest rates, and seamless paperwork assistance through our verified financial institution network.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/finance"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Loan Calculator</span>
                </Link>
                <Link
                  href="/inquiry?type=Finance"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700"
                >
                  <span>Request Pre-Approval</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Preferred Leasing Partners
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Commercial Bank of Ceylon PLC</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hatton National Bank (HNB)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sampath Bank PLC</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>LOLC Finance PLC & Central Finance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SELL YOUR VEHICLE TRADE-IN BANNER */}
      <section className="dark-panel py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/20 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
              Vehicle Trade-In & Direct Purchase
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Looking to Sell or Upgrade Your Current Vehicle?
            </h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Submit your vehicle specifications and photos online. Our certified appraisers will evaluate market trends and offer a competitive cash offer or trade-in credit within 24 hours.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/sell-your-vehicle"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>Get Instant Valuation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-slate-700"
              >
                <span>Speak to Appraiser</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. LOCATION & SHOWROOM FACILITY */}
      <section className="py-16 bg-slate-950 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Visit Us In Person
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1 mb-4">
                Colombo Flagship Showroom
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Experience our curated inventory in an air-conditioned luxury lounge setting. Our automotive experts are ready to assist with vehicle inspections, test drives, and document transfers.
              </p>

              <div className="space-y-3.5 text-sm text-slate-300 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{brand?.address || 'No. 142/B, Baseline Road, Colombo 09, Sri Lanka'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{brand?.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                  <a href={`tel:${(brand?.hotline || '+94771234567').replace(/\s+/g, '')}`} className="hover:text-amber-400">
                    Hotline: {brand?.hotline || brand?.phone || '+94 77 123 4567'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${(brand?.whatsapp || '+94771234567').replace(/[^0-9]/g, '')}?text=Hello%20SalesPlus%2C%20I%20would%20like%20to%20visit%20the%20showroom`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Direct WhatsApp</span>
                </a>
                <Link
                  href="/book-test-drive"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-slate-700"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Test Drive</span>
                </Link>
              </div>
            </div>

            {/* Visual Showroom Preview Card */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="SalesPlus Flagship Showroom"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <p className="font-bold text-base">SalesPlus Auto Mart Showroom</p>
                  <p className="text-xs text-slate-300">Baseline Road, Colombo 09</p>
                </div>
                <a
                  href={brand?.googleMapsUrl || 'https://maps.google.com/?q=Colombo+Sri+Lanka'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors"
                >
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Dialog Modal */}
      <InquiryDialog
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicle={inquiryVehicle}
      />
    </PublicLayout>
  );
}
