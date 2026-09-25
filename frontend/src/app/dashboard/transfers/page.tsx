"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArrowLeftRight, Plus } from 'lucide-react';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([
    {
      _id: '1',
      transferId: 'TRF-001',
      vehicleName: 'Toyota Raize Z Turbo 2020',
      fromBranch: 'Colombo Head Office',
      toBranch: 'Kandy Branch',
      date: '2026-09-24',
      driver: 'Mahesh Kumara',
      transportCost: 35000,
      status: 'In Transit'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Multi-Branch Vehicle Transfers</h1>
          <p className="text-xs text-slate-500">Transfer vehicles between Colombo, Kandy, Kurunegala and Galle branches</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Create Branch Transfer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Transfer #</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">From Branch</th>
              <th className="py-3 px-4">To Branch</th>
              <th className="py-3 px-4">Transfer Date</th>
              <th className="py-3 px-4">Transport Cost</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transfers.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{t.transferId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{t.vehicleName}</td>
                <td className="py-3 px-4 text-slate-700">{t.fromBranch}</td>
                <td className="py-3 px-4 font-semibold text-blue-600">{t.toBranch}</td>
                <td className="py-3 px-4 text-slate-500">{t.date}</td>
                <td className="py-3 px-4 font-bold text-slate-800">LKR {t.transportCost.toLocaleString()}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
