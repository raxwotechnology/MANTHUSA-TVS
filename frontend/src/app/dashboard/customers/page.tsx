"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  X,
  FileDown,
  FileSpreadsheet,
  Store,
  Globe,
  Filter
} from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';
import { apiFetch } from '@/lib/api';

interface Customer {
  _id: string;
  customerId: string;
  fullName: string;
  nicPassport: string;
  dateOfBirth?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  occupation: string;
  customerType: string;
  customerSource?: string; // 'Walk-in' (Shop Visit), 'Online' (Website / Digital)
  createdAt?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'All' | 'Walk-in' | 'Online'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [selectedTimelineCustomer, setSelectedTimelineCustomer] = useState<Customer | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [timelineError, setTimelineError] = useState('');

  const openTimeline = async (customer: Customer) => {
    setSelectedTimelineCustomer(customer); setTimeline([]); setTimelineError('');
    try {
      const response = await apiFetch(`/customers/${customer._id}/timeline`);
      if (!response.ok) throw new Error('Could not load customer activity.');
      setTimeline(await response.json());
    } catch (error) {
      setTimelineError(error instanceof Error ? error.message : 'Could not load customer activity.');
    }
  };

  const [newCust, setNewCust] = useState({
    fullName: '',
    nicPassport: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    city: 'Colombo',
    occupation: '',
    customerType: 'Individual',
    customerSource: 'Walk-in' // 'Walk-in' | 'Online'
  });

