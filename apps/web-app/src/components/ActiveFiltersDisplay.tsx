import React from 'react';
import { Button } from '@directdrive/ui';
import { X } from 'lucide-react';
import { VehicleFilters } from '@directdrive/core-types';
import {
  getActiveFilters,
  formatFilterLabel,
  formatFilterValue,
} from '@directdrive/utils';

interface ActiveFiltersDisplayProps {
  filters: Partial<VehicleFilters>;
  handleRemoveFilter: (filterKey: keyof VehicleFilters) => void;
  clearAllFilters: () => void;
}

export const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
  filters,
  handleRemoveFilter,
  clearAllFilters,
}) => {
  const activeFilters = getActiveFilters(filters);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-textSecondary mr-2">
        Active:
      </span>
      {/* Added explicit types for 'key' and 'value' to prevent implicit 'any' errors */}
      {activeFilters.map(([key, value]: [keyof VehicleFilters, any]) => {
        // This logic correctly groups range filters (e.g., minPrice/maxPrice) into a single display item.
        if (
          (key === 'maxPrice' && filters.minPrice) ||
          (key === 'maxYear' && filters.minYear) ||
          (key === 'maxMileage' && filters.minMileage)
        ) {
          return null;
        }
        return (
          <div
            key={key}
            className="flex items-center bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
          >
            <span className="pl-3 pr-2 py-1">
              {formatFilterLabel(key)}: {formatFilterValue(key, value, filters)}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-6 w-6 hover:bg-primary/20"
              onClick={() => handleRemoveFilter(key)}
            >
              <X size={14} />
            </Button>
          </div>
        );
      })}
      <Button
        variant="ghost"
        size="sm"
        className="text-primary hover:text-primary"
        onClick={clearAllFilters}
      >
        Clear All
      </Button>
    </div>
  );
};
