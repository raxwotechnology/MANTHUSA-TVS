"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { formatLKR } from '@/lib/publicApi';
import { exportPdf, exportExcel } from '@/lib/exportUtils';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(getApiUrl('/reservations/my'), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Stock Allocations & Reservations
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            My TVS Motorcycle Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Confirmed motorcycle bookings, assigned showroom branches, and reservation deposit status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const cols = [
                { label: 'Booking #', value: (r: any) => r.reservationId || r._id },
                { label: 'Vehicle', value: (r: any) => r.vehicle?.make ? `${r.vehicle.make} ${r.vehicle.model}` : r.vehicleName || '—' },
                { label: 'Branch', value: (r: any) => r.branch?.name || r.branchName || '—' },
                { label: 'Deposit (LKR)', value: (r: any) => r.depositAmount || 0 },
                { label: 'Expiry Date', value: (r: any) => r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : '—' },
                { label: 'Status', value: (r: any) => r.status || 'Confirmed' },
              ];
              exportPdf('My Bookings & Reservations', 'my-bookings.pdf', cols, bookings);
            }}
            disabled={!bookings.length}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => {
              const cols = [
                { label: 'Booking #', value: (r: any) => r.reservationId || r._id },
                { label: 'Vehicle', value: (r: any) => r.vehicle?.make ? `${r.vehicle.make} ${r.vehicle.model}` : r.vehicleName || '—' },
                { label: 'Branch', value: (r: any) => r.branch?.name || r.branchName || '—' },
                { label: 'Deposit (LKR)', value: (r: any) => r.depositAmount || 0 },
                { label: 'Expiry Date', value: (r: any) => r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : '—' },
                { label: 'Status', value: (r: any) => r.status || 'Confirmed' },
              ];
              exportExcel('my-bookings.xlsx', cols, bookings);
            }}
            disabled={!bookings.length}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <Link
            href="/configure"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span>Configure Bike</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Active Bookings</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently do not have any confirmed TVS motorcycle reservations. Once your request is verified by staff, your booking will appear here.
          </p>
          <Link
            href="/configure"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
          >
            <span>Book a TVS Bike</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((bk) => (
            <div
              key={bk._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-red-400">
                    {bk.bookingNumber || bk.reservationId || `BK-${bk._id.slice(-6)}`}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Booked on {new Date(bk.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                    bk.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {bk.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Motorcycle Model</div>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {bk.modelName || bk.vehicle?.model || 'TVS Motorcycle'}
                  </div>
                  <div className="text-slate-400">
                    {bk.variantName || bk.vehicle?.variant || 'Standard'} • Color: {bk.selectedColor || 'Factory Color'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Showroom Branch</div>
                  <div className="font-bold text-white mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{bk.branchName || bk.branch?.name || 'Colombo Flagship Hub'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Reservation Deposit</div>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">
                    {formatLKR(bk.reservationDeposit)}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Holding Expiry Date</div>
                  <div className="font-bold text-amber-400 mt-0.5">
                    {bk.expiryDate ? new Date(bk.expiryDate).toLocaleDateString() : '7 Days'}
                  </div>
                </div>
              </div>

              {bk.notes && (
                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-slate-300">Staff Notes: </strong>
                  {bk.notes}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                <span className="text-slate-400">
                  Unit reserved exclusively for you at the dealership.
                </span>
                <Link
                  href="/account/quotations"
                  className="font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Check Linked Quotations</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
