"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  UserCheck,
  Plus,
  Search,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  ArrowRight,
  Flame,
  MapPin,
  SlidersHorizontal
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Lead {
  _id: string;
  leadId: string;
  customerName: string;
  customerPhone?: string;
  interestedVehicle: string;
  modelName?: string;
  variantName?: string;
  selectedColor?: string;
  preferredBranchName?: string;
  source: string;
  budget: number;
  status: string;
  priority: string;
  customer?: { _id: string; fullName?: string; phone?: string };
  interestedVehicleId?: string;
  inquiryType?: string;
  inquiryMessage?: string;
  preferredDate?: string;
  bookingId?: any;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [followUp, setFollowUp] = useState({ followUpDate: '', followUpTime: '', type: 'Phone', notes: '' });

  const [newLead, setNewLead] = useState({
    customerName: '',
    customerPhone: '',
    modelName: 'Apache RTR 160 4V',
    variantName: 'Special Edition Disc',
    selectedColor: 'Matte Black',
    preferredBranchName: 'Colombo Central Flagship Hub',
    source: 'Showroom Walk-in',
    budget: '1025000',
    status: 'New Request',
    priority: 'Medium',
    inquiryMessage: ''
  });

  const loadLeads = async () => {
    try {
      const response = await apiFetch('/leads');
      if (!response.ok) throw new Error('Could not load requests.');
      const data = await response.json();
      setLeads(
        data.map((lead: any) => ({
          ...lead,
          customerName: lead.customer?.fullName || lead.customerName || 'Customer',
          customerPhone: lead.customer?.phone || '',
          interestedVehicleId: typeof lead.interestedVehicle === 'object' ? lead.interestedVehicle?._id : undefined,
          interestedVehicle:
            lead.interestedVehicleText ||
            (lead.modelName ? `${lead.modelName} ${lead.variantName || ''} (${lead.selectedColor || ''})`.trim() : 'TVS Motorcycle'),
          budget: Number(lead.budget || 0),
        }))
      );
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load requests.');
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const customerResponse = await apiFetch('/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newLead.customerName,
          phone: newLead.customerPhone,
          customerType: 'Individual',
        }),
      });
      if (!customerResponse.ok) throw new Error('Could not save customer.');
      const customer = await customerResponse.json();

      const response = await apiFetch('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customer._id,
          modelName: newLead.modelName,
          variantName: newLead.variantName,
          selectedColor: newLead.selectedColor,
          preferredBranchName: newLead.preferredBranchName,
          interestedVehicleText: `${newLead.modelName} ${newLead.variantName} (${newLead.selectedColor})`,
          source: newLead.source,
          budget: Number(newLead.budget || 0),
          status: newLead.status,
          priority: newLead.priority,
          inquiryMessage: newLead.inquiryMessage,
        }),
      });
      if (!response.ok) throw new Error('Could not create request.');
      await loadLeads();
      setSuccess('New TVS customer request created successfully!');
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save request.');
    }
  };

  // STAFF CONVERT REQUEST TO OFFICIAL BOOKING
  const handleConvertToBooking = async (lead: Lead) => {
    setConvertingId(lead._id);
    setError('');
    setSuccess('');

    try {
      const res = await apiFetch(`/leads/${lead._id}/convert-to-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Could not convert request to booking.');
      }
      const data = await res.json();
      setSuccess(`Request ${lead.leadId} successfully converted into Booking ${data.booking?.bookingNumber || ''}!`);
      await loadLeads();
    } catch (err: any) {
      setError(err.message || 'Failed to convert request to booking.');
    } finally {
      setConvertingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New Request':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">New Request</span>;
      case 'Converted to Booking':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Converted to Booking</span>;
      case 'Under Review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Under Review</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.customerName || '').toLowerCase().includes(q) ||
      (l.leadId || '').toLowerCase().includes(q) ||
      (l.interestedVehicle || '').toLowerCase().includes(q) ||
      (l.preferredBranchName || '').toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-red-600" />
            <span>TVS Customer Requests & CRM</span>
          </h1>
          <p className="text-xs text-slate-500">
            Track inquiries from Website Configurator, Showroom Walk-ins, WhatsApp & convert to confirmed bookings
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Request</span>
        </button>
      </div>

      {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}
      {success && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{success}</div>}

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, model, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Request #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">TVS Model & Variant</th>
                <th className="py-3 px-4">Color</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 && (
                <tr>
                  <td className="p-8 text-center text-slate-400" colSpan={8}>
                    No requests found matching your query.
                  </td>
                </tr>
              )}
              {filteredLeads.map((l) => (
                <tr key={l._id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{l.leadId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{l.customerName}</div>
                    {l.customerPhone && <div className="text-[11px] text-slate-500">{l.customerPhone}</div>}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{l.modelName || l.interestedVehicle}</div>
                    {l.variantName && <div className="text-[11px] text-slate-500">{l.variantName}</div>}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{l.selectedColor || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-600">{l.preferredBranchName || 'Colombo Hub'}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    LKR {Number(l.budget || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(l.status)}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      {l.status !== 'Converted to Booking' ? (
                        <button
                          type="button"
                          onClick={() => handleConvertToBooking(l)}
                          disabled={convertingId === l._id}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg transition-colors shadow-xs flex items-center gap-1 disabled:opacity-50"
                        >
                          <Flame className="w-3 h-3 fill-white" />
                          <span>{convertingId === l._id ? 'Converting...' : 'Convert to Booking'}</span>
                        </button>
                      ) : (
                        <Link
                          href="/dashboard/reservations"
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px] rounded-lg hover:bg-emerald-100 flex items-center gap-1"
                        >
                          <span>View Booking</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">New TVS Motorcycle Request</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwan Gunawardena"
                  value={newLead.customerName}
                  onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Customer Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0771234567"
                  value={newLead.customerPhone}
                  onChange={(e) => setNewLead({ ...newLead, customerPhone: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">TVS Model</label>
                  <select
                    value={newLead.modelName}
                    onChange={(e) => setNewLead({ ...newLead, modelName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  >
                    <option value="Apache RTR 160 4V">Apache RTR 160 4V</option>
                    <option value="Apache RTR 200 4V">Apache RTR 200 4V</option>
                    <option value="Apache RR 310">Apache RR 310</option>
                    <option value="NTORQ 125">NTORQ 125</option>
                    <option value="Jupiter 125">Jupiter 125</option>
                    <option value="Raider 125">Raider 125</option>
                    <option value="Ronin 225">Ronin 225</option>
                    <option value="XL 100 Heavy Duty">XL 100 Heavy Duty</option>
                    <option value="iQube Electric">iQube Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Variant</label>
                  <input
                    type="text"
                    value={newLead.variantName}
                    onChange={(e) => setNewLead({ ...newLead, variantName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Color</label>
                  <input
                    type="text"
                    value={newLead.selectedColor}
                    onChange={(e) => setNewLead({ ...newLead, selectedColor: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Branch</label>
                  <select
                    value={newLead.preferredBranchName}
                    onChange={(e) => setNewLead({ ...newLead, preferredBranchName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  >
                    <option value="Colombo Central Flagship Hub">Colombo Central Flagship Hub</option>
                    <option value="Kandy City TVS Showroom">Kandy City TVS Showroom</option>
                    <option value="Galle Coastal TVS Center">Galle Coastal TVS Center</option>
                    <option value="Kurunegala North TVS Sales Hub">Kurunegala North TVS Sales Hub</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  >
                    <option value="Website Configurator">Website Configurator</option>
                    <option value="Showroom Walk-in">Showroom Walk-in</option>
                    <option value="Hotline Phone Call">Hotline Phone Call</option>
                    <option value="WhatsApp Inquiry">WhatsApp Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Price / Budget</label>
                  <input
                    type="number"
                    value={newLead.budget}
                    onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Inquiry / Customer Notes</label>
                <textarea
                  rows={2}
                  value={newLead.inquiryMessage}
                  onChange={(e) => setNewLead({ ...newLead, inquiryMessage: e.target.value })}
                  placeholder="Notes on customer preference or leasing requirement..."
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 p-2.5 border rounded-xl bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
