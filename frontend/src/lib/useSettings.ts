"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from './api';

export interface BrandSettings {
  dealershipName: string;
  tagline: string;
  logoUrl?: string;
  footerText?: string;
  currency?: string;
  currencySymbol?: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

const DEFAULT_BRAND: BrandSettings = {
  dealershipName: 'SalesPlus Auto Mart',
  tagline: 'Vehicle Sales Management System',
  logoUrl: '',
  footerText: '© 2026 SalesPlus Vehicle Sales. All rights reserved.',
  currency: 'LKR',
  currencySymbol: 'Rs.',
};

export function useSettings() {
  const [settings, setSettings] = useState<BrandSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('dealership_brand');
        if (cached) return { ...DEFAULT_BRAND, ...JSON.parse(cached) };
      } catch (e) {
        // ignore parse error
      }
    }
    return DEFAULT_BRAND;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLatest() {
      try {
        const res = await apiFetch('/settings/public');
        if (res.ok) {
          const data = await res.json();
          const general = data.general || {};
          const contact = data.contact || {};
          const commerce = data.commerce || {};
          const merged: BrandSettings = {
            ...DEFAULT_BRAND,
            ...general,
            phone: contact.phone || contact.hotline || '',
            address: contact.address || '',
            currency: commerce.currency || 'LKR',
            currencySymbol: commerce.currencySymbol || 'Rs.',
          };
          if (isMounted) {
            setSettings(merged);
            localStorage.setItem('dealership_brand', JSON.stringify(merged));
          }
        }
      } catch (err) {
        // Silently fall back to cached
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLatest();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        const gen = e.detail.general || e.detail;
        const updated = { ...DEFAULT_BRAND, ...gen };
        setSettings(updated);
        localStorage.setItem('dealership_brand', JSON.stringify(updated));
      }
    };

    window.addEventListener('dealership-settings-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('dealership-settings-updated', handleUpdate);
    };
  }, []);

  return { settings, loading };
}
