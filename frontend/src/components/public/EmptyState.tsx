import React from 'react';
import Link from 'next/link';
import { Car, SearchX, RotateCcw, ArrowRight } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onReset?: () => void;
  icon?: 'search' | 'car';
}

export function EmptyState({
  title = 'No Vehicles Found',
  description = 'We could not find any vehicles matching your selected criteria. Try adjusting your search filters.',
  actionText = 'Browse All Vehicles',
  actionHref = '/vehicles',
  onReset,
  icon = 'search',
}: Props) {
  const Icon = icon === 'car' ? Car : SearchX;

  return (
    <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        )}

        {actionHref && (
          <Link
            href={actionHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold transition-all shadow-sm"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
