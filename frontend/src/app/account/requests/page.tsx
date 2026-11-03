"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileQuestion,
  Clock,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { formatLKR } from '@/lib/publicApi';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
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
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Customer Inquiries & Requests
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            My TVS Motorcycle Requests
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track status, branch assignments, and booking conversions for your submitted motorcycle requests.
          </p>
        </div>

        <Link
          href="/configure"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>New Request</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Requests Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You have not submitted any TVS motorcycle requests. Use our online configurator to choose your bike and branch.
          </p>
          <Link
            href="/configure"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
          >
            <span>Configure a Bike Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-red-400">
                    {req.leadId || `REQ-${req._id.slice(-6)}`}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                    req.status === 'Converted to Booking'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Motorcycle & Variant</div>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {req.modelName || req.interestedVehicle?.model || 'TVS Motorcycle'}
                  </div>
                  <div className="text-slate-400">
                    {req.variantName || req.interestedVehicle?.variant || 'Standard'} • Color: {req.selectedColor || 'Factory Color'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Dealership Branch</div>
                  <div className="font-bold text-white mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{req.preferredBranchName || req.preferredBranch?.name || 'Colombo Flagship Hub'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Estimated Price</div>
                  <div className="font-black text-red-400 text-sm mt-0.5">
                    {formatLKR(req.budget || req.interestedVehicle?.sellingPrice)}
                  </div>
                </div>
              </div>

              {req.inquiryMessage && (
                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-slate-300">Notes: </strong>
                  {req.inquiryMessage}
                </div>
              )}

              {req.status === 'Converted to Booking' && (
                <div className="pt-1 flex items-center justify-between text-xs text-emerald-400 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Staff has confirmed this request into an official booking!</span>
                  </span>
                  <Link
                    href="/account/bookings"
                    className="font-bold underline text-white hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>View Booking</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
