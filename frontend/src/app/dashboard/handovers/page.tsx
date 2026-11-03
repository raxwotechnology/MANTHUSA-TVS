'use client';
import React, { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, Clock, FileText, PenTool, Printer, RefreshCw, X, ShieldCheck } from 'lucide-react';

export default function HandoversPage() {
  const [handovers, setHandovers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeHandover, setActiveHandover] = useState<any>(null);

  // Digital Signature Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');

  const [form, setForm] = useState({
    saleId: '',
    handoverDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    checklist: {
      vehicleInspection: true,
      keys: true,
      spareKey: true,
      cr: true,
      insurance: true,
      serviceBook: true,
      userManual: true,
      accessories: true,
      numberPlates: true,
      customerSignature: false,
    },
    notes: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resHandovers, resSales] = await Promise.all([
        apiFetch('/vehicle-handovers'),
        apiFetch('/sales'),
      ]);
      if (resHandovers.ok) setHandovers(await resHandovers.json());
      if (resSales.ok) setSales(await resSales.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
      setForm((prev) => ({
        ...prev,
        checklist: { ...prev.checklist, customerSignature: true },
      }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData('');
      setForm((prev) => ({
        ...prev,
        checklist: { ...prev.checklist, customerSignature: false },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSale = sales.find((s) => s._id === form.saleId);

    const customerId = selectedSale?.customer?._id || (typeof selectedSale?.customer === 'string' && selectedSale.customer.length === 24 ? selectedSale.customer : null);
    const vehicleId = selectedSale?.vehicle?._id || (typeof selectedSale?.vehicle === 'string' && selectedSale.vehicle.length === 24 ? selectedSale.vehicle : null);

    if (!selectedSale || !customerId || !vehicleId) {
      alert('Please select a valid sale invoice with an associated vehicle and customer.');
      return;
    }

    const payload = {
      sale: form.saleId,
      vehicle: vehicleId,
      customer: customerId,
      handoverDate: form.handoverDate,
      status: form.status,
      checklist: {
        ...form.checklist,
        customerSignature: Boolean(form.checklist.customerSignature || signatureData),
      },
      customerSignatureData: signatureData,
      notes: form.notes,
    };

    try {
      const res = await apiFetch('/vehicle-handovers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        loadData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Could not save handover record.');
      }
    } catch (err: any) {
      alert(err.message || 'Network error.');
    }
  };

  const handleUpdateStatus = async (handoverId: string, newStatus: string, currentChecklist: any) => {
    try {
      const allChecklist = {
        vehicleInspection: true,
        keys: true,
        spareKey: true,
        cr: true,
        insurance: true,
        serviceBook: true,
        userManual: true,
        accessories: true,
        numberPlates: true,
        customerSignature: true,
        ...(currentChecklist || {}),
      };

      const res = await apiFetch(`/vehicle-handovers/${handoverId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, checklist: allChecklist }),
      });
      if (res.ok) {
        loadData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Could not update handover status.');
      }
    } catch (e: any) {
      alert(e.message || 'Network error.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Motorcycle Handover & PDI Checklist</h1>
            <p className="text-xs text-slate-500">Pre-delivery inspection verification, key handover & digital customer signature</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setSignatureData(''); }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <PenTool className="w-4 h-4" />
            <span>Prepare New Handover</span>
          </button>
        </div>

        {/* List of Handover Records */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Handover Date</th>
                <th className="p-3.5">Checklist Completed</th>
                <th className="p-3.5">Signature</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {handovers.map((h) => {
                const checklistCount = Object.values(h.checklist || {}).filter(Boolean).length;
                return (
                  <tr key={h._id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-bold text-blue-700">{h.sale?.invoiceNumber || '—'}</td>
                    <td className="p-3.5">{typeof h.customer === 'object' ? h.customer?.fullName : h.customer}</td>
                    <td className="p-3.5">{typeof h.vehicle === 'object' ? `${h.vehicle?.make} ${h.vehicle?.model}` : h.vehicle}</td>
                    <td className="p-3.5">{h.handoverDate ? new Date(h.handoverDate).toLocaleDateString() : 'Pending'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                        {checklistCount}/10 items
                      </span>
                    </td>
                    <td className="p-3.5">
                      {h.customerSignatureData || h.checklist?.customerSignature ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Signed</span>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        h.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>{h.status}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {h.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateStatus(h._id, 'Completed', h.checklist)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                          </button>
                        )}
                        <button
                          onClick={() => window.print()}
                          className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1 text-slate-700"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print Delivery Note
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {handovers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">No handover records found. Click &quot;Prepare New Handover&quot; to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Handover Creation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-slate-900">Prepare Vehicle Handover Note</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Sale Invoice</label>
                  <select
                    required
                    value={form.saleId}
                    onChange={(e) => setForm({ ...form, saleId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800"
                  >
                    <option value="">-- Choose Sale --</option>
                    {sales.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.invoiceNumber} - {s.customer?.fullName || 'Customer'} ({s.vehicle?.make} {s.vehicle?.model})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Handover Date</label>
                    <input
                      type="date"
                      value={form.handoverDate}
                      onChange={(e) => setForm({ ...form, handoverDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Handover Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ready">Ready for Delivery</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Checklist Section */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 border-b pb-1">Pre-Delivery Handover Checklist</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-800">
                    {[
                      { key: 'vehicleInspection', label: 'PDI Technical Inspection' },
                      { key: 'keys', label: 'Primary Ignition Key' },
                      { key: 'spareKey', label: 'Spare Key' },
                      { key: 'cr', label: 'Registration Book (CR / Docs)' },
                      { key: 'insurance', label: 'Insurance Certificate' },
                      { key: 'serviceBook', label: 'Warranty & Service Book' },
                      { key: 'userManual', label: 'TVS User Manual' },
                      { key: 'accessories', label: 'Standard Tool Kit & Mirrors' },
                      { key: 'numberPlates', label: 'Number Plates / Temp Tag' },
                      { key: 'customerSignature', label: 'Customer Signed Approval' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(form.checklist as any)[key]}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              checklist: { ...form.checklist, [key]: e.target.checked },
                            })
                          }
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* HTML5 Canvas Signature Pad */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">Customer Digital Signature</label>
                    <button type="button" onClick={clearCanvas} className="text-xs text-rose-600 hover:underline">Clear Signature</button>
                  </div>
                  <div className="border border-slate-300 rounded-xl bg-slate-50 p-2 text-center">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="bg-white border border-slate-200 rounded-lg mx-auto cursor-crosshair shadow-inner"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Draw customer signature using mouse or touch screen</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-xl font-semibold">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md">Save & Complete Handover</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
