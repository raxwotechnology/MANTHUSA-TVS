"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import {
  Users,
  Plus,
  Search,
  Upload,
  X,
  Edit,
  Trash2,
  Camera,
  AlertCircle,
  FileText,
  DollarSign,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';

interface EmployeeUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: any;
  branch?: any;
  nic?: string;
  salary?: number;
  documents?: string[];
  permissions?: string[];
  isActive?: boolean;
  createdAt?: string;
}

interface UploadedDoc {
  name: string;
  url: string;
  uploadedAt?: string;
}

const AVAILABLE_MODULES = [
  { id: 'inventory', label: 'Vehicles / Inventory' },
  { id: 'sales', label: 'Sales & Invoicing' },
  { id: 'crm', label: 'CRM & Sales Leads' },
  { id: 'finance', label: 'Finance & Cash Flow' },
  { id: 'testDrives', label: 'Test Drive Bookings' },
  { id: 'handovers', label: 'Vehicle Handovers' },
  { id: 'suppliers', label: 'Suppliers & Purchases' },
  { id: 'reports', label: 'Reports & Analytics' },
  { id: 'employees', label: 'Employees & Roles' },
  { id: 'leasing', label: 'Leasing & Installments' },
];

const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  'Admin / Owner': AVAILABLE_MODULES.map((m) => m.id),
  'Sales & Operations': ['inventory', 'sales', 'crm', 'testDrives', 'handovers', 'leasing'],
  'Accountant / Finance Staff': ['finance', 'sales', 'reports', 'leasing'],
  'Inventory Manager': ['inventory', 'handovers', 'suppliers', 'reports'],
  'Customer': ['inventory', 'testDrives']
};

