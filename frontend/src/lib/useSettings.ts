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
  website?: any;
  socialWebsite?: string;
  tiktok?: string;
  websiteConfig?: Record<string, any>;
  vehicles?: Record<string, any>;
  leasing?: Record<string, any>;
  contact?: Record<string, any>;
  social?: Record<string, any>;
  commerce?: Record<string, any>;
  general?: Record<string, any>;
  [key: string]: any;
}

export const DEFAULT_WEBSITE_CMS = {
  announcement: {
    enabled: true,
    text: 'Special Season Offer: Get Free Registration, 2 Helmets & 3 Free Periodic Services on all TVS Apache & NTORQ bookings!',
    phone: '075-6000 310 / 076-5710 601',
    hours: 'Mon - Sat: 8:30 AM - 6:30 PM',
  },
  hero: {
    headline: 'Engineered for Thrill. Built for Life.',
    subheadline: 'Explore the complete range of TVS Apache Racing series, high-tech NTORQ smart scooters, dependable commuter bikes, and eco-friendly electric two-wheelers.',
    ctaPrimaryText: 'Explore TVS Motorcycles',
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

    finance: 'We offer low-rate motorcycle leasing and installment plans starting from 10% down payment with instant approval.',
    terms: 'All motorcycle bookings are held for up to 7 days upon reservation deposit confirmation.',
    privacy: 'We take customer confidentiality seriously and protect your personal data according to applicable privacy standards.',
  },
};

export const DEFAULT_BRAND: BrandSettings = {
  dealershipName: 'MANTHUSA TVS',
  tagline: "Official TVS Motorcycles & Scooters Dealership, Service & Genuine Parts",
  registrationNumber: 'TVS-LK-89214/2026',
  taxNumber: 'VAT-119284729-7000',

  footerText: '© 2026 MANTHUSA TVS. All rights reserved. Official TVS Warranty & Genuine Spares.',
  defaultLanguage: 'en',
  currency: 'LKR',
  currencySymbol: 'Rs.',
  phone: '075-6000 310',
  hotline: '076-5710 601 / 070-6510 601',
  email: 'sales@manthusatvs.lk',
  salesEmail: 'sales@manthusatvs.lk',
  supportEmail: 'service@manthusatvs.lk',
  address: '386, New Kandy Road, Weliweriya, Sri Lanka',
  city: 'Weliweriya',
  province: 'Western Province',
  postalCode: '11710',
  openingHours: 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)',
  googleMapsUrl: 'https://maps.google.com/?q=386+New+Kandy+Road+Weliweriya',
  whatsapp: '+94756000310',
  facebook: 'https://facebook.com/manthusatvs',
  instagram: 'https://instagram.com/manthusatvs',
  youtube: 'https://youtube.com/@manthusatvs',
  socialWebsite: 'https://manthusatvs.lk',
  website: DEFAULT_WEBSITE_CMS,
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

  const rawWebsite = (data.website && typeof data.website === 'object') ? data.website : {};
  const websiteConfig = {
    announcement: {
      ...DEFAULT_WEBSITE_CMS.announcement,
      ...(rawWebsite.announcement || {}),
    },
    hero: {
      ...DEFAULT_WEBSITE_CMS.hero,
      ...(rawWebsite.hero || {}),
    },
    sections: {
      ...DEFAULT_WEBSITE_CMS.sections,
      ...(rawWebsite.sections || {}),
    },
    pages: {
      ...DEFAULT_WEBSITE_CMS.pages,
      ...(rawWebsite.pages || {}),
    },
  };

  return {
    ...DEFAULT_BRAND,
    ...general,
    dealershipName: general.dealershipName?.trim() || data.dealershipName?.trim() || DEFAULT_BRAND.dealershipName,
    tagline: general.tagline?.trim() || data.tagline?.trim() || DEFAULT_BRAND.tagline,
    logoUrl: general.logoUrl?.trim() || data.logoUrl?.trim() || DEFAULT_BRAND.logoUrl,
    faviconUrl: general.faviconUrl?.trim() || data.faviconUrl?.trim() || DEFAULT_BRAND.faviconUrl,
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
    socialWebsite: social.website || data.socialWebsite || DEFAULT_BRAND.socialWebsite,
    website: websiteConfig,
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

  const dealershipName = settings.dealershipName?.trim() || DEFAULT_BRAND.dealershipName;
  document.title = `${dealershipName} — Official TVS Motorcycle Dealership & Service`;

  // Dynamically sync the browser tab icon with the saved brand identity.
  const iconUrl = settings.faviconUrl || settings.logoUrl || '/icon.svg';
  let link = document.querySelector<HTMLLinkElement>('link[data-brand-favicon]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.dataset.brandFavicon = 'true';
  link.type = iconUrl.startsWith('data:image/svg') || iconUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  link.href = iconUrl.startsWith('data:') ? iconUrl : `${iconUrl}${iconUrl.includes('?') ? '&' : '?'}brand=${Date.now()}`;
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
