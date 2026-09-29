"use client";
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Car,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Building,
  Filter,
  X,
  Camera,
  Video,
  Compass,
  AlertTriangle,
  Upload,
  Paperclip,
  Image as ImageIcon
} from 'lucide-react';

interface MediaAngles {
  front?: string;
  rear?: string;
  left?: string;
  right?: string;
  interior?: string;
  dashboard?: string;
  engine?: string;
  wheels?: string;
  damage?: string[];
  documents?: string[];
  view360Url?: string;
  videoUrl?: string;
  youtubeUrl?: string;
}

interface Vehicle {
  _id: string;
  stockNumber: string;
  registrationNumber: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  fuelType: string;
  transmission: string;
  engineCapacity: number;
  chassisNumber: string;
  mileage: number;
  color: string;
  purchasePrice: number;
  transportCost: number;
  repairCost: number;
  detailingCost: number;
  totalInvestment: number;
  sellingPrice: number;
  minimumSellingPrice: number;
  expectedProfit: number;
  status: string;
  images: string[];
  mediaAngles?: MediaAngles;
}

import { apiFetch } from '@/lib/api';

export default function VehicleInventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [apiError, setApiError] = useState('');

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMake, setFilterMake] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [newVehicle, setNewVehicle] = useState({
    stockNumber: '',
    registrationNumber: '',
    make: '',
    model: '',
    variant: '',
    year: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: '',
    chassisNumber: '',
    mileage: '',
    color: '',
    purchasePrice: '',
    transportCost: '',
    repairCost: '',
    detailingCost: '',
    sellingPrice: '',
    minimumSellingPrice: '',
    status: 'Available',
    images: [] as string[],
    mediaAngles: {
      front: '',
      rear: '',
      left: '',
      right: '',
      interior: '',
      dashboard: '',
      engine: '',
      wheels: '',
      damageText: '',
      documentsText: '',
      view360Url: '',
      videoUrl: '',
      youtubeUrl: ''
    }
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await apiFetch('/vehicles');
        if (res.ok) {
          const data = await res.json();
          setVehicles(data);
          setApiError('');
        } else {
          setApiError('Could not load inventory from the server.');
        }
      } catch {
        setApiError('Cannot connect to the server. Inventory is unavailable.');
      }
    };
    fetchVehicles();
  }, []);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onSuccess(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultiFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentText: string,
    onSuccess: (combinedText: string) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readPromises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve((ev.target?.result as string) || '');
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readPromises).then((newUrls) => {
      const existing = currentText.split(',').map((s) => s.trim()).filter(Boolean);
      const combined = [...existing, ...newUrls].join(', ');
      onSuccess(combined);
    });
  };

  const deleteVehicle = async () => {
    if (!deletingVehicle) return;
    const response = await apiFetch(`/vehicles/${deletingVehicle._id}`, { method: 'DELETE' });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setApiError(body.message || 'Could not delete vehicle.');
      return;
    }
    setVehicles((current) => current.filter((vehicle) => vehicle._id !== deletingVehicle._id));
    setDeletingVehicle(null);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const purchasePrice = parseFloat(newVehicle.purchasePrice as any) || 0;
    const transportCost = parseFloat(newVehicle.transportCost as any) || 0;
    const repairCost = parseFloat(newVehicle.repairCost as any) || 0;
    const detailingCost = parseFloat(newVehicle.detailingCost as any) || 0;
    const totalInvestment = purchasePrice + transportCost + repairCost + detailingCost;
    const sellingPrice = parseFloat(newVehicle.sellingPrice as any) || 0;
    const expectedProfit = sellingPrice - totalInvestment;

    const damageArray = newVehicle.mediaAngles.damageText.split(',').map(s => s.trim()).filter(Boolean);
    const docsArray = newVehicle.mediaAngles.documentsText.split(',').map(s => s.trim()).filter(Boolean);

    const mediaAnglesPayload: MediaAngles = {
      front: newVehicle.mediaAngles.front || undefined,
      rear: newVehicle.mediaAngles.rear || undefined,
      left: newVehicle.mediaAngles.left || undefined,
      right: newVehicle.mediaAngles.right || undefined,
      interior: newVehicle.mediaAngles.interior || undefined,
      dashboard: newVehicle.mediaAngles.dashboard || undefined,
      engine: newVehicle.mediaAngles.engine || undefined,
      wheels: newVehicle.mediaAngles.wheels || undefined,
      damage: damageArray.length ? damageArray : undefined,
      documents: docsArray.length ? docsArray : undefined,
      view360Url: newVehicle.mediaAngles.view360Url || undefined,
      videoUrl: newVehicle.mediaAngles.videoUrl || undefined,
      youtubeUrl: newVehicle.mediaAngles.youtubeUrl || undefined,
    };

    const item: Vehicle = {
      _id: Date.now().toString(),
      stockNumber: newVehicle.stockNumber || `STK-${new Date().getFullYear()}-${Date.now()}`,
      registrationNumber: newVehicle.registrationNumber,
      make: newVehicle.make,
      model: newVehicle.model,
      variant: newVehicle.variant,
      year: Number(newVehicle.year),
      fuelType: newVehicle.fuelType,
      transmission: newVehicle.transmission,
      engineCapacity: Number(newVehicle.engineCapacity),
      chassisNumber: newVehicle.chassisNumber,
      mileage: Number(newVehicle.mileage),
      color: newVehicle.color,
      purchasePrice,
      transportCost,
      repairCost,
      detailingCost,
      totalInvestment,
      sellingPrice,
      minimumSellingPrice: parseFloat(newVehicle.minimumSellingPrice as any) || sellingPrice,
      expectedProfit,
      status: newVehicle.status,
      images: newVehicle.images,
      mediaAngles: mediaAnglesPayload
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...payload } = item;
      const res = await apiFetch('/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedData = await res.json();
        setVehicles([savedData, ...vehicles]);
        setShowAddModal(false);
        setApiError('');
        return;
      }
      const details = await res.json().catch(() => ({}));
      setApiError(details.message || 'Could not save vehicle. Check required fields and try again.');
      return;
    } catch {
      setApiError('Cannot connect to the server. Vehicle was not saved.');
      return;
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (activeTab !== 'ALL' && v.status.toUpperCase() !== activeTab.toUpperCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchStock = v.stockNumber?.toLowerCase().includes(q);
      const matchReg = v.registrationNumber?.toLowerCase().includes(q);
      const matchMake = v.make?.toLowerCase().includes(q);
      const matchModel = v.model?.toLowerCase().includes(q);
      const matchChassis = v.chassisNumber?.toLowerCase().includes(q);
      if (!matchStock && !matchReg && !matchMake && !matchModel && !matchChassis) return false;
    }
    if (filterMake !== 'ALL' && v.make !== filterMake) return false;
    return true;
  });

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Available</span>;
      case 'Reserved':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Reserved</span>;
      case 'Sold':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Sold</span>;
      case 'Under Inspection':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Under Inspection</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Vehicle Inventory & Stock Master</h1>
          <p className="text-xs text-slate-500">
            Real-time stock valuation, cost-sheet breakdown, and Multi-Angle Media Management
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Vehicle</span>
        </button>
      </div>

      {apiError && (
        <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700">
          {apiError}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search make, model, stock #, chassis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto text-xs font-semibold">
            {['ALL', 'AVAILABLE', 'RESERVED', 'SOLD', 'UNDER INSPECTION'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Grid Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Stock #</th>
                <th className="py-3 px-4">Vehicle Details</th>
                <th className="py-3 px-4">Reg #</th>
                <th className="py-3 px-4">Cost Investment</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Profit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Media & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">{v.stockNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{v.make} {v.model} {v.variant}</div>
                    <div className="text-[11px] text-slate-500">{v.year} • {v.fuelType} • {v.transmission} • {v.color}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{v.registrationNumber}</td>
                  <td className="py-3 px-4 text-slate-700">{formatLKR(v.totalInvestment)}</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-600">{formatLKR(v.sellingPrice)}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{formatLKR(v.expectedProfit)}</td>
                  <td className="py-3 px-4">{getStatusBadge(v.status)}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedVehicle(v)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] rounded-lg border border-emerald-200 inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Specs & Media</span>
                    </button>
                    <div className="mt-2 flex justify-center gap-2">
                      <button onClick={() => window.location.assign(`/dashboard/vehicles/new?id=${v._id}`)} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50">Edit</button>
                      <button onClick={() => setDeletingVehicle(v)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No vehicle records found matching the query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal with Media Section */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Add Vehicle to Showroom Stock</h3>
                <p className="text-xs text-slate-500">Enter vehicle specifications, cost sheet breakdown and media assets</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="font-bold text-slate-900 border-b pb-1">1. Basic Vehicle Identification</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota / Honda / Nissan"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Premio / Vezel / Grace"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Variant / Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. F EX Package"
                    value={newVehicle.variant}
                    onChange={(e) => setNewVehicle({ ...newVehicle, variant: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturing Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 2024"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. WP CAB-8912"
                    value={newVehicle.registrationNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={newVehicle.fuelType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={newVehicle.transmission}
                    onChange={(e) => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Pearl White"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="border-t pt-3 font-bold text-slate-900">2. Financial Cost Sheet</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purchase Price</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10,000,000"
                    value={newVehicle.purchasePrice}
                    onChange={(e) => setNewVehicle({ ...newVehicle, purchasePrice: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transport Cost</label>
                  <input
                    type="number"
                    placeholder="e.g. 30,000"
                    value={newVehicle.transportCost}
                    onChange={(e) => setNewVehicle({ ...newVehicle, transportCost: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Repair Cost</label>
                  <input
                    type="number"
                    placeholder="e.g. 50,000"
                    value={newVehicle.repairCost}
                    onChange={(e) => setNewVehicle({ ...newVehicle, repairCost: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detailing Cost</label>
                  <input
                    type="number"
                    placeholder="e.g. 20,000"
                    value={newVehicle.detailingCost}
                    onChange={(e) => setNewVehicle({ ...newVehicle, detailingCost: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Selling Price (LKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 12,000,000"
                    value={newVehicle.sellingPrice}
                    onChange={(e) => setNewVehicle({ ...newVehicle, sellingPrice: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg font-extrabold text-emerald-700 text-sm placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Min Selling Price</label>
                  <input
                    type="number"
                    placeholder="e.g. 11,800,000"
                    value={newVehicle.minimumSellingPrice}
                    onChange={(e) => setNewVehicle({ ...newVehicle, minimumSellingPrice: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg font-bold text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* 5. Vehicle Images & Media Assets Specification */}
              <div className="border-t pt-3 font-bold text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>5. Vehicle Images & Multi-Angle Media Assets</span>
                </div>
                <span className="text-[11px] text-slate-500 font-normal">Paste URL or Click 📁 Upload File</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                {/* Main Cover Image */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Main Cover Image</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Paste Image URL or click Upload button →"
                      value={newVehicle.images[0] || ''}
                      onChange={(e) => setNewVehicle({ ...newVehicle, images: [e.target.value] })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shrink-0 text-xs shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setNewVehicle({ ...newVehicle, images: [url] }))}
                      />
                    </label>
                  </div>
                  {newVehicle.images[0] && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={newVehicle.images[0]} alt="Preview" className="w-12 h-12 object-cover rounded border border-slate-300" />
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ Main image uploaded/linked</span>
                    </div>
                  )}
                </div>

                {/* Exterior Multi-Angles */}
                <div className="font-semibold text-slate-700 pt-1">Exterior Multi-Angles</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['front', 'Front Angle'],
                    ['rear', 'Rear Angle'],
                    ['left', 'Left Side'],
                    ['right', 'Right Side'],
                  ].map(([field, label]) => (
                    <div key={field} className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                      <input
                        type="text"
                        placeholder={`${label} URL`}
                        value={(newVehicle.mediaAngles as any)[field] || ''}
                        onChange={(e) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, [field]: e.target.value } })}
                        className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                      />
                      <label className="cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-slate-300">
                        <Upload className="w-3 h-3 text-slate-600" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, [field]: url } }))}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                {/* Interior & Parts Angles */}
                <div className="font-semibold text-slate-700 pt-1">Interior & Parts Angles</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['interior', 'Interior View'],
                    ['dashboard', 'Dashboard View'],
                    ['engine', 'Engine Bay'],
                    ['wheels', 'Wheels View'],
                  ].map(([field, label]) => (
                    <div key={field} className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                      <input
                        type="text"
                        placeholder={`${label} URL`}
                        value={(newVehicle.mediaAngles as any)[field] || ''}
                        onChange={(e) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, [field]: e.target.value } })}
                        className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                      />
                      <label className="cursor-pointer px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-slate-300">
                        <Upload className="w-3 h-3 text-slate-600" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, [field]: url } }))}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                {/* Damage & Documents Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Damage Photos (URLs or Upload)</label>
                    <div className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. http://img1.jpg, http://img2.jpg"
                        value={newVehicle.mediaAngles.damageText}
                        onChange={(e) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, damageText: e.target.value } })}
                        className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                      />
                      <label className="cursor-pointer px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-amber-300">
                        <Upload className="w-3 h-3 text-amber-700" />
                        <span>Upload Files</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleMultiFileUpload(e, newVehicle.mediaAngles.damageText, (combined) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, damageText: combined } }))}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Vehicle Documents (Inspection/Reg)</label>
                    <div className="flex gap-1.5 items-center bg-white p-1.5 rounded-lg border border-slate-200">
                      <input
                        type="text"
                        placeholder="e.g. http://doc1.pdf, http://doc2.jpg"
                        value={newVehicle.mediaAngles.documentsText}
                        onChange={(e) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, documentsText: e.target.value } })}
                        className="flex-1 p-1.5 text-xs border-0 focus:outline-none placeholder:text-slate-400"
                      />
                      <label className="cursor-pointer px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded text-[11px] font-semibold flex items-center gap-1 shrink-0 border border-blue-300">
                        <Paperclip className="w-3 h-3 text-blue-700" />
                        <span>Upload Files</span>
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          multiple
                          className="hidden"
                          onChange={(e) => handleMultiFileUpload(e, newVehicle.mediaAngles.documentsText, (combined) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, documentsText: combined } }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 360° View & Video Links */}
                <div className="font-semibold text-slate-700 pt-1">360° View & Video Links</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex gap-1 items-center bg-white p-1 rounded-lg border border-slate-200">
                    <input type="text" placeholder="360° VR View Link" value={newVehicle.mediaAngles.view360Url} onChange={(e) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, view360Url: e.target.value } })} className="flex-1 p-1 text-xs border-0 focus:outline-none placeholder:text-slate-400" />
                  </div>
                  <div className="flex gap-1 items-center bg-white p-1 rounded-lg border border-slate-200">
                    <input type="text" placeholder="Video Link (MP4 or Upload)" value={newVehicle.mediaAngles.videoUrl} onChange={(e) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, videoUrl: e.target.value } })} className="flex-1 p-1 text-xs border-0 focus:outline-none placeholder:text-slate-400" />
                    <label className="cursor-pointer px-1.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold flex items-center gap-0.5 shrink-0 border">
                      <Upload className="w-2.5 h-2.5" />
                      <span>Upload</span>
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, videoUrl: url } }))} />
                    </label>
                  </div>
                  <div className="flex gap-1 items-center bg-white p-1 rounded-lg border border-slate-200">
                    <input type="text" placeholder="YouTube Video URL" value={newVehicle.mediaAngles.youtubeUrl} onChange={(e) => setNewVehicle({ ...newVehicle, mediaAngles: { ...newVehicle.mediaAngles, youtubeUrl: e.target.value } })} className="flex-1 p-1 text-xs border-0 focus:outline-none placeholder:text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Save Vehicle to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Vehicle Details Modal with Multi-Media Showcase */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                </h3>
                <p className="text-xs text-slate-500 font-mono">Stock #: {selectedVehicle.stockNumber} | Reg #: {selectedVehicle.registrationNumber}</p>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedVehicle.images && selectedVehicle.images[0] && (
              <div className="relative h-56 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-slate-950">
                <img
                  src={selectedVehicle.images[0]}
                  alt="Main Vehicle"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                  Main Showroom Image
                </div>
              </div>
            )}

            {/* Multi-Angle Images Gallery */}
            <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b pb-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>5. Multi-Angle Photo & Media Gallery</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {[
                  ['Front', selectedVehicle.mediaAngles?.front],
                  ['Rear', selectedVehicle.mediaAngles?.rear],
                  ['Left Side', selectedVehicle.mediaAngles?.left],
                  ['Right Side', selectedVehicle.mediaAngles?.right],
                  ['Interior', selectedVehicle.mediaAngles?.interior],
                  ['Dashboard', selectedVehicle.mediaAngles?.dashboard],
                  ['Engine', selectedVehicle.mediaAngles?.engine],
                  ['Wheels', selectedVehicle.mediaAngles?.wheels],
                ].map(([label, url]) => url ? (
                  <div key={label as string} className="bg-white rounded-lg p-2 border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">{label}</span>
                    <img src={url as string} alt={label as string} className="w-full h-20 object-cover rounded" />
                  </div>
                ) : (
                  <div key={label as string} className="bg-white/60 rounded-lg p-2 border border-dashed border-slate-200 flex flex-col justify-center items-center h-24 text-center">
                    <span className="font-semibold text-slate-400 block text-[10px]">{label}</span>
                    <span className="text-[9px] text-slate-300">No Image</span>
                  </div>
                ))}
              </div>

              {/* 360 & YouTube Embeds */}
              {selectedVehicle.mediaAngles?.youtubeUrl && getYoutubeEmbedUrl(selectedVehicle.mediaAngles.youtubeUrl) && (
                <div className="pt-2">
                  <span className="font-bold text-slate-800 text-xs block mb-1">YouTube Video Review</span>
                  <div className="aspect-video w-full rounded-xl overflow-hidden border">
                    <iframe src={getYoutubeEmbedUrl(selectedVehicle.mediaAngles.youtubeUrl)!} className="w-full h-full" allowFullScreen />
                  </div>
                </div>
              )}

              {selectedVehicle.mediaAngles?.view360Url && (
                <div className="pt-1 flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5"><Compass className="w-4 h-4" /> 360° Interactive Tour Available</span>
                  <a href={selectedVehicle.mediaAngles.view360Url} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded font-bold text-[10px]">Open 360° Tour →</a>
                </div>
              )}

              {/* Damage & Documents */}
              {(selectedVehicle.mediaAngles?.damage?.length || selectedVehicle.mediaAngles?.documents?.length) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                  {selectedVehicle.mediaAngles?.damage && selectedVehicle.mediaAngles.damage.length > 0 && (
                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <span className="font-bold text-amber-900 block mb-1">Damage Photos ({selectedVehicle.mediaAngles.damage.length})</span>
                      <div className="flex gap-1 overflow-x-auto">
                        {selectedVehicle.mediaAngles.damage.map((dUrl, idx) => (
                          <a key={idx} href={dUrl} target="_blank" rel="noreferrer"><img src={dUrl} alt="damage" className="w-12 h-12 object-cover rounded border" /></a>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedVehicle.mediaAngles?.documents && selectedVehicle.mediaAngles.documents.length > 0 && (
                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <span className="font-bold text-emerald-900 block mb-1">Inspection Documents ({selectedVehicle.mediaAngles.documents.length})</span>
                      <div className="flex gap-1 overflow-x-auto">
                        {selectedVehicle.mediaAngles.documents.map((docUrl, idx) => (
                          <a key={idx} href={docUrl} target="_blank" rel="noreferrer" className="px-2 py-1 bg-white rounded border text-emerald-700 font-mono text-[10px]">Doc #{idx + 1} 📄</a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border">
                <div><span className="text-slate-500 block">Fuel:</span> <span className="font-bold">{selectedVehicle.fuelType}</span></div>
                <div><span className="text-slate-500 block">Transmission:</span> <span className="font-bold">{selectedVehicle.transmission}</span></div>
                <div><span className="text-slate-500 block">Color:</span> <span className="font-bold">{selectedVehicle.color}</span></div>
                <div><span className="text-slate-500 block">Mileage:</span> <span className="font-bold">{selectedVehicle.mileage.toLocaleString()} km</span></div>
                <div><span className="text-slate-500 block">Chassis #:</span> <span className="font-mono text-[11px]">{selectedVehicle.chassisNumber}</span></div>
                <div><span className="text-slate-500 block">Status:</span> {getStatusBadge(selectedVehicle.status)}</div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 mb-2 border-b pb-1">Cost Sheet Breakdown</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span>Purchase Price:</span> <span className="font-medium">{formatLKR(selectedVehicle.purchasePrice)}</span></div>
                  <div className="flex justify-between"><span>Transport Cost:</span> <span className="font-medium">{formatLKR(selectedVehicle.transportCost)}</span></div>
                  <div className="flex justify-between"><span>Repair Cost:</span> <span className="font-medium">{formatLKR(selectedVehicle.repairCost)}</span></div>
                  <div className="flex justify-between"><span>Detailing Cost:</span> <span className="font-medium">{formatLKR(selectedVehicle.detailingCost)}</span></div>
                  <div className="flex justify-between font-bold border-t pt-1"><span>Total Investment:</span> <span className="text-slate-900">{formatLKR(selectedVehicle.totalInvestment)}</span></div>
                  <div className="flex justify-between font-bold text-sm text-emerald-600 border-t pt-1"><span>Selling Price:</span> <span>{formatLKR(selectedVehicle.sellingPrice)}</span></div>
                  <div className="flex justify-between font-bold text-blue-600"><span>Expected Profit:</span> <span>{formatLKR(selectedVehicle.expectedProfit)}</span></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
      {deletingVehicle && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">Delete {deletingVehicle.make} {deletingVehicle.model}?</h2><p className="mt-2 text-sm text-slate-600">This removes the vehicle from inventory and cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeletingVehicle(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button onClick={deleteVehicle} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Delete vehicle</button></div></section></div>}
    </DashboardLayout>
  );
}
