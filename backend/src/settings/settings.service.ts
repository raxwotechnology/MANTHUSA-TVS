import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';

export const DEFAULT_SETTINGS: Record<string, any> = {
  general: {
    dealershipName: 'MANTHUSA TVS',
    tagline: 'Official TVS Motorcycles & Scooters Dealership, Service & Genuine Parts',
    registrationNumber: 'TVS-LK-89214/2026',
    taxNumber: 'VAT-119284729-7000',
    logoUrl: '/manthusa-logo.png',
    faviconUrl: '',
    footerText: '© 2026 MANTHUSA TVS. All rights reserved. Official TVS Warranty & Genuine Spares.',
    defaultLanguage: 'en',
    currency: 'LKR',
    currencySymbol: 'Rs.',
  },
  contact: {
    address: '386, New Kandy Road, Weliweriya, Sri Lanka',
    city: 'Weliweriya',
    province: 'Western Province',
    postalCode: '11710',
    phone: '075-6000 310',
    hotline: '076-5710 601 / 070-6510 601',
    salesEmail: 'sales@manthusatvs.lk',
    supportEmail: 'service@manthusatvs.lk',
    openingHours: 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)',
    googleMapsUrl: 'https://maps.google.com/?q=386+New+Kandy+Road+Weliweriya',
  },
  commerce: {
    currency: 'LKR',
    currencySymbol: 'Rs.',
    vatPercentage: 18,
    quotationValidityDays: 14,
    reservationHoldDays: 3,
    minDownpaymentPercentage: 20,
    invoicePrefix: 'TVS-INV-',
    quotationPrefix: 'TVS-QT-',
    agreementPrefix: 'TVS-AGR-',
    purchasePrefix: 'TVS-PUR-',
    allowDiscountsWithoutApproval: false,
    maxStaffDiscountPercentage: 5,
  },
  vehicles: {
    mileageUnit: 'km',
    defaultWarrantyMonths: 24,
    defaultWarrantyKm: 30000,
    defaultTestDriveDurationMinutes: 30,
    requireDrivingLicenseForTestDrive: true,
    inspectionChecklistItems: [
      'Engine Oil Level & Quality Check',
      'Front & Rear Brake System (Roto-Petal Disc/Drum)',
      'Tyre Pressure & Tread Depth Inspection',
      'Drive Chain Tension, Lubrication & Alignment',
      'Battery Voltage & Electrical Systems',
      'Clutch & Throttle Free Play Adjustment',
      'Headlamp Aim & All Signal Indicators',
      'SmartXonnect Bluetooth Console Connectivity',
      'Suspension — Telescopic Fork & Monoshock Health',
      'Chassis & Frame Structural Inspection',
      'PDI Road Test & Idle RPM Calibration',
      'Documentation & Warranty Registration Book',
    ],
  },
  leasing: {
    defaultLeasingTenorMonths: 36,
    defaultInterestRate: 14.5,
    minimumDownPaymentPercent: 20,
    commissionRate: 2.5,
    referralBonus: 25000,
    bikeIncentives: {
      enabled: true,
      schemeName: 'Standard TVS Tiered Sales Incentive',
      currency: 'LKR',
      tiers: [
        {
          tierNumber: 1,
          name: 'Tier 1 (Bikes 1 - 15)',
          minBikes: 1,
          maxBikes: 15,
          ratePerBike: 10000,
          description: 'Base slab: Rs. 10,000 per motorcycle up to 15 bikes (Total: Rs. 150,000)',
        },
        {
          tierNumber: 2,
          name: 'Tier 2 (Bikes 16 - 30)',
          minBikes: 16,
          maxBikes: 30,
          ratePerBike: 15000,
          bonusPerBike: 5000,
          description: 'Booster slab: +Rs. 5,000 extra added, Rs. 15,000 per motorcycle from 16 to 30 (Total: Rs. 225,000)',
        },
      ],
    },
    preferredPartners: [
      'Commercial Bank of Ceylon',
      'Hatton National Bank (HNB)',
      'Sampath Bank PLC',
      'LOLC Finance',
      'Central Finance',
      'LB Finance',
    ],
    termsAndNotes: 'Motorcycle leasing facilities subject to credit appraisal and CBSL lending regulations.',
  },
  receiptDesigner: {
    invoiceHeader: 'TVS MOTORCYCLE SALES INVOICE & DELIVERY ORDER',
    quotationHeader: 'OFFICIAL TVS MOTORCYCLE SALES QUOTATION',
    bankName: 'Commercial Bank of Ceylon PLC',
    bankAccountName: 'MANTHUSA TVS',
    bankAccountNumber: '1000 4829 3819',
    bankBranch: 'Weliweriya Branch',
    bankSwift: 'CCEYLKAX',
    authorizedSignatory: 'Director / Showroom General Manager',
    termsConditions:
      '1. All TVS motorcycles undergo comprehensive Pre-Delivery Inspection (PDI) prior to handover.\n2. Reservation deposits are non-refundable after the reservation hold duration passes.\n3. Full settlement required before revenue license registration and bike delivery.\n4. Standard TVS manufacturer warranty terms apply as detailed in the service booklet.',
    footerNote: 'Thank you for choosing MANTHUSA TVS! Ride safe and enjoy every kilometre.',
  },
  templates: {
    quotationTemplate:
      'Dear {customer_name}, your official TVS motorcycle quotation for {motorcycle_name} of Rs. {price} is ready. Valid until {expiry_date}. For details, contact {sales_phone}.',
    reservationTemplate:
      'Dear {customer_name}, {motorcycle_name} has been successfully reserved for you until {expiry_date}. Reference ID: {ref_id}. Thank you for choosing {dealership_name}.',
    testDriveTemplate:
      'Dear {customer_name}, your TVS test ride for {motorcycle_name} is confirmed for {scheduled_date} at {dealership_address}. Please bring your riding license.',
    handoverTemplate:
      'Congratulations {customer_name}! Your TVS motorcycle {motorcycle_name} is scheduled for handover. We look forward to seeing you at {dealership_name}. Ride safe!',
    paymentReminderTemplate:
      'Dear {customer_name}, friendly reminder that installment payment of Rs. {amount} for {motorcycle_name} is due on {due_date}. Beneficiary: {bank_name} A/C {account_no}.',
  },
  social: {
    whatsapp: '+94756000310',
    facebook: 'https://facebook.com/manthusatvs',
    instagram: 'https://instagram.com/manthusatvs',
    youtube: 'https://youtube.com/@manthusatvs',
    website: 'https://manthusatvs.lk',
    tiktok: '',
  },
  system: {
    maintenanceMode: false,
    enablePublicInquiries: true,
    autoExpireReservations: true,
    notifyOnNewLead: true,
    notifyOnDiscountRequest: true,
    sessionTimeoutMinutes: 60,
    timeZone: 'Asia/Colombo (GMT+5:30)',
  },
  website: {
    announcement: {
      enabled: true,
      text: 'Special Season Offer: Get Free Registration, 2 Helmets & 3 Free Periodic Services on all TVS Apache & NTORQ bookings!',
      phone: '075-6000 310 / 076-5710 601',
      hours: 'Mon - Sat: 8:30 AM - 6:30 PM',
    },
    hero: {
      headline: 'ENGINEERED FOR THRILL. BUILT FOR EVERY RIDE.',
      subheadline: 'Experience the track-tested TVS Apache Racing series, high-tech connected NTORQ smart scooters, dependable commuter champions, and clean electric mobility.',
      ctaPrimaryText: 'Explore TVS Lineup',
      ctaPrimaryLink: '/bikes',
      ctaSecondaryText: 'Configure & Book Online',
      ctaSecondaryLink: '/configure',
      backgroundImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80',
    },
    sections: {
      showFeatured: true,
      showLatestArrivals: true,
      showCategories: true,
      showWhyUs: true,
      showHowItWorks: true,
      showFinancePromo: true,
      showTradeInPromo: false,
      showContact: true,
    },
    pages: {
      about: 'MANTHUSA TVS is an authorized TVS dealership in Weliweriya providing brand-new TVS motorcycles, scooters, certified maintenance, genuine spare parts, and low-rate financing.',
      finance: 'We offer low-rate motorcycle leasing and installment plans starting from 10% down payment with instant approval.',
      terms: 'All motorcycle bookings are held for up to 7 days upon reservation deposit confirmation.',
      privacy: 'We take customer confidentiality seriously and protect your personal data according to applicable privacy standards.',
    },
  },
};

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<SettingDocument>,
  ) {}

  async getAll(): Promise<Record<string, any>> {
    const docs = await this.settingModel.find().exec();
    const dbSettings: Record<string, any> = {};
    for (const doc of docs) {
      dbSettings[doc.key] = doc.value;
    }

    // Deep merge defaults with stored DB values
    const merged: Record<string, any> = {};
    const allKeys = new Set([...Object.keys(DEFAULT_SETTINGS), ...Object.keys(dbSettings)]);

    for (const key of allKeys) {
      if (typeof DEFAULT_SETTINGS[key] === 'object' && DEFAULT_SETTINGS[key] !== null && !Array.isArray(DEFAULT_SETTINGS[key])) {
        merged[key] = {
          ...DEFAULT_SETTINGS[key],
          ...(dbSettings[key] || {}),
        };
      } else {
        merged[key] = dbSettings[key] !== undefined ? dbSettings[key] : DEFAULT_SETTINGS[key];
      }
    }

    return merged;
  }

  async getPublicSettings(): Promise<Record<string, any>> {
    const all = await this.getAll();
    return {
      general: all.general,
      contact: all.contact,
      social: all.social,
      website: all.website,
      commerce: {
        currency: all.commerce?.currency || 'LKR',
        currencySymbol: all.commerce?.currencySymbol || 'Rs.',
      },
      vehicles: {
        inspectionChecklistItems: all.vehicles?.inspectionChecklistItems || [],
      },
      leasing: {
        preferredPartners: all.leasing?.preferredPartners || [],
        defaultInterestRate: all.leasing?.defaultInterestRate,
        minimumDownPaymentPercent: all.leasing?.minimumDownPaymentPercent,
        defaultLeasingTenorMonths: all.leasing?.defaultLeasingTenorMonths,
      },
    };
  }

  async getByKey(key: string): Promise<any> {
    const doc = await this.settingModel.findOne({ key }).exec();
    if (doc) {
      if (typeof DEFAULT_SETTINGS[key] === 'object' && DEFAULT_SETTINGS[key] !== null && !Array.isArray(DEFAULT_SETTINGS[key])) {
        return { ...DEFAULT_SETTINGS[key], ...doc.value };
      }
      return doc.value;
    }
    return DEFAULT_SETTINGS[key] ?? null;
  }

  async update(key: string, value: any): Promise<any> {
    const updated = await this.settingModel.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
    return updated.value;
  }

  async updateMany(data: Record<string, any>): Promise<Record<string, any>> {
    const operations = Object.entries(data).map(([key, value]) =>
      this.settingModel.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).exec(),
    );

    await Promise.all(operations);
    return this.getAll();
  }

  async resetToDefaults(): Promise<Record<string, any>> {
    await this.settingModel.deleteMany({}).exec();
    return DEFAULT_SETTINGS;
  }
}
