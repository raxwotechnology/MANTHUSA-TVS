"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  CalendarCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Building,
  DollarSign,
  AlertCircle,
  X,
  FileDown,
  FileSpreadsheet,
  MessageSquare
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';

interface Booking {
  _id: string;
  bookingNumber?: string;
  reservationId?: string;
  customer?: any;
  vehicle?: any;
  modelName?: string;
  variantName?: string;
  selectedColor?: string;
  branch?: any;
  branchName?: string;
  reservationDeposit: number;
  paymentMethod?: string;
  bookingDate?: string;
  expiryDate?: string;
  status: string;
  notes?: string;
  createdAt?: string;
}

function getBranchLabel(branchVal: any, branchName?: string): string {
  if (branchName) return branchName;
  if (!branchVal) return 'Colombo Showroom';
  if (typeof branchVal === 'object') {
    return branchVal.name || branchVal.location || 'Colombo Showroom';
  }
  return String(branchVal);
}

export default function TVSBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const [customersList, setCustomersList] = useState<any[]>([]);
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [smsBooking, setSmsBooking] = useState<Booking | null>(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [smsSending, setSmsSending] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    modelName: '',
    variantName: '',
    selectedColor: '',
    branch: 'Colombo Showroom',
    reservationDeposit: '50000',
    paymentMethod: 'Bank Transfer',
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resRes, custRes, vehRes, branchRes] = await Promise.all([
        apiFetch('/reservations'),
        apiFetch('/customers'),
        apiFetch('/vehicles'),
        apiFetch('/branches')
      ]);

      if (resRes.ok) {
        const data = await resRes.json();
        setBookings(data);
      }
      if (custRes.ok) setCustomersList(await custRes.json());
      if (vehRes.ok) setVehiclesList(await vehRes.json());
      if (branchRes.ok) setBranchesList(await branchRes.json());
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedVehicle = vehiclesList.find(v => v._id === formData.vehicleId);
      const selectedBranch = branchesList.find(b => b._id === formData.branch);
      const branchName = selectedBranch ? selectedBranch.name : (typeof formData.branch === 'string' ? formData.branch : 'Colombo Showroom');

      const payload = {
        customer: formData.customerId,
        vehicle: formData.vehicleId,
        modelName: formData.modelName || (selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'TVS Motorcycle'),
        variantName: formData.variantName || selectedVehicle?.variant || 'Standard',
        selectedColor: formData.selectedColor || 'Racing Red',
        branch: formData.branch,
        branchName,
        reservationDeposit: Number(formData.reservationDeposit || 0),
        paymentMethod: formData.paymentMethod,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        notes: formData.notes
      };

      const res = await apiFetch(editingBooking ? `/reservations/${editingBooking._id}` : '/reservations', {
        method: editingBooking ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save booking.');
      }

      setShowAddModal(false);
      setEditingBooking(null);
      setNotification({ type: 'success', message: 'TVS Booking saved successfully!' });
      setTimeout(() => setNotification(null), 4000);
      loadData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error saving booking' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/reservations/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setNotification({ type: 'success', message: `Booking status updated to ${newStatus}.` });
        setTimeout(() => setNotification(null), 3000);
        loadData();
      } else {
        setNotification({ type: 'error', message: 'Could not update status.' });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      setNotification({ type: 'error', message: 'Network error updating status.' });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCreateQuotation = (booking: Booking) => {
    const custId = booking.customer?._id || booking.customer || '';
    const vehId = booking.vehicle?._id || booking.vehicle || '';
    const deposit = booking.reservationDeposit || 0;
    router.push(`/dashboard/quotations?customerId=${encodeURIComponent(custId)}&vehicleId=${encodeURIComponent(vehId)}&advancePayment=${encodeURIComponent(String(deposit))}`);
  };

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && (b.status || '').toUpperCase() !== statusFilter.toUpperCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const num = (b.bookingNumber || b.reservationId || '').toLowerCase();
      const cName = (typeof b.customer === 'object' ? b.customer?.fullName || '' : String(b.customer || '')).toLowerCase();
      const mName = (b.modelName || b.vehicle?.model || '').toLowerCase();
      const bName = getBranchLabel(b.branch, b.branchName).toLowerCase();
      if (!num.includes(q) && !cName.includes(q) && !mName.includes(q) && !bName.includes(q)) {
        return false;
      }
    }
    if (!isWithinDateRange(b.bookingDate || (b as any).createdAt, startDate, endDate)) {
      return false;
    }
    return true;
  });

  const formatLKR = (val: number) => 'LKR ' + (Number(val) || 0).toLocaleString('en-LK');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Active':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Confirmed</span>;
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pending</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Completed</span>;
      case 'Cancelled':
      case 'Expired':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">{status}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <DashboardLayout>
      {/* Toast Notification Banner */}
      {notification && (
        <div
          role="alert"
          className={`mb-4 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            <span>TVS Motorcycle Bookings & Advance Deposits</span>
          </h1>
          <p className="text-xs text-slate-500">
            Track customer booking deposits, motorcycle allocation, branch reservations, and quotation progression
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(() => {
            const cols = [
              { label: 'Booking Ref', value: (r: any) => r.bookingNumber || r.reservationId || '' },
              { label: 'Customer', value: (r: any) => r.customer?.fullName || '' },
              { label: 'TVS Motorcycle Model', value: (r: any) => r.modelName || '' },
              { label: 'Color', value: (r: any) => r.selectedColor || '' },
              { label: 'Branch', value: (r: any) => getBranchLabel(r.branch, r.branchName) },
              { label: 'Deposit Amount (LKR)', value: (r: any) => r.reservationDeposit },
              { label: 'Expiry', value: (r: any) => r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : '' },
              { label: 'Status', value: (r: any) => r.status },
            ];
            return (
              <>
                <button onClick={() => exportPdf('TVS Motorcycle Bookings', 'reservations.pdf', cols, bookings)} disabled={!bookings.length} className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs">
                  <FileDown className="w-4 h-4" /><span>PDF</span>
                </button>
                <button onClick={() => exportExcel('reservations.xlsx', cols, bookings)} disabled={!bookings.length} className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" /><span>Excel</span>
                </button>
              </>
            );
          })()}
          <button
            onClick={() => {
              setEditingBooking(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Bike Booking</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar with Date Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search booking #, customer, model, branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <DateFilterControl
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            label="Booking Date:"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto text-xs font-semibold">
          {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">TVS Motorcycle Model</th>
                <th className="py-3 px-4">Color & Branch</th>
                <th className="py-3 px-4">Deposit Amount</th>
                <th className="py-3 px-4">Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {b.bookingNumber || b.reservationId || `TVS-BK-${b._id.slice(-6).toUpperCase()}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{b.customer?.fullName || 'Walk-in Customer'}</div>
                    <div className="text-[11px] text-slate-500">{b.customer?.phone || b.customer?.email || 'â€”'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{b.modelName || (b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : 'TVS Motorcycle')}</div>
                    <div className="text-[11px] text-slate-500 font-medium">Variant: {b.variantName || 'Standard'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{b.selectedColor || 'Factory Finish'}</div>
                    <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{getBranchLabel(b.branch, b.branchName)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700">
                    {formatLKR(b.reservationDeposit)}
                    <span className="block text-[10px] text-slate-400 font-normal">{b.paymentMethod || 'Deposit'}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : 'â€”'}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(b.status || 'Active')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      <button
                        onClick={() => handleCreateQuotation(b)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center gap-1"
                        title="Create official quotation for this booking"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Create Quotation</span>
                      </button>

                      {b.status !== 'Completed' && (
                        <button
                          onClick={() => updateBookingStatus(b._id, 'Completed')}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200"
                        >
                          Mark Complete
                        </button>
                      )}

                      {b.status !== 'Cancelled' && (
                        <button
                          onClick={() => updateBookingStatus(b._id, 'Cancelled')}
                          className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 font-bold text-[11px] rounded-lg border border-rose-200"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const custName = typeof b.customer === 'object' ? b.customer?.fullName || 'Customer' : 'Customer';
                          const phone = typeof b.customer === 'object' ? b.customer?.phone || '' : '';
                          const model = b.modelName || (b.vehicle ? `${b.vehicle.make || 'TVS'} ${b.vehicle.model}` : 'TVS Motorcycle');
                          const refId = b.bookingNumber || b.reservationId || `TVS-BK-${b._id.slice(-6).toUpperCase()}`;
                          const deposit = Number(b.reservationDeposit || 0).toLocaleString('en-LK');
                          const expiry = b.expiryDate ? new Date(b.expiryDate).toLocaleDateString('en-GB') : 'soon';
                          const defaultMsg = `Dear ${custName}, your ${model} is reserved at TVS SalesPlus Motor Hub! Booking Ref: ${refId}. Advance Paid: LKR ${deposit}. Please complete full payment to confirm handover. Valid until: ${expiry}. - TVS SalesPlus Motor Hub`;
                          setSmsBooking(b);
                          setSmsMessage(defaultMsg);
                        }}
                        className="px-2 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] rounded-lg border border-blue-200 flex items-center gap-1"
                        title="Send SMS update to customer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Send SMS</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No TVS motorcycle bookings found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingBooking ? 'Edit TVS Booking' : 'New TVS Motorcycle Booking'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer *</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="">-- Select Customer --</option>
                  {customersList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.phone || c.email || 'No Contact'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select TVS Motorcycle *</label>
                <select
                  required
                  value={formData.vehicleId}
                  onChange={(e) => {
                    const sel = vehiclesList.find(v => v._id === e.target.value);
                    setFormData({
                      ...formData,
                      vehicleId: e.target.value,
                      modelName: sel ? `${sel.make} ${sel.model}` : '',
                      variantName: sel?.variant || 'Standard'
                    });
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="">-- Choose Motorcycle Model --</option>
                  {vehiclesList.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.make} {v.model} ({v.engineCapacity || 'Standard'}) - LKR {Number(v.sellingPrice || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Variant Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Disc / SmartXonnect"
                    value={formData.variantName}
                    onChange={(e) => setFormData({ ...formData, variantName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selected Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Racing Red / Stealth Black"
                    value={formData.selectedColor}
                    onChange={(e) => setFormData({ ...formData, selectedColor: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Showroom Branch</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Colombo Showroom">Colombo Showroom</option>
                    <option value="Kandy Branch">Kandy Branch</option>
                    <option value="Galle Branch">Galle Branch</option>
                    <option value="Kurunegala Branch">Kurunegala Branch</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deposit Amount (LKR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.reservationDeposit}
                    onChange={(e) => setFormData({ ...formData, reservationDeposit: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hold Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Notes / Requests</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Helmet requested, customer prefers morning delivery"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                >
                  Confirm TVS Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {smsBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">Send Advance / Booking SMS</h3>
              </div>
              <button onClick={() => setSmsBooking(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-slate-500">Customer:</span> <span className="font-bold text-slate-800">{typeof smsBooking.customer === 'object' ? smsBooking.customer?.fullName : 'Customer'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Phone:</span> <span className="font-mono font-bold text-blue-600">{typeof smsBooking.customer === 'object' ? smsBooking.customer?.phone || 'No phone recorded' : 'No phone recorded'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Motorcycle:</span> <span className="font-medium text-slate-700">{smsBooking.modelName || smsBooking.vehicle?.model || 'TVS Motorcycle'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Advance Paid:</span> <span className="font-mono font-bold text-emerald-700">LKR {Number(smsBooking.reservationDeposit || 0).toLocaleString('en-LK')}</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">SMS Message (Sender: TVSSalesPlus)</label>
                <textarea
                  rows={4}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSmsBooking(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs cursor-pointer hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={smsSending || !smsMessage.trim() || !(typeof smsBooking.customer === 'object' && smsBooking.customer?.phone)}
                  onClick={async () => {
                    const phone = typeof smsBooking.customer === 'object' ? smsBooking.customer?.phone : null;
                    if (!phone) {
                      setNotification({ type: 'error', message: 'Customer phone number not available for SMS.' });
                      setTimeout(() => setNotification(null), 4000);
                      return;
                    }
                    setSmsSending(true);
                    try {
                      const res = await apiFetch('/notifications/send-sms', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone, message: smsMessage.trim() })
                      });
                      if (res.ok) {
                        setNotification({ type: 'success', message: `SMS sent successfully to ${phone}!` });
                        setTimeout(() => setNotification(null), 4000);
                        setSmsBooking(null);
                      } else {
                        const err = await res.json().catch(() => ({}));
                        setNotification({ type: 'error', message: err.message || 'Failed to send SMS.' });
                        setTimeout(() => setNotification(null), 5000);
                      }
                    } catch {
                      setNotification({ type: 'error', message: 'Network error sending SMS.' });
                      setTimeout(() => setNotification(null), 5000);
                    } finally {
                      setSmsSending(false);
                    }
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{smsSending ? 'Sending SMS...' : 'Send SMS Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
