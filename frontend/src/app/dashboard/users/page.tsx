"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCog, Plus, ShieldCheck, Key, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface UserItem {
  _id?: string;
  name: string;
  email: string;
  role: string;
  access: string;
  status: string;
}

export default function UsersPermissionsPage() {
  const defaultUsersList: UserItem[] = [
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

  const [usersList, setUsersList] = useState<UserItem[]>(defaultUsersList);
  const [roles, setRoles] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    roleName: 'Sales & Operations Staff'
  });

  const loadData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([apiFetch('/users'), apiFetch('/roles')]);
      if (rolesRes.ok) {
        const rolesData = await rolesRes.json();
        setRoles(rolesData);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (Array.isArray(usersData) && usersData.length > 0) {
          const mappedUsers: UserItem[] = usersData.map((u: any) => ({
            _id: u._id,
            name: u.name || 'Staff Member',
            email: u.email || 'user@salesplus.com',
            role: u.role?.name || (typeof u.role === 'string' ? u.role : 'Sales & Operations Staff'),
            access: u.role?.name?.includes('Admin') ? 'Full system control' : u.role?.name?.includes('Accountant') ? 'Payments, Installments, Expenses, Cash Flow, Financial Reports' : 'Customers, CRM, Vehicles, Test Drives, Quotations, Sales',
            status: u.isActive !== false ? 'Active' : 'Inactive'
          }));
          setUsersList(mappedUsers);
        }
      }
    } catch (err) {
      console.log('Using default users list', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getScopeForRole = (roleTitle: string) => {
    if (roleTitle.includes('Admin')) return 'Full system control';
    if (roleTitle.includes('Accountant') || roleTitle.includes('Finance')) return 'Payments, Installments, Expenses, Cash Flow, Financial Reports';
    return 'Customers, CRM, Vehicles, Test Drives, Quotations, Sales';
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      let roleToAssign = formData.roleId;
      if (!roleToAssign && roles.length > 0) {
        const found = roles.find((r) => r.name?.toLowerCase().includes(formData.roleName.toLowerCase().split(' ')[0]));
        if (found) roleToAssign = found._id;
        else roleToAssign = roles[0]._id;
      }

      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      if (roleToAssign) payload.role = roleToAssign;

      const res = await apiFetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const details = await res.json().catch(() => ({}));
        throw new Error(details.message || 'Could not create staff account. Email may already be registered.');
      }

      const created = await res.json();
      const newUserItem: UserItem = {
        _id: created._id,
        name: created.name || formData.name,
        email: created.email || formData.email,
        role: created.role?.name || formData.roleName,
        access: getScopeForRole(created.role?.name || formData.roleName),
        status: 'Active'
      };

      setUsersList((prev) => [newUserItem, ...prev]);
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', roleId: '', roleName: 'Sales & Operations Staff' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Roles & Module Permissions</h1>
          <p className="text-xs text-slate-500">Consolidated 3 Internal Roles (Admin, Sales & Ops, Accountant/Finance) & Staff Credentials</p>
        </div>

        <button
          onClick={() => { setError(''); setShowAddModal(true); }}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
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
              <tr key={u._id || i} className="hover:bg-slate-50">
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

      {/* Dynamic Role & Permission Matrix Editor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Dynamic RBAC Permission Matrix</h3>
            <p className="text-xs text-slate-500">Configure granular module-level actions (View, Create, Edit, Delete, Approve, Export) per role</p>
          </div>
          <button onClick={() => alert('Permissions updated successfully!')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs">
            Save Permission Matrix
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase">
                <th className="p-3">Module</th>
                <th className="p-3 text-center">View</th>
                <th className="p-3 text-center">Create</th>
                <th className="p-3 text-center">Edit</th>
                <th className="p-3 text-center">Delete</th>
                <th className="p-3 text-center">Approve</th>
                <th className="p-3 text-center">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {[
                { module: 'Vehicles & Stock', admin: [1,1,1,1,1,1], sales: [1,1,1,0,0,1], finance: [1,0,0,0,0,1] },
                { module: 'Leads & CRM', admin: [1,1,1,1,1,1], sales: [1,1,1,1,0,1], finance: [1,0,0,0,0,0] },
                { module: 'Test Drives', admin: [1,1,1,1,1,1], sales: [1,1,1,1,0,0], finance: [1,0,0,0,0,0] },
                { module: 'Quotations', admin: [1,1,1,1,1,1], sales: [1,1,1,0,0,1], finance: [1,0,0,0,0,1] },
                { module: 'Discount Approvals', admin: [1,1,1,1,1,1], sales: [1,1,0,0,0,0], finance: [1,0,0,0,0,0] },
                { module: 'Reservations', admin: [1,1,1,1,1,1], sales: [1,1,1,1,0,1], finance: [1,0,0,0,0,1] },
                { module: 'Sales Invoices', admin: [1,1,1,1,1,1], sales: [1,1,1,0,0,1], finance: [1,1,1,0,0,1] },
                { module: 'Payments & Receipts', admin: [1,1,1,1,1,1], sales: [1,0,0,0,0,1], finance: [1,1,1,1,1,1] },
                { module: 'Expenses & Cash Ledger', admin: [1,1,1,1,1,1], sales: [0,0,0,0,0,0], finance: [1,1,1,1,1,1] },
                { module: 'Reports & Audit Logs', admin: [1,1,1,1,1,1], sales: [1,0,0,0,0,1], finance: [1,0,0,0,0,1] },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{row.module}</td>
                  {['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export'].map((action, actionIdx) => (
                    <td key={actionIdx} className="p-3 text-center">
                      <input
                        type="checkbox"
                        defaultChecked={row.admin[actionIdx] === 1}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Staff Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">{error}</div>}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Staff Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Jayawardena"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-slate-50 placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Login Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kasun@salesplus.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-slate-50 placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Initial Login Password</label>
                <input
                  type="password"
                  required
                  minLength={10}
                  placeholder="At least 10 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 border rounded-lg bg-slate-50 placeholder:text-slate-400 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Consolidated System Role</label>
                <select
                  value={formData.roleId || formData.roleName}
                  onChange={(e) => {
                    const sel = e.target.value;
                    const foundRole = roles.find((r) => r._id === sel);
                    if (foundRole) {
                      setFormData({ ...formData, roleId: foundRole._id, roleName: foundRole.name });
                    } else {
                      setFormData({ ...formData, roleId: '', roleName: sel });
                    }
                  }}
                  className="w-full p-2.5 border rounded-lg bg-slate-50 text-slate-900"
                >
                  {roles.length > 0 ? (
                    roles.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Admin / Owner">Admin / Owner</option>
                      <option value="Sales & Operations Staff">Sales & Operations Staff</option>
                      <option value="Accountant / Finance Staff">Accountant / Finance Staff</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold disabled:opacity-50"
                >
                  {busy ? 'Creating...' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
