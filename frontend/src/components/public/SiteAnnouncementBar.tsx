"use client";

import React, { useState } from 'react';
import { Phone, Clock, MapPin, X, Sparkles } from 'lucide-react';
import { BrandSettings } from '@/lib/useSettings';

interface Props {
  brand?: BrandSettings;
}

export function SiteAnnouncementBar({ brand }: Props) {
  const [isDismissed, setIsDismissed] = useState(false);

  const announcement = brand?.website?.announcement;
  if (isDismissed || announcement?.enabled === false) return null;

  const announcementText = announcement?.text || 'Certified Pre-Delivery Quality Inspection Guaranteed';
  const phone = announcement?.phone || brand?.hotline || brand?.phone || '+94 77 123 4567';
  const hours = announcement?.hours || brand?.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM';
  const city = brand?.city || 'Colombo';

  return (
    <aside aria-label="Announcement" className="relative bg-slate-950 text-slate-300 border-b border-slate-800/80 text-xs py-1.5 px-2.5 sm:px-4 transition-all overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 min-w-0">
        {/* Left: badge + dynamic announcement text */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-amber-400 border border-amber-500/20 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Notice</span>
          </span>
          <span className="text-slate-300 truncate text-[11px] sm:text-xs font-medium">
            {announcementText}
          </span>
        </div>

        {/* Right: hours, hotline, city, dismiss */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-slate-300">
          <div className="hidden xl:flex items-center gap-1.5 text-slate-400 whitespace-nowrap text-xs">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{hours}</span>
          </div>

          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1 font-medium text-[11px] sm:text-xs text-slate-200 hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Hotline: </span>
            <span>{phone}</span>
          </a>

          <div className="hidden md:flex items-center gap-1 text-slate-400 whitespace-nowrap text-xs">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{city}, LK</span>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss announcement bar"
            className="text-slate-500 hover:text-white transition-colors p-1 rounded shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
