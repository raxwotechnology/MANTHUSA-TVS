"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileText, Plus, Printer, Download, CheckCircle2, XCircle, Clock, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useSettings } from '@/lib/useSettings';

interface Quotation {
  _id: string;
  customerId?: string;
  vehicleId?: string;
  quotationNumber: string;
  customerName: string;
  vehicleName: string;
  vehiclePrice: number;
  discount: number;
  additionalCharges: number;
  totalAmount: number;
  advancePayment: number;
  balanceAmount: number;
  status: string;
  validUntil?: string;
}

export default function QuotationsPage() {
  const { settings: brand } = useSettings();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});

  const [selectedPdfQuote, setSelectedPdfQuote] = useState<Quotation | null>(null);
  const [editingQuote, setEditingQuote] = useState<Quotation | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<Quotation | null>(null);

  const [customersList, setCustomersList] = useState<any[]>([]);
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved) setCurrentUser(JSON.parse(saved));
    } catch {}
  }, []);

  const isCustomer = (currentUser?.role || '').toLowerCase().includes('customer') || (currentUser?.role || '').toLowerCase().includes('client');

  const loadQuotations = async () => {
    const [quoteRes, custRes, vehRes] = await Promise.all([
      apiFetch('/quotations'),
      apiFetch('/customers'),
      apiFetch('/vehicles')
    ]);
    if (!quoteRes.ok) throw new Error('Could not load quotations.');
    const data = await quoteRes.json();
    setQuotations(data.map((quote: any) => ({ ...quote, customerId: quote.customer?._id, vehicleId: quote.vehicle?._id, customerName: quote.customer?.fullName || '', vehicleName: `${quote.vehicle?.make || ''} ${quote.vehicle?.model || ''} ${quote.vehicle?.year || ''}`.trim(), additionalCharges: Number(quote.registrationFee || 0) + Number(quote.insuranceFee || 0) + Number(quote.otherCharges || 0), balanceAmount: Number(quote.totalAmount || 0) - Number(quote.advancePayment || 0), status: quote.status || 'Active' })));
    
    if (custRes.ok) {
      const cData = await custRes.json();
      setCustomersList(cData);
    }
    if (vehRes.ok) {
      const vData = await vehRes.json();
      setVehiclesList(vData);
    }
  };
  useEffect(() => { loadQuotations().catch((error) => window.alert(error.message)); }, []);

  const saveQuotation = async () => {
    const form = newFormData as any;
    try {
      let customerId = form.customerId;
      let vehicleId = form.vehicleId;

      // Fallback matching if typed manually
      if (!customerId && form.customerName) {
        const queryName = String(form.customerName).trim().toLowerCase();
        const found = customersList.find((c) => c.fullName?.toLowerCase() === queryName || c.fullName?.toLowerCase().includes(queryName));
        if (found) customerId = found._id;
      }
      if (!vehicleId && form.vehicleName) {
        const queryVeh = String(form.vehicleName).trim().toLowerCase();
        const found = vehiclesList.find((v) => 
          `${v.make} ${v.model}`.toLowerCase() === queryVeh ||
          `${v.make} ${v.model}`.toLowerCase().includes(queryVeh) ||
          `${v.make} ${v.model} ${v.year || ''}`.trim().toLowerCase().includes(queryVeh) ||
          v.make?.toLowerCase() === queryVeh
        );
        if (found) vehicleId = found._id;
      }

      if (!customerId && editingQuote?.customerId) customerId = editingQuote.customerId;
      if (!vehicleId && editingQuote?.vehicleId) vehicleId = editingQuote.vehicleId;

      if (!customerId) {
        throw new Error('Please select an existing customer from the dropdown list. If new, add them first under Customer Profiles.');
      }
      if (!vehicleId) {
        throw new Error('Please select a vehicle from the dropdown list in the showroom inventory.');
      }

      const vehicle = vehiclesList.find((v) => v._id === vehicleId);
      const vehiclePrice = Number(form.vehiclePrice || vehicle?.sellingPrice || 0);

      const response = await apiFetch(editingQuote ? `/quotations/${editingQuote._id}` : '/quotations', { 
        method: editingQuote ? 'PUT' : 'POST', 
        body: JSON.stringify({ 
          customer: customerId, 
          vehicle: vehicleId, 
          vehiclePrice, 
          discount: Number(form.discount || 0), 
          registrationFee: 0, 
          insuranceFee: 0, 
          otherCharges: Number(form.additionalCharges || 0), 
          advancePayment: Number(form.advancePayment || 0), 
          validUntil: form.validUntil || editingQuote?.validUntil || new Date(Date.now() + 7 * 86400000).toISOString() 
        }) 
      });
      if (!response.ok) {
        const details = await response.json().catch(() => ({}));
        throw new Error(details.message || 'Could not save quotation.');
      }
      await loadQuotations(); setShowAddModal(false); setEditingQuote(null); setNewFormData({});
    } catch (error) { window.alert(error instanceof Error ? error.message : 'Could not save quotation.'); }
  };

  const removeQuotation = async () => {
    if (!deletingQuote) return;
    const response = await apiFetch(`/quotations/${deletingQuote._id}`, { method: 'DELETE' });
    if (!response.ok) { window.alert('Could not delete quotation.'); return; }
    setQuotations((items) => items.filter((item) => item._id !== deletingQuote._id));
    setDeletingQuote(null);
  };

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{isCustomer ? 'My Quotations' : 'Quotations & Discount Approval'}</h1>
          <p className="text-xs text-slate-500">{isCustomer ? 'View official quotations and download PDF estimates provided for you' : 'Generate quotation breakdowns, handle manager discount approval, and export PDF invoices'}</p>
        </div>

        {!isCustomer && (
          <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            <span>Create New Quotation</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Quote #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Vehicle Price</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Final Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotations.map((q) => (
                <tr key={q._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{q.quotationNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{q.customerName}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{q.vehicleName}</td>
                  <td className="py-3 px-4 font-medium">{formatLKR(q.vehiclePrice)}</td>
                  <td className="py-3 px-4 font-semibold text-rose-600">-{formatLKR(q.discount)}</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-600">{formatLKR(q.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{q.status}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedPdfQuote(q)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-lg border flex items-center gap-1.5 mx-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>
                    {!isCustomer && (
                      <>
                        <button onClick={() => { 
                          setEditingQuote(q); 
                          setNewFormData({ 
                            quotationNumber: q.quotationNumber, 
                            customerId: q.customerId,
                            vehicleId: q.vehicleId,
                            customerName: q.customerName, 
                            vehicleName: q.vehicleName, 
                            vehiclePrice: String(q.vehiclePrice), 
                            discount: String(q.discount), 
                            additionalCharges: String(q.additionalCharges), 
                            advancePayment: String(q.advancePayment) 
                          }); 
                          setShowAddModal(true); 
                        }} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">Edit</button>
                        <button onClick={() => setDeletingQuote(q)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700">Delete</button>
                      </>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Printable Quotation Modal */}
      {selectedPdfQuote && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl border border-slate-200 print:shadow-none text-slate-900">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-3">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.dealershipName || 'Logo'} className="w-12 h-12 object-contain" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{brand.dealershipName || 'SalesPlus Dealership'}</h2>
                  <p className="text-xs text-slate-500">{brand.tagline || 'Official Vehicle Sales Quotation'}</p>
                  {brand.phone && <p className="text-[11px] text-slate-400">Hotline: {brand.phone}</p>}
                </div>
              </div>
              <button onClick={() => setSelectedPdfQuote(null)} className="text-slate-400 hover:text-slate-600 print:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-start mb-6 text-xs">
              <div>
                <span className="text-slate-500 block">Quotation For:</span>
                <span className="font-extrabold text-slate-900 text-sm">{selectedPdfQuote.customerName}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block">Quote Reference:</span>
                <span className="font-mono font-bold text-emerald-600">{selectedPdfQuote.quotationNumber}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-xs">
              <span className="text-slate-500 block mb-1">Vehicle Specification:</span>
              <span className="font-bold text-slate-900 text-sm">{selectedPdfQuote.vehicleName}</span>
            </div>

            <div className="space-y-2 text-xs border-t border-b py-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Vehicle Base Selling Price:</span>
                <span className="font-bold text-slate-900">{formatLKR(selectedPdfQuote.vehiclePrice)}</span>
              </div>
              {selectedPdfQuote.additionalCharges > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Registration & Insurance Fees:</span>
                  <span className="font-bold text-slate-900">+{formatLKR(selectedPdfQuote.additionalCharges)}</span>
                </div>
              )}
              {selectedPdfQuote.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Approved Discount:</span>
                  <span className="font-bold text-rose-600">-{formatLKR(selectedPdfQuote.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base border-t pt-2 text-emerald-700">
                <span>Final Payable Price:</span>
                <span>{formatLKR(selectedPdfQuote.totalAmount)}</span>
              </div>
              {selectedPdfQuote.advancePayment > 0 && (
                <div className="flex justify-between font-medium text-blue-600">
                  <span>Advance Paid:</span>
                  <span>{formatLKR(selectedPdfQuote.advancePayment)}</span>
                </div>
              )}
              {selectedPdfQuote.balanceAmount > 0 && (
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Remaining Balance:</span>
                  <span>{formatLKR(selectedPdfQuote.balanceAmount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setSelectedPdfQuote(null)}
                className="px-4 py-2 border rounded-lg text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto text-slate-900">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editingQuote ? 'Edit Quotation' : 'Create New Quotation'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Quotation Number</label>
                <input type="text" placeholder="e.g. QT-2026-001 (Auto-generated if blank)" className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, quotationNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Customer *</label>
                <select
                  value={(newFormData as any).customerId || ''}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const cust = customersList.find((c) => c._id === selId);
                    setNewFormData({
                      ...newFormData,
                      customerId: selId,
                      customerName: cust?.fullName || ''
                    });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
                >
                  <option value="">-- Choose a registered customer --</option>
                  {customersList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.phone || c.email || 'No contact'})
                    </option>
                  ))}
                </select>
                {customersList.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    No customers found yet. Create a customer profile under "Customer Profiles" first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Vehicle *</label>
                <select
                  value={(newFormData as any).vehicleId || ''}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const veh = vehiclesList.find((v) => v._id === selId);
                    setNewFormData({
                      ...newFormData,
                      vehicleId: selId,
                      vehicleName: veh ? `${veh.make} ${veh.model} ${veh.year || ''}`.trim() : '',
                      vehiclePrice: veh?.sellingPrice ? String(veh.sellingPrice) : (newFormData as any).vehiclePrice
                    });
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900"
                >
                  <option value="">-- Choose vehicle from inventory --</option>
                  {vehiclesList.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.make} {v.model} ({v.year || ''}) - LKR {Number(v.sellingPrice || 0).toLocaleString()} [{v.status || 'Stock'}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Price (LKR) *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 13500000" 
                  value={(newFormData as any).vehiclePrice || ''} 
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400 bg-white text-slate-900" 
                  onChange={(e) => setNewFormData({...newFormData, vehiclePrice: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Approved Discount (LKR)</label>
                <input type="number" placeholder="e.g. 75,000" value={(newFormData as any).discount || ''} className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, discount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Charges (Registration/Insurance)</label>
                <input type="number" placeholder="e.g. 50,000" value={(newFormData as any).additionalCharges || ''} className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, additionalCharges: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Advance Payment (LKR)</label>
                <input type="number" placeholder="e.g. 500,000" value={(newFormData as any).advancePayment || ''} className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, advancePayment: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => { setShowAddModal(false); setEditingQuote(null); setNewFormData({}); }} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={saveQuotation} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">{editingQuote ? 'Save Changes' : 'Save Quotation'}</button>
            </div>
          </div>
        </div>
      )}
      {deletingQuote && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">Delete quotation {deletingQuote.quotationNumber}?</h2><p className="mt-2 text-sm text-slate-600">This action cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeletingQuote(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button onClick={removeQuotation} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Delete quotation</button></div></section></div>}
    
    </DashboardLayout>
  );
}