export default function UsersPermissionsPage() {
  const [usersList, setUsersList] = useState<EmployeeUser[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<EmployeeUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<EmployeeUser | null>(null);
  const [busy, setBusy] = useState(false);

  // Form State matching the requested design
  const initialForm = {
    name: '',
    email: '',
    password: '',
    phone: '',
    avatar: '',
    roleId: '',
    branchId: '',
    nic: '',
    salary: '',
    documents: [] as UploadedDoc[],
    permissions: [] as string[]
  };

  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, branchesRes] = await Promise.all([
        apiFetch('/users'),
        apiFetch('/roles'),
        apiFetch('/branches')
      ]);

      if (rolesRes.ok) setRoles(await rolesRes.json());
      if (branchesRes.ok) setBranches(await branchesRes.json());
      if (usersRes.ok) setUsersList(await usersRes.json());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load staff accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const parseDocuments = (docs: any[] = []): UploadedDoc[] => {
    return docs.map((doc, idx) => {
      if (typeof doc === 'string') {
        try {
          if (doc.startsWith('{')) {
            return JSON.parse(doc);
          }
        } catch {}
        return { name: `Document #${idx + 1}`, url: doc };
      }
      return doc;
    });
  };

  const openAddModal = () => {
    setEditingUser(null);
    const defaultRole = roles[0]?._id || '';
    const defaultRoleName = roles[0]?.name || 'Sales & Operations';
    setForm({
      ...initialForm,
      roleId: defaultRole,
      permissions: DEFAULT_ROLE_PERMISSIONS[defaultRoleName] || DEFAULT_ROLE_PERMISSIONS['Sales & Operations']
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (user: EmployeeUser) => {
    setEditingUser(user);
    const roleId = typeof user.role === 'object' ? user.role?._id || '' : user.role || '';
    const branchId = typeof user.branch === 'object' ? user.branch?._id || '' : user.branch || '';
    const roleName = typeof user.role === 'object' ? user.role?.name || '' : '';

    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      roleId: roleId,
      branchId: branchId,
      nic: user.nic || '',
      salary: user.salary !== undefined && user.salary !== null ? String(user.salary) : '',
      documents: parseDocuments(user.documents),
      permissions: user.permissions && user.permissions.length ? user.permissions : (DEFAULT_ROLE_PERMISSIONS[roleName] || ['inventory', 'sales'])
    });
    setError('');
    setShowModal(true);
  };

  const handleRoleChange = (selectedRoleId: string) => {
    const roleObj = roles.find((r) => r._id === selectedRoleId);
    const roleName = roleObj ? roleObj.name : '';
    const recommendedPermissions = DEFAULT_ROLE_PERMISSIONS[roleName] || DEFAULT_ROLE_PERMISSIONS['Sales & Operations'];
    setForm({
      ...form,
      roleId: selectedRoleId,
      permissions: recommendedPermissions
    });
  };

  const togglePermission = (permId: string) => {
    setForm((prev) => {
      const exists = prev.permissions.includes(permId);
      const updated = exists ? prev.permissions.filter((p) => p !== permId) : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setForm((prev) => ({ ...prev, avatar: event.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const docObj: UploadedDoc = {
          name: fileName,
          url: event.target?.result as string,
          uploadedAt: new Date().toISOString()
        };
        setForm((prev) => ({
          ...prev,
          documents: [...prev.documents, docObj]
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const payload: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar,
        nic: form.nic.trim(),
        salary: form.salary ? Number(form.salary) : undefined,
        permissions: form.permissions,
        documents: form.documents.map((d) => JSON.stringify(d))
      };

      if (form.roleId) payload.role = form.roleId;
      if (form.branchId) payload.branch = form.branchId;
      else payload.branch = null;

      if (form.password && form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (editingUser) {
        const res = await apiFetch(`/users/${editingUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Could not update employee details.');
        }
      } else {
        if (!form.password || form.password.length < 6) {
          throw new Error('Initial password must contain at least 6 characters.');
        }
        const res = await apiFetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Could not create employee account. Email may already exist.');
        }
      }

      setShowModal(false);
      setEditingUser(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setBusy(true);
    try {
      const res = await apiFetch(`/users/${deletingUser._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Could not delete user account.');
      }
      setDeletingUser(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting account');
    } finally {
      setBusy(false);
    }
  };

  const getRoleName = (u: EmployeeUser) => {
    if (typeof u.role === 'object' && u.role?.name) return u.role.name;
    if (typeof u.role === 'string') return u.role;
    return 'Staff';
  };

  const getBranchName = (u: EmployeeUser) => {
    if (typeof u.branch === 'object' && u.branch?.name) return u.branch.name;
    return 'None (Global)';
  };

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const roleName = getRoleName(u).toLowerCase();
      const branchName = getBranchName(u).toLowerCase();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q)) ||
        (u.nic && u.nic.toLowerCase().includes(q)) ||
        roleName.includes(q) ||
        branchName.includes(q);

      const matchesRole = filterRole === 'ALL' || getRoleName(u) === filterRole;
      const matchesDate = isWithinDateRange(u.createdAt, startDate, endDate);
      return matchesSearch && matchesRole && matchesDate;
    });
  }, [usersList, searchQuery, filterRole, startDate, endDate]);

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Staff & Employee Management</h1>
          <p className="text-xs text-slate-500">
            Manage employee profiles, role permissions, branch assignments, documents, and compensation
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Staff</span>
            <span className="p-2 bg-slate-100 rounded-xl text-slate-700"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{usersList.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active & registered users</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-600">Admin & Management</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-purple-700 mt-2">
            {usersList.filter((u) => getRoleName(u).includes('Admin')).length}
          </div>
          <p className="text-[11px] text-purple-500 mt-0.5">Full control access</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600">Sales & Operations</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">
            {usersList.filter((u) => getRoleName(u).includes('Sales')).length}
          </div>
          <p className="text-[11px] text-blue-500 mt-0.5">Showroom & CRM staff</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Finance & Accounts</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {usersList.filter((u) => getRoleName(u).includes('Finance') || getRoleName(u).includes('Accountant')).length}
          </div>
          <p className="text-[11px] text-emerald-500 mt-0.5">Ledger & payments staff</p>
        </div>
      </div>

      {/* Filter and Search Bar with Date Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, phone, NIC, branch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
              />
            </div>

            <DateFilterControl
              startDate={startDate}
              endDate={endDate}
              onDateChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              label="Joined Date:"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto">
            {['ALL', 'Admin / Owner', 'Sales & Operations', 'Accountant / Finance Staff', 'Customer'].map((roleKey) => (
              <button
                key={roleKey}
                onClick={() => setFilterRole(roleKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  filterRole === roleKey
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {roleKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Registered Staff Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Contact & NIC</th>
                <th className="py-3 px-4">Role & Permissions</th>
                <th className="py-3 px-4">Assigned Branch</th>
                <th className="py-3 px-4">Monthly Salary</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const roleTitle = getRoleName(u);
                const docs = parseDocuments(u.documents);
                return (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact & NIC */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{u.phone || 'â€”'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIC: {u.nic || 'N/A'}</div>
                    </td>

                    {/* Role & Permissions */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block mb-1 ${
                        roleTitle.includes('Admin') ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        roleTitle.includes('Sales') ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        roleTitle.includes('Finance') || roleTitle.includes('Accountant') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {roleTitle}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {u.permissions?.length ? `${u.permissions.length} modules granted` : 'Standard role access'}
                      </div>
                    </td>

                    {/* Assigned Branch */}
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {getBranchName(u)}
                    </td>

                    {/* Salary */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {u.salary ? `LKR ${Number(u.salary).toLocaleString()}` : 'â€”'}
                    </td>

                    {/* Documents */}
                    <td className="py-3 px-4">
                      {docs.length > 0 ? (
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-mono text-[10px] flex items-center gap-1 w-fit">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span>{docs.length} uploaded</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {u.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          title="Edit Employee"
                          className="px-2.5 py-1 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingUser(u)}
                          title="Delete Account"
                          className="p-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No staff accounts found.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click &quot;Add Employee&quot; to onboard staff members.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Employee Modal (Matching the uploaded design) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {editingUser ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
              {/* Profile Photo Section */}
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 relative overflow-hidden group shrink-0">
                  {form.avatar ? (
                    <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 p-2">
                      <Camera className="w-6 h-6 mx-auto mb-1 opacity-60" />
                      <span className="text-[10px] block font-medium">No Photo</span>
                    </div>
                  )}
                  {form.avatar && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, avatar: '' })}
                      className="absolute inset-0 bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold transition-opacity"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <div className="font-bold text-sm text-slate-900 mb-1">Profile Photo</div>
                  <p className="text-[11px] text-slate-400 mb-2">Upload a professional headshot for employee identification</p>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
              </div>

              {/* 2-Column: Basic Info vs Employment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Left Column: Basic Info */}
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                    Basic Info
                  </h3>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asitha lakmal"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. asitha200012@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {editingUser ? 'Password (Leave blank to keep current)' : 'Password (At least 6 characters) *'}
                    </label>
                    <input
                      type="password"
                      required={!editingUser}
                      placeholder={editingUser ? 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' : 'Enter login password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. +94786582311"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Right Column: Employment Details */}
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                    Employment Details
                  </h3>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                    <select
                      value={form.roleId}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                    >
                      {roles.map((r) => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Branch/Store</label>
                    <select
                      value={form.branchId}
                      onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="">None (Global)</option>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">NIC / Passport</label>
                    <input
                      type="text"
                      placeholder="e.g. 199012345678 / 901234567V"
                      value={form.nic}
                      onChange={(e) => setForm({ ...form, nic: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Salary (Monthly LKR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 150000"
                      value={form.salary}
                      onChange={(e) => setForm({ ...form, salary: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Agreements & Documents Section */}
              <div className="bg-slate-50/70 p-4.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Agreements & Documents</div>
                    <div className="text-[11px] text-slate-400">Employee contracts, NDA, NIC copy, police report</div>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-blue-600 rounded-xl font-semibold text-xs shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Add Document</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                  </label>
                </div>

                {form.documents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1">No documents uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {form.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate text-xs font-semibold text-slate-700" title={doc.name}>
                            {doc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold"
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => removeDocument(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Module Access Permissions */}
              <div className="space-y-2.5 pt-1">
                <div className="border-b border-slate-200 pb-2">
                  <div className="font-bold text-slate-900 text-sm">Module Access Permissions</div>
                  <div className="text-[11px] text-slate-500">Enable or restrict system modules for this employee account</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {AVAILABLE_MODULES.map((mod) => {
                    const isChecked = form.permissions.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50/60 border-blue-300 text-blue-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(mod.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-xs">{mod.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {busy ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200 p-6 text-center text-xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Delete Employee Account?</h3>
            <p className="text-slate-500 mb-5">
              Are you sure you want to delete <span className="font-bold text-slate-800">{deletingUser.name}</span>? They will lose access to the system.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs"
              >
                {busy ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
