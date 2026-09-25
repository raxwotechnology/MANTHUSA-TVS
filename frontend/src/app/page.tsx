"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  BookmarkCheck,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { getApiUrl } from '@/lib/api';

export default function PublicVehicleWebsite() {
  const [vehicles] = useState([
    {
      id: '1',
      make: 'Toyota',
      model: 'Premio',
      variant: 'F EX Package',
      year: 2019,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      mileage: '45,000 km',
      color: 'Pearl White',
      price: 13500000,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
      status: 'Available'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Vezel',
      variant: 'Z Sensing',
      year: 2018,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      mileage: '58,000 km',
      color: 'Black Metallic',
      price: 10800000,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000',
      status: 'Available'
    },
    {
      id: '3',
      make: 'Mercedes-Benz',
      model: 'C-Class',
      variant: 'C200 AMG Line',
      year: 2021,
      fuelType: 'Petrol',
      transmission: 'Automatic 9G-Tronic',
      mileage: '28,000 km',
      color: 'Obsidian Black',
      price: 28500000,
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000',
      status: 'Reserved'
    },
    {
      id: '4',
      make: 'Toyota',
      model: 'Raize',
      variant: 'Z Turbo',
      year: 2020,
      fuelType: 'Petrol',
      transmission: 'CVT',
      mileage: '32,000 km',
      color: 'Turquoise Black',
      price: 9400000,
      image: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?q=80&w=1000',
      status: 'Available'
    }
  ]);

  const [selectedMake, setSelectedMake] = useState('ALL');
  const [selectedFuel, setSelectedFuel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [tradeInSuccess, setTradeInSuccess] = useState(false);

  const [tradeInForm, setTradeInForm] = useState({
    name: '',
    phone: '',
    make: 'Toyota',
    model: '',
    year: 2018,
    mileage: 60000,
    askingPrice: ''
  });

  const handleTradeInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(getApiUrl('/vehicle-valuations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valuationId: `VAL-${Math.floor(100 + Math.random() * 900)}`,
          customerName: tradeInForm.name,
          customerPhone: tradeInForm.phone,
          vehicleMake: tradeInForm.make,
          vehicleModel: tradeInForm.model,
          year: tradeInForm.year,
          mileage: tradeInForm.mileage,
          askingPrice: parseFloat(tradeInForm.askingPrice) || 0,
          status: 'Pending'
        })
      });
    } catch (err) {}

    setTradeInSuccess(true);
    setTimeout(() => {
      setTradeInSuccess(false);
      setShowTradeInModal(false);
    }, 2500);
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedMake !== 'ALL' && v.make !== selectedMake) return false;
    if (selectedFuel !== 'ALL' && v.fuelType !== selectedFuel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = `${v.make} ${v.model} ${v.variant}`.toLowerCase().includes(q);
      if (!matchName) return false;
    }
    return true;
  });

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="h-20 bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-900/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight">
              Sales<span className="text-emerald-400">Plus</span> Vehicles
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Premium Dealership Sri Lanka</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#vehicles" className="hover:text-emerald-400 transition-colors">Browse Stock</a>
          <button onClick={() => setShowTradeInModal(true)} className="hover:text-emerald-400 transition-colors">Sell Your Vehicle</button>
          <a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTradeInModal(true)}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Sell / Trade-in</span>
          </button>

          <Link
            href="/login"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all"
          >
            <span>Staff Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4 md:px-8 max-w-7xl mx-auto w-full text-center">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-4 inline-block">
          Trusted Dealership Network • Colombo & Regional Branches
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
          Find Your Perfect Certified Vehicle with Confidence
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto mb-8">
          Explore inspected Toyota, Honda, Mercedes-Benz & Nissan vehicles with flexible leasing finance, verified documentation & 360° warranties.
        </p>

        {/* Filter Card */}
        <div className="bg-[#131F3F] p-4 rounded-2xl border border-slate-800 shadow-2xl max-w-4xl mx-auto text-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B132B] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="bg-[#0B132B] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="ALL">All Makes</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
          </select>

          <select
            value={selectedFuel}
            onChange={(e) => setSelectedFuel(e.target.value)}
            className="bg-[#0B132B] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="ALL">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Diesel">Diesel</option>
          </select>

          <button
            onClick={() => {}}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            <span>Search Vehicles</span>
          </button>
        </div>
      </section>

      {/* Vehicle Catalog */}
      <section id="vehicles" className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Available Dealership Inventory</h3>
            <p className="text-xs text-slate-400">All vehicles undergo 120-point mechanical & document verification</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
            {filteredVehicles.length} Vehicles Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div key={v.id} className="bg-[#131F3F] rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all flex flex-col group shadow-xl">
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={v.image}
                  alt={v.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    v.status === 'Available' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {v.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-base mb-1">{v.make} {v.model}</h4>
                  <p className="text-xs text-slate-400 mb-3">{v.variant} • {v.year} • {v.color}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#0B132B] p-2.5 rounded-xl border border-slate-800/80 mb-4 text-slate-300">
                    <div><span className="text-slate-500">Fuel:</span> {v.fuelType}</div>
                    <div><span className="text-slate-500">Gear:</span> {v.transmission}</div>
                    <div><span className="text-slate-500">Mileage:</span> {v.mileage}</div>
                    <div><span className="text-slate-500">Warranty:</span> Verified</div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price</span>
                    <span className="text-xl font-black text-emerald-400">{formatLKR(v.price)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href="https://wa.me/94771234567"
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      onClick={() => alert(`Call Sales Hotline: 011-2345678 to reserve ${v.make} ${v.model}`)}
                      className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Sales</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trade In Modal */}
      {showTradeInModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#131F3F] rounded-2xl max-w-md w-full p-6 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Sell / Trade-in Your Vehicle</h3>
              <button onClick={() => setShowTradeInModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {tradeInSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-white text-base">Request Submitted!</h4>
                <p className="text-xs text-slate-400">Our valuation team will inspect and send purchase offer shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleTradeInSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input type="text" required value={tradeInForm.name} onChange={(e) => setTradeInForm({ ...tradeInForm, name: e.target.value })} className="w-full p-2.5 bg-[#0B132B] border border-slate-700 rounded-xl text-white" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input type="text" required value={tradeInForm.phone} onChange={(e) => setTradeInForm({ ...tradeInForm, phone: e.target.value })} className="w-full p-2.5 bg-[#0B132B] border border-slate-700 rounded-xl text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Make</label>
                    <input type="text" required value={tradeInForm.make} onChange={(e) => setTradeInForm({ ...tradeInForm, make: e.target.value })} className="w-full p-2.5 bg-[#0B132B] border border-slate-700 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Model</label>
                    <input type="text" required value={tradeInForm.model} onChange={(e) => setTradeInForm({ ...tradeInForm, model: e.target.value })} className="w-full p-2.5 bg-[#0B132B] border border-slate-700 rounded-xl text-white" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Asking Price (LKR)</label>
                  <input type="number" required value={tradeInForm.askingPrice} onChange={(e) => setTradeInForm({ ...tradeInForm, askingPrice: e.target.value })} className="w-full p-2.5 bg-[#0B132B] border border-slate-700 rounded-xl text-white font-bold" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowTradeInModal(false)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold">Submit Valuation</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#0B132B] py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Vehicle Sales Management System (VSMS SalesPlus). All rights reserved.</p>
        <p className="mt-1">Head Office: No 45, Baseline Road, Colombo 09 • Hotline: 011-2345678</p>
      </footer>
    </div>
  );
}
