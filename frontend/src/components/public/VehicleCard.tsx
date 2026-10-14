"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Scale,
  Gauge,
  Fuel,
  Settings2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Eye,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { PublicVehicle, getVehicleSlug, formatLKR } from '@/lib/publicApi';
import { AvailabilityBadge } from './AvailabilityBadge';
import { PriceDisplay } from './PriceDisplay';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';

interface Props {
  vehicle: PublicVehicle;
  viewMode?: 'grid' | 'list';
  onQuickInquire?: (vehicle: PublicVehicle) => void;
}

export function VehicleCard({ vehicle, viewMode = 'grid', onQuickInquire }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInComparison, toggleVehicle } = useComparison();
  const [imageError, setImageError] = useState(false);

  const favorited = isFavorite(vehicle._id);
  const inComparison = isInComparison(vehicle._id);
  const slug = getVehicleSlug(vehicle);

  // Fallback image if vehicle has no image or if image link fails
  const mainImage =
    !imageError && vehicle.images && vehicle.images.length > 0 && vehicle.images[0]
      ? vehicle.images[0]
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  const isList = viewMode === 'list';

  return (
    <div
      className={`group relative bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 flex ${
        isList ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      {/* Vehicle Image Container */}
      <div className={`relative overflow-hidden ${isList ? 'md:w-72 lg:w-80 h-56 md:h-auto' : 'h-56 sm:h-60'} bg-slate-950 shrink-0`}>
        <Link href={`/vehicles/${slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={`${vehicle.make} ${vehicle.model} ${vehicle.year || ''}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Badges on Image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <AvailabilityBadge status={vehicle.status} condition={vehicle.condition} />
        </div>

        {/* Action icons: Favorite & Compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={() => toggleVehicle(vehicle._id)}
            title={inComparison ? 'Remove from comparison' : 'Add to comparison'}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              inComparison
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-black/50 text-white hover:bg-black/80 hover:text-amber-400'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(vehicle._id)}
            title={favorited ? 'Remove from favorites' : 'Save to favorites'}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              favorited
                ? 'bg-rose-500 text-white'
                : 'bg-black/50 text-white hover:bg-black/80 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Year Badge on bottom left of image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md text-xs font-semibold text-slate-200 border border-slate-700/60">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {vehicle.year || vehicle.manufacturingYear || '2024'}
          </span>
        </div>
      </div>

      {/* Vehicle Info & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Title & Variant */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium tracking-wider uppercase">
                {vehicle.bodyType || vehicle.vehicleType || 'Sedan'}
              </span>
              {vehicle.stockNumber && (
                <span className="text-[11px] font-mono text-slate-400">
                  {vehicle.stockNumber}
                </span>
              )}
            </div>
            <Link href={`/vehicles/${slug}`} className="block group-hover:text-amber-400 transition-colors">
              <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                {vehicle.make} {vehicle.model}
                {vehicle.variant && (
                  <span className="text-sm font-normal text-slate-400 ml-1.5">
                    {vehicle.variant}
                  </span>
                )}
              </h3>
            </Link>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-800/80 my-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'Unregistered'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{vehicle.fuelType || 'Petrol'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{vehicle.transmission || 'Automatic'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{vehicle.engineCapacity ? `${vehicle.engineCapacity}` : '1500cc'}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Call To Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <PriceDisplay price={vehicle.sellingPrice} size="md" />

          <div className="flex items-center gap-2">
            {onQuickInquire && (
              <button
                type="button"
                onClick={() => onQuickInquire(vehicle)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700/80"
                title="Quick Inquiry"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            )}
            <Link
              href={`/vehicles/${slug}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs uppercase tracking-wider transition-all shadow-sm group/btn"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
