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
  CheckCircle2
} from 'lucide-react';

import { apiFetch } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
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
    cashBalance: 0
  });
  const [loadError, setLoadError] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  const [leadReminders, setLeadReminders] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [leadStats, setLeadStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats((prev) => ({ ...prev, ...data }));
          setLoadError('');
        } else setLoadError('Dashboard data could not be loaded.');
      } catch {
        setLoadError('Cannot connect to the server. Dashboard figures are unavailable.');
      }
    };
    fetchStats();
    apiFetch('/vehicles').then(async (response) => { if (response.ok) setInventory(await response.json()); }).catch(() => undefined);
    apiFetch('/follow-ups').then(async (response) => { if (response.ok) setLeadReminders(await response.json()); }).catch(() => undefined);
    apiFetch('/reports/sales-by-month').then(async (response) => { if (response.ok) setMonthlyTrend(await response.json()); }).catch(() => undefined);
    apiFetch('/reports/lead-conversion').then(async (response) => { if (response.ok) setLeadStats(await response.json()); }).catch(() => undefined);
  }, []);

  const stockVehicles = inventory.filter((vehicle) => !['Sold', 'Inactive'].includes(vehicle.status));

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

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
            onClick={() => router.push('/dashboard/finance')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>+ Record Cash IN / OUT</span>
          </button>
        </div>
      </div>

      {loadError && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</div>}

      {/* KPI Cards Grid (15 KPIs as per Final Requirements Section 3) */}
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
      </div>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold text-slate-900">Monthly sales revenue</h2><span className="text-[10px] text-slate-500">Current year · hover bars for value</span></div><div className="flex h-36 items-end gap-2 border-b border-l px-2">{Array.from({ length: 12 }, (_, index) => { const row = monthlyTrend.find(item => item._id === index + 1); const max = Math.max(1, ...monthlyTrend.map(item => Number(item.revenue || 0))); const height = Math.max(3, (Number(row?.revenue || 0) / max) * 100); return <div key={index} className="group flex h-full flex-1 flex-col justify-end text-center"><div title={`LKR ${Number(row?.revenue || 0).toLocaleString()}`} style={{ height: `${height}%` }} className="min-h-1 rounded-t bg-emerald-500 group-hover:bg-emerald-600"/><span className="mt-1 text-[9px] text-slate-500">{new Date(2000, index).toLocaleString('en', { month: 'short' })}</span></div> })}</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="mb-1 text-sm font-bold text-slate-900">Lead conversion</h2><p className="text-xs text-slate-500">Won leads against all pipeline leads</p><p className="mt-4 text-3xl font-extrabold text-blue-700">{leadStats?.conversionRate ?? 0}%</p><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.min(100, leadStats?.conversionRate || 0)}%` }}/></div><p className="mt-2 text-xs text-slate-600">{leadStats?.converted || 0} converted / {leadStats?.total || 0} total leads</p></div>
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
              <p className="text-xl font-bold text-emerald-600">{stockVehicles.filter((v) => Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000) <= 30).length}</p>
              <span className="text-[10px] text-emerald-700">Normal</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-blue-800">31 - 60 Days</span>
              <p className="text-xl font-bold text-blue-600">{stockVehicles.filter((v) => { const d = Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000); return d > 30 && d <= 60; }).length}</p>
              <span className="text-[10px] text-blue-700">Monitor</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-amber-800">61 - 90 Days</span>
              <p className="text-xl font-bold text-amber-600">{stockVehicles.filter((v) => { const d = Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000); return d > 60 && d <= 90; }).length}</p>
              <span className="text-[10px] text-amber-700">Attention</span>
            </div>
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-red-800">90+ Days</span>
              <p className="text-xl font-bold text-red-600">{stockVehicles.filter((v) => Math.floor((Date.now() - new Date(v.createdAt || Date.now()).getTime()) / 86400000) > 90).length}</p>
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
                {inventory.slice(0, 3).map((vehicle) => <tr key={vehicle._id} className="hover:bg-slate-50/80"><td className="py-2.5 px-3 font-semibold text-slate-800">{vehicle.stockNumber}</td><td className="py-2.5 px-3 font-medium text-slate-900">{vehicle.make} {vehicle.model} {vehicle.variant} {vehicle.year}</td><td className="py-2.5 px-3 text-slate-600">{vehicle.registrationNumber}</td><td className="py-2.5 px-3 font-bold text-emerald-600">{formatLKR(vehicle.sellingPrice)}</td><td className="py-2.5 px-3">{vehicle.status}</td></tr>)}
                {inventory.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-slate-500">No vehicle inventory records found.</td></tr>}
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
            <div className="space-y-2 text-xs">{leadReminders.slice(0, 5).map((reminder) => <div key={reminder._id} className="rounded-lg border border-blue-100 bg-blue-50 p-2.5"><p className="font-semibold text-blue-900">{reminder.customer?.fullName || 'Customer follow-up'}</p><p className="text-[11px] text-blue-700">{reminder.type} · {reminder.scheduledAt ? new Date(reminder.scheduledAt).toLocaleString() : reminder.date ? new Date(reminder.date).toLocaleString() : reminder.notes || 'Follow-up scheduled'}</p></div>)}{leadReminders.length === 0 && <p className="text-slate-500">No follow-ups are scheduled.</p>}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

