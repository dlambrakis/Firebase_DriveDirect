import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { VehicleFilters } from '@directdrive/core-types';

// This function now has a more precise return type to avoid ambiguity.
const parseValue = (
  key: string,
  value: string
): string | number | string[] | null => {
  const numericKeys = [
    'minYear',
    'maxYear',
    'minPrice',
    'maxPrice',
    'minMileage',
    'maxMileage',
    'pageNumber',
    'pageSize',
  ];

  const arrayKeys = [
    'makes',
    'models',
    'bodyTypes',
    'transmissions',
    'fuelTypes',
    'locations',
    'drivetrains',
    'engineSizes',
    'features',
  ];

  if (numericKeys.includes(key)) {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num; // Return null for invalid numbers
  }

  if (arrayKeys.includes(key)) {
    return value.split(',');
  }

  return value;
};

export const useUrlFilters = (): [
  Partial<VehicleFilters>,
  (newFilters: Partial<VehicleFilters>) => void
] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const newFilters: Partial<VehicleFilters> = {};
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        const parsed = parseValue(key, value);
        if (parsed !== null) {
          (newFilters as any)[key] = parsed;
        }
      }
    }
    if (!newFilters.pageNumber) newFilters.pageNumber = 1;
    if (!newFilters.pageSize) newFilters.pageSize = 12;

    return newFilters;
  }, [searchParams]);

  const setFilters = (newFilters: Partial<VehicleFilters>) => {
    const newSearchParams = new URLSearchParams();
    // Explicitly cast newFilters to work around TypeScript's index signature limitations.
    for (const [key, value] of Object.entries(
      newFilters as Record<string, any>
    )) {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            newSearchParams.set(key, value.join(','));
          }
        } else {
          newSearchParams.set(key, String(value));
        }
      }
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  return [filters, setFilters];
};
