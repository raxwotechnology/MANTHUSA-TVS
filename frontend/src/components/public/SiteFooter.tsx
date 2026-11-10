"use client";

import React from 'react';
import Link from 'next/link';
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Award,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { BrandSettings } from '@/lib/useSettings';

interface Props {
  brand?: BrandSettings;
}

export function SiteFooter({ brand }: Props) {
  const currentYear = new Date().getFullYear();
  const dealershipName = brand?.dealershipName || 'MANTHUSA TVS';
  const phone = brand?.phone || '075-6000 310';
  const hotline = brand?.hotline || '076-5710 601 / 070-6510 601';
  const email = brand?.salesEmail || brand?.email || 'sales@manthusatvs.lk';
  const address = brand?.address || '386, New Kandy Road, Weliweriya, Sri Lanka';
  const hours = brand?.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)';
  const whatsapp = brand?.whatsapp || '+94756000310';

  const quickLinks = [
    { label: 'Browse TVS Motorcycles', href: '/bikes' },
    { label: 'Configure & Book Your Bike', href: '/configure' },
    { label: 'Compare Models & Specs', href: '/compare' },
    { label: 'Motorcycle Leasing & Installments', href: '/finance' },
    { label: 'Customer Portal Login', href: '/login' },
    { label: 'Showrooms & Service Branches', href: '/contact' },
  ];

  const categoryLinks = [
    { label: 'Sport Motorcycles (Apache RTR Series)', href: '/bikes?category=Sport+Motorcycles' },
    { label: 'Smart Performance Scooters (NTORQ 125)', href: '/bikes?category=Scooters' },
    { label: 'Family & Commuter Scooters (Jupiter 125)', href: '/bikes?category=Scooters' },
    { label: 'Sport Commuter (Raider 125)', href: '/bikes?category=Commuter+Motorcycles' },
    { label: 'Heavy Duty Utility (TVS XL 100)', href: '/bikes?category=Commuter+Motorcycles' },
    { label: 'Modern-Retro Scrambler (Ronin 225)', href: '/bikes?category=Premium+Motorcycles' },
    { label: 'Super Sport Racing (Apache RR 310)', href: '/bikes?category=Premium+Motorcycles' },
    { label: 'Electric Two-Wheelers (iQube Electric)', href: '/bikes?category=Electric+Two-Wheelers' },
  ];

  return (
    <footer className="site-footer bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner CTA */}
      <div className="site-footer-cta border-b border-slate-900 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Official 5-Year or 70,000 km TVS Manufacturer Warranty
              </h3>
              <p className="text-sm text-slate-400">
                Includes 3 free services, genuine TVS Racing spare parts, and islandwide dealership assistance.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20MANTHUSA%20TVS%2C%20I%20would%20like%20to%20inquire%20about%20motorcycle%20models%20and%20prices`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all hover:scale-102 active:scale-98 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
            <Link
              href="/configure"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all hover:scale-102 active:scale-98 shadow-sm"
            >
              <span>Book Online</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Dealership Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {brand?.logoUrl ? (
                <div className="h-10 w-20 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
                  <img
                    src={brand.logoUrl}
                    alt={dealershipName}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-md shrink-0">
                  <Flame className="w-5 h-5 fill-white" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base font-black text-white tracking-wider flex items-center gap-1 leading-none">
                  <span className="text-red-500">MANTHUSA</span> TVS
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-1">
                  Motorcycle Sales Management System
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Official dealership management portal for TVS motorcycles, scooters, and electric two-wheelers. Delivering racing excellence, cutting-edge SmartXonnect telemetry, and reliable customer service across Sri Lanka.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <span>{hotline} / {phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-red-400 shrink-0" />
                <span>{hours}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: TVS Categories */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              TVS Lineup & Categories
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {categoryLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>{brand?.footerText || `© ${currentYear} TVS SalesPlus Motor Hub. All rights reserved.`}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Booking Policy
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/login" className="text-red-400 hover:text-red-300 transition-colors font-medium">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
