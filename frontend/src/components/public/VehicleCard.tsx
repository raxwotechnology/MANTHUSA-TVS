"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Scale,
  Gauge,
  Fuel,
  Settings2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Zap,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { PublicVehicle, getBikeSlug, getVehicleImageUrls, formatLKR, calculateAmortizedMonthlyPayment } from '@/lib/publicApi';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';

interface Props {
  vehicle: PublicVehicle;
  viewMode?: 'grid' | 'list';
  onQuickInquire?: (vehicle: PublicVehicle) => void;
}

function cleanPower(power?: string): string {
  if (!power) return 'High Power';
  const match = power.match(/^([\d.]+\s*(?:PS|kW|bhp|hp|BHP))/i);
  if (match) return match[1];
  if (power.includes('@')) return power.split('@')[0].trim();
  return power.length > 14 ? power.substring(0, 14) : power;
}

function cleanBraking(braking?: string): string {
  if (!braking) return 'Disc Brake';
  const lower = braking.toLowerCase();
  if (lower.includes('dual channel') || lower.includes('dual-channel')) return 'Dual ABS';
  if (lower.includes('single channel') || lower.includes('single-channel')) return 'Single ABS';
  if (lower.includes('abs')) return 'ABS Braking';
  if (lower.includes('synchronized') || lower.includes('sbt')) return 'Sync Braking';
  if (lower.includes('disc')) return 'Disc Brake';
  if (lower.includes('drum')) return 'Drum Brake';
  return braking.length > 14 ? braking.substring(0, 14) : braking;
}

function cleanTransmission(trans?: string): string {
  if (!trans) return 'Manual';
  const lower = trans.toLowerCase();
  if (lower.includes('6-speed')) return '6-Speed Manual';
  if (lower.includes('5-speed')) return '5-Speed Manual';
  if (lower.includes('4-speed')) return '4-Speed Manual';
  if (lower.includes('cvt')) return 'CVT Automatic';
  if (lower.includes('direct drive') || lower.includes('automatic')) return 'Automatic';
  if (lower.includes('single speed')) return 'Automatic';
  return trans.length > 14 ? trans.substring(0, 14) : trans;
}

export function VehicleCard({ vehicle, viewMode = 'grid', onQuickInquire }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInComparison, toggleVehicle } = useComparison();
  const [imageError, setImageError] = useState(false);

  const favorited = isFavorite(vehicle._id);
  const inComparison = isInComparison(vehicle._id);
  const slug = getBikeSlug(vehicle);

  const vehicleImages = getVehicleImageUrls(vehicle);
  const mainImage =
    !imageError && vehicleImages.length > 0
      ? vehicleImages[0]
      : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';

  const isList = viewMode === 'list';

  // Calculate estimated 3-year (36 months) monthly lease payment with 20% down
  const downPayment = (vehicle.sellingPrice || 0) * 0.2;
  const { monthlyPayment } = calculateAmortizedMonthlyPayment(
    vehicle.sellingPrice || 0,
    downPayment,
    14.5,
    3
  );

  const isSold = (vehicle.status || '').toLowerCase().includes('sold');
  const isReserved = (vehicle.status || '').toLowerCase().includes('reserv');

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 dark:hover:border-red-500/40 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-black/70 flex ${
        isList ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      {/* Bike Image Container */}
      <div className={`relative overflow-hidden ${isList ? 'md:w-72 lg:w-80 h-56 md:h-auto' : 'h-52 sm:h-56'} bg-slate-950 shrink-0`}>
        <Link href={`/bikes/${slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Single Clean Badge on Top-Left (Matches Target Design Reference) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          {isSold ? (
            <span className="vehicle-floating-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md bg-slate-950/85 text-rose-300 border border-rose-500/40">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Sold Out</span>
            </span>
          ) : isReserved ? (
            <span className="vehicle-floating-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md bg-slate-950/85 text-amber-300 border border-amber-500/40">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Reserved</span>
            </span>
          ) : (
            <span className="vehicle-floating-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md bg-slate-950/85 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available</span>
            </span>
          )}
        </div>

        {/* Action icons: Favorite & Compare on Top-Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={() => toggleVehicle(vehicle._id)}
            title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
            className={`p-2 rounded-full transition-colors bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 ${
              inComparison ? 'text-red-400 bg-red-500/30 border-red-500/50' : ''
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleFavorite(vehicle._id)}
            title={favorited ? 'Remove from favorites' : 'Save to favorites'}
            className={`p-2 rounded-full transition-colors bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 ${
              favorited ? 'text-red-500 fill-current' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Clean Engine Capacity Badge on Bottom-Left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="vehicle-floating-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md text-xs font-bold border border-white/20 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{vehicle.engineCapacity || 'TVS Racing Engine'}</span>
          </span>
        </div>
      </div>

      {/* Motorcycle Info & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Round No */}
          <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
            <span className="font-bold tracking-wider uppercase text-red-600 dark:text-red-400 text-[11px] truncate">
              {vehicle.category || 'SPORT MOTORCYCLES'}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {vehicle.roundNumber && (
                <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 px-1.5 py-0.5 rounded shadow-2xs">
                  {vehicle.roundNumber}
                </span>
              )}
              {vehicle.year && (
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {vehicle.year}
                </span>
              )}
            </div>
          </div>

          {/* Model Name & Variant */}
          <Link href={`/bikes/${slug}`} className="block group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.variant && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 font-medium">
                {vehicle.variant}
              </p>
            )}
          </Link>

          {/* Color swatches preview */}
          {vehicle.colors && vehicle.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Colors:</span>
              <div className="flex items-center gap-1">
                {vehicle.colors.map((c, idx) => (
                  <span
                    key={idx}
                    title={c.name}
                    className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-700 shadow-xs"
                    style={{ backgroundColor: c.hex || '#333' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Clean 4-Item Specifications Grid (2 rows x 2 cols) */}
          <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-200 dark:border-slate-800/80 my-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 min-w-0">
              <Gauge className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">{cleanPower(vehicle.maxPower)}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Fuel className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">{vehicle.mileage ? `${vehicle.mileage} km/l` : (vehicle.fuelType || 'Petrol')}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Settings2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">{cleanTransmission(vehicle.transmission)}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">{cleanBraking(vehicle.brakingSystem || vehicle.frontBrake)}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Call To Action (Buttons placed completely BELOW the price) */}
        <div className="pt-3.5 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Row 1: Full-Width Price & Lease Installment */}
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {formatLKR(vehicle.sellingPrice)}
            </div>
            {monthlyPayment > 0 && (
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1">
                <span>Est. Lease from</span>
                <span className="font-extrabold">{formatLKR(monthlyPayment)}</span>
                <span className="font-medium text-slate-600 dark:text-slate-400">/ mo</span>
              </div>
            )}
          </div>

          {/* Row 2: Action Buttons placed directly BELOW the price */}
          <div className="flex items-center gap-2 pt-0.5">
            {onQuickInquire && (
              <button
                type="button"
                onClick={() => onQuickInquire(vehicle)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-red-600 dark:hover:text-white transition-all border border-slate-300 dark:border-slate-700 shadow-xs shrink-0 cursor-pointer"
                title="Quick WhatsApp/Dealership Inquiry"
              >
                <MessageCircle className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}

            <Link
              href={`/bikes/${slug}`}
              className="flex-1 h-10 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/25 hover:scale-[1.01]"
            >
              <span>EXPLORE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
