"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileQuestion,
  Car,
  Clock,
  ArrowRight,
  PlusCircle,
  Tag,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { exportPdf, exportExcel } from '@/lib/exportUtils';

export default function CustomerInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(getApiUrl('/leads/my'), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setInquiries(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Contacted':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Interested':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Quotation':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Reserved':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 customer-account-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-amber-400" />
            My Inquiries & Price Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track inquiries submitted through our website and view real-time status updates from our sales team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const cols = [
                { label: 'Vehicle', value: (r: any) => r.vehicle?.make ? `${r.vehicle.make} ${r.vehicle.model}` : r.vehicleInterest || '—' },
                { label: 'Date', value: (r: any) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
                { label: 'Source', value: (r: any) => r.source || 'Website' },
                { label: 'Notes', value: (r: any) => r.notes || '—' },
                { label: 'Status', value: (r: any) => r.status || 'New' }
              ];
              exportPdf('My Inquiries', 'my-inquiries.pdf', cols, inquiries);
            }}
            disabled={!inquiries.length}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => {
              const cols = [
                { label: 'Vehicle', value: (r: any) => r.vehicle?.make ? `${r.vehicle.make} ${r.vehicle.model}` : r.vehicleInterest || '—' },
                { label: 'Date', value: (r: any) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
                { label: 'Source', value: (r: any) => r.source || 'Website' },
                { label: 'Notes', value: (r: any) => r.notes || '—' },
                { label: 'Status', value: (r: any) => r.status || 'New' }
              ];
              exportExcel('my-inquiries.xlsx', cols, inquiries);
            }}
            disabled={!inquiries.length}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
          <Link
            href="/inquiry"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Inquiry</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading your inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No inquiries found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't submitted any vehicle inquiries yet. Browse our inventory to request pricing or finance details.
          </p>
          <Link
            href="/vehicles"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Car className="w-4 h-4 text-amber-400" />
            <span>Browse Showroom Vehicles</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => {
            const vehicle = inquiry.interestedVehicle;
            return (
              <div
                key={inquiry._id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">
                      {vehicle
                        ? `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`
                        : inquiry.inquiryType || 'General Dealership Inquiry'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        inquiry.status || 'New'
                      )}`}
                    >
                      {inquiry.status || 'New'}
                    </span>
                  </div>

                  {inquiry.inquiryMessage && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      "{inquiry.inquiryMessage}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Submitted on: {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                    {vehicle?.sellingPrice && (
                      <span className="text-amber-400 font-semibold">
                        Vehicle Listed Price: Rs. {Number(vehicle.sellingPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {vehicle?._id && (
                  <Link
                    href={`/vehicles/${vehicle._id}`}
                    className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-amber-400 border border-slate-800 transition-colors whitespace-nowrap"
                  >
                    <span>View Vehicle Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
