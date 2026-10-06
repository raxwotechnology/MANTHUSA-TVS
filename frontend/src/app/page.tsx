"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingUp,
  X,
  Heart,
  Calculator,
  Star,
  SlidersHorizontal,
  Eye,
  ChevronRight,
  ChevronDown,
  Check,
  Sparkles,
  MapPin,
  Clock,
  Award,
  Zap,
  Share2,
  AlertCircle,
  RefreshCw,
  BadgeCheck,
  FileText
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

// Certified dealership showcase fallback data
const SHOWCASE_VEHICLES = [
  {
    id: 'demo-prado-01',
    _id: 'demo-prado-01',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    variant: 'TX-L 7-Seater 4WD',
    year: 2022,
    manufacturingYear: 2022,
    registeredYear: 2023,
    color: 'Pearl White',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    driveType: '4WD',
    engineCapacity: '2800cc GD Turbo',
    mileage: '24,500 km',
    sellingPrice: 42500000,
    price: 42500000,
    status: 'Available',
    condition: 'Reconditioned Certified',
    vehicleType: 'SUV',
    image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Sunroof', 'Leather Electric Seats', 'Surround 360 Camera', 'Radar Safety Sense', 'Cool Box'],
    warranty: '1-Year Powertrain & Battery',
    isFeatured: true,
    inspectionScore: '99/100'
  },
  {
    id: 'demo-merc-02',
    _id: 'demo-merc-02',
    make: 'Mercedes-Benz',
    model: 'C200',
    variant: 'AMG Line Premium Plus',
    year: 2023,
    manufacturingYear: 2023,
    registeredYear: 2023,
    color: 'Obsidian Black Metallic',
    fuelType: 'Petrol Mild-Hybrid',
    transmission: 'Automatic 9G-Tronic',
    driveType: 'RWD',
    engineCapacity: '1500cc Turbo EQ Boost',
    mileage: '12,000 km',
    sellingPrice: 38800000,
    price: 38800000,
    status: 'Available',
    condition: 'Direct Import Brand New',
    vehicleType: 'Sedan',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Burmester 3D Sound', 'Panoramic Glass Roof', 'Digital Light HUD', 'Wireless Apple CarPlay'],
    warranty: '2-Year Dealership Certified',
    isFeatured: true,
    inspectionScore: '100/100'
  },
  {
    id: 'demo-vezel-03',
    _id: 'demo-vezel-03',
    make: 'Honda',
    model: 'Vezel e:HEV',
    variant: 'Play Package Dual Tone',
    year: 2022,
    manufacturingYear: 2022,
    registeredYear: 2022,
    color: 'Sand Khaki Pearl & Black',
    fuelType: 'Hybrid',
    transmission: 'e-CVT Automatic',
    driveType: '2WD',
    engineCapacity: '1500cc Dual Motor e:HEV',
    mileage: '18,200 km',
    sellingPrice: 16800000,
    price: 16800000,
    status: 'Available',
    condition: 'Registered 1st Owner',
    vehicleType: 'Crossover',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Honda SENSING Radar', 'Handsfree Power Tailgate', 'Panoramic Fixed Roof', 'Multi-View Camera'],
    warranty: '1-Year Hybrid Battery Warranty',
    isFeatured: true,
    inspectionScore: '98/100'
  },
  {
    id: 'demo-bmw-04',
    _id: 'demo-bmw-04',
    make: 'BMW',
    model: '520d',
    variant: 'M Sport LCI Edition',
    year: 2021,
    manufacturingYear: 2021,
    registeredYear: 2022,
    color: 'Phytonic Blue Metallic',
    fuelType: 'Diesel Mild-Hybrid',
    transmission: 'Steptronic Sport 8-Speed',
    driveType: 'RWD',
    engineCapacity: '2000cc TwinPower Turbo',
    mileage: '29,400 km',
    sellingPrice: 34500000,
    price: 34500000,
    status: 'Available',
    condition: 'Registered 1st Owner',
    vehicleType: 'Sedan',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Laser Lights', 'Harmon Kardon Audio', 'M Aerodynamics Kit', 'Cognac Dakota Leather'],
    warranty: '1-Year Comprehensive Warranty',
    isFeatured: false,
    inspectionScore: '97/100'
  },
  {
    id: 'demo-audi-05',
    _id: 'demo-audi-05',
    make: 'Audi',
    model: 'A6',
    variant: '40 TFSI S-Line Sport',
    year: 2022,
    manufacturingYear: 2022,
    registeredYear: 2023,
    color: 'Daytona Grey Pearl',
    fuelType: 'Petrol Mild-Hybrid',
    transmission: 'S-Tronic 7-Speed',
    driveType: 'FWD',
    engineCapacity: '2000cc Turbocharged',
    mileage: '15,600 km',
    sellingPrice: 32900000,
    price: 32900000,
    status: 'Available',
    condition: 'Direct Import Reconditioned',
    vehicleType: 'Sedan',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Audi Virtual Cockpit Plus', 'Bang & Olufsen Sound', 'Matrix LED Headlamps', 'Valcona Leather'],
    warranty: '1-Year Powertrain Guarantee',
    isFeatured: false,
    inspectionScore: '98/100'
  },
  {
    id: 'demo-aqua-06',
    _id: 'demo-aqua-06',
    make: 'Toyota',
    model: 'Aqua GR Sport',
    variant: 'X Grade Generation 2',
    year: 2023,
    manufacturingYear: 2023,
    registeredYear: 2024,
    color: 'Emotional Red II',
    fuelType: 'Hybrid',
    transmission: 'CVT Automatic',
    driveType: '2WD',
    engineCapacity: '1500cc Dynamic Force',
    mileage: '8,400 km',
    sellingPrice: 12800000,
    price: 12800000,
    status: 'Available',
    condition: 'Direct Import Unregistered',
    vehicleType: 'Hatchback',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'
    ],
    features: ['Toyota Safety Sense 2.5', '10.5-inch Display Audio', 'Bi-Beam LED Headlights', '33 km/L Fuel Eco'],
    warranty: '2-Year Hybrid System Warranty',
    isFeatured: true,
    inspectionScore: '99/100'
  }
];

