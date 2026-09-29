"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, Plus, Search, Phone, Mail, MapPin, Briefcase, Clock, X, ChevronRight } from 'lucide-react';

interface Customer {
  _id: string;
  customerId: string;
  fullName: string;
  nicPassport: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  occupation: string;
  customerType: string;
}

import { apiFetch } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [selectedTimelineCustomer, setSelectedTimelineCustomer] = useState<Customer | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [timelineError, setTimelineError] = useState('');

  const openTimeline = async (customer: Customer) => {
    setSelectedTimelineCustomer(customer); setTimeline([]); setTimelineError('');
    try { const response = await apiFetch(`/customers/${customer._id}/timeline`); if (!response.ok) throw new Error('Could not load customer activity.'); setTimeline(await response.json()); }
    catch (error) { setTimelineError(error instanceof Error ? error.message : 'Could not load customer activity.'); }
  };

  const [newCust, setNewCust] = useState({
    fullName: '',
    nicPassport: '',
    phone: '',
    email: '',
    address: '',
    city: 'Colombo',
    occupation: '',
    customerType: 'Individual'
  });

  useEffect(() => {
    const fetchCust = async () => {
      try {
        const res = await apiFetch('/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.map((customer: any) => ({ ...customer, nicPassport: customer.nicOrPassport || customer.nicPassport || '' })));
        }
      } catch (err) {
        console.error('Failed to fetch customers', err);
      }
    };
    fetchCust();
  }, []);

  const handleAddCust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch(editingCustomer ? `/customers/${editingCustomer._id}` : '/customers', {
        method: editingCustomer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCust, nicOrPassport: newCust.nicPassport })
      });
      if (!response.ok) throw new Error('Could not save customer. Check the details and try again.');
      const saved = await response.json();
      setCustomers((current) => editingCustomer
        ? current.map((customer) => customer._id === editingCustomer._id ? { ...customer, ...saved, nicPassport: saved.nicOrPassport || saved.nicPassport || newCust.nicPassport } : customer)
        : [saved, ...current]);
      setShowAddModal(false);
      setEditingCustomer(null);
      setNewCust({ fullName: '', nicPassport: '', phone: '', email: '', address: '', city: 'Colombo', occupation: '', customerType: 'Individual' });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not connect to the server.');
    }
  };

  const deleteCustomer = async () => {
    if (!deletingCustomer) return;
    try {
      const response = await apiFetch(`/customers/${deletingCustomer._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete customer. They may have linked sales or records.');
      setCustomers((current) => current.filter((customer) => customer._id !== deletingCustomer._id));
      setDeletingCustomer(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not delete customer.');
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.nicPassport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Profiles & CRM Directory</h1>
          <p className="text-xs text-slate-500">Manage individual, corporate, dealer profiles and full customer life-cycle timelines</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Customer Profile</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, NIC / Passport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">NIC / Passport</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{c.customerId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{c.fullName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {c.customerType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{c.nicPassport}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{c.phone}</div>
                    <div className="text-[10px] text-slate-400">{c.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{c.city}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openTimeline(c)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] rounded-lg border border-emerald-200 transition-colors"
                    >
                      View Timeline →
                    </button>
                    <button onClick={() => { setEditingCustomer(c); setNewCust({ fullName: c.fullName || '', nicPassport: c.nicPassport || '', phone: c.phone || '', email: c.email || '', address: c.address || '', city: c.city || '', occupation: c.occupation || '', customerType: c.customerType || 'Individual' }); setShowAddModal(true); }} className="ml-2 rounded-lg border px-3 py-1.5 text-[11px] font-semibold">Edit</button>
                    <button onClick={() => setDeletingCustomer(c)} className="ml-2 rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">{editingCustomer ? 'Edit Customer Profile' : 'Create Customer Profile'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddCust} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input type="text" required placeholder="e.g. Nimal Perera" value={newCust.fullName} onChange={(e) => setNewCust({ ...newCust, fullName: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">NIC / Passport / Reg #</label>
                  <input type="text" required placeholder="e.g. 198512345678 / 851234567V" value={newCust.nicPassport} onChange={(e) => setNewCust({ ...newCust, nicPassport: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Customer Type</label>
                  <select value={newCust.customerType} onChange={(e) => setNewCust({ ...newCust, customerType: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50">
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <input type="text" required placeholder="e.g. +94 71 890 1234" value={newCust.phone} onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input type="email" placeholder="e.g. nimal.p@gmail.com" value={newCust.email} onChange={(e) => setNewCust({ ...newCust, email: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Address & City</label>
                <input type="text" placeholder="e.g. No. 12, Kandy Road, Kiribathgoda" value={newCust.address} onChange={(e) => setNewCust({ ...newCust, address: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50 placeholder:text-slate-400" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => { setShowAddModal(false); setEditingCustomer(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold">{editingCustomer ? 'Save Changes' : 'Save Profile'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingCustomer && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">Delete {deletingCustomer.fullName}?</h2><p className="mt-2 text-sm text-slate-600">Linked customer records may prevent deletion.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeletingCustomer(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button onClick={deleteCustomer} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Delete customer</button></div></section></div>}

      {/* Customer Timeline Modal (Section 11) */}
      {selectedTimelineCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedTimelineCustomer.fullName}</h3>
                <p className="text-xs text-slate-500">Customer Lifecycle Timeline</p>
              </div>
              <button onClick={() => setSelectedTimelineCustomer(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {timelineError && <p role="alert" className="mb-3 text-xs text-rose-600">{timelineError}</p>}
            <div className="max-h-[55vh] space-y-3 overflow-y-auto text-xs">{timeline.map((event, index) => <div key={event.id} className="relative border-l-2 border-emerald-200 pb-2 pl-5"><span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-emerald-500"/><p className="font-bold text-slate-900">{event.type}</p><p className="text-slate-600">{event.detail || 'Activity recorded'}</p><p className="mt-1 text-[10px] text-slate-400">{event.date && new Date(event.date).toLocaleString()}</p></div>)}{timeline.length===0&&!timelineError&&<p className="py-5 text-center text-slate-500">No customer activity recorded yet.</p>}</div>

            <div className="mt-6 pt-3 border-t flex justify-end">
              <button onClick={() => setSelectedTimelineCustomer(null)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs">Close Timeline</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

