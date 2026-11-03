"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import { buildBrandSettings, DEFAULT_WEBSITE_CMS } from '@/lib/useSettings';
import {
  Settings,
  Store,
  Phone,
  DollarSign,
  Award,
  FileText,
  Mail,
  ShieldCheck,
  Share2,
  Sliders,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Car,
  Landmark,
  Clock,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

type TabType =
  | 'general'
  | 'contact'
  | 'commerce'
  | 'vehicles'
  | 'leasing'
  | 'receiptDesigner'
  | 'templates'
  | 'permissions'
  | 'social'
  | 'advanced';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings state initialized with rich defaults
  const [settings, setSettings] = useState<any>({
    general: {
      dealershipName: 'TVS SalesPlus Motor Hub',
      tagline: 'Official TVS Motorcycle Dealer — Sri Lanka',
      registrationNumber: 'PV-89214/2026',
      taxNumber: 'VAT-119284729-7000',
      logoUrl: '',
      faviconUrl: '',
      footerText: '© 2026 TVS SalesPlus Motor Hub. All rights reserved.',
      defaultLanguage: 'en',
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
      invoicePrefix: 'TVS-INV-',
      quotationPrefix: 'TVS-QT-',
      agreementPrefix: 'TVS-AGR-',
      purchasePrefix: 'TVS-PUR-',
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
        'Engine Oil Level & Condition Check',
        'Brake System — Front & Rear Disc/Drum Check',
        'Tyre Pressure & Tread Depth Inspection',
        'Chain Tension, Lubrication & Drive Sprocket',
        'Battery Charge & Electrical Systems',
        'Clutch & Throttle Cable Free-Play Adjustment',
        'Headlamp Aim & All Lights Functionality',
        'Fuel System & Fuel Tank Cap Seal',
        'Suspension — Front Fork & Rear Shock Condition',
        'Frame & Chassis Integrity Visual Check',
        'Instrument Cluster & Speedometer Calibration',
        'Documentation — Revenue License & Insurance',
      ],
    },
    leasing: {
      defaultLeasingTenorMonths: 60,
      defaultInterestRate: 14.5,
      minimumDownPaymentPercent: 20,
      commissionRate: 2.5,
      referralBonus: 25000,
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
      invoiceHeader: 'TVS MOTORCYCLE SALES INVOICE & DELIVERY ORDER',
      quotationHeader: 'OFFICIAL TVS MOTORCYCLE SALES QUOTATION',
      bankName: 'Commercial Bank of Ceylon PLC',
      bankAccountName: 'TVS SalesPlus Motor Hub (Pvt) Ltd',
      bankAccountNumber: '1000 4829 3819',
      bankBranch: 'Colombo Main Branch',
      bankSwift: 'CCEYLKAX',
      authorizedSignatory: 'Director / General Manager',
      termsConditions:
        '1. All motorcycles undergo a comprehensive Pre-Delivery Inspection (PDI) prior to handover.\n2. Booking deposits are non-refundable if the customer cancels after the reservation hold period.\n3. Full balance settlement is required before issuance of registration documents and motorcycle handover.\n4. Standard TVS manufacturer warranty terms apply as detailed in the owner\'s manual and warranty booklet.',
      footerNote: 'Thank you for choosing TVS SalesPlus Motor Hub! Ride safe and enjoy every kilometre.',
    },
    templates: {
      quotationTemplate:
        'Dear {customer_name}, your official TVS motorcycle quotation for {motorcycle_name} of Rs. {price} is ready. Valid until {expiry_date}. For details, contact {sales_phone}.',
      reservationTemplate:
        'Dear {customer_name}, {motorcycle_name} has been successfully booked for you until {expiry_date}. Booking ID: {ref_id}. Thank you for choosing {dealership_name}.',
      testDriveTemplate:
        'Dear {customer_name}, your TVS test ride for {motorcycle_name} is confirmed for {scheduled_date} at {dealership_address}. Please carry your riding license.',
      handoverTemplate:
        'Congratulations {customer_name}! Your TVS motorcycle {motorcycle_name} is ready for handover. We look forward to seeing you at {dealership_name}. Ride safe!',
      paymentReminderTemplate:
        'Dear {customer_name}, friendly reminder that payment of Rs. {amount} for {motorcycle_name} is due on {due_date}. Beneficiary account: {bank_name} A/C {account_no}.',
    },
    social: {
      whatsapp: '+94771234567',
      facebook: 'https://facebook.com/tvssalesplusmotorhub',
      instagram: 'https://instagram.com/tvssalesplus.lk',
      youtube: 'https://youtube.com/@tvssalesplusmotorhub',
      website: 'https://tvssalesplus.lk',
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
    website: DEFAULT_WEBSITE_CMS,
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newPartner, setNewPartner] = useState('');

  // Fetch settings from API
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await apiFetch('/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings((prev: any) => {
            const merged = {
              ...prev,
              ...data,
              general: { ...prev.general, ...(data.general || {}) },
              contact: { ...prev.contact, ...(data.contact || {}) },
              commerce: { ...prev.commerce, ...(data.commerce || {}) },
              vehicles: { ...prev.vehicles, ...(data.vehicles || {}) },
              leasing: { ...prev.leasing, ...(data.leasing || {}) },
              receiptDesigner: { ...prev.receiptDesigner, ...(data.receiptDesigner || {}) },
              templates: { ...prev.templates, ...(data.templates || {}) },
              social: { ...prev.social, ...(data.social || {}) },
              system: { ...prev.system, ...(data.system || {}) },
              website: { ...(prev.website || DEFAULT_WEBSITE_CMS), ...(data.website || {}) },
            };

            if (typeof window !== 'undefined') {
              const brandData = buildBrandSettings(merged);
              localStorage.setItem('dealership_brand', JSON.stringify(brandData));
              window.dispatchEvent(new CustomEvent('dealership-settings-updated', { detail: brandData }));
            }

            return merged;
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Automatically optimize & resize logo to standard crisp dimensions (max 400x400)
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.92);
          handleNestedChange('general', 'logoUrl', compressed);
        } else {
          handleNestedChange('general', 'logoUrl', src);
        }
        showNotification('success', 'Logo loaded! Click "Save Changes" to update across the entire system.');
      };
      img.onerror = () => {
        handleNestedChange('general', 'logoUrl', src);
        showNotification('success', 'Logo loaded! Click "Save Changes" to apply.');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const res = await apiFetch('/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save settings.');
      }

      // Synchronize in real time with localStorage and custom event so Sidebar/Layout update instantly
      if (typeof window !== 'undefined') {
        const brandData = buildBrandSettings(settings);
        localStorage.setItem('dealership_brand', JSON.stringify(brandData));
        localStorage.setItem('dealership_settings', JSON.stringify(settings));
        window.dispatchEvent(new CustomEvent('dealership-settings-updated', { detail: brandData }));
      }

      showNotification('success', 'Settings updated and applied across the system successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setResetting(true);
      const res = await apiFetch('/settings/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset settings.');
      const data = await res.json();
      setSettings(data);
      setShowResetConfirm(false);

      if (typeof window !== 'undefined') {
        const brandData = buildBrandSettings(data);
        localStorage.setItem('dealership_brand', JSON.stringify(brandData));
        window.dispatchEvent(new CustomEvent('dealership-settings-updated', { detail: brandData }));
      }

      showNotification('success', 'All settings restored to factory defaults!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reset settings.');
    } finally {
      setResetting(false);
    }
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const items = [...(settings.vehicles?.inspectionChecklistItems || []), newChecklistItem.trim()];
    handleNestedChange('vehicles', 'inspectionChecklistItems', items);
    setNewChecklistItem('');
  };

  const removeChecklistItem = (index: number) => {
    const items = (settings.vehicles?.inspectionChecklistItems || []).filter((_: any, i: number) => i !== index);
    handleNestedChange('vehicles', 'inspectionChecklistItems', items);
  };

  const addLeasingPartner = () => {
    if (!newPartner.trim()) return;
    const partners = [...(settings.leasing?.preferredPartners || []), newPartner.trim()];
    handleNestedChange('leasing', 'preferredPartners', partners);
    setNewPartner('');
  };

  const removeLeasingPartner = (index: number) => {
    const partners = (settings.leasing?.preferredPartners || []).filter((_: any, i: number) => i !== index);
    handleNestedChange('leasing', 'preferredPartners', partners);
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'commerce', label: 'Commerce', icon: DollarSign },
    { id: 'vehicles', label: 'Motorcycles & Stock', icon: Car },
    { id: 'leasing', label: 'Loyalty & Finance', icon: Landmark },
    { id: 'receiptDesigner', label: 'Receipt/A4 Designer', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'permissions', label: 'Permissions', icon: ShieldCheck },
    { id: 'social', label: 'Social', icon: Share2 },
    { id: 'advanced', label: 'Advanced', icon: Sliders },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-16 settings-form text-slate-900">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Brand Settings
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage your TVS motorcycle dealership storefront configuration, sales policies, and system preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={saving}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm animate-fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
        )}

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading dealership configuration...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Shop Branding Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Shop Branding</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure your TVS motorcycle dealership name, visual logo, and storefront tagline
                    </p>
                  </div>

                  {/* Logo Upload Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                    <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative group">
                      {settings.general?.logoUrl ? (
                        <img
                          src={settings.general.logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <ImageIcon className="w-8 h-8 mb-1" />
                          <span className="text-[11px] font-medium">Logo</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors flex items-center gap-2 shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>Upload Logo</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/svg+xml, image/webp"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                        </label>
                        {settings.general?.logoUrl && (
                          <button
                            onClick={() => handleNestedChange('general', 'logoUrl', '')}
                            className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium cursor-pointer"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">PNG, JPG, or SVG. Max 2MB.</p>
                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder="Or enter logo image URL directly (e.g. https://...)"
                          value={settings.general?.logoUrl || ''}
                          onChange={(e) => handleNestedChange('general', 'logoUrl', e.target.value)}
                          className="w-full sm:w-96 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shop Name & Tagline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Shop Name / Dealership Name
                      </label>
                      <input
                        type="text"
                        value={settings.general?.dealershipName || ''}
                        onChange={(e) => handleNestedChange('general', 'dealershipName', e.target.value)}
                        placeholder="TVS SalesPlus Motor Hub"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tagline</label>
                      <input
                        type="text"
                        value={settings.general?.tagline || ''}
                        onChange={(e) => handleNestedChange('general', 'tagline', e.target.value)}
                        placeholder="Official TVS Motorcycle Dealer — Sri Lanka"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Business Reg & VAT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Business Registration (BR) Number
                      </label>
                      <input
                        type="text"
                        value={settings.general?.registrationNumber || ''}
                        onChange={(e) => handleNestedChange('general', 'registrationNumber', e.target.value)}
                        placeholder="PV-89214/2024"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        VAT / Tax Registration Number
                      </label>
                      <input
                        type="text"
                        value={settings.general?.taxNumber || ''}
                        onChange={(e) => handleNestedChange('general', 'taxNumber', e.target.value)}
                        placeholder="VAT-119284729-7000"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Footer</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Customize the copyright footer notice shown across invoices and customer screens
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Footer Text</label>
                    <input
                      type="text"
                      value={settings.general?.footerText || ''}
                      onChange={(e) => handleNestedChange('general', 'footerText', e.target.value)}
                      placeholder="© 2026 SalesPlus. All rights reserved."
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Contact & Location Details</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official dealership address, support telephone numbers, and showroom working hours
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dealership Showroom Address</label>
                    <input
                      type="text"
                      value={settings.contact?.address || ''}
                      onChange={(e) => handleNestedChange('contact', 'address', e.target.value)}
                      placeholder="No. 142/B, Baseline Road, Colombo 09"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                      <input
                        type="text"
                        value={settings.contact?.city || ''}
                        onChange={(e) => handleNestedChange('contact', 'city', e.target.value)}
                        placeholder="Colombo"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Province / State</label>
                      <input
                        type="text"
                        value={settings.contact?.province || ''}
                        onChange={(e) => handleNestedChange('contact', 'province', e.target.value)}
                        placeholder="Western Province"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Postal Code</label>
                      <input
                        type="text"
                        value={settings.contact?.postalCode || ''}
                        onChange={(e) => handleNestedChange('contact', 'postalCode', e.target.value)}
                        placeholder="00900"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Telephone / Landline</label>
                      <input
                        type="text"
                        value={settings.contact?.phone || ''}
                        onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                        placeholder="+94 11 268 4900"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Direct Sales Hotline</label>
                      <input
                        type="text"
                        value={settings.contact?.hotline || ''}
                        onChange={(e) => handleNestedChange('contact', 'hotline', e.target.value)}
                        placeholder="+94 77 123 4567"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Sales Email</label>
                      <input
                        type="email"
                        value={settings.contact?.salesEmail || ''}
                        onChange={(e) => handleNestedChange('contact', 'salesEmail', e.target.value)}
                        placeholder="sales@salesplus.lk"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer Support Email</label>
                      <input
                        type="email"
                        value={settings.contact?.supportEmail || ''}
                        onChange={(e) => handleNestedChange('contact', 'supportEmail', e.target.value)}
                        placeholder="support@salesplus.lk"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Showroom Opening Hours</label>
                      <input
                        type="text"
                        value={settings.contact?.openingHours || ''}
                        onChange={(e) => handleNestedChange('contact', 'openingHours', e.target.value)}
                        placeholder="Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Google Maps URL</label>
                      <input
                        type="url"
                        value={settings.contact?.googleMapsUrl || ''}
                        onChange={(e) => handleNestedChange('contact', 'googleMapsUrl', e.target.value)}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. COMMERCE TAB */}
            {activeTab === 'commerce' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Commerce & Sales Policies</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Currency denomination, invoice numbering prefixes, VAT tax rates, and reservation validity
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Operating Currency</label>
                    <select
                      value={settings.commerce?.currency || 'LKR'}
                      onChange={(e) => handleNestedChange('commerce', 'currency', e.target.value)}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="LKR">LKR - Sri Lankan Rupee</option>
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="JPY">JPY - Japanese Yen (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Currency Symbol</label>
                    <input
                      type="text"
                      value={settings.commerce?.currencySymbol || 'Rs.'}
                      onChange={(e) => handleNestedChange('commerce', 'currencySymbol', e.target.value)}
                      placeholder="Rs."
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Default VAT / Tax Rate (%)</label>
                    <input
                      type="number"
                      value={settings.commerce?.vatPercentage ?? 18}
                      onChange={(e) => handleNestedChange('commerce', 'vatPercentage', Number(e.target.value))}
                      placeholder="18"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Quotation Validity (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.commerce?.quotationValidityDays ?? 14}
                      onChange={(e) => handleNestedChange('commerce', 'quotationValidityDays', Number(e.target.value))}
                      placeholder="14"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Reservation Hold Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.commerce?.reservationHoldDays ?? 3}
                      onChange={(e) => handleNestedChange('commerce', 'reservationHoldDays', Number(e.target.value))}
                      placeholder="3"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Minimum Downpayment (%)
                    </label>
                    <input
                      type="number"
                      value={settings.commerce?.minDownpaymentPercentage ?? 20}
                      onChange={(e) => handleNestedChange('commerce', 'minDownpaymentPercentage', Number(e.target.value))}
                      placeholder="20"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Prefixes */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Document Numbering Prefixes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Prefix</label>
                      <input
                        type="text"
                        value={settings.commerce?.invoicePrefix || 'INV-'}
                        onChange={(e) => handleNestedChange('commerce', 'invoicePrefix', e.target.value)}
                        placeholder="INV-"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Quotation Prefix</label>
                      <input
                        type="text"
                        value={settings.commerce?.quotationPrefix || 'QUO-'}
                        onChange={(e) => handleNestedChange('commerce', 'quotationPrefix', e.target.value)}
                        placeholder="QUO-"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Agreement Prefix</label>
                      <input
                        type="text"
                        value={settings.commerce?.agreementPrefix || 'AGR-'}
                        onChange={(e) => handleNestedChange('commerce', 'agreementPrefix', e.target.value)}
                        placeholder="AGR-"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Order Prefix</label>
                      <input
                        type="text"
                        value={settings.commerce?.purchasePrefix || 'PUR-'}
                        onChange={(e) => handleNestedChange('commerce', 'purchasePrefix', e.target.value)}
                        placeholder="PUR-"
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Discount controls */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Discount Authorization Threshold</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Discounts exceeding this threshold require Manager or Owner approval
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium">Max Staff Discount:</span>
                    <input
                      type="number"
                      value={settings.commerce?.maxStaffDiscountPercentage ?? 5}
                      onChange={(e) => handleNestedChange('commerce', 'maxStaffDiscountPercentage', Number(e.target.value))}
                      className="w-20 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-center font-bold"
                    />
                    <span className="text-xs text-slate-600 font-medium">%</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. VEHICLES & STANDARDS TAB */}
            {activeTab === 'vehicles' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Motorcycles & PDI Inspection Standards</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Warranty standards, test ride booking rules, and standard Pre-Delivery Inspection (PDI) checklists for TVS motorcycles
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Odometer Distance Unit</label>
                    <select
                      value={settings.vehicles?.mileageUnit || 'km'}
                      onChange={(e) => handleNestedChange('vehicles', 'mileageUnit', e.target.value)}
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="km">Kilometers (km)</option>
                      <option value="mi">Miles (mi)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Default Warranty (Months)</label>
                    <input
                      type="number"
                      value={settings.vehicles?.defaultWarrantyMonths ?? 12}
                      onChange={(e) => handleNestedChange('vehicles', 'defaultWarrantyMonths', Number(e.target.value))}
                      placeholder="12"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Default Warranty (Distance)</label>
                    <input
                      type="number"
                      value={settings.vehicles?.defaultWarrantyKm ?? 20000}
                      onChange={(e) => handleNestedChange('vehicles', 'defaultWarrantyKm', Number(e.target.value))}
                      placeholder="20000"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Standard Test Drive Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.vehicles?.defaultTestDriveDurationMinutes ?? 30}
                      onChange={(e) => handleNestedChange('vehicles', 'defaultTestDriveDurationMinutes', Number(e.target.value))}
                      placeholder="30"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="drivingLicenseReq"
                      checked={settings.vehicles?.requireDrivingLicenseForTestDrive ?? true}
                      onChange={(e) => handleNestedChange('vehicles', 'requireDrivingLicenseForTestDrive', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                    />
                    <label htmlFor="drivingLicenseReq" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Require driving license verification prior to test-drive authorization
                    </label>
                  </div>
                </div>

                {/* Pre-Delivery Inspection Checklist */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Standard Pre-Delivery Inspection (PDI) Checklist Items
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new checklist requirement..."
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={addChecklistItem}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(settings.vehicles?.inspectionChecklistItems || []).map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                      >
                        <span className="truncate">{item}</span>
                        <button
                          onClick={() => removeChecklistItem(idx)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Delete checklist item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. LOYALTY & FINANCE TAB */}
            {activeTab === 'leasing' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Loyalty, Commissions & Leasing Facilities</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Leasing benchmark interest rates, staff sales commission defaults, and approved bank partners
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Default Leasing Tenor (Months)
                    </label>
                    <input
                      type="number"
                      value={settings.leasing?.defaultLeasingTenorMonths ?? 60}
                      onChange={(e) => handleNestedChange('leasing', 'defaultLeasingTenorMonths', Number(e.target.value))}
                      placeholder="60"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Base Leasing Interest Rate (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.leasing?.defaultInterestRate ?? 14.5}
                      onChange={(e) => handleNestedChange('leasing', 'defaultInterestRate', Number(e.target.value))}
                      placeholder="14.5"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Sales Staff Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.leasing?.commissionRate ?? 2.5}
                      onChange={(e) => handleNestedChange('leasing', 'commissionRate', Number(e.target.value))}
                      placeholder="2.5"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Customer Referral Bonus (Rs.)
                    </label>
                    <input
                      type="number"
                      value={settings.leasing?.referralBonus ?? 25000}
                      onChange={(e) => handleNestedChange('leasing', 'referralBonus', Number(e.target.value))}
                      placeholder="25000"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Financing Guidelines / CBSL Note
                    </label>
                    <input
                      type="text"
                      value={settings.leasing?.termsAndNotes || ''}
                      onChange={(e) => handleNestedChange('leasing', 'termsAndNotes', e.target.value)}
                      placeholder="Subject to CBSL regulations and credit approval."
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Preferred Leasing Banks */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Preferred Banking & Leasing Partners
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add partner bank / leasing company (e.g. Commercial Bank, HNB, Sampath)..."
                      value={newPartner}
                      onChange={(e) => setNewPartner(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addLeasingPartner()}
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={addLeasingPartner}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bank</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {(settings.leasing?.preferredPartners || []).map((partner: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-medium"
                      >
                        <span>{partner}</span>
                        <button
                          onClick={() => removeLeasingPartner(idx)}
                          className="text-blue-500 hover:text-red-600 cursor-pointer"
                          title="Remove partner"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. RECEIPT / A4 DESIGNER TAB */}
            {activeTab === 'receiptDesigner' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Receipt / A4 Designer & Bank Transfer Details</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize official print layout headings, bank account transfer instructions, and sales terms
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Invoice Official Header Title
                    </label>
                    <input
                      type="text"
                      value={settings.receiptDesigner?.invoiceHeader || ''}
                      onChange={(e) => handleNestedChange('receiptDesigner', 'invoiceHeader', e.target.value)}
                      placeholder="VEHICLE SALES INVOICE & DELIVERY ORDER"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Quotation Official Header Title
                    </label>
                    <input
                      type="text"
                      value={settings.receiptDesigner?.quotationHeader || ''}
                      onChange={(e) => handleNestedChange('receiptDesigner', 'quotationHeader', e.target.value)}
                      placeholder="OFFICIAL VEHICLE SALES QUOTATION"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>

                {/* Bank Account Wire Transfer Details */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Landmark className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Official Bank Account (Printed on Invoices & Quotations)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={settings.receiptDesigner?.bankName || ''}
                        onChange={(e) => handleNestedChange('receiptDesigner', 'bankName', e.target.value)}
                        placeholder="Commercial Bank of Ceylon PLC"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Account Name / Beneficiary</label>
                      <input
                        type="text"
                        value={settings.receiptDesigner?.bankAccountName || ''}
                        onChange={(e) => handleNestedChange('receiptDesigner', 'bankAccountName', e.target.value)}
                        placeholder="TVS SalesPlus Motor Hub (Pvt) Ltd"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={settings.receiptDesigner?.bankAccountNumber || ''}
                        onChange={(e) => handleNestedChange('receiptDesigner', 'bankAccountNumber', e.target.value)}
                        placeholder="1000 4829 3819"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name</label>
                      <input
                        type="text"
                        value={settings.receiptDesigner?.bankBranch || ''}
                        onChange={(e) => handleNestedChange('receiptDesigner', 'bankBranch', e.target.value)}
                        placeholder="Colombo Main Branch"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">SWIFT / Routing Code</label>
                      <input
                        type="text"
                        value={settings.receiptDesigner?.bankSwift || ''}
                        onChange={(e) => handleNestedChange('receiptDesigner', 'bankSwift', e.target.value)}
                        placeholder="CCEYLKAX"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Authorized Signatory Title</label>
                      <input
                        type="text"
                        value={settings.receiptDesigner?.authorizedSignatory || ''}
                        onChange={(e) => handleNestedChange('receiptDesigner', 'authorizedSignatory', e.target.value)}
                        placeholder="Director / General Manager"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Standard Terms & Conditions Clause (Print A4)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.receiptDesigner?.termsConditions || ''}
                    onChange={(e) => handleNestedChange('receiptDesigner', 'termsConditions', e.target.value)}
                    placeholder="1. All motorcycles undergo comprehensive PDI inspection..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Invoice Footer Closing Note
                  </label>
                  <input
                    type="text"
                    value={settings.receiptDesigner?.footerNote || ''}
                    onChange={(e) => handleNestedChange('receiptDesigner', 'footerNote', e.target.value)}
                    placeholder="Thank you for choosing TVS SalesPlus Motor Hub! Ride safe."
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 7. TEMPLATES TAB */}
            {activeTab === 'templates' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Communication & Notification Templates</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated SMS and email notification templates dispatched to customers and sales executives
                  </p>
                </div>

                {/* Available Variables Badge bar */}
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block mb-1.5">
                    Supported Variables:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '{customer_name}',
                      '{motorcycle_name}',
                      '{ref_id}',
                      '{price}',
                      '{expiry_date}',
                      '{dealership_name}',
                      '{sales_phone}',
                      '{bank_name}',
                      '{account_no}',
                      '{due_date}',
                    ].map((v) => (
                      <span
                        key={v}
                        className="px-2 py-0.5 bg-white border border-blue-200 text-blue-700 rounded-md text-[11px] font-mono font-medium"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Quotation Issued Notification Template
                    </label>
                    <textarea
                      rows={3}
                      value={settings.templates?.quotationTemplate || ''}
                      onChange={(e) => handleNestedChange('templates', 'quotationTemplate', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Motorcycle Booking Confirmation Template
                    </label>
                    <textarea
                      rows={3}
                      value={settings.templates?.reservationTemplate || ''}
                      onChange={(e) => handleNestedChange('templates', 'reservationTemplate', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      TVS Test Ride Booking Confirmation Template
                    </label>
                    <textarea
                      rows={3}
                      value={settings.templates?.testDriveTemplate || ''}
                      onChange={(e) => handleNestedChange('templates', 'testDriveTemplate', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Motorcycle Handover Ready Template
                    </label>
                    <textarea
                      rows={3}
                      value={settings.templates?.handoverTemplate || ''}
                      onChange={(e) => handleNestedChange('templates', 'handoverTemplate', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Payment Due / Installment Reminder Template
                    </label>
                    <textarea
                      rows={3}
                      value={settings.templates?.paymentReminderTemplate || ''}
                      onChange={(e) => handleNestedChange('templates', 'paymentReminderTemplate', e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. PERMISSIONS TAB */}
            {activeTab === 'permissions' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Permissions & Access Control Overview</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Default module access guidelines across dealership organizational roles
                    </p>
                  </div>
                  <Link
                    href="/dashboard/users"
                    className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Manage Staff & Roles</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Role</th>
                        <th className="p-3">Motorcycles</th>
                        <th className="p-3">Sales & Invoicing</th>
                        <th className="p-3">Finance & Ledgers</th>
                        <th className="p-3">CRM & Leads</th>
                        <th className="p-3">System Settings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Admin / Owner</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Access</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Access</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Access</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Access</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Access</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Sales & Operations</td>
                        <td className="p-3 text-slate-800">View / Reserve</td>
                        <td className="p-3 text-slate-800">Create / View</td>
                        <td className="p-3 text-slate-400">Restricted</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Access</td>
                        <td className="p-3 text-slate-400">Read Only</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Accountant / Finance Staff</td>
                        <td className="p-3 text-slate-800">View Only</td>
                        <td className="p-3 text-slate-800">View / Reconcile</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Access</td>
                        <td className="p-3 text-slate-400">Restricted</td>
                        <td className="p-3 text-slate-400">Read Only</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold text-slate-900">Inventory Manager</td>
                        <td className="p-3 text-emerald-600 font-semibold">Full Stock Control</td>
                        <td className="p-3 text-slate-400">Read Only</td>
                        <td className="p-3 text-slate-400">Restricted</td>
                        <td className="p-3 text-slate-400">Restricted</td>
                        <td className="p-3 text-slate-400">Restricted</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 9. SOCIAL TAB */}
            {activeTab === 'social' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Social Media & Online Presence</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect official social channels, customer WhatsApp numbers, and video portals
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      WhatsApp Business Number / Link
                    </label>
                    <input
                      type="text"
                      value={settings.social?.whatsapp || ''}
                      onChange={(e) => handleNestedChange('social', 'whatsapp', e.target.value)}
                      placeholder="+94771234567 or https://wa.me/..."
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Website URL</label>
                    <input
                      type="url"
                      value={settings.social?.website || ''}
                      onChange={(e) => handleNestedChange('social', 'website', e.target.value)}
                      placeholder="https://salesplus.lk"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facebook Page URL</label>
                    <input
                      type="url"
                      value={settings.social?.facebook || ''}
                      onChange={(e) => handleNestedChange('social', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/salesplusautomart"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Instagram Handle / URL</label>
                    <input
                      type="url"
                      value={settings.social?.instagram || ''}
                      onChange={(e) => handleNestedChange('social', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/salesplusautomart"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={settings.social?.youtube || ''}
                      onChange={(e) => handleNestedChange('social', 'youtube', e.target.value)}
                      placeholder="https://youtube.com/@salesplusautomart"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">TikTok / LinkedIn URL</label>
                    <input
                      type="url"
                      value={settings.social?.tiktok || ''}
                      onChange={(e) => handleNestedChange('social', 'tiktok', e.target.value)}
                      placeholder="https://tiktok.com/@..."
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 10. ADVANCED TAB */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">System Preferences & Automation</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      System timeout policies, automatic reservation expiration, and maintenance mode controls
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">System Timezone</label>
                      <input
                        type="text"
                        value={settings.system?.timeZone || 'Asia/Colombo (GMT+5:30)'}
                        onChange={(e) => handleNestedChange('system', 'timeZone', e.target.value)}
                        placeholder="Asia/Colombo (GMT+5:30)"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Inactivity Session Timeout (Minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.system?.sessionTimeoutMinutes ?? 60}
                        onChange={(e) => handleNestedChange('system', 'sessionTimeoutMinutes', Number(e.target.value))}
                        placeholder="60"
                        className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.system?.autoExpireReservations ?? true}
                        onChange={(e) => handleNestedChange('system', 'autoExpireReservations', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">
                          Auto-expire reservations when the hold duration passes without full deposit
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Automatically marks motorcycles as Available in inventory when booking reservation expires.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.system?.enablePublicInquiries ?? true}
                        onChange={(e) => handleNestedChange('system', 'enablePublicInquiries', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">
                          Accept public website enquiries & test-drive requests directly into CRM
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Enables new leads generation directly from customer facing pages.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.system?.notifyOnNewLead ?? true}
                        onChange={(e) => handleNestedChange('system', 'notifyOnNewLead', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-xs font-semibold text-slate-800 block">
                          In-app notifications when high-priority leads or test-drive bookings arrive
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={settings.system?.maintenanceMode ?? false}
                        onChange={(e) => handleNestedChange('system', 'maintenanceMode', e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded-md border-amber-300 focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-amber-900 block flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          System Maintenance Mode
                        </span>
                        <span className="text-[11px] text-amber-700">
                          When active, only Admin/Owner accounts can perform write operations.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-red-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Danger Zone: Factory Settings Reset
                    </h3>
                    <p className="text-xs text-red-700 mt-0.5">
                      Reset all settings back to default dealership configuration. This will erase custom prefixes, bank accounts, and custom templates.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Reset All Settings to Factory Defaults
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Restore Factory Settings?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to restore all dealership settings, templates, and prefixes to their default
                  values? Any custom branding or bank accounts will be reset.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  disabled={resetting}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetDefaults}
                  disabled={resetting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {resetting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Yes, Reset to Defaults</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
