"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookmarkCheck, Plus, Clock, CheckCircle2, X } from 'lucide-react';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([
    {
      _id: '1',
      reservationId: 'RES-2026-001',
      customerName: 'Kamal Gunaratne',
      vehicleName: 'Mercedes-Benz C200 AMG Line 2021',
      amount: 500000,
      expiryDate: '2026-09-29',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Reservations & Deposits</h1>
          <p className="text-xs text-slate-500">Hold vehicles with advance deposits, manage expiration timelines and refunds</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Reserve Vehicle</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Reservation #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Reserved Vehicle</th>
              <th className="py-3 px-4">Deposit Amount</th>
              <th className="py-3 px-4">Expiry Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reservations.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{r.reservationId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{r.customerName}</td>
                <td className="py-3 px-4 font-medium text-slate-700">{r.vehicleName}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">LKR {r.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-amber-600 font-semibold">{r.expiryDate}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
