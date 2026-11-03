import React from 'react';
import { formatLKR, calculateAmortizedMonthlyPayment } from '@/lib/publicApi';

interface Props {
  price: number;
  currencySymbol?: string;
  showEstimate?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function PriceDisplay({
  price,
  currencySymbol = 'Rs.',
  showEstimate = true,
  size = 'md',
  className = '',
}: Props) {
  // 20% down, 5 years (60 months), 14.5% typical lease interest rate
  const downPayment = price * 0.2;
  const { monthlyPayment } = calculateAmortizedMonthlyPayment(price, downPayment, 14.5, 5);

  const sizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl sm:text-3xl font-black tracking-tight',
    xl: 'text-3xl sm:text-4xl font-black tracking-tight',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={`text-white ${sizeClasses[size]} whitespace-nowrap`}>
        {formatLKR(price, currencySymbol)}
      </span>
      {showEstimate && price > 0 && monthlyPayment > 0 && (
        <span className="text-[11px] text-amber-800 dark:text-amber-400/90 font-semibold mt-0.5 truncate block">
          Est. Lease from {formatLKR(monthlyPayment, currencySymbol)} / mo
        </span>
      )}
    </div>
  );
}
