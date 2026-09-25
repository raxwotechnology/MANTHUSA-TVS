"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Building2, Plus, Phone, Mail, FileText } from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([
    {
      _id: '1',
      supplierId: 'SUP-001',
      supplierName: 'Lanka Auto Importers Pvt Ltd',
      supplierType: 'Importer',
      contactPerson: 'Sunil Shantha',
      phone: '0115566778',
      email: 'info@lankaautoimport.lk',
      outstandingBalance: 4500000
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Supplier & Importer Management</h1>
          <p className="text-xs text-slate-500">Track supplier profiles, vehicle purchase history, payments, and ledger statement</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Add Supplier</span>
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
    </DashboardLayout>
  );
}
