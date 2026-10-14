import React from 'react';
import { CheckCircle2, Clock, XCircle, Sparkles } from 'lucide-react';

interface Props {
  status: string;
  condition?: string;
  className?: string;
}

export function AvailabilityBadge({ status, condition, className = '' }: Props) {
  const normStatus = (status || 'Available').toLowerCase();

  let badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let Icon = CheckCircle2;
  let label = 'Available';

  if (normStatus.includes('sold')) {
    badgeColor = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    Icon = XCircle;
    label = 'Sold';
  } else if (normStatus.includes('reserve')) {
    badgeColor = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    Icon = Clock;
    label = 'Reserved';
  } else if (normStatus.includes('inspect')) {
    badgeColor = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    Icon = Sparkles;
    label = 'Under Inspection';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>

      {condition && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
          {condition}
        </span>
      )}
    </div>
  );
}
