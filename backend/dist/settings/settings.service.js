"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = exports.DEFAULT_SETTINGS = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const setting_schema_1 = require("./schemas/setting.schema");
exports.DEFAULT_SETTINGS = {
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
        termsConditions: '1. All vehicles undergo comprehensive pre-delivery inspection.\n2. Reservations remain valid during the stipulated period; token advances subject to dealership policy.\n3. Complete balance settlement is required prior to issuance of registration transfer documents and vehicle handover.\n4. Standard warranty terms apply as detailed in the vehicle handover booklet.',
        footerNote: 'Thank you for choosing SalesPlus Auto Mart! Safe driving and seamless journeys.',
    },
    templates: {
        quotationTemplate: 'Dear {customer_name}, your official vehicle quotation for {vehicle_name} ({reg_no}) of Rs. {price} is ready. Valid until {expiry_date}. For details, contact {sales_phone}.',
        reservationTemplate: 'Dear {customer_name}, {vehicle_name} has been successfully reserved for you until {expiry_date}. Reference ID: {ref_id}. Thank you for choosing {dealership_name}.',
        testDriveTemplate: 'Dear {customer_name}, your test drive for {vehicle_name} is confirmed for {scheduled_date} at {dealership_address}. Please carry your driving license.',
        handoverTemplate: 'Congratulations {customer_name}! Your vehicle {vehicle_name} is scheduled for handover. We look forward to seeing you at {dealership_name}.',
        paymentReminderTemplate: 'Dear {customer_name}, friendly reminder that payment of Rs. {amount} for {vehicle_name} is due on {due_date}. Beneficiary account: {bank_name} A/C {account_no}.',
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
let SettingsService = SettingsService_1 = class SettingsService {
    settingModel;
    logger = new common_1.Logger(SettingsService_1.name);
    constructor(settingModel) {
        this.settingModel = settingModel;
    }
    async getAll() {
        const docs = await this.settingModel.find().exec();
        const dbSettings = {};
        for (const doc of docs) {
            dbSettings[doc.key] = doc.value;
        }
        const merged = {};
        const allKeys = new Set([...Object.keys(exports.DEFAULT_SETTINGS), ...Object.keys(dbSettings)]);
        for (const key of allKeys) {
            if (typeof exports.DEFAULT_SETTINGS[key] === 'object' && exports.DEFAULT_SETTINGS[key] !== null && !Array.isArray(exports.DEFAULT_SETTINGS[key])) {
                merged[key] = {
                    ...exports.DEFAULT_SETTINGS[key],
                    ...(dbSettings[key] || {}),
                };
            }
            else {
                merged[key] = dbSettings[key] !== undefined ? dbSettings[key] : exports.DEFAULT_SETTINGS[key];
            }
        }
        return merged;
    }
    async getPublicSettings() {
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
    async getByKey(key) {
        const doc = await this.settingModel.findOne({ key }).exec();
        if (doc) {
            if (typeof exports.DEFAULT_SETTINGS[key] === 'object' && exports.DEFAULT_SETTINGS[key] !== null && !Array.isArray(exports.DEFAULT_SETTINGS[key])) {
                return { ...exports.DEFAULT_SETTINGS[key], ...doc.value };
            }
            return doc.value;
        }
        return exports.DEFAULT_SETTINGS[key] ?? null;
    }
    async update(key, value) {
        const updated = await this.settingModel.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true, setDefaultsOnInsert: true }).exec();
        return updated.value;
    }
    async updateMany(data) {
        const operations = Object.entries(data).map(([key, value]) => this.settingModel.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true, setDefaultsOnInsert: true }).exec());
        await Promise.all(operations);
        return this.getAll();
    }
    async resetToDefaults() {
        await this.settingModel.deleteMany({}).exec();
        return exports.DEFAULT_SETTINGS;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(setting_schema_1.Setting.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SettingsService);
//# sourceMappingURL=settings.service.js.map