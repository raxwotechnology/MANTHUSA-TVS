"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Clock,
  Printer,
  Receipt,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { formatLKR } from '@/lib/publicApi';

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(getApiUrl('/payments/my'), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Financial Ledger & Receipts
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            My Payment Receipts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified deposit payments, bank transfers, and official dealership payment receipts.
          </p>
        </div>

        <Link
          href="/account/invoices"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto border border-slate-700"
        >
          <Receipt className="w-3.5 h-3.5 text-red-400" />
          <span>View Invoices</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your payment history...</div>
      ) : payments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Payments Recorded Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You do not have any recorded payment receipts. When you make an advance deposit or settle an invoice, your receipts will be tracked here.
          </p>
          <Link
            href="/account/invoices"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
          >
            <span>Check Invoices</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((pay) => (
            <div
              key={pay._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-red-400">
                    {pay.receiptNumber || `RCP-${pay._id.slice(-6)}`}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(pay.paymentDate || pay.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                  {pay.status || 'Completed'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 text-[11px]">Payment Amount</div>
                  <div className="font-black text-emerald-400 text-base mt-0.5">
                    {formatLKR(pay.amount)}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Payment Method</div>
                  <div className="font-bold text-white mt-0.5">
                    {pay.paymentMethod || 'Bank Transfer'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Reference / Transaction ID</div>
                  <div className="font-mono text-slate-300 mt-0.5">
                    {pay.referenceNumber || 'N/A'}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px]">Associated Invoice</div>
                  <div className="font-bold text-red-400 mt-0.5">
                    {pay.sale?.invoiceNumber || 'Dealership Invoice'}
                  </div>
                </div>
              </div>

              {pay.notes && (
                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-slate-300">Transaction Notes: </strong>
                  {pay.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
