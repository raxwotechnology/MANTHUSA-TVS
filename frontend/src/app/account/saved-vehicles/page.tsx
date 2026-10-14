"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Car,
  Trash2,
  ArrowRight,
  Gauge,
  Fuel,
  GitBranch
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { PublicVehicle } from '@/lib/publicApi';
import { getApiUrl } from '@/lib/api';

export default function CustomerSavedVehiclesPage() {
  const { favoriteIds, toggleFavorite, clearFavorites } = useFavorites();
  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    fetch(getApiUrl('/vehicles/public'))
      .then((res) => (res.ok ? res.json() : []))
      .then((data: PublicVehicle[]) => {
        const filtered = (Array.isArray(data) ? data : []).filter((v) =>
          favoriteIds.includes(v._id)
        );
        setVehicles(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 customer-account-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Saved Vehicles Wishlist ({favoriteIds.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare and monitor stock availability for vehicles you’ve saved.
          </p>
        </div>

        {favoriteIds.length > 0 && (
          <button
            onClick={() => clearFavorites()}
            className="self-start sm:self-auto text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Saved
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading saved vehicles...</div>
      ) : favoriteIds.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Your wishlist is empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click the heart icon on any vehicle card to save it here for fast comparisons and price checks.
          </p>
          <Link
            href="/vehicles"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
          >
            <Car className="w-4 h-4" />
            <span>Browse Showroom Inventory</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => {
            const image =
              v.images?.[0] ||
              v.mediaAngles?.front ||
              (v as any).imageUrls?.[0] ||
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={v._id}
                className="rounded-xl bg-slate-950 border border-slate-850 overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={image}
                      alt={`${v.year} ${v.make} ${v.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(v._id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-rose-400 hover:bg-black/90 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                      {v.status || 'Available'}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-white text-sm">
                      {v.year} {v.make} {v.model}
                    </h4>
                    <p className="text-amber-400 font-extrabold text-base">
                      Rs. {Number(v.sellingPrice || 0).toLocaleString()}
                    </p>

                    <div className="grid grid-cols-3 gap-1 pt-2 text-[10px] text-slate-400 border-t border-slate-850">
                      <div className="flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-slate-500" />
                        <span>{v.mileage ? `${Number(v.mileage).toLocaleString()} km` : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-slate-500" />
                        <span>{v.fuelType || 'Petrol'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-slate-500" />
                        <span>{v.transmission || 'Automatic'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/vehicles/${v._id}`}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-400 text-xs font-bold border border-slate-800 transition-colors"
                  >
                    <span>Inspect Details & Book Test Drive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
