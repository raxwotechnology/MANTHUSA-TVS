import { apiFetch, getApiUrl } from './api';
import { DEFAULT_BRAND, BrandSettings, buildBrandSettings } from './useSettings';

export interface PublicVehicle {
  _id: string;
  stockNumber?: string;
  registrationNumber?: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  manufacturingYear?: number;
  registeredYear?: number;
  vehicleType?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  engineCapacity?: string;
  mileage: number;
  color?: string;
  sellingPrice: number;
  status: string;
  images: string[];
  mediaAngles?: {
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
  };
  horsepower?: number;
  torque?: string;
  seatingCapacity?: number;
  doors?: number;
  bodyType?: string;
  dimensions?: string;
  weight?: string;
  fuelTankCapacity?: string;
  safetyFeatures?: string[];
  entertainmentFeatures?: string[];
  comfortFeatures?: string[];
  customSpecifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValuationSubmission {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  mileage?: number;
  condition?: string;
  askingPrice?: number;
  images?: string[];
  notes?: string;
}

export interface InquirySubmission {
  fullName: string;
  phone: string;
  email?: string;
  vehicle?: string;
  inquiryType?: string;
  message: string;
  preferredDate?: string;
}

export interface BranchInfo {
  _id: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
}

/**
 * Generate a clean SEO friendly slug for a vehicle
 */
export function getVehicleSlug(vehicle: { _id: string; make: string; model: string; year?: number }): string {
  const makeClean = (vehicle.make || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const modelClean = (vehicle.model || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const yearClean = vehicle.year ? `-${vehicle.year}` : '';
  return `${makeClean}-${modelClean}${yearClean}-${vehicle._id}`;
}

/**
 * Extract vehicle ID from a slug if formatted like "toyota-premio-2024-6accb493ec734362d366dca6"
 */
export function extractIdFromSlug(slug: string): string {
  if (!slug) return '';
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  // 24-character hexadecimal ObjectId
  if (/^[a-f\d]{24}$/i.test(lastPart)) {
    return lastPart;
  }
  return slug;
}

// Development fallback fixtures only used if backend inventory is completely empty or offline
const FALLBACK_FIXTURES: PublicVehicle[] = [
  {
    _id: "6accb80bec734362d366dcaa",
    stockNumber: "STK-2026-BYD-01",
    make: "BYD",
    model: "Atto 3",
    variant: "Extended Range",
    year: 2026,
    manufacturingYear: 2026,
    registeredYear: 2026,
    vehicleType: "SUV",
    bodyType: "SUV",
    condition: "Brand New",
    fuelType: "Electric",
    transmission: "Automatic",
    driveType: "FWD",
    engineCapacity: "150kW Motor",
    mileage: 45,
    color: "Ski White / Black Roof",
    status: "Available",
    sellingPrice: 16800000,
    horsepower: 201,
    torque: "310 Nm",
    seatingCapacity: 5,
    doors: 5,
    dimensions: "4455 x 1875 x 1615 mm",
    fuelTankCapacity: "60.48 kWh Battery",
    safetyFeatures: ["Adaptive Cruise Control", "Lane Keeping Assist", "Automatic Emergency Braking", "7 Airbags", "Blind Spot Detection"],
    comfortFeatures: ["Panoramic Sunroof", "Wireless Phone Charging", "Power Tailgate", "Heated Front Seats", "Dual Zone AC"],
    entertainmentFeatures: ["12.8-inch Rotating Touchscreen", "Apple CarPlay & Android Auto", "Dirac 8-Speaker Audio"],
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    mediaAngles: {
      front: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      rear: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      interior: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    }
  },
  {
    _id: "6accb573ec734362d366dca8",
    stockNumber: "STK-2026-HND-02",
    make: "Honda",
    model: "Vezel",
    variant: "e:HEV Z Package",
    year: 2026,
    manufacturingYear: 2025,
    registeredYear: 2026,
    vehicleType: "SUV",
    bodyType: "SUV",
    condition: "Reconditioned",
    fuelType: "Hybrid",
    transmission: "Automatic (e-CVT)",
    driveType: "AWD",
    engineCapacity: "1500cc",
    mileage: 6200,
    color: "Crystal Black Pearl",
    status: "Available",
    sellingPrice: 20000000,
    horsepower: 131,
    torque: "253 Nm",
    seatingCapacity: 5,
    doors: 5,
    dimensions: "4330 x 1790 x 1590 mm",
    fuelTankCapacity: "40 Liters",
    safetyFeatures: ["Honda SENSING Suite", "Collision Mitigation Braking", "Road Departure Mitigation", "Multi-view Camera 360"],
    comfortFeatures: ["Hands-Free Power Tailgate", "Heated Steering Wheel", "Wireless Charger", "Dual Zone Climate Control"],
    entertainmentFeatures: ["Honda CONNECT 9-inch Display", "Premium 10-Speaker Audio", "Smartphone Integration"],
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    ],
    mediaAngles: {
      front: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      interior: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80"
    }
  },
  {
    _id: "6accb493ec734362d366dca6",
    stockNumber: "STK-2024-TYT-03",
    make: "Toyota",
    model: "Premio",
    variant: "F EX Package",
    year: 2024,
    manufacturingYear: 2020,
    registeredYear: 2024,
    vehicleType: "Sedan",
    bodyType: "Sedan",
    condition: "Pre-Owned",
    fuelType: "Petrol",
    transmission: "Automatic (CVT)",
    driveType: "FWD",
    engineCapacity: "1500cc",
    mileage: 38400,
    color: "Pearl White",
    status: "Available",
    sellingPrice: 10200000,
    horsepower: 109,
    torque: "136 Nm",
    seatingCapacity: 5,
    doors: 4,
    dimensions: "4595 x 1695 x 1475 mm",
    fuelTankCapacity: "60 Liters",
    safetyFeatures: ["Toyota Safety Sense P", "Lane Departure Alert", "Automatic High Beam", "8 Airbags"],
    comfortFeatures: ["Push Start & Smart Key", "Power Driver Seat", "Nanoe Air Purification", "Wood Grain Finish"],
    entertainmentFeatures: ["Toyota OEM Touchscreen", "Bluetooth Audio", "Reverse Camera with Guidelines"],
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590362891988-f77804703088?auto=format&fit=crop&w=1200&q=80"
    ],
    mediaAngles: {
      front: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    }
  }
];

export async function fetchPublicVehicles(): Promise<PublicVehicle[]> {
  try {
    const res = await apiFetch('/public/vehicles');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.warn('API error fetching public vehicles:', error);
  }
  return FALLBACK_FIXTURES;
}

export async function fetchPublicVehicle(idOrSlug: string): Promise<PublicVehicle | null> {
  const id = extractIdFromSlug(idOrSlug);
  try {
    const res = await apiFetch(`/public/vehicles/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data._id) return data;
    }
  } catch (error) {
    console.warn(`API error fetching vehicle #${id}:`, error);
  }

  // Fallback to local array match
  const match = FALLBACK_FIXTURES.find((v) => v._id === id || v._id === idOrSlug || getVehicleSlug(v) === idOrSlug);
  return match || null;
}

export async function fetchPublicSettings(): Promise<BrandSettings> {
  try {
    const res = await apiFetch('/settings/public');
    if (res.ok) {
      const data = await res.json();
      return buildBrandSettings(data);
    }
  } catch (error) {
    console.warn('API error fetching settings:', error);
  }
  return DEFAULT_BRAND;
}

export async function fetchPublicBranches(): Promise<BranchInfo[]> {
  try {
    const res = await apiFetch('/branches/public');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (error) {
    console.warn('API error fetching branches:', error);
  }
  return [
    {
      _id: 'br-colombo',
      name: 'Colombo Flagship Showroom',
      code: 'CMB-01',
      address: 'No. 142/B, Baseline Road, Colombo 09',
      phone: '+94 11 268 4900',
      email: 'colombo@salesplus.lk',
      city: 'Colombo',
    },
    {
      _id: 'br-kandy',
      name: 'Kandy Premium Centre',
      code: 'KDY-02',
      address: 'No. 88, William Gopallawa Mawatha, Kandy',
      phone: '+94 81 223 4500',
      email: 'kandy@salesplus.lk',
      city: 'Kandy',
    },
  ];
}

export async function submitPublicInquiry(data: InquirySubmission): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const res = await apiFetch('/leads/public', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return { success: true, message: 'Your inquiry has been submitted successfully. A sales executive will contact you shortly.', data: json };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.message || 'Failed to submit inquiry. Please try again.' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Network error submitting inquiry.' };
  }
}

export async function submitValuationRequest(data: ValuationSubmission): Promise<{ success: boolean; message: string; valuationId?: string }> {
  try {
    const res = await apiFetch('/vehicle-valuations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      return {
        success: true,
        message: 'Your vehicle valuation request has been received. Our appraisal team will review your submission and contact you within 24 hours.',
        valuationId: json.valuationId || `VAL-${Date.now()}`,
      };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.message || 'Failed to submit valuation request. Please try again.' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Network error submitting valuation.' };
  }
}

/**
 * Format currency with dealership symbol
 */
export function formatLKR(amount: number | undefined | null, symbol: string = 'Rs.'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${symbol} 0`;
  return `${symbol} ${Number(amount).toLocaleString('en-US')}`;
}

/**
 * Calculate amortized loan installment according to standard automotive finance formula:
 * Payment = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateAmortizedMonthlyPayment(
  price: number,
  downPayment: number,
  annualInterestRate: number,
  tenureYears: number
): {
  monthlyPayment: number;
  principal: number;
  totalInterest: number;
  totalPayable: number;
} {
  const principal = Math.max(0, price - downPayment);
  const n = Math.max(1, Math.round(tenureYears * 12));
  if (principal <= 0) {
    return { monthlyPayment: 0, principal: 0, totalInterest: 0, totalPayable: 0 };
  }
  if (annualInterestRate <= 0) {
    const monthlyPayment = principal / n;
    return { monthlyPayment, principal, totalInterest: 0, totalPayable: principal };
  }

  const r = annualInterestRate / 100 / 12;
  const factor = Math.pow(1 + r, n);
  const monthlyPayment = (principal * r * factor) / (factor - 1);
  const totalPayable = monthlyPayment * n;
  const totalInterest = totalPayable - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment),
    principal,
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
  };
}
