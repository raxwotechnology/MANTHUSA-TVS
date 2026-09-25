"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Target, Plus } from 'lucide-react';

export default function TargetsPage() {
  const [targets, setTargets] = useState([
    {
      _id: '1',
      salesperson: 'Kasun Fernando',
      month: 'September 2026',
      vehicleTarget: 4,
      actualVehiclesSold: 2,
      revenueTarget: 30000000,
      actualRevenue: 19830000,
      achievementPct: 66.1
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Monthly Sales Targets vs Actual</h1>
          <p className="text-xs text-slate-500">Configure monthly vehicle count and revenue targets per executive and monitor achievement %</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>+ Set Executive Target</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Sales Executive</th>
              <th className="py-3 px-4">Month</th>
              <th className="py-3 px-4">Target Units</th>
              <th className="py-3 px-4">Sold Units</th>
              <th className="py-3 px-4">Target Revenue</th>
              <th className="py-3 px-4">Actual Revenue</th>
              <th className="py-3 px-4">Progress / Achievement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {targets.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{t.salesperson}</td>
                <td className="py-3 px-4 text-slate-600">{t.month}</td>
                <td className="py-3 px-4 font-medium">{t.vehicleTarget} Vehicles</td>
                <td className="py-3 px-4 font-bold text-blue-600">{t.actualVehiclesSold} Vehicles</td>
                <td className="py-3 px-4 text-slate-600">LKR {t.revenueTarget.toLocaleString()}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">LKR {t.actualRevenue.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${t.achievementPct}%` }}></div>
                    </div>
                    <span className="font-bold text-emerald-700">{t.achievementPct}%</span>
                  </div>
                </td>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">salesperson</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, salesperson: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">month</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, month: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">vehicleTarget</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, vehicleTarget: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">actualVehiclesSold</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, actualVehiclesSold: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">revenueTarget</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, revenueTarget: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">actualRevenue</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, actualRevenue: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">achievementPct</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, achievementPct: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setTargets([{_id: Date.now().toString(), ...newFormData} as any, ...targets]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


