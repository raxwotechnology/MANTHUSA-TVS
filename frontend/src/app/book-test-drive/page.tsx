"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarCheck,
  Car,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import {
  PublicVehicle,
  fetchPublicVehicles,
  fetchPublicBranches,
  submitPublicInquiry,
  BranchInfo,
  formatLKR
} from '@/lib/publicApi';

function TestDriveFormContent() {
  const searchParams = useSearchParams();
  const prefillVehicleId = searchParams.get('vehicle') || '';

  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(prefillVehicleId);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [preferredBranch, setPreferredBranch] = useState('Colombo Flagship Showroom');
  const [hasValidLicense, setHasValidLicense] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [additionalMessage, setAdditionalMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successReference, setSuccessReference] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [vList, bList] = await Promise.all([
          fetchPublicVehicles(),
          fetchPublicBranches(),
        ]);
        setVehicles(vList);
        setBranches(bList);
        if (prefillVehicleId) {
          setSelectedVehicleId(prefillVehicleId);
        } else if (vList.length > 0) {
          setSelectedVehicleId(vList[0]._id);
        }
      } catch (err) {
        console.error('Failed to load test drive dependencies:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [prefillVehicleId]);

  // Today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const selectedVehicle = vehicles.find((v) => v._id === selectedVehicleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedVehicleId) {
      setError('Please select a vehicle for the test drive.');
      return;
    }
    if (fullName.trim().length < 2) {
      setError('Please provide your full legal name.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Please enter a valid telephone number.');
      return;
    }
    if (!preferredDate) {
      setError('Please select a preferred test drive date.');
      return;
    }
    if (new Date(preferredDate) < new Date(today)) {
      setError('The preferred date cannot be in the past.');
      return;
    }
    if (!hasValidLicense) {
      setError('You must confirm possession of a valid Sri Lankan or International Driving License.');
      return;
    }
    if (!privacyConsent) {
      setError('You must consent to the privacy policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      const detailedNotes = `[TEST DRIVE REQUEST] Branch: ${preferredBranch} | Slot: ${preferredTime} | Driving License: ${licenseNumber || 'Confirmed Yes'} | Notes: ${additionalMessage || 'Standard test drive request'}`;
      const res = await submitPublicInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        vehicle: selectedVehicleId,
        inquiryType: 'Test Drive',
        message: detailedNotes,
        preferredDate,
      });

      if (res.success) {
        setSuccessReference(`TD-${Date.now().toString().slice(-6)}`);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit test drive request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successReference) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 sm:p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
          <CalendarCheck className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Booking Request Received
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1">
            Test Drive Request Submitted
          </h2>
          <p className="text-sm font-mono text-slate-400 mt-2">
            Reference Number: <span className="text-amber-400 font-bold">{successReference}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-left text-xs text-slate-300 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Requested Vehicle:</span>
            <span className="font-bold text-white">
              {selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Preferred Date & Time:</span>
            <span className="font-semibold text-slate-200">
              {preferredDate} at {preferredTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Showroom Location:</span>
            <span className="font-semibold text-slate-200">{preferredBranch}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 text-left leading-relaxed">
          <p className="font-bold mb-1">Important Notice:</p>
          <p>
            This booking is currently a request. Our showroom manager will review vehicle availability and contact you via phone within 2 hours to confirm your scheduled slot. Please bring your original driving license with you to the showroom.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/vehicles"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Explore More Vehicles
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-700"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Book a Test Drive' }]} />

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mt-6">
        {/* Title & Introduction */}
        <div className="mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Showroom Experience</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Schedule a Private Test Drive
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Experience the precision engineering, comfort, and performance firsthand. Select your preferred vehicle, date, and showroom location below.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Vehicle Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Vehicle for Test Drive <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
              >
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.year} {v.make} {v.model} {v.variant || ''} — {formatLKR(v.sellingPrice)} ({v.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Vehicle Card Preview */}
            {selectedVehicle && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex items-center gap-4">
                <img
                  src={selectedVehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'}
                  alt={selectedVehicle.model}
                  className="w-20 h-14 rounded-xl object-cover bg-slate-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-white truncate">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.variant || ''}
                  </p>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {formatLKR(selectedVehicle.sellingPrice)} • {selectedVehicle.fuelType || 'Petrol'} • {selectedVehicle.transmission || 'Automatic'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Customer Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Legal Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Contact Phone / WhatsApp <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="077 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 3. Schedule & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Preferred Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                min={today}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Preferred Time Slot
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="09:30 AM">09:30 AM (Morning)</option>
                <option value="11:00 AM">11:00 AM (Morning)</option>
                <option value="02:00 PM">02:00 PM (Afternoon)</option>
                <option value="04:00 PM">04:00 PM (Afternoon)</option>
                <option value="05:30 PM">05:30 PM (Evening)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Preferred Showroom Branch
              </label>
              <select
                value={preferredBranch}
                onChange={(e) => setPreferredBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Colombo Flagship Showroom">Colombo Flagship Showroom</option>
                <option value="Kandy Premium Centre">Kandy Premium Centre</option>
                {branches.map((b) => (
                  <option key={b._id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. License Confirmation */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={hasValidLicense}
                onChange={(e) => setHasValidLicense(e.target.checked)}
                className="mt-1 rounded border-slate-700 text-amber-400 bg-slate-800"
              />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">
                  I hold a valid Driving License (Sri Lankan or International) <span className="text-rose-400">*</span>
                </span>
                <span>
                  A valid driving license must be presented in person at the dealership prior to driving any vehicle.
                </span>
              </div>
            </label>

            <div>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="Driving License Number (Optional for pre-check)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Specific Requests or Questions
            </label>
            <textarea
              rows={2}
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              placeholder="e.g. Please arrange lease quotation during visit..."
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Privacy Consent */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-amber-400 bg-slate-800"
            />
            <span>
              I consent to SalesPlus contacting me via phone or messaging to coordinate and confirm my appointment.
            </span>
          </label>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20"
            >
              <CalendarCheck className="w-5 h-5 text-slate-950" />
              <span>{isSubmitting ? 'Submitting Request...' : 'Submit Test Drive Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookTestDrivePage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading test drive booking form...</div>}>
          <TestDriveFormContent />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
