"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  ArrowLeftRight,
  Search,
  X,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';
import { exportPdf, exportExcel } from '@/lib/exportUtils';

interface Branch {
  _id: string;
  name: string;
  location: string;
  contactNumber: string;
  isActive: boolean;
  createdAt?: string;
}

export default function DealershipBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    location: '',
    contactNumber: '',
    isActive: true,
  });

  const loadBranches = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/branches');
      if (res.ok) {
        setBranches(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBranches();
  }, []);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setForm({
      name: '',
      location: '',
      contactNumber: '+94 ',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setForm({
      name: branch.name,
      location: branch.location || '',
      contactNumber: branch.contactNumber || '',
      isActive: branch.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      window.alert('Branch name is required.');
      return;
    }

    setSaving(true);
    try {
      const url = editingBranch ? `/branches/${editingBranch._id}` : '/branches';
      const method = editingBranch ? 'PATCH' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Could not save branch details.');
      }

      await loadBranches();
      setShowModal(false);
    } catch (err: any) {
      window.alert(err.message || 'Error saving branch.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBranch) return;
    try {
      const res = await apiFetch(`/branches/${deletingBranch._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBranches((prev) => prev.filter((b) => b._id !== deletingBranch._id));
        setDeletingBranch(null);
      } else {
        const err = await res.json().catch(() => ({}));
        window.alert(err.message || 'Could not delete branch.');
      }
    } catch {
      window.alert('Network error deleting branch.');
    }
  };

  const filtered = branches.filter((b) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (b.name || '').toLowerCase().includes(q) ||
        (b.location || '').toLowerCase().includes(q) ||
        (b.contactNumber || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (!isWithinDateRange((b as any).createdAt, startDate, endDate)) return false;
    return true;
  });

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dealership Showrooms & Branches</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Official TVS Network</span>
          </div>
          <p className="text-xs text-slate-500">
            Manage official TVS regional branches, showroom addresses, hotlines, and inventory allocation nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/transfers"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4 text-slate-600" />
            <span>Multi-Branch Stock Transfers</span>
          </Link>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add TVS Branch</span>
          </button>
        </div>
      </div>

      {/* Search Bar with Date Filter */}
      <div className="mb-6 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search branches by city, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <DateFilterControl
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            label="Created Date:"
          />
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filtered.map((branch) => (
          <div
            key={branch._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{branch.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        branch.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {branch.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active Showroom</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-slate-400" />
                          <span>Inactive</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(branch)}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                    title="Edit Branch"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingBranch(branch)}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{branch.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{branch.contactNumber || 'No phone recorded'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">TVS Sales Network</span>
              <Link
                href="/dashboard/transfers"
                className="text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1"
              >
                <span>Stock Transfers</span>
                <ArrowLeftRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            No dealership branches found matching your search.
          </div>
        )}
      </div>

      {/* Add / Edit Branch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingBranch ? 'Edit Dealership Branch' : 'Add New TVS Branch'}
                </h3>
                <p className="text-[11px] text-slate-500">Official dealership regional node</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Matara TVS Center"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Showroom Address / Location</label>
                <input
                  type="text"
                  placeholder="e.g. No. 120, Anagarika Dharmapala Mawatha, Matara"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hotline / Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. +94 41 222 3400"
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveBranch"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="isActiveBranch" className="font-semibold text-slate-700 cursor-pointer">
                  Branch is operational & active for vehicle stock
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingBranch ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBranch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 text-slate-900">
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Branch?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to delete <span className="font-bold">{deletingBranch.name}</span>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingBranch(null)}
                className="px-4 py-2 border rounded-xl text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
