"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  MapPin,
  Check,
  X,
  Printer,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';
import { formatLKR } from '@/lib/publicApi';
import { exportPdf, exportExcel } from '@/lib/exportUtils';

export default function MyQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Selected quotation for printable modal
  const [printQuote, setPrintQuote] = useState<any | null>(null);

  const fetchQuotes = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(getApiUrl('/quotations/my'), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setQuotations(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleAccept = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setActionLoading(id);
    setActionMessage(null);

    try {
      const res = await fetch(getApiUrl(`/quotations/${id}/accept`), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Could not accept quotation.');
      setActionMessage({ text: 'Quotation accepted successfully! Dealership will now issue your invoice.', type: 'success' });
      fetchQuotes();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error accepting quotation.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please enter your reason for rejecting or requesting changes:');
    if (reason === null) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setActionLoading(id);
    setActionMessage(null);

    try {
      const res = await fetch(getApiUrl(`/quotations/${id}/reject`), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Could not reject quotation.');
      setActionMessage({ text: 'Quotation rejected. Sales staff will review your feedback.', type: 'success' });
      fetchQuotes();
    } catch (err: any) {
      setActionMessage({ text: err.message || 'Error rejecting quotation.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
            Official Dealership Proposals
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            My TVS Quotations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review your customized price estimates, official warranties, and click &quot;Accept&quot; to authorize invoice generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const cols = [
                { label: 'Quotation #', value: (r: any) => r.quotationNumber },
                { label: 'Vehicle', value: (r: any) => r.vehicle?.make ? `${r.vehicle.make} ${r.vehicle.model}` : r.vehicleName || '—' },
                { label: 'Date', value: (r: any) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
                { label: 'Total Amount (LKR)', value: (r: any) => r.totalAmount || 0 },
                { label: 'Status', value: (r: any) => r.status || 'Draft' },
              ];
              exportPdf('My Quotations', 'my-quotations.pdf', cols, quotations);
            }}
            disabled={!quotations.length}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => {
              const cols = [
                { label: 'Quotation #', value: (r: any) => r.quotationNumber },
                { label: 'Vehicle', value: (r: any) => r.vehicle?.make ? `${r.vehicle.make} ${r.vehicle.model}` : r.vehicleName || '—' },
                { label: 'Date', value: (r: any) => r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—' },
                { label: 'Total Amount (LKR)', value: (r: any) => r.totalAmount || 0 },
                { label: 'Status', value: (r: any) => r.status || 'Draft' },
              ];
              exportExcel('my-quotations.xlsx', cols, quotations);
            }}
            disabled={!quotations.length}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
          }`}
        >
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading your quotations...</div>
      ) : quotations.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Quotations Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You do not have any active quotations. Submit a request from our bike catalog to receive an official proposal.
          </p>
          <Link
            href="/bikes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
          >
            <span>Explore Bikes</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {quotations.map((qt) => {
            const isPendingApproval = qt.status === 'Sent';
            const isAccepted = qt.status === 'Accepted';
            const isConverted = qt.status === 'Converted to Invoice';

            return (
              <div
                key={qt._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 hover:border-slate-700 transition-colors shadow-lg"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-red-400">
                        {qt.quotationNumber}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-400">
                        Valid until: {new Date(qt.validUntil || Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-white mt-1">
                      {qt.modelName || qt.vehicle?.model || 'TVS Motorcycle'}
                      <span className="text-xs text-slate-400 font-normal ml-2">
                        {qt.variantName || qt.vehicle?.variant || 'Standard'} ({qt.selectedColor || 'Factory Color'})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isConverted
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : isAccepted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : isPendingApproval
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {qt.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => setPrintQuote(qt)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Print / View PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown Table */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px]">Base Vehicle Price</span>
                    <div className="font-bold text-white text-sm mt-0.5">{formatLKR(qt.vehiclePrice)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Dealership Discount</span>
                    <div className="font-bold text-emerald-400 text-sm mt-0.5">-{formatLKR(qt.discount || 0)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Registration & Insurance</span>
                    <div className="font-bold text-white text-sm mt-0.5">
                      {formatLKR((qt.registrationFee || 0) + (qt.insuranceFee || 0))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Final Payable Amount</span>
                    <div className="font-black text-red-400 text-base mt-0.5">{formatLKR(qt.totalAmount)}</div>
                  </div>
                </div>

                {/* Terms */}
                {qt.termsAndConditions && (
                  <div className="text-xs text-slate-400 whitespace-pre-line bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                    <strong className="text-slate-300">Warranty & Terms: </strong>
                    {qt.termsAndConditions}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                  <div className="text-xs text-slate-400">
                    {isConverted ? (
                      <span className="text-blue-400 font-semibold">
                        Converted to official Invoice! Check My Invoices tab.
                      </span>
                    ) : isAccepted ? (
                      <span className="text-emerald-400 font-semibold">
                        ✓ Accepted by customer on {new Date(qt.acceptedAt).toLocaleDateString()}. Dealership processing invoice.
                      </span>
                    ) : (
                      <span>Please review the proposal above and accept if terms are agreeable.</span>
                    )}
                  </div>

                  {isPendingApproval && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReject(qt._id)}
                        disabled={actionLoading === qt._id}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Request Changes / Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(qt._id)}
                        disabled={actionLoading === qt._id}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/30 transition-all hover:scale-102"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Quotation</span>
                      </button>
                    </div>
                  )}

                  {isConverted && (
                    <Link
                      href="/account/invoices"
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      <span>Go to Invoices</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRINTABLE QUOTATION MODAL */}
      {printQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Print Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-red-600">MANTHUSA TVS</h2>
                <p className="text-xs text-slate-500">Official TVS Dealership Sales Quotation</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold font-mono">{printQuote.quotationNumber}</div>
                <div className="text-xs text-slate-500">{new Date(printQuote.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Motorcycle & Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs border-b pb-4">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Motorcycle Model</span>
                <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                  {printQuote.modelName || printQuote.vehicle?.model}
                </div>
                <div className="text-slate-600">
                  Variant: {printQuote.variantName || 'Standard'} • Color: {printQuote.selectedColor || 'Factory Color'}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px]">Dealership Branch</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {printQuote.branchName || printQuote.branch?.name || 'Colombo Central Flagship Hub'}
                </div>
                <div className="text-slate-600">Warranty: 5 Years / 70,000 km</div>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-left text-slate-500">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-right">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                <tr>
                  <td className="py-2">Base Vehicle Price ({printQuote.modelName})</td>
                  <td className="py-2 text-right font-semibold">{formatLKR(printQuote.vehiclePrice)}</td>
                </tr>
                {printQuote.discount > 0 && (
                  <tr>
                    <td className="py-2 text-emerald-600">Promotional Dealership Discount</td>
                    <td className="py-2 text-right font-semibold text-emerald-600">-{formatLKR(printQuote.discount)}</td>
                  </tr>
                )}
                {printQuote.registrationFee > 0 && (
                  <tr>
                    <td className="py-2">Motor Vehicle RMV Registration</td>
                    <td className="py-2 text-right font-semibold">{formatLKR(printQuote.registrationFee)}</td>
                  </tr>
                )}
                {printQuote.insuranceFee > 0 && (
                  <tr>
                    <td className="py-2">1-Year Comprehensive Motorcycle Insurance</td>
                    <td className="py-2 text-right font-semibold">{formatLKR(printQuote.insuranceFee)}</td>
                  </tr>
                )}
                {printQuote.otherCharges > 0 && (
                  <tr>
                    <td className="py-2">Accessories & Document Processing</td>
                    <td className="py-2 text-right font-semibold">{formatLKR(printQuote.otherCharges)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 font-black text-sm">
                  <td className="py-3">TOTAL PAYABLE AMOUNT</td>
                  <td className="py-3 text-right text-red-600">{formatLKR(printQuote.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Terms */}
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 border space-y-1">
              <strong className="text-slate-800">Terms & Conditions:</strong>
              <p className="whitespace-pre-line">{printQuote.termsAndConditions}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPrintQuote(null)}
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
                <span>Print Quotation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
