"use client";
import { apiFetch } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    nicOrPassport: '',
    city: '',
    customerType: 'Individual'
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify((() => { const { _id, ...rest } = formData as any; return rest; })())
      });
      if (res.ok) {
        router.push('/dashboard/customers');
      } else {
        alert('Failed to add customer');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Add New Customer</h1>
          <p className="text-xs text-slate-500">Create new customer profile in CRM directory</p>
        </div>
        <Link href="/dashboard/customers">
          <button type="button" className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50">Cancel</button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input required type="text" name="fullName" placeholder="e.g. Kasun Kalhara" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input required type="text" name="phone" placeholder="e.g. +94 77 123 4567" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input type="email" name="email" placeholder="e.g. kasun@example.com" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIC / Passport</label>
              <input type="text" name="nicOrPassport" placeholder="e.g. 199212345678 / 921234567V" onChange={handleChange} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
            <Link href="/dashboard/customers">
              <button type="button" className="px-4 py-2 border rounded-lg text-slate-600 text-xs font-semibold">Cancel</button>
            </Link>
            <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs">Save Customer</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
