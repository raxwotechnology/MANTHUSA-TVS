"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Plus,
  Search,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  FileText,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';

interface Transaction {
  _id: string;
  transactionId: string;
  transactionType: 'IN' | 'OUT';
  category: string;
  amount: number;
  transactionDate: string;
  paymentMethod: string;
  referenceNumber: string;
  description: string;
}

import { getApiUrl } from '@/lib/api';

export default function ReceiptsVouchersPage() {
  const [activeTab, setActiveTab] = useState<'OUT' | 'IN'>('OUT');
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      _id: '1',
      transactionId: 'CTX-001',
      transactionType: 'IN',
      category: 'Customer Payment',
      amount: 9915000,
      transactionDate: '2026-09-24',
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'RCP-001',
      description: 'Full payment received for Nissan X-Trail sale (INV-2026-001)'
    },
    {
      _id: '2',
      transactionId: 'CTX-002',
      transactionType: 'OUT',
      category: 'Vehicle Repair',
      amount: 120000,
      transactionDate: '2026-09-24',
      paymentMethod: 'Cash',
      referenceNumber: 'VCH-881',
      description: 'Paid for Honda Vezel detailing & repair'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterMethod, setFilterMethod] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'IN' | 'OUT'>('OUT');

  // Form State
  const [formData, setFormData] = useState({
    category: 'Customer Payment',
    amount: '',
    paymentMethod: 'Cash',
    referenceNumber: '',
    description: ''
  });

  useEffect(() => {
    const fetchTxs = async () => {
      try {
        const res = await fetch(getApiUrl('/cash-transactions'));
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setTransactions(data);
        }
      } catch (err) {
        console.error('Failed to fetch cash transactions', err);
      }
    };
    fetchTxs();
  }, []);

  const handleOpenModal = (type: 'IN' | 'OUT') => {
    setModalType(type);
    setFormData({
      category: type === 'IN' ? 'Customer Payment' : 'Vehicle Repair',
      amount: '',
      paymentMethod: 'Cash',
      referenceNumber: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      description: ''
    });
    setShowModal(true);
  };

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      _id: Date.now().toString(),
      transactionId: `CTX-${Math.floor(100 + Math.random() * 900)}`,
      transactionType: modalType,
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      transactionDate: new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod,
      referenceNumber: formData.referenceNumber,
      description: formData.description
    };

    try {
      await fetch(getApiUrl('/cash-transactions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify((() => { const { _id, ...rest } = newTx; return rest; })())
      });
    } catch (err) {
      console.log('Post tx fallback');
    }

    setTransactions([newTx, ...transactions]);
    setShowModal(false);
  };

  const filteredTxs = transactions.filter((tx) => {
    if (tx.transactionType !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchRef = tx.referenceNumber?.toLowerCase().includes(q);
      const matchDesc = tx.description?.toLowerCase().includes(q);
      const matchCat = tx.category?.toLowerCase().includes(q);
      if (!matchRef && !matchDesc && !matchCat) return false;
    }
    if (filterCategory !== 'ALL' && tx.category !== filterCategory) return false;
    if (filterMethod !== 'ALL' && tx.paymentMethod !== filterMethod) return false;
    return true;
  });

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <DashboardLayout>
      {/* Top Header & Buttons matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Receipts & Vouchers Module</h1>
          <p className="text-xs text-slate-500">Manage customer cash in receipts and cash out payment vouchers</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal('IN')}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Cash IN Receipt</span>
          </button>

          <button
            onClick={() => handleOpenModal('OUT')}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Issue Cash OUT Voucher</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        {/* Tab Selection Bar matching screenshot */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => setActiveTab('OUT')}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'OUT'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Cash OUT Vouchers</span>
          </button>

          <button
            onClick={() => setActiveTab('IN')}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'IN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Cash IN Receipts</span>
          </button>
        </div>

        {/* Filter Toolbar matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ref #, name, vehicle, hire #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Voucher Types</option>
            <option value="Customer Payment">Customer Payment</option>
            <option value="Vehicle Repair">Vehicle Repair</option>
            <option value="Transport Cost">Transport Cost</option>
            <option value="Supplier Payment">Supplier Payment</option>
            <option value="Petty Cash">Petty Cash</option>
          </select>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Card</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>

        {/* Table or Empty State matching screenshot */}
        {filteredTxs.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              No {activeTab === 'OUT' ? 'vouchers' : 'receipts'} found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Click &quot;Issue Cash {activeTab === 'OUT' ? 'OUT Voucher' : 'IN Receipt'}&quot; to record a new transaction
            </p>
            <button
              onClick={() => handleOpenModal(activeTab)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Cash {activeTab === 'OUT' ? 'OUT Voucher' : 'IN Receipt'}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTxs.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{tx.referenceNumber || tx.transactionId}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{tx.description}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{tx.paymentMethod}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.transactionDate}</td>
                    <td className={`py-3 px-4 text-right font-extrabold text-sm ${tx.transactionType === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {tx.transactionType === 'IN' ? '+' : '-'} {formatLKR(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating Transaction */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Record Cash {modalType === 'IN' ? 'IN Receipt' : 'OUT Voucher'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Customer Payment">Customer Payment</option>
                  <option value="Reservation Deposit">Reservation Deposit</option>
                  <option value="Vehicle Repair">Vehicle Repair & Maintenance</option>
                  <option value="Transport Cost">Transport & Fuel</option>
                  <option value="Supplier Payment">Supplier Payment</option>
                  <option value="Rent & Utilities">Rent & Utilities</option>
                  <option value="Advertising">Advertising & Marketing</option>
                  <option value="Salary">Staff Salary & Commission</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (LKR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Card">Card</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt / Voucher Reference #</label>
                <input
                  type="text"
                  required
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details of the payment..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Save {modalType === 'IN' ? 'Receipt' : 'Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
