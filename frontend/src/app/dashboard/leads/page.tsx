"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserCheck, Plus, Search, PhoneCall, Calendar, Tag, CheckCircle2, Clock, X } from 'lucide-react';

interface Lead {
  _id: string;
  leadId: string;
  customerName: string;
  interestedVehicle: string;
  source: string;
  budget: number;
  status: string;
  priority: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      _id: '1',
      leadId: 'LEAD-001',
      customerName: 'Kamal Gunaratne',
      interestedVehicle: 'Toyota Premio F EX 2019',
      source: 'Website',
      budget: 13500000,
      status: 'Quotation',
      priority: 'High'
    },
    {
      _id: '2',
      leadId: 'LEAD-002',
      customerName: 'Saman Wijesinghe',
      interestedVehicle: 'Honda Vezel Z Sensing 2018',
      source: 'Facebook',
      budget: 10500000,
      status: 'Test Drive',
      priority: 'Medium'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newLead, setNewLead] = useState({
    customerName: '',
    interestedVehicle: 'Toyota Premio',
    source: 'Website',
    budget: 12000000,
    status: 'New',
    priority: 'Medium'
  });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const item: Lead = {
      _id: Date.now().toString(),
      leadId: `LEAD-00${leads.length + 1}`,
      ...newLead
    };
    setLeads([item, ...leads]);
    setShowAddModal(false);
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
                    <button className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-[11px] rounded-lg border border-blue-200">Log Follow-up</button>
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
                <input type="text" required value={newLead.customerName} onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Interested Vehicle</label>
                <input type="text" required value={newLead.interestedVehicle} onChange={(e) => setNewLead({ ...newLead, interestedVehicle: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50" />
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
                  <input type="number" value={newLead.budget} onChange={(e) => setNewLead({ ...newLead, budget: Number(e.target.value) })} className="w-full p-2 border rounded-lg bg-slate-50" />
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
    </DashboardLayout>
  );
}

