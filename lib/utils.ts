import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralize(word: string, count: number): string {
  if (count === 1) {
    return word;
  } else {
    if (word.endsWith('y')) {
      return word.slice(0, -1) + 'ies';
    } else {
      return word + 's';
    }
  }
}

export function logError(error: Error | unknown, message?: string) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(message || 'Error:', error);
  }
}

/**
 * Format a number as currency in Canadian dollars
 * @param amount - The amount to format
 * @returns Formatted currency string or 'N/A' if amount is null/undefined
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
}

/**
 * Format a number as a percentage
 * @param rate - The rate to format
 * @returns Formatted percentage string or 'N/A' if rate is null/undefined
 */
export function formatPercentage(rate: number | null | undefined): string {
  if (!rate) return 'N/A';
  return `${rate.toFixed(2)}%`;
}
