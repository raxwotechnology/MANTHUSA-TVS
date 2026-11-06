"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileDown,
  FileSpreadsheet,
  Bike,
  Target,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Store,
  Globe,
  Users,
  CheckCircle2
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { exportPdf, exportExcel } from '@/lib/exportUtils';

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [financialAnalysis, setFinancialAnalysis] = useState<any>(null);
  const [customerAcquisition, setCustomerAcquisition] = useState<any>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [aging, setAging] = useState<any[]>([]);
  const [profitLoss, setProfitLoss] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [leadConversion, setLeadConversion] = useState<any>(null);
  const [targetGrowthPct, setTargetGrowthPct] = useState<number>(15);
  const [error, setError] = useState('');

  const loadFinancialAnalysis = async (growth: number) => {
    try {
      const res = await apiFetch(`/reports/financial-analysis?targetGrowth=${growth}`);
      if (res.ok) setFinancialAnalysis(await res.json());
    } catch (err) {
      console.error('Failed to load financial analysis', err);
    }
  };

  useEffect(() => {
    const reports = [
      ['summary', '/reports/summary'],
      ['monthly', '/reports/sales-by-month'],
      ['aging', '/reports/aging-stock'],
      ['profitLoss', '/reports/profit-loss'],
      ['branches', '/reports/by-branch'],
      ['categories', '/reports/sales-by-category'],
      ['leadConversion', '/reports/lead-conversion'],
      ['financialAnalysis', `/reports/financial-analysis?targetGrowth=${targetGrowthPct}`],
      ['customerAcquisition', '/reports/customer-acquisition'],
    ] as const;

    Promise.allSettled(reports.map(async ([name, path]) => {
      const response = await apiFetch(path);
      if (!response.ok) throw new Error(`${name} report unavailable`);
      return [name, await response.json()] as const;
    })).then((results) => {
      const failed: string[] = [];
      results.forEach((result) => {
        if (result.status === 'rejected') {
          failed.push(result.reason instanceof Error ? result.reason.message : 'A report could not be loaded.');
          return;
        }
        const [name, data] = result.value;
        if (name === 'summary') setSummary(data);
        if (name === 'monthly') setMonthly(data);
        if (name === 'aging') setAging(data);
        if (name === 'profitLoss') setProfitLoss(data);
        if (name === 'branches') setBranches(data);
        if (name === 'categories') setCategories(data);
        if (name === 'leadConversion') setLeadConversion(data);
        if (name === 'financialAnalysis') setFinancialAnalysis(data);
        if (name === 'customerAcquisition') setCustomerAcquisition(data);
      });
      if (failed.length) setError(`Some reports could not be loaded: ${failed.join(', ')}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGrowthChange = (pct: number) => {
    setTargetGrowthPct(pct);
    loadFinancialAnalysis(pct);
  };

  const exportCsv = () => {
    if (!summary) return;
    const rows = [
      ['Metric', 'Value'],
      ['Sales Count', summary.salesCount],
      ['Total Revenue', summary.revenue],
      ['Payments collected', summary.paymentsCollected],
      ['Outstanding', summary.outstanding],
      ['Expenses', summary.expenses],
      ['Net after expenses', summary.netAfterExpenses],
      ...Object.entries(summary.inventory || {}).map(([status, count]) => [`Inventory: ${status}`, count])
    ];
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'dealership-report.csv'; link.click(); URL.revokeObjectURL(url);
  };

  const exportRows = (name: string, rows: any[]) => {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys, ...rows.map((row) => keys.map((key) => row[key] ?? ''))].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
  };

  const exportAccounting = async (format: 'quickbooks' | 'xero') => {
    try {
      const res = await apiFetch(`/reports/accounting-export?format=${format}`);
      if (!res.ok) throw new Error('Could not generate accounting export.');
      const data = await res.json();
      const blob = new Blob([data.content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename || `${format}_export.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Export failed.');
    }
  };

  const exportCustomerSourceReport = async (source: 'walk-in' | 'online', format: 'pdf' | 'excel') => {
    try {
      const res = await apiFetch(`/customers?source=${source}`);
      if (!res.ok) throw new Error('Could not fetch customer records.');
      const list = await res.json();
      const cols = [
        { label: 'Customer ID', value: (r: any) => r.customerId || r._id },
        { label: 'Name', value: (r: any) => r.fullName },
        { label: 'Channel', value: () => source === 'walk-in' ? 'Walk-in (Shop Visit)' : 'Online Customer Base' },
        { label: 'Phone', value: (r: any) => r.phone },
        { label: 'NIC / Passport', value: (r: any) => r.nicOrPassport || r.nicPassport || '—' },
        { label: 'City', value: (r: any) => r.city || '—' },
        { label: 'Email', value: (r: any) => r.email || '—' },
      ];
      const title = source === 'walk-in' ? 'Walk-in Customers Report (Showroom Visits)' : 'Online Customers Base Report (Digital & Web Inquiries)';
      const filename = source === 'walk-in' ? 'walk-in-customers-report' : 'online-customers-report';
      if (format === 'pdf') {
        exportPdf(title, `${filename}.pdf`, cols, list);
      } else {
        exportExcel(`${filename}.xlsx`, cols, list);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to export customer report.');
    }
  };

  // ── Column definitions for PDF / Excel exports ──────────────────────────────
  const summaryColumns = [
    { label: 'Metric', value: (r: any) => r.metric },
    { label: 'Value',  value: (r: any) => r.value  },
  ];

  const summaryRows = summary ? [
    { metric: 'Bikes Sold (Total Units)', value: summary.salesCount },
    { metric: 'Total Revenue (LKR)',       value: summary.revenue },
    { metric: 'Payments Collected (LKR)', value: summary.paymentsCollected },
    { metric: 'Outstanding Balance (LKR)', value: summary.outstanding },
    { metric: 'Operating Expenses (LKR)', value: summary.expenses },
    { metric: 'Net Profit (LKR)',         value: summary.netAfterExpenses },
    ...Object.entries(summary.inventory || {}).map(([status, count]) => ({ metric: `Inventory: ${status}`, value: count })),
  ] : [];

  const analysisColumns = [
    { label: 'Analysis Parameter', value: (r: any) => r.metric },
    { label: 'Figure',             value: (r: any) => r.value },
  ];

  const analysisRows = financialAnalysis ? [
    { metric: 'Current Month',                          value: financialAnalysis.currentMonth?.monthName },
    { metric: 'Bikes Sold This Month',                  value: `${financialAnalysis.currentMonth?.bikesSold} units` },
    { metric: 'Revenue This Month (LKR)',               value: `LKR ${Number(financialAnalysis.currentMonth?.revenue || 0).toLocaleString()}` },
    { metric: 'Average Price per Bike (LKR)',           value: `LKR ${Number(financialAnalysis.currentMonth?.avgPricePerBike || 0).toLocaleString()}` },
    { metric: 'Previous Month Bikes Sold',              value: `${financialAnalysis.previousMonth?.bikesSold} units` },
    { metric: 'Previous Month Revenue (LKR)',           value: `LKR ${Number(financialAnalysis.previousMonth?.revenue || 0).toLocaleString()}` },
    { metric: 'MoM Bike Units Change',                  value: `${financialAnalysis.monthOverMonth?.unitsDiff >= 0 ? '+' : ''}${financialAnalysis.monthOverMonth?.unitsDiff} (${financialAnalysis.monthOverMonth?.unitsGrowthPct}%)` },
    { metric: 'MoM Revenue Growth',                     value: `${financialAnalysis.monthOverMonth?.revenueDiff >= 0 ? '+' : ''}LKR ${Number(financialAnalysis.monthOverMonth?.revenueDiff || 0).toLocaleString()} (${financialAnalysis.monthOverMonth?.revenueGrowthPct}%)` },
    { metric: 'Next Month Target Growth Goal',          value: `+${financialAnalysis.nextMonthAnalysis?.targetGrowthPct}%` },
    { metric: 'Next Month Projected Revenue Target',    value: `LKR ${Number(financialAnalysis.nextMonthAnalysis?.targetRevenue || 0).toLocaleString()}` },
    { metric: 'Next Month Projected Bike Sales Target',  value: `${financialAnalysis.nextMonthAnalysis?.targetUnits} bikes` },
    { metric: 'Additional Bikes Needed to Hit Target',  value: `+${financialAnalysis.nextMonthAnalysis?.neededAdditionalUnits} more bikes` },
    { metric: 'Additional Revenue Needed (LKR)',        value: `+LKR ${Number(financialAnalysis.nextMonthAnalysis?.neededAdditionalRevenue || 0).toLocaleString()}` },
  ] : [];

  const monthlyColumns = [
    { label: 'Month',          value: (r: any) => r._id },
    { label: 'Sales Count',    value: (r: any) => r.salesCount },
    { label: 'Revenue (LKR)',  value: (r: any) => r.revenue },
  ];

  const agingColumns = [
    { label: 'Vehicle',        value: (r: any) => r.vehicleName || r._id },
    { label: 'Days in Stock',  value: (r: any) => r.daysInStock },
    { label: 'Bracket',        value: (r: any) => r.bracket },
    { label: 'Value (LKR)',    value: (r: any) => r.value },
  ];

  const branchColumns = [
    { label: 'Branch',              value: (r: any) => r.branchName },
    { label: 'Sales',               value: (r: any) => r.salesCount },
    { label: 'Revenue (LKR)',       value: (r: any) => r.revenue },
    { label: 'Vehicle Cost (LKR)',  value: (r: any) => r.costOfGoods },
    { label: 'Gross Profit (LKR)',  value: (r: any) => r.grossProfit },
    { label: 'Expenses (LKR)',      value: (r: any) => r.operatingExpenses },
    { label: 'Net Profit (LKR)',    value: (r: any) => r.netProfit },
  ];

  const curMonth = financialAnalysis?.currentMonth;
  const prevMonth = financialAnalysis?.previousMonth;
  const mom = financialAnalysis?.monthOverMonth;
  const nextAnalysis = financialAnalysis?.nextMonthAnalysis;

  return (
    <DashboardLayout>
      {/* ── Page header with global export buttons ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Financial Reports &amp; Bike Sales Analytics</span>
          </h1>
          <p className="text-xs text-slate-500">
            Month-over-Month bike sales volume, revenue up/down metrics, next month projection targets, and customer acquisition breakdown
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PDF Analysis Report */}
          <button
            onClick={() => exportPdf('Financial & Sales Growth Report', 'financial-growth-report.pdf', analysisColumns, analysisRows)}
            disabled={!financialAnalysis}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF Report</span>
          </button>

          {/* Excel Analysis Report */}
          <button
            onClick={() => exportExcel('financial-growth-report.xlsx', analysisColumns, analysisRows)}
            disabled={!financialAnalysis}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Report</span>
          </button>

          <button onClick={() => exportAccounting('quickbooks')} className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3 py-2 rounded-lg shadow-xs">
            <Download className="w-4 h-4" /><span>QuickBooks</span>
          </button>
          <button onClick={() => exportAccounting('xero')} className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3 py-2 rounded-lg shadow-xs">
            <Download className="w-4 h-4" /><span>Xero</span>
          </button>
          <button onClick={exportCsv} disabled={!summary} className="flex items-center gap-1.5 bg-slate-900 text-white font-semibold text-xs px-3 py-2 rounded-lg disabled:opacity-50">
            <Download className="w-4 h-4" /><span>CSV</span>
          </button>
        </div>
      </div>

      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* ── SECTION 1: BIKE SALES & REVENUE MONTH-OVER-MONTH ANALYSIS & NEXT MONTH TARGETS ── */}
      {financialAnalysis && (
        <section className="mb-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-700/80 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Executive Month-over-Month (MoM) Financial Analysis</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Bike Sales Volume &amp; Next Month Growth Strategy ({curMonth?.monthName} {curMonth?.year})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compared against previous month ({prevMonth?.monthName}) with custom sales targets for {nextAnalysis?.nextMonthName}
              </p>
            </div>

            {/* Target Growth Selector */}
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 p-1.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-300 px-2">Growth Target:</span>
              {[5, 10, 15, 20, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleGrowthChange(pct)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    targetGrowthPct === pct
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  +{pct}%
                </button>
              ))}
            </div>
          </div>

          {/* 4 Core Financial Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Card 1: Bikes Sold This Month & MoM Trend */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="font-semibold">Bikes Sold ({curMonth?.monthName})</span>
                <Bike className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {curMonth?.bikesSold} <span className="text-sm font-semibold text-slate-400">units</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold">
                {mom?.unitsTrend === 'up' ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{mom?.unitsDiff} bikes (+{mom?.unitsGrowthPct}%)
                  </span>
                ) : mom?.unitsTrend === 'down' ? (
                  <span className="inline-flex items-center gap-0.5 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {mom?.unitsDiff} bikes ({mom?.unitsGrowthPct}%)
                  </span>
                ) : (
                  <span className="text-slate-400">Equal to last month</span>
                )}
                <span className="text-[11px] text-slate-400">vs {prevMonth?.monthName} ({prevMonth?.bikesSold})</span>
              </div>
            </div>

            {/* Card 2: Revenue This Month & MoM Trend */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="font-semibold">Revenue ({curMonth?.monthName})</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">
                LKR {Number(curMonth?.revenue || 0).toLocaleString()}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-bold">
                {mom?.revenueTrend === 'up' ? (
                  <span className="inline-flex items-center gap-0.5 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{mom?.revenueGrowthPct}% (MoM Up)
                  </span>
                ) : mom?.revenueTrend === 'down' ? (
                  <span className="inline-flex items-center gap-0.5 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {mom?.revenueGrowthPct}% (MoM Down)
                  </span>
                ) : (
                  <span className="text-slate-400">Steady</span>
                )}
                <span className="text-[11px] text-slate-400">vs {prevMonth?.monthName} (LKR {Number(prevMonth?.revenue || 0).toLocaleString()})</span>
              </div>
            </div>

            {/* Card 3: Average Selling Price per Bike */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span className="font-semibold">Avg Transaction Value</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300">
                LKR {Number(curMonth?.avgPricePerBike || 0).toLocaleString()}
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Average invoice realization per motorcycle sold
              </p>
            </div>

            {/* Card 4: Next Month Growth Requirement */}
            <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4">
              <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
                <span className="font-bold">Next Month Target ({nextAnalysis?.nextMonthName})</span>
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300">
                {nextAnalysis?.targetUnits} bikes <span className="text-sm font-normal text-emerald-400">target</span>
              </div>
              <div className="mt-2 text-xs font-bold text-emerald-200 flex items-center gap-1">
                <span>Must sell:</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">
                  +{nextAnalysis?.neededAdditionalUnits} more bikes
                </span>
                <span>(+LKR {Number(nextAnalysis?.neededAdditionalRevenue || 0).toLocaleString()})</span>
              </div>
            </div>
          </div>

          {/* Next Month Strategic Projection Box */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950">
                  Target Projection Plan: +{nextAnalysis?.targetGrowthPct}%
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  Projected Revenue Target: LKR {Number(nextAnalysis?.targetRevenue || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                {nextAnalysis?.recommendation}
              </p>
            </div>

            {/* Quick Export for Growth Analysis */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => exportPdf('Next Month Bike Sales Analysis', 'growth-analysis.pdf', analysisColumns, analysisRows)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF Analysis</span>
              </button>
              <button
                type="button"
                onClick={() => exportExcel('growth-analysis.xlsx', analysisColumns, analysisRows)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel Analysis</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 2: CUSTOMER ACQUISITION BREAKDOWN (WALK-IN VS ONLINE) ── */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Customer Base Segmentation: Walk-in vs Online Records</span>
            </h2>
            <p className="text-xs text-slate-500">
              Compare showroom walk-in visitors with online digital leads, including separate PDF and Excel download options
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportCustomerSourceReport('walk-in', 'pdf')}
              className="flex items-center gap-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
              title="Download Walk-in Customers PDF"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Walk-in PDF</span>
            </button>
            <button
              onClick={() => exportCustomerSourceReport('walk-in', 'excel')}
              className="flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
              title="Download Walk-in Customers Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Walk-in Excel</span>
            </button>
            <button
              onClick={() => exportCustomerSourceReport('online', 'pdf')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
              title="Download Online Customers PDF"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Online PDF</span>
            </button>
            <button
              onClick={() => exportCustomerSourceReport('online', 'excel')}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
              title="Download Online Customers Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Online Excel</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Walk-in Customer Segment */}
          <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Walk-in Customers (Shop Visits)</h3>
                  <p className="text-[11px] text-slate-500">In-person visitors to Colombo, Kandy, Galle dealerships</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900">
                {customerAcquisition?.walkIn?.totalCustomers || 0} Registered
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-purple-200/60">
              <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                <span className="text-[10px] text-slate-500 block">Bikes Sold</span>
                <span className="text-base font-black text-slate-900">{customerAcquisition?.walkIn?.bikesSold || 0} units</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                <span className="text-[10px] text-slate-500 block">Total Revenue</span>
                <span className="text-xs font-black text-purple-800">LKR {Number(customerAcquisition?.walkIn?.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                <span className="text-[10px] text-slate-500 block">Avg Spend</span>
                <span className="text-xs font-black text-slate-900">LKR {Number(customerAcquisition?.walkIn?.avgSpend || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Online Customer Segment */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Online Customers (Web Base)</h3>
                  <p className="text-[11px] text-slate-500">Website configurator, digital bookings &amp; online inquiries</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900">
                {customerAcquisition?.online?.totalCustomers || 0} Registered
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-blue-200/60">
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Bikes Sold</span>
                <span className="text-base font-black text-slate-900">{customerAcquisition?.online?.bikesSold || 0} units</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Total Revenue</span>
                <span className="text-xs font-black text-blue-800">LKR {Number(customerAcquisition?.online?.totalRevenue || 0).toLocaleString()}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Avg Spend</span>
                <span className="text-xs font-black text-slate-900">LKR {Number(customerAcquisition?.online?.avgSpend || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── KPI summary cards ── */}
      {summary && (
        <section className="mb-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            ['Total Bikes Sold', summary.salesCount],
            ['Total Revenue', summary.revenue],
            ['Payments Collected', summary.paymentsCollected],
            ['Outstanding Balance', summary.outstanding],
            ['Operating Expenses', summary.expenses],
            ['Net After Expenses', summary.netAfterExpenses]
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 font-bold text-slate-900">
                {typeof value === 'number' && label !== 'Total Bikes Sold'
                  ? `LKR ${value.toLocaleString()}`
                  : value}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* ── Charts ── */}
      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Monthly revenue trend</h2>
            <span className="text-xs text-slate-500">{new Date().getFullYear()}</span>
          </div>
          <div className="flex h-48 items-end gap-2 border-b border-l px-2">
            {Array.from({ length: 12 }, (_, index) => {
              const row = monthly.find(item => item._id === index + 1);
              const max = Math.max(1, ...monthly.map(item => Number(item.revenue || 0)));
              const height = Math.max(3, (Number(row?.revenue || 0) / max) * 100);
              return (
                <div key={index} className="group flex h-full flex-1 flex-col justify-end text-center">
                  <div className="mb-1 truncate text-[9px] text-slate-500 opacity-0 group-hover:opacity-100">
                    {row ? `LKR ${Number(row.revenue).toLocaleString()}` : '0'}
                  </div>
                  <div
                    title={`Month ${index + 1}: LKR ${Number(row?.revenue || 0).toLocaleString()}`}
                    style={{ height: `${height}%` }}
                    className="min-h-1 rounded-t bg-emerald-500"
                  />
                  <span className="mt-1 text-[10px] text-slate-500">
                    {new Date(2000, index).toLocaleString('en', { month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-bold text-slate-900">Sales by vehicle category</h2>
          {categories.length ? (
            <div className="space-y-3">
              {categories.map(row => {
                const max = Math.max(1, ...categories.map(item => Number(item.revenue || 0)));
                return (
                  <div key={row._id}>
                    <div className="mb-1 flex justify-between text-xs text-slate-700">
                      <span className="font-semibold">{row._id}</span>
                      <span>{row.salesCount} units · LKR {Number(row.revenue).toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded bg-slate-100">
                      <div
                        className="h-2 rounded bg-blue-500"
                        style={{ width: `${Math.max(2, (Number(row.revenue || 0) / max) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No sales categories recorded yet.</p>
          )}
        </div>
      </section>

      {/* ── Lead conversion ── */}
      {leadConversion && (
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Inquiry Pipeline &amp; Conversion</h2>
            <span className="text-sm font-bold text-blue-700">
              {leadConversion.conversionRate}% converted · {leadConversion.converted}/{leadConversion.total}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {leadConversion.statuses.map((row: any) => (
              <div key={row._id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <span>{row._id || 'Unspecified'}</span>
                <div className="font-bold text-slate-900">{row.count}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Branch performance table ── */}
      <section className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-slate-900">Branch performance &amp; profit/loss</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => exportPdf('Branch Performance', 'branch-performance.pdf', branchColumns, branches)} disabled={!branches.length} className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-white"><FileDown className="w-3.5 h-3.5" /><span>PDF</span></button>
            <button onClick={() => exportExcel('branch-performance.xlsx', branchColumns, branches)} disabled={!branches.length} className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3 py-1.5 text-xs font-semibold text-white"><FileSpreadsheet className="w-3.5 h-3.5" /><span>Excel</span></button>
            <button onClick={() => exportRows('branch-performance.csv', branches)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-700">CSV</button>
          </div>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="p-2">Branch</th>
              <th className="p-2">Sales</th>
              <th className="p-2">Revenue</th>
              <th className="p-2">Vehicle cost</th>
              <th className="p-2">Gross profit</th>
              <th className="p-2">Expenses</th>
              <th className="p-2">Net profit</th>
            </tr>
          </thead>
          <tbody className="text-slate-900">
            {branches.length ? branches.map((row) => (
              <tr key={row.branchId} className="border-b">
                <td className="p-2 font-semibold">{row.branchName}</td>
                <td className="p-2">{row.salesCount}</td>
                {['revenue','costOfGoods','grossProfit','operatingExpenses','netProfit'].map((key) => (
                  <td className="p-2" key={key}>LKR {Number(row[key]).toLocaleString()}</td>
                ))}
              </tr>
            )) : (
              <tr><td colSpan={7} className="p-4 text-center text-slate-500">No branch activity recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* ── Report cards with PDF / Excel / CSV ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Revenue &amp; Sales Report</h3>
              <p className="text-[11px] text-slate-500">Detailed month-by-month performance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportPdf('Monthly Revenue & Sales', 'monthly-sales.pdf', monthlyColumns, monthly)} disabled={!monthly.length} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg"><FileDown className="w-3.5 h-3.5" /><span>PDF</span></button>
            <button onClick={() => exportExcel('monthly-sales.xlsx', monthlyColumns, monthly)} disabled={!monthly.length} className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg"><FileSpreadsheet className="w-3.5 h-3.5" /><span>Excel</span></button>
            <button onClick={() => exportRows('monthly-sales.csv', monthly)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">CSV</button>
          </div>
        </div>

        {/* Aging Stock */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Inventory Aging Stock Report</h3>
              <p className="text-[11px] text-slate-500">0-30, 31-60, 61-90, 90+ days duration</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportPdf('Inventory Aging Stock', 'aging-stock.pdf', agingColumns, aging)} disabled={!aging.length} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg"><FileDown className="w-3.5 h-3.5" /><span>PDF</span></button>
            <button onClick={() => exportExcel('aging-stock.xlsx', agingColumns, aging)} disabled={!aging.length} className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg"><FileSpreadsheet className="w-3.5 h-3.5" /><span>Excel</span></button>
            <button onClick={() => exportRows('aging-stock.csv', aging)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">CSV</button>
          </div>
        </div>

        {/* Profit & Loss */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center"><DollarSign className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Profit &amp; Loss Financial Report</h3>
              <p className="text-[11px] text-slate-500">Gross profit, operating expenses &amp; net profit</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportPdf('Profit & Loss', 'profit-loss.pdf', summaryColumns, summaryRows)} disabled={!profitLoss} className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg"><FileDown className="w-3.5 h-3.5" /><span>PDF</span></button>
            <button onClick={() => exportExcel('profit-loss.xlsx', summaryColumns, summaryRows)} disabled={!profitLoss} className="flex-1 flex items-center justify-center gap-1 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg"><FileSpreadsheet className="w-3.5 h-3.5" /><span>Excel</span></button>
            <button onClick={() => exportRows('profit-loss.csv', profitLoss ? [profitLoss] : [])} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">CSV</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
