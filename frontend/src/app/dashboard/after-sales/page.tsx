"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import { ShieldCheck, FileText, Calendar, Plus, Printer, X, CheckCircle, Wrench } from 'lucide-react';

export default function AfterSalesPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mtaModal, setMtaModal] = useState<any | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await apiFetch('/after-sales');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        setError('Could not load after-sales records.');
      }
    } catch {
      setError('Cannot connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMta = async (id: string, type: 'mta6' | 'mta8') => {
    try {
      const res = await apiFetch(`/after-sales/${id}/${type}`);
      if (!res.ok) throw new Error('Could not fetch MTA form.');
      const data = await res.json();
      setMtaModal(data);
    } catch (err: any) {
      alert(err.message || 'Error generating RMV form.');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">After-Sales, Warranty & RMV Transfer Management</h1>
          <p className="text-xs text-slate-500">Auto-fill RMV MTA 6 & MTA 8 Transfer Forms, track engine/gearbox warranties and free services</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Invoice / Sale</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Warranty Status</th>
                <th className="py-3 px-4">Service Schedule</th>
                <th className="py-3 px-4">RMV Ownership Forms</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.sale?.invoiceNumber || r._id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{r.customer?.name || 'Customer'}</div>
                    <div className="text-[11px] text-slate-500">{r.customer?.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3" /> Active Warranty
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" /> 1st Free Service (1,000 km)
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleFetchMta(r._id, 'mta6')} className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] rounded-lg border border-blue-200">
                        📄 MTA 6 Form
                      </button>
                      <button onClick={() => handleFetchMta(r._id, 'mta8')} className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[10px] rounded-lg border border-purple-200">
                        📋 MTA 8 Form
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[11px] font-semibold text-slate-500">{r.nextFollowUp ? new Date(r.nextFollowUp).toLocaleDateString() : 'Scheduled'}</span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No after-sales records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RMV Transfer Form Modal */}
      {mtaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{mtaModal.formTitle}</h3>
                <p className="text-[11px] font-mono text-slate-500">{mtaModal.department}</p>
              </div>
              <button onClick={() => setMtaModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-slate-800 p-5 rounded-xl space-y-4 text-xs font-serif bg-slate-50">
              <div className="text-center border-b pb-2">
                <div className="font-extrabold text-sm">{mtaModal.formTitle}</div>
                <div className="text-[10px] text-slate-600 font-sans mt-0.5">Ref: {mtaModal.transferDetails?.rmvReference || mtaModal.noticeDetails?.status}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded border">
                <div>
                  <div className="font-bold border-b pb-1 text-slate-800 mb-1">TRANSFEROR (SELLER):</div>
                  <div>Name: <span className="font-semibold">{mtaModal.transferor?.name || mtaModal.registeredOwner?.name}</span></div>
                  <div>Reg No: <span className="font-mono">{mtaModal.transferor?.nicOrReg || mtaModal.registeredOwner?.nic}</span></div>
                  <div>Address: <span>{mtaModal.transferor?.address || mtaModal.registeredOwner?.address}</span></div>
                </div>
                <div>
                  <div className="font-bold border-b pb-1 text-slate-800 mb-1">TRANSFEREE (BUYER):</div>
                  <div>Name: <span className="font-semibold">{mtaModal.transferee?.name || mtaModal.newOwner?.name}</span></div>
                  <div>NIC/Passport: <span className="font-mono">{mtaModal.transferee?.nicOrPassport || mtaModal.newOwner?.nic}</span></div>
                  <div>Address: <span>{mtaModal.transferee?.address || mtaModal.newOwner?.address}</span></div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border space-y-1">
                <div className="font-bold border-b pb-1 text-slate-800 mb-1">VEHICLE IDENTIFICATION DATA:</div>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>Registration No: <span className="font-bold text-slate-900">{mtaModal.vehicle?.registrationNumber || mtaModal.vehicleDetails?.regNo}</span></div>
                  <div>Make / Model: <span>{mtaModal.vehicle?.make || mtaModal.vehicleDetails?.makeModel} {mtaModal.vehicle?.model}</span></div>
                  <div>Chassis No (VIN): <span>{mtaModal.vehicle?.chassisNumber || mtaModal.vehicleDetails?.chassisNo}</span></div>
                  <div>Engine No: <span>{mtaModal.vehicle?.engineNumber || mtaModal.vehicleDetails?.engineNo}</span></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <button onClick={() => window.print()} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs">
                <Printer className="w-4 h-4" /> Print RMV Form
              </button>
              <button onClick={() => setMtaModal(null)} className="px-4 py-2 border text-slate-600 font-semibold text-xs rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
