"use client";
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCog, Plus, ShieldCheck, Key } from 'lucide-react';

export default function UsersPermissionsPage() {
  const usersList = [
    {
      name: 'Saman Kumara',
      email: 'admin@salesplus.com',
      role: 'Admin / Owner',
      access: 'Full system control',
      status: 'Active'
    },
    {
      name: 'Nimal Perera',
      email: 'manager@salesplus.com',
      role: 'Admin / Owner',
      access: 'Full system control',
      status: 'Active'
    },
    {
      name: 'Kasun Fernando',
      email: 'executive@salesplus.com',
      role: 'Sales & Operations Staff',
      access: 'Customers, CRM, Vehicles, Test Drives, Quotations, Sales',
      status: 'Active'
    },
    {
      name: 'Dilini Silva',
      email: 'accountant@salesplus.com',
      role: 'Accountant / Finance Staff',
      access: 'Payments, Installments, Expenses, Cash Flow, Financial Reports',
      status: 'Active'
    },
    {
      name: 'Ruwan Jayasinghe',
      email: 'manager2@salesplus.com',
      role: 'Sales & Operations Staff',
      access: 'Inventory, Inspections, Handovers & Transfers',
      status: 'Active'
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Roles & Module Permissions</h1>
          <p className="text-xs text-slate-500">Consolidated 3 Internal Roles (Admin, Sales & Ops, Accountant/Finance) & Staff Credentials</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Create Staff Account</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6">
        <h3 className="font-bold text-slate-900 text-sm mb-3">System Staff Accounts & Role Matrix</h3>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Staff Name</th>
              <th className="py-3 px-4">Login Email</th>
              <th className="py-3 px-4">Consolidated Role</th>
              <th className="py-3 px-4">Module Permissions Scope</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usersList.map((u, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                <td className="py-3 px-4 font-mono text-slate-700">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    u.role.includes('Admin') ? 'bg-purple-100 text-purple-800' :
                    u.role.includes('Sales') ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">{u.access}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

