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
