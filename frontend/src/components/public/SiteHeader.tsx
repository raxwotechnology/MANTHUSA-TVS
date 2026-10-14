"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  Heart,
  Scale,
  Menu,
  X,
  Phone,
  ShieldCheck,
  ChevronRight,
  User,
  ArrowRight,
  CalendarCheck
} from 'lucide-react';
import { BrandSettings } from '@/lib/useSettings';
import { useFavorites } from '@/hooks/useFavorites';
import { useComparison } from '@/hooks/useComparison';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface Props {
  brand?: BrandSettings;
}

export function SiteHeader({ brand }: Props) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { count: favoritesCount } = useFavorites();
  const { count: comparisonCount } = useComparison();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const stored = localStorage.getItem('user');
        if (token && stored) {
          setUser(JSON.parse(stored));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('user-profile-updated', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('user-profile-updated', checkAuth);
    };
  }, []);

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'A';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/vehicles' },
    { label: 'Compare', href: '/compare', badge: comparisonCount },
    { label: 'Finance', href: '/finance' },
    { label: 'Sell', href: '/sell-your-vehicle' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const dealershipName = brand?.dealershipName || 'SalesPlus Auto Mart';
  const displayDealershipName = dealershipName.replace(/\s+Auto Mart$/i, '');
  const phone = brand?.hotline || brand?.phone || '+94 77 123 4567';

  return (
    <header
      className={`site-header sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-slate-800'
          : 'bg-slate-950 border-b border-slate-850'
      }`}
    >
      <div className="w-full px-3 sm:px-4 lg:px-5">
        <div className="flex items-center justify-between min-h-24 gap-3 py-2">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            {brand?.logoUrl ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-slate-700/60 p-1.5 flex items-center justify-center overflow-hidden shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
                <img
                  src={brand.logoUrl}
                  alt={dealershipName}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans leading-none">
                {dealershipName}
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse"></span>
              </span>
              <p className="mt-1 max-w-[260px] text-[11px] font-medium tracking-wider uppercase leading-[1.3] text-slate-400 truncate">
                {brand?.tagline || "Sri Lanka's Premier Vehicle Dealership"}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Navigation */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2 mx-2 xl:mx-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative whitespace-nowrap px-3 py-2 text-[17px] leading-none font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-amber-400 bg-white/5 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {typeof link.badge === 'number' && link.badge > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 ml-0.5">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-1 xl:gap-3 shrink-0">
            {/* Compare Link */}
            <Link
              href="/compare"
              aria-label="Compare Vehicles"
              className="relative p-2 md:p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              title="Compare Vehicles"
            >
              <Scale className="w-5 h-5" />
              {comparisonCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  {comparisonCount}
                </span>
              )}
            </Link>

            {/* Saved Vehicles / Favorites */}
            <Link
              href="/saved-vehicles"
              aria-label="Saved Vehicles"
              className="relative p-2 md:p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              title="Saved Vehicles"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Book Test Drive Button */}
            <Link
              href="/book-test-drive"
              className="site-header-cta hidden md:inline-flex h-16 w-[88px] xl:h-20 xl:w-[120px] flex-col items-center justify-center gap-1 px-2 xl:px-3 text-xs xl:text-sm font-semibold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm hover:shadow-amber-500/20 transition-all text-center leading-tight"
            >
              <CalendarCheck className="w-4 h-4 text-slate-950" />
              <span className="whitespace-nowrap text-black">Book</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Direct Dashboard / Sign In Link */}
            {user ? (
              <Link
                href="/dashboard"
                className="hidden xl:inline-flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all shadow-xs group"
                title="Go to VSMS Dashboard"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center overflow-hidden border border-amber-400">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[100px]">
                    {user.name || 'Admin'}
                  </p>
                  <p className="text-[10px] text-amber-400 truncate max-w-[100px]">
                    {user.role || 'Dashboard'}
                  </p>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden xl:flex p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors items-center gap-1.5"
                title="Staff Portal / Sign In"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/saved-vehicles"
              aria-label="Saved Vehicles"
              className="relative p-2 rounded-lg text-slate-300"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-base font-medium rounded-lg ${
                    isActive
                      ? 'text-amber-400 bg-slate-900'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                  </span>
                  {typeof link.badge === 'number' && link.badge > 0 ? (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-slate-950">
                      {link.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 pt-5 border-t border-slate-800/80 space-y-3">
            <Link
              href="/book-test-drive"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-slate-950" />
              Book Test Drive Request
            </Link>

            <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-400">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                {phone}
              </a>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link href="/dashboard" className="flex items-center gap-1 text-slate-300 hover:text-amber-400 font-medium">
                  <User className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
