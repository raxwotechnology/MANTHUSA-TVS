"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BadgeDollarSign,
  User,
  Car,
  FileCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Camera,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Breadcrumbs } from '@/components/public/Breadcrumbs';
import { submitValuationRequest, formatLKR } from '@/lib/publicApi';

export default function SellYourVehiclePage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Seller Information
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  // Step 2: Vehicle Information
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState('2021');
  const [regYear, setRegYear] = useState('2021');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [condition, setCondition] = useState('Excellent');
  const [askingPrice, setAskingPrice] = useState('');

  // Step 3: Vehicle Condition
  const [accidentHistory, setAccidentHistory] = useState('No Accidents');
  const [serviceHistory, setServiceHistory] = useState('Full Agent Records');
  const [mechanicalIssues, setMechanicalIssues] = useState('None');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Step 4: Uploaded Images (Base64 data URLs)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUploadError, setImageUploadError] = useState('');

  // Step 5: Submission & Consent
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedValuationId, setSubmittedValuationId] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploadError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 8) {
      setImageUploadError('You can upload up to 8 vehicle photos.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setImageUploadError(`File ${file.name} exceeds 5MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result;
        if (typeof result === 'string') {
          setUploadedImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (stepNumber: number): boolean => {
    setSubmitError('');
    if (stepNumber === 1) {
      if (fullName.trim().length < 2) {
        setSubmitError('Please enter your full legal name.');
        return false;
      }
      if (phone.replace(/\D/g, '').length < 9) {
        setSubmitError('Please enter a valid phone number (at least 9 digits).');
        return false;
      }
      if (!city.trim()) {
        setSubmitError('Please specify your current city or district.');
        return false;
      }
    } else if (stepNumber === 2) {
      if (!make.trim() || !model.trim()) {
        setSubmitError('Please enter both the vehicle make and model.');
        return false;
      }
      if (!year || Number(year) < 1990) {
        setSubmitError('Please enter a valid manufacturing year.');
        return false;
      }
      if (!mileage || Number(mileage) < 0) {
        setSubmitError('Please specify the approximate odometer mileage.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!privacyConsent) {
      setSubmitError('You must agree to the privacy statement to submit.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const combinedNotes = `[SELLER CITY: ${city}] [ACCIDENTS: ${accidentHistory}] [SERVICE: ${serviceHistory}] [MECHANICAL: ${mechanicalIssues}] ${additionalNotes ? `| NOTES: ${additionalNotes}` : ''}`;
      const res = await submitValuationRequest({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        vehicleMake: make.trim(),
        vehicleModel: `${model.trim()}${variant ? ` ${variant.trim()}` : ''}`,
        year: Number(year),
        mileage: Number(mileage) || 0,
        condition,
        askingPrice: Number(askingPrice) || 0,
        images: uploadedImages,
        notes: combinedNotes,
      });

      if (res.success) {
        setSubmittedValuationId(res.valuationId || `VAL-${Date.now().toString().slice(-6)}`);
      } else {
        setSubmitError(res.message);
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Error submitting valuation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Seller' },
    { num: 2, label: 'Vehicle' },
    { num: 3, label: 'Condition' },
    { num: 4, label: 'Photos' },
    { num: 5, label: 'Review' },
  ];

  if (submittedValuationId) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto my-16 p-8 sm:p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Valuation Request Logged
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">
              Valuation Dossier Received
            </h2>
            <p className="text-sm font-mono text-slate-400 mt-2">
              Reference: <span className="text-amber-400 font-bold">{submittedValuationId}</span>
            </p>
          </div>

          {/* Workflow Pipeline stages */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Dealership Appraisal Workflow
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>1. Submitted Online (Complete)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <Clock className="w-4 h-4 shrink-0" />
                <span>2. Appraiser Desktop Review & Preliminary Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">3</span>
                <span>3. Physical Vehicle Inspection at Colombo Showroom</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px]">4</span>
                <span>4. Guaranteed Purchase Offer / Immediate Trade-In Settlement</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 text-left leading-relaxed">
            <p className="font-bold mb-1">Valuation Notice:</p>
            <p>
              This submission is a preliminary valuation request and does not constitute a binding purchase contract until physical inspection and document verification are completed by our licensed appraisers.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/vehicles"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse Inventory for Trade-In
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Sell Your Vehicle' }]} />

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mt-6">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BadgeDollarSign className="w-4 h-4" />
              <span>Direct Dealership Purchase</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Sell or Trade-In Your Vehicle
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Get an accurate, market-aligned valuation from Sri Lanka's leading automotive specialists. Complete the 5-step appraisal wizard below to get started.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, idx) => (
                <div key={s.num} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                      currentStep === s.num
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : currentStep > s.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider mt-1.5 ${
                      currentStep === s.num ? 'text-amber-400 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${
                        currentStep > s.num ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {submitError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{submitError}</span>
            </div>
          )}

          {/* STEP 1: Seller Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-white mb-2">Step 1: Your Contact Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kasun Fernando"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Phone / WhatsApp <span className="text-rose-400">*</span>
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
                    City / District <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Colombo 07, Kandy, Gampaha"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle Information */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-white mb-2">Step 2: Vehicle Specifications</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Make <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="Toyota, Honda, Mercedes..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Model <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Premio, Vezel, C200..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Grade / Variant
                  </label>
                  <input
                    type="text"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    placeholder="e:HEV Z, F EX Package..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Year of Manufacture <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2021"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Registered Year
                  </label>
                  <input
                    type="number"
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value)}
                    placeholder="2022"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Odometer Mileage (km) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="45000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Fuel Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Transmission
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Expected Asking Price (LKR)
                  </label>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="e.g. 15000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Vehicle Condition */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-white mb-2">Step 3: Vehicle History & Condition</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Overall Condition Rating
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Excellent">Excellent (Showroom mint)</option>
                    <option value="Very Good">Very Good (Minor blemishes)</option>
                    <option value="Good">Good (Normal wear)</option>
                    <option value="Fair">Fair (Needs cosmetic/mechanical work)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Accident History
                  </label>
                  <select
                    value={accidentHistory}
                    onChange={(e) => setAccidentHistory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="No Accidents">Accident Free (100% Original)</option>
                    <option value="Minor Fender Bender">Minor Scratches / Panel Paint</option>
                    <option value="Repaired Impact">Previous Structural Impact Repaired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Service History Documentation
                  </label>
                  <select
                    value={serviceHistory}
                    onChange={(e) => setServiceHistory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Full Agent Records">Complete Authorized Agent Records</option>
                    <option value="Partial Records">Partial Service Book Records</option>
                    <option value="Independent Garage">Serviced at Reputable Workshop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Known Mechanical / Electrical Issues
                  </label>
                  <input
                    type="text"
                    value={mechanicalIssues}
                    onChange={(e) => setMechanicalIssues(e.target.value)}
                    placeholder="None, or specify (e.g. AC cooling low)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Additional Details or Extras (Tires, Audio, Accessories)
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="New Michelin tires fitted last month, nano coating warranty active..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Photo Uploads */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-white mb-1">Step 4: Upload Vehicle Photographs</h3>
              <p className="text-xs text-slate-400 mb-4">
                Photos significantly speed up your valuation appraisal. Upload exterior angles, interior cabin, odometer reading, and any damage areas.
              </p>

              {imageUploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  {imageUploadError}
                </div>
              )}

              {/* Upload Box */}
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
                <input
                  type="file"
                  id="vehicle-photos"
                  multiple
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="vehicle-photos"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-white">Click to Select Photos</span>
                  <span className="text-xs text-slate-400">
                    PNG, JPG, or WEBP up to 5MB each (Max 8 photos)
                  </span>
                </label>
              </div>

              {/* Uploaded Previews */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 group">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-lg font-bold text-white">Step 5: Review Valuation Summary</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Seller Information</span>
                  <p className="text-white font-bold">{fullName}</p>
                  <p className="text-slate-300">{phone} • {email || 'No email'}</p>
                  <p className="text-slate-400">{city}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Vehicle Specifications</span>
                  <p className="text-white font-bold">{year} {make} {model} {variant}</p>
                  <p className="text-slate-300">{mileage ? `${Number(mileage).toLocaleString()} km` : ''} • {fuelType} • {transmission}</p>
                  <p className="text-amber-400 font-bold mt-1">Asking: {askingPrice ? formatLKR(Number(askingPrice)) : 'Open to offers'}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Condition & History</span>
                  <p className="text-slate-200">Rated: <span className="font-bold text-white">{condition}</span></p>
                  <p className="text-slate-300">Accidents: {accidentHistory}</p>
                  <p className="text-slate-300">Service: {serviceHistory}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Photos Attached</span>
                  <p className="text-slate-200 font-bold">{uploadedImages.length} photo(s) uploaded</p>
                </div>
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
                  I confirm the vehicle information provided is accurate to the best of my knowledge and understand that this submission is a valuation request, not a guaranteed purchase offer.
                </span>
              </label>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Valuation Request'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
