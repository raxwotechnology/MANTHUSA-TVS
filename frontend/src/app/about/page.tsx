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
  Phone,
  Camera,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { useSettings } from '@/lib/useSettings';

export default function AboutPage() {
  const { settings: brand } = useSettings();

  const dealershipName = brand.dealershipName || 'MANTHUSA TVS';

  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Keyboard navigation for photo lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + showroomGallery.length) % showroomGallery.length : null));
      }
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % showroomGallery.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  const showroomGallery = [
    {
      src: '/images/showroom/manthusa-tvs-front.jpg',
      title: 'Authorized Showroom Frontage',
      category: 'Main Dealership Facade',
      tag: 'Authorized Dealer',
      desc: 'Our prime sales facility at 386 New Kandy Road, Weliweriya displaying Sri Lanka\'s most loved TVS motorcycles and scooters.'
    },
    {
      src: '/images/showroom/showroom-entrance-arch.jpg',
      title: 'TVS Welcome Arch & Forecourt',
      category: 'Customer Welcoming & Delivery Bay',
      tag: 'Grand Entrance',
      desc: 'The official TVS entrance welcoming riders, equipped with test ride consultation areas and on-the-spot bank leasing desks.'
    },
    {
      src: '/images/showroom/ntorq-scooters-lineup.jpg',
      title: 'TVS NTORQ 125 Scooter Collection',
      category: 'Sport Scooter Fleet',
      tag: 'Best Seller',
      desc: 'Top-selling NTORQ 125 smart scooters in Combat Grey, Marine Blue, and Race Edition graphics ready for prompt delivery.'
    },
    {
      src: '/images/showroom/showroom-display-fleet.jpg',
      title: 'Complete Fleet on Display',
      category: 'Scooters & Commuters',
      tag: 'Ready for Delivery',
      desc: 'Fully inspected and pre-delivery serviced stock lined up under our dealership canopy for customer walk-ins and test rides.'
    },
    {
      src: '/images/showroom/showroom-bikes-angle.jpg',
      title: 'TVS Raider & Racing Lineup',
      category: 'Performance Motorcycles',
      tag: 'TVS Racing DNA',
      desc: 'High-performance TVS motorbikes backed by 5-year official TVS Lanka warranty and genuine spare parts availability.'
    }
  ];


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
              Whether you are choosing a sporty TVS Apache, an agile NTORQ smart scooter, a durable TVS Raider 125, or an economical daily commuter, our experienced team provides expert guidance and instant leasing options tailored to your needs.
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

          <div
            onClick={() => setActivePhotoIndex(0)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl cursor-pointer hover:border-amber-400/60 transition-all duration-300"
          >
            <img
              src="/images/showroom/manthusa-tvs-front.jpg"
              alt={`${dealershipName} Flagship Showroom Facility`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                <ZoomIn className="w-4 h-4 text-amber-400" />
              </div>
            </div>
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


        {/* Real Showroom & Fleet Gallery Section */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Showroom Tour • Weliweriya</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Inside Our Showroom & Sales Fleet
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
                Explore real moments from our authorized TVS dealership in Weliweriya. Visit us to check out ready bikes, take a test ride, and enjoy personalized customer service.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/bikes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>View Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pure Images Showcase Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {showroomGallery.map((photo, i) => (
              <div
                key={photo.src}
                onClick={() => setActivePhotoIndex(i)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-md hover:shadow-2xl transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle hover overlay with zoom pill */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 shadow-xl backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-xs font-bold">
                    <ZoomIn className="w-3.5 h-3.5 text-amber-500" />
                    <span>View</span>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Showroom Image Fullscreen Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300">
                  MANTHUSA TVS Showroom & Fleet • {activePhotoIndex + 1} of {showroomGallery.length}
                </span>
              </div>
              <button
                onClick={() => setActivePhotoIndex(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[50vh] max-h-[68vh] p-2 sm:p-4 select-none">
              <button
                onClick={() => setActivePhotoIndex((activePhotoIndex - 1 + showroomGallery.length) % showroomGallery.length)}
                className="absolute left-3 sm:left-5 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 transition-all hover:scale-110 shadow-lg"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <img
                src={showroomGallery[activePhotoIndex].src}
                alt={showroomGallery[activePhotoIndex].title}
                className="max-h-[64vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />

              <button
                onClick={() => setActivePhotoIndex((activePhotoIndex + 1) % showroomGallery.length)}
                className="absolute right-3 sm:right-5 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 transition-all hover:scale-110 shadow-lg"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto">
              {showroomGallery.map((photo, i) => (
                <button
                  key={photo.src}
                  onClick={() => setActivePhotoIndex(i)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activePhotoIndex === i
                      ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/30'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

