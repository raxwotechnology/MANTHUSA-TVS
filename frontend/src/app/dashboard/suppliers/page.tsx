"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Building2, Plus, Phone, Mail, FileText } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});

  const loadSuppliers = async () => {
    const response = await apiFetch('/suppliers');
    if (!response.ok) throw new Error('Could not load suppliers.');
    const data = await response.json();
    setSuppliers(data.map((item: any) => ({ ...item, supplierName: item.name })));
  };

  useEffect(() => { loadSuppliers().catch((error) => window.alert(error.message)); }, []);

  const saveSupplier = async () => {
    const form = newFormData as any;
    try {
      const response = await apiFetch('/suppliers', { method: 'POST', body: JSON.stringify({ supplierId: form.supplierId, name: form.supplierName, supplierType: form.supplierType, contactPerson: form.contactPerson, phone: form.phone, email: form.email }) });
      if (!response.ok) throw new Error('Supplier name and phone are required.');
      const saved = await response.json();
      setSuppliers((current) => [{ ...saved, supplierName: saved.name }, ...current]);
      setShowAddModal(false); setNewFormData({});
    } catch (error) { window.alert(error instanceof Error ? error.message : 'Could not save supplier.'); }
  };


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Supplier & Importer Management</h1>
          <p className="text-xs text-slate-500">Track supplier profiles, vehicle purchase history, payments, and ledger statement</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Supplier ID</th>
              <th className="py-3 px-4">Supplier Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Contact Person</th>
              <th className="py-3 px-4">Phone / Email</th>
              <th className="py-3 px-4">Outstanding Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{s.supplierId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{s.supplierName}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">{s.supplierType}</span></td>
                <td className="py-3 px-4 font-medium text-slate-700">{s.contactPerson}</td>
                <td className="py-3 px-4 text-slate-600">{s.phone} • {s.email}</td>
                <td className="py-3 px-4 font-extrabold text-rose-600">LKR {s.outstandingBalance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto text-slate-900">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Supplier Record</h3>
            <div className="space-y-3">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supplier ID</label>
                <input type="text" placeholder="e.g. SUP-2026-001" className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, supplierId: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Name</label>
                <input type="text" placeholder="e.g. Tokyo Trading Auto Co." className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, supplierName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Type</label>
                <input type="text" placeholder="e.g. Japanese Auction / Local Dealer" className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, supplierType: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person</label>
                <input type="text" placeholder="e.g. Kenji Tanaka / Sunera Fernando" className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, contactPerson: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input type="text" placeholder="e.g. +94 77 123 4567" className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" placeholder="e.g. info@tokyotrading.jp" className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Outstanding Balance (LKR)</label>
                <input type="number" placeholder="e.g. 1,500,000" className="w-full border border-slate-300 rounded-lg p-2 text-xs placeholder:text-slate-400" onChange={(e) => setNewFormData({...newFormData, outstandingBalance: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={saveSupplier} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save Supplier</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}
