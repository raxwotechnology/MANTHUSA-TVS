"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Car,
  ShieldCheck,
  Award,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { useSettings } from '@/lib/useSettings';

export default function AboutPage() {
  const { settings: brand } = useSettings();

  const dealershipName = brand.dealershipName || 'TVS SalesPlus Motor Hub';

  const values = [
    {
      title: 'Genuine TVS Motorcycles',
      desc: 'We are an authorised TVS dealership. Every motorcycle sold is brand-new, factory-fresh, and comes with a full manufacturer warranty and service booklet.',
      icon: ShieldCheck,
    },
    {
      title: 'Transparent Pricing & Easy Finance',
      desc: 'No hidden charges or surprise fees. Our pricing is inclusive, and we connect you with leading leasing partners for affordable monthly installments.',
      icon: Award,
    },
    {
      title: 'Full Documentation Guarantee',
      desc: 'Every TVS motorcycle comes with verified revenue license, certificate of registration, and all legal documents â€” hassle-free from day one.',
      icon: FileCheck,
    },
    {
      title: 'Lifetime Rider Partnership',
      desc: 'Our relationship does not end at delivery. We provide after-sales service support, warranty facilitation, and trade-in assistance when you upgrade.',
      icon: Users,
    },
  ];

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Sri Lanka's Official TVS Motorcycle Dealer</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Driven by Excellence. Dedicated to Quality.
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {brand.website?.pages?.about || (
                <>
                  Founded on principles of trust and automotive craftsmanship, <span className="text-slate-900 dark:text-white font-bold">{dealershipName}</span> has established itself as one of Sri Lanka&apos;s leading automotive direct importers and certified vehicle dealerships.
                </>
              )}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Whether you are acquiring a brand-new electric crossover, an executive sedan, or trading in your existing car, our seasoned automotive specialists provide unbiased guidance tailored to your lifestyle and budget.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/bikes"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>Browse Our Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-200 dark:border-slate-700"
              >
                <span>Visit Showroom</span>
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 shadow-2xl dark-panel">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
              alt={`${dealershipName} Flagship Showroom Facility`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white dark-panel">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Flagship Experience
              </span>
              <p className="text-base font-bold text-white">Weliweriya Main Showroom</p>
              <p className="text-xs text-slate-200">{brand.address || '386, New Kandy Road, Weliweriya'}</p>
            </div>
          </div>
        </div>

        {/* Core Dealership Values */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400">
              Our Pillars
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              The Guiding Values Behind Every Vehicle Sale
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Every process in our management system is calibrated to ensure customer transparency and vehicle excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-500 dark:text-amber-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">{v.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Showroom & Operating Hours Details */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Showroom Address</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {brand.address || '386, New Kandy Road, Weliweriya, Sri Lanka'}
            </p>
            {brand.registrationNumber && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Business Reg: {brand.registrationNumber}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4" />
              <span>Hours</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Operating Hours</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {brand.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Private evening viewings available upon appointment.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Phone className="w-4 h-4" />
              <span>Hotline</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connect With Us</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Hotline: <a href={`tel:${(brand.hotline || '0765710601').replace(/[\s\-\/]+/g, '')}`} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">{brand.hotline || '076-5710 601 / 070-6510 601'}</a>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Email: {brand.salesEmail || brand.email || 'sales@manthusatvs.lk'}
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

