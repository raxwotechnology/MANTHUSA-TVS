"use client";
import { apiFetch } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    transactionType: 'OUT',
    source: 'Expense',
    amount: 0,
    description: '',
    transactionDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/cash-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify((() => { const { _id, ...rest } = formData as any; return rest; })())
      });
      if (res.ok) {
        router.push('/dashboard/finance');
      } else {
        alert('Failed to record expense.');
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Record Expense</h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href="/dashboard/finance">
            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
                <input required type="number" name="amount" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input required type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" />
              </div>
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">Description / Category</label>
                <input required type="text" name="description" placeholder="e.g. Electricity Bill, Vehicle Repair" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm text-black" />
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">Record OUT Transaction</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



