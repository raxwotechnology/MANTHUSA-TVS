"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCheck, Plus, Search, PhoneCall, Calendar, Tag, CheckCircle2, Clock, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Lead {
  _id: string;
  leadId: string;
  customerName: string;
  interestedVehicle: string;
  source: string;
  budget: number;
  status: string;
  priority: string;
  customer?: { _id: string };
  interestedVehicleId?: string;
  inquiryType?: string;
  inquiryMessage?: string;
  preferredDate?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [followUp, setFollowUp] = useState({ followUpDate: '', followUpTime: '', type: 'Phone', notes: '' });

  const [newLead, setNewLead] = useState({
    customerName: '',
    customerPhone: '',
    interestedVehicle: '',
    source: 'Website',
    budget: '',
    status: 'New',
    priority: 'Medium'
  });

  const loadLeads = async () => {
    try {
      const response = await apiFetch('/leads');
      if (!response.ok) throw new Error('Could not load leads.');
      const data = await response.json();
      setLeads(data.map((lead: any) => ({
        ...lead,
        customerName: lead.customer?.fullName || lead.customerName || 'Customer',
        interestedVehicleId: typeof lead.interestedVehicle === 'object' ? lead.interestedVehicle?._id : undefined,
        interestedVehicle: lead.interestedVehicleText || (typeof lead.interestedVehicle === 'object' ? `${lead.interestedVehicle?.make || ''} ${lead.interestedVehicle?.model || ''}`.trim() : (lead.interestedVehicle || '—')),
        budget: Number(lead.budget || 0),
      })));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads.');
    }
  };

  React.useEffect(() => { void loadLeads(); }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const customerResponse = await apiFetch('/customers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: newLead.customerName, phone: newLead.customerPhone, customerType: 'Individual' }),
      });
      if (!customerResponse.ok) throw new Error('Could not save customer. Check the customer details and try again.');
      const customer = await customerResponse.json();
      const response = await apiFetch('/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: customer._id, interestedVehicleText: newLead.interestedVehicle, source: newLead.source, budget: newLead.budget, status: newLead.status, priority: newLead.priority }),
      });
      if (!response.ok) throw new Error('Customer was saved, but lead creation failed.');
      await loadLeads();
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save lead.');
    }
  };

  const saveFollowUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedLead?.customer?._id) { setError('This lead has no linked customer record.'); return; }
    try {
      let response: Response;
      if (followUp.type === 'Test Drive') {
        if (!selectedLead.interestedVehicleId) throw new Error('This lead has no linked vehicle for a test drive.');
        const token = window.localStorage.getItem('token') || '';
        const encodedPayload = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
        const claims = encodedPayload ? JSON.parse(window.atob(encodedPayload)) : {};
        if (!claims.sub) throw new Error('Could not identify the signed-in salesperson.');
        response = await apiFetch('/test-drives', { method: 'POST', body: JSON.stringify({ customer: selectedLead.customer._id, vehicle: selectedLead.interestedVehicleId, salesperson: claims.sub, date: followUp.followUpDate, startTime: followUp.followUpTime, status: 'Scheduled', feedback: `Website request: ${selectedLead.inquiryMessage || ''}` }) });
      } else response = await apiFetch('/follow-ups', {
        method: 'POST',
        body: JSON.stringify({ ...followUp, customer: selectedLead.customer._id, lead: selectedLead._id, status: 'Scheduled' }),
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Could not save the follow-up.');
      setSelectedLead(null);
      setFollowUp({ followUpDate: '', followUpTime: '', type: 'Phone', notes: '' });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the follow-up.');
    }
  };

  const convertToReservation = async (lead: Lead) => {
    if (!lead.customer?._id || !lead.interestedVehicleId) { setError('This lead needs a linked customer and vehicle before it can be reserved.'); return; }
    if (!window.confirm(`Reserve ${lead.interestedVehicle} for ${lead.customerName}? This will mark the vehicle Reserved.`)) return;
    const depositText = window.prompt('Reservation deposit (LKR)', '0');
    if (depositText === null) return;
    const deposit = Number(depositText);
    if (!Number.isFinite(deposit) || deposit < 0) { setError('Enter a valid non-negative deposit amount.'); return; }
    const expiryDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    try {
      const response = await apiFetch('/reservations', { method: 'POST', body: JSON.stringify({ customer: lead.customer._id, vehicle: lead.interestedVehicleId, reservationDeposit: deposit, expiryDate, notes: `Converted from lead ${lead.leadId}` }) });
      if (!response.ok) throw new Error((await response.json()).message || 'Could not convert lead to reservation.');
      await apiFetch(`/leads/${lead._id}`, { method: 'PUT', body: JSON.stringify({ status: 'Reserved' }) });
      await loadLeads(); setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not create reservation.'); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">New</span>;
      case 'Test Drive': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Test Drive</span>;
      case 'Quotation': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Quotation</span>;
      case 'Reserved': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Reserved</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">CRM & Sales Leads Pipeline</h1>
          <p className="text-xs text-slate-500">Track inquiries from Facebook, TikTok, Website, WhatsApp, Walk-ins and manage follow-ups</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Sales Lead</span>
        </button>
      </div>

      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Lead ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Interested Vehicle</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length === 0 && <tr><td className="p-6 text-center text-slate-500" colSpan={8}>No leads found.</td></tr>}
              {leads.map((l) => (
                <tr key={l._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{l.leadId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{l.customerName}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{l.interestedVehicle}</td>
                  <td className="py-3 px-4 text-slate-600">{l.source}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">LKR {l.budget.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold text-rose-600">{l.priority}</td>
                  <td className="py-3 px-4">{getStatusBadge(l.status)}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-1"><button onClick={() => { setFollowUp({ followUpDate: l.preferredDate?.slice(0, 10) || '', followUpTime: '', type: l.inquiryType === 'Test Drive' ? 'Test Drive' : 'Phone', notes: l.inquiryType === 'Test Drive' ? `Public test drive request: ${l.inquiryMessage || ''}` : '' }); setSelectedLead(l); }} className="px-2 py-1 bg-blue-50 text-blue-700 font-semibold text-[11px] rounded-lg border border-blue-200">Follow-up / test drive</button>{l.interestedVehicleId && l.status !== 'Reserved' && <button onClick={() => void convertToReservation(l)} className="px-2 py-1 bg-emerald-50 text-emerald-700 font-semibold text-[11px] rounded-lg border border-emerald-200">Reserve</button>}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create Sales Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Customer Name</label>
                <input type="text" required placeholder="e.g. Ruwan Gunawardena" value={newLead.customerName} onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Customer Phone</label>
                <input type="tel" required placeholder="e.g. +94 77 123 4567" value={newLead.customerPhone} onChange={(e) => setNewLead({ ...newLead, customerPhone: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Interested Vehicle</label>
                <input type="text" required placeholder="e.g. Toyota Premio / Vezel RS" value={newLead.interestedVehicle} onChange={(e) => setNewLead({ ...newLead, interestedVehicle: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Lead Source</label>
                  <select value={newLead.source} onChange={(e) => setNewLead({ ...newLead, source: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50">
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Website">Website</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Phone">Phone</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Budget (LKR)</label>
                  <input type="number" placeholder="e.g. 12,000,000" value={newLead.budget} onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedLead && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
        <form onSubmit={saveFollowUp} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between"><h3 className="font-bold">Follow up with {selectedLead.customerName}</h3><button type="button" onClick={() => setSelectedLead(null)}><X className="h-5 w-5" /></button></div>
          <label className="block text-xs font-semibold">Date<input required type="date" value={followUp.followUpDate} onChange={(e) => setFollowUp({ ...followUp, followUpDate: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>
          <label className="block text-xs font-semibold">Time<input type="time" value={followUp.followUpTime} onChange={(e) => setFollowUp({ ...followUp, followUpTime: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>
          <label className="block text-xs font-semibold">Type<select value={followUp.type} onChange={(e) => setFollowUp({ ...followUp, type: e.target.value })} className="mt-1 w-full rounded-lg border p-2"><option>Phone</option><option>WhatsApp</option><option>Email</option><option>Meeting</option><option>Test Drive</option></select></label>
          <label className="block text-xs font-semibold">Notes<textarea value={followUp.notes} onChange={(e) => setFollowUp({ ...followUp, notes: e.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>
          <button className="w-full rounded-lg bg-blue-600 p-2 font-semibold text-white">{followUp.type === 'Test Drive' ? 'Confirm Test Drive Appointment' : 'Save Follow-up'}</button>
        </form>
      </div>}
    </DashboardLayout>
  );
}

