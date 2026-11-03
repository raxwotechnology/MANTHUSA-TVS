"use client";
import React, { useState } from 'react';
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
  const isInventory = cleanRole.includes('inventory') || cleanRole.includes('manager') || isAdmin;
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
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-64 bg-[#0B132B] text-slate-300 flex flex-col h-screen border-r border-slate-800 flex-shrink-0 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 min-w-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center font-bold shadow-md shadow-red-900/40 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-black text-white text-base tracking-wider truncate flex items-center gap-1">
                <span className="text-red-500 font-black">TVS</span>
                <span>SALESPLUS</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate max-w-[140px]">
                {isCustomerPortal ? 'Customer Portal' : 'Dealership Hub'}
              </p>
            </div>
          </Link>

          {/* Close button for Mobile */}
          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-white rounded-lg lg:hidden"
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
              className="w-full bg-[#131F3F] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-700/60 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav onClick={handleLinkClick} className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs">
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
          ) : (
            /* STAFF DEALERSHIP NAVIGATION */
            <div className="space-y-4">
              {/* Dashboard */}
              <div>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-red-400" />
                  <span>TVS Sales Dashboard</span>
                </Link>
              </div>

              {/* Showroom Models & Stock */}
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  Motorcycles & Stock
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard/vehicles"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/vehicles'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-red-500" />
                    <span>TVS Bike Models & Specs</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/dashboard/transfers"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                        pathname === '/dashboard/transfers'
                          ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>Dealership Branches</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Sales Workflow */}
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  Sales & Orders Workflow
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard/leads"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/leads'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-blue-400" />
                    <span>Customer Requests (CRM)</span>
                  </Link>

                  <Link
                    href="/dashboard/reservations"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/reservations'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Bookings & Allocations</span>
                  </Link>

                  <Link
                    href="/dashboard/quotations"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/quotations'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>Quotations</span>
                  </Link>

                  <Link
                    href="/dashboard/sales"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/sales'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>Invoices & Sales</span>
                  </Link>

                  {isFinance && (
                    <Link
                      href="/dashboard/finance"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                        pathname === '/dashboard/finance'
                          ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                      <span>Payments & Cash</span>
                    </Link>
                  )}

                  <Link
                    href="/dashboard/handovers"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/handovers'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>PDI & Handover Delivery</span>
                  </Link>

                  <Link
                    href="/dashboard/customers"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/customers'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Customer Database</span>
                  </Link>
                </div>
              </div>

              {/* Reports & Website CMS */}
              <div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  Management & System
                </div>
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard/reports"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      pathname === '/dashboard/reports'
                        ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                        : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span>Reports & Sales Summaries</span>
                  </Link>

                  {isAdmin && (
                    <>
                      <Link
                        href="/dashboard/website"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                          pathname === '/dashboard/website'
                            ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span>Website Banners & CMS</span>
                      </Link>

                      <Link
                        href="/dashboard/users"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                          pathname === '/dashboard/users'
                            ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <UserCog className="w-4 h-4 text-slate-400" />
                        <span>Staff Accounts & Roles</span>
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                          pathname === '/dashboard/settings'
                            ? 'bg-red-950/60 text-red-400 border-l-4 border-red-500 font-semibold'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Dealership Settings</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0E1738]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-xs truncate">
                  {currentUser?.name || 'Staff User'}
                </div>
                <div className="text-[10px] text-red-400 font-medium truncate">
                  {currentUser?.role || 'Authorized User'}
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
