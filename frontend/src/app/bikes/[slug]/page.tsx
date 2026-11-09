"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Flame,
  MessageCircle,
  Calculator,
  Heart,
  Scale,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Phone,
  SlidersHorizontal,
  MapPin,
  Check,
  Zap,
  Award,
  Wrench,
  FileText
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { PriceDisplay } from '@/components/public/PriceDisplay';
import { AvailabilityBadge } from '@/components/public/AvailabilityBadge';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { VehicleCard } from '@/components/public/VehicleCard';
import {
  PublicVehicle,
  TVSVariant,
  TVSColor,
  fetchPublicVehicle,
  fetchPublicVehicles,
  formatLKR,
  submitPublicInquiry
} from '@/lib/publicApi';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';
import { useSettings } from '@/lib/useSettings';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BikeDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { settings: brand } = useSettings();

  const [bike, setBike] = useState<PublicVehicle | null>(null);
  const [allBikes, setAllBikes] = useState<PublicVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected variant & color state
  const [selectedVariant, setSelectedVariant] = useState<TVSVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<TVSColor | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  // Quotation dialog
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState('');
  const [quoteError, setQuoteError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredBranch, setPreferredBranch] = useState('Colombo Central Flagship Hub');
  const [quoteMessage, setQuoteMessage] = useState('');

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInComparison, toggleVehicle } = useComparison();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [bikeData, bikesList] = await Promise.all([
          fetchPublicVehicle(slug),
          fetchPublicVehicles(),
        ]);
        if (bikeData) {
          setBike(bikeData);
          // Set initial default variant
          const defVariant =
            bikeData.variants?.find((v) => v.isDefault) ||
            bikeData.variants?.[0] ||
            null;
          setSelectedVariant(defVariant);

          // Set initial color
          const defColor = bikeData.colors?.[0] || null;
          setSelectedColor(defColor);

          // Set active image
          if (defColor?.imageUrl) {
            setActiveImage(defColor.imageUrl);
          } else if (bikeData.images && bikeData.images.length > 0) {
            setActiveImage(bikeData.images[0]);
          }
        }
        setAllBikes(bikesList || []);
      } catch (err) {
        console.error('Failed to load bike details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  // Pre-fill user data if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setCustomerName(u.name);
        if (u.email) setCustomerEmail(u.email);
        if (u.phone) setCustomerPhone(u.phone);
      }
    } catch {
      // Ignore
    }
  }, []);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
          <div className="animate-pulse space-y-4 max-w-lg mx-auto">
            <div className="h-8 bg-slate-800 rounded-xl" />
            <div className="h-64 bg-slate-800 rounded-2xl" />
            <div className="h-32 bg-slate-800 rounded-xl" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!bike) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">TVS Motorcycle Not Found</h1>
          <p className="text-xs text-slate-400">The requested bike model does not exist or may have been updated.</p>
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
          >
            <span>Back to TVS Catalog</span>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : bike.sellingPrice;
  const similarBikes = allBikes
    .filter((b) => b._id !== bike._id && (b.category === bike.category || b.make === 'TVS'))
    .slice(0, 3);

  const favorited = isFavorite(bike._id);
  const inComparison = isInComparison(bike._id);

  // When color is changed by user:
  const handleColorSelect = (c: TVSColor) => {
    setSelectedColor(c);
    if (c.imageUrl) {
      setActiveImage(c.imageUrl);
    }
  };

  const handleVariantSelect = (v: TVSVariant) => {
    setSelectedVariant(v);
  };

  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    setQuoteError('');
    setQuoteSuccess('');

    try {
      await submitPublicInquiry({
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail,
        vehicleId: bike._id,
        modelName: bike.model,
        variantName: selectedVariant?.name || bike.variant,
        selectedColor: selectedColor?.name || bike.color,
        preferredBranchName: preferredBranch,
        budget: currentPrice,
        inquiryType: 'Quotation Request',
        message: quoteMessage || `Customer requested quotation for ${bike.model} (${selectedVariant?.name || 'Standard'}).`,
      });

      setQuoteSuccess('Quotation request submitted! Our TVS sales officer will contact you with the official quotation.');
      setTimeout(() => {
        setIsQuoteOpen(false);
        setQuoteSuccess('');
      }, 3000);
    } catch (err: any) {
      setQuoteError(err.message || 'Error submitting request. Please try again or WhatsApp our team.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <PublicLayout brand={brand}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Motorcycles', href: '/bikes' },
            { label: `${bike.make} ${bike.model}` },
          ]}
        />

        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold uppercase tracking-wider">
                {bike.category || 'TVS Motorcycle'}
              </span>
              <AvailabilityBadge status={bike.status} condition={bike.condition} />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {bike.make} {bike.model}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {bike.shortDescription || bike.description || 'Experience cutting-edge racing technology and high fuel economy.'}
            </p>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {selectedVariant ? `Price for ${selectedVariant.name}` : 'Starting Price'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-500 tracking-tight">
              {formatLKR(currentPrice)}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">
              Includes 5-Year / 70,000 km TVS Official Warranty
            </span>
          </div>
        </div>

        {/* Gallery & Quick Selection Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visual & Color Picker (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Display Image */}
            <div className="relative aspect-[4/3] rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl flex items-center justify-center p-4">
              <img
                src={activeImage || bike.images[0]}
                alt={`${bike.model} in ${selectedColor?.name || 'Display Color'}`}
                className="w-full h-full object-contain object-center transition-all duration-300"
              />

              {/* Color name tag overlay */}
              {selectedColor && (
                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex || '#333' }}
                  />
                  <span className="text-xs font-bold text-white tracking-wide">
                    {selectedColor.name}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {bike.images && bike.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {bike.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 bg-slate-50 dark:bg-slate-950 shrink-0 transition-all cursor-pointer ${
                      activeImage === img ? 'border-red-500 scale-105' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Configuration & Action Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 md:p-7 space-y-6 shadow-md">
              {/* 1. SELECT VARIANT */}
              {bike.variants && bike.variants.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      1. Select Variant
                    </span>
                    <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                      {selectedVariant?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {bike.variants.map((v, i) => {
                      const isSelected = selectedVariant?.name === v.name;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleVariantSelect(v)}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-red-500 bg-red-50 dark:bg-red-600/10 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {isSelected && <Check className="w-3.5 h-3.5 text-red-500" />}
                              <span>{v.name}</span>
                            </div>
                            {v.code && <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{v.code}</div>}
                          </div>
                          <div className="text-xs font-black text-red-600 dark:text-red-400">
                            {formatLKR(v.price)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. SELECT COLOR */}
              {bike.colors && bike.colors.length > 0 && (
                <div className="space-y-3 border-t border-slate-800/80 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      2. Choose Color
                    </span>
                    <span className="text-xs font-bold text-red-400">
                      {selectedColor?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {bike.colors.map((c, i) => {
                      const isSelected = selectedColor?.name === c.name;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleColorSelect(c)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-red-500 bg-red-600/10 text-white'
                              : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-slate-600 shrink-0 shadow-sm"
                            style={{ backgroundColor: c.hex || '#333' }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. BRANCH AVAILABILITY PREVIEW */}
              {bike.branchStock && bike.branchStock.length > 0 && (
                <div className="space-y-2.5 border-t border-slate-200 dark:border-slate-800/80 pt-5 text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Branch Availability
                  </span>
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                    {bike.branchStock.map((b, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{b.branchName}</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {b.quantity > 0 ? `${b.quantity} Units Ready` : 'Available on Order'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. PRIMARY ACTIONS */}
              <div className="pt-2 space-y-3">
                <Link
                  href={`/configure?model=${encodeURIComponent(bike.model)}&variant=${encodeURIComponent(
                    selectedVariant?.name || ''
                  )}&color=${encodeURIComponent(selectedColor?.name || '')}`}
                  className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-102 active:scale-98"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Configure & Book This Bike</span>
                </Link>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsQuoteOpen(true)}
                    className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    <span>Get Quotation</span>
                  </button>

                  <a
                    href={`https://wa.me/94771234567?text=Hello%20TVS%20SalesPlus%2C%20I%20am%20interested%20in%20${encodeURIComponent(
                      bike.model
                    )}%20(${encodeURIComponent(selectedVariant?.name || 'Standard')}%20in%20${encodeURIComponent(
                      selectedColor?.name || 'Standard'
                    )}).%20Please%20share%20details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Compare Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (bike) toggleVehicle(bike._id);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    bike && isInComparison(bike._id)
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span>{bike && isInComparison(bike._id) ? '✓ In Comparison (Remove)' : '+ Add to Side-by-Side Compare'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOTORCYCLE SPECIFICATIONS TABLE */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              TVS TECHNICAL SPECIFICATIONS
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Verified technical data, dimensions, and racing telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engine & Performance */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-red-500" />
                <span>Engine & Performance</span>
              </h3>
              <div className="divide-y divide-slate-200 dark:divide-slate-800/80 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Displacement / Capacity</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bike.engineCapacity || 'N/A'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Engine Type</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right max-w-xs">{bike.engineType || '4-Stroke SI Engine'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Maximum Power</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{bike.maxPower || 'High Output'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Maximum Torque</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bike.maxTorque || 'N/A'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Cooling System</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bike.coolingSystem || 'Air Cooled'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Fuel System</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bike.fuelSystem || 'Fuel Injection'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Transmission</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bike.transmission || 'Manual'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Starting System</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bike.startingSystem || 'Electric Start'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Fuel Economy / Mileage</span>
                  <span className="font-bold text-emerald-400">{bike.mileage ? `${bike.mileage} km/l` : 'EcoThrust Efficient'}</span>
                </div>
              </div>
            </div>

            {/* Brakes, Suspension & Dimensions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Brakes, Suspension & Dimensions</span>
              </h3>
              <div className="divide-y divide-slate-800/80 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Braking Technology</span>
                  <span className="font-bold text-red-400">{bike.brakingSystem || 'Super-Moto ABS / SBT'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Front Brake</span>
                  <span className="font-bold text-white">{bike.frontBrake || 'Roto Petal Disc'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Rear Brake</span>
                  <span className="font-bold text-white">{bike.rearBrake || 'Disc / Drum'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Front Suspension</span>
                  <span className="font-bold text-white">{bike.frontSuspension || 'Telescopic Forks'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Rear Suspension</span>
                  <span className="font-bold text-white">{bike.rearSuspension || 'Monoshock Damper'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Tyre Dimensions</span>
                  <span className="font-bold text-white">{bike.tyreDimensions || 'Tubeless'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Fuel Tank Capacity</span>
                  <span className="font-bold text-white">{bike.fuelTankCapacity || '12 L'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Seat Height</span>
                  <span className="font-bold text-white">{bike.seatHeight || '800 mm'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Kerb Weight</span>
                  <span className="font-bold text-white">{bike.kerbWeight || '144 kg'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SMART FEATURES LIST */}
        {bike.smartFeatures && bike.smartFeatures.length > 0 && (
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-500" />
              <span>KEY TVS RACING & SMART FEATURES</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {bike.smartFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SIMILAR BIKES */}
        {similarBikes.length > 0 && (
          <section className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              SIMILAR TVS MOTORCYCLES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarBikes.map((sb) => (
                <VehicleCard key={sb._id} vehicle={sb} />
              ))}
            </div>
          </section>
        )}

        {/* QUOTATION MODAL */}
        {isQuoteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white">Request Official TVS Quotation</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {bike.model} • {selectedVariant?.name || 'Standard'} • {selectedColor?.name || 'Standard'}
                  </p>
                </div>
                <button
                  onClick={() => setIsQuoteOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {quoteSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                  {quoteSuccess}
                </div>
              )}

              {quoteError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                  {quoteError}
                </div>
              )}

              <form onSubmit={handleQuotationSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Kasun Silva"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 0771234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Preferred Dealership Branch</label>
                  <select
                    value={preferredBranch}
                    onChange={(e) => setPreferredBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Colombo Central Flagship Hub">Colombo Central Flagship Hub</option>
                    <option value="Kandy City TVS Showroom">Kandy City TVS Showroom</option>
                    <option value="Galle Coastal TVS Center">Galle Coastal TVS Center</option>
                    <option value="Kurunegala North TVS Sales Hub">Kurunegala North TVS Sales Hub</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Message / Financing Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    placeholder="e.g. Inquiring about 3-year leasing or trade-in..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Estimated Price:</span>
                  <span className="text-base font-black text-red-500">{formatLKR(currentPrice)}</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuoteOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {quoteSubmitting ? 'Sending...' : 'Request Quotation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
