"use client";

import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  Save,
  CreditCard
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [nicOrPassport, setNicOrPassport] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(getApiUrl('/customers/me'), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          setFullName(data.fullName || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setCity(data.city || '');
          setNicOrPassport(data.nicOrPassport || '');
          setOccupation(data.occupation || '');
          setCompany(data.company || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(getApiUrl('/customers/me'), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phone,
          address,
          city,
          nicOrPassport,
          occupation,
          company,
        }),
      });

      const updated = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(updated.message || 'Could not update profile details.');

      setProfile(updated);
      setMessage('Profile details updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading your profile...</div>;
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 customer-account-page">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" />
          Personal Customer Profile
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Keep your contact information up to date so our finance managers and sales representatives can assist you smoothly.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address (Account Login)
            </label>
            <input
              type="email"
              disabled
              value={profile?.email || ''}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 px-3.5 text-xs text-slate-400 cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Contact customer support to modify primary login email.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              NIC / Passport Number
            </label>
            <input
              type="text"
              placeholder="e.g. 199012345678 or N1234567"
              value={nicOrPassport}
              onChange={(e) => setNicOrPassport(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              placeholder="House no, street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              City / Postal Town
            </label>
            <input
              type="text"
              placeholder="e.g. Colombo 07, Kandy"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Occupation / Profession
            </label>
            <input
              type="text"
              placeholder="e.g. Software Architect, Medical Doctor"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Company / Employer
            </label>
            <input
              type="text"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
