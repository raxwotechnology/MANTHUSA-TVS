"use client";
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ShieldCheck, Search } from 'lucide-react';

export default function AuditLogsPage() {
  const logs = [
    {
      id: 'LOG-1092',
      user: 'Saman Kumara (Admin)',
      action: 'UPDATE_VEHICLE_PRICE',
      entity: 'Vehicle #STK-2026-001',
      details: 'Old Price: LKR 13,800,000 -> New Price: LKR 13,500,000',
      timestamp: '2026-09-24 19:42:10'
    },
    {
      id: 'LOG-1091',
      user: 'Kasun Fernando (Sales)',
      action: 'CREATE_QUOTATION',
      entity: 'Quotation #QT-2026-001',
      details: 'Discount requested: LKR 100,000 for Kamal Gunaratne',
      timestamp: '2026-09-24 18:15:22'
    },
    {
      id: 'LOG-1090',
      user: 'Dilini Silva (Accountant)',
      action: 'RECORD_PAYMENT',
      entity: 'Receipt #RCP-001',
      details: 'Amount LKR 9,915,000 received via Bank Transfer',
      timestamp: '2026-09-24 16:30:05'
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">System Security Audit Logs</h1>
          <p className="text-xs text-slate-500">Immutable audit trail recording logins, price changes, discount approvals, and financial transactions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Log ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity</th>
              <th className="py-3 px-4">Change Details</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{l.id}</td>
                <td className="py-3 px-4 font-bold text-slate-800">{l.user}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{l.action}</span></td>
                <td className="py-3 px-4 font-medium text-slate-700">{l.entity}</td>
                <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{l.details}</td>
                <td className="py-3 px-4 text-slate-400 font-mono">{l.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
