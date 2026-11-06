"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
import {
  Globe,
  Settings,
  Layout,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Phone,
  Building,
  Car,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Inbox,
  Share2,
  CalendarCheck,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { buildBrandSettings } from '@/lib/useSettings';

type CMSTab =
  | 'announcement'
  | 'hero'
  | 'sections'
  | 'submissions'
  | 'pages';

export default function AdminWebsiteCMSPage() {
  const [activeTab, setActiveTab] = useState<CMSTab>('announcement');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Submissions Live Data
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [testDrives, setTestDrives] = useState<any[]>([]);
  const [valuations, setValuations] = useState<any[]>([]);
  const [submissionTab, setSubmissionTab] = useState<'inquiries' | 'testDrives' | 'valuations'>('inquiries');

  // Full settings state
  const [settings, setSettings] = useState<any>({
    general: {
      dealershipName: 'MANTHUSA TVS',
      tagline: "Official TVS Motorcycles & Scooters Dealership, Service & Genuine Parts",
      registrationNumber: 'TVS-LK-89214/2026',
      taxNumber: 'VAT-119284729-7000',
      logoUrl: '',
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
    social: {
      whatsapp: '+94756000310',
      facebook: 'https://facebook.com/manthusatvs',
      instagram: 'https://instagram.com/manthusatvs',
      youtube: 'https://youtube.com/@manthusatvs',
      website: 'https://manthusatvs.lk',
      tiktok: '',
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
  });

  useEffect(() => {
    async function loadCMSData() {
      try {
        setLoading(true);
        const [settingsRes, leadsRes, drivesRes, valsRes] = await Promise.all([
          apiFetch('/settings').then((r) => (r.ok ? r.json() : null)).catch(() => null),
          apiFetch('/leads').then((r) => (r.ok ? r.json() : [])).catch(() => []),
          apiFetch('/test-drives').then((r) => (r.ok ? r.json() : [])).catch(() => []),
          apiFetch('/vehicle-valuations').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        ]);

        if (settingsRes) {
          setSettings((prev: any) => {
            const updated = {
              ...prev,
              ...settingsRes,
              website: {
                ...prev.website,
                ...(settingsRes.website || {}),
                announcement: {
                  ...prev.website?.announcement,
                  ...(settingsRes.website?.announcement || {}),
                },
                hero: {
                  ...prev.website?.hero,
                  ...(settingsRes.website?.hero || {}),
                },
                sections: {
                  ...prev.website?.sections,
                  ...(settingsRes.website?.sections || {}),
                },
                pages: {
                  ...prev.website?.pages,
                  ...(settingsRes.website?.pages || {}),
                },
              },
            };

            if (typeof window !== 'undefined') {
              const brandData = buildBrandSettings(updated);
              localStorage.setItem('dealership_brand', JSON.stringify(brandData));
              window.dispatchEvent(new CustomEvent('dealership-settings-updated', { detail: brandData }));
            }

            return updated;
          });
        }

        setInquiries(Array.isArray(leadsRes) ? leadsRes : []);
        setTestDrives(Array.isArray(drivesRes) ? drivesRes : []);
        setValuations(Array.isArray(valsRes) ? valsRes : []);
      } catch (err) {
        console.error('Error loading CMS data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCMSData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleNested = (section: string, field: string, val: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: val,
      },
    }));
  };

  const handleWebsiteNested = (sub: string, field: string, val: any) => {
    setSettings((prev: any) => ({
      ...prev,
      website: {
        ...(prev.website || {}),
        [sub]: {
          ...(prev.website?.[sub] || {}),
          [field]: val,
        },
      },
    }));
  };

  const handleSaveCMS = async () => {
    try {
      setSaving(true);
      const res = await apiFetch('/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save website content.');
      }

      if (typeof window !== 'undefined') {
        const brandData = buildBrandSettings(settings);
        localStorage.setItem('dealership_brand', JSON.stringify(brandData));
        localStorage.setItem('dealership_settings', JSON.stringify(settings));
        window.dispatchEvent(new CustomEvent('dealership-settings-updated', { detail: brandData }));
      }

      showNotification('success', 'Public website content and CMS settings updated successfully!');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status: newStatus } : i))
        );
        showNotification('success', `Inquiry status updated to ${newStatus}`);
      }
    } catch {
      showNotification('error', 'Failed to update status');
    }
  };

  const handleUpdateTestDriveStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/test-drives/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTestDrives((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
        );
        showNotification('success', `Test drive status updated to ${newStatus}`);
      }
    } catch {
      showNotification('error', 'Failed to update test drive');
    }
  };

  const handleUpdateValuationStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/vehicle-valuations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setValuations((prev) =>
          prev.map((v) => (v._id === id ? { ...v, status: newStatus } : v))
        );
        showNotification('success', `Valuation status updated to ${newStatus}`);
      }
    } catch {
      showNotification('error', 'Failed to update valuation');
    }
  };

  const tabs: { id: CMSTab; label: string; icon: any }[] = [
    { id: 'announcement', label: 'Announcement & Footer', icon: Sparkles },
    { id: 'hero', label: 'Homepage Hero & Banner', icon: Layout },
    { id: 'sections', label: 'Dynamic Homepage Sections', icon: Sliders },
    {
      id: 'submissions',
      label: `Form Submissions (${inquiries.length + testDrives.length + valuations.length})`,
      icon: Inbox,
    },
    { id: 'pages', label: 'Static Pages Content', icon: FileText },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Public Website CMS Manager...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        {/* Page Header (Consistent with Dashboard Settings & Inventory) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Public Website CMS Portal
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Customize public website banners, hero photography, dynamic sections, and manage customer submissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Preview Live Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              onClick={handleSaveCMS}
              disabled={saving}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish CMS Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
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
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium text-xs sm:text-sm">{feedback.message}</span>
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
                  onClick={() => setActiveTab(tab.id as CMSTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: Announcement & Footer */}
        {activeTab === 'announcement' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            {/* Informational Link to Brand Settings */}
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl bg-blue-50/70 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Dealership Brand Name, Logo & Contact Details
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Your company logo, dealership name, tagline, showroom hotlines, and address are managed centrally in Brand Settings.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/settings"
                className="px-3.5 py-1.5 rounded-xl bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Brand Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Header Announcement Bar & Footer
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure your top dismissible promotional announcement bar and public footer copyright text.
                </p>
              </div>
            </div>

            {/* Announcement Bar Customizer */}
            <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Header Announcement Bar
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Display special import shipments, financing campaigns, or seasonal announcements across all public pages.
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.website?.announcement?.enabled !== false}
                    onChange={(e) => handleWebsiteNested('announcement', 'enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800">Show Bar</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Announcement Text
                </label>
                <textarea
                  rows={2}
                  value={settings.website?.announcement?.text || ''}
                  onChange={(e) => handleWebsiteNested('announcement', 'text', e.target.value)}
                  placeholder="e.g. Special March 2026 Import Clearance: Exclusive leasing rates starting from 13.5%!"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Direct Contact Phone in Bar
                  </label>
                  <input
                    type="text"
                    value={settings.website?.announcement?.phone || ''}
                    onChange={(e) => handleWebsiteNested('announcement', 'phone', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Operating Hours Text
                  </label>
                  <input
                    type="text"
                    value={settings.website?.announcement?.hours || ''}
                    onChange={(e) => handleWebsiteNested('announcement', 'hours', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer Copyright Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.general?.footerText || ''}
                onChange={(e) => handleNested('general', 'footerText', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Hero & Banner Editor */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Homepage Hero Section & Call-to-Actions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Craft the main headline, subtitle, primary CTA links, and luxury automotive hero background image.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Main Hero Headline
                </label>
                <input
                  type="text"
                  value={settings.website?.hero?.headline || ''}
                  onChange={(e) => handleWebsiteNested('hero', 'headline', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={settings.website?.hero?.subheadline || ''}
                  onChange={(e) => handleWebsiteNested('hero', 'subheadline', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Hero Background Image URL (High Resolution Photography)
                </label>
                <input
                  type="url"
                  value={settings.website?.hero?.backgroundImage || ''}
                  onChange={(e) => handleWebsiteNested('hero', 'backgroundImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              {/* Preview Thumbnail */}
              {settings.website?.hero?.backgroundImage && (
                <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                  <img
                    src={settings.website?.hero?.backgroundImage}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    Hero Photography Preview
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.website?.hero?.ctaPrimaryText || 'Browse Vehicles'}
                    onChange={(e) => handleWebsiteNested('hero', 'ctaPrimaryText', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Button Destination Link
                  </label>
                  <input
                    type="text"
                    value={settings.website?.hero?.ctaPrimaryLink || '/vehicles'}
                    onChange={(e) => handleWebsiteNested('hero', 'ctaPrimaryLink', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.website?.hero?.ctaSecondaryText || 'Sell Your Vehicle'}
                    onChange={(e) => handleWebsiteNested('hero', 'ctaSecondaryText', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Secondary Button Destination Link
                  </label>
                  <input
                    type="text"
                    value={settings.website?.hero?.ctaSecondaryLink || '/sell-your-vehicle'}
                    onChange={(e) => handleWebsiteNested('hero', 'ctaSecondaryLink', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Dynamic Homepage Sections Toggle */}
        {activeTab === 'sections' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Homepage Sections Toggle
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enable or hide specific sections on the public homepage to tailor your customer marketing funnel.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'showFeatured', label: 'Featured Showroom Vehicles', desc: 'Display top verified handpicked luxury vehicles' },
                { key: 'showLatestArrivals', label: 'Latest Direct Import Arrivals', desc: 'Display latest inventory added into VSMS' },
                { key: 'showCategories', label: 'Browse by Vehicle Body Category', desc: 'Show SUV, Sedan, Luxury, Electric, Van category cards' },
                { key: 'showWhyUs', label: 'Why Buy From Us Value Props', desc: 'Show auction sheet verification, warranty, inspection checks' },
                { key: 'showHowItWorks', label: 'How The Buying Process Works', desc: '4-step journey: browse, test-drive, leasing, handover' },
                { key: 'showFinancePromo', label: 'Leasing & Finance Promotion Banner', desc: 'Promote partner banks, 13.5% interest rates calculator' },
                { key: 'showTradeInPromo', label: 'Sell Your Vehicle & Valuation Banner', desc: 'Instant trade-in appraisal call-to-action banner' },
                { key: 'showContact', label: 'Location Map & Showroom Contact', desc: 'Baseline Road showroom address, hotline, and visiting hours' },
              ].map((item) => {
                const isEnabled = settings.website?.sections?.[item.key] !== false;
                return (
                  <div
                    key={item.key}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) => handleWebsiteNested('sections', item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: Form Submissions Live Review */}
        {activeTab === 'submissions' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Website Form Submissions Manager
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage incoming customer leads, test drive bookings, and vehicle valuation trade-in requests.
                  </p>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setSubmissionTab('inquiries')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    submissionTab === 'inquiries' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Inquiries ({inquiries.length})
                </button>
                <button
                  onClick={() => setSubmissionTab('testDrives')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    submissionTab === 'testDrives' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Test Drives ({testDrives.length})
                </button>
                <button
                  onClick={() => setSubmissionTab('valuations')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    submissionTab === 'valuations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Valuations ({valuations.length})
                </button>
              </div>
            </div>

            {/* Inquiries Table */}
            {submissionTab === 'inquiries' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Interested Vehicle</th>
                      <th className="p-3">Message / Type</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          No inquiries received yet.
                        </td>
                      </tr>
                    ) : (
                      inquiries.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{item.customer?.fullName || 'Customer'}</p>
                            <p className="text-[11px] text-slate-500">{item.customer?.phone || item.customer?.email}</p>
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {item.interestedVehicle
                              ? `${item.interestedVehicle.year || ''} ${item.interestedVehicle.make || ''} ${item.interestedVehicle.model || ''}`
                              : 'General Inquiry'}
                          </td>
                          <td className="p-3 max-w-xs truncate text-slate-600">
                            {item.inquiryMessage || item.inquiryType || '—'}
                          </td>
                          <td className="p-3 text-slate-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <select
                              value={item.status || 'New'}
                              onChange={(e) => handleUpdateInquiryStatus(item._id, e.target.value)}
                              className="text-[11px] font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Interested">Interested</option>
                              <option value="Quotation">Quotation</option>
                              <option value="Reserved">Reserved</option>
                              <option value="Won/Lost">Won / Closed</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <Link
                              href="/dashboard/leads"
                              className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                            >
                              Open in CRM →
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Test Drives Table */}
            {submissionTab === 'testDrives' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Scheduled Date & Time</th>
                      <th className="p-3">License Reg</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {testDrives.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          No test drives booked yet.
                        </td>
                      </tr>
                    ) : (
                      testDrives.map((drive) => (
                        <tr key={drive._id} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{drive.customer?.fullName || 'Customer'}</p>
                            <p className="text-[11px] text-slate-500">{drive.customer?.phone}</p>
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {drive.vehicle
                              ? `${drive.vehicle.year || ''} ${drive.vehicle.make || ''} ${drive.vehicle.model || ''}`
                              : 'Showroom Stock'}
                          </td>
                          <td className="p-3 text-slate-600">
                            {drive.date ? new Date(drive.date).toLocaleDateString() : 'Pending'} {drive.startTime || ''}
                          </td>
                          <td className="p-3 text-slate-500">{drive.drivingLicenseNo || 'N/A'}</td>
                          <td className="p-3">
                            <select
                              value={drive.status || 'Scheduled'}
                              onChange={(e) => handleUpdateTestDriveStatus(drive._id, e.target.value)}
                              className="text-[11px] font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="No Show">No Show</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <Link
                              href="/dashboard/test-drives"
                              className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                            >
                              Open in VSMS →
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Valuations Table */}
            {submissionTab === 'valuations' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Seller Details</th>
                      <th className="p-3">Vehicle Details</th>
                      <th className="p-3">Mileage & Condition</th>
                      <th className="p-3">Expected Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Appraisal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {valuations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          No valuation submissions yet.
                        </td>
                      </tr>
                    ) : (
                      valuations.map((val) => (
                        <tr key={val._id} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{val.sellerName || 'Seller'}</p>
                            <p className="text-[11px] text-slate-500">{val.sellerPhone || val.sellerEmail}</p>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {val.year} {val.make} {val.model} ({val.registrationNumber || 'Unregistered'})
                          </td>
                          <td className="p-3 text-slate-600">
                            {val.mileage ? `${Number(val.mileage).toLocaleString()} km` : '—'} · {val.condition || 'Good'}
                          </td>
                          <td className="p-3 text-emerald-600 font-extrabold">
                            {val.expectedPrice ? `Rs. ${Number(val.expectedPrice).toLocaleString()}` : 'Negotiable'}
                          </td>
                          <td className="p-3">
                            <select
                              value={val.status || 'Pending'}
                              onChange={(e) => handleUpdateValuationStatus(val._id, e.target.value)}
                              className="text-[11px] font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Inspected">Inspected</option>
                              <option value="Offer Made">Offer Made</option>
                              <option value="Purchased">Purchased</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <Link
                              href="/dashboard/valuations"
                              className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                            >
                              Valuation Desk →
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Static Pages Content */}
        {activeTab === 'pages' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Static Public Page Content Editor
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update legal notices, about company profile statements, and finance policies displayed to customers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  About Us Story & Mission (/about)
                </label>
                <textarea
                  rows={4}
                  value={settings.website?.pages?.about || ''}
                  onChange={(e) => handleWebsiteNested('pages', 'about', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Finance & Leasing Disclaimers (/finance)
                </label>
                <textarea
                  rows={3}
                  value={settings.website?.pages?.finance || ''}
                  onChange={(e) => handleWebsiteNested('pages', 'finance', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Terms of Service & Booking Policy (/terms)
                </label>
                <textarea
                  rows={3}
                  value={settings.website?.pages?.terms || ''}
                  onChange={(e) => handleWebsiteNested('pages', 'terms', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Privacy Policy & Confidentiality Statement (/privacy)
                </label>
                <textarea
                  rows={3}
                  value={settings.website?.pages?.privacy || ''}
                  onChange={(e) => handleWebsiteNested('pages', 'privacy', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
