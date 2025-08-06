import { VehicleFilters } from '@directdrive/core-types';

export const formatFilterValue = (key: string, value: any, allFilters: Partial<VehicleFilters>): string => {
  const formatPrice = (price: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(price);
  const formatKm = (km: number) => `${new Intl.NumberFormat('en-ZA').format(km)} km`;

  if (Array.isArray(value)) return value.join(', ');

  if (key === 'minPrice' && allFilters.maxPrice) return `${formatPrice(value)} - ${formatPrice(allFilters.maxPrice)}`;
  if (key === 'maxPrice' && !allFilters.minPrice) return `< ${formatPrice(value)}`;
  if (key === 'minPrice') return `> ${formatPrice(value)}`;
  
  if (key === 'minMileage' && allFilters.maxMileage) return `${formatKm(value)} - ${formatKm(allFilters.maxMileage)}`;
  if (key === 'maxMileage' && !allFilters.minMileage) return `< ${formatKm(value)}`;
  if (key === 'minMileage') return `> ${formatKm(value)}`;

  if (key === 'minYear' && allFilters.maxYear) return `${value} - ${allFilters.maxYear}`;
  if (key === 'maxYear' && !allFilters.minYear) return `< ${value}`;
  if (key === 'minYear') return `> ${value}`;

  return String(value);
};

export const formatFilterLabel = (key: string): string => {
  return key
    // Insert a space before all caps
    .replace(/([A-Z])/g, ' $1')
    // Remove min/max prefixes
    .replace(/\b(min|max)\b/g, '')
    // Uppercase the first character of each word
    .replace(/\b\w/g, l => l.toUpperCase())
    // Remove leading/trailing spaces
    .trim();
};

export const getActiveFilters = (filters: Partial<VehicleFilters>) => {
  return Object.entries(filters).filter(
    ([key, value]) => 
      key !== 'pageNumber' && 
      key !== 'pageSize' && 
      key !== 'searchTerm' &&
      value !== undefined && 
      value !== '' && 
      value !== 0 &&
      (!Array.isArray(value) || value.length > 0)
  );
};
