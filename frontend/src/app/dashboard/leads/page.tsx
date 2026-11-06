"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  ArrowRight,
  Flame,
  FileText,
  FileDown,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { apiFetch } from '@/lib/api';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';

interface Lead {
  _id: string;
  leadId: string;
  customerName: string;
  customerPhone?: string;
  interestedVehicle: string;
  modelName?: string;
  variantName?: string;
  selectedColor?: string;
  category?: string;
  vehicleType?: string;
  engineCapacity?: string;
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
  invoiceId?: any;
  lostReason?: string;
  createdAt?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [invoicingId, setInvoicingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New Request' | 'Purchased' | 'Lost Sale' | 'Converted to Booking'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [lostSaleModalLead, setLostSaleModalLead] = useState<Lead | null>(null);
  const [lostReasonInput, setLostReasonInput] = useState('');

  const [newLead, setNewLead] = useState({
    customerName: '',
    customerPhone: '',
    category: 'Sport Motorcycles',
    vehicleType: 'Motorcycle',
    modelName: 'Apache RTR 160 4V',
    variantName: 'Special Edition Disc',
    engineCapacity: '159.7 cc',
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
      if (!response.ok) throw new Error('Could not load customer requests.');
      const data = await response.json();
      setLeads(
        data.map((lead: any) => ({
          ...lead,
          customerName: lead.customer?.fullName || lead.customerName || 'Customer',
          customerPhone: lead.customer?.phone || '',
          category: lead.category || lead.interestedVehicle?.category || 'Sport Motorcycles',
          vehicleType: lead.vehicleType || lead.interestedVehicle?.vehicleType || 'Motorcycle',
          engineCapacity: lead.engineCapacity || lead.interestedVehicle?.engineCapacity || '',
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
          customerSource: newLead.source.toLowerCase().includes('walk') ? 'Walk-in' : 'Online',
        }),
      });
      if (!customerResponse.ok) throw new Error('Could not save customer.');
      const customer = await customerResponse.json();

      const response = await apiFetch('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customer._id,
          category: newLead.category,
          vehicleType: newLead.vehicleType,
          modelName: newLead.modelName,
          variantName: newLead.variantName,
          engineCapacity: newLead.engineCapacity,
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
      if (!response.ok) throw new Error('Could not create inquiry request.');
      await loadLeads();
      setSuccess('New TVS motorcycle request created successfully!');
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save request.');
    }
  };

  // STAFF CONVERT REQUEST DIRECTLY TO INVOICE (PURCHASED)
  const handleConvertToInvoice = async (lead: Lead) => {
    setInvoicingId(lead._id);
    setError('');
    setSuccess('');

    try {
      const res = await apiFetch(`/leads/${lead._id}/convert-to-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehiclePrice: lead.budget || 850000,
          paymentMethod: 'Cash',
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Could not convert request to invoice.');
      }
      const data = await res.json();
      setSuccess(`Inquiry ${lead.leadId} converted to Invoice ${data.sale?.invoiceNumber || ''}! Status updated to "Purchased" and added to financials.`);
      await loadLeads();
    } catch (err: any) {
      setError(err.message || 'Failed to convert inquiry to invoice.');
    } finally {
      setInvoicingId(null);
    }
  };

  // STAFF MARK AS LOST SALE
  const handleConfirmLostSale = async () => {
    if (!lostSaleModalLead) return;
    try {
      const res = await apiFetch(`/leads/${lostSaleModalLead._id}/lost-sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: lostReasonInput.trim() || 'Customer chose not to purchase / unreachable' }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Could not mark inquiry as lost sale.');
      }
      setSuccess(`Inquiry ${lostSaleModalLead.leadId} marked as Lost Sale.`);
      setLostSaleModalLead(null);
      setLostReasonInput('');
      await loadLeads();
    } catch (err: any) {
      setError(err.message || 'Failed to mark inquiry as lost sale.');
    }
  };

  // STAFF CONVERT REQUEST TO RESERVATION BOOKING
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
      setSuccess(`Request ${lead.leadId} converted into Booking ${data.booking?.bookingNumber || ''}!`);
      await loadLeads();
    } catch (err: any) {
      setError(err.message || 'Failed to convert request to booking.');
    } finally {
      setConvertingId(null);
    }
  };

  const getStatusBadge = (status: string, reason?: string) => {
    switch (status) {
      case 'Purchased':
      case 'Purchasing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200" title="Converted to official sales invoice">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Purchased</span>
          </span>
        );
      case 'Lost Sale':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200" title={reason ? `Lost: ${reason}` : 'Inquiry did not purchase'}>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Lost Sale</span>
          </span>
        );
      case 'Converted to Booking':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Booking Active</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Under Review
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {status || 'New Request'}
          </span>
        );
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== 'All') {
      if (statusFilter === 'Purchased' && l.status !== 'Purchased' && l.status !== 'Purchasing') return false;
      if (statusFilter === 'Lost Sale' && l.status !== 'Lost Sale') return false;
      if (statusFilter === 'Converted to Booking' && l.status !== 'Converted to Booking') return false;
      if (statusFilter === 'New Request' && l.status !== 'New Request' && l.status !== 'Under Review') return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        (l.customerName || '').toLowerCase().includes(q) ||
        (l.customerPhone || '').includes(q) ||
        (l.leadId || '').toLowerCase().includes(q) ||
        (l.category || '').toLowerCase().includes(q) ||
        (l.vehicleType || '').toLowerCase().includes(q) ||
        (l.modelName || '').toLowerCase().includes(q) ||
        (l.interestedVehicle || '').toLowerCase().includes(q) ||
        (l.preferredBranchName || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (!isWithinDateRange((l as any).createdAt || l.preferredDate, startDate, endDate)) return false;
    return true;
  });

  const leadsColumns = [
    { label: 'Request #', value: (r: any) => r.leadId },
    { label: 'Customer', value: (r: any) => r.customerName },
    { label: 'Phone', value: (r: any) => r.customerPhone || '' },
    { label: 'Category', value: (r: any) => r.category || '' },
    { label: 'Type', value: (r: any) => r.vehicleType || '' },
    { label: 'Model', value: (r: any) => r.modelName || r.interestedVehicle },
    { label: 'Displacement', value: (r: any) => r.engineCapacity || '' },
    { label: 'Color', value: (r: any) => r.selectedColor || '' },
    { label: 'Branch', value: (r: any) => r.preferredBranchName || '' },
    { label: 'Budget (LKR)', value: (r: any) => r.budget },
    { label: 'Status', value: (r: any) => r.status },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-red-600" />
            <span>TVS Motorcycle Inquiries &amp; Pipeline Conversion</span>
          </h1>
          <p className="text-xs text-slate-500">
            Track customer inquiries by category, type &amp; model. Convert buyers to official invoices (&ldquo;Purchased&rdquo;) or record drop-outs (&ldquo;Lost Sale&rdquo;).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportPdf('TVS Motorcycle Inquiries Report', 'leads.pdf', leadsColumns, filteredLeads)}
            disabled={!filteredLeads.length}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => exportExcel('leads.xlsx', leadsColumns, filteredLeads)}
            disabled={!filteredLeads.length}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Customer Inquiry</span>
          </button>
        </div>
      </div>

      {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}
      {success && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{success}</div>}

      {/* Filter Tabs & Search Bar */}
      <div className="mb-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Status Pipeline Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
          {[
            { key: 'All', label: 'All Inquiries', count: leads.length },
            { key: 'New Request', label: 'New / In Review', count: leads.filter(l => ['New Request', 'Under Review'].includes(l.status)).length },
            { key: 'Purchased', label: 'Purchased (Invoiced)', count: leads.filter(l => ['Purchased', 'Purchasing'].includes(l.status)).length },
            { key: 'Lost Sale', label: 'Lost Sales', count: leads.filter(l => l.status === 'Lost Sale').length },
            { key: 'Converted to Booking', label: 'Bookings', count: leads.filter(l => l.status === 'Converted to Booking').length },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, category, type, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <DateFilterControl
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            label="Inquiry Date:"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Inquiry #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Motorcycle Details (Category · Type · Model)</th>
                <th className="py-3 px-4">Color &amp; Branch</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Pipeline Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 && (
                <tr>
                  <td className="p-8 text-center text-slate-400" colSpan={7}>
                    No motorcycle inquiries match the current filter.
                  </td>
                </tr>
              )}
              {filteredLeads.map((l) => (
                <tr key={l._id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{l.leadId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{l.customerName}</div>
                    {l.customerPhone && <div className="text-[11px] text-slate-500">{l.customerPhone}</div>}
                    <div className="text-[10px] text-slate-400">{l.source}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{l.modelName || l.interestedVehicle}</div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-100">
                        {l.category || 'Sport Motorcycle'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {l.vehicleType || 'Motorcycle'}
                      </span>
                      {l.engineCapacity && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                          {l.engineCapacity}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-700">{l.selectedColor || 'Standard Color'}</div>
                    <div className="text-[11px] text-slate-500">{l.preferredBranchName || 'Colombo Central Hub'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    LKR {Number(l.budget || 0).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(l.status, l.lostReason)}
                    {l.lostReason && (
                      <p className="text-[10px] text-rose-600 mt-1 italic max-w-xs truncate" title={l.lostReason}>
                        Reason: {l.lostReason}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-1.5">
                      {/* If already purchased, link to invoices */}
                      {l.status === 'Purchased' || l.status === 'Purchasing' ? (
                        <Link
                          href="/dashboard/sales"
                          className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Invoice</span>
                        </Link>
                      ) : (
                        <>
                          {/* Convert to Invoice (Purchased) Button */}
                          <button
                            type="button"
                            onClick={() => handleConvertToInvoice(l)}
                            disabled={invoicingId === l._id || convertingId === l._id}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-colors shadow-xs flex items-center gap-1 disabled:opacity-50"
                            title="Convert to Sales Invoice (Status: Purchased)"
                          >
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>{invoicingId === l._id ? 'Invoicing...' : 'Convert to Invoice'}</span>
                          </button>

                          {/* Convert to Booking Button */}
                          {l.status !== 'Converted to Booking' && (
                            <button
                              type="button"
                              onClick={() => handleConvertToBooking(l)}
                              disabled={convertingId === l._id || invoicingId === l._id}
                              className="px-2 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                              title="Convert to Reservation Booking"
                            >
                              <Flame className="w-3 h-3 fill-blue-600" />
                              <span>Booking</span>
                            </button>
                          )}

                          {/* Mark Lost Sale Button */}
                          {l.status !== 'Lost Sale' && (
                            <button
                              type="button"
                              onClick={() => { setLostSaleModalLead(l); setLostReasonInput(''); }}
                              className="px-2 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                              title="Customer did not buy - Mark as Lost Sale"
                            >
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Lost Sale</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lost Sale Reason Confirmation Modal */}
      {lostSaleModalLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">Mark as Lost Sale</h3>
              </div>
              <button onClick={() => setLostSaleModalLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Mark inquiry <strong>{lostSaleModalLead.leadId}</strong> ({lostSaleModalLead.customerName} - {lostSaleModalLead.modelName}) as a <strong>Lost Sale</strong> because the customer did not finalize the purchase.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Lost Sale</label>
                <select
                  value={lostReasonInput}
                  onChange={(e) => setLostReasonInput(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs text-slate-900 mb-2 font-medium"
                >
                  <option value="">Select a common reason (or type below)</option>
                  <option value="Customer bought from another dealer / competitor">Customer bought from another dealer / competitor</option>
                  <option value="Budget / Price too high">Budget / Price too high</option>
                  <option value="Leasing finance rejected">Leasing finance rejected</option>
                  <option value="Desired color/variant not immediately available in stock">Desired color/variant not immediately available in stock</option>
                  <option value="Postponed purchase to next quarter/year">Postponed purchase to next quarter/year</option>
                  <option value="Unreachable after multiple follow-up attempts">Unreachable after multiple follow-up attempts</option>
                </select>

                <input
                  type="text"
                  placeholder="Custom note or specific lost reason..."
                  value={lostReasonInput}
                  onChange={(e) => setLostReasonInput(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLostSaleModalLead(null)}
                  className="flex-1 p-2.5 border rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLostSale}
                  className="flex-1 p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  Confirm Lost Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">New TVS Motorcycle Inquiry</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3.5 text-xs text-slate-900">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Customer Full Name *</label>
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
                  <label className="block font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0771234567"
                    value={newLead.customerPhone}
                    onChange={(e) => setNewLead({ ...newLead, customerPhone: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              {/* Motorcycle Specific In-Depth Classifications */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="font-bold text-[11px] text-slate-700 uppercase tracking-wider">
                  Motorcycle Classification Details
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Category *</label>
                    <select
                      value={newLead.category}
                      onChange={(e) => setNewLead({ ...newLead, category: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    >
                      <option value="Sport Motorcycles">Sport Motorcycles</option>
                      <option value="Scooters">Scooters</option>
                      <option value="Commuter Motorcycles">Commuter Motorcycles</option>
                      <option value="Premium Motorcycles">Premium Motorcycles</option>
                      <option value="Electric Two-Wheelers">Electric Two-Wheelers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Type *</label>
                    <select
                      value={newLead.vehicleType}
                      onChange={(e) => setNewLead({ ...newLead, vehicleType: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    >
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Moped">Moped</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">TVS Model *</label>
                    <select
                      value={newLead.modelName}
                      onChange={(e) => setNewLead({ ...newLead, modelName: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
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
                    <label className="block font-bold mb-1">Engine Displacement (CC)</label>
                    <input
                      type="text"
                      placeholder="e.g. 159.7 cc"
                      value={newLead.engineCapacity}
                      onChange={(e) => setNewLead({ ...newLead, engineCapacity: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Variant / Trim</label>
                    <input
                      type="text"
                      placeholder="e.g. Special Edition Disc"
                      value={newLead.variantName}
                      onChange={(e) => setNewLead({ ...newLead, variantName: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Matte Black"
                      value={newLead.selectedColor}
                      onChange={(e) => setNewLead({ ...newLead, selectedColor: e.target.value })}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Branch</label>
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

                <div>
                  <label className="block font-bold mb-1">Lead Source</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  >
                    <option value="Showroom Walk-in">Showroom Walk-in (Shop Visit)</option>
                    <option value="Website Online Inquiry">Website Online Inquiry</option>
                    <option value="Hotline Phone Call">Hotline Phone Call</option>
                    <option value="WhatsApp Inquiry">WhatsApp Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Customer Budget (LKR)</label>
                  <input
                    type="number"
                    value={newLead.budget}
                    onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Initial Status</label>
                  <select
                    value={newLead.status}
                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 font-semibold"
                  >
                    <option value="New Request">New Request</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Purchased">Purchased (Invoice Converted)</option>
                    <option value="Lost Sale">Lost Sale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Inquiry / Notes</label>
                <textarea
                  rows={2}
                  value={newLead.inquiryMessage}
                  onChange={(e) => setNewLead({ ...newLead, inquiryMessage: e.target.value })}
                  placeholder="Notes on customer preference or financing..."
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
                  Create Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
