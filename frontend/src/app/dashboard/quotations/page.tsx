"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FileText, Plus, Printer, Download, CheckCircle2, XCircle, Clock, X } from 'lucide-react';

interface Quotation {
  _id: string;
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
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      _id: '1',
      quotationNumber: 'QT-2026-001',
      customerName: 'Kamal Gunaratne',
      vehicleName: 'Toyota Premio F EX Package 2019',
      vehiclePrice: 13500000,
      discount: 100000,
      additionalCharges: 25000,
      totalAmount: 13425000,
      advancePayment: 500000,
      balanceAmount: 12925000,
      status: 'Active'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  const [selectedPdfQuote, setSelectedPdfQuote] = useState<Quotation | null>(null);

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Quotations & Discount Approval</h1>
          <p className="text-xs text-slate-500">Generate quotation breakdowns, handle manager discount approval, and export PDF invoices</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>+ Create New Quotation</span>
        </button>
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
                <th className="py-3 px-4 text-center">PDF Export</th>
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
                    <button
                      onClick={() => setSelectedPdfQuote(q)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-lg border flex items-center gap-1.5 mx-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>
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
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl border border-slate-200 print:shadow-none">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">SalesPlus Dealership</h2>
                <p className="text-xs text-slate-500">Official Vehicle Sales Quotation</p>
              </div>
              <button onClick={() => setSelectedPdfQuote(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Prepared For:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedPdfQuote.customerName}</p>
                <p className="text-slate-600">Rajagiriya, Colombo</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-semibold">Quotation Number:</span>
                <p className="font-mono font-bold text-slate-900 text-sm">{selectedPdfQuote.quotationNumber}</p>
                <p className="text-slate-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border rounded-xl p-4 mb-6 text-xs space-y-2 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-sm">{selectedPdfQuote.vehicleName}</h4>
              <div className="flex justify-between border-t pt-2"><span>Vehicle List Price:</span> <span className="font-bold">{formatLKR(selectedPdfQuote.vehiclePrice)}</span></div>
              <div className="flex justify-between text-rose-600 font-semibold"><span>Approved Discount:</span> <span>-{formatLKR(selectedPdfQuote.discount)}</span></div>
              <div className="flex justify-between"><span>Registration & Insurance Fee:</span> <span>+{formatLKR(selectedPdfQuote.additionalCharges)}</span></div>
              <div className="flex justify-between font-extrabold text-emerald-700 text-base border-t pt-2"><span>Final Offer Total:</span> <span>{formatLKR(selectedPdfQuote.totalAmount)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Required Advance Deposit:</span> <span className="font-bold">{formatLKR(selectedPdfQuote.advancePayment)}</span></div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button onClick={() => window.print()} className="px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5">
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Record</h3>
            <div className="space-y-3">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">quotationNumber</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, quotationNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">customerName</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, customerName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">vehicleName</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, vehicleName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">vehiclePrice</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, vehiclePrice: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">discount</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, discount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">additionalCharges</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, additionalCharges: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">totalAmount</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, totalAmount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">advancePayment</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, advancePayment: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">balanceAmount</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, balanceAmount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">status</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, status: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setQuotations([{_id: Date.now().toString(), ...newFormData} as any, ...quotations]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


