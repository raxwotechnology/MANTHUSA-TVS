"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DollarSign, Plus, Printer, CheckCircle2, FileText, Search, X } from 'lucide-react';

interface Sale {
  _id: string;
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
  const [sales, setSales] = useState<Sale[]>([
    {
      _id: '1',
      invoiceNumber: 'INV-2026-001',
      customerName: 'Blue Star Logistics Ltd',
      vehicleName: 'Nissan X-Trail 20X Hybrid 2017',
      finalAmount: 9915000,
      paidAmount: 9915000,
      balance: 0,
      saleStatus: 'Completed',
      saleDate: '2026-09-24'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);

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

        <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>+ Create Sale Invoice</span>
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
                <th className="py-3 px-4 text-center">Invoice PDF</th>
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
                    <button
                      onClick={() => setSelectedInvoice(s)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-lg border flex items-center gap-1.5 mx-auto"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Invoice</span>
                    </button>
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
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">SalesPlus Vehicle Sales Invoice</h2>
                <p className="text-xs text-slate-500">Official Tax Invoice #{selectedInvoice.invoiceNumber}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
              <div className="flex justify-between"><span>Customer:</span> <span className="font-bold">{selectedInvoice.customerName}</span></div>
              <div className="flex justify-between"><span>Vehicle Sold:</span> <span className="font-bold">{selectedInvoice.vehicleName}</span></div>
              <div className="flex justify-between border-t pt-2 font-bold text-sm"><span>Total Deal Amount:</span> <span className="text-emerald-700">{formatLKR(selectedInvoice.finalAmount)}</span></div>
              <div className="flex justify-between text-slate-600"><span>Paid Amount:</span> <span>{formatLKR(selectedInvoice.paidAmount)}</span></div>
              <div className="flex justify-between font-bold text-blue-600"><span>Outstanding Balance:</span> <span>{formatLKR(selectedInvoice.balance)}</span></div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button onClick={() => window.print()} className="px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5">
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">invoiceNumber</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, invoiceNumber: e.target.value})} />
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
                <label className="block text-xs font-bold text-slate-700 mb-1">finalAmount</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, finalAmount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">paidAmount</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, paidAmount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">balance</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, balance: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">saleStatus</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, saleStatus: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">saleDate</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, saleDate: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setSales([{_id: Date.now().toString(), ...newFormData} as any, ...sales]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


