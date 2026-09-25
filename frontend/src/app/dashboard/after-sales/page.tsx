"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Wrench, Plus, Bell } from 'lucide-react';

export default function AfterSalesPage() {
  const [reminders, setReminders] = useState([
    {
      _id: '1',
      customerName: 'Blue Star Logistics Ltd',
      vehicleName: 'Nissan X-Trail 20X Hybrid 2017',
      type: 'First Free Service',
      dueDate: '2026-10-24',
      status: 'Scheduled'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">After-Sales & Warranty Reminders</h1>
          <p className="text-xs text-slate-500">Service schedules, warranty reminders, revenue license renewal & insurance expiry alerts</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Add Service Reminder</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Reminder Type</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reminders.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{r.customerName}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">{r.vehicleName}</td>
                <td className="py-3 px-4 font-semibold text-blue-700">{r.type}</td>
                <td className="py-3 px-4 text-slate-600">{r.dueDate}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
