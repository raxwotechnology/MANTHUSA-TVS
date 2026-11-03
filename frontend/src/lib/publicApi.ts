import { apiFetch, getApiUrl } from './api';
import { DEFAULT_BRAND, BrandSettings, buildBrandSettings } from './useSettings';

export interface TVSVariant {
  name: string;
  code?: string;
  price: number;
  colors?: string[];
  specifications?: Record<string, string>;
  isDefault?: boolean;
}

export interface TVSColor {
  name: string;
  code?: string;
  hex?: string;
  imageUrl?: string;
  available?: boolean;
}

export interface TVSBranchStock {
  branchId?: string;
  branchName: string;
  quantity: number;
  availableColors?: string[];
}

export interface PublicVehicle {
  _id: string;
  stockNumber?: string;
  registrationNumber?: string;
  make: string;
  model: string;
  variant?: string;
  category?: string; // 'Scooters', 'Commuter Motorcycles', 'Sport Motorcycles', 'Premium Motorcycles', 'Electric Two-Wheelers'
  year: number;
  manufacturingYear?: number;
  registeredYear?: number;
  vehicleType?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  engineCapacity?: string;
  engineType?: string;
  maxPower?: string;
  maxTorque?: string;
  coolingSystem?: string;
  fuelSystem?: string;
  startingSystem?: string;
  topSpeed?: string;
  mileage: number;
  fuelTankCapacity?: string;
  frontBrake?: string;
  rearBrake?: string;
  brakingSystem?: string;
  frontSuspension?: string;
  rearSuspension?: string;
  wheelType?: string;
  tyreDimensions?: string;
  groundClearance?: string;
  seatHeight?: string;
  kerbWeight?: string;
  smartFeatures?: string[];
  horsepower?: number;
  torque?: string;
  seatingCapacity?: number;
  doors?: number;
  bodyType?: string;
  safetyFeatures?: string[];
  comfortFeatures?: string[];
  entertainmentFeatures?: string[];
  color?: string;
  variants?: TVSVariant[];
  colors?: TVSColor[];
  branchStock?: TVSBranchStock[];
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
  shortDescription?: string;
  description?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MotorcycleRequestSubmission {
  fullName: string;
  phone: string;
  email?: string;
  vehicleId?: string;
  vehicle?: string;
  modelName: string;
  variantName?: string;
  selectedColor?: string;
  preferredBranch?: string;
  preferredBranchName?: string;
  message?: string;
  inquiryType?: string;
  budget?: number;
}

export interface BranchInfo {
  _id: string;
  name: string;
  code?: string;
  address?: string;
  location?: string;
  phone?: string;
  contactNumber?: string;
  email?: string;
  city?: string;
}

/**
 * Generate a clean SEO friendly slug for a TVS motorcycle
 */
export function getVehicleSlug(vehicle: { _id: string; make?: string; model: string; year?: number }): string {
  const modelClean = (vehicle.model || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `tvs-${modelClean}-${vehicle._id}`;
}

export function getBikeSlug(bike: { _id: string; make?: string; model: string; year?: number }): string {
  return getVehicleSlug(bike);
}

/**
 * Fetch public vehicle listings
 */
export async function fetchPublicVehicles(): Promise<PublicVehicle[]> {
  try {
    const res = await fetch(getApiUrl('/public/vehicles'), {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return (await res.json()) || [];
  } catch (err) {
    console.error('Error fetching public motorcycles:', err);
    return [];
  }
}

/**
 * Fetch single vehicle by id or slug
 */
export async function fetchPublicVehicle(idOrSlug: string): Promise<PublicVehicle | null> {
  try {
    const res = await fetch(getApiUrl(`/public/vehicles/${encodeURIComponent(idOrSlug)}`), {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Error fetching motorcycle ${idOrSlug}:`, err);
    return null;
  }
}

/**
 * Fetch branches
 */
export async function fetchBranches(): Promise<BranchInfo[]> {
  try {
    const res = await fetch(getApiUrl('/branches/public'));
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Error fetching branches:', err);
    return [];
  }
}

export const fetchPublicBranches = fetchBranches;

export async function submitPublicInquiry(data: any): Promise<any> {
  const res = await fetch(getApiUrl('/leads/public'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit inquiry.');
  }
  return res.json();
}

export async function submitValuationRequest(data: any): Promise<any> {
  const res = await fetch(getApiUrl('/leads/public'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, inquiryType: 'Exchange / Valuation' }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit valuation request.');
  }
  return res.json();
}

export function calculateAmortizedMonthlyPayment(
  vehiclePrice: number,
  downPaymentOrPercent?: number,
  annualInterestRate: number = 14.5,
  termYears: number = 5
): {
  monthlyPayment: number;
  principal: number;
  totalInterest: number;
  totalPayable: number;
} {
  let downPayment = 0;
  if (downPaymentOrPercent !== undefined) {
    if (downPaymentOrPercent < 100) {
      downPayment = vehiclePrice * (downPaymentOrPercent / 100);
    } else {
      downPayment = downPaymentOrPercent;
    }
  } else {
    downPayment = vehiclePrice * 0.2;
  }
  const principal = Math.max(0, vehiclePrice - downPayment);
  if (principal <= 0) {
    return { monthlyPayment: 0, principal: 0, totalInterest: 0, totalPayable: 0 };
  }
  const termMonths = termYears > 15 ? termYears : termYears * 12;
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyPayment = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1));
  const totalPayable = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalPayable - principal);

  return {
    monthlyPayment,
    principal,
    totalInterest,
    totalPayable
  };
}

/**
 * Submit customer motorcycle booking / quotation request
 */
export async function submitMotorcycleRequest(data: MotorcycleRequestSubmission): Promise<any> {
  const res = await fetch(getApiUrl('/leads/public'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit motorcycle request.');
  }
  return res.json();
}

/**
 * Currency formatter for LKR
 */
export function formatLKR(amount: number | undefined | null, symbol: string = 'Rs.'): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${symbol} 0`;
  return `${symbol} ${amount.toLocaleString('en-LK')}`;
}
