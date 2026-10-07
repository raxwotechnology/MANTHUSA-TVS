"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import { Building2, Plus, Phone, Mail, Percent, Calendar, Trash2 } from 'lucide-react';

export default function LeasingPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    defaultInterestRate: 12.5,
    maxLoanTenureMonths: 60,
    notes: '',
  });

  const loadData = async () => {
    try {
      const res = await apiFetch('/leasing-partners');
      if (res.ok) setPartners(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/leasing-partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        loadData();
      } else {
        alert('Could not save leasing partner.');
      }
    } catch {
      alert('Network error.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this finance partner?')) return;
    try {
      const res = await apiFetch(`/leasing-partners/${id}`, { method: 'DELETE' });
      if (res.ok) loadData();
    } catch {
      alert('Network error.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance & Leasing Partners Directory</h1>
            <p className="text-xs text-slate-500">Manage approved leasing companies, interest rates, and loan tenure limits</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Leasing Partner</span>
          </button>
        </div>

        {/* Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p) => (
            <div key={p._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">{p.name}</h3>
                </div>
                <button onClick={() => handleDelete(p._id)} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p><span className="font-semibold text-slate-700">Contact Person:</span> {p.contactPerson || 'N/A'}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {p.phone || 'N/A'}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {p.email || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Default Interest</span>
                  <span className="font-bold text-emerald-600">{p.defaultInterestRate || 12}% p.a.</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Max Tenure</span>
                  <span className="font-bold text-blue-600">{p.maxLoanTenureMonths || 60} Months</span>
                </div>
              </div>
            </div>
          ))}

          {partners.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No leasing partners registered yet.</p>
              <p className="text-xs">Click &quot;Add Leasing Partner&quot; to add partner finance companies.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900 border-b pb-2">Add Finance / Leasing Partner</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. LOLC Finance PLC"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                    <input
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Interest Rate (% p.a.)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.defaultInterestRate}
                      onChange={(e) => setForm({ ...form, defaultInterestRate: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Max Tenure (Months)</label>
                    <input
                      type="number"
                      value={form.maxLoanTenureMonths}
                      onChange={(e) => setForm({ ...form, maxLoanTenureMonths: parseInt(e.target.value) || 60 })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Save Partner</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