export default function PublicVehicleWebsite() {
  const [dbVehicles, setDbVehicles] = useState<any[]>([]);
  const [vehicleLoadError, setVehicleLoadError] = useState('');
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('ALL');
  const [selectedFuel, setSelectedFuel] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriceTier, setSelectedPriceTier] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Interactive engagement states
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [quickViewVehicle, setQuickViewVehicle] = useState<any>(null);

  // Lead / Enquiry modal state
  const [interestVehicle, setInterestVehicle] = useState<any>(null);
  const [interestType, setInterestType] = useState('Details');
  const [interestName, setInterestName] = useState('');
  const [interestPhone, setInterestPhone] = useState('');
  const [interestDate, setInterestDate] = useState('');
  const [interestMessage, setInterestMessage] = useState('');
  const [interestLeaseDetails, setInterestLeaseDetails] = useState('');
  const [interestError, setInterestError] = useState('');
  const [interestSuccess, setInterestSuccess] = useState(false);
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false);

  // Sell / Trade-in modal state
  const [showTradeInModal, setShowTradeInModal] = useState(false);
  const [tradeInSuccess, setTradeInSuccess] = useState(false);
  const [tradeInError, setTradeInError] = useState('');
  const [isSubmittingTradeIn, setIsSubmittingTradeIn] = useState(false);
  const [tradeInForm, setTradeInForm] = useState({
    name: '',
    phone: '',
    make: '',
    model: '',
    year: '2020',
    mileage: '',
    askingPrice: '',
    condition: 'Excellent'
  });

  // Interactive Lease Calculator State
  const [calcPrice, setCalcPrice] = useState<number>(25000000);
  const [calcDownPercent, setCalcDownPercent] = useState<number>(20);
  const [calcTenureYears, setCalcTenureYears] = useState<number>(5);
  const [calcInterestRate, setCalcInterestRate] = useState<number>(13.5);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Load vehicles from backend API
  useEffect(() => {
    setIsLoadingVehicles(true);
    apiFetch('/public/vehicles')
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load vehicles from database.');
        const data = await response.json();
        if (Array.isArray(data)) {
          const formatted = data.map((vehicle: any) => ({
            ...vehicle,
            id: vehicle._id || vehicle.id,
            price: Number(vehicle.sellingPrice || 0),
            image: vehicle.images?.[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
            mileage: vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString()} km` : 'Unregistered',
            condition: vehicle.condition || 'Certified Dealership Stock',
            warranty: '1-Year Certified Warranty'
          }));
          setDbVehicles(formatted);
        }
      })
      .catch((err) => {
        setVehicleLoadError(err instanceof Error ? err.message : 'API offline');
      })
      .finally(() => {
        setIsLoadingVehicles(false);
      });
  }, []);

  // Sync wishlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('salesplus_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleWishlist = (id: string) => {
    let next: string[];
    if (wishlist.includes(id)) {
      next = wishlist.filter((item) => item !== id);
    } else {
      next = [...wishlist, id];
    }
    setWishlist(next);
    try {
      localStorage.setItem('salesplus_wishlist', JSON.stringify(next));
    } catch {}
  };

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((i) => i !== id));
    } else {
      if (compareIds.length < 3) {
        setCompareIds([...compareIds, id]);
      } else {
        alert('You can compare a maximum of 3 vehicles simultaneously.');
      }
    }
  };

  // Combine database vehicles with showcase inventory
  const allVehicles = useMemo(() => {
    if (dbVehicles.length > 0) {
      // If DB has vehicles, merge them with showcase fallback for variety
      const existingIds = new Set(dbVehicles.map(v => v.id));
      const complementShowcase = SHOWCASE_VEHICLES.filter(v => !existingIds.has(v.id));
      return [...dbVehicles, ...complementShowcase];
    }
    return SHOWCASE_VEHICLES;
  }, [dbVehicles]);

  // Unique make list for filter dropdown
  const uniqueMakes = useMemo(() => {
    const set = new Set<string>();
    allVehicles.forEach((v) => {
      if (v.make) set.add(v.make);
    });
    return Array.from(set).sort();
  }, [allVehicles]);

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((v) => {
      // Make filter
      if (selectedMake !== 'ALL' && v.make?.toLowerCase() !== selectedMake.toLowerCase()) return false;
      // Fuel filter
      if (selectedFuel !== 'ALL' && !v.fuelType?.toLowerCase().includes(selectedFuel.toLowerCase())) return false;
      // Category filter
      if (selectedCategory !== 'ALL') {
        const cat = selectedCategory.toLowerCase();
        const vType = (v.vehicleType || '').toLowerCase();
        const modelStr = `${v.make} ${v.model} ${v.variant || ''}`.toLowerCase();
        if (cat === 'suv' && !vType.includes('suv') && !modelStr.includes('prado') && !modelStr.includes('patrol')) return false;
        if (cat === 'sedan' && !vType.includes('sedan') && !modelStr.includes('c200') && !modelStr.includes('520d') && !modelStr.includes('a6') && !modelStr.includes('premio')) return false;
        if (cat === 'hybrid' && !v.fuelType?.toLowerCase().includes('hybrid') && !modelStr.includes('e:hev') && !modelStr.includes('aqua')) return false;
        if (cat === 'luxury' && (v.price || 0) < 30000000) return false;
        if (cat === 'budget' && (v.price || 0) > 20000000) return false;
      }
      // Price Tier filter
      if (selectedPriceTier === 'Under15M' && (v.price || 0) >= 15000000) return false;
      if (selectedPriceTier === '15M-30M' && ((v.price || 0) < 15000000 || (v.price || 0) > 30000000)) return false;
      if (selectedPriceTier === '30M-50M' && ((v.price || 0) < 30000000 || (v.price || 0) > 50000000)) return false;
      if (selectedPriceTier === '50M+' && (v.price || 0) <= 50000000) return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullString = `${v.make} ${v.model} ${v.variant || ''} ${v.year || ''} ${v.color || ''} ${v.fuelType || ''}`.toLowerCase();
        if (!fullString.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'year-desc') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'mileage-asc') {
        const mA = parseInt(String(a.mileage).replace(/\D/g, '')) || 0;
        const mB = parseInt(String(b.mileage).replace(/\D/g, '')) || 0;
        return mA - mB;
      }
      return 0; // default featured
    });
  }, [allVehicles, selectedMake, selectedFuel, selectedCategory, selectedPriceTier, searchQuery, sortBy]);

  // Financial calculations
  const calculateEMI = (principalPrice: number, downPct: number, years: number, annualRate: number) => {
    const downAmount = principalPrice * (downPct / 100);
    const loanAmount = Math.max(0, principalPrice - downAmount);
    const monthlyRate = (annualRate / 100) / 12;
    const months = years * 12;

    if (loanAmount <= 0 || months <= 0) return { emi: 0, downAmount, loanAmount, totalPayable: 0, totalInterest: 0 };
    if (monthlyRate === 0) {
      const emi = Math.round(loanAmount / months);
      return { emi, downAmount, loanAmount, totalPayable: loanAmount, totalInterest: 0 };
    }

    const emi = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
    const totalPayable = emi * months;
    const totalInterest = Math.max(0, totalPayable - loanAmount);

    return { emi, downAmount, loanAmount, totalPayable, totalInterest };
  };

  const currentLoanSummary = useMemo(() => {
    return calculateEMI(calcPrice, calcDownPercent, calcTenureYears, calcInterestRate);
  }, [calcPrice, calcDownPercent, calcTenureYears, calcInterestRate]);

  const formatLKR = (val: number) => {
    return 'LKR ' + (val || 0).toLocaleString('en-LK');
  };

  const getEstMonthlyLease = (carPrice: number) => {
    const { emi } = calculateEMI(carPrice, 25, 5, 13.5);
    return `Est. ${formatLKR(emi)} / mo`;
  };

  // Submit Trade-in / Valuation
  const handleTradeInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTradeIn(true);
    setTradeInError('');
    try {
      const response = await apiFetch('/vehicle-valuations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valuationId: `VAL-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: tradeInForm.name,
          customerPhone: tradeInForm.phone,
          vehicleMake: tradeInForm.make,
          vehicleModel: tradeInForm.model,
          year: parseInt(tradeInForm.year) || 2020,
          mileage: tradeInForm.mileage,
          askingPrice: parseFloat(tradeInForm.askingPrice) || 0,
          notes: `Condition: ${tradeInForm.condition}`,
          status: 'Pending'
        })
      });
      if (!response.ok) throw new Error('Could not submit valuation request. Please verify details.');
      setTradeInSuccess(true);
      setTradeInForm({
        name: '',
        phone: '',
        make: '',
        model: '',
        year: '2020',
        mileage: '',
        askingPrice: '',
        condition: 'Excellent'
      });
    } catch (err) {
      setTradeInError(err instanceof Error ? err.message : 'Server connection failed.');
    } finally {
      setIsSubmittingTradeIn(false);
    }
  };

  // Submit Public Lead / Interest Inquiry
  const submitInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInterest(true);
    setInterestError('');
    try {
      const response = await apiFetch('/leads/public', {
        method: 'POST',
        body: JSON.stringify({
          fullName: interestName,
          phone: interestPhone,
          vehicle: interestVehicle?._id?.startsWith('demo') ? undefined : interestVehicle?._id,
          inquiryType: interestType,
          preferredDate: interestDate || undefined,
          message: interestLeaseDetails
            ? `${interestMessage}\n[Leasing Request Details]: ${interestLeaseDetails}`
            : interestMessage
        })
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Could not send enquiry. Please contact sales directly.');
      }
      setInterestSuccess(true);
    } catch (error) {
      setInterestError(error instanceof Error ? error.message : 'Could not send enquiry.');
    } finally {
      setIsSubmittingInterest(false);
    }
  };

  const handleOpenLeaseInquiry = () => {
    setInterestVehicle({
      make: 'Custom Vehicle Lease',
      model: `Value: ${formatLKR(calcPrice)}`,
      sellingPrice: calcPrice
    });
    setInterestType('Leasing Pre-Approval');
    setInterestLeaseDetails(
      `Price: ${formatLKR(calcPrice)} | Down Payment: ${calcDownPercent}% (${formatLKR(currentLoanSummary.downAmount)}) | Tenure: ${calcTenureYears} Years | Monthly Est: ${formatLKR(currentLoanSummary.emi)}`
    );
    setInterestSuccess(false);
    setInterestError('');
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-[#0B1736] to-emerald-950 border-b border-emerald-500/20 py-2 px-4 text-xs font-medium text-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300 font-bold uppercase tracking-wider text-[11px]">Special Offer:</span>
            <span className="text-slate-300">Fast-Track 24-Hour Leasing Pre-Approval with Commercial Bank, HNB & Sampath Bank</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="tel:0112345678" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">Hotline: 011-2345678</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Colombo • Kandy • Gampaha</span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="h-20 bg-[#0A122A]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-xl tracking-tight">Sales<span className="text-emerald-400">Plus</span></span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Certified</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Automotive Dealership Sri Lanka</p>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#inventory" className="hover:text-emerald-400 transition-colors">Vehicle Inventory</a>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">Leasing Calculator</a>
            <button onClick={() => setShowTradeInModal(true)} className="hover:text-emerald-400 transition-colors">Sell / Trade-in</button>
            <a href="#inspection" className="hover:text-emerald-400 transition-colors">120-Point Guarantee</a>
            <a href="#reviews" className="hover:text-emerald-400 transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Showrooms</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Wishlist button */}
            <button
              onClick={() => setShowWishlistDrawer(true)}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 transition-all hover:scale-105"
              title="Saved Vehicles"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-300'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Compare Counter Pill */}
            {compareIds.length > 0 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="hidden sm:flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-3 py-2 rounded-xl text-xs font-bold hover:bg-cyan-900/60 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Compare ({compareIds.length})</span>
              </button>
            )}

            {/* Sell / Trade-in Button */}
            <button
              onClick={() => setShowTradeInModal(true)}
              className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Instant Valuation</span>
            </button>

            {/* Staff Portal Link */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/40 transition-all hover:shadow-emerald-500/25"
            >
              <span>Staff Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 px-4 md:px-8 border-b border-slate-800/80 bg-radial-gradient">
        {/* Glow ambient background elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto w-full text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sri Lanka&apos;s Most Trusted Certified Vehicle Network</span>
            <span className="text-emerald-500">•</span>
            <span>120-Point Mechanical Inspection</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 max-w-4xl mx-auto leading-tight sm:leading-none">
            Find Your Dream Car with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Complete Trust & Certified Quality
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse inspected Japanese & European luxury sedans, family SUVs, and eco hybrids.
            Enjoy same-day leasing pre-approval, verified RMV documentation, and 1-year powertrain guarantees.
          </p>

          {/* Quick Value Metrics Pill Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-left">
            <div className="bg-[#0D1836]/90 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">120-Point Checked</p>
                <p className="text-[11px] text-slate-400">Mechanical & chassis</p>
              </div>
            </div>

            <div className="bg-[#0D1836]/90 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">24h Lease Approval</p>
                <p className="text-[11px] text-slate-400">Major banks at 13.5%</p>
              </div>
            </div>

            <div className="bg-[#0D1836]/90 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">1-Year Warranty</p>
                <p className="text-[11px] text-slate-400">Engine & gearbox</p>
              </div>
            </div>

            <div className="bg-[#0D1836]/90 border border-slate-800/90 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Fair Trade-Ins</p>
                <p className="text-[11px] text-slate-400">Instant market valuations</p>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Criteria Search Card */}
          <div className="bg-[#0F1B3E] p-4 sm:p-5 rounded-3xl border border-slate-700/80 shadow-2xl shadow-black/60 max-w-5xl mx-auto text-xs text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
              {/* Search keyword input */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Make, Model, or Variant (e.g. Prado, C200)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-medium transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Brand / Make Filter */}
              <div>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-2xl px-3.5 py-3 text-white focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer text-xs"
                >
                  <option value="ALL">All Brands & Makes</option>
                  {uniqueMakes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-2xl px-3.5 py-3 text-white focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer text-xs"
                >
                  <option value="ALL">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Hybrid">Hybrid / e:HEV</option>
                  <option value="Diesel">Diesel Turbo</option>
                  <option value="Electric">Pure Electric (EV)</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <select
                  value={selectedPriceTier}
                  onChange={(e) => setSelectedPriceTier(e.target.value)}
                  className="w-full bg-[#070D1E] border border-slate-700/80 rounded-2xl px-3.5 py-3 text-white focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer text-xs"
                >
                  <option value="ALL">All Price Ranges</option>
                  <option value="Under15M">Under LKR 15M</option>
                  <option value="15M-30M">LKR 15M - 30M</option>
                  <option value="30M-50M">LKR 30M - 50M</option>
                  <option value="50M+">Above LKR 50M</option>
                </select>
              </div>
            </div>

            {/* Quick Category Chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Select:</span>
                {[
                  { id: 'ALL', label: 'All Stock' },
                  { id: 'SUV', label: '🚙 Premium SUVs' },
                  { id: 'Sedan', label: '🏎️ Luxury Sedans' },
                  { id: 'Hybrid', label: '⚡ Eco Hybrids' },
                  { id: 'Luxury', label: '👑 Luxury 30M+' },
                  { id: 'Budget', label: '🏷️ Under 20M' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-[#070D1E] text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Reset Filters button if any active */}
              {(selectedMake !== 'ALL' || selectedFuel !== 'ALL' || selectedCategory !== 'ALL' || selectedPriceTier !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedMake('ALL');
                    setSelectedFuel('ALL');
                    setSelectedCategory('ALL');
                    setSelectedPriceTier('ALL');
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Inventory Catalog Section */}
      <section id="inventory" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Dealership Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Available Vehicle Showroom Stock
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every vehicle includes comprehensive 120-point mechanical evaluation, clear title records, and full history checks.
            </p>
          </div>

          {/* Controls: Sort and View Mode */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 px-3.5 py-1.5 rounded-xl border border-emerald-800/60 shrink-0">
              {filteredVehicles.length} Vehicles Found
            </span>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0F1B3E] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="featured">Sort: Featured Stock</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="mileage-asc">Lowest Mileage</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex bg-[#0F1B3E] border border-slate-700/80 p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Display Grid or Empty State */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-[#0F1B3E] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Car className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Matching Vehicles Found</h3>
            <p className="text-xs text-slate-400 mb-6">
              We couldn&apos;t find any vehicles matching your current search parameters. Try adjusting your make, fuel, or price filters.
            </p>
            <button
              onClick={() => {
                setSelectedMake('ALL');
                setSelectedFuel('ALL');
                setSelectedCategory('ALL');
                setSelectedPriceTier('ALL');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              Reset Search & View All Vehicles
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((v) => {
              const isWishlisted = wishlist.includes(v.id);
              const isCompared = compareIds.includes(v.id);

              return (
                <div
                  key={v.id}
                  className="bg-[#0D1836] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-emerald-500/50 transition-all duration-300 flex flex-col group shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20"
                >
                  {/* Vehicle Image Header */}
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <img
                      src={v.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'}
                      alt={`${v.make} ${v.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1836] via-transparent to-black/40" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 shadow-md">
                        {v.status || 'Available'}
                      </span>
                      {v.condition && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/60">
                          {v.condition}
                        </span>
                      )}
                    </div>

                    {/* Action Overlay: Wishlist & Quick View */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => toggleWishlist(v.id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                          isWishlisted
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-900/70 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/60'
                        }`}
                        title={isWishlisted ? 'Remove from Saved' : 'Save to Favorites'}
                        aria-label="Toggle Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => setQuickViewVehicle(v)}
                        className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md transition-all"
                        title="Quick View Vehicle Specs"
                        aria-label="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Inspection badge bottom left of image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-500/40 text-[11px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{v.inspectionScore || '120-Pt Pass'}</span>
                    </div>
                  </div>

                  {/* Vehicle Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title & Year */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-extrabold text-white text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
                          {v.make} {v.model}
                        </h3>
                        <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700">
                          {v.year}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 line-clamp-1">
                        {v.variant || 'Standard'} • {v.color || 'Pearl Finish'}
                      </p>

                      {/* Specs Matrix Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#070D1E] p-3 rounded-2xl border border-slate-800/80 mb-5 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">Fuel:</span>
                          <span className="font-semibold text-slate-200 truncate">{v.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">Gear:</span>
                          <span className="font-semibold text-slate-200 truncate">{v.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">Mileage:</span>
                          <span className="font-semibold text-slate-200 truncate">{v.mileage}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium">Engine:</span>
                          <span className="font-semibold text-slate-200 truncate">{v.engineCapacity || 'Standard'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action Hub */}
                    <div>
                      {/* Price Block */}
                      <div className="flex items-end justify-between mb-4 pb-3 border-b border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Cash Deal Price</span>
                          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            {formatLKR(v.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setCalcPrice(v.price || 25000000);
                            const el = document.getElementById('calculator');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-right hover:opacity-80 transition-opacity"
                          title="Calculate customized lease installment"
                        >
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Lease Option</span>
                          <span className="text-xs font-extrabold text-cyan-400 underline decoration-cyan-500/40 underline-offset-2">
                            {getEstMonthlyLease(v.price)}
                          </span>
                        </button>
                      </div>

                      {/* Primary Contact Buttons */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2.5">
                        <a
                          href={`https://wa.me/94771234567?text=${encodeURIComponent(`Hello SalesPlus Team, I am interested in the ${v.make} ${v.model} (${v.year}) priced at ${formatLKR(v.price)}. Please share more details.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-950"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            setInterestVehicle(v);
                            setInterestType('Test Drive');
                            setInterestSuccess(false);
                            setInterestError('');
                          }}
                          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Test Drive</span>
                        </button>
                      </div>

                      {/* Secondary Buttons: Enquire & Compare */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setInterestVehicle(v);
                            setInterestType('Details');
                            setInterestSuccess(false);
                            setInterestError('');
                          }}
                          className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors"
                        >
                          Enquire / Reserve
                        </button>

                        <button
                          onClick={() => toggleCompare(v.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isCompared
                              ? 'bg-cyan-600 border-cyan-500 text-white'
                              : 'border-slate-800 bg-[#070D1E] text-slate-400 hover:text-slate-200'
                          }`}
                          title="Add to comparison table"
                        >
                          {isCompared ? 'Comparing' : '+ Compare'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Mode */
          <div className="space-y-4">
            {filteredVehicles.map((v) => {
              const isWishlisted = wishlist.includes(v.id);
              const isCompared = compareIds.includes(v.id);

              return (
                <div
                  key={v.id}
                  className="bg-[#0D1836] rounded-3xl overflow-hidden border border-slate-800/90 hover:border-emerald-500/40 p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-center justify-between transition-all group"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-center w-full md:w-auto">
                    <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-950">
                      <img
                        src={v.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'}
                        alt={`${v.make} ${v.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
                        {v.status || 'Available'}
                      </span>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h3 className="font-extrabold text-white text-lg">
                          {v.make} {v.model}
                        </h3>
                        <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                          {v.year}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{v.variant} • {v.color} • {v.condition}</p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 pt-1">
                        <span className="bg-[#070D1E] px-2.5 py-1 rounded-lg border border-slate-800">⛽ {v.fuelType}</span>
                        <span className="bg-[#070D1E] px-2.5 py-1 rounded-lg border border-slate-800">⚙️ {v.transmission}</span>
                        <span className="bg-[#070D1E] px-2.5 py-1 rounded-lg border border-slate-800">📍 {v.mileage}</span>
                        <span className="bg-[#070D1E] px-2.5 py-1 rounded-lg border border-slate-800">🛡️ {v.inspectionScore || 'Certified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 shrink-0">
                    <div className="text-center md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Cash Price</span>
                      <span className="text-2xl font-black text-emerald-400">{formatLKR(v.price)}</span>
                      <span className="text-xs text-cyan-400 block font-semibold">{getEstMonthlyLease(v.price)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(v.id)}
                        className={`p-2.5 rounded-xl border transition-all ${
                          isWishlisted
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleCompare(v.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isCompared
                            ? 'bg-cyan-600 border-cyan-500 text-white'
                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isCompared ? 'Comparing' : '+ Compare'}
                      </button>

                      <button
                        onClick={() => {
                          setInterestVehicle(v);
                          setInterestType('Details');
                          setInterestSuccess(false);
                          setInterestError('');
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Monthly Leasing & Loan EMI Calculator Section */}
      <section id="calculator" className="py-16 px-4 md:px-8 border-t border-slate-800/80 bg-[#0A132C]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              <span>Smart Financial Planning</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Interactive Vehicle Leasing & Installment Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Calculate your exact monthly payments instantly with customized down payments, loan periods, and current bank leasing interest rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-[#0F1B3E] p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl">
            {/* Sliders Input Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Vehicle Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">Vehicle Price (LKR)</label>
                  <span className="text-sm font-black text-emerald-400 bg-[#070D1E] px-3 py-1 rounded-xl border border-slate-700">
                    {formatLKR(calcPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={60000000}
                  step={500000}
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>5 Million</span>
                  <span>30 Million</span>
                  <span>60 Million</span>
                </div>
              </div>

              {/* Down Payment Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Down Payment: <span className="text-emerald-400 font-extrabold">{calcDownPercent}%</span>
                  </label>
                  <span className="text-xs font-bold text-slate-300 bg-[#070D1E] px-3 py-1 rounded-xl border border-slate-700">
                    {formatLKR(currentLoanSummary.downAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={calcDownPercent}
                  onChange={(e) => setCalcDownPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>10% (Minimum)</span>
                  <span>30% (Standard)</span>
                  <span>60% (Low EMI)</span>
                </div>
              </div>

              {/* Tenure Period Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Tenure Period: <span className="text-emerald-400 font-extrabold">{calcTenureYears} Years</span> ({calcTenureYears * 12} Months)
                  </label>
                  <span className="text-xs font-bold text-slate-300 bg-[#070D1E] px-3 py-1 rounded-xl border border-slate-700">
                    {calcTenureYears * 12} Installments
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={calcTenureYears}
                  onChange={(e) => setCalcTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 Year</span>
                  <span>3 Years</span>
                  <span>5 Years</span>
                  <span>7 Years</span>
                </div>
              </div>

              {/* Annual Interest Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    Annual Interest Rate: <span className="text-cyan-400 font-extrabold">{calcInterestRate}%</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">Current Market: 12.5% - 15.0%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={18}
                  step={0.5}
                  value={calcInterestRate}
                  onChange={(e) => setCalcInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>10.0%</span>
                  <span>13.5% (Dealership Partner)</span>
                  <span>18.0%</span>
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#070D1E] to-[#0A1838] p-6 rounded-3xl border border-emerald-500/30 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Estimated Monthly Rental</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Official Formula
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 block">
                    {formatLKR(currentLoanSummary.emi)}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Per month for {calcTenureYears * 12} consecutive months
                  </span>
                </div>

                {/* Financial Summary Breakdown */}
                <div className="space-y-2.5 text-xs bg-[#0F1B3E]/80 p-4 rounded-2xl border border-slate-800/90 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Down Payment ({calcDownPercent}%):</span>
                    <span className="font-bold text-white">{formatLKR(currentLoanSummary.downAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lease Financing Amount:</span>
                    <span className="font-bold text-white">{formatLKR(currentLoanSummary.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Interest Payable:</span>
                    <span className="font-bold text-slate-300">{formatLKR(currentLoanSummary.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                    <span className="text-slate-300">Total Capital Outlay:</span>
                    <span className="text-emerald-400">{formatLKR(currentLoanSummary.totalPayable + currentLoanSummary.downAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleOpenLeaseInquiry}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2"
              >
                <span>Apply for Leasing Pre-Approval</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 120-Point Certified Inspection Showcase */}
      <section id="inspection" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Compromise Standards</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Our Multi-Stage 120-Point Inspection Process
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Every vehicle that enters our showroom undergoes strict diagnostic testing and legal verification by senior automotive engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0D1836] p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-lg">
              01
            </div>
            <h3 className="text-base font-extrabold text-white">Engine & Transmission</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnostic cylinder compression, OBD-II scanner code check, transmission shifting smoothness, hybrid battery health and cooling circuit performance.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Zero oil/coolant leaks</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Hybrid battery degradation &lt; 10%</li>
            </ul>
          </div>

          <div className="bg-[#0D1836] p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold text-lg">
              02
            </div>
            <h3 className="text-base font-extrabold text-white">Chassis & Body Integrity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              360° laser structural alignment check, paint thickness gauge evaluation, zero flood water submersion guarantee and clear chassis stamp inspection.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 100% Original factory pillars</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Zero structural accident record</li>
            </ul>
          </div>

          <div className="bg-[#0D1836] p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">
              03
            </div>
            <h3 className="text-base font-extrabold text-white">Braking & Safety Sensors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ABS actuator testing, brake rotor thickness, shock absorber rebound rates, radar cruise sensors and full multi-airbag electrical deployment verification.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Minimum 70% brake pad life</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Calibrated radar safety systems</li>
            </ul>
          </div>

          <div className="bg-[#0D1836] p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 flex items-center justify-center font-bold text-lg">
              04
            </div>
            <h3 className="text-base font-extrabold text-white">Legal & RMV Clearance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct verification with Department of Motor Traffic (RMV), absolute clear ownership title, valid emission test, finance encumbrance clearance and original log books.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Verified RMV registration</li>
              <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Direct ownership transfer support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section id="reviews" className="py-16 px-4 md:px-8 border-t border-slate-800/80 bg-[#0A132C]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9 / 5.0 Rated Dealership</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Trusted by Hundreds of Vehicle Owners
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              Read authentic feedback from drivers who purchased or traded in their vehicles with SalesPlus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0F1B3E] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                  &quot;I purchased a certified Toyota Land Cruiser Prado from SalesPlus Colombo. The 120-point mechanical report gave me complete confidence. The leasing was processed through Commercial Bank in under 24 hours!&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Dr. Samantha Weerasinghe</h4>
                  <p className="text-[11px] text-slate-400">Colombo 07 • Toyota Prado TX-L</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  Verified Buyer
                </span>
              </div>
            </div>

            <div className="bg-[#0F1B3E] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                  &quot;I traded in my 2018 Honda Civic and upgraded to a Mercedes C200 AMG. Their valuation team inspected my vehicle at my home and offered an honest market price without any hidden deductions. Outstanding service!&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Chirath Bandara</h4>
                  <p className="text-[11px] text-slate-400">Kandy • Mercedes C200 AMG</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  Verified Trade-In
                </span>
              </div>
            </div>

            <div className="bg-[#0F1B3E] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                  &quot;The online installment calculator matched the exact bank quotation I received down to the rupee. The team took care of all RMV paperwork, number plate transfer, and revenue license. Highly recommended!&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Nadeeka Perera</h4>
                  <p className="text-[11px] text-slate-400">Gampaha • Honda Vezel e:HEV</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  Verified Buyer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion Section */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Everything you need to know about buying, leasing, or trading in your car.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Can I obtain leasing pre-approval before choosing a vehicle?',
              a: 'Yes! We collaborate directly with Commercial Bank, HNB, Sampath Bank, LB Finance, and Seylan Bank. You can apply for pre-approval using our leasing calculator or consultation form. Once approved, you can select any vehicle in our showroom.'
            },
            {
              q: 'How does the 120-Point Mechanical Inspection guarantee work?',
              a: 'Every certified car is inspected by our senior technicians covering engine compression, hybrid battery degradation, transmission, 360° laser chassis alignment, brakes, and electrical systems. You receive the complete printed diagnostic report prior to purchase.'
            },
            {
              q: 'Do you accept vehicle trade-ins for existing cars?',
              a: 'Absolutely. We accept Japanese and European trade-in vehicles. Submit your car details through our instant valuation form, and our valuation specialists will provide an immediate estimate and arrange physical inspection.'
            },
            {
              q: 'How long does the vehicle registration and RMV transfer take?',
              a: 'For in-stock registered vehicles, our dedicated document executive completes the RMV transfer within 3 to 5 business days. You receive all original certificates, revenue license, and official VIC clearance.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#0D1836] border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Showroom Locations & Contact Section */}
      <section id="contact" className="py-16 px-4 md:px-8 border-t border-slate-800/80 bg-[#0A132C]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Visit Our Dealership Showrooms
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Experience the cars in person or schedule an exclusive private test drive at our branches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0F1B3E] p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white text-base">Colombo 07 Flagship</h3>
              <p className="text-xs text-slate-400">No. 45, Ward Place, Colombo 07</p>
              <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                <p><span className="text-slate-500">Phone:</span> 011-2345678</p>
                <p><span className="text-slate-500">Hours:</span> Mon - Sat: 8:30 AM - 6:30 PM</p>
                <p><span className="text-slate-500">Sunday:</span> 9:30 AM - 4:00 PM</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2"
              >
                <span>Get Directions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-[#0F1B3E] p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white text-base">Kandy Royal View Branch</h3>
              <p className="text-xs text-slate-400">No. 112, Peradeniya Road, Kandy</p>
              <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                <p><span className="text-slate-500">Phone:</span> 081-2233445</p>
                <p><span className="text-slate-500">Hours:</span> Mon - Sat: 9:00 AM - 6:00 PM</p>
                <p><span className="text-slate-500">Sunday:</span> By Appointment Only</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2"
              >
                <span>Get Directions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-[#0F1B3E] p-6 rounded-3xl border border-slate-800/90 shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-white text-base">Gampaha Express Center</h3>
              <p className="text-xs text-slate-400">No. 78, Kandy Road, Yakkala, Gampaha</p>
              <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800">
                <p><span className="text-slate-500">Phone:</span> 033-2288990</p>
                <p><span className="text-slate-500">Hours:</span> Mon - Sat: 8:30 AM - 6:00 PM</p>
                <p><span className="text-slate-500">Sunday:</span> 9:00 AM - 2:00 PM</p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 pt-2"
              >
                <span>Get Directions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Compare Action Bar */}
      {compareIds.length > 0 && (
        <aside aria-label="Compare bar" className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 border border-emerald-400/40">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-200" />
            <span className="text-xs font-bold">{compareIds.length} Vehicles in Compare Dock</span>
          </div>
          <button
            onClick={() => setShowCompareModal(true)}
            className="bg-white text-emerald-950 font-black text-xs px-4 py-2 rounded-xl shadow-md hover:bg-slate-100 transition-all"
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={() => setCompareIds([])}
            className="text-emerald-200 hover:text-white p-1 rounded-lg"
            title="Clear all"
            aria-label="Clear all"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Wishlist Saved Slide-Over Drawer */}
      {showWishlistDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0D1836] h-full p-6 flex flex-col justify-between border-l border-slate-800 shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h3 className="font-extrabold text-base text-white">Your Saved Vehicles ({wishlist.length})</h3>
                </div>
                <button onClick={() => setShowWishlistDrawer(false)} className="text-slate-400 hover:text-white" aria-label="Close saved vehicles">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="font-bold text-white mb-1">No Saved Vehicles Yet</p>
                  <p className="text-xs text-slate-400">
                    Click the heart icon on any vehicle card to save it for quick review.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allVehicles.filter((v) => wishlist.includes(v.id)).map((v) => (
                    <div key={v.id} className="bg-[#070D1E] p-3 rounded-2xl border border-slate-800 flex gap-3 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80'}
                          alt={v.model}
                          className="w-16 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-white">{v.make} {v.model}</h4>
                          <span className="text-[11px] font-black text-emerald-400">{formatLKR(v.price)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setShowWishlistDrawer(false);
                            setInterestVehicle(v);
                            setInterestType('Details');
                            setInterestSuccess(false);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                        >
                          Enquire
                        </button>
                        <button
                          onClick={() => toggleWishlist(v.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                          title="Remove"
                          aria-label={`Remove ${v.make} ${v.model} from favorites`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    const savedCars = allVehicles.filter(v => wishlist.includes(v.id));
                    const carNames = savedCars.map(c => `${c.make} ${c.model}`).join(', ');
                    const waUrl = `https://wa.me/94771234567?text=${encodeURIComponent(`Hello SalesPlus Team, I would like to inquire about my saved cars: ${carNames}`)}`;
                    window.open(waUrl, '_blank');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire All on WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicle Quick View Modal */}
      {quickViewVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1B3E] border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 text-xs text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {quickViewVehicle.make} {quickViewVehicle.model} ({quickViewVehicle.year})
                </h3>
                <p className="text-xs text-slate-400">{quickViewVehicle.variant} • {quickViewVehicle.condition}</p>
              </div>
              <button onClick={() => setQuickViewVehicle(null)} className="text-slate-400 hover:text-white" aria-label="Close quick view">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="rounded-2xl overflow-hidden h-64 bg-slate-950">
                <img
                  src={quickViewVehicle.image}
                  alt={quickViewVehicle.model}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Price</span>
                  <span className="text-2xl font-black text-emerald-400 block mb-1">
                    {formatLKR(quickViewVehicle.price)}
                  </span>
                  <span className="text-xs text-cyan-400 font-semibold block mb-4">
                    {getEstMonthlyLease(quickViewVehicle.price)}
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#070D1E] p-3.5 rounded-2xl border border-slate-800">
                    <div><span className="text-slate-500">Fuel:</span> {quickViewVehicle.fuelType}</div>
                    <div><span className="text-slate-500">Gearbox:</span> {quickViewVehicle.transmission}</div>
                    <div><span className="text-slate-500">Mileage:</span> {quickViewVehicle.mileage}</div>
                    <div><span className="text-slate-500">Drive:</span> {quickViewVehicle.driveType || '2WD'}</div>
                    <div><span className="text-slate-500">Engine:</span> {quickViewVehicle.engineCapacity || 'Standard'}</div>
                    <div><span className="text-slate-500">Color:</span> {quickViewVehicle.color}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => {
                      const v = quickViewVehicle;
                      setQuickViewVehicle(null);
                      setInterestVehicle(v);
                      setInterestType('Details');
                      setInterestSuccess(false);
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center"
                  >
                    Enquire / Reserve
                  </button>

                  <a
                    href={`https://wa.me/94771234567?text=${encodeURIComponent(`Inquiring about ${quickViewVehicle.make} ${quickViewVehicle.model}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Multi-Vehicle Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1B3E] border border-slate-700 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white">Side-by-Side Vehicle Comparison</h3>
                <p className="text-xs text-slate-400">Comparing technical specifications, pricing, and warranties</p>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white" aria-label="Close vehicle comparison">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {allVehicles.filter((v) => compareIds.includes(v.id)).map((v) => (
                <div key={v.id} className="bg-[#070D1E] p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="h-40 bg-slate-950 rounded-xl overflow-hidden mb-3">
                      <img src={v.image} alt={v.model} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-extrabold text-base text-white">{v.make} {v.model}</h4>
                    <p className="text-[11px] text-slate-400">{v.variant} • {v.year}</p>
                    <p className="text-emerald-400 font-black text-lg my-2">{formatLKR(v.price)}</p>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      <div className="flex justify-between"><span className="text-slate-500">Mileage:</span> {v.mileage}</div>
                      <div className="flex justify-between"><span className="text-slate-500">Fuel:</span> {v.fuelType}</div>
                      <div className="flex justify-between"><span className="text-slate-500">Transmission:</span> {v.transmission}</div>
                      <div className="flex justify-between"><span className="text-slate-500">Drive Type:</span> {v.driveType || '2WD'}</div>
                      <div className="flex justify-between"><span className="text-slate-500">Engine:</span> {v.engineCapacity || 'Standard'}</div>
                      <div className="flex justify-between"><span className="text-slate-500">Inspection:</span> {v.inspectionScore || 'Certified'}</div>
                      <div className="flex justify-between"><span className="text-slate-500">Est. Lease:</span> <span className="text-cyan-400 font-bold">{getEstMonthlyLease(v.price)}</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <button
                      onClick={() => {
                        setShowCompareModal(false);
                        setInterestVehicle(v);
                        setInterestType('Details');
                        setInterestSuccess(false);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-center text-white"
                    >
                      Enquire This Vehicle
                    </button>
                    <button
                      onClick={() => toggleCompare(v.id)}
                      className="w-full py-1.5 text-slate-400 hover:text-rose-400 text-[11px]"
                    >
                      Remove from Comparison
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trade-In / Valuation Modal */}
      {showTradeInModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1B3E] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-700/80 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-black text-white">Sell / Trade-in Your Car</h3>
                <p className="text-xs text-slate-400">Receive fair market appraisal within 2 hours</p>
              </div>
              <button onClick={() => setShowTradeInModal(false)} className="text-slate-400 hover:text-white" aria-label="Close sell or trade-in form">
                <X className="w-5 h-5" />
              </button>
            </div>

            {tradeInSuccess ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-white text-lg">Valuation Request Submitted!</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Our valuation team has received your vehicle specs. An appraisal officer will call your phone with an initial purchase offer.
                </p>
                <button
                  onClick={() => {
                    setTradeInSuccess(false);
                    setShowTradeInModal(false);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleTradeInSubmit} className="space-y-3.5 text-xs">
                {tradeInError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{tradeInError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun Kalhara"
                      value={tradeInForm.name}
                      onChange={(e) => setTradeInForm({ ...tradeInForm, name: e.target.value })}
                      className="w-full p-2.5 bg-[#070D1E] border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={tradeInForm.phone}
                      onChange={(e) => setTradeInForm({ ...tradeInForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#070D1E] border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Make / Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Toyota / Honda"
                      value={tradeInForm.make}
                      onChange={(e) => setTradeInForm({ ...tradeInForm, make: e.target.value })}
                      className="w-full p-2.5 bg-[#070D1E] border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Model *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Axio / Vezel / Premio"
                      value={tradeInForm.model}
                      onChange={(e) => setTradeInForm({ ...tradeInForm, model: e.target.value })}
                      className="w-full p-2.5 bg-[#070D1E] border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Year of Manufacture *</label>
                    <input
                      type="number"
                      required
                      min={2000}
                      max={2026}
                      value={tradeInForm.year}
                      onChange={(e) => setTradeInForm({ ...tradeInForm, year: e.target.value })}
                      className="w-full p-2.5 bg-[#070D1E] border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Mileage (km) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 45,000 km"
                      value={tradeInForm.mileage}
                      onChange={(e) => setTradeInForm({ ...tradeInForm, mileage: e.target.value })}
                      className="w-full p-2.5 bg-[#070D1E] border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Asking / Expected Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 14500000"
                    value={tradeInForm.askingPrice}
                    onChange={(e) => setTradeInForm({ ...tradeInForm, askingPrice: e.target.value })}
                    className="w-full p-2.5 bg-[#070D1E] border border-slate-700/80 rounded-xl text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowTradeInModal(false)}
                    className="px-4 py-2.5 border border-slate-700 text-slate-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingTradeIn}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-950 transition-all flex items-center gap-2"
                  >
                    {isSubmittingTradeIn && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Submit for Appraisal</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Customer Enquiry / Test Drive / Reservation Modal */}
      {interestVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-700/80 bg-[#0F1B3E] p-6 sm:p-7 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">
                  Inquire: {interestVehicle.make} {interestVehicle.model}
                </h3>
                <p className="text-xs text-slate-400">Our dealership sales team will contact you shortly.</p>
              </div>
              <button onClick={() => setInterestVehicle(null)} className="text-slate-400 hover:text-white" aria-label="Close enquiry modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            {interestSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                <p className="font-extrabold text-white text-base">Enquiry Sent Successfully!</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  A dedicated sales executive from our Colombo/Kandy showroom will call you within normal business hours.
                </p>
                <button
                  onClick={() => setInterestVehicle(null)}
                  className="mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitInterest} className="space-y-3.5 text-xs">
                {interestError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300">
                    {interestError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Inquiry Purpose</label>
                  <select
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#070D1E] p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Details">General Details & Pricing</option>
                    <option value="Test Drive">Schedule Test Drive</option>
                    <option value="Reservation Request">Vehicle Reservation Hold</option>
                    <option value="Leasing Pre-Approval">Leasing Pre-Approval Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    required
                    placeholder="e.g. Kasun Kalhara"
                    value={interestName}
                    onChange={(e) => setInterestName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#070D1E] p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone Number (WhatsApp Preferred) *</label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={interestPhone}
                    onChange={(e) => setInterestPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#070D1E] p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {interestType === 'Test Drive' && (
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Preferred Date and Time *</label>
                    <input
                      required
                      type="datetime-local"
                      value={interestDate}
                      onChange={(e) => setInterestDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-[#070D1E] p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {interestLeaseDetails && (
                  <div className="bg-[#070D1E] p-2.5 rounded-xl border border-cyan-500/30 text-[11px] text-cyan-300">
                    <span className="font-bold block text-slate-300 mb-0.5">Calculated Lease Proposal Attached:</span>
                    {interestLeaseDetails}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Message / Additional Questions</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Is it possible to inspect this vehicle this Saturday?"
                    value={interestMessage}
                    onChange={(e) => setInterestMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-[#070D1E] p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInterestVehicle(null)}
                    className="w-1/3 rounded-xl border border-slate-700 py-2.5 font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingInterest}
                    className="w-2/3 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-extrabold text-white flex items-center justify-center gap-2"
                  >
                    {isSubmittingInterest && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Submit Enquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modern High-Trust Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#050A17] pt-14 pb-8 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base">Sales<span className="text-emerald-400">Plus</span> Vehicles</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premier automotive dealership in Sri Lanka. Inspected Japanese & European imports, flexible leasing financing, and certified warranty protection.
            </p>
            <div className="pt-2 text-xs text-slate-300">
              <p className="font-semibold text-emerald-400">Hotline: 011-2345678</p>
              <p>Email: sales@salesplus.com</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-sm mb-3">Vehicle Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#inventory" className="hover:text-emerald-400 transition-colors">Premium SUVs & 4WD</a></li>
              <li><a href="#inventory" className="hover:text-emerald-400 transition-colors">Executive Luxury Sedans</a></li>
              <li><a href="#inventory" className="hover:text-emerald-400 transition-colors">Hybrid & Electric Vehicles</a></li>
              <li><a href="#inventory" className="hover:text-emerald-400 transition-colors">Unregistered Brand New Imports</a></li>
              <li><a href="#inventory" className="hover:text-emerald-400 transition-colors">Budget Certified Cars Under 20M</a></li>
            </ul>
          </div>

          {/* Col 3: Services & Trust */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white text-sm mb-3">Customer Services</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setShowTradeInModal(true)} className="hover:text-emerald-400 transition-colors">Sell or Trade-In Valuation</button></li>
              <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Leasing & Installment Calculator</a></li>
              <li><a href="#inspection" className="hover:text-emerald-400 transition-colors">120-Point Mechanical Inspection</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Showroom Branches & Test Drives</a></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Staff CRM Management Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: New Stock Alerts */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-sm mb-1">New Shipment Alerts</h4>
            <p className="text-xs text-slate-400">
              Subscribe to get notified whenever new Japanese or European shipments clear Colombo port.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to SalesPlus Stock Alerts!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                className="w-full p-2.5 rounded-xl bg-[#070D1E] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Subscribe for Arrivals
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-500">
          <p>© 2026 Vehicle Sales Management System (VSMS SalesPlus). All rights reserved.</p>
          <p>Head Office: No. 45, Baseline Road, Colombo 09 • Dealership Hotline: 011-2345678</p>
        </div>
      </footer>
    </div>
  );
}
