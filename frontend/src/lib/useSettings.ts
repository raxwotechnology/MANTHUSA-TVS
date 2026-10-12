"use client";

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from './api';

export interface BrandSettings {
  dealershipName: string;
  tagline: string;
  registrationNumber?: string;
  taxNumber?: string;
  logoUrl?: string;
  faviconUrl?: string;
  footerText?: string;
  defaultLanguage?: string;
  currency?: string;
  currencySymbol?: string;
  phone?: string;
  hotline?: string;
  email?: string;
  salesEmail?: string;
  supportEmail?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  openingHours?: string;
  googleMapsUrl?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
  tiktok?: string;
  vehicles?: Record<string, any>;
  leasing?: Record<string, any>;
  contact?: Record<string, any>;
  social?: Record<string, any>;
  commerce?: Record<string, any>;
  general?: Record<string, any>;
  [key: string]: any;
}

export const DEFAULT_BRAND: BrandSettings = {
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
  phone: '+94 11 268 4900',
  hotline: '+94 77 123 4567',
  email: 'sales@salesplus.lk',
  salesEmail: 'sales@salesplus.lk',
  supportEmail: 'support@salesplus.lk',
  address: 'No. 142/B, Baseline Road, Colombo 09, Sri Lanka',
  city: 'Colombo',
  province: 'Western Province',
  postalCode: '00900',
  openingHours: 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)',
  googleMapsUrl: 'https://maps.google.com/?q=Colombo+Sri+Lanka',
  whatsapp: '+94771234567',
  facebook: 'https://facebook.com/salesplusautomart',
  instagram: 'https://instagram.com/salesplusautomart',
  youtube: 'https://youtube.com/@salesplusautomart',
  website: 'https://salesplus.lk',
  tiktok: '',
  vehicles: {},
  leasing: {},
};

export function buildBrandSettings(data: any): BrandSettings {
  if (!data) return DEFAULT_BRAND;

  const general = data.general || (data.dealershipName ? data : {});
  const contact = data.contact || {};
  const commerce = data.commerce || {};
  const social = data.social || {};
  const vehicles = data.vehicles || {};
  const leasing = data.leasing || {};

  return {
    ...DEFAULT_BRAND,
    ...general,
    dealershipName: general.dealershipName || data.dealershipName || DEFAULT_BRAND.dealershipName,
    tagline: general.tagline || data.tagline || DEFAULT_BRAND.tagline,
    logoUrl: general.logoUrl !== undefined ? general.logoUrl : (data.logoUrl !== undefined ? data.logoUrl : DEFAULT_BRAND.logoUrl),
    faviconUrl: general.faviconUrl !== undefined ? general.faviconUrl : (data.faviconUrl !== undefined ? data.faviconUrl : DEFAULT_BRAND.faviconUrl),
    footerText: general.footerText || data.footerText || DEFAULT_BRAND.footerText,
    registrationNumber: general.registrationNumber || data.registrationNumber || DEFAULT_BRAND.registrationNumber,
    taxNumber: general.taxNumber || data.taxNumber || DEFAULT_BRAND.taxNumber,
    phone: contact.phone || data.phone || contact.hotline || data.hotline || DEFAULT_BRAND.phone,
    hotline: contact.hotline || data.hotline || contact.phone || data.phone || DEFAULT_BRAND.hotline,
    email: contact.salesEmail || contact.supportEmail || data.email || data.salesEmail || DEFAULT_BRAND.email,
    salesEmail: contact.salesEmail || data.salesEmail || DEFAULT_BRAND.salesEmail,
    supportEmail: contact.supportEmail || data.supportEmail || DEFAULT_BRAND.supportEmail,
    address: contact.address || data.address || DEFAULT_BRAND.address,
    city: contact.city || data.city || DEFAULT_BRAND.city,
    province: contact.province || data.province || DEFAULT_BRAND.province,
    postalCode: contact.postalCode || data.postalCode || DEFAULT_BRAND.postalCode,
    openingHours: contact.openingHours || data.openingHours || DEFAULT_BRAND.openingHours,
    googleMapsUrl: contact.googleMapsUrl || data.googleMapsUrl || DEFAULT_BRAND.googleMapsUrl,
    whatsapp: social.whatsapp || data.whatsapp || contact.hotline || contact.phone || DEFAULT_BRAND.whatsapp,
    facebook: social.facebook || data.facebook || DEFAULT_BRAND.facebook,
    instagram: social.instagram || data.instagram || DEFAULT_BRAND.instagram,
    youtube: social.youtube || data.youtube || DEFAULT_BRAND.youtube,
    website: social.website || data.website || DEFAULT_BRAND.website,
    tiktok: social.tiktok || data.tiktok || '',
    currency: commerce.currency || general.currency || data.currency || DEFAULT_BRAND.currency,
    currencySymbol: commerce.currencySymbol || general.currencySymbol || data.currencySymbol || DEFAULT_BRAND.currencySymbol,
    contact: { ...DEFAULT_BRAND.contact, ...contact },
    social: { ...DEFAULT_BRAND.social, ...social },
    commerce: { ...DEFAULT_BRAND.commerce, ...commerce },
    general: { ...DEFAULT_BRAND.general, ...general },
    vehicles: { ...vehicles },
    leasing: { ...leasing },
  };
}

function applyFaviconAndTitle(settings: BrandSettings) {
  if (typeof document === 'undefined') return;

  // Dynamically sync favicon
  const iconUrl = settings.faviconUrl || settings.logoUrl;
  if (iconUrl) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<BrandSettings>(DEFAULT_BRAND);
  const [loading, setLoading] = useState(true);

  const fetchLatest = useCallback(async () => {
    try {
      const res = await apiFetch('/settings/public');
      if (res.ok) {
        const data = await res.json();
        const merged = buildBrandSettings(data);
        setSettings(merged);
        if (typeof window !== 'undefined') {
          localStorage.setItem('dealership_brand', JSON.stringify(merged));
          applyFaviconAndTitle(merged);
        }
      }
    } catch (err) {
      // Silently fall back to cached
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Load from cache on client mount without causing SSR hydration mismatch
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('dealership_brand');
        if (cached) {
          const parsed = JSON.parse(cached);
          const merged = buildBrandSettings(parsed);
          if (isMounted) {
            setSettings(merged);
            applyFaviconAndTitle(merged);
          }
        }
      }
    } catch (e) {
      // ignore
    }

    fetchLatest();

    const handleUpdate = (e: any) => {
      if (!isMounted) return;
      if (e.detail) {
        const updated = buildBrandSettings(e.detail);
        localStorage.setItem('dealership_brand', JSON.stringify(updated));
        applyFaviconAndTitle(updated);
        setTimeout(() => {
          if (isMounted) setSettings(updated);
        }, 0);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (!isMounted) return;
      if (e.key === 'dealership_brand' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const updated = buildBrandSettings(parsed);
          applyFaviconAndTitle(updated);
          setSettings(updated);
        } catch {
          // ignore error
        }
      }
    };

    window.addEventListener('dealership-settings-updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener('dealership-settings-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [fetchLatest]);

  return { settings, loading, reload: fetchLatest };
}
