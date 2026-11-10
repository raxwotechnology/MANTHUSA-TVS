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
  ChevronLeft,
  ChevronRight,
  Zap,
  SlidersHorizontal,
  Award,
  Wrench,
  Fuel,
  Compass,
  Camera,
  Eye,
  X,
  ZoomIn,
  Check
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

  // Showroom gallery lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const showroomImages = [
    {
      src: '/images/showroom/manthusa-tvs-front.jpg',
      title: 'MANTHUSA TVS Dealership Frontage',
      category: 'Official Dealership',
      caption: 'Direct TVS Lanka authorized sales showroom at 386 New Kandy Road, Weliweriya with complete motorcycle lineup on display.',
      tag: 'Main Showroom'
    },
    {
      src: '/images/showroom/showroom-entrance-arch.jpg',
      title: 'Showroom Entrance & Welcome Arch',
      category: 'Customer Welcoming',
      caption: 'Official TVS ceremonial arch with dedicated customer handover station and on-site bank leasing partners.',
      tag: 'Welcome Bay'
    },
    {
      src: '/images/showroom/ntorq-scooters-lineup.jpg',
      title: 'TVS NTORQ 125 Sport Scooter Fleet',
      category: 'Scooter Lineup',
      caption: 'Sri Lanka\'s top-selling performance scooter in Marine Blue, Combat Grey, and Stealth Black ready for test rides.',
      tag: 'Best Seller'
    },
    {
      src: '/images/showroom/showroom-display-fleet.jpg',
      title: 'Showroom Fleet & Ready Stock',
      category: 'Immediate Handover',
      caption: 'Wide selection of TVS scooters and daily commuters inspected and prepped for immediate ride-away.',
      tag: 'Ready for Delivery'
    },
    {
      src: '/images/showroom/showroom-bikes-angle.jpg',
      title: 'TVS Raider & Performance Series',
      category: 'TVS Racing DNA',
      caption: 'Factory-fresh TVS motorbikes backed by 5-year official TVS Lanka warranty and 3 free periodic services.',
      tag: 'Race Tuned'
    }
  ];

  // Quick inquiry modal state
  const [inquiryVehicle, setInquiryVehicle] = useState<PublicVehicle | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Keyboard navigation for showroom gallery lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + showroomImages.length) % showroomImages.length : null));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % showroomImages.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showroomImages.length]);

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

  const dealershipName = brand?.dealershipName || 'MANTHUSA TVS';
  const hotline = brand?.hotline || brand?.phone || '+94 11 268 4900';
  const whatsapp = brand?.whatsapp || '+94771234567';
  const heroBackgroundImage = '/images/hero-tvs-bikes.png';

  return (
    <PublicLayout brand={brand}>
      {/* 1. HERO SECTION */}
      <section className="site-hero relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#020617]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('${heroBackgroundImage}')`,
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
                <span>2 Free Periodic Services</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Official Weliweriya Showroom</span>
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flagship Performance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              FEATURED TVS MOTORCYCLES
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Top-selling models equipped with TVS Racing technology and SmartXonnect telemetry.
            </p>
          </div>

          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors uppercase tracking-wider"
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
                  src="https://cdn.bikedekho.com/upload/userfiles/images/69cac34e2807c.jpg"
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
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">5-Year Manufacturer Warranty</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enjoy 5 years or 70,000 km warranty backing directly from TVS Motor Company, covering engine, transmission, and major components.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 hover:border-red-500/40 transition-colors shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">2 Free Periodic Services</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every TVS bike sold comes with 2 free maintenance services executed by factory-certified motorcycle technicians using genuine TVS oil.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 hover:border-red-500/40 transition-colors shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/20">
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

      {/* 6.5 OFFICIAL SHOWROOM & SALES FLEET GALLERY */}
      <section className="py-20 bg-slate-100/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Real Showroom Experience • Weliweriya</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                VISIT OUR SALES SHOWROOM & FLEET
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                Step into MANTHUSA TVS to experience Sri Lanka&apos;s official TVS motorcycle lineup in person. Browse ready stock of TVS NTORQ, Apache, Raider, and commuter models at our Weliweriya dealership.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/book-test-drive"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/30"
              >
                <span>Book a Test Ride</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-300 dark:border-slate-700"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Showroom Location</span>
              </Link>
            </div>
          </div>

          {/* Pure Images Showcase Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {showroomImages.map((img, idx) => (
              <div
                key={img.src}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-red-500 shadow-md hover:shadow-2xl transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle hover overlay with zoom pill */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 shadow-xl backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-xs font-bold">
                    <ZoomIn className="w-3.5 h-3.5 text-red-600" />
                    <span>View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Showroom Highlights Strip */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Direct TVS Lanka Authorised</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Spot Bank & Leasing Facilities</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Full Genuine Parts & Service Bay</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
              <span>Live Test Rides Available Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEALERSHIP SHOWROOM */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2 border border-red-500/20">
              <MapPin className="w-3.5 h-3.5" />
              <span>Our Location</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              OUR SHOWROOM & SERVICE CENTER
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Visit our fully equipped TVS motorcycle showroom for test rides, bike handovers, and genuine TVS service.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">MANTHUSA TVS - Weliweriya Showroom</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">386, New Kandy Road, Weliweriya</p>
            <div className="text-xs text-red-600 dark:text-red-400 font-bold pt-1">075-6000 310 / 076-5710 601</div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">In Stock: Apache, NTORQ, Raider, Ronin</div>
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

      {/* Showroom Image Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-300">
                  MANTHUSA TVS Showroom & Fleet • {lightboxIndex + 1} of {showroomImages.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[50vh] max-h-[68vh] p-2 sm:p-4 select-none">
              <button
                onClick={() => setLightboxIndex((lightboxIndex - 1 + showroomImages.length) % showroomImages.length)}
                className="absolute left-3 sm:left-5 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all hover:scale-110 shadow-lg"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <img
                src={showroomImages[lightboxIndex].src}
                alt={showroomImages[lightboxIndex].title}
                className="max-h-[64vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />

              <button
                onClick={() => setLightboxIndex((lightboxIndex + 1) % showroomImages.length)}
                className="absolute right-3 sm:right-5 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition-all hover:scale-110 shadow-lg"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto">
              {showroomImages.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    lightboxIndex === i
                      ? 'border-red-500 scale-105 shadow-md shadow-red-500/30'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
