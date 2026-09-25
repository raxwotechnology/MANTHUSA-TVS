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
  X
} from 'lucide-react';

interface Purchase {
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
}

import { getApiUrl } from '@/lib/api';

export default function PurchaseInventoryPage() {
  const [Purchases, setPurchases] = useState<Purchase[]>([
    {
      _id: '1',
      stockNumber: 'STK-2026-001',
      registrationNumber: 'CAB-8912',
      make: 'Toyota',
      model: 'Premio',
      variant: 'F EX Package',
      year: 2019,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      engineCapacity: 1500,
      chassisNumber: 'NZT260-3184920',
      mileage: 45000,
      color: 'Pearl White',
      purchasePrice: 11500000,
      transportCost: 45000,
      repairCost: 85000,
      detailingCost: 25000,
      totalInvestment: 11760000,
      sellingPrice: 13500000,
      minimumSellingPrice: 13200000,
      expectedProfit: 1740000,
      status: 'Available',
      images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000']
    },
    {
      _id: '2',
      stockNumber: 'STK-2026-002',
      registrationNumber: 'CBH-4412',
      make: 'Honda',
      model: 'Vezel',
      variant: 'Z Sensing',
      year: 2018,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      engineCapacity: 1500,
      chassisNumber: 'RU3-1304921',
      mileage: 58000,
      color: 'Black Metallic',
      purchasePrice: 9200000,
      transportCost: 35000,
      repairCost: 120000,
      detailingCost: 30000,
      totalInvestment: 9385000,
      sellingPrice: 10800000,
      minimumSellingPrice: 10500000,
      expectedProfit: 1415000,
      status: 'Available',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000']
    },
    {
      _id: '3',
      stockNumber: 'STK-2026-003',
      registrationNumber: 'CBA-1102',
      make: 'Mercedes-Benz',
      model: 'C-Class',
      variant: 'C200 AMG Line',
      year: 2021,
      fuelType: 'Petrol',
      transmission: 'Automatic 9G-Tronic',
      engineCapacity: 1500,
      chassisNumber: 'WDD2050772R1829',
      mileage: 28000,
      color: 'Obsidian Black',
      purchasePrice: 24000000,
      transportCost: 0,
      repairCost: 150000,
      detailingCost: 50000,
      totalInvestment: 24200000,
      sellingPrice: 28500000,
      minimumSellingPrice: 28000000,
      expectedProfit: 4300000,
      status: 'Reserved',
      images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000']
    },
    {
      _id: '4',
      stockNumber: 'STK-2026-004',
      registrationNumber: 'WP KY-8899',
      make: 'Nissan',
      model: 'X-Trail',
      variant: '20X Hybrid',
      year: 2017,
      fuelType: 'Hybrid',
      transmission: 'CVT',
      engineCapacity: 2000,
      chassisNumber: 'HNT32-029481',
      mileage: 72000,
      color: 'Red Metallic',
      purchasePrice: 8500000,
      transportCost: 0,
      repairCost: 200000,
      detailingCost: 0,
      totalInvestment: 8700000,
      sellingPrice: 9950000,
      minimumSellingPrice: 9800000,
      expectedProfit: 1250000,
      status: 'Sold',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000']
    }
  ]);

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMake, setFilterMake] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  // Form State
  const [newPurchase, setNewPurchase] = useState({
    stockNumber: `STK-2026-00${Purchases.length + 1}`,
    registrationNumber: '',
    make: 'Toyota',
    model: '',
    variant: '',
    year: 2020,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engineCapacity: 1500,
    chassisNumber: '',
    mileage: 30000,
    color: 'White',
    purchasePrice: 10000000,
    transportCost: 30000,
    repairCost: 50000,
    detailingCost: 20000,
    sellingPrice: 12000000,
    minimumSellingPrice: 11800000,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000']
  });

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(getApiUrl('/Purchases'));
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setPurchases(data);
        }
      } catch (err) {
        console.error('Failed to fetch Purchases', err);
      }
    };
    fetchPurchases();
  }, []);

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const purchasePrice = parseFloat(newPurchase.purchasePrice as any) || 0;
    const transportCost = parseFloat(newPurchase.transportCost as any) || 0;
    const repairCost = parseFloat(newPurchase.repairCost as any) || 0;
    const detailingCost = parseFloat(newPurchase.detailingCost as any) || 0;
    const totalInvestment = purchasePrice + transportCost + repairCost + detailingCost;
    const sellingPrice = parseFloat(newPurchase.sellingPrice as any) || 0;
    const expectedProfit = sellingPrice - totalInvestment;

    const item: Purchase = {
      _id: Date.now().toString(),
      stockNumber: newPurchase.stockNumber,
      registrationNumber: newPurchase.registrationNumber || 'UNREGISTERED',
      make: newPurchase.make,
      model: newPurchase.model,
      variant: newPurchase.variant,
      year: Number(newPurchase.year),
      fuelType: newPurchase.fuelType,
      transmission: newPurchase.transmission,
      engineCapacity: Number(newPurchase.engineCapacity),
      chassisNumber: newPurchase.chassisNumber || 'CHASSIS-' + Math.floor(100000 + Math.random() * 900000),
      mileage: Number(newPurchase.mileage),
      color: newPurchase.color,
      purchasePrice,
      transportCost,
      repairCost,
      detailingCost,
      totalInvestment,
      sellingPrice,
      minimumSellingPrice: parseFloat(newPurchase.minimumSellingPrice as any) || sellingPrice,
      expectedProfit,
      status: newPurchase.status,
      images: newPurchase.images
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...payload } = item;
      const res = await fetch(getApiUrl('/Purchases'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedData = await res.json();
        setPurchases([savedData, ...Purchases]);
        setShowAddModal(false);
        return;
      }
    } catch (err) {
      console.log('Post Purchase fallback');
    }

    setPurchases([item, ...Purchases]);
    setShowAddModal(false);
  };

  const filteredPurchases = Purchases.filter((v) => {
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

  return (
    <DashboardLayout>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Purchase Inventory Management</h1>
          <p className="text-xs text-slate-500">View stock status, cost sheets, specs, and Purchase details</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Purchase</span>
        </button>
      </div>

      {/* Stats Summary & Tab Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4 border-b pb-4 text-xs font-semibold">
          {['ALL', 'Available', 'Reserved', 'Sold', 'Under Inspection'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Stock' : tab}
            </button>
          ))}
        </div>

        {/* Toolbar Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search make, model, chassis, reg #, stock #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filterMake}
            onChange={(e) => setFilterMake(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Makes (Toyota, Honda...)</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Nissan">Nissan</option>
          </select>

          <div className="text-xs text-slate-500 flex items-center justify-end font-medium">
            Showing {filteredPurchases.length} of {Purchases.length} Purchases
          </div>
        </div>
      </div>

      {/* Purchase Inventory Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Stock #</th>
                <th className="py-3 px-4">Purchase Details</th>
                <th className="py-3 px-4">Reg #</th>
                <th className="py-3 px-4">Fuel / Transmission</th>
                <th className="py-3 px-4">Cost Investment</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Expected Profit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{v.stockNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{v.make} {v.model}</div>
                    <div className="text-[11px] text-slate-500">{v.variant} • {v.year} • {v.color}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{v.registrationNumber}</td>
                  <td className="py-3 px-4 text-slate-600">{v.fuelType} / {v.transmission}</td>
                  <td className="py-3 px-4 font-medium text-slate-700">{formatLKR(v.totalInvestment || v.purchasePrice)}</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-600">{formatLKR(v.sellingPrice)}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{formatLKR(v.expectedProfit || (v.sellingPrice - v.totalInvestment))}</td>
                  <td className="py-3 px-4">{getStatusBadge(v.status)}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedPurchase(v)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold rounded-lg border border-slate-200 text-[11px] transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Purchase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Purchase to Inventory</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPurchase} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make</label>
                  <input
                    type="text"
                    required
                    value={newPurchase.make}
                    onChange={(e) => setNewPurchase({ ...newPurchase, make: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Premio / Vezel / Grace"
                    value={newPurchase.model}
                    onChange={(e) => setNewPurchase({ ...newPurchase, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Variant / Grade</label>
                  <input
                    type="text"
                    placeholder="e.g. F EX Package"
                    value={newPurchase.variant}
                    onChange={(e) => setNewPurchase({ ...newPurchase, variant: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturing Year</label>
                  <input
                    type="number"
                    value={newPurchase.year}
                    onChange={(e) => setNewPurchase({ ...newPurchase, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="CAB-8912"
                    value={newPurchase.registrationNumber}
                    onChange={(e) => setNewPurchase({ ...newPurchase, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={newPurchase.fuelType}
                    onChange={(e) => setNewPurchase({ ...newPurchase, fuelType: e.target.value })}
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
                    value={newPurchase.transmission}
                    onChange={(e) => setNewPurchase({ ...newPurchase, transmission: e.target.value })}
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
                    value={newPurchase.color}
                    onChange={(e) => setNewPurchase({ ...newPurchase, color: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="border-t pt-3 font-bold text-slate-900">Financial Cost Breakdown</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Purchase Price</label>
                  <input
                    type="number"
                    required
                    value={newPurchase.purchasePrice}
                    onChange={(e) => setNewPurchase({ ...newPurchase, purchasePrice: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transport Cost</label>
                  <input
                    type="number"
                    value={newPurchase.transportCost}
                    onChange={(e) => setNewPurchase({ ...newPurchase, transportCost: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Repair Cost</label>
                  <input
                    type="number"
                    value={newPurchase.repairCost}
                    onChange={(e) => setNewPurchase({ ...newPurchase, repairCost: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detailing Cost</label>
                  <input
                    type="number"
                    value={newPurchase.detailingCost}
                    onChange={(e) => setNewPurchase({ ...newPurchase, detailingCost: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Selling Price (LKR)</label>
                  <input
                    type="number"
                    required
                    value={newPurchase.sellingPrice}
                    onChange={(e) => setNewPurchase({ ...newPurchase, sellingPrice: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg font-extrabold text-emerald-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-emerald-900 mb-1">Min Selling Price</label>
                  <input
                    type="number"
                    value={newPurchase.minimumSellingPrice}
                    onChange={(e) => setNewPurchase({ ...newPurchase, minimumSellingPrice: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg font-bold text-slate-800"
                  />
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
                  Save Purchase to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Purchase Details Modal */}
      {selectedPurchase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selectedPurchase.make} {selectedPurchase.model} ({selectedPurchase.year})
                </h3>
                <p className="text-xs text-slate-500 font-mono">Stock #: {selectedPurchase.stockNumber} | Reg #: {selectedPurchase.registrationNumber}</p>
              </div>
              <button onClick={() => setSelectedPurchase(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedPurchase.images && selectedPurchase.images[0] && (
              <img
                src={selectedPurchase.images[0]}
                alt="Purchase"
                className="w-full h-48 object-cover rounded-xl mb-4 border border-slate-200"
              />
            )}

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl">
                <div><span className="text-slate-500 block">Fuel:</span> <span className="font-bold">{selectedPurchase.fuelType}</span></div>
                <div><span className="text-slate-500 block">Transmission:</span> <span className="font-bold">{selectedPurchase.transmission}</span></div>
                <div><span className="text-slate-500 block">Color:</span> <span className="font-bold">{selectedPurchase.color}</span></div>
                <div><span className="text-slate-500 block">Mileage:</span> <span className="font-bold">{selectedPurchase.mileage.toLocaleString()} km</span></div>
                <div><span className="text-slate-500 block">Chassis #:</span> <span className="font-mono text-[11px]">{selectedPurchase.chassisNumber}</span></div>
                <div><span className="text-slate-500 block">Status:</span> {getStatusBadge(selectedPurchase.status)}</div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 mb-2 border-b pb-1">Cost Sheet Breakdown</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span>Purchase Price:</span> <span className="font-medium">{formatLKR(selectedPurchase.purchasePrice)}</span></div>
                  <div className="flex justify-between"><span>Transport Cost:</span> <span className="font-medium">{formatLKR(selectedPurchase.transportCost)}</span></div>
                  <div className="flex justify-between"><span>Repair Cost:</span> <span className="font-medium">{formatLKR(selectedPurchase.repairCost)}</span></div>
                  <div className="flex justify-between"><span>Detailing Cost:</span> <span className="font-medium">{formatLKR(selectedPurchase.detailingCost)}</span></div>
                  <div className="flex justify-between font-bold border-t pt-1"><span>Total Investment:</span> <span className="text-slate-900">{formatLKR(selectedPurchase.totalInvestment)}</span></div>
                  <div className="flex justify-between font-bold text-sm text-emerald-600 border-t pt-1"><span>Selling Price:</span> <span>{formatLKR(selectedPurchase.sellingPrice)}</span></div>
                  <div className="flex justify-between font-bold text-blue-600"><span>Expected Profit:</span> <span>{formatLKR(selectedPurchase.expectedProfit)}</span></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}


