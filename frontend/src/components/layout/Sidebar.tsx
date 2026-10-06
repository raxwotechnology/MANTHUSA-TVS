"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  ClipboardCheck,
  ShoppingCart,
  ArrowLeftRight,
  TrendingUp,
  Users,
  UserCheck,
  CheckCircle2,
  Calendar,
  PhoneCall,
  FileText,
  BookmarkCheck,
  DollarSign,
  Receipt,
  CreditCard,
  PieChart,
  Award,
  Target,
  Wrench,
  MessageSquareWarning,
  BarChart3,
  ShieldCheck,
  UserCog,
  Settings,
  Search,
  LogOut,
  ChevronDown,
  Building2,
  X
} from 'lucide-react';

interface SidebarProps {
  user: any;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ user, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('inventory');

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
  const isSales = cleanRole.includes('sales') || cleanRole.includes('operations') || isAdmin;
  const isFinance = cleanRole.includes('accountant') || cleanRole.includes('finance') || isAdmin;
  const isInventory = cleanRole.includes('inventory') || isAdmin;
  const isCustomer = cleanRole.includes('customer') || cleanRole.includes('client');
  const isStaff = !isCustomer;

  const userInitials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'VS';

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/30">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-wide flex items-center gap-1">
                Sales<span className="text-emerald-400">Plus</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Vehicle Sales System</p>
            </div>
          </div>

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
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131F3F] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg border border-slate-700/60 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <nav onClick={handleLinkClick} className="flex-1 overflow-y-auto px-3 py-2 space-y-4 text-xs">

        {/* DASHBOARD */}
        <div>
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              pathname === '/dashboard'
                ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Main Dashboard</span>
          </Link>
        </div>

        {/* INVENTORY & VEHICLES */}
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
            Showroom & Inventory
          </div>
          <div className="space-y-0.5">
            {(isInventory || isCustomer) && <Link
              href="/dashboard/vehicles"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/dashboard/vehicles'
                  ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Showroom Vehicles</span>
            </Link>}

            <Link
              href="/dashboard/vehicles/compare"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/dashboard/vehicles/compare'
                  ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Vehicle Comparison</span>
            </Link>

            {isInventory && (
              <>
                <Link
                  href="/dashboard/inspections"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard/inspections'
                      ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Vehicle Inspection</span>
                </Link>

                <Link
                  href="/dashboard/purchases"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard/purchases'
                      ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Acquisitions & Costs</span>
                </Link>

                <Link
                  href="/dashboard/valuations"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard/valuations'
                      ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Trade-ins & Valuations</span>
                </Link>

                <Link
                  href="/dashboard/transfers"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard/transfers'
                      ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Stock Transfers</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* PROCUREMENT & SUPPLIERS (Staff only) */}
        {isInventory && (
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Procurement & Supply
            </div>
            <Link
              href="/dashboard/suppliers"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/dashboard/suppliers'
                  ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Supplier Management</span>
            </Link>
          </div>
        )}

        {/* CRM & SALES LEADS */}
        {(isSales || isCustomer) && (
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              CRM & Sales Pipeline
            </div>
            <div className="space-y-0.5">
              {isSales && <Link
                href="/dashboard/customers"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/customers'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Profiles</span>
              </Link>}

              <Link
                href="/dashboard/leads"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/leads'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Leads & CRM</span>
              </Link>

              <Link
                href="/dashboard/test-drives"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/test-drives'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Test Drive Bookings</span>
              </Link>
            </div>
          </div>
        )}

        {/* SALES & CONTRACTS */}
        {(isSales || isFinance || isCustomer) && (
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Sales & Deals
            </div>
            <div className="space-y-0.5">
              {(isSales || isCustomer) && <Link
                href="/dashboard/quotations"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/quotations'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Quotations & Discounts</span>
              </Link>}
              {isSales && <Link href="/dashboard/discount-approvals" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${pathname === '/dashboard/discount-approvals' ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold' : 'hover:bg-slate-800/60 text-slate-300'}`}>
                <CheckCircle2 className="w-4 h-4" /><span>Discount Approvals</span>
              </Link>}

              {(isSales || isFinance) && <Link
                href="/dashboard/reservations"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/reservations'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>Reservations</span>
              </Link>}

              {(isSales || isFinance || isCustomer) && <Link
                href="/dashboard/sales"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/sales'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Sales Invoices</span>
              </Link>}

              {isSales && <Link
                href="/dashboard/handovers"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/handovers'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Vehicle Handover</span>
              </Link>}
              {(isSales || isFinance) && <Link href="/dashboard/documents" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${pathname === '/dashboard/documents' ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold' : 'hover:bg-slate-800/60 text-slate-300'}`}>
                <FileText className="w-4 h-4" /><span>Documents</span>
              </Link>}
            </div>
          </div>
        )}

        {/* FINANCE & CASH FLOW */}
        {isFinance && (
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Finance & Ledger
            </div>
            <div className="space-y-0.5">
              <Link
                href="/dashboard/finance"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/finance'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Receipts & Cash Vouchers</span>
              </Link>

              <Link
                href="/dashboard/installments"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/installments'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Installments & Finance</span>
              </Link>

              <Link
                href="/dashboard/leasing"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/leasing'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Leasing Partners</span>
              </Link>

              <Link href="/dashboard/refunds" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${pathname === '/dashboard/refunds' ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold' : 'hover:bg-slate-800/60 text-slate-300'}`}>
                <Receipt className="w-4 h-4" /><span>Refunds</span>
              </Link>

              <Link
                href="/dashboard/expenses"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/expenses'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Expenses Ledger</span>
              </Link>
              <Link href="/dashboard/supplier-payments" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${pathname === '/dashboard/supplier-payments' ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold' : 'hover:bg-slate-800/60 text-slate-300'}`}>
                <Building2 className="w-4 h-4" /><span>Supplier Payments</span>
              </Link>
            </div>
          </div>
        )}

        {/* PERFORMANCE & TARGETS */}
        {isAdmin && (
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Commissions & Targets
            </div>
            <div className="space-y-0.5">
              <Link
                href="/dashboard/commissions"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/commissions'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Sales Commissions</span>
              </Link>

              <Link
                href="/dashboard/targets"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/targets'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Monthly Targets</span>
              </Link>
            </div>
          </div>
        )}

        {/* AFTER SALES & INQUIRIES */}
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
            Support & Feedback
          </div>
          <div className="space-y-0.5">
            {isSales && <Link
                href="/dashboard/after-sales"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/after-sales'
                    ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>Service & Renewals</span>
              </Link>}

            {isSales && <Link
              href="/dashboard/complaints"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/dashboard/complaints'
                  ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <MessageSquareWarning className="w-4 h-4" />
              <span>Customer Inquiries & Feedback</span>
            </Link>}
          </div>
        </div>

        {/* REPORTS & ADMIN (Staff only) */}
        {(isFinance || isInventory) && (
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Reports & Security
            </div>
          <div className="space-y-0.5">
            <Link
              href="/dashboard/reports"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                pathname === '/dashboard/reports'
                  ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                  : 'hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports & Analytics</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/dashboard/audit-logs"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard/audit-logs'
                      ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audit Logs</span>
                </Link>

                <Link
                  href="/dashboard/users"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard/users'
                      ? 'bg-emerald-950/60 text-emerald-400 border-l-4 border-emerald-500 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <UserCog className="w-4 h-4" />
                  <span>User Roles & Permissions</span>
                </Link>
              </>
            )}
          </div>
        </div>
        )}
      </nav>

      {/* User Footer Profile Card */}
      <div className="p-3 border-t border-slate-800/80 bg-[#091024]">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-emerald-400 truncate">{user?.role || 'Staff'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  </>
  );
}
