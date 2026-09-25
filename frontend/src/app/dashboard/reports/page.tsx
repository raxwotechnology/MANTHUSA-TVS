"use client";
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, Download, TrendingUp, DollarSign, PieChart, Users } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reports & Business Analytics</h1>
          <p className="text-xs text-slate-500">Comprehensive sales performance, aging stock, profit & loss, cash flow, and lead conversion reports</p>
        </div>

        <button className="flex items-center gap-1.5 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Download className="w-4 h-4" />
          <span>Export All Reports (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Revenue & Sales Report</h3>
              <p className="text-[11px] text-slate-500">Breakdown by model, executive, branch</p>
            </div>
          </div>
          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Inventory Aging Stock Report</h3>
              <p className="text-[11px] text-slate-500">0-30, 31-60, 61-90, 90+ days stock duration</p>
            </div>
          </div>
          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Profit & Loss Financial Report</h3>
              <p className="text-[11px] text-slate-500">Gross profit, operating expenses & net profit</p>
            </div>
          </div>
          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">
            Generate Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
