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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Multi-Branch Vehicle Transfers</h1>
          <p className="text-xs text-slate-500">Transfer vehicles between Colombo, Kandy, Kurunegala and Galle branches</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg" onClick={() => setShowAddModal(true)}>
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
    
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Record</h3>
            <div className="space-y-3">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">transferId</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, transferId: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">vehicleName</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, vehicleName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">fromBranch</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, fromBranch: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">toBranch</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, toBranch: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">date</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">driver</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, driver: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">transportCost</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, transportCost: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">status</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, status: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setTransfers([{_id: Date.now().toString(), ...newFormData} as any, ...transfers]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


