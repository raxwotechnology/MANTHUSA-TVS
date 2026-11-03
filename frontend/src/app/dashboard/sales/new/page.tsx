"use client";
import { apiFetch } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NewSalePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customer: '',
    vehicle: '',
    vehiclePrice: 0,
    discount: 0,
    tradeInAllowance: 0,
    tradeInMake: '',
    tradeInModel: '',
    tradeInRegNumber: '',
    paymentMethod: 'Bank Transfer',
    additionalCharges: 0,
    status: 'Confirmed'
  });
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingPaidAmount, setExistingPaidAmount] = useState(0);

  useEffect(() => {
    Promise.all([apiFetch('/customers'), apiFetch('/vehicles')]).then(async ([customerRes, vehicleRes]) => {
      if (!customerRes.ok || !vehicleRes.ok) throw new Error('Could not load customers and available vehicles.');
      const [customerData, vehicleData] = await Promise.all([customerRes.json(), vehicleRes.json()]);
      setCustomers(customerData);
      setVehicles(vehicleData.filter((vehicle: any) => ['Available', 'Reserved'].includes(vehicle.status)));
    }).catch((err) => setError(err instanceof Error ? err.message : 'Could not load sale options.'));
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;
    setEditingId(id);
    apiFetch(`/sales/${id}`).then(async (response) => {
      if (!response.ok) throw new Error('Could not load invoice for editing.');
      const sale = await response.json();
      setExistingPaidAmount(Number(sale.paidAmount || 0));
      setFormData({
        invoiceNumber: sale.invoiceNumber || '',
        customer: sale.customer?._id || sale.customer || '',
        vehicle: sale.vehicle?._id || sale.vehicle || '',
        vehiclePrice: sale.vehiclePrice || 0,
        discount: sale.discount || 0,
        tradeInAllowance: sale.tradeInAllowance || 0,
        tradeInMake: sale.tradeInVehicleDetails?.make || '',
        tradeInModel: sale.tradeInVehicleDetails?.model || '',
        tradeInRegNumber: sale.tradeInVehicleDetails?.regNumber || '',
        paymentMethod: sale.paymentMethod || 'Bank Transfer',
        additionalCharges: sale.additionalCharges || 0,
        status: sale.status || 'Confirmed'
      });
      if (sale.tradeInAllowance > 0) setHasTradeIn(true);
      if (sale.vehicle?._id) setVehicles((current) => current.some((vehicle) => vehicle._id === sale.vehicle._id) ? current : [...current, sale.vehicle]);
    }).catch((err) => setError(err instanceof Error ? err.message : 'Could not load invoice.'));
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const tradeInAllowance = hasTradeIn ? Number(formData.tradeInAllowance || 0) : 0;
    const finalAmount = Math.max(0, Number(formData.vehiclePrice) - Number(formData.discount) - tradeInAllowance + Number(formData.additionalCharges));
    try {
      const payload = {
        ...formData,
        tradeInAllowance,
        tradeInVehicleDetails: hasTradeIn ? { make: formData.tradeInMake, model: formData.tradeInModel, regNumber: formData.tradeInRegNumber, valuationAmount: tradeInAllowance } : undefined,
        finalAmount,
        balance: finalAmount - existingPaidAmount,
        paidAmount: existingPaidAmount
      };
      const res = await apiFetch(editingId ? `/sales/${editingId}` : '/sales', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        router.push('/dashboard/sales');
      } else {
        const details = await res.json().catch(() => ({}));
        setError(details.message || 'Could not create sale.');
      }
    } catch (err) {
      console.error(err);
      setError('Cannot connect to the server.');
    } finally {
      setBusy(false);
    }
  };

  const calculatedTotal = Math.max(0, Number(formData.vehiclePrice || 0) - Number(formData.discount || 0) - (hasTradeIn ? Number(formData.tradeInAllowance || 0) : 0) + Number(formData.additionalCharges || 0));

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{editingId ? 'Edit Sale Invoice' : 'Create Sale Invoice'}</h1>
          <p className="text-xs text-slate-500">Issue official vehicle sale invoice and record customer payment terms</p>
        </div>
        <div>
          <Link href="/dashboard/sales">
            <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50">Cancel</button>
          </Link>
        </div>
      </div>

      {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 font-medium">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Number</label>
              <input type="text" name="invoiceNumber" value={formData.invoiceNumber} placeholder="e.g. INV-2026-0089 (Leave blank for auto)" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer</label>
              <select required name="customer" value={formData.customer} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900">
                <option value="">-- Choose a customer (e.g. Nimal Perera) --</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>{customer.fullName} · {customer.phone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">TVS Motorcycle Model</label>
              <select required name="vehicle" value={formData.vehicle} onChange={(event) => { const vehicle = vehicles.find((item) => item._id === event.target.value); setFormData((current) => ({ ...current, vehicle: event.target.value, vehiclePrice: vehicle?.sellingPrice || 0 })); }} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900">
                <option value="">-- Choose a TVS motorcycle (e.g. Apache RTR 160 4V) --</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>{vehicle.make} {vehicle.model} ({vehicle.variant || vehicle.engineCapacity || 'Standard'}) · LKR {Number(vehicle.sellingPrice || 0).toLocaleString()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900">
                <option value="Bank Transfer">Bank Transfer / Direct Deposit</option>
                <option value="Cash">Showroom Cash</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Online Payment">Online Payment Gateway</option>
                <option value="Leasing">Bike Leasing Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motorcycle Selling Price (LKR)</label>
              <input required type="number" name="vehiclePrice" placeholder="e.g. 785,000" value={formData.vehiclePrice || ''} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-bold text-emerald-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount (LKR)</label>
              <input type="number" name="discount" value={formData.discount || ''} placeholder="e.g. 150,000" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
          </div>

          {/* Trade-In / Vehicle Exchange Section */}
          <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-900">
                <input type="checkbox" checked={hasTradeIn} onChange={(e) => setHasTradeIn(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
                <span>Trade-In / Vehicle Exchange (Customer's Old Vehicle Deduction)</span>
              </label>
              {hasTradeIn && <span className="text-[11px] font-bold text-amber-800">Valuation Allowance Deducted from Total</span>}
            </div>

            {hasTradeIn && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">Trade-In Make</label>
                  <input type="text" name="tradeInMake" value={formData.tradeInMake} placeholder="e.g. Suzuki" onChange={handleChange} className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">Trade-In Model</label>
                  <input type="text" name="tradeInModel" value={formData.tradeInModel} placeholder="e.g. Wagon R" onChange={handleChange} className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">Reg Number</label>
                  <input type="text" name="tradeInRegNumber" value={formData.tradeInRegNumber} placeholder="e.g. WP CAR-1234" onChange={handleChange} className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">Trade-In Allowance (LKR)</label>
                  <input type="number" name="tradeInAllowance" value={formData.tradeInAllowance || ''} placeholder="e.g. 3,500,000" onChange={handleChange} className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-900" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl font-bold">
            <span>Net Calculated Total Amount:</span>
            <span className="text-base text-emerald-400 font-extrabold font-mono">LKR {calculatedTotal.toLocaleString('en-LK')}</span>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
            <Link href="/dashboard/sales">
              <button type="button" className="px-4 py-2 border rounded-lg text-slate-600 text-xs font-semibold">Cancel</button>
            </Link>
            <button type="submit" disabled={busy} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 shadow-xs">
              {busy ? 'Saving Invoice...' : editingId ? 'Save Invoice Changes' : 'Process Sale Invoice'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
