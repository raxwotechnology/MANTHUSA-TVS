"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClipboardCheck, Plus, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function InspectionsPage() {
  const [inspections, setInspections] = useState([
    {
      _id: '1',
      inspectionId: 'INS-001',
      vehicleName: 'Toyota Raize Z Turbo 2020',
      inspector: 'Ruwan Jayasinghe',
      date: '2026-09-24',
      result: 'Passed with Issues',
      estimatedRepairCost: 85000,
      notes: 'Minor paint scuff on left bumper, oil level healthy.'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Inspection & Condition Audit</h1>
          <p className="text-xs text-slate-500">Exterior body, interior AC/electronics, engine oil/battery, and document compliance checks</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Perform Inspection</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Inspection #</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Inspector</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Result</th>
              <th className="py-3 px-4">Est Repair Cost</th>
              <th className="py-3 px-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inspections.map((i) => (
              <tr key={i._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{i.inspectionId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{i.vehicleName}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">{i.inspector}</td>
                <td className="py-3 px-4 text-slate-500">{i.date}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{i.result}</span></td>
                <td className="py-3 px-4 font-bold text-slate-800">LKR {i.estimatedRepairCost.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-500">{i.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
