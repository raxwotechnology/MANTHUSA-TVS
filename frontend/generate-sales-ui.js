const fs = require('fs');
const path = require('path');

const salesPage = `"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch('http://localhost:3001/sales');
        if (res.ok) {
          const data = await res.json();
          setSales(data);
        }
      } catch (err) {
        console.error('Failed to fetch sales', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sales & Invoicing</h1>
        <Link 
          href="/dashboard/sales/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Sale
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-4 text-center">Loading sales...</div>
        ) : sales.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No sales recorded yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sales.map((s: any) => (
              <li key={s._id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      Invoice: {s.invoiceNumber || 'N/A'} - {s.customer?.fullName || 'Unknown Customer'}
                    </p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      Vehicle: {s.vehicle?.make} {s.vehicle?.model} | Amount: LKR {s.finalAmount?.toLocaleString()} | Balance: LKR {s.balance?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {s.status}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
`;

const newSalePage = `"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSalePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customer: '', // Should be fetched from DB in real scenario
    vehicle: '',  // Should be fetched from DB in real scenario
    vehiclePrice: 0,
    discount: 0,
    additionalCharges: 0,
    status: 'Confirmed'
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = Number(formData.vehiclePrice) - Number(formData.discount) + Number(formData.additionalCharges);
    try {
      const res = await fetch('http://localhost:3001/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, finalAmount, balance: finalAmount, paidAmount: 0 })
      });
      if (res.ok) {
        router.push('/dashboard/sales');
      } else {
        alert('Failed to create sale. Make sure ObjectIds for Customer and Vehicle are valid if enforced.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
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
                <input required type="text" name="invoiceNumber" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                <input required type="text" name="customer" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" placeholder="ObjectId" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Vehicle ID</label>
                <input required type="text" name="vehicle" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" placeholder="ObjectId" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Vehicle Price</label>
                <input required type="number" name="vehiclePrice" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Discount</label>
                <input type="number" name="discount" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Additional Charges</label>
                <input type="number" name="additionalCharges" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" />
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Process Sale</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
`;

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(__dirname, 'src', 'app', 'dashboard', 'sales', 'new'));
fs.writeFileSync(path.join(__dirname, 'src', 'app', 'dashboard', 'sales', 'page.tsx'), salesPage);
fs.writeFileSync(path.join(__dirname, 'src', 'app', 'dashboard', 'sales', 'new', 'page.tsx'), newSalePage);

console.log('Sales UI generated');
