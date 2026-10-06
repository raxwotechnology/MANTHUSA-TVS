"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Car,
  Users,
  UserCheck,
  TrendingUp,
  DollarSign,
  Receipt,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BadgePercent
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    totalVehicles: 0,
    availableVehicles: 0,
    reservedVehicles: 0,
    soldVehicles: 0,
    totalCustomers: 0,
    newLeads: 0,
    todaySales: 0,
    monthlySales: 0,
    monthlyRevenue: 0,
    outstandingCustomerPayments: 0,
    supplierOutstanding: 0,
    totalExpenses: 0,
    grossProfit: 0,
    netProfit: 0,
    cashBalance: 0,
    myReservations: 0,
    myInquiries: 0
  });
  const [loadError, setLoadError] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  const [leadReminders, setLeadReminders] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [leadStats, setLeadStats] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    let userRole = '';
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setCurrentUser(u);
        userRole = (u?.role || '').toLowerCase();
      } catch {}
    }

    const isCustomerUser = userRole.includes('customer') || userRole.includes('client');

    const fetchStats = async () => {
      try {
        const res = await apiFetch('/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats((prev: any) => ({ ...prev, ...data }));
          setLoadError('');
        } else {
          setLoadError('Dashboard data could not be loaded.');
        }
      } catch {
        setLoadError('Cannot connect to the server. Dashboard figures are unavailable.');
      }
    };

    fetchStats();
    apiFetch('/vehicles').then(async (response) => {
      if (response.ok) setInventory(await response.json());
    }).catch(() => undefined);

    // Only load internal CRM/financial reports for staff users
    if (!isCustomerUser) {
      apiFetch('/follow-ups').then(async (response) => {
        if (response.ok) setLeadReminders(await response.json());
      }).catch(() => undefined);

      apiFetch('/reports/sales-by-month').then(async (response) => {
        if (response.ok) setMonthlyTrend(await response.json());
      }).catch(() => undefined);

      apiFetch('/reports/lead-conversion').then(async (response) => {
        if (response.ok) setLeadStats(await response.json());
      }).catch(() => undefined);
    }
  }, []);

  const role = (currentUser?.role || '').toLowerCase();
  const isCustomer = role.includes('customer') || role.includes('client');
  const isAdminOrFinance = role.includes('admin') || role.includes('owner') || role.includes('accountant') || role.includes('finance');

  const stockVehicles = inventory.filter((vehicle) => !['Sold', 'Inactive'].includes(vehicle.status));

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // ==========================================
  // CUSTOMER PORTAL VIEW
  // ==========================================
  if (isCustomer) {
    const availableCount = stats.availableVehicles || stockVehicles.filter(v => v.status === 'Available').length;
    const featuredVehicles = inventory.filter(v => v.status === 'Available').slice(0, 6);

    return (
      <DashboardLayout>
        {/* Customer Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#3A506B] p-6 text-white mb-6 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customer Portal</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Welcome, {currentUser?.name || 'Valued Customer'}!
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Explore our verified showroom inventory, compare vehicle specifications, and review vehicle pricing with complete transparency.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push('/dashboard/vehicles')}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Car className="w-4 h-4" />
                <span>Browse Showroom</span>
              </button>
              <button
                onClick={() => router.push('/dashboard/vehicles/compare')}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-xs transition-all border border-white/15"
              >
                <span>Compare Models</span>
              </button>
            </div>
          </div>
        </div>

        {loadError && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {/* Customer KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Available Vehicles</span>
              <Car className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{availableCount}</p>
            <span className="text-xs text-emerald-600 font-medium">Ready in Colombo Showroom</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">My Reservations</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600">{stats.myReservations || 0}</p>
            <span className="text-xs text-slate-500">Active vehicle holds</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">My Inquiries</span>
              <UserCheck className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-extrabold text-blue-600">{stats.myInquiries || 0}</p>
            <span className="text-xs text-slate-500">Showroom follow-up requests</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Buyer Protection</span>
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-base font-bold text-slate-900 mt-2">100% Certified</p>
            <span className="text-xs text-indigo-600 font-medium">Clear Titles & RMV Forms</span>
          </div>
        </div>

        {/* Featured Vehicles Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Featured Vehicles on Display</h2>
              <p className="text-xs text-slate-500">Select any vehicle to view full specifications, photos, and QR codes</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/vehicles')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All ({inventory.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {featuredVehicles.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No showroom vehicles currently available. Please check back shortly.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredVehicles.map((vehicle) => {
                const photo = vehicle.images?.[0] || vehicle.featuredImage || '/car-placeholder.png';
                return (
                  <div
                    key={vehicle._id}
                    className="group rounded-xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden flex flex-col bg-slate-50/40"
                  >
                    <div className="relative h-40 bg-slate-200 overflow-hidden flex items-center justify-center">
                      {photo.startsWith('/') || photo.startsWith('http') ? (
                        <img
                          src={photo}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Car className="w-12 h-12 text-slate-400" />
                      )}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                        {vehicle.condition || 'Registered'}
                      </span>
                    </div>

                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h3 className="font-bold text-slate-900 text-sm truncate">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <span className="text-xs font-semibold text-slate-500">{vehicle.manufacturingYear || vehicle.year}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2 truncate">
                          {vehicle.variant || ''} {vehicle.fuelType ? `· ${vehicle.fuelType}` : ''} {vehicle.transmission ? `· ${vehicle.transmission}` : ''}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase">Price</p>
                          <p className="text-sm font-extrabold text-emerald-600">{formatLKR(vehicle.sellingPrice)}</p>
                        </div>
                        <button
                          onClick={() => router.push(`/dashboard/vehicles`)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer Assistance Services Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
              <BadgePercent className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">Trade-In & Vehicle Exchange</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bring your existing vehicle for certified valuation and deduct its value towards any vehicle in our showroom.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">RMV & MTA Documentation</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              We take care of all RMV transfer documents (MTA 6, MTA 8 forms), clearance paperwork, and revenue license renewals.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 mb-1">Showroom Inquiry Desk</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Have questions or need assistance? Reach out to our customer care team or submit an inquiry through your portal.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // STAFF DEALERSHIP DASHBOARD VIEW
  // ==========================================
  return (
    <DashboardLayout>
      {/* Top Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Main Dashboard</h1>
          <p className="text-xs text-slate-500">
            Real-time overview of vehicle inventory, sales revenue, CRM leads, and cash flow ledger.
          </p>
        </div>

        {/* Quick Action Buttons Row matching screenshots */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/vehicles')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Vehicle</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/leads')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>+ Create Sales Lead</span>
          </button>

          <button
            onClick={() => router.push('/dashboard/vehicles/compare')}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Car className="w-4 h-4" />
            <span>Compare Vehicles</span>
          </button>

          {isAdminOrFinance && (
            <button
              onClick={() => router.push('/dashboard/finance')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>+ Record Cash IN / OUT</span>
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {/* Total Vehicles */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Vehicles</span>
            <Car className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalVehicles}</p>
          <span className="text-[10px] text-slate-400">Total in stock</span>
        </div>

        {/* Available Vehicles */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Available</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.availableVehicles}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Ready for sale</span>
        </div>

        {/* Reserved Vehicles */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Reserved</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.reservedVehicles}</p>
          <span className="text-[10px] text-amber-600 font-medium">Deposit paid</span>
        </div>

        {/* Sold Vehicles */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Sold Vehicles</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">{stats.soldVehicles}</p>
          <span className="text-[10px] text-slate-400">Completed sales</span>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Customers</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.totalCustomers}</p>
          <span className="text-[10px] text-slate-400">Registered profiles</span>
        </div>

        {/* New Leads */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">New Leads</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.newLeads}</p>
          <span className="text-[10px] text-blue-600 font-medium">Active inquiries</span>
        </div>

        {/* Today's Sales */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Today Sales</span>
            <Calendar className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.todaySales}</p>
          <span className="text-[10px] text-slate-400">Invoices issued today</span>
        </div>

        {/* Monthly Sales */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Monthly Sales</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.monthlySales}</p>
          <span className="text-[10px] text-slate-400">This month count</span>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-emerald-600 truncate">{formatLKR(stats.monthlyRevenue)}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Total sales value</span>
        </div>

        {/* Outstanding Customer Payments */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Customer Due</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-amber-600 truncate">{formatLKR(stats.outstandingCustomerPayments)}</p>
          <span className="text-[10px] text-amber-600 font-medium">Unpaid balance</span>
        </div>

        {/* Internal Financial KPIs: restricted to Admin / Finance as per RBAC requirements */}
        {isAdminOrFinance && (
          <>
            {/* Supplier Outstanding */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Supplier Due</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-lg font-bold text-red-600 truncate">{formatLKR(stats.supplierOutstanding)}</p>
              <span className="text-[10px] text-red-600 font-medium">Payable to suppliers</span>
            </div>

            {/* Total Expenses */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Expenses</span>
                <ArrowDownRight className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-lg font-bold text-rose-600 truncate">{formatLKR(stats.totalExpenses)}</p>
              <span className="text-[10px] text-slate-400">Total overhead costs</span>
            </div>

            {/* Gross Profit */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Gross Profit</span>
                <ArrowUpRight className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-lg font-bold text-teal-600 truncate">{formatLKR(stats.grossProfit)}</p>
              <span className="text-[10px] text-teal-600 font-medium">Selling - Purchase cost</span>
            </div>

            {/* Net Profit */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Net Profit</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-lg font-bold text-emerald-700 truncate">{formatLKR(stats.netProfit)}</p>
              <span className="text-[10px] text-emerald-700 font-medium">Profit after expenses</span>
            </div>

            {/* Cash Balance */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Cash Balance</span>
                <Receipt className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-700 truncate">{formatLKR(stats.cashBalance)}</p>
              <span className="text-[10px] text-slate-400">Available cash & bank</span>
            </div>
          </>
        )}
      </div>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Monthly sales revenue</h2>
            <span className="text-[10px] text-slate-500">Current year · hover bars for value</span>
          </div>
          <div className="flex h-36 items-end gap-2 border-b border-l px-2">
            {Array.from({ length: 12 }, (_, index) => {
              const row = monthlyTrend.find((item) => item._id === index + 1);
              const max = Math.max(1, ...monthlyTrend.map((item) => Number(item.revenue || 0)));
              const height = Math.max(3, (Number(row?.revenue || 0) / max) * 100);
              return (
                <div key={index} className="group flex h-full flex-1 flex-col justify-end text-center">
                  <div
                    title={`LKR ${Number(row?.revenue || 0).toLocaleString()}`}
                    style={{ height: `${height}%` }}
                    className="min-h-1 rounded-t bg-emerald-500 group-hover:bg-emerald-600"
                  />
                  <span className="mt-1 text-[9px] text-slate-500">
                    {new Date(2000, index).toLocaleString('en', { month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-1 text-sm font-bold text-slate-900">Lead conversion</h2>
          <p className="text-xs text-slate-500">Won leads against all pipeline leads</p>
          <p className="mt-4 text-3xl font-extrabold text-blue-700">{leadStats?.conversionRate ?? 0}%</p>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${Math.min(100, leadStats?.conversionRate || 0)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {leadStats?.converted || 0} converted / {leadStats?.total || 0} total leads
          </p>
        </div>
      </section>

      {/* Main Content Grid: Recent Transactions & Inventory Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Status Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Inventory Status & Aging Stock</h3>
              <p className="text-xs text-slate-500">Vehicle breakdown across Colombo & regional branches</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/vehicles')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View Inventory →
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-emerald-800">0 - 30 Days</span>
              <p className="text-xl font-bold text-emerald-600">
                {stockVehicles.filter((v) => Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000) <= 30).length}
              </p>
              <span className="text-[10px] text-emerald-700">Normal</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-blue-800">31 - 60 Days</span>
              <p className="text-xl font-bold text-blue-600">
                {stockVehicles.filter((v) => {
                  const d = Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000);
                  return d > 30 && d <= 60;
                }).length}
              </p>
              <span className="text-[10px] text-blue-700">Monitor</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-amber-800">61 - 90 Days</span>
              <p className="text-xl font-bold text-amber-600">
                {stockVehicles.filter((v) => {
                  const d = Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000);
                  return d > 60 && d <= 90;
                }).length}
              </p>
              <span className="text-[10px] text-amber-700">Attention</span>
            </div>
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-red-800">90+ Days</span>
              <p className="text-xl font-bold text-red-600">
                {stockVehicles.filter((v) => Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000) > 90).length}
              </p>
              <span className="text-[10px] text-red-700">Critical</span>
            </div>
          </div>

          {/* Quick Vehicle List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">Stock #</th>
                  <th className="py-2.5 px-3 font-semibold">Vehicle</th>
                  <th className="py-2.5 px-3 font-semibold">Reg #</th>
                  <th className="py-2.5 px-3 font-semibold">Selling Price</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.slice(0, 4).map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{vehicle.stockNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {vehicle.make} {vehicle.model} {vehicle.variant} {vehicle.manufacturingYear || vehicle.year}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{vehicle.registrationNumber || '-'}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{formatLKR(vehicle.sellingPrice)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        vehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        vehicle.status === 'Reserved' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      No vehicle inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Recent CRM Activity */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Dealership Quick Links</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/dashboard/quotations')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 flex items-center justify-between transition-colors group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">Create Quotation PDF</p>
                  <p className="text-[10px] text-slate-500">Calculate final price with options</p>
                </div>
                <span className="text-slate-400 group-hover:text-blue-600">→</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/reservations')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 flex items-center justify-between transition-colors group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-amber-600">Vehicle Reservations</p>
                  <p className="text-[10px] text-slate-500">Track customer deposit receipts</p>
                </div>
                <span className="text-slate-400 group-hover:text-amber-600">→</span>
              </button>

              <button
                onClick={() => router.push('/dashboard/handovers')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 flex items-center justify-between transition-colors group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 group-hover:text-emerald-600">Handover Checklist</p>
                  <p className="text-[10px] text-slate-500">Keys, CR, insurance & signature</p>
                </div>
                <span className="text-slate-400 group-hover:text-emerald-600">→</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Active Lead Reminders</h3>
            <div className="space-y-2 text-xs">
              {leadReminders.slice(0, 5).map((reminder) => (
                <div key={reminder._id} className="rounded-lg border border-blue-100 bg-blue-50 p-2.5">
                  <p className="font-semibold text-blue-900">{reminder.customer?.fullName || 'Customer follow-up'}</p>
                  <p className="text-[11px] text-blue-700">
                    {reminder.type} · {reminder.scheduledAt ? new Date(reminder.scheduledAt).toLocaleString() : reminder.date ? new Date(reminder.date).toLocaleString() : reminder.notes || 'Follow-up scheduled'}
                  </p>
                </div>
              ))}
              {leadReminders.length === 0 && (
                <p className="text-slate-500 text-xs py-2">No active follow-ups scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
