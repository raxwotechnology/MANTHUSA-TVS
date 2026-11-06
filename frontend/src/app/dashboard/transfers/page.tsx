"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArrowLeftRight, Plus, Building2, CheckCircle2, Clock, Truck, X, FileDown, FileSpreadsheet } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { exportPdf, exportExcel } from '@/lib/exportUtils';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    transferId: `TRF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    vehicleId: '',
    fromBranchId: '',
    toBranchId: '',
    date: new Date().toISOString().split('T')[0],
    driver: '',
    transportCost: '15000',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [transfersRes, vehiclesRes, branchesRes] = await Promise.all([
        apiFetch('/vehicle-transfers'),
        apiFetch('/vehicles'),
        apiFetch('/branches'),
      ]);

      if (transfersRes.ok) {
        const rows = await transfersRes.json();
        setTransfers(
          rows.map((row: any) => ({
            ...row,
            vehicleName:
              row.vehicle?.modelName ||
              `${row.vehicle?.make || 'TVS'} ${row.vehicle?.model || ''} ${row.vehicle?.variant || ''}`.trim() ||
              'TVS Motorcycle',
            fromBranch: row.fromBranch?.name || '—',
            toBranch: row.toBranch?.name || '—',
            date: row.transferDate ? new Date(row.transferDate).toLocaleDateString() : '—',
            driver: row.driverName || '—',
            transportCost: Number(row.transportCost || 0),
          }))
        );
      }

      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (branchesRes.ok) setBranches(await branchesRes.json());
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleVehicleChange = (vId: string) => {
    const selectedVeh = vehicles.find((v) => v._id === vId);
    let fromId = form.fromBranchId;
    if (selectedVeh?.branch) {
      fromId = typeof selectedVeh.branch === 'object' ? selectedVeh.branch._id : selectedVeh.branch;
    } else if (branches.length > 0 && !fromId) {
      fromId = branches[0]._id;
    }

    setForm((prev) => ({
      ...prev,
      vehicleId: vId,
      fromBranchId: fromId,
      toBranchId: prev.toBranchId === fromId ? '' : prev.toBranchId,
    }));
  };

  const saveTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicleId || !form.fromBranchId || !form.toBranchId) {
      window.alert('Please select a TVS motorcycle, a source branch, and a destination branch.');
      return;
    }
    if (form.fromBranchId === form.toBranchId) {
      window.alert('Source branch and destination branch cannot be the same.');
      return;
    }

    setSaving(true);
    try {
      const response = await apiFetch('/vehicle-transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transferId: form.transferId,
          vehicle: form.vehicleId,
          fromBranch: form.fromBranchId,
          toBranch: form.toBranchId,
          transferDate: form.date,
          driverName: form.driver,
          transportCost: Number(form.transportCost || 0),
          status: 'Pending',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Could not save branch transfer.');
      }

      await loadData();
      setShowAddModal(false);
      setForm({
        transferId: `TRF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        vehicleId: '',
        fromBranchId: '',
        toBranchId: '',
        date: new Date().toISOString().split('T')[0],
        driver: '',
        transportCost: '15000',
      });
    } catch (error: any) {
      window.alert(error.message || 'Could not save transfer.');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/vehicle-transfers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        window.alert(err.message || 'Could not update status');
      }
    } catch {
      window.alert('Network error updating status');
    }
  };

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Multi-Branch Stock Transfers</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">TVS Hub</span>
          </div>
          <p className="text-xs text-slate-500">
            Dispatch, track, and relocate TVS motorcycles between Colombo, Kandy, Kurunegala, and Galle showrooms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/branches"
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition-colors"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Manage Dealership Branches</span>
          </Link>

          <button
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>New Stock Transfer</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <th className="py-3 px-4">Transfer #</th>
                <th className="py-3 px-4">TVS Motorcycle</th>
                <th className="py-3 px-4">Dispatch Branch</th>
                <th className="py-3 px-4">Destination Branch</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Transit Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transfers.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No branch transfers recorded yet. Click &quot;New Stock Transfer&quot; to initiate one.
                  </td>
                </tr>
              )}
              {transfers.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.transferId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{t.vehicleName}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{t.fromBranch}</td>
                  <td className="py-3 px-4 font-semibold text-blue-600">{t.toBranch}</td>
                  <td className="py-3 px-4 text-slate-500">{t.date}</td>
                  <td className="py-3 px-4 text-slate-600">{t.driver}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    LKR {(t.transportCost || 0).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {t.status !== 'Completed' ? (
                      <button
                        onClick={() => updateStatus(t._id, 'Completed')}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 rounded-lg text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Received</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Received
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Initiate Branch Stock Transfer</h3>
                <p className="text-[11px] text-slate-500">Relocate TVS bikes between authorized branches</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveTransfer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Transfer Reference #</label>
                <input
                  type="text"
                  required
                  value={form.transferId}
                  onChange={(e) => setForm({ ...form, transferId: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 font-mono bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select TVS Motorcycle *</label>
                <select
                  required
                  value={form.vehicleId}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
                >
                  <option value="">-- Choose TVS Bike --</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.make} {v.model} {v.variant || ''} ({v.color || 'Standard'}) - {v.chassisNumber || v.stockNumber || 'In Stock'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Branch *</label>
                  <select
                    required
                    value={form.fromBranchId}
                    onChange={(e) => setForm({ ...form, fromBranchId: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
                  >
                    <option value="">-- Source Branch --</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Branch *</label>
                  <select
                    required
                    value={form.toBranchId}
                    onChange={(e) => setForm({ ...form, toBranchId: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 bg-white text-slate-900"
                  >
                    <option value="">-- Destination --</option>
                    {branches
                      .filter((b) => b._id !== form.fromBranchId)
                      .map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transfer Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transport Cost (LKR)</label>
                  <input
                    type="number"
                    value={form.transportCost}
                    onChange={(e) => setForm({ ...form, transportCost: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 bg-white"
                    placeholder="e.g. 15000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Driver / Logistics Contact</label>
                <input
                  type="text"
                  placeholder="e.g. Sunera Fernando (+94 77 987 6543)"
                  value={form.driver}
                  onChange={(e) => setForm({ ...form, driver: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-900 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Dispatch Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
