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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Inspection & Condition Audit</h1>
          <p className="text-xs text-slate-500">Exterior body, interior AC/electronics, engine oil/battery, and document compliance checks</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg" onClick={() => setShowAddModal(true)}>
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
    
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Record</h3>
            <div className="space-y-3">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">inspectionId</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, inspectionId: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">vehicleName</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, vehicleName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">inspector</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, inspector: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">date</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">result</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, result: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">estimatedRepairCost</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, estimatedRepairCost: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">notes</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, notes: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setInspections([{_id: Date.now().toString(), ...newFormData} as any, ...inspections]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


