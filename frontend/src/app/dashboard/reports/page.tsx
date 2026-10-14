"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, Download, TrendingUp, DollarSign, PieChart, Users } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [aging, setAging] = useState<any[]>([]);
  const [profitLoss, setProfitLoss] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [leadConversion, setLeadConversion] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const reports = [
      ['summary', '/reports/summary'],
      ['monthly', '/reports/sales-by-month'],
      ['aging', '/reports/aging-stock'],
      ['profitLoss', '/reports/profit-loss'],
      ['branches', '/reports/by-branch'],
      ['categories', '/reports/sales-by-category'],
      ['leadConversion', '/reports/lead-conversion'],
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
      });
      if (failed.length) setError(`Some reports could not be loaded: ${failed.join(', ')}`);
    });
  }, []);

  const exportCsv = () => {
    if (!summary) return;
    const rows = [['Metric', 'Value'], ['Sales', summary.salesCount], ['Revenue', summary.revenue], ['Payments collected', summary.paymentsCollected], ['Outstanding', summary.outstanding], ['Expenses', summary.expenses], ['Net after expenses', summary.netAfterExpenses], ...Object.entries(summary.inventory || {}).map(([status, count]) => [`Inventory: ${status}`, count])];
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

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Reports & Business Analytics</h1>
          <p className="text-xs text-slate-500">Comprehensive sales performance, aging stock, profit & loss, cash flow, and lead conversion reports</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => exportAccounting('quickbooks')} className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs">
            <Download className="w-4 h-4" />
            <span>QuickBooks Export</span>
          </button>
          <button onClick={() => exportAccounting('xero')} className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs">
            <Download className="w-4 h-4" />
            <span>Xero Export</span>
          </button>
          <button onClick={exportCsv} disabled={!summary} className="flex items-center gap-1.5 bg-slate-900 text-white font-semibold text-xs px-3.5 py-2 rounded-lg disabled:opacity-50">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {summary && <section className="mb-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {[['Sales', summary.salesCount], ['Revenue', summary.revenue], ['Collected', summary.paymentsCollected], ['Outstanding', summary.outstanding], ['Expenses', summary.expenses], ['Net after expenses', summary.netAfterExpenses]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-900">{typeof value === 'number' && label !== 'Sales' ? `LKR ${value.toLocaleString()}` : value}</p></div>)}
      </section>}
      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-slate-900">Monthly revenue trend</h2><span className="text-xs text-slate-500">{new Date().getFullYear()}</span></div><div className="flex h-48 items-end gap-2 border-b border-l px-2">{Array.from({ length: 12 }, (_, index) => { const row = monthly.find(item => item._id === index + 1); const max = Math.max(1, ...monthly.map(item => Number(item.revenue || 0))); const height = Math.max(3, (Number(row?.revenue || 0) / max) * 100); return <div key={index} className="group flex h-full flex-1 flex-col justify-end text-center"><div className="mb-1 truncate text-[9px] text-slate-500 opacity-0 group-hover:opacity-100">{row ? `LKR ${Number(row.revenue).toLocaleString()}` : '0'}</div><div title={`Month ${index + 1}: LKR ${Number(row?.revenue || 0).toLocaleString()}`} style={{ height: `${height}%` }} className="min-h-1 rounded-t bg-emerald-500"/><span className="mt-1 text-[10px] text-slate-500">{new Date(2000, index).toLocaleString('en', { month: 'short' })}</span></div> })}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-4 font-bold text-slate-900">Sales by vehicle category</h2>{categories.length ? <div className="space-y-3">{categories.map(row => { const max = Math.max(1, ...categories.map(item => Number(item.revenue || 0))); return <div key={row._id}><div className="mb-1 flex justify-between text-xs text-slate-700"><span className="font-semibold">{row._id}</span><span>{row.salesCount} · LKR {Number(row.revenue).toLocaleString()}</span></div><div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-blue-500" style={{ width: `${Math.max(2, (Number(row.revenue || 0) / max) * 100)}%` }}/></div></div> })}</div> : <p className="text-sm text-slate-500">No sales categories recorded yet.</p>}</div>
      </section>
      {leadConversion && <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-slate-900">Lead pipeline conversion</h2><span className="text-sm font-bold text-blue-700">{leadConversion.conversionRate}% converted · {leadConversion.converted}/{leadConversion.total}</span></div><div className="grid grid-cols-2 gap-2 md:grid-cols-4">{leadConversion.statuses.map((row: any) => <div key={row._id} className="rounded-lg bg-slate-50 p-3 text-sm"><span>{row._id || 'Unspecified'}</span><div className="font-bold text-slate-900">{row.count}</div></div>)}</div></section>}

      <section className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-slate-900">Branch performance & profit/loss</h2><button onClick={() => exportRows('branch-performance.csv', branches)} className="rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700">Export CSV</button></div><table className="w-full text-left text-xs"><thead><tr className="border-b text-slate-500"><th className="p-2">Branch</th><th className="p-2">Sales</th><th className="p-2">Revenue</th><th className="p-2">Vehicle cost</th><th className="p-2">Gross profit</th><th className="p-2">Expenses</th><th className="p-2">Net profit</th></tr></thead><tbody className="text-slate-900">{branches.length ? branches.map((row) => <tr key={row.branchId} className="border-b"><td className="p-2 font-semibold">{row.branchName}</td><td className="p-2">{row.salesCount}</td>{['revenue','costOfGoods','grossProfit','operatingExpenses','netProfit'].map((key) => <td className="p-2" key={key}>LKR {Number(row[key]).toLocaleString()}</td>)}</tr>) : <tr><td colSpan={7} className="p-4 text-center text-slate-500">No branch activity recorded yet.</td></tr>}</tbody></table></section>

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
          <button onClick={() => exportRows('monthly-sales.csv', monthly)} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">
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
          <button onClick={() => exportRows('aging-stock.csv', aging)} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">
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
          <button onClick={() => exportRows('profit-loss.csv', profitLoss ? [profitLoss] : [])} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200">
            Generate Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
