"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import { useSettings } from '@/lib/useSettings';
import {
  Car,
  Check,
  X,
  Search,
  ArrowLeft,
  Plus,
  Printer,
  Sparkles,
  Fuel,
  Gauge,
  Calendar,
  FileText,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  Trash2,
  CheckCircle2,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Vehicle {
  _id: string;
  stockNumber: string;
  registrationNumber?: string;
  make: string;
  model: string;
  variant?: string;
  year?: number;
  manufacturingYear?: number;
  registeredYear?: number;
  vehicleType?: string;
  bodyType?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  engineCapacity?: number | string;
  mileage?: number;
  color?: string;
  status?: string;
  sellingPrice?: number;
  minimumSellingPrice?: number;
  totalInvestment?: number;
  expectedProfit?: number;
  horsepower?: number;
  torque?: string;
  seatingCapacity?: number;
  doors?: number;
  safetyFeatures?: string[];
  comfortFeatures?: string[];
  entertainmentFeatures?: string[];
  images?: string[];
  chassisNumber?: string;
  [key: string]: any;
}

export default function VehicleComparisonPage() {
  const router = useRouter();
  const { settings: brand } = useSettings();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states for the vehicle selection modal
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMake, setFilterMake] = useState('All');
  const [filterBodyType, setFilterBodyType] = useState('All');
  const [filterFuel, setFilterFuel] = useState('All');

  // Comparison Display toggles
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [onlyDifferences, setOnlyDifferences] = useState(false);

  // Fetch all vehicles
  useEffect(() => {
    apiFetch('/vehicles')
      .then(async (res) => {
        if (res.ok) {
          const data: Vehicle[] = await res.json();
          setVehicles(data);

          // By default, select first 2 vehicles if none selected
          if (data.length >= 2) {
            setSelectedIds([data[0]._id, data[1]._id]);
          } else if (data.length === 1) {
            setSelectedIds([data[0]._id]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val?: number) => {
    const symbol = brand.currencySymbol || 'LKR ';
    return symbol + ' ' + (Number(val) || 0).toLocaleString('en-LK');
  };

  const calculateMonthlyLeaseEst = (price?: number) => {
    if (!price) return '—';
    // Estimate 5 year (60 months) lease with 20% downpayment at 14.5% interest
    const principal = price * 0.8;
    const ratePerMonth = 0.145 / 12;
    const months = 60;
    const monthly = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) / (Math.pow(1 + ratePerMonth, months) - 1);
    return formatCurrency(Math.round(monthly)) + ' / mo';
  };

  const calculateDownpaymentEst = (price?: number) => {
    if (!price) return '—';
    return formatCurrency(Math.round(price * 0.2));
  };

  // Add / Remove vehicle handlers
  const handleAddVehicle = (id: string) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 4) {
      alert('You can compare a maximum of 4 vehicles at a time.');
      return;
    }
    setSelectedIds([...selectedIds, id]);
    setShowPickerModal(false);
  };

  const handleRemoveVehicle = (id: string) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const selectedVehicles = useMemo(() => {
    return selectedIds
      .map((id) => vehicles.find((v) => v._id === id))
      .filter((v): v is Vehicle => Boolean(v));
  }, [selectedIds, vehicles]);

  // Unique lists for modal filters
  const uniqueMakes = useMemo(() => {
    const makes = Array.from(new Set(vehicles.map((v) => v.make).filter(Boolean)));
    return ['All', ...makes];
  }, [vehicles]);

  const uniqueBodyTypes = useMemo(() => {
    const bodies = Array.from(new Set(vehicles.map((v) => v.bodyType || v.vehicleType).filter(Boolean)));
    return ['All', ...bodies];
  }, [vehicles]);

  const uniqueFuels = useMemo(() => {
    const fuels = Array.from(new Set(vehicles.map((v) => v.fuelType).filter(Boolean)));
    return ['All', ...fuels];
  }, [vehicles]);

  const filteredPickerVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.make?.toLowerCase().includes(q) ||
        v.model?.toLowerCase().includes(q) ||
        v.stockNumber?.toLowerCase().includes(q) ||
        v.registrationNumber?.toLowerCase().includes(q) ||
        v.variant?.toLowerCase().includes(q);

      const matchesMake = filterMake === 'All' || v.make === filterMake;
      const matchesBody = filterBodyType === 'All' || (v.bodyType || v.vehicleType) === filterBodyType;
      const matchesFuel = filterFuel === 'All' || v.fuelType === filterFuel;

      return matchesSearch && matchesMake && matchesBody && matchesFuel;
    });
  }, [vehicles, searchQuery, filterMake, filterBodyType, filterFuel]);

  // Helper to check if a feature string is present in vehicle features
  const hasFeature = (v: Vehicle, keyword: string) => {
    const allFeatures = [
      ...(v.safetyFeatures || []),
      ...(v.comfortFeatures || []),
      ...(v.entertainmentFeatures || []),
      v.variant || '',
      v.model || ''
    ].join(' ').toLowerCase();

    return allFeatures.includes(keyword.toLowerCase());
  };

  // Specification Row Definitions with Categorization
  interface SpecField {
    id: string;
    label: string;
    icon?: any;
    getValue: (v: Vehicle) => any;
    format?: (val: any, v: Vehicle) => React.ReactNode;
  }

  interface SpecSection {
    id: string;
    title: string;
    icon: any;
    fields: SpecField[];
  }

  const specSections: SpecSection[] = [
    {
      id: 'pricing',
      title: 'Pricing & Financing',
      icon: DollarSign,
      fields: [
        {
          id: 'sellingPrice',
          label: 'Selling Price',
          getValue: (v) => v.sellingPrice || 0,
          format: (val) => <span className="font-extrabold text-emerald-700 text-sm">{formatCurrency(val)}</span>,
        },
        {
          id: 'estDownpayment',
          label: 'Est. Down Payment (20%)',
          getValue: (v) => calculateDownpaymentEst(v.sellingPrice),
          format: (val) => <span className="font-semibold text-slate-800">{val}</span>,
        },
        {
          id: 'estMonthlyLease',
          label: 'Est. Lease Installment (60m)',
          getValue: (v) => calculateMonthlyLeaseEst(v.sellingPrice),
          format: (val) => <span className="font-semibold text-blue-700">{val}</span>,
        },
        {
          id: 'condition',
          label: 'Condition',
          getValue: (v) => v.condition || 'Used',
          format: (val) => (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                val === 'Brand New'
                  ? 'bg-purple-100 text-purple-800'
                  : val === 'Reconditioned'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {val}
            </span>
          ),
        },
        {
          id: 'status',
          label: 'Inventory Status',
          getValue: (v) => v.status || 'Available',
          format: (val) => (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                val === 'Available'
                  ? 'bg-emerald-100 text-emerald-800'
                  : val === 'Reserved'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {val}
            </span>
          ),
        },
      ],
    },
    {
      id: 'overview',
      title: 'Identity & Registration',
      icon: Layers,
      fields: [
        {
          id: 'stockNumber',
          label: 'Stock Number',
          getValue: (v) => v.stockNumber || '—',
          format: (val) => <span className="font-mono text-slate-700">{val}</span>,
        },
        {
          id: 'regNumber',
          label: 'Registration Number',
          getValue: (v) => v.registrationNumber || 'Unregistered',
          format: (val) => (
            <span className={`font-mono font-semibold ${val === 'Unregistered' ? 'text-blue-600' : 'text-slate-900'}`}>
              {val}
            </span>
          ),
        },
        {
          id: 'year',
          label: 'Year of Manufacture',
          getValue: (v) => v.year || v.manufacturingYear || '—',
        },
        {
          id: 'regYear',
          label: 'Registration Year',
          getValue: (v) => v.registeredYear || 'Unregistered / Brand New',
        },
        {
          id: 'chassisNumber',
          label: 'Chassis Number',
          getValue: (v) => v.chassisNumber || '—',
          format: (val) => <span className="font-mono text-[11px] text-slate-600">{val}</span>,
        },
      ],
    },
    {
      id: 'performance',
      title: 'Engine & Performance',
      icon: Gauge,
      fields: [
        {
          id: 'fuelType',
          label: 'Fuel Type',
          getValue: (v) => v.fuelType || '—',
          format: (val) => (
            <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
              <Fuel className="w-3 h-3 text-amber-500" />
              <span>{val}</span>
            </span>
          ),
        },
        {
          id: 'engineCapacity',
          label: 'Engine Capacity',
          getValue: (v) => {
            if (!v.engineCapacity) return '—';
            const cap = String(v.engineCapacity);
            return cap.toLowerCase().includes('cc') ? cap : `${cap} cc`;
          },
        },
        {
          id: 'transmission',
          label: 'Transmission',
          getValue: (v) => v.transmission || 'Automatic',
        },
        {
          id: 'driveType',
          label: 'Drivetrain',
          getValue: (v) => v.driveType || '2WD',
        },
        {
          id: 'horsepower',
          label: 'Horsepower / Power',
          getValue: (v) => (v.horsepower ? `${v.horsepower} BHP` : '—'),
        },
      ],
    },
    {
      id: 'dimensions',
      title: 'TVS Dimensions, Capacity & Chassis',
      icon: Car,
      fields: [
        {
          id: 'category',
          label: 'Category',
          getValue: (v) => v.category || 'Motorcycle',
        },
        {
          id: 'coolingSystem',
          label: 'Cooling System',
          getValue: (v) => v.coolingSystem || 'Air Cooled',
        },
        {
          id: 'fuelTankCapacity',
          label: 'Fuel Tank Capacity',
          getValue: (v) => v.fuelTankCapacity || '12 L',
        },
        {
          id: 'groundClearance',
          label: 'Ground Clearance',
          getValue: (v) => v.groundClearance || '180 mm',
        },
        {
          id: 'seatHeight',
          label: 'Seat Height',
          getValue: (v) => v.seatHeight || '790 mm',
        },
        {
          id: 'brakingSystem',
          label: 'Braking System',
          getValue: (v) => v.brakingSystem || 'Disc / Drum',
        },
      ],
    },
    {
      id: 'features',
      title: 'TVS Smart Technologies & Features',
      icon: Sparkles,
      fields: [
        {
          id: 'smartXonnect',
          label: 'TVS SmartXonnect (Bluetooth & Nav)',
          getValue: (v) => hasFeature(v, 'smartxonnect') || hasFeature(v, 'bluetooth') || hasFeature(v, 'connected') || (v.model && (v.model.includes('NTORQ') || v.model.includes('RR 310') || v.model.includes('Ronin') || v.model.includes('iQube'))),
          format: (val) =>
            val ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600" /> Yes
              </span>
            ) : (
              <span className="text-slate-400 font-medium">—</span>
            ),
        },
        {
          id: 'rtfi',
          label: 'Race-Tuned Fuel Injection (RT-Fi)',
          getValue: (v) => hasFeature(v, 'rt-fi') || hasFeature(v, 'injection') || (v.fuelSystem && v.fuelSystem.includes('Fi')) || true,
          format: (val) =>
            val ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600" /> Standard Fi
              </span>
            ) : (
              <span className="text-slate-400 font-medium">—</span>
            ),
        },
        {
          id: 'ridingModes',
          label: 'Multi-Ride Modes (Urban/Rain/Sport)',
          getValue: (v) => hasFeature(v, 'mode') || (v.model && (v.model.includes('RTR') || v.model.includes('RR') || v.model.includes('Ronin'))),
          format: (val) =>
            val ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600" /> Yes
              </span>
            ) : (
              <span className="text-slate-400 font-medium">—</span>
            ),
        },
        {
          id: 'absBraking',
          label: 'Super-Moto ABS / Synchronized Braking',
          getValue: (v) => hasFeature(v, 'abs') || hasFeature(v, 'sbt') || (v.brakingSystem && (v.brakingSystem.includes('ABS') || v.brakingSystem.includes('SBT'))),
          format: (val) =>
            val ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600" /> Yes
              </span>
            ) : (
              <span className="text-slate-400 font-medium">—</span>
            ),
        },
        {
          id: 'ledHeadlamp',
          label: 'Full LED Headlamp with DRLs',
          getValue: (v) => hasFeature(v, 'led') || hasFeature(v, 'drl') || true,
          format: (val) =>
            val ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600" /> Yes
              </span>
            ) : (
              <span className="text-slate-400 font-medium">—</span>
            ),
        },
        {
          id: 'gtt',
          label: 'Glide Through Technology (GTT)',
          getValue: (v) => hasFeature(v, 'gtt') || (v.model && (v.model.includes('Apache') || v.model.includes('Raider') || v.model.includes('Ronin'))),
          format: (val) =>
            val ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600" /> Yes
              </span>
            ) : (
              <span className="text-slate-400 font-medium">—</span>
            ),
        },
      ],
    },
  ];

  // Difference detection helper
  const isRowDifferent = (field: SpecField) => {
    if (selectedVehicles.length <= 1) return false;
    const values = selectedVehicles.map((v) => String(field.getValue(v)).toLowerCase().trim());
    const firstVal = values[0];
    return values.some((val) => val !== firstVal);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header and Action controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <Link
              href="/dashboard/vehicles"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-2 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Showroom Inventory
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Vehicle Comparison Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Side-by-side spec comparison, performance data, pricing, and feature highlights
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setHighlightDiff(!highlightDiff)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                highlightDiff
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{highlightDiff ? 'Differences Highlighted' : 'Highlight Differences'}</span>
            </button>

            {selectedVehicles.length < 4 && (
              <button
                onClick={() => setShowPickerModal(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle ({selectedVehicles.length}/4)</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print comparison table for customer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>

            {selectedVehicles.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Selected Vehicles Quick Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Active Comparison Vehicles:</span>
              <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                {selectedVehicles.length} of 4 Max
              </span>
            </div>
            {selectedVehicles.length < 4 && (
              <button
                onClick={() => setShowPickerModal(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Browse Showroom Inventory to Add
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedVehicles.map((v) => (
              <div
                key={v._id}
                className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-2xs"
              >
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {v.make} {v.model} ({v.year || v.manufacturingYear || '2020'})
                </span>
                <span className="text-emerald-700 font-bold font-mono">
                  {formatCurrency(v.sellingPrice)}
                </span>
                <button
                  onClick={() => handleRemoveVehicle(v._id)}
                  className="w-4 h-4 rounded-full bg-emerald-200/80 hover:bg-red-200 hover:text-red-700 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer ml-1"
                  title="Remove from comparison"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {selectedVehicles.length === 0 && (
              <p className="text-xs text-slate-400 italic">No vehicles currently selected. Click Add Vehicle to begin.</p>
            )}
          </div>
        </div>

        {/* Empty State */}
        {selectedVehicles.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No Vehicles Selected for Comparison</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Select 2 or more vehicles from your inventory to compare pricing, technical specs, transmission, and features side by side.
              </p>
            </div>
            <button
              onClick={() => setShowPickerModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Select Vehicles to Compare</span>
            </button>
          </div>
        ) : (
          /* Main Side-by-Side Comparison Container */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                {/* Table Header: Top Vehicle Cards */}
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {/* Sticky Spec Header Column */}
                    <th className="p-4 sm:p-5 w-48 sm:w-56 min-w-[190px] max-w-[220px] font-bold text-slate-700 border-r border-slate-200 sticky left-0 bg-slate-50 z-20 shadow-xs align-bottom">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                          Side-by-side Analysis
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900">Vehicle Specs</h3>
                        <p className="text-[11px] text-slate-500 font-normal">
                          {selectedVehicles.length} of 4 vehicles loaded
                        </p>
                      </div>
                    </th>

                    {/* Columns for each selected vehicle */}
                    {selectedVehicles.map((v) => (
                      <th
                        key={v._id}
                        className="p-4 sm:p-5 w-[280px] min-w-[280px] max-w-[320px] border-r border-slate-200 align-top bg-white"
                      >
                        <div className="space-y-3">
                          {/* Top Card Bar: Status badge & Remove button */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                v.status === 'Available'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : v.status === 'Reserved'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {v.status || 'Available'}
                            </span>
                            <button
                              onClick={() => handleRemoveVehicle(v._id)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Remove vehicle from comparison"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Fixed Aspect-Ratio Vehicle Photo */}
                          <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 relative shadow-inner group">
                            {v.images?.[0] ? (
                              <img
                                src={v.images[0]}
                                alt={`${v.make} ${v.model}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                <Car className="w-10 h-10 mb-1 opacity-40" />
                                <span className="text-[11px] font-medium text-slate-400">No Photo Available</span>
                              </div>
                            )}
                            {v.images && v.images.length > 1 && (
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[10px] font-semibold backdrop-blur-xs">
                                {v.images.length} Photos
                              </div>
                            )}
                          </div>

                          {/* Vehicle Title & Variant */}
                          <div>
                            <h4 className="text-base font-extrabold text-slate-900 leading-snug truncate">
                              {v.make} {v.model}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium truncate">
                              {v.variant || v.bodyType || 'Standard'} • {v.year || v.manufacturingYear || '2020'}
                            </p>
                          </div>

                          {/* Selling Price */}
                          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                              Selling Price
                            </span>
                            <span className="text-base font-black text-emerald-700 tracking-tight">
                              {formatCurrency(v.sellingPrice)}
                            </span>
                          </div>

                          {/* Quick Actions */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <Link
                              href={`/dashboard/quotations?vehicleId=${v._id}`}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-center text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Quote</span>
                            </Link>
                            <Link
                              href={`/dashboard/test-drives?vehicleId=${v._id}`}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-center text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                            >
                              <Car className="w-3 h-3" />
                              <span>Test Drive</span>
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}

                    {/* Empty Slot Placeholder (when fewer than 4 are loaded) */}
                    {selectedVehicles.length < 4 && (
                      <th className="p-4 sm:p-5 w-[280px] min-w-[280px] max-w-[320px] border-r border-slate-200 align-top bg-slate-50/50">
                        <div
                          onClick={() => setShowPickerModal(true)}
                          className="h-full min-h-[300px] border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white/60 hover:bg-blue-50/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-3 shadow-xs">
                            <Plus className="w-6 h-6" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                            + Add Vehicle to Compare
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 max-w-[180px]">
                            Click to select another vehicle from current stock (Slot {selectedVehicles.length + 1} of 4)
                          </p>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Categorized Specifications Body */}
                <tbody className="divide-y divide-slate-200 font-medium">
                  {specSections.map((section) => {
                    const SectionIcon = section.icon;

                    return (
                      <React.Fragment key={section.id}>
                        {/* Section Header Row */}
                        <tr className="bg-slate-100/80 border-t-2 border-slate-200">
                          <td
                            colSpan={selectedVehicles.length + 1 + (selectedVehicles.length < 4 ? 1 : 0)}
                            className="py-2.5 px-4 font-extrabold text-slate-800 uppercase tracking-wider text-[11px] bg-slate-100 sticky left-0"
                          >
                            <div className="flex items-center gap-2 text-slate-900">
                              <SectionIcon className="w-3.5 h-3.5 text-blue-600" />
                              <span>{section.title}</span>
                            </div>
                          </td>
                        </tr>

                        {/* Specification Fields in this Section */}
                        {section.fields.map((field) => {
                          const hasDiff = isRowDifferent(field);
                          const highlightThisRow = highlightDiff && hasDiff;

                          return (
                            <tr
                              key={field.id}
                              className={`transition-colors ${
                                highlightThisRow
                                  ? 'bg-amber-50/70 border-l-4 border-amber-400 font-semibold'
                                  : 'hover:bg-slate-50/80'
                              }`}
                            >
                              {/* Sticky Spec Title */}
                              <td
                                className={`p-3.5 border-r border-slate-200 sticky left-0 z-10 transition-colors ${
                                  highlightThisRow
                                    ? 'bg-amber-50 text-amber-950 font-bold'
                                    : 'bg-slate-50/95 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1.5">
                                  <span>{field.label}</span>
                                  {hasDiff && (
                                    <span
                                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold tracking-wider ${
                                        highlightDiff
                                          ? 'bg-amber-200 text-amber-900'
                                          : 'bg-slate-200 text-slate-600'
                                      }`}
                                    >
                                      Diff
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Values for each selected vehicle */}
                              {selectedVehicles.map((v) => {
                                const rawVal = field.getValue(v);
                                const rendered = field.format ? field.format(rawVal, v) : rawVal;

                                return (
                                  <td
                                    key={v._id}
                                    className={`p-3.5 border-r border-slate-200 ${
                                      highlightThisRow ? 'bg-amber-50/40 text-slate-900' : 'text-slate-800'
                                    }`}
                                  >
                                    {rendered !== undefined && rendered !== null && rendered !== '' ? rendered : '—'}
                                  </td>
                                );
                              })}

                              {/* Empty column placeholder filler */}
                              {selectedVehicles.length < 4 && (
                                <td className="p-3.5 border-r border-slate-200 bg-slate-50/30 text-center text-slate-300">
                                  —
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add Vehicle Selector */}
        {showPickerModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    <span>Select Vehicle to Compare</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose from available dealership inventory ({selectedVehicles.length}/4 selected)
                  </p>
                </div>
                <button
                  onClick={() => setShowPickerModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by make, model, stock number, or registration..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Make</label>
                    <select
                      value={filterMake}
                      onChange={(e) => setFilterMake(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                    >
                      {uniqueMakes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Body Type</label>
                    <select
                      value={filterBodyType}
                      onChange={(e) => setFilterBodyType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                    >
                      {uniqueBodyTypes.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Fuel Type</label>
                    <select
                      value={filterFuel}
                      onChange={(e) => setFilterFuel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                    >
                      {uniqueFuels.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Vehicle List */}
              <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 max-h-[50vh]">
                {filteredPickerVehicles.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Car className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-semibold">No vehicles found matching filters.</p>
                  </div>
                ) : (
                  filteredPickerVehicles.map((v) => {
                    const isAlreadySelected = selectedIds.includes(v._id);

                    return (
                      <div
                        key={v._id}
                        className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                            {v.images?.[0] ? (
                              <img src={v.images[0]} alt={v.model} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Car className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {v.make} {v.model} {v.variant ? `(${v.variant})` : ''}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {v.year || v.manufacturingYear || '2020'} • {v.fuelType || 'Petrol'} • {v.transmission || 'Auto'} •{' '}
                              <span className="font-mono text-slate-700">{v.stockNumber}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-xs sm:text-sm font-black text-emerald-700">
                            {formatCurrency(v.sellingPrice)}
                          </span>

                          <button
                            disabled={isAlreadySelected || selectedIds.length >= 4}
                            onClick={() => handleAddVehicle(v._id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                              isAlreadySelected
                                ? 'bg-emerald-100 text-emerald-800 cursor-default opacity-80'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                            }`}
                          >
                            {isAlreadySelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Compare</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filteredPickerVehicles.length} vehicles</span>
                <button
                  onClick={() => setShowPickerModal(false)}
                  className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
