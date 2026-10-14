"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { useSettings } from '@/lib/useSettings';

export default function PrivacyPolicyPage() {
  const { settings: brand } = useSettings();

  const dealershipName = brand.dealershipName || 'SalesPlus Auto Mart';
  const email = brand.salesEmail || brand.email || 'privacy@salesplus.lk';

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-xl space-y-8 text-slate-300 text-sm leading-relaxed">
          <div className="border-b border-slate-800 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Customer Data Governance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Privacy Policy & Data Protection
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Last updated: October 2026 • Effective for all public inquiries, test drives, and vehicle valuation submissions.
            </p>
          </div>

          {brand.website?.pages?.privacy && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <strong>Data Privacy Commitment:</strong> {brand.website.pages.privacy}
            </div>
          )}

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              When you browse our public digital showroom or interact with our dealership features, {dealershipName} may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li><strong className="text-white">Contact Information:</strong> Full name, telephone number, WhatsApp contact, and email address submitted via vehicle inquiry, finance, or contact forms.</li>
              <li><strong className="text-white">Test Drive Records:</strong> Preferred appointment date, time slot, designated showroom branch, and driving license confirmation data.</li>
              <li><strong className="text-white">Vehicle Valuation Details:</strong> Vehicle make, model, registration year, mileage, condition ratings, accident disclosure, and uploaded vehicle photographs.</li>
              <li><strong className="text-white">Browsing Preferences:</strong> Saved vehicles and comparison selections stored locally in your browser cache.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Purpose of Data Processing</h2>
            <p>Your information is processed strictly for legitimate automotive dealership operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li>Connecting you with an assigned sales consultant regarding vehicle availability and pricing.</li>
              <li>Scheduling and reserving verified test-drive slots at our physical showrooms.</li>
              <li>Appraising trade-in vehicles and generating purchase or exchange offers.</li>
              <li>Connecting you with registered partner leasing banks upon your explicit request.</li>
              <li>Complying with statutory Sri Lankan revenue, tax, and motor traffic registration protocols.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Third-Party Disclosures & Banking Partners</h2>
            <p>
              We do not sell, rent, or trade your personal information. Data may only be shared with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li><strong className="text-white">Authorized Financial Institutions:</strong> Only when you explicitly apply for leasing assistance through our partner commercial banks (e.g. Commercial Bank, HNB, Sampath, LOLC).</li>
              <li><strong className="text-white">Regulatory Authorities:</strong> The Department of Motor Traffic (DMT) for official revenue license transfers and ownership registrations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Security & Storage</h2>
            <p>
              All customer inquiries and valuation submissions are secured using industry-standard encrypted REST communication with our backend Dealership Management System. Uploaded photographs are scanned and restricted from unauthorized administrative modification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Your Rights & Privacy Inquiries</h2>
            <p>
              You have the right to request a copy of your inquiry dossier, update inaccurate contact records, or request complete deletion of your customer data from our CRM leads database.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              To exercise your data privacy rights, please contact our Data Governance Officer at: <a href={`mailto:${email}`} className="text-amber-400 font-bold hover:underline">{email}</a> or visit our Colombo Flagship Showroom.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
