"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Plus,
  CalendarCheck,
  MessageCircle,
  Scale,
  Zap,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { PublicVehicle, formatLKR, getVehicleSlug } from '@/lib/publicApi';
import { AvailabilityBadge } from './AvailabilityBadge';
import { PriceDisplay } from './PriceDisplay';

interface Props {
  vehicles: PublicVehicle[];
  allAvailableVehicles?: PublicVehicle[];
  onAddVehicle?: (id: string) => void;
  onRemoveVehicle: (id: string) => void;
  onClearAll: () => void;
  onOpenInquiry?: (vehicle: PublicVehicle) => void;
}

export function VehicleComparisonTable({
  vehicles,
  allAvailableVehicles = [],
  onAddVehicle,
  onRemoveVehicle,
  onClearAll,
  onOpenInquiry,
}: Props) {
  const [selectedAddId, setSelectedAddId] = useState('');

  if (vehicles.length === 0) return null;

  const currentIds = new Set(vehicles.map((v) => v._id));
  const availableToAdd = allAvailableVehicles.filter((v) => !currentIds.has(v._id));

  const comparisonAttributes = [
    { label: 'Category', getValue: (v: PublicVehicle) => v.category || 'Motorcycle' },
    { label: 'Engine Capacity', getValue: (v: PublicVehicle) => v.engineCapacity || '—' },
    { label: 'Engine Type', getValue: (v: PublicVehicle) => v.engineType || '4-Stroke SI' },
    { label: 'Max Power', getValue: (v: PublicVehicle) => v.maxPower || '—' },
    { label: 'Max Torque', getValue: (v: PublicVehicle) => v.maxTorque || '—' },
    { label: 'Fuel System', getValue: (v: PublicVehicle) => v.fuelSystem || 'RT-Fi' },
    { label: 'Cooling System', getValue: (v: PublicVehicle) => v.coolingSystem || 'Air Cooled' },
    { label: 'Transmission', getValue: (v: PublicVehicle) => v.transmission || 'Manual' },
    { label: 'Braking Technology', getValue: (v: PublicVehicle) => v.brakingSystem || 'ABS / SBT' },
    { label: 'Fuel Tank Capacity', getValue: (v: PublicVehicle) => v.fuelTankCapacity || '—' },
    { label: 'Fuel Economy / Mileage', getValue: (v: PublicVehicle) => v.mileage ? `${v.mileage} km/l` : 'EcoThrust' },
    { label: 'Ground Clearance', getValue: (v: PublicVehicle) => v.groundClearance || '—' },
    { label: 'Seat Height', getValue: (v: PublicVehicle) => v.seatHeight || '—' },
    { label: 'Kerb Weight', getValue: (v: PublicVehicle) => v.kerbWeight || '—' },
    { label: 'Primary Color', getValue: (v: PublicVehicle) => v.color || 'Racing Red' },
  ];

  const handleAddChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && onAddVehicle) {
      onAddVehicle(val);
      setSelectedAddId('');
    }
  };

  const emptySlotsCount = Math.max(0, 4 - vehicles.length);

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-amber-400 flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            <span>Side-By-Side Technical Evaluation</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            Comparing {vehicles.length} of 4 TVS Motorcycles
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {vehicles.length < 4 && availableToAdd.length > 0 && onAddVehicle && (
            <div className="relative">
              <select
                value={selectedAddId}
                onChange={handleAddChange}
                className="appearance-none bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 pl-3.5 pr-8 rounded-xl shadow-sm cursor-pointer transition-colors focus:outline-none"
              >
                <option value="" disabled>+ Add Another Model...</option>
                {availableToAdd.map((bike) => (
                  <option key={bike._id} value={bike._id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                    {bike.make} {bike.model} {bike.variant ? `(${bike.variant})` : ''} — {formatLKR(bike.sellingPrice)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white absolute right-2.5 top-3 pointer-events-none" />
            </div>
          )}

          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-300 dark:border-rose-500/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Clear Comparison</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-400 dark:scrollbar-thumb-slate-700 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-slate-900">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="p-4 text-left w-52 bg-slate-100 dark:bg-slate-950/80 rounded-tl-2xl border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-600 dark:text-slate-400 align-top">
                Motorcycle Overview
              </th>
              {vehicles.map((v) => {
                const slug = getVehicleSlug(v);
                return (
                  <th
                    key={v._id}
                    className="p-4 text-left bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 min-w-[240px] max-w-[280px] align-top"
                  >
                    <div className="relative group flex flex-col h-full justify-between">
                      <div>
                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveVehicle(v._id)}
                          className="absolute -top-1 -right-1 z-10 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors shadow-sm cursor-pointer"
                          title="Remove motorcycle"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Image */}
                        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-3">
                          <img
                            src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'}
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
                        {v.variant && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                            {v.variant}
                          </div>
                        )}

                        {/* Price */}
                        <div className="mt-2 mb-3">
                          <PriceDisplay price={v.sellingPrice} size="sm" showEstimate={false} />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-1.5 pt-2">
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
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 font-semibold text-xs transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
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

              {/* Empty Slot for adding next model if available */}
              {vehicles.length < 4 && availableToAdd.length > 0 && onAddVehicle && (
                <th className="p-4 text-left bg-slate-50/50 dark:bg-slate-950/30 border-b border-dashed border-slate-300 dark:border-slate-800 min-w-[240px] align-top">
                  <div className="h-full min-h-[300px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center justify-center text-red-600 dark:text-red-400">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Add {vehicles.length === 1 ? '2nd' : vehicles.length === 2 ? '3rd' : '4th'} Motorcycle
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Select a model to compare side-by-side
                      </div>
                    </div>
                    <select
                      value={selectedAddId}
                      onChange={handleAddChange}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white cursor-pointer focus:outline-none focus:border-red-500"
                    >
                      <option value="" disabled>Choose a model...</option>
                      {availableToAdd.map((bike) => (
                        <option key={bike._id} value={bike._id}>
                          {bike.make} {bike.model} {bike.variant ? `(${bike.variant})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {comparisonAttributes.map((attr, idx) => (
              <tr
                key={attr.label}
                className={idx % 2 === 0 ? 'bg-slate-50/70 dark:bg-slate-950/40' : 'bg-white dark:bg-slate-900/40'}
              >
                <td className="p-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {attr.label}
                </td>
                {vehicles.map((v) => (
                  <td key={`${v._id}-${attr.label}`} className="p-4 text-sm font-medium text-slate-900 dark:text-slate-200">
                    {attr.getValue(v)}
                  </td>
                ))}
                {vehicles.length < 4 && availableToAdd.length > 0 && onAddVehicle && (
                  <td className="p-4 text-center text-slate-400 text-xs italic">
                    —
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
