"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  Heart,
  CalendarCheck,
  User,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Sparkles,
  ArrowRight
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
  const [user, setUser] = useState<{ name?: string; role?: string; email?: string } | null>(null);

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
    : 'U';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Center navigation items matching the reference design:
  // Home, Browse, Compare, Finance, Sell, About, Contact
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/bikes', matchSubpaths: ['/bikes', '/vehicles'] },
    { label: 'Compare', href: '/compare' },
    { label: 'Finance', href: '/finance' },
    { label: 'Sell', href: '/sell-your-vehicle' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`site-header sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#090e1a]/95 backdrop-blur-md shadow-md border-b border-slate-200 dark:border-slate-800/80'
          : 'bg-white dark:bg-[#090e1a] border-b border-slate-200 dark:border-slate-800/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Left: Brand Identity (Logo + Name + Tagline) */}

                {/* Yellow/Amber Dot from reference */}
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-1 shrink-0 shadow-xs shadow-amber-400/50" />
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1 truncate max-w-[140px] xs:max-w-[200px] sm:max-w-[260px] md:max-w-none">
                {brand?.tagline || "SRI LANKA'S PREMIER VEHICLE DEALERSHIP"}
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links (shown on xl screens) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.matchSubpaths &&
                  link.matchSubpaths.some((sub) => pathname.startsWith(sub)));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-all ${
                    active
                      ? 'bg-red-50 dark:bg-slate-800 text-red-600 dark:text-amber-400 font-bold border border-red-200 dark:border-slate-700/80 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Desktop Action Bar (shown on xl screens) */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {/* Compare vehicles */}
            <Link
              href="/compare"
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 rounded-xl transition-colors relative"
              title="Compare Vehicles"
            >
              <Scale className="w-5 h-5" />
              {comparisonCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {comparisonCount}
                </span>
              )}
            </Link>

            {/* Favorites / Saved Vehicles */}
            <Link
              href="/saved-vehicles"
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 rounded-xl transition-colors relative"
              title="Saved Vehicles"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Prominent Golden Yellow BOOK Button */}
            <Link
              href="/book-test-drive"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>BOOK</span>
            </Link>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Sign In / User Pill Button */}
            {user ? (
              <Link
                href={/customer|client/i.test(user.role || '') ? '/account' : '/dashboard'}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-amber-400/60 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 text-slate-800 dark:text-white text-xs font-semibold transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold flex items-center justify-center">
                  {userInitials}
                </div>
                <span className="max-w-[80px] truncate">{user.name?.split(' ')[0] || 'Account'}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800/90 text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white text-xs font-semibold tracking-wide transition-all whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile & Tablet Right Controls (shown when < xl) */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick compare on tablet */}
            <Link
              href="/compare"
              className="hidden sm:inline-flex p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 rounded-xl transition-colors relative"
              title="Compare Vehicles"
            >
              <Scale className="w-5 h-5" />
              {comparisonCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {comparisonCount}
                </span>
              )}
            </Link>

            {/* Quick favorites on tablet */}
            <Link
              href="/saved-vehicles"
              className="hidden sm:inline-flex p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50 rounded-xl transition-colors relative"
              title="Saved Vehicles"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {favoritesCount}
                </span>
              )}
            </Link>

            <Link
              href="/book-test-drive"
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm shrink-0 whitespace-nowrap"
            >
              BOOK
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-[#090e1a] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200 shadow-xl">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.matchSubpaths &&
                link.matchSubpaths.some((sub) => pathname.startsWith(sub)));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-red-50 dark:bg-[#152033] text-red-600 dark:text-amber-400 border border-red-200 dark:border-slate-700/60'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </Link>
            );
          })}

          {/* Mobile Quick Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-2">
            <Link
              href="/compare"
              className="flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-700"
            >
              <Scale className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Compare ({comparisonCount})</span>
            </Link>

            <Link
              href="/saved-vehicles"
              className="flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-700"
            >
              <Heart className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Wishlist ({favoritesCount})</span>
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/book-test-drive"
              className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-400/20"
            >
              <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
              <span>BOOK TEST DRIVE / APPOINTMENT</span>
            </Link>

            {user ? (
              <Link
                href={/customer|client/i.test(user.role || '') ? '/account' : '/dashboard'}
                className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-xs"
              >
                <span>My Account ({user.name})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-xs"
              >
                <User className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Sign In to Account</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
