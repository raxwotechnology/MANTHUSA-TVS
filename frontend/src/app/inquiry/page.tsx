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
  CheckCircle2,
  AlertCircle,
  Tag,
  Gauge,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import {
  PublicVehicle,
  fetchPublicVehicles,
  submitPublicInquiry,
  formatLKR
} from '@/lib/publicApi';

const BIKE_CATEGORIES = [
  'Sport Motorcycles',
  'Scooters',
  'Commuter Motorcycles',
  'Premium Motorcycles',
  'Electric Two-Wheelers'
];

const BIKE_TYPES = [
  'Motorcycle',
  'Scooter',
  'Moped',
  'Electric'
];

const POPULAR_MODELS = [
  'Apache RTR 160 4V',
  'Apache RTR 200 4V',
  'Apache RR 310',
  'NTORQ 125 Race XP',
  'Jupiter 125',
  'Raider 125',
  'Ronin 225',
  'TVS XL 100 Heavy Duty',
  'TVS iQube Electric'
];

function InquiryPageContent() {
  const searchParams = useSearchParams();
  const prefillVehicleId = searchParams.get('vehicle') || '';
  const prefillType = searchParams.get('type') || 'Purchase';

  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(prefillVehicleId);
  const [inquiryType, setInquiryType] = useState(prefillType);

  // Bike specific in-depth details
  const [category, setCategory] = useState('Sport Motorcycles');
  const [vehicleType, setVehicleType] = useState('Motorcycle');
  const [modelName, setModelName] = useState('Apache RTR 160 4V');
  const [variantName, setVariantName] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('160 cc');
  const [selectedColor, setSelectedColor] = useState('Matte Black');

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
      if (prefillVehicleId) {
        setSelectedVehicleId(prefillVehicleId);
        const match = list.find((v) => v._id === prefillVehicleId);
        if (match) {
          if (match.category) setCategory(match.category);
          if (match.vehicleType) setVehicleType(match.vehicleType);
          if (match.model) setModelName(match.model);
          if (match.variant) setVariantName(match.variant);
          if (match.engineCapacity) setEngineCapacity(match.engineCapacity);
          if (match.color) setSelectedColor(match.color);
        }
      }
    });
  }, [prefillVehicleId]);

  const selectedVehicle = vehicles.find((v) => v._id === selectedVehicleId);

  const handleVehicleChange = (vId: string) => {
    setSelectedVehicleId(vId);
    if (!vId) return;
    const v = vehicles.find((item) => item._id === vId);
    if (v) {
      if (v.category) setCategory(v.category);
      if (v.vehicleType) setVehicleType(v.vehicleType);
      if (v.model) setModelName(v.model);
      if (v.variant) setVariantName(v.variant);
      if (v.engineCapacity) setEngineCapacity(v.engineCapacity);
      if (v.color) setSelectedColor(v.color);
    }
  };

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
      const detailedMessage = `[Contact Via: ${contactMethod}] [Subject: ${inquiryType}] [Bike: ${category} · ${vehicleType} · ${modelName} ${variantName || ''} · ${engineCapacity || ''} · ${selectedColor || ''}] ${message || 'Customer requested motorcycle quotation and consultation.'}`;

      const res = await submitPublicInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        vehicle: selectedVehicleId || undefined,
        category: selectedVehicle?.category || category,
        vehicleType: selectedVehicle?.vehicleType || vehicleType,
        modelName: selectedVehicle?.model || modelName,
        variantName: selectedVehicle?.variant || variantName,
        engineCapacity: selectedVehicle?.engineCapacity || engineCapacity,
        selectedColor: selectedVehicle?.color || selectedColor,
        inquiryType,
        message: detailedMessage,
        source: 'Website Online Inquiry',
      });

      if (res.success || res._id) {
        setIsSuccess(true);
      } else {
        setError(res.message || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-6 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-amber-400">
            Request Logged
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Inquiry Successfully Transmitted
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Thank you for reaching out to TVS SalesPlus Motor Hub. Your inquiry for <strong>{modelName}</strong> ({category} · {vehicleType}) has been registered directly in our CRM. A client sales executive will contact you via {contactMethod}.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/bikes"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Browse TVS Motorcycles
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-300 dark:border-slate-700"
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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl mt-6">
        <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Dedicated Consultation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Motorcycle &amp; Pricing Inquiry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Inquire about specific TVS bike categories, types, models, pricing quotations, showroom stock, or financing options.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inquiry Topic & Stock Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Inquiry Topic
              </label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-amber-400"
              >
                <option value="Purchase">Motorcycle Purchase Details</option>
                <option value="Finance">Leasing &amp; Finance Options</option>
                <option value="Trade-In">Trade-In Exchange</option>
                <option value="Inspection">Inspection &amp; Test Ride</option>
                <option value="General">General Question</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Available Motorcycle in Stock
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-amber-400"
              >
                <option value="">Choose from Showroom Stock (or custom below)</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.year} {v.make} {v.model} - {v.category || v.vehicleType || 'Bike'} ({formatLKR(v.sellingPrice)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motorcycle In-Depth Details Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-amber-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Motorcycle Specification &amp; Classification Details
              </h3>
            </div>

            {selectedVehicle ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <img
                  src={selectedVehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'}
                  alt={selectedVehicle.model}
                  className="w-20 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.variant ? `(${selectedVehicle.variant})` : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                      Category: {selectedVehicle.category || category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      Type: {selectedVehicle.vehicleType || vehicleType}
                    </span>
                    {selectedVehicle.engineCapacity && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        Displacement: {selectedVehicle.engineCapacity}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                      Price: {formatLKR(selectedVehicle.sellingPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Category */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-red-600" />
                    <span>Bike Category *</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  >
                    {BIKE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    <span>Bike Type *</span>
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  >
                    {BIKE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-purple-600" />
                    <span>Motorcycle Model *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="e.g. Apache RTR 160 4V"
                    list="popular-models"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                  <datalist id="popular-models">
                    {POPULAR_MODELS.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </div>

                {/* Variant */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Variant / Trim
                  </label>
                  <input
                    type="text"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="e.g. Special Edition Disc"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Engine Capacity */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Engine Capacity (CC)
                  </label>
                  <input
                    type="text"
                    value={engineCapacity}
                    onChange={(e) => setEngineCapacity(e.target.value)}
                    placeholder="e.g. 159.7 cc"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Color
                  </label>
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    placeholder="e.g. Matte Black / Racing Red"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kasun Fernando"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 dark:focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="077 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 dark:focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Email & Contact Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 dark:focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
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
                        ? 'bg-red-600 text-white border-red-600 font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750'
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Message or Specific Requirements
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I would like more information regarding pricing, delivery dates, and available leasing options..."
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 dark:focus:border-amber-400"
            />
          </div>

          {/* Privacy Consent */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-red-600 bg-white dark:bg-slate-800"
            />
            <span>
              I consent to TVS SalesPlus recording my contact information to process this inquiry in accordance with privacy laws.
            </span>
          </label>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md shadow-red-600/20"
            >
              <Send className="w-4 h-4 text-white" />
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
