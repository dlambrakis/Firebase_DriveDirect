import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function to conditionally join class names together.
 * It uses `clsx` for conditional classes and `tailwind-merge` to resolve conflicts.
 * @param inputs A list of class values to be merged.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number into a South African Rand (ZAR) currency string.
 * @param amount The number to format.
 * @returns A formatted currency string (e.g., "R150,000").
 */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number into a mileage string with "km".
 * @param mileage The number to format.
 * @returns A formatted mileage string (e.g., "120,000 km").
 */
export function formatMileage(mileage: number) {
  return new Intl.NumberFormat('en-ZA').format(mileage) + ' km';
}
