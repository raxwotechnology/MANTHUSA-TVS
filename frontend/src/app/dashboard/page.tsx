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

import { getApiUrl } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalVehicles: 5,
    availableVehicles: 2,
    reservedVehicles: 1,
    soldVehicles: 1,
    totalCustomers: 2,
    newLeads: 1,
    todaySales: 1,
    monthlySales: 1,
    monthlyRevenue: 9915000,
    outstandingCustomerPayments: 0,
    supplierOutstanding: 4500000,
    totalExpenses: 120000,
    grossProfit: 1250000,
    netProfit: 1130000,
    cashBalance: 9795000
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl('/dashboard/stats'));
        if (res.ok) {
          const data = await res.json();
          setStats((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

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
              <p className="text-xl font-bold text-emerald-600">3</p>
              <span className="text-[10px] text-emerald-700">Normal</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-blue-800">31 - 60 Days</span>
              <p className="text-xl font-bold text-blue-600">1</p>
              <span className="text-[10px] text-blue-700">Monitor</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-amber-800">61 - 90 Days</span>
              <p className="text-xl font-bold text-amber-600">1</p>
              <span className="text-[10px] text-amber-700">Attention</span>
            </div>
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-center">
              <span className="text-xs font-semibold text-red-800">90+ Days</span>
              <p className="text-xl font-bold text-red-600">0</p>
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
                <tr className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">STK-2026-001</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Toyota Premio F EX 2019</td>
                  <td className="py-2.5 px-3 text-slate-600">CAB-8912</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">LKR 13,500,000</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Available</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">STK-2026-002</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Honda Vezel Z Sensing 2018</td>
                  <td className="py-2.5 px-3 text-slate-600">CBH-4412</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">LKR 10,800,000</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Available</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">STK-2026-003</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Mercedes-Benz C200 AMG 2021</td>
                  <td className="py-2.5 px-3 text-slate-600">CBA-1102</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600">LKR 28,500,000</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Reserved</span>
                  </td>
                </tr>
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
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                <p className="font-semibold text-blue-900">Kamal Gunaratne</p>
                <p className="text-[11px] text-blue-700">Follow up via WhatsApp for Toyota Premio quotation.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-800">Blue Star Logistics Ltd</p>
                <p className="text-[11px] text-slate-600">Handover completed for Nissan X-Trail.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

