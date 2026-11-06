'use client';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import { FileDown, FileSpreadsheet, Search } from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';

type Hit = { type: string; title: string; detail: string; id: string; href: string; date?: string; };

export default function GlobalSearchPage() {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('q') || '';
    setQuery(value);
    if (!value.trim()) return;
    const needle = value.trim().toLowerCase();
    const searches = [
      ['Vehicle', '/vehicles'],
      ['Customer', '/customers'],
      ['Sale', '/sales'],
      ['Quotation', '/quotations'],
      ['Lead', '/leads'],
    ] as const;

    Promise.allSettled(
      searches.map(async ([type, path]) => {
        const response = await apiFetch(path);
        if (!response.ok) return [] as Hit[];
        const rows = await response.json();
        return rows
          .filter((row: any) => JSON.stringify(row).toLowerCase().includes(needle))
          .slice(0, 20)
          .map((row: any) => ({
            type,
            id: row._id,
            title:
              type === 'Vehicle'
                ? `${row.make || ''} ${row.model || ''} ${row.year || ''}`
                : type === 'Customer'
                ? row.fullName || 'Customer'
                : type === 'Sale'
                ? row.invoiceNumber
                : type === 'Quotation'
                ? row.quotationNumber
                : row.leadId || 'Lead',
            detail:
              type === 'Vehicle'
                ? `Stock ${row.stockNumber || 'â€”'} Â· Reg ${row.registrationNumber || 'â€”'} Â· Chassis ${row.chassisNumber || 'â€”'} Â· ${row.status}`
                : type === 'Customer'
                ? `${row.phone || ''} Â· ${row.email || ''}`
                : type === 'Sale'
                ? `${row.customer?.fullName || ''} Â· ${row.vehicle?.make || ''} ${row.vehicle?.model || ''} Â· LKR ${Number(row.finalAmount || 0).toLocaleString()}`
                : type === 'Quotation'
                ? `${row.customer?.fullName || ''} Â· ${row.vehicle?.make || ''} ${row.vehicle?.model || ''} Â· LKR ${Number(row.totalAmount || 0).toLocaleString()}`
                : `${row.customer?.fullName || ''} Â· ${row.source || ''} Â· ${row.status || ''}`,
            date: row.createdAt || row.saleDate || row.bookingDate || row.date,
            href:
              type === 'Vehicle'
                ? '/dashboard/vehicles'
                : type === 'Customer'
                ? '/dashboard/customers'
                : type === 'Sale'
                ? '/dashboard/sales'
                : type === 'Quotation'
                ? '/dashboard/quotations'
                : '/dashboard/leads',
          } as Hit));
      })
    )
      .then((results) => {
        const found = results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
        setHits(found);
        if (results.every((result) => result.status === 'rejected')) setError('Search could not reach the API.');
      })
      .catch(() => setError('Search could not reach the API.'));
  }, []);

  const filteredHits = hits.filter((hit) => {
    if (!isWithinDateRange(hit.date, startDate, endDate)) return false;
    return true;
  });

  const searchColumns = [
    { label: 'Type', value: (r: any) => r.type },
    { label: 'Title', value: (r: any) => r.title },
    { label: 'Details', value: (r: any) => r.detail },
    { label: 'Record ID', value: (r: any) => r.id },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Global Search</h1>
          <p className="text-sm text-slate-500">
            Results for &ldquo;{query}&rdquo; across vehicles, customers, sales, quotations and leads.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportPdf(`Search Results - ${query}`, 'search-results.pdf', searchColumns, filteredHits)}
            disabled={!filteredHits.length}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => exportExcel('search-results.xlsx', searchColumns, filteredHits)}
            disabled={!filteredHits.length}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar with Date Filter */}
      <div className="mb-6 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                window.location.search = `?q=${encodeURIComponent(query.trim())}`;
              }
            }}
            className="relative w-full sm:w-80"
          >
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search across entire system..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 placeholder:text-slate-400"
            />
          </form>

          <DateFilterControl
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            label="Filter by Date:"
          />
        </div>
      </div>

      {error && <div role="alert" className="mb-4 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      <div className="space-y-2">
        {filteredHits.map((hit) => (
          <a key={`${hit.type}-${hit.id}`} href={hit.href} className="block rounded-xl border bg-white p-4 hover:border-emerald-300">
            <div className="flex items-center justify-between">
              <strong>{hit.title}</strong>
              <span className="rounded bg-slate-100 px-2 py-1 text-[10px]">{hit.type}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{hit.detail}</p>
            <p className="mt-1 font-mono text-[10px] text-slate-400">{hit.id}</p>
          </a>
        ))}
        {query && filteredHits.length === 0 && !error && (
          <p className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">No matching records found for the query and date range.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
