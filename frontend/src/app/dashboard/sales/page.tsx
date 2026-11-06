"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DollarSign, Plus, Printer, CheckCircle2, FileText, Search, X, FileDown, FileSpreadsheet, MessageSquare, AlertCircle } from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { useSettings } from '@/lib/useSettings';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();

  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Sale | null>(null);

  const [smsSale, setSmsSale] = useState<Sale | null>(null);
  const [smsSaleDetail, setSmsSaleDetail] = useState<any>(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [smsSending, setSmsSending] = useState(false);
  const [smsNotification, setSmsNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch {}
  }, []);

  const isCustomer = (currentUser?.role || '').toLowerCase().includes('customer') || (currentUser?.role || '').toLowerCase().includes('client');

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
        vehicleName: sale.modelName || [sale.vehicle?.make, sale.vehicle?.model, sale.variantName || sale.vehicle?.variant].filter(Boolean).join(' ') || 'TVS Motorcycle',
        finalAmount: Number(sale.finalAmount || 0), paidAmount: Number(sale.paidAmount || 0),
        balance: Number(sale.balance || 0), saleStatus: sale.status, saleDate: sale.saleDate,
      })));
    }).catch((error) => window.alert(error.message));
  }, []);

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  const filteredSales = sales.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchInv = s.invoiceNumber?.toLowerCase().includes(q);
      const matchCust = s.customerName?.toLowerCase().includes(q);
      const matchVeh = s.vehicleName?.toLowerCase().includes(q);
      const matchStatus = s.saleStatus?.toLowerCase().includes(q);
      if (!matchInv && !matchCust && !matchVeh && !matchStatus) return false;
    }
    if (!isWithinDateRange(s.saleDate, startDate, endDate)) return false;
    return true;
  });

  return (
    <DashboardLayout>
      {/* SMS Notification Toast */}
      {smsNotification && (
        <div
          role="alert"
          className={`mb-4 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm transition-all ${
            smsNotification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {smsNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{smsNotification.message}</span>
          </div>
          <button onClick={() => setSmsNotification(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{isCustomer ? 'My Sales Invoices' : 'Sales & Tax Invoices'}</h1>
          <p className="text-xs text-slate-500">{isCustomer ? 'View deal confirmations, paid amounts, remaining balances, and official receipts' : 'Record final deal confirmations, track paid balances, and print official invoices'}</p>
        </div>

        {!isCustomer && (
          <div className="flex items-center gap-2">
            <button onClick={() => { const cols = [{label:'Invoice #',value:(r:any)=>r.invoiceNumber},{label:'Date',value:(r:any)=>r.saleDate},{label:'Customer',value:(r:any)=>r.customerName},{label:'Motorcycle Model',value:(r:any)=>r.vehicleName},{label:'Final Amount',value:(r:any)=>r.finalAmount},{label:'Paid Amount',value:(r:any)=>r.paidAmount},{label:'Balance',value:(r:any)=>r.balance},{label:'Status',value:(r:any)=>r.saleStatus}]; exportPdf('Sales & Tax Invoices','sales.pdf',cols,filteredSales); }} disabled={!filteredSales.length} className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"><FileDown className="w-4 h-4" /><span>PDF</span></button>
            <button onClick={() => { const cols = [{label:'Invoice #',value:(r:any)=>r.invoiceNumber},{label:'Date',value:(r:any)=>r.saleDate},{label:'Customer',value:(r:any)=>r.customerName},{label:'Motorcycle Model',value:(r:any)=>r.vehicleName},{label:'Final Amount',value:(r:any)=>r.finalAmount},{label:'Paid Amount',value:(r:any)=>r.paidAmount},{label:'Balance',value:(r:any)=>r.balance},{label:'Status',value:(r:any)=>r.saleStatus}]; exportExcel('sales.xlsx',cols,filteredSales); }} disabled={!filteredSales.length} className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs cursor-pointer"><FileSpreadsheet className="w-4 h-4" /><span>Excel</span></button>
            <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs cursor-pointer" onClick={() => router.push('/dashboard/sales/new')}>
              <Plus className="w-4 h-4" />
              <span>Create Sale Invoice</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & Date Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice #, customer, motorcycle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>

          <DateFilterControl
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            label="Date Filter:"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Motorcycle Model</th>
                <th className="py-3 px-4">Final Amount</th>
                <th className="py-3 px-4">Paid Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((s) => (
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
                    {!isCustomer && (
                      <>
                        <button onClick={() => router.push(`/dashboard/sales/new?id=${s._id}`)} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 cursor-pointer">Edit</button>
                        <button onClick={() => setDeletingInvoice(s)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700 cursor-pointer">Delete</button>
                        <button
                          onClick={async () => {
                            setSmsSale(s);
                            setSmsSaleDetail(null);
                            setSmsMessage(`Dear ${s.customerName}, thank you for your purchase of ${s.vehicleName} from TVS SalesPlus Motor Hub! Invoice: ${s.invoiceNumber}. Total: LKR ${(s.finalAmount || 0).toLocaleString('en-LK')}. Balance: LKR ${(s.balance || 0).toLocaleString('en-LK')}. Ride safe!`);
                            try {
                              const res = await apiFetch(`/sales/${s._id}`);
                              if (res.ok) setSmsSaleDetail(await res.json());
                            } catch {}
                          }}
                          className="rounded-lg border border-blue-200 px-3 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Send SMS</span>
                        </button>
                      </>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No sales invoice records found matching the query or date range.
                  </td>
                </tr>
              )}
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
                  <img src={brand.logoUrl} alt="Logo" className="h-10 w-20 object-contain rounded-lg" />
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
      {/* SMS Send Modal */}
      {smsSale && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">Send SMS Notification</h3>
              </div>
              <button onClick={() => setSmsSale(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">Customer:</span> <span className="font-bold text-slate-800">{smsSale.customerName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Phone:</span> <span className="font-mono font-bold text-blue-600">{smsSaleDetail?.customer?.phone || 'Loading phone...'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Motorcycle:</span> <span className="font-medium text-slate-700">{smsSale.vehicleName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Invoice:</span> <span className="font-mono font-bold text-slate-800">{smsSale.invoiceNumber}</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">SMS Message (Sender: TVSSalesPlus)</label>
                <textarea
                  rows={4}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSmsSale(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={smsSending || !smsMessage.trim() || !smsSaleDetail?.customer?.phone}
                  onClick={async () => {
                    const phone = smsSaleDetail?.customer?.phone;
                    if (!phone) {
                      setSmsNotification({ type: 'error', message: 'Customer phone number not found.' });
                      return;
                    }
                    setSmsSending(true);
                    try {
                      const res = await apiFetch('/notifications/send-sms', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone, message: smsMessage.trim() })
                      });
                      if (res.ok) {
                        setSmsNotification({ type: 'success', message: `SMS sent successfully to ${phone}!` });
                        setTimeout(() => setSmsNotification(null), 4000);
                        setSmsSale(null);
                      } else {
                        const err = await res.json().catch(() => ({}));
                        setSmsNotification({ type: 'error', message: err.message || 'Failed to send SMS.' });
                        setTimeout(() => setSmsNotification(null), 5000);
                      }
                    } catch {
                      setSmsNotification({ type: 'error', message: 'Network error sending SMS.' });
                      setTimeout(() => setSmsNotification(null), 5000);
                    } finally {
                      setSmsSending(false);
                    }
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{smsSending ? 'Sending SMS...' : 'Send SMS Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deletingInvoice && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">Delete invoice {deletingInvoice.invoiceNumber}?</h2><p className="mt-2 text-sm text-slate-600">The invoice will be removed and its vehicle returned to available inventory.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeletingInvoice(null)} className="rounded-lg border px-4 py-2 text-sm cursor-pointer">Cancel</button><button onClick={deleteInvoice} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer">Delete invoice</button></div></section></div>}
    
    </DashboardLayout>
  );
}
