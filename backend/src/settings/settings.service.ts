import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';

export const DEFAULT_SETTINGS: Record<string, any> = {
  general: {
    dealershipName: 'SalesPlus Auto Mart',
    tagline: "Sri Lanka's Premier Vehicle Dealership & Direct Importer",
    registrationNumber: 'PV-89214/2024',
    taxNumber: 'VAT-119284729-7000',
    logoUrl: '',
    faviconUrl: '',
    footerText: '© 2026 SalesPlus Vehicle Sales. All rights reserved.',
    defaultLanguage: 'en',
    currency: 'LKR',
    currencySymbol: 'Rs.',
  },
  contact: {
    address: 'No. 142/B, Baseline Road, Colombo 09, Sri Lanka',
    city: 'Colombo',
    province: 'Western Province',
    postalCode: '00900',
    phone: '+94 11 268 4900',
    hotline: '+94 77 123 4567',
    salesEmail: 'sales@salesplus.lk',
    supportEmail: 'support@salesplus.lk',
    openingHours: 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)',
    googleMapsUrl: 'https://maps.google.com/?q=Colombo+Sri+Lanka',
  },
  commerce: {
    currency: 'LKR',
    currencySymbol: 'Rs.',
    vatPercentage: 18,
    quotationValidityDays: 14,
    reservationHoldDays: 3,
    minDownpaymentPercentage: 20,
    invoicePrefix: 'INV-',
    quotationPrefix: 'QUO-',
    agreementPrefix: 'AGR-',
    purchasePrefix: 'PUR-',
    allowDiscountsWithoutApproval: false,
    maxStaffDiscountPercentage: 5,
  },
  vehicles: {
    mileageUnit: 'km',
    defaultWarrantyMonths: 12,
    defaultWarrantyKm: 20000,
    defaultTestDriveDurationMinutes: 30,
    requireDrivingLicenseForTestDrive: true,
    inspectionChecklistItems: [
      'Engine & Transmission Health',
      'Brake System & ABS Diagnostics',
      'Tire Tread Depth & Suspension',
      'Chassis & Frame Structural Alignment',
      'Battery & Electrical Systems Check',
      'Interior Cabin & AC Climate Control',
      'Exterior Body & Original Paint Condition',
      'Clear Documentation & Revenue License Check',
    ],
  },
  leasing: {
    defaultLeasingTenorMonths: 60,
    defaultInterestRate: 14.5,
    minimumDownPaymentPercent: 20,
    preferredPartners: [
      'Commercial Bank of Ceylon',
      'Hatton National Bank (HNB)',
      'Sampath Bank PLC',
      'LOLC Finance',
      'Central Finance',
      'LB Finance',
    ],
    termsAndNotes: 'Leasing facilities subject to credit appraisal and CBSL lending regulations.',
  },
  receiptDesigner: {
    invoiceHeader: 'VEHICLE SALES INVOICE & DELIVERY ORDER',
    quotationHeader: 'OFFICIAL VEHICLE SALES QUOTATION',
    bankName: 'Commercial Bank of Ceylon PLC',
    bankAccountName: 'SalesPlus Auto Mart (Pvt) Ltd',
    bankAccountNumber: '1000 4829 3819',
    bankBranch: 'Colombo Main Branch',
    bankSwift: 'CCEYLKAX',
    authorizedSignatory: 'Director / General Manager',
    termsConditions:
      '1. All vehicles undergo comprehensive pre-delivery inspection.\n2. Reservations remain valid during the stipulated period; token advances subject to dealership policy.\n3. Complete balance settlement is required prior to issuance of registration transfer documents and vehicle handover.\n4. Standard warranty terms apply as detailed in the vehicle handover booklet.',
    footerNote: 'Thank you for choosing SalesPlus Auto Mart! Safe driving and seamless journeys.',
  },
  templates: {
    quotationTemplate:
      'Dear {customer_name}, your official vehicle quotation for {vehicle_name} ({reg_no}) of Rs. {price} is ready. Valid until {expiry_date}. For details, contact {sales_phone}.',
    reservationTemplate:
      'Dear {customer_name}, {vehicle_name} has been successfully reserved for you until {expiry_date}. Reference ID: {ref_id}. Thank you for choosing {dealership_name}.',
    testDriveTemplate:
      'Dear {customer_name}, your test drive for {vehicle_name} is confirmed for {scheduled_date} at {dealership_address}. Please carry your driving license.',
    handoverTemplate:
      'Congratulations {customer_name}! Your vehicle {vehicle_name} is scheduled for handover. We look forward to seeing you at {dealership_name}.',
    paymentReminderTemplate:
      'Dear {customer_name}, friendly reminder that payment of Rs. {amount} for {vehicle_name} is due on {due_date}. Beneficiary account: {bank_name} A/C {account_no}.',
  },
  social: {
    whatsapp: '+94771234567',
    facebook: 'https://facebook.com/salesplusautomart',
    instagram: 'https://instagram.com/salesplusautomart',
    youtube: 'https://youtube.com/@salesplusautomart',
    website: 'https://salesplus.lk',
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
      commerce: {
        currency: all.commerce?.currency || 'LKR',
        currencySymbol: all.commerce?.currencySymbol || 'Rs.',
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
