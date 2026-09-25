"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar, Plus, CheckCircle2 } from 'lucide-react';

export default function TestDrivesPage() {
  const [drives, setDrives] = useState([
    {
      _id: '1',
      testDriveId: 'TD-001',
      customerName: 'Kamal Gunaratne',
      vehicleName: 'Toyota Premio F EX Package 2019',
      date: '2026-09-24',
      timeSlot: '10:00 AM - 10:30 AM',
      drivingLicenseNo: 'B8910293',
      status: 'Completed',
      feedback: 'Customer loved engine performance.'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Test Drive Schedule & Feedback</h1>
          <p className="text-xs text-slate-500">Book customer driving slots, verify license, and record post-drive feedback</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>+ Schedule Test Drive</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Booking #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">License #</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Feedback</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {drives.map((d) => (
              <tr key={d._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{d.testDriveId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{d.customerName}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">{d.vehicleName}</td>
                <td className="py-3 px-4 text-slate-600">{d.date} • {d.timeSlot}</td>
                <td className="py-3 px-4 font-mono">{d.drivingLicenseNo}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{d.status}</span></td>
                <td className="py-3 px-4 text-slate-500">{d.feedback}</td>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">testDriveId</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, testDriveId: e.target.value})} />
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
                <label className="block text-xs font-bold text-slate-700 mb-1">date</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">timeSlot</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, timeSlot: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">drivingLicenseNo</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, drivingLicenseNo: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">status</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, status: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">feedback</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, feedback: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setDrives([{_id: Date.now().toString(), ...newFormData} as any, ...drives]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


