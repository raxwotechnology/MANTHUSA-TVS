"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DollarSign, Plus, Printer, CheckCircle2, FileText, Search, X } from 'lucide-react';
import { useSettings } from '@/lib/useSettings';

interface Sale {
  _id: string;
  customerId?: string;
  vehicleId?: string;
  invoiceNumber: string;
  customerName: string;
  vehicleName: string;
  finalAmount: number;
  paidAmount: number;
  balance: number;
  saleStatus: string;
  saleDate: string;
}

export default function SalesPage() {
  const { settings: brand } = useSettings();
  const [sales, setSales] = useState<Sale[]>([]);
  const router = useRouter();

  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Sale | null>(null);

  const deleteInvoice = async () => {
    if (!deletingInvoice) return;
    const response = await apiFetch(`/sales/${deletingInvoice._id}`, { method: 'DELETE' });
    if (!response.ok) { window.alert('Could not delete invoice.'); return; }
    setSales((current) => current.filter((sale) => sale._id !== deletingInvoice._id));
    setDeletingInvoice(null);
  };

  useEffect(() => {
    apiFetch('/sales').then(async (response) => {
      if (!response.ok) throw new Error('Could not load sales.');
      const data = await response.json();
      setSales(data.map((sale: any) => ({
        _id: sale._id, invoiceNumber: sale.invoiceNumber, customerId: sale.customer?._id, vehicleId: sale.vehicle?._id,
        customerName: sale.customer?.fullName || '—',
        vehicleName: [sale.vehicle?.make, sale.vehicle?.model, sale.vehicle?.year].filter(Boolean).join(' '),
        finalAmount: Number(sale.finalAmount || 0), paidAmount: Number(sale.paidAmount || 0),
        balance: Number(sale.balance || 0), saleStatus: sale.status, saleDate: sale.saleDate,
      })));
    }).catch((error) => window.alert(error.message));
  }, []);

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sales & Tax Invoices</h1>
          <p className="text-xs text-slate-500">Record final deal confirmations, track paid balances, and print official invoices</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs cursor-pointer" onClick={() => router.push('/dashboard/sales/new')}>
          <Plus className="w-4 h-4" />
          <span>Create Sale Invoice</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Final Amount</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{s.invoiceNumber}</td>
                  <td className="py-3 px-4 text-slate-500">{s.saleDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{s.customerName}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{s.vehicleName}</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-600">{formatLKR(s.finalAmount)}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{formatLKR(s.paidAmount)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{s.saleStatus}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedInvoice(s)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-lg border flex items-center gap-1.5 mx-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Invoice</span>
                    </button>
                    <button onClick={() => router.push(`/dashboard/sales/new?id=${s._id}`)} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 cursor-pointer">Edit</button>
                    <button onClick={() => setDeletingInvoice(s)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700 cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-3">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                ) : null}
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{brand.dealershipName || 'SalesPlus'} Vehicle Sales Invoice</h2>
                  <p className="text-xs text-slate-500">Official Tax Invoice #{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
              <div className="flex justify-between"><span>Customer:</span> <span className="font-bold">{selectedInvoice.customerName}</span></div>
              <div className="flex justify-between"><span>Vehicle Sold:</span> <span className="font-bold">{selectedInvoice.vehicleName}</span></div>
              <div className="flex justify-between border-t pt-2 font-bold text-sm"><span>Total Deal Amount:</span> <span className="text-emerald-700">{formatLKR(selectedInvoice.finalAmount)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Paid Amount:</span> <span>{formatLKR(selectedInvoice.paidAmount)}</span></div>
              <div className="flex justify-between font-bold text-blue-600"><span>Outstanding Balance:</span> <span>{formatLKR(selectedInvoice.balance)}</span></div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button onClick={() => window.print()} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 cursor-pointer">
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingInvoice && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">Delete invoice {deletingInvoice.invoiceNumber}?</h2><p className="mt-2 text-sm text-slate-600">The invoice will be removed and its vehicle returned to available inventory.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeletingInvoice(null)} className="rounded-lg border px-4 py-2 text-sm cursor-pointer">Cancel</button><button onClick={deleteInvoice} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer">Delete invoice</button></div></section></div>}
    
    </DashboardLayout>
  );
}
