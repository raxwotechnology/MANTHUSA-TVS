"use client";

import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Car,
  Phone,
  Mail,
  User,
  MessageSquare,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { PublicVehicle, submitPublicInquiry, formatLKR } from '@/lib/publicApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: PublicVehicle | null;
  defaultInquiryType?: string;
  prefilledMessage?: string;
}

export function InquiryDialog({
  isOpen,
  onClose,
  vehicle,
  defaultInquiryType = 'Details',
  prefilledMessage = '',
}: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<'Phone' | 'WhatsApp' | 'Email'>('Phone');
  const [inquiryType, setInquiryType] = useState(defaultInquiryType);
  const [message, setMessage] = useState(prefilledMessage);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Please provide your full name.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Please enter a valid phone number (at least 9 digits).');
      return;
    }
    if (!privacyConsent) {
      setError('Please confirm privacy consent to submit.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedMessage = `[Contact Method: ${contactMethod}] [Type: ${inquiryType}] ${message || 'Customer requested vehicle information.'}`;
      const res = await submitPublicInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        vehicle: vehicle?._id,
        inquiryType,
        message: formattedMessage,
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

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Inquiry Submitted Successfully
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you for reaching out. One of our dedicated vehicle specialists has received your request and will contact you via your preferred method shortly.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Inquiry Form */
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
                <MessageSquare className="w-4 h-4" />
                Customer Inquiry
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {vehicle ? `Inquire about ${vehicle.make} ${vehicle.model}` : 'Contact Our Sales Team'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill out the details below to receive full vehicle history, leasing options, or schedule a viewing.
              </p>
            </div>

            {/* Vehicle Card Preview if vehicle selected */}
            {vehicle && (
              <div className="mb-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <img
                  src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80'}
                  alt={vehicle.model}
                  className="w-14 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h4>
                  <p className="text-xs text-amber-400 font-semibold">
                    {formatLKR(vehicle.sellingPrice)}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Phone', 'WhatsApp', 'Email'] as const).map((method) => (
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

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Message or Specific Questions
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I would like to check availability, leasing interest rates, and schedule an appointment..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Privacy Consent Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 pt-1">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-amber-400 focus:ring-0 bg-slate-800"
                />
                <span>
                  I consent to having SalesPlus contact me regarding this vehicle inquiry in accordance with the dealership Privacy Policy.
                </span>
              </label>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-md shadow-amber-400/10"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
