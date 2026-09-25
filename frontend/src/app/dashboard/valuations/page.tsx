"use client";
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TrendingUp, Plus, CheckCircle2 } from 'lucide-react';

export default function ValuationsPage() {
  const [valuations, setValuations] = useState([
    {
      _id: '1',
      valuationId: 'VAL-001',
      customerName: 'Nimal Jayasinghe',
      vehicle: 'Toyota Vitz 2017 F Package',
      askingPrice: 5800000,
      marketValuation: 5500000,
      repairEstimate: 120000,
      offeredPrice: 5350000,
      status: 'Offer Made'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Trade-in & Valuation</h1>
          <p className="text-xs text-slate-500">Sell request inspection, market valuation, repair estimates, and dealership purchase offers</p>
        </div>

        <button className="flex items-center gap-1.5 bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg">
          <Plus className="w-4 h-4" />
          <span>+ Record Valuation Request</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-700 font-semibold">
              <th className="py-3 px-4">Valuation #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle Details</th>
              <th className="py-3 px-4">Customer Asking</th>
              <th className="py-3 px-4">Market Valuation</th>
              <th className="py-3 px-4">Repair Estimate</th>
              <th className="py-3 px-4">Dealership Offer</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {valuations.map((v) => (
              <tr key={v._id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900">{v.valuationId}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{v.customerName}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">{v.vehicle}</td>
                <td className="py-3 px-4 text-slate-600">LKR {v.askingPrice.toLocaleString()}</td>
                <td className="py-3 px-4 font-semibold text-blue-600">LKR {v.marketValuation.toLocaleString()}</td>
                <td className="py-3 px-4 text-rose-600">LKR {v.repairEstimate.toLocaleString()}</td>
                <td className="py-3 px-4 font-extrabold text-emerald-600">LKR {v.offeredPrice.toLocaleString()}</td>
                <td className="py-3 px-4"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">{v.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
