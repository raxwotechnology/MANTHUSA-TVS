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
  Image as ImageIcon,
  FileDown,
  FileSpreadsheet,
  Package,
  Layers,
  Calendar,
  Hash
} from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';
import { DateFilterControl, isWithinDateRange } from '@/components/dashboard/DateFilterControl';
import { TVSStockRequisitionPlanner } from '@/components/dashboard/TVSStockRequisitionPlanner';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/lib/upload';

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
  roundNumber?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showTVSRequisition, setShowTVSRequisition] = useState(false);

  const defaultVehicleForm = {
    stockNumber: '',
    registrationNumber: '',
    roundNumber: '',
    make: 'TVS',
    model: '',
    variant: '',
    year: '2026',
    category: 'Sport Motorcycles',
    fuelType: 'Petrol',
    transmission: '5-Speed Manual',
    engineCapacity: '',
    chassisNumber: '',
    mileage: '0',
    color: 'Racing Red',
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
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [assignPlateVehicle, setAssignPlateVehicle] = useState<Vehicle | null>(null);
  const [assignPlateValue, setAssignPlateValue] = useState('');
  const [assignPlateLoading, setAssignPlateLoading] = useState(false);
  const [vehicleNotification, setVehicleNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [uploadingMediaMsg, setUploadingMediaMsg] = useState<string | null>(null);
  const [modalMediaNotification, setModalMediaNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [newVehicle, setNewVehicle] = useState(defaultVehicleForm);

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setNewVehicle(defaultVehicleForm);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setNewVehicle({
      stockNumber: v.stockNumber || '',
      registrationNumber: v.registrationNumber || '',
      roundNumber: (v as any).roundNumber || '',
      make: v.make || '',
      model: v.model || '',
      variant: v.variant || '',
      year: v.year ? String(v.year) : (v as any).manufacturingYear ? String((v as any).manufacturingYear) : '',
      category: (v as any).category || 'Sport Motorcycles',
      fuelType: v.fuelType || 'Petrol',
      transmission: v.transmission || 'Automatic',
      engineCapacity: v.engineCapacity !== undefined && v.engineCapacity !== null ? String(v.engineCapacity) : '',
      chassisNumber: v.chassisNumber || '',
      mileage: v.mileage !== undefined && v.mileage !== null ? String(v.mileage) : '',
      color: v.color || '',
      purchasePrice: v.purchasePrice !== undefined && v.purchasePrice !== null ? String(v.purchasePrice) : '',
      transportCost: v.transportCost !== undefined && v.transportCost !== null ? String(v.transportCost) : '',
      repairCost: v.repairCost !== undefined && v.repairCost !== null ? String(v.repairCost) : '',
      detailingCost: v.detailingCost !== undefined && v.detailingCost !== null ? String(v.detailingCost) : '',
      sellingPrice: v.sellingPrice !== undefined && v.sellingPrice !== null ? String(v.sellingPrice) : '',
      minimumSellingPrice: v.minimumSellingPrice !== undefined && v.minimumSellingPrice !== null ? String(v.minimumSellingPrice) : '',
      status: v.status || 'Available',
      images: v.images && v.images.length ? v.images : [],
      mediaAngles: {
        front: v.mediaAngles?.front || '',
        rear: v.mediaAngles?.rear || '',
        left: v.mediaAngles?.left || '',
        right: v.mediaAngles?.right || '',
        interior: v.mediaAngles?.interior || '',
        dashboard: v.mediaAngles?.dashboard || '',
        engine: v.mediaAngles?.engine || '',
        wheels: v.mediaAngles?.wheels || '',
        damageText: (v.mediaAngles?.damage || []).join(', '),
        documentsText: (v.mediaAngles?.documents || []).join(', '),
        view360Url: v.mediaAngles?.view360Url || '',
        videoUrl: v.mediaAngles?.videoUrl || '',
        youtubeUrl: v.mediaAngles?.youtubeUrl || ''
      }
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingVehicle(null);
    if (typeof window !== 'undefined' && (window.location.search.includes('edit=') || window.location.search.includes('id='))) {
      window.history.replaceState({}, '', '/dashboard/vehicles');
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await apiFetch('/vehicles');
        if (res.ok) {
          const data: Vehicle[] = await res.json();
          setVehicles(data);
          setApiError('');

          if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const targetId = params.get('edit') || params.get('id');
            if (targetId) {
              const matched = data.find((x) => x._id === targetId);
              if (matched) {
                handleOpenEditModal(matched);
              } else {
                try {
                  const singleRes = await apiFetch(`/vehicles/${targetId}`);
                  if (singleRes.ok) {
                    const singleData = await singleRes.json();
                    handleOpenEditModal(singleData);
                  }
                } catch {}
              }
            } else if (params.get('new') === '1') {
              handleOpenAddModal();
            }
          }
        } else {
          setApiError('Could not load inventory from the server.');
        }
      } catch {
        setApiError('Cannot connect to the server. Inventory is unavailable.');
      }
    };
    fetchVehicles();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingMediaMsg(`Uploading ${file.name} to Cloudinary...`);
      const isVideo = file.type.startsWith('video/');
      const result = await uploadToCloudinary(file, {
        folder: isVideo ? 'manthusa-tvs/vehicles/videos' : 'manthusa-tvs/vehicles/images',
        resourceType: isVideo ? 'video' : 'image',
      });
      onSuccess(result.secure_url || result.url);
      setVehicleNotification({
        type: 'success',
        message: `${file.name} uploaded to Cloudinary successfully!`,
      });
      setTimeout(() => setVehicleNotification(null), 4000);
    } catch (err: any) {
      setVehicleNotification({
        type: 'error',
        message: err?.message || 'Upload to Cloudinary failed.',
      });
      setTimeout(() => setVehicleNotification(null), 6000);
    } finally {
      setUploadingMediaMsg(null);
      e.target.value = '';
    }
  };

  const handleMultiFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    currentText: string,
    onSuccess: (combinedText: string) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploadingMediaMsg(`Uploading ${files.length} file(s) to Cloudinary...`);
      const results = await uploadMultipleToCloudinary(files, {
        folder: 'manthusa-tvs/vehicles/docs',
      });
      const newUrls = results.map((r) => r.secure_url || r.url);
      const existing = currentText.split(',').map((s) => s.trim()).filter(Boolean);
      const combined = [...existing, ...newUrls].join(', ');
      onSuccess(combined);
      setVehicleNotification({
        type: 'success',
        message: `${files.length} file(s) uploaded to Cloudinary successfully!`,
      });
      setTimeout(() => setVehicleNotification(null), 4000);
    } catch (err: any) {
      setVehicleNotification({
        type: 'error',
        message: err?.message || 'Multiple file upload to Cloudinary failed.',
      });
      setTimeout(() => setVehicleNotification(null), 6000);
    } finally {
      setUploadingMediaMsg(null);
      e.target.value = '';
    }
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
      roundNumber: newVehicle.roundNumber || '',
      category: (newVehicle as any).category || 'Sport Motorcycles',
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
      if (editingVehicle) {
        const res = await apiFetch(`/vehicles/${editingVehicle._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updatedData = await res.json();
          setVehicles((current) => current.map((v) => (v._id === editingVehicle._id ? updatedData : v)));
          handleCloseModal();
          setApiError('');
          return;
        }
        const details = await res.json().catch(() => ({}));
        setApiError(details.message || 'Could not update vehicle. Check required fields and try again.');
        return;
      } else {
        const res = await apiFetch('/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const savedData = await res.json();
          setVehicles([savedData, ...vehicles]);
          handleCloseModal();
          setApiError('');
          return;
        }
        const details = await res.json().catch(() => ({}));
        setApiError(details.message || 'Could not save vehicle. Check required fields and try again.');
        return;
      }
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
      const matchRound = (v as any).roundNumber?.toLowerCase().includes(q);
      if (!matchStock && !matchReg && !matchMake && !matchModel && !matchChassis && !matchRound) return false;
    }
    if (filterMake !== 'ALL' && v.make !== filterMake) return false;
    if (!isWithinDateRange(v.createdAt || (v as any).year, startDate, endDate)) return false;
    return true;
  });

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  const getVehiclePreviewImage = (vehicle: Vehicle) => (
    vehicle.images?.find((image) => typeof image === 'string' && image.trim()) ||
    vehicle.mediaAngles?.front ||
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
  );

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

  const [qrModalData, setQrModalData] = useState<{ qrDataUrl: string; barcodeSvg: string; vin: string; stockNumber: string; make: string; model: string; price: number } | null>(null);

  const handleShowQrCode = async (vehicle: Vehicle) => {
    try {
      const [qrRes, barcodeRes] = await Promise.all([
        apiFetch(`/vehicles/${vehicle._id}/qr-code`),
        apiFetch(`/vehicles/${vehicle._id}/barcode`)
      ]);
      const qrData = await qrRes.json();
      const barcodeData = await barcodeRes.json();
      setQrModalData({
        qrDataUrl: qrData.qrDataUrl,
        barcodeSvg: barcodeData.barcodeSvg,
        vin: vehicle.chassisNumber || vehicle.stockNumber,
        stockNumber: vehicle.stockNumber,
        make: vehicle.make,
        model: vehicle.model,
        price: vehicle.sellingPrice
      });
    } catch {
      alert('Could not generate vehicle QR/Barcode tag.');
    }
  };

  return (
    <DashboardLayout>
      {/* Vehicle Notification Toast */}
      {vehicleNotification && (
        <div
          role="alert"
          className={`mb-4 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm transition-all ${
            vehicleNotification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {vehicleNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{vehicleNotification.message}</span>
          </div>
          <button onClick={() => setVehicleNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">TVS Motorcycle Inventory & Stock Master</h1>
          <p className="text-xs text-slate-500">
            Real-time TVS motorcycle stock, variants, specifications, branch stock, and media galleries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTVSRequisition(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
            title="Category & Model Wise Stock Count & TVS Requisition Generator"
          >
            <Package className="w-4 h-4" />
            <span>TVS Stock & Requisition List</span>
          </button>
          <button
            onClick={() => {
              const cols = [
                { label: 'Stock #', value: (r: any) => r.stockNumber },
                { label: 'Round #', value: (r: any) => r.roundNumber || '—' },
                { label: 'Make & Model', value: (r: any) => `${r.make} ${r.model} ${r.variant || ''}`.trim() },
                { label: 'Year', value: (r: any) => r.year },
                { label: 'Reg #', value: (r: any) => r.registrationNumber },
                { label: 'Chassis #', value: (r: any) => r.chassisNumber },
                { label: 'Color', value: (r: any) => r.color },
                { label: 'Mileage', value: (r: any) => r.mileage },
                { label: 'Investment (LKR)', value: (r: any) => r.totalInvestment || r.purchasePrice || 0 },
                { label: 'Selling Price (LKR)', value: (r: any) => r.sellingPrice || 0 },
                { label: 'Status', value: (r: any) => r.status }
              ];
              exportPdf('Vehicle Inventory & Stock Master', 'vehicles-inventory.pdf', cols, vehicles);
            }}
            disabled={!vehicles.length}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => {
              const cols = [
                { label: 'Stock #', value: (r: any) => r.stockNumber },
                { label: 'Round #', value: (r: any) => r.roundNumber || '—' },
                { label: 'Make & Model', value: (r: any) => `${r.make} ${r.model} ${r.variant || ''}`.trim() },
                { label: 'Year', value: (r: any) => r.year },
                { label: 'Reg #', value: (r: any) => r.registrationNumber },
                { label: 'Chassis #', value: (r: any) => r.chassisNumber },
                { label: 'Color', value: (r: any) => r.color },
                { label: 'Mileage', value: (r: any) => r.mileage },
                { label: 'Investment (LKR)', value: (r: any) => r.totalInvestment || r.purchasePrice || 0 },
                { label: 'Selling Price (LKR)', value: (r: any) => r.sellingPrice || 0 },
                { label: 'Status', value: (r: any) => r.status }
              ];
              exportExcel('vehicles-inventory.xlsx', cols, vehicles);
            }}
            disabled={!vehicles.length}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add TVS Motorcycle</span>
          </button>
        </div>
      </div>

      {apiError && (
        <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700">
          {apiError}
        </div>
      )}

      {/* Filter Bar with Search and Date Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search make, model, stock #, round #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-400"
              />
            </div>

            {/* Date Filter Option attached to Search */}
            <DateFilterControl
              startDate={startDate}
              endDate={endDate}
              onDateChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              label="Date Filter:"
            />
          </div>

          <div className="flex flex-nowrap items-center gap-1 w-full lg:w-auto text-[11px] font-semibold">
            {['ALL', 'AVAILABLE', 'RESERVED', 'SOLD', 'UNDER INSPECTION'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-1.5 rounded-lg border transition-colors shrink-0 whitespace-nowrap ${
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
                <th className="py-3 px-4">Stock & Round #</th>
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
                  <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getVehiclePreviewImage(v)}
                        alt={`${v.make} ${v.model}`}
                        className="w-14 h-11 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                      />
                      <span className={v.stockNumber ? '' : 'text-slate-400 italic font-sans text-[11px]'}>
                        {v.stockNumber || 'Stock # Pending'}
                      </span>
                    </div>
                    {(v as any).roundNumber && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-sans text-[10px] font-bold">
                        Round #{(v as any).roundNumber}
                      </span>
                    )}
                  </td>
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
                      <button onClick={() => handleOpenEditModal(v)} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50">Edit</button>
                      <button onClick={() => setDeletingVehicle(v)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">Delete</button>
                    </div>
                    <div className="mt-2 flex justify-center">
                      <button
                        onClick={() => { setAssignPlateVehicle(v); setAssignPlateValue(v.registrationNumber || ''); }}
                        className="rounded-lg border border-indigo-200 px-3 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50 flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3" />
                        <span>Assign Plate</span>
                      </button>
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
                <h3 className="text-base font-extrabold text-slate-900">
                  {editingVehicle ? `Edit Vehicle (${editingVehicle.make} ${editingVehicle.model})` : 'Add Vehicle to Showroom Stock'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingVehicle ? 'Update vehicle specifications, cost sheet breakdown and media assets' : 'Enter vehicle specifications, cost sheet breakdown and media assets'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="font-bold text-slate-900 border-b pb-1">1. TVS Motorcycle Identification</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand / Make</label>
                  <input
                    type="text"
                    required
                    placeholder="TVS"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apache RTR 160 4V / NTORQ 125 / Jupiter 125"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 font-bold"
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
              </div>

              {/* Row 1: Engine Number + Chassis Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Engine Number</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={newVehicle.stockNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, stockNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chassis Number</label>
                  <input
                    type="text"
                    placeholder="e.g. NZE161-1234567"
                    value={newVehicle.chassisNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, chassisNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Row 2: Round Number + Mileage + Engine Capacity */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Round Number <span className="text-[10px] text-indigo-600 font-bold">(Round No)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RND-042 / Round 12"
                    value={newVehicle.roundNumber}
                    onChange={(e) => setNewVehicle({ ...newVehicle, roundNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-indigo-200 rounded-lg placeholder:text-slate-400 font-mono text-[11px] focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Engine Capacity (cc)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={newVehicle.engineCapacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, engineCapacity: e.target.value })}
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
                      onChange={(e) => setNewVehicle({ ...newVehicle, images: [e.target.value, ...newVehicle.images.slice(1)] })}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shrink-0 text-xs shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setNewVehicle({ ...newVehicle, images: [url, ...newVehicle.images.slice(1)] }))}
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

                {/* Cockpit & Mechanical Angles */}
                <div className="font-semibold text-slate-700 pt-1">Console & Mechanical Angles</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['interior', 'Handlebars & Controls'],
                    ['dashboard', 'Digital Speedometer / Console'],
                    ['engine', 'Engine Block & Exhaust'],
                    ['wheels', 'Alloy Wheels & Disc Brakes'],
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
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition-colors"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Save Vehicle to Inventory'}
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
                <p className="text-xs text-slate-500 font-mono">
                  Stock #: {selectedVehicle.stockNumber || 'Pending'} | Reg #: {selectedVehicle.registrationNumber || 'Not assigned'}
                </p>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-56 rounded-xl overflow-hidden mb-4 border border-slate-200 bg-slate-950">
              <img
                src={getVehiclePreviewImage(selectedVehicle)}
                alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold">
                {selectedVehicle.images?.length || selectedVehicle.mediaAngles?.front ? 'Main Showroom Image' : 'Preview Image'}
              </div>
            </div>

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
                <div><span className="text-slate-500 block">Round #:</span> <span className="font-mono text-[11px] font-bold text-indigo-700">{selectedVehicle.roundNumber || '—'}</span></div>
                <div><span className="text-slate-500 block">Engine #:</span> <span className="font-mono text-[11px] font-bold text-amber-800">{(selectedVehicle as any).engineNumber || '—'}</span></div>
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

            <div className="mt-4 pt-3 border-t flex items-center justify-between">
              <button
                onClick={() => handleShowQrCode(selectedVehicle)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <span>🏷️ Generate QR & Barcode Tag</span>
              </button>
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

      {qrModalData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center text-slate-900">
            <h3 className="text-base font-extrabold mb-1">Vehicle Showroom Stock Tag</h3>
            <p className="text-xs text-slate-500 mb-4">{qrModalData.make} {qrModalData.model} • Stock #{qrModalData.stockNumber}</p>
            <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl bg-slate-50 mb-4 space-y-3">
              <div className="font-extrabold text-sm text-slate-900 font-mono">VIN: {qrModalData.vin}</div>
              <div className="text-xs font-bold text-emerald-600">LKR {(qrModalData.price || 0).toLocaleString('en-LK')}</div>
              <div className="flex justify-center my-2">
                <img src={qrModalData.qrDataUrl} alt="QR Code" className="w-36 h-36 border p-1 bg-white rounded-lg shadow-xs" />
              </div>
              <div className="flex justify-center overflow-hidden" dangerouslySetInnerHTML={{ __html: qrModalData.barcodeSvg }} />
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => window.print()} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg">Print Tag / Sticker</button>
              <button onClick={() => setQrModalData(null)} className="px-4 py-2 border text-slate-600 font-semibold text-xs rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}
      {deletingVehicle && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 className="text-lg font-bold">Delete {deletingVehicle.make} {deletingVehicle.model}?</h2><p className="mt-2 text-sm text-slate-600">This removes the vehicle from inventory and cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><button onClick={() => setDeletingVehicle(null)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button><button onClick={deleteVehicle} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Delete vehicle</button></div></section></div>}

      {/* TVS Stock Requisition Modal */}
      <TVSStockRequisitionPlanner
        vehicles={vehicles}
        isOpen={showTVSRequisition}
        onClose={() => setShowTVSRequisition(false)}
      />

      {/* Assign Number Plate Modal */}
      {assignPlateVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[65] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-900">Assign Number Plate</h3>
              </div>
              <button onClick={() => setAssignPlateVehicle(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4 text-xs">
              <div className="font-bold text-slate-900">{assignPlateVehicle.make} {assignPlateVehicle.model} {assignPlateVehicle.variant}</div>
              <div className="text-slate-500 mt-0.5">Chassis: <span className="font-mono font-semibold text-slate-700">{assignPlateVehicle.chassisNumber}</span></div>
              <div className="text-slate-500 mt-0.5">Stock #: <span className="font-mono font-semibold text-slate-700">{assignPlateVehicle.stockNumber}</span></div>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Number Plate (Registration No.)</label>
                <input
                  type="text"
                  placeholder="e.g. ABC-1234"
                  value={assignPlateValue}
                  onChange={(e) => setAssignPlateValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAssignPlateVehicle(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={assignPlateLoading || !assignPlateValue.trim()}
                  onClick={async () => {
                    if (!assignPlateVehicle || !assignPlateValue.trim()) return;
                    setAssignPlateLoading(true);
                    try {
                      const res = await apiFetch(`/vehicles/${assignPlateVehicle._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ registrationNumber: assignPlateValue.trim() })
                      });
                      if (res.ok) {
                        const updated = await res.json();
                        setVehicles((current) => current.map((v) => v._id === assignPlateVehicle._id ? { ...v, registrationNumber: assignPlateValue.trim() } : v));
                        setAssignPlateVehicle(null);
                        setAssignPlateValue('');
                        setVehicleNotification({ type: 'success', message: '✅ Number plate assigned and customer SMS sent!' });
                        setTimeout(() => setVehicleNotification(null), 4000);
                      } else {
                        const err = await res.json().catch(() => ({}));
                        setVehicleNotification({ type: 'error', message: err.message || 'Could not assign number plate.' });
                        setTimeout(() => setVehicleNotification(null), 5000);
                        setAssignPlateVehicle(null);
                      }
                    } catch {
                      setVehicleNotification({ type: 'error', message: 'Network error. Could not assign plate.' });
                      setTimeout(() => setVehicleNotification(null), 5000);
                      setAssignPlateVehicle(null);
                    } finally {
                      setAssignPlateLoading(false);
                    }
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>{assignPlateLoading ? 'Assigning...' : 'Assign & Notify Customer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
