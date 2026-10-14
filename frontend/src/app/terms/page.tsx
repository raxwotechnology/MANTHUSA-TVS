"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { useSettings } from '@/lib/useSettings';

export default function TermsPage() {
  const { settings: brand } = useSettings();

  const dealershipName = brand.dealershipName || 'SalesPlus Auto Mart';

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-xl space-y-8 text-slate-300 text-sm leading-relaxed">
          <div className="border-b border-slate-800 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Effective Date: October 2026 • Governing website access, vehicle listings, inquiries, test drives, and valuations.
            </p>
          </div>

          {brand.website?.pages?.terms && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <strong>Dealership Policy Notice:</strong> {brand.website.pages.terms}
            </div>
          )}

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Scope of Public Website</h2>
            <p>
              These Terms and Conditions govern your use of the public website operated by {dealershipName}. By accessing, browsing our inventory, or submitting electronic requests, you agree to comply with and be bound by these provisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Vehicle Listing Accuracy & Availability</h2>
            <p>
              All vehicle specifications, features, prices, and availability statuses presented on this website are synchronized from our Vehicle Sales Management System (VSMS). While we exercise utmost diligence to ensure real-time accuracy:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li>Vehicles are subject to prior showroom reservation or sale.</li>
              <li>Published prices in Sri Lankan Rupees (LKR) do not include optional insurance premiums, custom registration number fees, or third-party transfer stamp duty unless explicitly stated.</li>
              <li>Physical inspection of vehicle specifications and documentation at the dealership is advised before signing binding purchase agreements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Public Inquiries Do Not Form Contracts</h2>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <strong>Notice:</strong> Submitting a website inquiry, price request, test-drive booking, or financing application does NOT constitute a legally binding contract of sale or vehicle reservation. A purchase is legally consummated only upon physical showroom agreement, payment of the designated reservation deposit, and issuance of an official Pro-Forma Invoice.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Test-Drive Appointments</h2>
            <p>
              Submitting a test-drive form registers a preferred booking slot request. Confirmation is subject to vehicle availability, weather conditions, and showroom schedule validation.
            </p>
            <p className="text-xs text-slate-400">
              Requirements: The driver must possess and physically produce a valid, unendorsed Driving License. Dealership staff reserve the right to decline or terminate a test drive for safety or legal reasons.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Vehicle Valuations & Trade-Ins</h2>
            <p>
              Online valuations generated through our valuation request wizard represent preliminary estimations based on the information and photographs submitted. They do not constitute guaranteed purchase commitments or binding cash offers until our licensed automotive appraisers perform an in-person physical inspection of mechanical condition, chassis alignment, and revenue license authenticity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Financing & Amortization Estimates</h2>
            <p>
              All figures generated by our finance calculator are illustrative amortizing loan estimates based on typical banking interest rates. Formal credit approval, applicable interest margins, document charges, and final monthly lease installments are determined solely by our registered banking and finance institution partners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Governing Law & Contact</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              For any clarification regarding these terms, please contact our legal desk at <a href={`mailto:${brand.salesEmail || 'legal@salesplus.lk'}`} className="text-amber-400 font-bold hover:underline">{brand.salesEmail || 'legal@salesplus.lk'}</a>.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
