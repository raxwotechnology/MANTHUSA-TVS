"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Car, CheckSquare, Plus, FileText, CheckCircle2 } from 'lucide-react';

export default function HandoversPage() {
  const [handovers, setHandovers] = useState([
    {
      _id: '1',
      handoverId: 'HO-2026-001',
      customerName: 'Blue Star Logistics Ltd',
      vehicleName: 'Nissan X-Trail 20X Hybrid 2017',
      handoverDate: '2026-09-24',
      status: 'Completed',
      checklistCount: '9/9 Items Verified'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Handover Checklist</h1>
          <p className="text-xs text-slate-500">Keys, Spare key, CR, Insurance, Service book, User manual, Accessories, License plates & signature</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>+ Prepare Handover Form</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Handover #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Handover Date</th>
              <th className="py-3 px-4">Checklist Items</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {handovers.map((h) => (
              <tr key={h._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{h.handoverId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{h.customerName}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">{h.vehicleName}</td>
                <td className="py-3 px-4 text-slate-500">{h.handoverDate}</td>
                <td className="py-3 px-4 font-semibold text-emerald-600">{h.checklistCount}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{h.status}</span></td>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">handoverId</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, handoverId: e.target.value})} />
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
                <label className="block text-xs font-bold text-slate-700 mb-1">handoverDate</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, handoverDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">status</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, status: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">checklistCount</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, checklistCount: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setHandovers([{_id: Date.now().toString(), ...newFormData} as any, ...handovers]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


