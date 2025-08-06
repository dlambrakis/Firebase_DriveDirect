/**
 * Formats a number into a South African Rand (ZAR) currency string.
 * @param price The number to format.
 * @returns A string like "R 150,000".
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formats a number into a mileage string with "km".
 * @param mileage The number to format.
 * @returns A string like "123,456 km".
 */
export const formatMileage = (mileage: number): string => {
  return `${new Intl.NumberFormat('en-ZA', { useGrouping: true }).format(mileage)} km`;
};
