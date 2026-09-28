"use client";
import { apiFetch } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Create Sale Invoice</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href="/dashboard/sales">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input type="text" name="invoiceNumber" placeholder="e.g. INV-2026-0089 (Leave blank for auto)" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black placeholder:text-gray-400" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select required name="customer" value={formData.customer} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black"><option value="">-- Choose a customer (e.g. Nimal Perera) --</option>{customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.fullName} · {customer.phone}</option>)}</select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                <select required name="vehicle" value={formData.vehicle} onChange={(event) => { const vehicle = vehicles.find((item) => item._id === event.target.value); setFormData((current) => ({ ...current, vehicle: event.target.value, vehiclePrice: vehicle?.sellingPrice || 0 })); }} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black"><option value="">-- Choose a vehicle (e.g. Toyota Axio) --</option>{vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.make} {vehicle.model} {vehicle.year} · LKR {Number(vehicle.sellingPrice || 0).toLocaleString()}</option>)}</select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Vehicle Price (LKR)</label>
                <input required type="number" name="vehiclePrice" placeholder="e.g. 12,500,000" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black placeholder:text-gray-400" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Discount (LKR)</label>
                <input type="number" name="discount" placeholder="e.g. 150,000" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black placeholder:text-gray-400" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Additional Charges (LKR)</label>
                <input type="number" name="additionalCharges" placeholder="e.g. 25,000" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black placeholder:text-gray-400" />
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 font-bold">Process Sale Invoice</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
