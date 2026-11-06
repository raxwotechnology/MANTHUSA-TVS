'use client';

import React from 'react';
import { Calendar, X } from 'lucide-react';

export interface DateFilterControlProps {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  className?: string;
  label?: string;
}

export function isWithinDateRange(
  dateValue: string | number | Date | null | undefined,
  startDate?: string,
  endDate?: string
): boolean {
  if (!startDate && !endDate) return true;
  if (!dateValue) return false;

  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return true;
    const dateStr = d.toISOString().slice(0, 10);

    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  } catch {
    return true;
  }
}

export function DateFilterControl({
  startDate,
  endDate,
  onDateChange,
  className = '',
  label,
}: DateFilterControlProps) {
  const hasActiveFilter = Boolean(startDate || endDate);

  const handleClear = () => {
    onDateChange('', '');
  };

  const setPreset = (preset: 'today' | 'last7' | 'thisMonth' | 'all') => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (preset === 'today') {
      onDateChange(todayStr, todayStr);
    } else if (preset === 'last7') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      onDateChange(past.toISOString().slice(0, 10), todayStr);
    } else if (preset === 'thisMonth') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      onDateChange(startOfMonth, todayStr);
    } else {
      onDateChange('', '');
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      {label && (
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {label}
        </span>
      )}

      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-2xs">
        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">From</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateChange(e.target.value, endDate)}
            className="bg-transparent text-slate-800 text-xs focus:outline-hidden font-medium cursor-pointer"
            title="Start date filter"
          />
        </div>

        <span className="text-slate-300">|</span>

        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">To</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateChange(startDate, e.target.value)}
            className="bg-transparent text-slate-800 text-xs focus:outline-hidden font-medium cursor-pointer"
            title="End date filter"
          />
        </div>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear date filter"
            className="ml-1 text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded-sm hover:bg-rose-50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Presets */}
      <div className="hidden sm:flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPreset('today')}
          className="px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setPreset('last7')}
          className="px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          7D
        </button>
        <button
          type="button"
          onClick={() => setPreset('thisMonth')}
          className="px-2 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Month
        </button>
      </div>
    </div>
  );
}
