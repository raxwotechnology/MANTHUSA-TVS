"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Sliders,
  DollarSign,
  Calendar,
  Percent,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { formatLKR, calculateAmortizedMonthlyPayment, PublicVehicle } from '@/lib/publicApi';

interface Props {
  initialPrice?: number;
  vehicleTitle?: string;
  vehicleId?: string;
  onInquire?: (calculationDetails: {
    price: number;
    downPayment: number;
    interestRate: number;
    tenureYears: number;
    monthlyPayment: number;
  }) => void;
}

export function FinanceCalculator({
  initialPrice = 15000000,
  vehicleTitle,
  vehicleId,
  onInquire,
}: Props) {
  const [price, setPrice] = useState<number>(initialPrice);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(14.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  useEffect(() => {
    if (initialPrice && initialPrice > 0) {
      setPrice(initialPrice);
    }
  }, [initialPrice]);

  const downPayment = Math.round((price * downPercent) / 100);
  const { monthlyPayment, principal, totalInterest, totalPayable } =
    calculateAmortizedMonthlyPayment(price, downPayment, interestRate, tenureYears);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Calculator className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Automotive Loan & Lease Estimator</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {vehicleTitle ? `Finance Estimate for ${vehicleTitle}` : 'Calculate Your Monthly Payment'}
          </h3>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 max-w-xs">
          Rates typically range from 12.0% to 16.5% through top tier Sri Lankan leasing partners.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Sliders and Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Vehicle Price Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Vehicle Price (LKR)
              </label>
              <span className="text-base font-bold text-white">{formatLKR(price)}</span>
            </div>
            <input
              type="range"
              min="2000000"
              max="100000000"
              step="500000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Rs. 2M</span>
              <span>Rs. 50M</span>
              <span>Rs. 100M</span>
            </div>
          </div>

          {/* Down Payment Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Down Payment ({downPercent}%)
              </label>
              <span className="text-base font-bold text-amber-400">
                {formatLKR(downPayment)}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={downPercent}
              onChange={(e) => setDownPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>10% (Min Down)</span>
              <span>30%</span>
              <span>60%</span>
            </div>
          </div>

          {/* Loan Tenure & Interest Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Loan Tenure
                </label>
                <span className="text-sm font-bold text-white">
                  {tenureYears} Years ({tenureYears * 12} mos)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[2, 3, 4, 5].map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setTenureYears(y)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      tenureYears === y
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-850 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    {y} Yrs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Interest Rate (p.a.)
                </label>
                <span className="text-sm font-bold text-white">{interestRate}%</span>
              </div>
              <input
                type="number"
                step="0.25"
                min="0"
                max="30"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-850 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Calculation Summary Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Estimated Monthly Installment
            </span>
            <div className="mt-2 mb-4">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                {formatLKR(monthlyPayment)}
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">per month for {tenureYears * 12} months</span>
            </div>

            <div className="space-y-3 py-4 border-y border-slate-800/80 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Principal Financing Amount</span>
                <span className="font-semibold text-white">{formatLKR(principal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest Payable</span>
                <span className="font-semibold text-slate-300">{formatLKR(totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Capital + Interest</span>
                <span className="font-semibold text-white">{formatLKR(totalPayable)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {onInquire ? (
              <button
                type="button"
                onClick={() =>
                  onInquire({
                    price,
                    downPayment,
                    interestRate,
                    tenureYears,
                    monthlyPayment,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-md shadow-amber-400/10"
              >
                <span>Request Financing Approval</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={`/inquiry?type=Finance${vehicleId ? `&vehicle=${vehicleId}` : ''}&amount=${principal}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all shadow-md shadow-amber-400/10"
              >
                <span>Apply for Finance Package</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <p className="text-[11px] text-slate-400 text-center leading-normal">
              Disclaimer: Illustrative estimation using standard amortizing formulas. Exact rates, down payments, and approval terms depend on financial institution credit appraisal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
