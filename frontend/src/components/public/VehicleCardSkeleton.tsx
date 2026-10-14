import React from 'react';

export function VehicleCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-pulse flex flex-col">
      {/* Image Skeleton */}
      <div className="h-60 bg-slate-800/80 w-full" />

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="h-3 w-16 bg-slate-850 rounded" />
            <div className="h-3 w-20 bg-slate-850 rounded" />
          </div>
          <div className="h-6 w-3/4 bg-slate-800 rounded mb-3" />

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-800/80 my-3">
            <div className="h-4 bg-slate-850 rounded" />
            <div className="h-4 bg-slate-850 rounded" />
            <div className="h-4 bg-slate-850 rounded" />
            <div className="h-4 bg-slate-850 rounded" />
          </div>
        </div>

        {/* Price & CTA */}
        <div className="pt-2 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 w-28 bg-slate-800 rounded" />
            <div className="h-3 w-36 bg-slate-850 rounded" />
          </div>
          <div className="h-9 w-24 bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
