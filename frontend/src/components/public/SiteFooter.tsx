"use client";

import React from 'react';
import Link from 'next/link';
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { BrandSettings } from '@/lib/useSettings';

interface Props {
  brand?: BrandSettings;
}

export function SiteFooter({ brand }: Props) {
  const currentYear = new Date().getFullYear();
  const dealershipName = brand?.dealershipName || 'SalesPlus Auto Mart';
  const phone = brand?.phone || '+94 11 268 4900';
  const hotline = brand?.hotline || '+94 77 123 4567';
  const email = brand?.salesEmail || brand?.email || 'sales@salesplus.lk';
  const address = brand?.address || 'No. 142/B, Baseline Road, Colombo 09, Sri Lanka';
  const hours = brand?.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)';
  const whatsapp = brand?.whatsapp || '+94771234567';

  const quickLinks = [
    { label: 'Browse Vehicle Inventory', href: '/vehicles' },
    { label: 'Vehicle Comparison Tool', href: '/compare' },
    { label: 'Auto Finance & Leasing', href: '/finance' },
    { label: 'Sell Your Vehicle (Valuation)', href: '/sell-your-vehicle' },
    { label: 'Book a Test Drive', href: '/book-test-drive' },
    { label: 'Saved Vehicles', href: '/saved-vehicles' },
  ];

  const categoryLinks = [
    { label: 'SUVs & Crossovers', href: '/vehicles?category=SUV' },
    { label: 'Executive Sedans', href: '/vehicles?category=Sedan' },
    { label: 'Electric & Hybrid', href: '/vehicles?fuelType=Electric' },
    { label: 'Brand New Vehicles', href: '/vehicles?condition=Brand+New' },
    { label: 'Certified Pre-Owned', href: '/vehicles?condition=Pre-Owned' },
    { label: 'Japanese Direct Imports', href: '/vehicles' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Banner CTA */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Every vehicle certified with our 150-Point Dealership Inspection
              </h3>
              <p className="text-sm text-slate-400">
                Transparent vehicle history, verified revenue documents, and full warranty support.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20SalesPlus%2C%20I%20would%20like%20to%20inquire%20about%20vehicle%20inventory`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700"
            >
              <span>Visit Showroom</span>
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
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-slate-700/60 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={brand.logoUrl}
                    alt={dealershipName}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
                  <Car className="w-5 h-5 stroke-[2.2]" />
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                {dealershipName}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {brand?.tagline || "Sri Lanka's trusted automotive dealership offering inspected brand-new, reconditioned, and premium pre-owned vehicles with tailored financing and direct trade-in valuations."}
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              {brand?.registrationNumber && (
                <p>Company Reg No: <span className="text-slate-300">{brand.registrationNumber}</span></p>
              )}
              {brand?.taxNumber && (
                <p>Tax / VAT Reg No: <span className="text-slate-300">{brand.taxNumber}</span></p>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Inventory & Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Browse Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Showroom */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Showroom Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            {brand?.footerText || `© ${currentYear} ${dealershipName}. All vehicle specifications and prices are subject to inventory confirmation.`}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Staff Management Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
