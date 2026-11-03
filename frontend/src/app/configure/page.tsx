"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Flame,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  SlidersHorizontal,
  Clock,
  Sparkles,
  Zap,
  Award,
  AlertCircle
} from 'lucide-react';
import { PublicLayout } from '@/components/public/PublicLayout';
import {
  PublicVehicle,
  TVSVariant,
  TVSColor,
  fetchPublicVehicles,
  fetchBranches,
  BranchInfo,
  submitMotorcycleRequest,
  formatLKR
} from '@/lib/publicApi';
import { useSettings } from '@/lib/useSettings';

function ConfiguratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialModelParam = searchParams.get('model') || '';
  const initialVariantParam = searchParams.get('variant') || '';
  const initialColorParam = searchParams.get('color') || '';

  const { settings: brand } = useSettings();

  const [bikes, setBikes] = useState<PublicVehicle[]>([]);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Current Step: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);

  // Selected State
  const [selectedBike, setSelectedBike] = useState<PublicVehicle | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<TVSVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<TVSColor | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(null);

  // Customer Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Motorcycle Booking Request');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [vehiclesData, branchesData] = await Promise.all([
          fetchPublicVehicles(),
          fetchBranches(),
        ]);
        setBikes(vehiclesData || []);
        setBranches(branchesData || []);

        // Pre-select if param passed
        if (vehiclesData && vehiclesData.length > 0) {
          const matchBike = initialModelParam
            ? vehiclesData.find((b) => b.model.toLowerCase() === initialModelParam.toLowerCase())
            : vehiclesData[0];

          if (matchBike) {
            setSelectedBike(matchBike);

            // Match variant
            const matchVar = initialVariantParam
              ? matchBike.variants?.find((v) => v.name.toLowerCase() === initialVariantParam.toLowerCase())
              : matchBike.variants?.find((v) => v.isDefault) || matchBike.variants?.[0] || null;
            setSelectedVariant(matchVar || null);

            // Match color
            const matchCol = initialColorParam
              ? matchBike.colors?.find((c) => c.name.toLowerCase() === initialColorParam.toLowerCase())
              : matchBike.colors?.[0] || null;
            setSelectedColor(matchCol || null);
          }
        }

        if (branchesData && branchesData.length > 0) {
          setSelectedBranch(branchesData[0]);
        }
      } catch (err) {
        console.error('Failed to load configurator data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [initialModelParam, initialVariantParam, initialColorParam]);

  // Check logged-in user to auto-populate form
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        if (u.name) setFullName(u.name);
        if (u.email) setEmail(u.email);
        if (u.phone) setPhone(u.phone);
      }
    } catch {
      // Ignore
    }
  }, []);

  // When model changes:
  const handleModelSelect = (bike: PublicVehicle) => {
    setSelectedBike(bike);
    // Reset dependent variant & color
    const defaultVar = bike.variants?.find((v) => v.isDefault) || bike.variants?.[0] || null;
    setSelectedVariant(defaultVar);
    const defaultCol = bike.colors?.[0] || null;
    setSelectedColor(defaultCol);
    setCurrentStep(2);
  };

  const handleVariantSelect = (v: TVSVariant) => {
    setSelectedVariant(v);
    setCurrentStep(3);
  };

  const handleColorSelect = (c: TVSColor) => {
    setSelectedColor(c);
    setCurrentStep(4);
  };

  const handleBranchSelect = (b: BranchInfo) => {
    setSelectedBranch(b);
    setCurrentStep(5);
  };

  const currentPrice = selectedVariant ? selectedVariant.price : selectedBike?.sellingPrice || 0;

  // Active display image based on selected color
  const displayedImage =
    selectedColor?.imageUrl ||
    selectedBike?.images?.[0] ||
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80';

  // Check branch availability
  const isAvailableAtBranch = () => {
    if (!selectedBike || !selectedBranch) return true;
    const match = selectedBike.branchStock?.find(
      (bs) => bs.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase()) || bs.quantity > 0
    );
    return (match?.quantity || 0) > 0;
  };

  // Submit Booking / Request
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBike) return;
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const payload = {
        fullName,
        phone,
        email,
        vehicleId: selectedBike._id,
        vehicle: selectedBike._id,
        modelName: selectedBike.model,
        variantName: selectedVariant?.name || selectedBike.variant,
        selectedColor: selectedColor?.name || selectedBike.color,
        preferredBranch: selectedBranch?._id,
        preferredBranchName: selectedBranch?.name || 'Colombo Central Flagship Hub',
        budget: currentPrice,
        inquiryType,
        message: message || `Booking requested via online configurator for ${selectedBike.model} ${selectedVariant?.name || ''} in ${selectedColor?.name || ''}.`,
      };

      const result = await submitMotorcycleRequest(payload);
      const ref = result.leadId || result.referenceId || `TVS-REQ-${Date.now().toString().slice(-6)}`;
      setSubmittedReference(ref);
      setCurrentStep(7);
    } catch (err: any) {
      setSubmissionError(err.message || 'Could not submit booking request. Please check phone number and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Model' },
    { num: 2, label: 'Variant' },
    { num: 3, label: 'Color' },
    { num: 4, label: 'Branch' },
    { num: 5, label: 'Summary' },
    { num: 6, label: 'Details' },
    { num: 7, label: 'Confirmed' },
  ];

  if (isLoading) {
    return (
      <PublicLayout brand={brand}>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-800 rounded-xl w-64 mx-auto" />
            <div className="h-64 bg-slate-800 rounded-3xl" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout brand={brand}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-xs font-bold uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive TVS Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            CONFIGURE & BOOK YOUR TVS BIKE
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Step-by-step selection for model variants, factory colors, and nearest branch delivery.
          </p>
        </div>

        {/* Step Progress Pills */}
        <div className="flex items-center justify-center gap-1 sm:gap-3 overflow-x-auto py-2">
          {steps.map((st) => {
            const isPassed = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => {
                  if (st.num < currentStep && currentStep !== 7) setCurrentStep(st.num);
                }}
                disabled={currentStep === 7 || st.num > currentStep}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                    : isPassed
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                }`}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black border border-current">
                  {isPassed ? <Check className="w-2.5 h-2.5" /> : st.num}
                </span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Selection Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Bike Preview (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 sticky top-28 shadow-md">
            <div className="relative aspect-[4/3] rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-4">
              <img
                src={displayedImage}
                alt={selectedBike?.model || 'TVS Motorcycle'}
                className="w-full h-full object-contain transition-all duration-300"
              />
              {selectedColor && (
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-md flex items-center gap-2 text-xs font-bold text-white">
                  <span
                    className="w-3 h-3 rounded-full border border-slate-600"
                    style={{ backgroundColor: selectedColor.hex || '#333' }}
                  />
                  <span>{selectedColor.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800/80 pb-4">
              <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                {selectedBike?.category || 'Motorcycle'}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedBike?.make} {selectedBike?.model}
              </h3>
              {selectedVariant && (
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Variant: <span className="font-bold text-slate-900 dark:text-white">{selectedVariant.name}</span>
                </p>
              )}
            </div>

            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Total Display Price:</span>
              <span className="text-2xl font-black text-red-600 dark:text-red-500">{formatLKR(currentPrice)}</span>
            </div>

            {selectedBranch && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Branch: <strong className="text-slate-900 dark:text-white">{selectedBranch.name}</strong></span>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pl-5">
                  {isAvailableAtBranch() ? '✓ Ready Stock Available' : '⚡ Available for Fast Showroom Dispatch'}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Step by Step Workflow (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            {/* STEP 1: SELECT MODEL */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 1 — Select TVS Motorcycle Model</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Choose from our official lineup of Apache racing bikes, smart scooters, and commuters.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {bikes.map((b) => {
                    const isSelected = selectedBike?._id === b._id;
                    return (
                      <button
                        key={b._id}
                        type="button"
                        onClick={() => handleModelSelect(b)}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-red-500 bg-red-50 dark:bg-red-600/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                            {b.category}
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {isSelected && <Check className="w-4 h-4 text-red-500" />}
                            <span>{b.model}</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {b.engineCapacity} • {b.transmission}
                          </div>
                        </div>
                        <div className="mt-3 text-xs font-black text-red-600 dark:text-red-400">
                          From {formatLKR(b.sellingPrice)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: SELECT VARIANT */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 2 — Select Variant</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Choose braking package, ride modes, or connectivity edition for {selectedBike?.model}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Model</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedBike?.variants?.map((v, i) => {
                    const isSelected = selectedVariant?.name === v.name;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleVariantSelect(v)}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-red-500 bg-red-50 dark:bg-red-600/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {isSelected && <Check className="w-4 h-4 text-red-500" />}
                            <span>{v.name}</span>
                          </div>
                          {v.code && <div className="text-xs text-slate-500 font-mono">{v.code}</div>}
                        </div>
                        <div className="text-sm font-black text-red-600 dark:text-red-400">
                          {formatLKR(v.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: SELECT COLOR */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 3 — Pick Factory Color</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Select official TVS racing color palette for your motorcycle.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBike?.colors?.map((c, i) => {
                    const isSelected = selectedColor?.name === c.name;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleColorSelect(c)}
                        className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-red-500 bg-red-50 dark:bg-red-600/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 shadow-sm"
                          style={{ backgroundColor: c.hex || '#333' }}
                        />
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {isSelected && <Check className="w-3.5 h-3.5 text-red-500" />}
                            <span>{c.name}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Factory Color</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: SELECT PREFERRED BRANCH */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 4 — Select Preferred Branch</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Pick your nearest TVS dealership branch for handover or delivery.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {branches.map((b) => {
                    const isSelected = selectedBranch?._id === b._id;
                    return (
                      <button
                        key={b._id}
                        type="button"
                        onClick={() => handleBranchSelect(b)}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-red-500 bg-red-50 dark:bg-red-600/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {isSelected && <Check className="w-4 h-4 text-red-500" />}
                            <span>{b.name}</span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>{b.location || b.address}</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {b.contactNumber || b.phone}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: SELECTION SUMMARY */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 5 — Review Your Selection Summary</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Confirm your chosen model, variant, color, and pickup branch before proceeding.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Motorcycle Model:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedBike?.model}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Selected Variant:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedVariant?.name}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Selected Color:</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 inline-block"
                        style={{ backgroundColor: selectedColor?.hex || '#333' }}
                      />
                      <span>{selectedColor?.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Preferred Dealership Branch:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedBranch?.name}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-sm">
                    <span className="font-extrabold text-slate-900 dark:text-white">Total Motorcycle Price:</span>
                    <span className="font-black text-red-600 dark:text-red-500 text-lg">{formatLKR(currentPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    Edit Branch
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
                  >
                    <span>Proceed to Customer Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: CUSTOMER DETAILS & SUBMIT */}
            {currentStep === 6 && (
              <form onSubmit={handleSubmitBooking} className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">Step 6 — Customer Information</h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Enter your details to generate your unique TVS motorcycle booking reference.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {submissionError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
                    {submissionError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ruwan Jayawardena"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0771234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Request Type</label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="Motorcycle Booking Request">Motorcycle Booking Request</option>
                      <option value="Quotation & Leasing Request">Quotation & Leasing Request</option>
                      <option value="Showroom Test Ride Request">Showroom Test Ride Request</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Special Notes / Message</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Seeking information on down payment or installment schemes..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-102 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Submit TVS Booking Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 7: CONFIRMATION */}
            {currentStep === 7 && (
              <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white">Booking Request Received!</h2>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your request has been successfully recorded in our TVS dealership CRM. Our sales team will verify stock and prepare your booking.
                  </p>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-sm mx-auto space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Your Reference Number
                  </div>
                  <div className="text-2xl font-black font-mono text-red-400 tracking-wider">
                    {submittedReference}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Please quote this reference for customer support or showroom pickup.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Link
                    href="/account/requests"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Track in Customer Portal</span>
                  </Link>
                  <Link
                    href="/bikes"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    <span>Back to Catalog</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Configurator...</div>}>
      <ConfiguratorContent />
    </Suspense>
  );
}
