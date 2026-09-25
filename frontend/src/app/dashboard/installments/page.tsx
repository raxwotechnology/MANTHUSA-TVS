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

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Installments & Vehicle Finance</h1>
          <p className="text-xs text-slate-500">Track leasing agreements, down payments, interest rates and monthly installment due dates</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
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
    </DashboardLayout>
  );
}
