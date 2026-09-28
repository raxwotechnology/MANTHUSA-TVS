"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import { Car, Check, X, Search, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VehicleComparisonPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/vehicles')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setVehicles(data);
          if (data.length >= 2) {
            setSelectedIds([data[0]._id, data[1]._id]);
          } else if (data.length === 1) {
            setSelectedIds([data[0]._id]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert('You can compare up to 4 vehicles at a time.');
      }
    }
  };

  const selectedVehicles = vehicles.filter((v) => selectedIds.includes(v._id));

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/vehicles" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Vehicles
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vehicle Comparison Tool</h1>
            <p className="text-xs text-slate-500">Compare specifications, prices, condition & features side-by-side</p>
          </div>
        </div>

        {/* Vehicle Selection Drawer/Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Select Vehicles to Compare (Max 4):</span>
            <span className="text-xs text-slate-500 font-semibold">{selectedIds.length} Selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => {
              const isSelected = selectedIds.includes(v._id);
              return (
                <button
                  key={v._id}
                  onClick={() => toggleSelect(v._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>{v.make} {v.model} ({v.year || v.manufacturingYear || 2020})</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        {selectedVehicles.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">No vehicles selected for comparison.</p>
            <p className="text-xs">Click on the vehicles above to add them to the comparison matrix.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-700 w-48 border-r border-slate-200">Specification</th>
                  {selectedVehicles.map((v) => (
                    <th key={v._id} className="p-4 font-bold text-slate-900 min-w-[220px] border-r border-slate-200">
                      <div className="space-y-1">
                        <div className="h-28 bg-slate-100 rounded-xl overflow-hidden mb-2 relative">
                          {v.images?.[0] ? (
                            <img src={v.images[0]} alt={v.model} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Car className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-extrabold">{v.make} {v.model}</p>
                        <p className="text-emerald-700 font-black text-sm">{formatLKR(v.sellingPrice)}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Stock # / Reg #</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{v.stockNumber} ({v.registrationNumber || 'Unregistered'})</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Make & Model</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{v.make} {v.model} {v.variant}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Year / Mfg Year</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{v.year || v.manufacturingYear} / Reg: {v.registeredYear || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Condition</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">{v.condition || 'Used'}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Fuel Type</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{v.fuelType}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Transmission</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{v.transmission}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Engine Capacity</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{v.engineCapacity || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Mileage</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{(v.mileage || 0).toLocaleString()} km</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Color</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">{v.color}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Total Investment</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200 font-semibold">{formatLKR(v.totalInvestment)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Expected Profit Margin</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200 text-emerald-600 font-bold">{formatLKR(v.expectedProfit)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 bg-slate-50 font-bold border-r border-slate-200">Status</td>
                  {selectedVehicles.map((v) => (
                    <td key={v._id} className="p-3 border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>{v.status}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
