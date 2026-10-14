"use client";

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'salesplus_comparison_vehicles';
const MAX_COMPARISON = 4;

export function useComparison() {
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setComparisonIds(parsed.slice(0, MAX_COMPARISON));
        }
      }
    } catch (e) {
      console.warn('Failed to parse comparison IDs:', e);
    }
    setIsLoaded(true);
  }, []);

  const addVehicle = useCallback((id: string): { success: boolean; message?: string } => {
    let result: { success: boolean; message?: string } = { success: true };
    setComparisonIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_COMPARISON) {
        result = { success: false, message: `You can compare up to ${MAX_COMPARISON} vehicles at a time.` };
        return prev;
      }
      const next = [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save comparison to localStorage:', e);
      }
      return next;
    });
    return result;
  }, []);

  const removeVehicle = useCallback((id: string) => {
    setComparisonIds((prev) => {
      const next = prev.filter((item) => item !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save comparison to localStorage:', e);
      }
      return next;
    });
  }, []);

  const toggleVehicle = useCallback((id: string): { inComparison: boolean; message?: string } => {
    let inComparison = false;
    let message: string | undefined;
    setComparisonIds((prev) => {
      if (prev.includes(id)) {
        inComparison = false;
        const next = prev.filter((item) => item !== id);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      } else {
        if (prev.length >= MAX_COMPARISON) {
          inComparison = false;
          message = `You can compare up to ${MAX_COMPARISON} vehicles.`;
          return prev;
        }
        inComparison = true;
        const next = [...prev, id];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      }
    });
    return { inComparison, message };
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear comparison:', e);
    }
  }, []);

  const isInComparison = useCallback(
    (id: string) => comparisonIds.includes(id),
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
    isInComparison,
  };
}
