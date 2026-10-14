"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CalendarCheck,
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
  Car,
  FileCheck,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { VehicleGallery } from '@/components/public/VehicleGallery';
import { SpecificationList } from '@/components/public/SpecificationList';
import { PriceDisplay } from '@/components/public/PriceDisplay';
import { AvailabilityBadge } from '@/components/public/AvailabilityBadge';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { FinanceCalculator } from '@/components/public/FinanceCalculator';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import { VehicleCard } from '@/components/public/VehicleCard';
import {
  PublicVehicle,
  fetchPublicVehicle,
  fetchPublicVehicles,
  fetchPublicSettings,
  formatLKR
} from '@/lib/publicApi';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';
import { BrandSettings, DEFAULT_BRAND } from '@/lib/useSettings';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function VehicleDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [vehicle, setVehicle] = useState<PublicVehicle | null>(null);
  const [allVehicles, setAllVehicles] = useState<PublicVehicle[]>([]);
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Inquiry dialog state
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState('Details');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInComparison, toggleVehicle } = useComparison();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [veh, list, settings] = await Promise.all([
          fetchPublicVehicle(slug),
          fetchPublicVehicles(),
          fetchPublicSettings(),
        ]);
        setVehicle(veh);
        setAllVehicles(list);
        setBrand(settings);
      } catch (err) {
        console.error('Failed to load vehicle details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
          <div className="h-6 w-48 bg-slate-800 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-96 bg-slate-800 rounded-3xl" />
            <div className="lg:col-span-4 h-96 bg-slate-800 rounded-3xl" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!vehicle) {
    return (
      <PublicLayout>
        <div className="max-w-xl mx-auto my-24 p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl">
          <Car className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Vehicle Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">
            The vehicle you are looking for may have been sold or removed from public listings.
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
          >
            <span>Browse Available Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const favorited = isFavorite(vehicle._id);
  const inComparison = isInComparison(vehicle._id);

  // Similar vehicles (same bodyType or make, excluding current)
  const similarVehicles = allVehicles
    .filter(
      (v) =>
        v._id !== vehicle._id &&
        (v.make === vehicle.make || v.bodyType === vehicle.bodyType || v.vehicleType === vehicle.vehicleType)
    )
    .slice(0, 3);

  const vehicleTitle = `${vehicle.year || ''} ${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}`.trim();
  const whatsappNumber = (brand?.whatsapp || '+94771234567').replace(/[^0-9]/g, '');
  const whatsappText = encodeURIComponent(
    `Hello SalesPlus! I am interested in inquiring about the ${vehicleTitle} (Stock: ${vehicle.stockNumber || vehicle._id}) listed for ${formatLKR(vehicle.sellingPrice)}. Is it available for viewing?`
  );

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleOpenInquiry = (type: string, msg: string = '') => {
    setInquiryType(type);
    setInquiryMessage(msg);
    setIsInquiryOpen(true);
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Browse Vehicles', href: '/vehicles' },
            { label: `${vehicle.make} ${vehicle.model}`, href: `/vehicles?make=${vehicle.make}` },
            { label: vehicleTitle },
          ]}
        />

        {/* Top Header: Title, Stock Number, and Action Icons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AvailabilityBadge status={vehicle.status} condition={vehicle.condition} />
              {vehicle.stockNumber && (
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                  Ref: {vehicle.stockNumber}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {vehicleTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Share */}
            <button
              onClick={handleShare}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Compare Toggle */}
            <button
              onClick={() => toggleVehicle(vehicle._id)}
              className={`p-3 rounded-xl border transition-colors ${
                inComparison
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
              }`}
              title={inComparison ? 'In Comparison' : 'Add to Comparison'}
            >
              <Scale className="w-5 h-5" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => toggleFavorite(vehicle._id)}
              className={`p-3 rounded-xl border transition-colors ${
                favorited
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border-slate-700'
              }`}
              title={favorited ? 'Saved in Favorites' : 'Save to Favorites'}
            >
              <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Vehicle link copied to clipboard! Share it with friends or family.</span>
          </div>
        )}

        {/* Main Section: Gallery (7 cols) + Price & Direct CTAs (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <VehicleGallery
              images={vehicle.images}
              title={vehicleTitle}
              mediaAngles={vehicle.mediaAngles}
            />
          </div>

          {/* Pricing, Dealership Verification & Action Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Selling Price Display */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Dealership Selling Price
                </span>
                <PriceDisplay price={vehicle.sellingPrice} size="xl" showEstimate={true} />
              </div>

              {/* Primary Call-To-Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Book Test Drive */}
                <Link
                  href={`/book-test-drive?vehicle=${vehicle._id}`}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20"
                >
                  <CalendarCheck className="w-5 h-5 text-slate-950" />
                  <span>Schedule Test Drive</span>
                </Link>

                {/* Make an Inquiry */}
                <button
                  type="button"
                  onClick={() => handleOpenInquiry('Purchase', `Interested in checking full availability for ${vehicleTitle}.`)}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-wider transition-all border border-slate-700"
                >
                  <MessageCircle className="w-4 h-4 text-amber-400" />
                  <span>Request Full Vehicle Dossier</span>
                </button>

                {/* Direct WhatsApp Chat */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Showroom Consultant</span>
                </a>
              </div>

              {/* Dealership Assurance Badges */}
              <div className="pt-4 border-t border-slate-850 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Certified 150-Point Inspection</span>
                    <span className="text-slate-400">Detailed diagnostic report verified by certified automotive engineers.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Clear Title & Registration Guarantee</span>
                    <span className="text-slate-400">Revenue license, registration documents, and clearance records in order.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Showroom Contact Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300 uppercase tracking-wider">
                Vehicle Location & Viewing
              </p>
              <p className="text-slate-200">
                On display at our <span className="font-bold text-white">{brand.city || 'Colombo'} Flagship Showroom</span>.
              </p>
              <p>
                Operating Hours: <span className="text-slate-300">{brand.openingHours || '8:30 AM - 6:30 PM'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Technical Specifications & Grouped Features */}
        <SpecificationList vehicle={vehicle} />

        {/* Embedded Interactive Finance Calculator Prefilled for This Vehicle */}
        <div>
          <FinanceCalculator
            initialPrice={vehicle.sellingPrice}
            vehicleTitle={vehicleTitle}
            vehicleId={vehicle._id}
            onInquire={(calc) =>
              handleOpenInquiry(
                'Finance',
                `Interested in financing for ${vehicleTitle}. Estimated Down Payment: ${formatLKR(calc.downPayment)}, Estimated Monthly Installment: ${formatLKR(calc.monthlyPayment)} over ${calc.tenureYears} years.`
              )
            }
          />
        </div>

        {/* Similar Vehicles Carousel / Grid */}
        {similarVehicles.length > 0 && (
          <div className="pt-10 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Alternative Options
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Similar Available Vehicles
                </h3>
              </div>
              <Link
                href="/vehicles"
                className="text-xs font-semibold text-amber-400 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((sim) => (
                <VehicleCard key={sim._id} vehicle={sim} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reusable Inquiry Dialog */}
      <InquiryDialog
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicle={vehicle}
        defaultInquiryType={inquiryType}
        prefilledMessage={inquiryMessage}
      />
    </PublicLayout>
  );
}
