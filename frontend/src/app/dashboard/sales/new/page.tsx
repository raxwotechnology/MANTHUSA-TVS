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
    additionalCharges: 0,
    status: 'Confirmed'
  });
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([apiFetch('/customers'), apiFetch('/vehicles')]).then(async ([customerRes, vehicleRes]) => {
      if (!customerRes.ok || !vehicleRes.ok) throw new Error('Could not load customers and available vehicles.');
      const [customerData, vehicleData] = await Promise.all([customerRes.json(), vehicleRes.json()]);
      setCustomers(customerData);
      setVehicles(vehicleData.filter((vehicle: any) => ['Available', 'Reserved'].includes(vehicle.status)));
    }).catch((err) => setError(err instanceof Error ? err.message : 'Could not load sale options.'));
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const finalAmount = Number(formData.vehiclePrice) - Number(formData.discount) + Number(formData.additionalCharges);
    try {
      const res = await apiFetch('/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, finalAmount, balance: finalAmount, paidAmount: 0 })
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

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Sale Invoice</h1>
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
              <input type="text" name="invoiceNumber" placeholder="e.g. INV-2026-0089 (Leave blank for auto)" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle</label>
              <select required name="vehicle" value={formData.vehicle} onChange={(event) => { const vehicle = vehicles.find((item) => item._id === event.target.value); setFormData((current) => ({ ...current, vehicle: event.target.value, vehiclePrice: vehicle?.sellingPrice || 0 })); }} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900">
                <option value="">-- Choose a vehicle (e.g. Toyota Axio) --</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>{vehicle.make} {vehicle.model} {vehicle.year} · LKR {Number(vehicle.sellingPrice || 0).toLocaleString()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Price (LKR)</label>
              <input required type="number" name="vehiclePrice" placeholder="e.g. 12,500,000" value={formData.vehiclePrice || ''} onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-bold text-emerald-700" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discount (LKR)</label>
              <input type="number" name="discount" placeholder="e.g. 150,000" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Additional Charges (LKR)</label>
              <input type="number" name="additionalCharges" placeholder="e.g. 25,000" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
            <Link href="/dashboard/sales">
              <button type="button" className="px-4 py-2 border rounded-lg text-slate-600 text-xs font-semibold">Cancel</button>
            </Link>
            <button type="submit" disabled={busy} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 shadow-xs">
              {busy ? 'Processing Invoice...' : 'Process Sale Invoice'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
