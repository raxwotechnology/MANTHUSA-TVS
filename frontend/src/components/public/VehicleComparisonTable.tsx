"use client";

import React from 'react';
import Link from 'next/link';
import {
  X,
  Plus,
  Check,
  Minus,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  MessageCircle,
  ExternalLink,
  Car
} from 'lucide-react';
import { PublicVehicle, formatLKR, getVehicleSlug } from '@/lib/publicApi';
import { AvailabilityBadge } from './AvailabilityBadge';
import { PriceDisplay } from './PriceDisplay';

interface Props {
  vehicles: PublicVehicle[];
  onRemoveVehicle: (id: string) => void;
  onClearAll: () => void;
  onOpenInquiry?: (vehicle: PublicVehicle) => void;
}

export function VehicleComparisonTable({
  vehicles,
  onRemoveVehicle,
  onClearAll,
  onOpenInquiry,
}: Props) {
  if (vehicles.length === 0) return null;

  const comparisonAttributes = [
    { label: 'Category', getValue: (v: PublicVehicle) => v.category || 'Motorcycle' },
    { label: 'Engine Capacity', getValue: (v: PublicVehicle) => v.engineCapacity || '—' },
    { label: 'Max Power', getValue: (v: PublicVehicle) => v.maxPower || '—' },
    { label: 'Max Torque', getValue: (v: PublicVehicle) => v.maxTorque || '—' },
    { label: 'Fuel System', getValue: (v: PublicVehicle) => v.fuelSystem || 'RT-Fi' },
    { label: 'Cooling System', getValue: (v: PublicVehicle) => v.coolingSystem || 'Air Cooled' },
    { label: 'Transmission', getValue: (v: PublicVehicle) => v.transmission || 'Manual' },
    { label: 'Braking Technology', getValue: (v: PublicVehicle) => v.brakingSystem || 'ABS / SBT' },
    { label: 'Fuel Tank Capacity', getValue: (v: PublicVehicle) => v.fuelTankCapacity || '—' },
    { label: 'Ground Clearance', getValue: (v: PublicVehicle) => v.groundClearance || '—' },
    { label: 'Seat Height', getValue: (v: PublicVehicle) => v.seatHeight || '—' },
    { label: 'Color', getValue: (v: PublicVehicle) => v.color || 'Racing Red' },
  ];

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-amber-400">
            Side-By-Side Evaluation
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Comparing {vehicles.length} TVS Motorcycle{vehicles.length > 1 ? 's' : ''}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {vehicles.length < 4 && (
            <Link
              href="/bikes"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-red-600 dark:text-amber-400" />
              <span>Add Motorcycle</span>
            </Link>
          )}

          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-300 dark:border-rose-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear Comparison</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-700 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-4 text-left w-52 bg-slate-100 dark:bg-slate-950/80 rounded-tl-2xl border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                Motorcycle Overview
              </th>
              {vehicles.map((v) => {
                const slug = getVehicleSlug(v);
                return (
                  <th
                    key={v._id}
                    className="p-4 text-left bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 min-w-[220px]"
                  >
                    <div className="relative group">
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveVehicle(v._id)}
                        className="absolute -top-1 -right-1 z-10 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
                        title="Remove motorcycle"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Image */}
                      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-3">
                        <img
                          src={v.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'}
                          alt={v.model}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Title & Badge */}
                      <AvailabilityBadge status={v.status} className="mb-2" />
                      <Link
                        href={`/bikes/${slug}`}
                        className="block font-bold text-base text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {v.year} {v.make} {v.model}
                      </Link>

                      {/* Price */}
                      <div className="mt-2 mb-3">
                        <PriceDisplay price={v.sellingPrice} size="sm" showEstimate={false} />
                      </div>

                      {/* Actions */}
                      <div className="space-y-1.5">
                        <Link
                          href={`/book-test-drive?vehicle=${v._id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Book Test Ride</span>
                        </Link>
                        {onOpenInquiry && (
                          <button
                            type="button"
                            onClick={() => onOpenInquiry(v)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 font-semibold text-xs transition-colors border border-slate-300 dark:border-slate-700"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Inquire</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {comparisonAttributes.map((attr, idx) => (
              <tr
                key={attr.label}
                className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-950/40' : 'bg-white dark:bg-slate-900/40'}
              >
                <td className="p-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {attr.label}
                </td>
                {vehicles.map((v) => (
                  <td key={`${v._id}-${attr.label}`} className="p-4 text-sm font-medium text-slate-900 dark:text-slate-200">
                    {attr.getValue(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
