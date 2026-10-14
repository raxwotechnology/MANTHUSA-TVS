"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  User
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { fetchPublicSettings, submitPublicInquiry } from '@/lib/publicApi';
import { BrandSettings, DEFAULT_BRAND } from '@/lib/useSettings';

export default function ContactPage() {
  const [brand, setBrand] = useState<BrandSettings>(DEFAULT_BRAND);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchPublicSettings().then(setBrand).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Please provide your full legal name.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Please provide a valid contact telephone number.');
      return;
    }
    if (!privacyConsent) {
      setError('Please confirm consent to our privacy policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formatted = `[CONTACT FORM: ${subject}] ${message || 'Customer reached out via contact page.'}`;
      const res = await submitPublicInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        inquiryType: subject,
        message: formatted,
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Error submitting contact form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = (brand.whatsapp || '+94771234567').replace(/[^0-9]/g, '');

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Showroom & Client Care
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
            Get in Touch With Our Dealership
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Our automotive client advisors are on hand to arrange personal test drives, answer import queries, and prepare bespoke leasing evaluations.
          </p>
        </div>

        {/* Main Grid: Contact Info (5 cols) + Contact Form (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold text-white tracking-tight pb-3 border-b border-slate-800">
                Showroom Information
              </h2>

              <div className="space-y-4 text-xs text-slate-300">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Flagship Showroom</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      {brand.address || 'No. 142/B, Baseline Road, Colombo 09, Sri Lanka'}
                    </p>
                    <a
                      href={brand.googleMapsUrl || 'https://maps.google.com/?q=Colombo+Sri+Lanka'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-400 font-bold hover:underline mt-1.5"
                    >
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Telephone Hotline</span>
                    <p className="text-slate-400 mt-0.5">
                      Hotline: <a href={`tel:${(brand.hotline || '+94771234567').replace(/\s+/g, '')}`} className="text-slate-200 hover:text-white font-medium">{brand.hotline || '+94 77 123 4567'}</a>
                    </p>
                    <p className="text-slate-400 mt-0.5">
                      Direct: <a href={`tel:${(brand.phone || '+94112684900').replace(/\s+/g, '')}`} className="text-slate-200 hover:text-white font-medium">{brand.phone || '+94 11 268 4900'}</a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Official Inquiries</span>
                    <p className="text-slate-400 mt-0.5">
                      Sales: <a href={`mailto:${brand.salesEmail || 'sales@salesplus.lk'}`} className="text-slate-200 hover:text-white">{brand.salesEmail || 'sales@salesplus.lk'}</a>
                    </p>
                    <p className="text-slate-400 mt-0.5">
                      Support: <a href={`mailto:${brand.supportEmail || 'support@salesplus.lk'}`} className="text-slate-200 hover:text-white">{brand.supportEmail || 'support@salesplus.lk'}</a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Opening Hours</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      {brand.openingHours || 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hello%20SalesPlus%2C%20I%20would%20like%20to%20connect%20with%20a%20sales%20representative`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Send a Direct Message
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Your message is recorded directly in our dealership management CRM system for timely handling.
              </p>

              {isSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Transmitted</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you for your message. A client relationship officer has been assigned to your ticket and will follow up shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Your Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Kasun Fernando"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Contact Phone <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="077 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-medium focus:outline-none focus:border-amber-400"
                      >
                        <option value="General">General Inquiry</option>
                        <option value="Showroom Visit">Schedule Showroom Visit</option>
                        <option value="Direct Import Order">Custom Japan / UK Import Order</option>
                        <option value="Corporate Fleet">Corporate Fleet Leasing</option>
                        <option value="After Sales">After Sales / Warranty Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please let us know how we can assist you..."
                      className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-amber-400 bg-slate-800"
                    />
                    <span>
                      I consent to having SalesPlus process my contact data to respond to this request in accordance with the dealership Privacy Policy.
                    </span>
                  </label>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
