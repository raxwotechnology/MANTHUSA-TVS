"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Award, Plus } from 'lucide-react';

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState([
    {
      _id: '1',
      salesperson: 'Kasun Fernando',
      saleInvoice: 'INV-2026-001',
      vehicleName: 'Nissan X-Trail 20X Hybrid',
      saleAmount: 9915000,
      commissionType: 'Percentage (1.5%)',
      commissionAmount: 148725,
      status: 'Approved'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sales Commission Management</h1>
          <p className="text-xs text-slate-500">Fixed amount, percentage and target-based commission payouts per salesperson</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Calculate Commission</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Salesperson</th>
              <th className="py-3 px-4">Sale Invoice</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Sale Amount</th>
              <th className="py-3 px-4">Commission Type</th>
              <th className="py-3 px-4">Payout Amount</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {commissions.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{c.salesperson}</td>
                <td className="py-3 px-4 font-mono text-slate-700">{c.saleInvoice}</td>
                <td className="py-3 px-4 text-slate-700">{c.vehicleName}</td>
                <td className="py-3 px-4 text-slate-600">LKR {c.saleAmount.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-500">{c.commissionType}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">LKR {c.commissionAmount.toLocaleString()}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
