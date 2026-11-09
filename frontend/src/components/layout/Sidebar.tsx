"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Flame,
  FileQuestion,
  Calendar,
  FileText,
  Receipt,
  CreditCard,
  Truck,
  Users,
  UserCheck,
  Building2,
  BarChart3,
  ShieldCheck,
  UserCog,
  Settings,
  Search,
  LogOut,
  SlidersHorizontal,
  Globe,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useSettings } from '@/lib/useSettings';

interface SidebarProps {
  user: any;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ user, mobileOpen, onCloseMobile }: SidebarProps) {
  const { settings: brand } = useSettings();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(user);

  React.useEffect(() => {
    const handleProfileUpdate = (event: Event) => {
      setCurrentUser((event as CustomEvent).detail);
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const role = user?.role || 'Admin';
  const cleanRole = role.toLowerCase();
  const isAdmin = cleanRole.includes('admin') || cleanRole.includes('owner');
  const isSales = cleanRole.includes('sales') || cleanRole.includes('operations') || cleanRole.includes('executive') || isAdmin;
  const isFinance = cleanRole.includes('accountant') || cleanRole.includes('finance') || isAdmin;
  const isCustomer = cleanRole.includes('customer') || cleanRole.includes('client');
  const isCustomerPortal = isCustomer || pathname.startsWith('/account');

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'TVS';

  // Structured staff navigation configuration
  const staffNavSections = useMemo(
    () => [
      {
        id: 'main',
        group: 'MAIN DASHBOARD',
        items: [
          { href: '/dashboard', label: 'TVS Sales Dashboard', icon: LayoutDashboard, color: 'text-red-400' },
        ],
      },
      {
        id: 'stock',
        group: 'MOTORCYCLES & STOCK',
        items: [
          { href: '/dashboard/vehicles', label: 'TVS Bike Models & Specs', icon: Flame, color: 'text-red-500' },
          ...(isAdmin
            ? [
                { href: '/dashboard/branches', label: 'Dealership Branches', icon: Building2, color: 'text-amber-400' },
                { href: '/dashboard/transfers', label: 'Branch Stock Transfers', icon: Truck, color: 'text-sky-400' },
              ]
            : []),
        ],
      },
      {
        id: 'workflow',
        group: 'SALES & ORDERS WORKFLOW',
        items: [
          { href: '/dashboard/leads', label: 'Customer Requests (CRM)', icon: UserCheck, color: 'text-blue-400' },
          { href: '/dashboard/reservations', label: 'Bookings & Allocations', icon: Calendar, color: 'text-amber-400' },
          { href: '/dashboard/quotations', label: 'Quotations', icon: FileText, color: 'text-red-400' },
          { href: '/dashboard/sales', label: 'Invoices & Sales', icon: Receipt, color: 'text-emerald-400' },
          ...(isFinance
            ? [{ href: '/dashboard/finance', label: 'Payments & Cash', icon: CreditCard, color: 'text-cyan-400' }]
            : []),
          { href: '/dashboard/handovers', label: 'PDI & Handover Delivery', icon: Truck, color: 'text-indigo-400' },
          { href: '/dashboard/customers', label: 'Customer Database', icon: Users, color: 'text-slate-400' },
        ],
      },
      {
        id: 'management',
        group: 'MANAGEMENT & SYSTEM',
        items: [
          { href: '/dashboard/reports', label: 'Reports & Sales Summaries', icon: BarChart3, color: 'text-slate-400' },
          ...(isAdmin
            ? [
                { href: '/dashboard/website', label: 'Website Banners & CMS', icon: Globe, color: 'text-slate-400' },
                { href: '/dashboard/users', label: 'Staff Accounts & Roles', icon: UserCog, color: 'text-slate-400' },
                { href: '/dashboard/settings', label: 'Dealership Settings', icon: Settings, color: 'text-slate-400' },
              ]
            : []),
        ],
      },
    ],
    [isAdmin, isFinance]
  );

  // Search filtering logic
  const query = searchQuery.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!query) return null;
    const matches: Array<{ href: string; label: string; icon: any; color: string; group: string }> = [];
    staffNavSections.forEach((section) => {
      section.items.forEach((item) => {
        if (
          item.label.toLowerCase().includes(query) ||
          item.href.toLowerCase().includes(query) ||
          section.group.toLowerCase().includes(query)
        ) {
          matches.push({ ...item, group: section.group });
        }
      });
    });
    return matches;
  }, [query, staffNavSections]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-64 bg-[#0B132B] text-slate-300 flex flex-col h-screen border-r border-slate-800 flex-shrink-0 transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl opacity-100 visible' : '-translate-x-full opacity-0 invisible lg:opacity-100 lg:visible lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 min-w-0 group">

              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate max-w-[140px]">
                {isCustomerPortal ? 'Customer Portal' : 'Dealership Hub'}
              </p>
            </div>
          </Link>

          {/* Close button for Mobile */}
          <button
            onClick={onCloseMobile}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar inside Sidebar */}
        <div className="p-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Quick navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131F3F] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          onClick={handleLinkClick}
          className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-700/60 hover:scrollbar-thumb-slate-600"
        >
          {/* CUSTOMER PORTAL NAVIGATION */}
          {isCustomerPortal ? (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  Customer Dashboard
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/account"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      pathname === '/account'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-red-400" />
                    <span>Overview & Live Progress</span>
                  </Link>

                  <Link
                    href="/account/requests"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      pathname === '/account/requests'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <FileQuestion className="w-4 h-4 text-blue-400" />
                    <span>My Bike Requests</span>
                  </Link>

                  <Link
                    href="/account/bookings"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      pathname === '/account/bookings'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>My Bookings</span>
                  </Link>

                  <Link
                    href="/account/quotations"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      pathname === '/account/quotations'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>My Quotations</span>
                  </Link>

                  <Link
                    href="/account/invoices"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      pathname === '/account/invoices'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>Invoices & Orders</span>
                  </Link>

                  <Link
                    href="/account/payments"
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                      pathname === '/account/payments'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Payment Receipts</span>
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  Explore TVS Lineup
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/bikes"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/60 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-red-400" />
                    <span>Motorcycle Catalog</span>
                  </Link>

                  <Link
                    href="/configure"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/60 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-red-400" />
                    <span>Interactive Configurator</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : searchResults !== null ? (
            /* SEARCH RESULTS VIEW */
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1 flex items-center justify-between">
                <span>Matching ({searchResults.length})</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-red-400 hover:text-red-300 text-[10px] font-medium"
                >
                  Clear
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No menu items found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="space-y-0.5">
                  {searchResults.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase">{item.group.split(' ')[0]}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* STANDARD STAFF DEALERSHIP NAVIGATION */
            <div className="space-y-4">
              {staffNavSections.map((section) => (
                <div key={section.id}>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                    {section.group}
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                              : 'hover:bg-slate-800/60 text-slate-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0E1738]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm shadow-red-900/50">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-xs truncate">
                  {currentUser?.name || 'Admin'}
                </div>
                <div className="text-[10px] text-red-400 font-medium truncate">
                  {currentUser?.role || 'Admin / Owner'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
