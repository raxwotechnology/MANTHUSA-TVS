"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CreditCard, Plus } from 'lucide-react';

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState([
    {
      _id: '1',
      customerName: 'Kamal Gunaratne',
      financeCompany: 'Central Finance PLC',
      loanAmount: 8000000,
      downPayment: 5500000,
      periodMonths: 60,
      monthlyInstallment: 185000,
      status: 'Active'
    }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFormData, setNewFormData] = useState({});


  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Installments & Vehicle Finance</h1>
          <p className="text-xs text-slate-500">Track leasing agreements, down payments, interest rates and monthly installment due dates</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>+ Add Finance Plan</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Finance Company</th>
              <th className="py-3 px-4">Loan Amount</th>
              <th className="py-3 px-4">Down Payment</th>
              <th className="py-3 px-4">Loan Period</th>
              <th className="py-3 px-4">Monthly Installment</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {installments.map((i) => (
              <tr key={i._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{i.customerName}</td>
                <td className="py-3 px-4 font-bold text-blue-700">{i.financeCompany}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">LKR {i.loanAmount.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-600">LKR {i.downPayment.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-500">{i.periodMonths} Months</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">LKR {i.monthlyInstallment.toLocaleString()}/mo</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{i.status}</span></td>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">customerName</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, customerName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">financeCompany</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, financeCompany: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">loanAmount</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, loanAmount: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">downPayment</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, downPayment: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">periodMonths</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, periodMonths: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">monthlyInstallment</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, monthlyInstallment: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">status</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={(e) => setNewFormData({...newFormData, status: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={() => { setShowAddModal(false); setInstallments([{_id: Date.now().toString(), ...newFormData} as any, ...installments]); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    
    </DashboardLayout>
  );
}


