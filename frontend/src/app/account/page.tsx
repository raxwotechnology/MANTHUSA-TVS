"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  FileQuestion,
  Calendar,
  Heart,
  User,
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  FileText,
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { formatLKR } from '@/lib/publicApi';

export default function AccountOverviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    Promise.all([
      fetch(getApiUrl('/customers/me'), { headers }).then((res) => (res.ok ? res.json() : null)),
      fetch(getApiUrl('/leads/my'), { headers }).then((res) => (res.ok ? res.json() : [])),
      fetch(getApiUrl('/reservations/my'), { headers }).then((res) => (res.ok ? res.json() : [])),
      fetch(getApiUrl('/quotations/my'), { headers }).then((res) => (res.ok ? res.json() : [])),
      fetch(getApiUrl('/sales/my'), { headers }).then((res) => (res.ok ? res.json() : [])),
      fetch(getApiUrl('/payments/my'), { headers }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([profData, reqData, bkData, qtData, invData, payData]) => {
        setProfile(profData);
        setRequests(Array.isArray(reqData) ? reqData : []);
        setBookings(Array.isArray(bkData) ? bkData : []);
        setQuotations(Array.isArray(qtData) ? qtData : []);
        setInvoices(Array.isArray(invData) ? invData : []);
        setPayments(Array.isArray(payData) ? payData : []);
      })
      .catch((err) => console.error('Error fetching customer portal data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Determine current live progress step across customer's most recent order
  const latestRequest = requests[0];
  const latestBooking = bookings[0];
  const latestQuotation = quotations[0];
  const latestInvoice = invoices[0];

  const getWorkflowStep = () => {
    if (!latestRequest && !latestBooking && !latestQuotation && !latestInvoice) return 1;
    if (latestInvoice) {
      if (latestInvoice.deliveryStatus === 'Delivered') return 12;
      if (latestInvoice.deliveryStatus === 'Ready for Delivery') return 10;
      if (latestInvoice.status === 'Paid in Full') return 10;
      if (latestInvoice.paidAmount > 0) return 9;
      return 8; // Invoice generated
    }
    if (latestQuotation) {
      if (latestQuotation.status === 'Converted to Invoice') return 8;
      if (latestQuotation.status === 'Accepted') return 7;
      return 6; // Waiting for customer approval
    }
    if (latestBooking) {
      return 4; // Booking created
    }
    if (latestRequest) {
      if (latestRequest.status === 'Converted to Booking') return 4;
      if (latestRequest.status === 'Under Review' || latestRequest.status === 'Availability Checked') return 3;
      return 1;
    }
    return 1;
  };

  const currentStep = getWorkflowStep();

  const workflowSteps = [
    { num: 1, title: 'Request Submitted' },
    { num: 2, title: 'Under Review' },
    { num: 3, title: 'Stock Verified' },
    { num: 4, title: 'Booking Created' },
    { num: 5, title: 'Quotation Ready' },
    { num: 6, title: 'Customer Approval' },
    { num: 7, title: 'Quotation Accepted' },
    { num: 8, title: 'Invoice Issued' },
    { num: 9, title: 'Payment Processing' },
    { num: 10, title: 'Ready for Delivery' },
    { num: 11, title: 'Handover & PDI' },
    { num: 12, title: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600/20 via-slate-900 to-slate-950 rounded-3xl border border-red-500/30 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
              <Flame className="w-3.5 h-3.5 fill-red-500" />
              <span>TVS Motorcycle Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome, {profile?.fullName || 'TVS Motorcycle Enthusiast'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Track your motorcycle booking requests, view official quotations, review invoices, and follow live delivery status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/configure"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Book Another Bike</span>
            </Link>
          </div>
        </div>
      </div>

      {/* LIVE PROGRESS TIMELINE TRACKER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Live Order Progress
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              TVS Motorcycle Sales & Delivery Tracker
            </h2>
          </div>
          <div className="text-xs text-slate-400">
            Step <strong className="text-white">{currentStep}</strong> of 12
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {workflowSteps.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div
                key={st.num}
                className={`p-3 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-red-500 bg-red-600/10 shadow-md ring-1 ring-red-500/40'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border ${
                    isCurrent
                      ? 'bg-red-600 text-white border-red-500'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'border-slate-700 text-slate-500'
                  }`}>
                    {isCompleted ? '✓' : st.num}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 animate-pulse">
                      Active
                    </span>
                  )}
                </div>
                <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : ''}`}>
                  {st.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Requests */}
        <Link
          href="/account/requests"
          className="bg-slate-900 hover:bg-slate-800/80 p-5 rounded-2xl border border-slate-800 transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Motorcycle Requests</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{requests.length}</span>
            <span className="text-xs text-red-400 font-semibold">Submissions</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 group-hover:text-slate-300">
            <span>View requests</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Bookings */}
        <Link
          href="/account/bookings"
          className="bg-slate-900 hover:bg-slate-800/80 p-5 rounded-2xl border border-slate-800 transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Confirmed Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{bookings.length}</span>
            <span className="text-xs text-amber-400 font-semibold">Allocations</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 group-hover:text-slate-300">
            <span>View bookings</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Quotations */}
        <Link
          href="/account/quotations"
          className="bg-slate-900 hover:bg-slate-800/80 p-5 rounded-2xl border border-slate-800 transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Official Quotations</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{quotations.length}</span>
            <span className="text-xs text-red-400 font-semibold">
              ({quotations.filter((q) => q.status === 'Sent').length} pending approval)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 group-hover:text-slate-300">
            <span>Review & Accept</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>

        {/* Invoices */}
        <Link
          href="/account/invoices"
          className="bg-slate-900 hover:bg-slate-800/80 p-5 rounded-2xl border border-slate-800 transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Invoices & Delivery</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{invoices.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">Orders</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 group-hover:text-slate-300">
            <span>View invoices & balance</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
      </div>

      {/* PENDING ACTIONS (e.g. Quotation awaiting approval) */}
      {quotations.filter((q) => q.status === 'Sent').length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                You have a TVS motorcycle quotation awaiting approval!
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review your pricing breakdown, warranty terms, and click &quot;Accept Quotation&quot; to issue your official invoice.
              </p>
            </div>
          </div>
          <Link
            href="/account/quotations"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md"
          >
            Review Quotation
          </Link>
        </div>
      )}
    </div>
  );
}
