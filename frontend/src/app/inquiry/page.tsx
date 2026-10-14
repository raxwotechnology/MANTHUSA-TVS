"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  User,
  Phone,
  Mail,
  Car,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import {
  PublicVehicle,
  fetchPublicVehicles,
  submitPublicInquiry,
  formatLKR
} from '@/lib/publicApi';

function InquiryPageContent() {
  const searchParams = useSearchParams();
  const prefillVehicleId = searchParams.get('vehicle') || '';
  const prefillType = searchParams.get('type') || 'Purchase';

  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(prefillVehicleId);
  const [inquiryType, setInquiryType] = useState(prefillType);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<'Phone' | 'WhatsApp' | 'Email'>('WhatsApp');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchPublicVehicles().then((list) => {
      setVehicles(list);
      if (prefillVehicleId) setSelectedVehicleId(prefillVehicleId);
    });
  }, [prefillVehicleId]);

  const selectedVehicle = vehicles.find((v) => v._id === selectedVehicleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Please provide your full legal name.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Please provide a valid phone number (at least 9 digits).');
      return;
    }
    if (!privacyConsent) {
      setError('Please confirm privacy consent before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const detailedMessage = `[Contact Via: ${contactMethod}] [Subject: ${inquiryType}] ${message || 'Customer requested vehicle consultation.'}`;
      const res = await submitPublicInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        vehicle: selectedVehicleId || undefined,
        inquiryType,
        message: detailedMessage,
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 sm:p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Request Logged in VSMS
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1">
            Inquiry Successfully Transmitted
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Thank you for reaching out to SalesPlus. Your inquiry has been routed to our dedicated sales desk. A client executive will reach you via {contactMethod} within business hours.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/vehicles"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Browse More Vehicles
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Breadcrumbs items={[{ label: 'Vehicle Inquiry' }]} />

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mt-6">
        <div className="mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Dedicated Consultation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Vehicle & Pricing Inquiry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Have questions about a specific model, import availability, price negotiation, or warranty details? Submit your inquiry below.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inquiry Type & Vehicle Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Inquiry Topic
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Purchase">Vehicle Purchase Details</option>
                <option value="Finance">Leasing & Finance Options</option>
                <option value="Trade-In">Trade-In Exchange</option>
                <option value="Inspection">Inspection & Condition Report</option>
                <option value="General">General Question</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Interested Vehicle
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
              >
                <option value="">General (No specific vehicle)</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.year} {v.make} {v.model} ({formatLKR(v.sellingPrice)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedVehicle && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <img
                src={selectedVehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'}
                alt={selectedVehicle.model}
                className="w-16 h-12 rounded-xl object-cover bg-slate-800 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </p>
                <p className="text-xs text-amber-400 font-semibold">
                  {formatLKR(selectedVehicle.sellingPrice)} • Ref: {selectedVehicle.stockNumber || selectedVehicle._id}
                </p>
              </div>
            </div>
          )}

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
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
                Phone Number <span className="text-rose-400">*</span>
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

          {/* Email & Contact Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Preferred Reply Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['WhatsApp', 'Phone', 'Email'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setContactMethod(method)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      contactMethod === method
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Message or Specific Requirements
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I would like more information regarding pricing, inspection report, and available financing options..."
              className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
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
              I consent to SalesPlus recording my contact information to process this inquiry in accordance with privacy laws.
            </span>
          </label>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>{isSubmitting ? 'Submitting...' : 'Send Inquiry to Sales Team'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading inquiry form...</div>}>
          <InquiryPageContent />
        </Suspense>
      </div>
    </PublicLayout>
  );
}
