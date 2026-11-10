"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building2,
  Percent,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { FinanceCalculator } from '@/components/public/FinanceCalculator';
import { InquiryDialog } from '@/components/public/InquiryDialog';
import {
  PublicVehicle,
  fetchPublicVehicles,
  formatLKR
} from '@/lib/publicApi';
import { useSettings } from '@/lib/useSettings';

export default function FinancePage() {
  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const { settings: brand } = useSettings();

  // Inquiry dialog state
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState('');

  useEffect(() => {
    fetchPublicVehicles().then((vList) => {
      setVehicles(vList);
      if (vList.length > 0) setSelectedVehicleId(vList[0]._id);
    });
  }, []);

  const selectedVehicle = vehicles.find((v) => v._id === selectedVehicleId);
  const price = selectedVehicle ? selectedVehicle.sellingPrice : 1025000;

  const handleInquireFromCalc = (calc: {
    price: number;
    downPayment: number;
    interestRate: number;
    tenureYears: number;
    monthlyPayment: number;
  }) => {
    setInquiryMsg(
      `TVS Finance Inquiry: Motorcycle Price ${formatLKR(calc.price)}, Down Payment: ${formatLKR(calc.downPayment)}, Term: ${calc.tenureYears} yrs, Interest: ${calc.interestRate}%, Est. Installment: ${formatLKR(calc.monthlyPayment)}/mo.`
    );
    setIsInquiryOpen(true);
  };

  interface BankPartner {
    name: string;
    tag: string;
    rate: string;
  }

  const partnerBanks: BankPartner[] = [
    { name: 'Commercial Bank of Ceylon', tag: 'Fast-Track Corporate & Personal Lease', rate: 'From 13.5%' },
    { name: 'Hatton National Bank (HNB)', tag: 'HNB Leasing with Doorstep Documentation', rate: 'From 13.75%' },
    { name: 'Sampath Bank PLC', tag: 'Flexible Terms for Professionals', rate: 'From 14.0%' },
    { name: 'LOLC Finance PLC', tag: 'Speedy Approval within 24 Hours', rate: 'From 14.5%' },
    { name: 'Central Finance Company', tag: 'Commercial & Multi-Vehicle Fleets', rate: 'From 14.25%' },
    { name: 'LB Finance PLC', tag: 'Customized Down Payment Structures', rate: 'From 14.5%' },
  ];

  const displayedBanks: BankPartner[] =
    brand.leasing?.preferredPartners && brand.leasing.preferredPartners.length > 0
      ? brand.leasing.preferredPartners.map((name: any) => ({
          name: String(name),
          tag: 'Official Dealership Partner',
          rate: brand.leasing?.defaultInterestRate ? `From ${brand.leasing.defaultInterestRate}%` : 'From 13.5%',
        }))
      : partnerBanks;

  const requiredDocuments = [
    'National Identity Card (NIC) / Valid Passport copy',
    'Proof of Income (Salary slips for past 3 months or Company Audited Accounts)',
    'Bank account statements for the past 6 months',
    'Billing proof of residential address (Electricity / Water / Phone bill)',
    'Dealership Pro-Forma Invoice (Issued instantly by TVS SalesPlus)',
  ];

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Breadcrumbs items={[{ label: 'Finance & Leasing' }]} />

        {/* Page Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-red-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>TVS Motorcycle Financing Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Motorcycle Finance & Tailored Leasing
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            {brand.website?.pages?.finance ||
              'Drive away with confidence. We collaborate directly with premier financial institutions in Sri Lanka to deliver transparent interest rates, manageable down payments, and fast-track approvals.'}
          </p>
        </div>

        {/* Vehicle Selector for Calculator */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
              Select TVS Motorcycle:
            </span>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-red-500 dark:focus:border-amber-400"
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.year} {v.make} {v.model} — {formatLKR(v.sellingPrice)}
                </option>
              ))}
            </select>
          </div>

          {selectedVehicle && (
            <span className="text-xs text-red-600 dark:text-amber-400 font-bold">
              Listed Price: {formatLKR(selectedVehicle.sellingPrice)}
            </span>
          )}
        </div>

        {/* Interactive Loan Amortization Calculator */}
        <FinanceCalculator
          initialPrice={price}
          vehicleTitle={selectedVehicle ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}` : undefined}
          vehicleId={selectedVehicle?._id}
          onInquire={handleInquireFromCalc}
        />

        {/* Partner Banks Grid */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-amber-400">
              Approved Lending Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Our Preferred Financial Institutions
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              We arrange on-site document pickup and prioritize same-day file processing with our registered banking partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedBanks.map((bank) => (
              <div
                key={bank.name}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 dark:bg-amber-400/10 text-red-600 dark:text-amber-400 border border-red-500/20 dark:border-amber-400/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    {bank.rate}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white pt-1">{bank.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{bank.tag}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Section */}
        <div className="p-8 rounded-3xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-amber-400">
              Checklist
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 mb-3">
              Documents Required for Leasing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Having these ready accelerates evaluation and allows our credit team to secure approval within 24 to 48 hours.
            </p>

            <ul className="space-y-3">
              {requiredDocuments.map((doc) => (
                <li key={doc} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Have Questions About Financing?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Our in-house finance coordinator is available to answer down payment questions, calculate early settlement rebates, and evaluate structured leases for businesses.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setInquiryMsg('Customer requested finance officer consultation.');
                  setIsInquiryOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Talk to Finance Specialist</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <InquiryDialog
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        vehicle={selectedVehicle}
        defaultInquiryType="Finance"
        prefilledMessage={inquiryMsg}
      />
    </PublicLayout>
  );
}
