"use client";

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'salesplus_comparison_vehicles';
const MAX_COMPARISON = 4;
const EVENT_NAME = 'salesplus_comparison_updated';

function getStoredIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String).slice(0, MAX_COMPARISON) : [];
  } catch {
    return [];
  }
}

function saveAndNotify(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save comparison to localStorage:', e);
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: ids }));
}

export function useComparison() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial sync
    setComparisonIds(getStoredIds());
    setIsLoaded(true);

    const handleUpdate = () => {
      setComparisonIds(getStoredIds());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const addVehicle = useCallback((id: string): { success: boolean; message?: string } => {
    const current = getStoredIds();
    if (current.includes(id)) return { success: true };
    if (current.length >= MAX_COMPARISON) {
      return { success: false, message: `You can compare up to ${MAX_COMPARISON} vehicles at a time.` };
    }
    const next = [...current, id];
    saveAndNotify(next);
    setComparisonIds(next);
    return { success: true };
  }, []);

  const removeVehicle = useCallback((id: string) => {
    const current = getStoredIds();
    const next = current.filter((item) => item !== id);
    saveAndNotify(next);
    setComparisonIds(next);
  }, []);

  const toggleVehicle = useCallback((id: string): { inComparison: boolean; message?: string } => {
    const current = getStoredIds();
    if (current.includes(id)) {
      const next = current.filter((item) => item !== id);
      saveAndNotify(next);
      setComparisonIds(next);
      return { inComparison: false };
    } else {
      if (current.length >= MAX_COMPARISON) {
        return { inComparison: false, message: `You can compare up to ${MAX_COMPARISON} vehicles.` };
      }
      const next = [...current, id];
      saveAndNotify(next);
      setComparisonIds(next);
      return { inComparison: true };
    }
  }, []);

  const clearComparison = useCallback(() => {
    saveAndNotify([]);
    setComparisonIds([]);
  }, []);

  const setComparisonList = useCallback((ids: string[]) => {
    const cleaned = ids.slice(0, MAX_COMPARISON);
    saveAndNotify(cleaned);
    setComparisonIds(cleaned);
  }, []);

  const isInComparison = useCallback(
    (id: string) => comparisonIds.includes(String(id)),
    [comparisonIds]
  );

  return {
    comparisonIds,
    count: comparisonIds.length,
    isLoaded,
    maxLimit: MAX_COMPARISON,
    addVehicle,
    removeVehicle,
    toggleVehicle,
    clearComparison,
    setComparisonList,
    isInComparison,
  };
}
