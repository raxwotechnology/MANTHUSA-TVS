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

import { getApiUrl } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      _id: '1',
      customerId: 'CUST-001',
      fullName: 'Kamal Gunaratne',
      nicPassport: '841920391V',
      phone: '0779988776',
      email: 'kamal.g@gmail.com',
      address: 'No 14, Rajagiriya Road',
      city: 'Colombo',
      occupation: 'Software Engineer',
      customerType: 'Individual'
    },
    {
      _id: '2',
      customerId: 'CUST-002',
      fullName: 'Blue Star Logistics Ltd',
      nicPassport: 'PV-991823',
      phone: '0114433221',
      email: 'contact@bluestarlogistics.com',
      address: 'No 80, D.R. Wijewardena Mawatha',
      city: 'Colombo',
      occupation: 'Logistics',
      customerType: 'Corporate'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTimelineCustomer, setSelectedTimelineCustomer] = useState<Customer | null>(null);

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
        const res = await fetch(getApiUrl('/customers'));
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setCustomers(data);
        }
      } catch (err) {
        console.error('Failed to fetch customers', err);
      }
    };
    fetchCust();
  }, []);

  const handleAddCust = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: Customer = {
      _id: Date.now().toString(),
      customerId: `CUST-00${customers.length + 1}`,
      ...newCust
    };

    try {
      await fetch(getApiUrl('/customers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify((() => { const { _id, ...rest } = item; return rest; })())
      });
    } catch (err) {}

    setCustomers([item, ...customers]);
    setShowAddModal(false);
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
                <th className="py-3 px-4 text-center">Lifecycle Timeline</th>
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
                      onClick={() => setSelectedTimelineCustomer(c)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] rounded-lg border border-emerald-200 transition-colors"
                    >
                      View Timeline →
                    </button>
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
              <h3 className="text-base font-bold text-slate-900">Create Customer Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddCust} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name</label>
                <input type="text" required value={newCust.fullName} onChange={(e) => setNewCust({ ...newCust, fullName: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">NIC / Passport / Reg #</label>
                  <input type="text" required value={newCust.nicPassport} onChange={(e) => setNewCust({ ...newCust, nicPassport: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50" />
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
                  <input type="text" required value={newCust.phone} onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input type="email" value={newCust.email} onChange={(e) => setNewCust({ ...newCust, email: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Address & City</label>
                <input type="text" value={newCust.address} onChange={(e) => setNewCust({ ...newCust, address: e.target.value })} className="w-full p-2 border rounded-lg bg-slate-50" />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200 text-xs">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">1</div>
                <p className="font-bold text-slate-900">Inquiry Received</p>
                <p className="text-slate-500 text-[11px]">Website inquiry for Toyota Premio F EX Package</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">2</div>
                <p className="font-bold text-slate-900">Lead & Follow-up</p>
                <p className="text-slate-500 text-[11px]">WhatsApp follow-up scheduled by Kasun Fernando</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">3</div>
                <p className="font-bold text-slate-900">Test Drive Completed</p>
                <p className="text-slate-500 text-[11px]">Completed 30-min drive. Feedback: Loved performance.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">4</div>
                <p className="font-bold text-slate-900">Quotation Issued</p>
                <p className="text-slate-500 text-[11px]">QT-2026-001 issued for LKR 13,425,000</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px]">5</div>
                <p className="font-bold text-slate-500">Reservation & Payment</p>
                <p className="text-slate-400 text-[11px]">Pending deposit confirmation</p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t flex justify-end">
              <button onClick={() => setSelectedTimelineCustomer(null)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs">Close Timeline</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
