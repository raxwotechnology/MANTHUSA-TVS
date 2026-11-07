"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Clock,
  MapPin,
  Printer,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { formatLKR } from '@/lib/publicApi';

export default function MyInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printInvoice, setPrintInvoice] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(getApiUrl('/sales/my'), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setInvoices(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Official Orders & Tax Invoices
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            My TVS Motorcycle Invoices
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View tax invoices, outstanding payment balances, and live pre-delivery inspection & handover progress.
          </p>
        </div>

        <Link
          href="/account/payments"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto border border-slate-700"
        >
          <CreditCard className="w-3.5 h-3.5 text-red-400" />
          <span>Payment History</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Invoices Issued Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Once you accept an official quotation, the dealership will issue your official motorcycle invoice here.
          </p>
          <Link
            href="/account/quotations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
          >
            <span>Review Quotations</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {invoices.map((inv) => {
            const isPaid = inv.balance === 0 || inv.status === 'Paid in Full';
            const isDelivered = inv.deliveryStatus === 'Delivered';

            return (
              <div
                key={inv._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-slate-700 transition-colors shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-red-400">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400">
                        Date: {new Date(inv.saleDate || inv.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-white mt-1">
                      {inv.modelName || inv.vehicle?.model || 'TVS Motorcycle'}
                      <span className="text-xs text-slate-400 font-normal ml-2">
                        {inv.variantName || inv.vehicle?.variant || 'Standard'} ({inv.selectedColor || 'Factory Color'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPrintInvoice(inv)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Print / View Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Total Invoice Value</span>
                    <div className="font-bold text-white text-sm mt-0.5">{formatLKR(inv.finalAmount)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Total Amount Paid</span>
                    <div className="font-bold text-emerald-400 text-sm mt-0.5">{formatLKR(inv.paidAmount)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Outstanding Balance</span>
                    <div className="font-black text-red-400 text-sm mt-0.5">{formatLKR(inv.balance)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Delivery Status</span>
                    <div className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-red-400" />
                      <span>{inv.deliveryStatus || 'Preparing Delivery'}</span>
                    </div>
                  </div>
                </div>

                {/* Dealership Details Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Pickup Showroom: <strong className="text-slate-200">{inv.branchName || inv.branch?.name || 'Colombo Flagship Hub'}</strong></span>
                  </div>

                  {inv.salesContractNumber && (
                    <div className="font-mono text-[11px] text-slate-500">
                      Agreement Ref: {inv.salesContractNumber}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      {printInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-red-600">MANTHUSA TV</h2>
                <p className="text-xs text-slate-500">Official Dealership Commercial Invoice</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold font-mono">{printInvoice.invoiceNumber}</div>
                <div className="text-xs text-slate-500">{new Date(printInvoice.saleDate || printInvoice.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Motorcycle & Dealership Info */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b pb-4">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Purchased Motorcycle</span>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {printInvoice.modelName || printInvoice.vehicle?.model}
                </div>
                <div className="text-slate-600">
                  Variant: {printInvoice.variantName || 'Standard'} • Color: {printInvoice.selectedColor || 'Factory Color'}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Showroom Delivery Hub</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {printInvoice.branchName || printInvoice.branch?.name || 'Colombo Central Flagship Hub'}
                </div>
                <div className="text-slate-600">Payment Status: {printInvoice.status}</div>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                <tr>
                  <td className="py-2">Base Motorcycle Price</td>
                  <td className="py-2 text-right font-semibold">{formatLKR(printInvoice.vehiclePrice)}</td>
                </tr>
                {printInvoice.discount > 0 && (
                  <tr>
                    <td className="py-2 text-emerald-600">Discount Applied</td>
                    <td className="py-2 text-right font-semibold text-emerald-600">-{formatLKR(printInvoice.discount)}</td>
                  </tr>
                )}
                {printInvoice.registrationFee > 0 && (
                  <tr>
                    <td className="py-2">RMV Registration Fee</td>
                    <td className="py-2 text-right font-semibold">{formatLKR(printInvoice.registrationFee)}</td>
                  </tr>
                )}
                {printInvoice.insuranceFee > 0 && (
                  <tr>
                    <td className="py-2">Comprehensive Insurance</td>
                    <td className="py-2 text-right font-semibold">{formatLKR(printInvoice.insuranceFee)}</td>
                  </tr>
                )}
                {printInvoice.additionalCharges > 0 && (
                  <tr>
                    <td className="py-2">Accessories & Document Handling</td>
                    <td className="py-2 text-right font-semibold">{formatLKR(printInvoice.additionalCharges)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-300 font-bold">
                  <td className="py-2">TOTAL INVOICE AMOUNT</td>
                  <td className="py-2 text-right text-slate-900">{formatLKR(printInvoice.finalAmount)}</td>
                </tr>
                <tr className="border-t border-slate-200 text-emerald-600 font-bold">
                  <td className="py-2">AMOUNT SETTLED</td>
                  <td className="py-2 text-right">-{formatLKR(printInvoice.paidAmount)}</td>
                </tr>
                <tr className="border-t-2 border-slate-900 font-black text-sm">
                  <td className="py-2.5">REMAINING BALANCE DUE</td>
                  <td className="py-2.5 text-right text-red-600">{formatLKR(printInvoice.balance)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPrintInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