  const fetchCust = async () => {
    try {
      const res = await apiFetch('/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.map((customer: any) => ({
          ...customer,
          nicPassport: customer.nicOrPassport || customer.nicPassport || '',
          dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : '',
          customerSource: customer.customerSource || 'Walk-in',
        })));
      }
    } catch (err) {
      console.error('Failed to fetch customers', err);
    }
  };

  useEffect(() => {
    fetchCust();
  }, []);

  const handleAddCust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiFetch(editingCustomer ? `/customers/${editingCustomer._id}` : '/customers', {
        method: editingCustomer ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCust,
          nicOrPassport: newCust.nicPassport,
          dateOfBirth: newCust.dateOfBirth || null,
          customerSource: newCust.customerSource || 'Walk-in',
        })
      });
      if (!response.ok) throw new Error('Could not save customer. Check the details and try again.');
      const saved = await response.json();
      setCustomers((current) => editingCustomer
        ? current.map((customer) => customer._id === editingCustomer._id ? {
            ...customer,
            ...saved,
            nicPassport: saved.nicOrPassport || saved.nicPassport || newCust.nicPassport,
            dateOfBirth: saved.dateOfBirth ? saved.dateOfBirth.split('T')[0] : (newCust.dateOfBirth || ''),
            customerSource: saved.customerSource || newCust.customerSource,
          } : customer)
        : [{
            ...saved,
            nicPassport: saved.nicOrPassport || saved.nicPassport || newCust.nicPassport,
            dateOfBirth: saved.dateOfBirth ? saved.dateOfBirth.split('T')[0] : (newCust.dateOfBirth || ''),
            customerSource: saved.customerSource || newCust.customerSource,
          }, ...current]);
      setShowAddModal(false);
      setEditingCustomer(null);
      setNewCust({
        fullName: '',
        nicPassport: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        address: '',
        city: 'Colombo',
        occupation: '',
        customerType: 'Individual',
        customerSource: 'Walk-in'
      });
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

  // Filter by Source (Walk-in vs Online) and search query
  const filtered = customers.filter((c) => {
    if (sourceFilter === 'Walk-in') {
      const src = (c.customerSource || '').toLowerCase();
      if (src.includes('online')) return false;
    } else if (sourceFilter === 'Online') {
      const src = (c.customerSource || '').toLowerCase();
      if (!src.includes('online')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        c.fullName?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.nicPassport?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.customerSource?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (!isWithinDateRange((c as any).createdAt || c.dateOfBirth, startDate, endDate)) return false;
    return true;
  });

  const walkInCustomers = customers.filter(c => !(c.customerSource || '').toLowerCase().includes('online'));
  const onlineCustomers = customers.filter(c => (c.customerSource || '').toLowerCase().includes('online'));

  const customerColumns = [
    { label: 'Customer ID', value: (r: any) => r.customerId || r._id },
    { label: 'Customer Name', value: (r: any) => r.fullName },
    { label: 'Acquisition Channel', value: (r: any) => (r.customerSource || '').toLowerCase().includes('online') ? 'Online Customer' : 'Walk-in Customer (Shop Visit)' },
    { label: 'Customer Type', value: (r: any) => r.customerType || 'Individual' },
    { label: 'NIC / Passport', value: (r: any) => r.nicPassport || '—' },
    { label: 'DOB', value: (r: any) => r.dateOfBirth || '—' },
    { label: 'Phone', value: (r: any) => r.phone },
    { label: 'Email', value: (r: any) => r.email || '—' },
    { label: 'City', value: (r: any) => r.city || '—' },
    { label: 'Address', value: (r: any) => r.address || '—' },
  ];

  const exportFilteredReport = (format: 'pdf' | 'excel') => {
    let reportTitle = 'Customer Profiles & CRM Directory';
    let filename = 'customers';
    if (sourceFilter === 'Walk-in') {
      reportTitle = 'Walk-in Customers Report (Shop Visits)';
      filename = 'walk-in-customers-report';
    } else if (sourceFilter === 'Online') {
      reportTitle = 'Online Customer Base Report (Digital & Web Inquiries)';
      filename = 'online-customers-report';
    }

    if (format === 'pdf') {
      exportPdf(reportTitle, `${filename}.pdf`, customerColumns, filtered);
    } else {
      exportExcel(`${filename}.xlsx`, customerColumns, filtered);
    }
  };

  const exportSpecificReport = (source: 'walk-in' | 'online', format: 'pdf' | 'excel') => {
    const list = source === 'walk-in' ? walkInCustomers : onlineCustomers;
    const title = source === 'walk-in' ? 'Walk-in Customers Report (Showroom Visits)' : 'Online Customer Base Report (Web & Inquiries)';
    const filename = source === 'walk-in' ? 'walk-in-customers-report' : 'online-customers-report';

    if (format === 'pdf') {
      exportPdf(title, `${filename}.pdf`, customerColumns, list);
    } else {
      exportExcel(`${filename}.xlsx`, customerColumns, list);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Customer Profiles &amp; Acquisition Directory</span>
          </h1>
          <p className="text-xs text-slate-500">
            Segregate and track Walk-in customers (shop visits) vs Online customer base with dedicated PDF &amp; Excel report exports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Current View PDF */}
          <button
            onClick={() => exportFilteredReport('pdf')}
            disabled={!filtered.length}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
            title="Download PDF of the filtered customers"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF Export</span>
          </button>

          {/* Export Current View Excel */}
          <button
            onClick={() => exportFilteredReport('excel')}
            disabled={!filtered.length}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
            title="Download Excel spreadsheet of the filtered customers"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Export</span>
          </button>

          {/* Add Customer Button */}
          <button
            onClick={() => {
              setEditingCustomer(null);
              setNewCust({
                fullName: '',
                nicPassport: '',
                dateOfBirth: '',
                phone: '',
                email: '',
                address: '',
                city: 'Colombo',
                occupation: '',
                customerType: 'Individual',
                customerSource: sourceFilter === 'Online' ? 'Online' : 'Walk-in',
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Walk-in vs Online Customer Base */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Total Customers */}
        <div
          onClick={() => setSourceFilter('All')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            sourceFilter === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-80">Total Customer Base</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black mt-1">{customers.length}</p>
          <p className="text-[11px] opacity-75 mt-0.5">All registered buyers and showroom visitors</p>
        </div>

        {/* Walk-in Customers */}
        <div
          onClick={() => setSourceFilter('Walk-in')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            sourceFilter === 'Walk-in' ? 'bg-purple-700 text-white border-purple-700 shadow-sm' : 'bg-white text-slate-800 border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Store className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold">Walk-in Customers (Shop Visits)</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); exportSpecificReport('walk-in', 'pdf'); }}
                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-1.5 py-0.5 rounded font-bold"
                title="Export Walk-in PDF"
              >
                PDF
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); exportSpecificReport('walk-in', 'excel'); }}
                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-1.5 py-0.5 rounded font-bold"
                title="Export Walk-in Excel"
              >
                XLS
              </button>
            </div>
          </div>
          <p className="text-2xl font-black mt-1">{walkInCustomers.length}</p>
          <p className="text-[11px] opacity-80 mt-0.5">Physical showroom visits &amp; working clients</p>
        </div>

        {/* Online Customers */}
        <div
          onClick={() => setSourceFilter('Online')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            sourceFilter === 'Online' ? 'bg-blue-700 text-white border-blue-700 shadow-sm' : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold">Online Customers (Web &amp; Inquiries)</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); exportSpecificReport('online', 'pdf'); }}
                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-1.5 py-0.5 rounded font-bold"
                title="Export Online PDF"
              >
                PDF
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); exportSpecificReport('online', 'excel'); }}
                className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-1.5 py-0.5 rounded font-bold"
                title="Export Online Excel"
              >
                XLS
              </button>
            </div>
          </div>
          <p className="text-2xl font-black mt-1">{onlineCustomers.length}</p>
          <p className="text-[11px] opacity-80 mt-0.5">Website inquiries, configurator &amp; online requests</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-3">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Acquisition Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setSourceFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sourceFilter === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Customers ({customers.length})
          </button>

          <button
            type="button"
            onClick={() => setSourceFilter('Walk-in')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              sourceFilter === 'Walk-in'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Walk-in Customers (Shop Visits) ({walkInCustomers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceFilter('Online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              sourceFilter === 'Online'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Online Customers ({onlineCustomers.length})</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, NIC, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>

          <DateFilterControl
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            label="Registered / DOB:"
          />
        </div>
      </div>

      {/* Customer Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Acquisition Channel</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">NIC / Passport</th>
                <th className="py-3 px-4">DOB</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No customers found matching the filter criteria.
                  </td>
                </tr>
              )}
              {filtered.map((c) => {
                const isOnline = (c.customerSource || '').toLowerCase().includes('online');
                return (
                  <tr key={c._id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.customerId || c._id.slice(-6)}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.fullName}</td>
                    <td className="py-3 px-4">
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <Globe className="w-3 h-3 text-blue-600" />
                          <span>Online Customer</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          <Store className="w-3 h-3 text-purple-600" />
                          <span>Walk-in Customer</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {c.customerType || 'Individual'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{c.nicPassport || '—'}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{c.dateOfBirth ? c.dateOfBirth : '—'}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-semibold text-slate-900">{c.phone}</div>
                      {c.email && <div className="text-[10px] text-slate-400">{c.email}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{c.city || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openTimeline(c)}
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] rounded-lg border border-emerald-200 transition-colors"
                        >
                          Timeline
                        </button>
                        <button
                          onClick={() => {
                            setEditingCustomer(c);
                            setNewCust({
                              fullName: c.fullName || '',
                              nicPassport: c.nicPassport || '',
                              dateOfBirth: c.dateOfBirth ? c.dateOfBirth.split('T')[0] : '',
                              phone: c.phone || '',
                              email: c.email || '',
                              address: c.address || '',
                              city: c.city || 'Colombo',
                              occupation: c.occupation || '',
                              customerType: c.customerType || 'Individual',
                              customerSource: c.customerSource || 'Walk-in',
                            });
                            setShowAddModal(true);
                          }}
                          className="rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingCustomer(c)}
                          className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Timeline Modal */}
      {selectedTimelineCustomer && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-900 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedTimelineCustomer.fullName} - Timeline</h3>
                <p className="text-xs text-slate-500">
                  Channel: {selectedTimelineCustomer.customerSource || 'Walk-in Customer'} · {selectedTimelineCustomer.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTimelineCustomer(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {timelineError && <div className="p-3 mb-3 rounded-xl bg-rose-50 text-rose-700 text-xs">{timelineError}</div>}

            {timeline.length === 0 && !timelineError ? (
              <p className="py-8 text-center text-xs text-slate-400">No linked history found for this customer.</p>
            ) : (
              <div className="space-y-3">
                {timeline.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-emerald-700">{item.type}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">{item.detail || 'Record created'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCustomer ? 'Edit Customer Profile' : 'Create Customer Profile'}
                </h3>
                <p className="text-xs text-slate-500">
                  Specify whether customer is a Walk-in (shop visitor) or Online client
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowAddModal(false); setEditingCustomer(null); }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCust} className="space-y-3.5 text-xs text-slate-900">
              {/* Customer Acquisition Source */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Customer Acquisition Channel <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCust({ ...newCust, customerSource: 'Walk-in' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      newCust.customerSource === 'Walk-in'
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Walk-in Customer (Shop Visit)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCust({ ...newCust, customerSource: 'Online' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      newCust.customerSource === 'Online'
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Online Customer (Digital / Web)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nimal Perera"
                  value={newCust.fullName}
                  onChange={(e) => setNewCust({ ...newCust, fullName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0771234567"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">NIC or Passport</label>
                  <input
                    type="text"
                    placeholder="e.g. 199012345678"
                    value={newCust.nicPassport}
                    onChange={(e) => setNewCust({ ...newCust, nicPassport: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. customer@email.com"
                    value={newCust.email}
                    onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newCust.dateOfBirth}
                    onChange={(e) => setNewCust({ ...newCust, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Colombo, Kandy"
                    value={newCust.city}
                    onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Customer Classification</label>
                  <select
                    value={newCust.customerType}
                    onChange={(e) => setNewCust({ ...newCust, customerType: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                  >
                    <option value="Individual">Individual Buyer</option>
                    <option value="Corporate">Corporate Fleet</option>
                    <option value="Dealer">Commercial Dealer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Residential / Postal Address</label>
                <input
                  type="text"
                  placeholder="e.g. No. 45, Galle Road, Colombo 03"
                  value={newCust.address}
                  onChange={(e) => setNewCust({ ...newCust, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingCustomer(null); }}
                  className="flex-1 py-2.5 border border-slate-300 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                >
                  {editingCustomer ? 'Update Profile' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-900 text-center">
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Customer Profile</h3>
            <p className="text-xs text-slate-600 mb-5">
              Are you sure you want to delete <strong>{deletingCustomer.fullName}</strong>? This cannot be undone if no sales are linked.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl bg-slate-100 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteCustomer}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
