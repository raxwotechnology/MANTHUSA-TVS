"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PieChart, Plus } from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([
    {
      _id: '1',
      expenseId: 'EXP-001',
      category: 'Vehicle Maintenance & Repair',
      amount: 120000,
      date: '2026-09-24',
      description: 'Brake pads replacement and full exterior detailing for Honda Vezel',
      paymentMethod: 'Cash',
      receiptNumber: 'VCH-881'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Expenses Management Ledger</h1>
          <p className="text-xs text-slate-500">Track vehicle repairs, transport, fuel, advertising, electricity, rent, salaries and overheads</p>
        </div>

        <button className="flex items-center gap-1.5 bg-rose-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Add Expense Record</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Expense ID</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Amount (LKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <tr key={e._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{e.expenseId}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">{e.category}</span></td>
                <td className="py-3 px-4 text-slate-700">{e.description}</td>
                <td className="py-3 px-4 text-slate-500">{e.date}</td>
                <td className="py-3 px-4 text-slate-600">{e.paymentMethod}</td>
                <td className="py-3 px-4 text-right font-extrabold text-rose-600">LKR {e.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
