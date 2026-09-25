"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessageSquareWarning, Plus } from 'lucide-react';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([
    {
      _id: '1',
      complaintId: 'CMP-001',
      customerName: 'Kamal Gunaratne',
      vehicleName: 'Toyota Premio F EX Package',
      type: 'AC Cooling Issue',
      priority: 'High',
      assignedStaff: 'Ruwan Jayasinghe',
      status: 'In Progress'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Complaint Management</h1>
          <p className="text-xs text-slate-500">Log customer issues, assign technical staff, track resolution progress (Open -&gt; In Progress -&gt; Resolved -&gt; Closed)</p>
        </div>

        <button className="flex items-center gap-1.5 bg-rose-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Log New Complaint</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Ticket #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Issue Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Assigned Tech</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{c.complaintId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{c.customerName}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">{c.vehicleName}</td>
                <td className="py-3 px-4 font-medium text-slate-800">{c.type}</td>
                <td className="py-3 px-4 font-bold text-rose-600">{c.priority}</td>
                <td className="py-3 px-4 text-slate-600">{c.assignedStaff}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
