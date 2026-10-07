"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import {
  Calendar,
  Clock,
  Car,
  User,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  X,
  XCircle,
  Edit,
  Trash2,
  CalendarCheck
} from 'lucide-react';

interface TestDrive {
  _id: string;
  customer: any;
  vehicle: any;
  salesperson: any;
  date: string;
  startTime?: string;
  endTime?: string;
  drivingLicenseNo?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  feedback?: string;
  createdAt?: string;
}

export default function TestDrivesPage() {
  const [bookings, setBookings] = useState<TestDrive[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [salespeople, setSalespeople] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<TestDrive | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<TestDrive | null>(null);
  const [completingBooking, setCompletingBooking] = useState<TestDrive | null>(null);
  const [completionFeedback, setCompletionFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const initialForm = {
    customer: '',
    vehicle: '',
    salesperson: '',
    date: new Date().toISOString().slice(0, 10),
    startTime: '10:00',
    endTime: '10:45',
    drivingLicenseNo: '',
    status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show',
    feedback: ''
  };

  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [drivesRes, custRes, vehRes, userRes] = await Promise.all([
        apiFetch('/test-drives'),
        apiFetch('/customers'),
        apiFetch('/vehicles'),
        apiFetch('/users')
      ]);

      if (drivesRes.ok) setBookings(await drivesRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (vehRes.ok) setVehicles(await vehRes.json());
      if (userRes.ok) setSalespeople(await userRes.json());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load test drives data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openAddModal = () => {
    setEditingBooking(null);
    setForm({
      ...initialForm,
      customer: customers[0]?._id || '',
      vehicle: vehicles[0]?._id || '',
      salesperson: salespeople[0]?._id || ''
    });
    setShowModal(true);
  };

  const openEditModal = (b: TestDrive) => {
    setEditingBooking(b);
    setForm({
      customer: typeof b.customer === 'object' ? b.customer?._id || '' : b.customer || '',
      vehicle: typeof b.vehicle === 'object' ? b.vehicle?._id || '' : b.vehicle || '',
      salesperson: typeof b.salesperson === 'object' ? b.salesperson?._id || '' : b.salesperson || '',
      date: b.date ? new Date(b.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      startTime: b.startTime || '10:00',
      endTime: b.endTime || '10:45',
      drivingLicenseNo: b.drivingLicenseNo || '',
      status: b.status || 'Scheduled',
      feedback: b.feedback || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      customer: form.customer,
      vehicle: form.vehicle,
      salesperson: form.salesperson,
      date: new Date(form.date).toISOString(),
      startTime: form.startTime,
      endTime: form.endTime,
      drivingLicenseNo: form.drivingLicenseNo,
      status: form.status,
      feedback: form.feedback
    };

    try {
      if (editingBooking) {
        const res = await apiFetch(`/test-drives/${editingBooking._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Could not update test drive booking.');
        }
      } else {
        const res = await apiFetch('/test-drives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || 'Could not schedule test drive.');
        }
      }

      setShowModal(false);
      setEditingBooking(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save test drive.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingBooking) return;
    setSaving(true);
    try {
      const res = await apiFetch(`/test-drives/${completingBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Completed',
          feedback: completionFeedback
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Could not mark test drive as completed.');
      }
      setCompletingBooking(null);
      setCompletionFeedback('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error completing test drive.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBooking) return;
    setSaving(true);
    try {
      const res = await apiFetch(`/test-drives/${deletingBooking._id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Could not delete booking.');
      }
      setDeletingBooking(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting test drive.');
    } finally {
      setSaving(false);
    }
  };

  const getVehicleTitle = (v: any) => {
    if (!v) return '—';
    if (typeof v === 'string') return v;
    const name = `${v.make || ''} ${v.model || ''} ${v.year || ''}`.trim();
    return name || v.registrationNumber || v.stockNumber || 'Vehicle';
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const custName = (typeof b.customer === 'object' ? b.customer?.fullName || b.customer?.name : '') || '';
      const custPhone = (typeof b.customer === 'object' ? b.customer?.phone : '') || '';
      const vehTitle = getVehicleTitle(b.vehicle);
      const vehReg = (typeof b.vehicle === 'object' ? b.vehicle?.registrationNumber || b.vehicle?.stockNumber : '') || '';
      const salesName = (typeof b.salesperson === 'object' ? b.salesperson?.name || b.salesperson?.fullName : '') || '';
      const license = b.drivingLicenseNo || '';

      const matchesSearch =
        !q ||
        custName.toLowerCase().includes(q) ||
        custPhone.toLowerCase().includes(q) ||
        vehTitle.toLowerCase().includes(q) ||
        vehReg.toLowerCase().includes(q) ||
        salesName.toLowerCase().includes(q) ||
        license.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Statistics
  const totalCount = bookings.length;
  const scheduledCount = bookings.filter((b) => b.status === 'Scheduled').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;
  const otherCount = bookings.filter((b) => b.status === 'Cancelled' || b.status === 'No Show').length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Test Drive Bookings & Experience Log</h1>
          <p className="text-xs text-slate-500">
            Schedule customer vehicle test drives, verify driver licenses, and log customer driving feedback
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Test Drive</span>
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
            <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
            <span className="p-2 bg-slate-100 rounded-xl text-slate-700"><Calendar className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">All logged requests</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600">Upcoming / Scheduled</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">{scheduledCount}</div>
          <p className="text-[11px] text-blue-500 mt-0.5">Awaiting customer arrival</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600">Completed Drives</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{completedCount}</div>
          <p className="text-[11px] text-emerald-500 mt-0.5">Successfully concluded</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600">Cancelled / No Show</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><XCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{otherCount}</div>
          <p className="text-[11px] text-amber-500 mt-0.5">Rescheduled or cancelled</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer, vehicle, license, staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {['ALL', 'Scheduled', 'Completed', 'Cancelled', 'No Show'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Test Drives Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Showroom Vehicle</th>
                <th className="py-3 px-4">Salesperson</th>
                <th className="py-3 px-4">Date & Time Slot</th>
                <th className="py-3 px-4">Driving License</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Customer Feedback</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">
                      {typeof b.customer === 'object' ? b.customer?.fullName || b.customer?.name || 'Customer' : 'Customer'}
                    </div>
                    {typeof b.customer === 'object' && b.customer?.phone && (
                      <div className="text-[11px] text-slate-500">{b.customer.phone}</div>
                    )}
                  </td>

                  {/* Vehicle */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{getVehicleTitle(b.vehicle)}</span>
                    </div>
                    {typeof b.vehicle === 'object' && (b.vehicle?.registrationNumber || b.vehicle?.stockNumber) && (
                      <div className="text-[11px] text-slate-500 font-mono ml-5">
                        {b.vehicle.registrationNumber || b.vehicle.stockNumber}
                      </div>
                    )}
                  </td>

                  {/* Salesperson */}
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{typeof b.salesperson === 'object' ? b.salesperson?.name || b.salesperson?.fullName || b.salesperson?.email || '—' : '—'}</span>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{new Date(b.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    {(b.startTime || b.endTime) && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 ml-4.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{b.startTime || '—'} {b.endTime ? `to ${b.endTime}` : ''}</span>
                      </div>
                    )}
                  </td>

                  {/* Driving License */}
                  <td className="py-3 px-4">
                    {b.drivingLicenseNo ? (
                      <span className="font-mono text-[11px] font-bold px-2 py-1 bg-slate-100 rounded text-slate-800 border border-slate-200">
                        {b.drivingLicenseNo}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Not recorded</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {b.status === 'Scheduled' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Scheduled
                      </span>
                    )}
                    {b.status === 'Completed' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Completed
                      </span>
                    )}
                    {b.status === 'Cancelled' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Cancelled
                      </span>
                    )}
                    {b.status === 'No Show' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        No Show
                      </span>
                    )}
                  </td>

                  {/* Feedback */}
                  <td className="py-3 px-4 max-w-xs">
                    {b.feedback ? (
                      <span className="text-slate-700 line-clamp-2" title={b.feedback}>
                        {b.feedback}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {b.status === 'Scheduled' && (
                        <button
                          onClick={() => {
                            setCompletingBooking(b);
                            setCompletionFeedback(b.feedback || '');
                          }}
                          title="Complete Test Drive"
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(b)}
                        title="Edit Booking"
                        className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingBooking(b)}
                        title="Delete Booking"
                        className="p-1.5 rounded border border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No test drive bookings found.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click &quot;Schedule Test Drive&quot; to book a customer vehicle drive.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingBooking ? 'Edit Test Drive Booking' : 'Schedule New Test Drive'}
                </h3>
                <p className="text-xs text-slate-500">
                  Select customer, showroom vehicle, assigned sales host, and time slot
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer *</label>
                  <select
                    required
                    value={form.customer}
                    onChange={(e) => setForm({ ...form, customer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.fullName || c.name} {c.phone ? `(${c.phone})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Showroom Vehicle *</label>
                  <select
                    required
                    value={form.vehicle}
                    onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Select Vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.make} {v.model} {v.year || ''} {v.registrationNumber ? `[${v.registrationNumber}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salesperson */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sales Host / Executive *</label>
                  <select
                    required
                    value={form.salesperson}
                    onChange={(e) => setForm({ ...form, salesperson: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Select Salesperson --</option>
                    {salespeople.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name || u.fullName || u.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driving License */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Driver&apos;s License Number</label>
                  <input
                    type="text"
                    placeholder="e.g. B1234567 or DL-9876543"
                    value={form.drivingLicenseNo}
                    onChange={(e) => setForm({ ...form, drivingLicenseNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  />
                </div>

                {/* Test Drive Date */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Drive Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Booking Status *</label>
                  <select
                    required
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No Show">No Show</option>
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Feedback / Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Experience Feedback & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record customer impressions, engine/handling feedback, purchase decision notes..."
                  value={form.feedback}
                  onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingBooking ? 'Update Booking' : 'Schedule Test Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Complete Modal */}
      {completingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mark Test Drive as Completed</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Customer: {typeof completingBooking.customer === 'object' ? completingBooking.customer?.fullName || completingBooking.customer?.name : 'Customer'}
                </p>
              </div>
              <button onClick={() => setCompletingBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickComplete} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Driving Impressions & Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How did the customer find the vehicle? Any concerns about engine, brakes, handling or price?"
                  value={completionFeedback}
                  onChange={(e) => setCompletionFeedback(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setCompletingBooking(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  {saving ? 'Completing...' : 'Save & Mark Completed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-6 text-center text-xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Delete Test Drive Booking?</h3>
            <p className="text-slate-500 mb-5">
              Are you sure you want to delete this test drive booking record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
              >
                {saving ? 'Deleting...' : 'Delete Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
