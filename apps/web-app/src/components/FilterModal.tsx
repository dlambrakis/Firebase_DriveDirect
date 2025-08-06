import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  ScrollArea,
  Checkbox,
  Label,
  Slider,
} from '@directdrive/ui';
import { VehicleFilters, FilterOptionsResponse } from '@directdrive/core-types';
import { Loader2 } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: Partial<VehicleFilters>;
  onApplyFilters: (filters: Partial<VehicleFilters>) => void;
  filterOptions?: FilterOptionsResponse;
  isLoading: boolean;
}

// Define a more specific type for the checklist options
type ChecklistOption = {
  id: number | string;
  name: string;
  count?: number;
};

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="py-4 border-b border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
    {children}
  </div>
);

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  initialFilters,
  onApplyFilters,
  filterOptions,
  isLoading,
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const cleared = {
      pageNumber: 1,
      pageSize: initialFilters.pageSize,
      searchTerm: initialFilters.searchTerm,
    };
    setLocalFilters(cleared);
    onApplyFilters(cleared);
    onClose();
  };

  const handleMultiSelectChange = (key: keyof VehicleFilters, value: string) => {
    setLocalFilters((prev) => {
      const currentValues = (prev[key] as string[] | undefined) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues.length > 0 ? newValues : undefined };
    });
  };

  const renderChecklist = (
    filterKey: keyof VehicleFilters,
    options: ChecklistOption[]
  ) => (
    <ScrollArea className="h-48">
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterKey}-${option.id}`}
              checked={
                (localFilters[filterKey] as string[] | undefined)?.includes(
                  option.name
                ) || false
              }
              onCheckedChange={() => handleMultiSelectChange(filterKey, option.name)}
            />
            <Label
              htmlFor={`${filterKey}-${option.id}`}
              className="flex-grow text-textPrimary"
            >
              {option.name} {option.count ? `(${option.count})` : ''}
            </Label>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  const renderRangeSlider = (
    title: string,
    minKey: keyof VehicleFilters,
    maxKey: keyof VehicleFilters,
    range?: { min: number; max: number },
    step = 1,
    formatter = (val: number) => val.toString()
  ) => {
    if (!range || range.min === range.max) return null;
    const currentMin = (localFilters[minKey] as number | undefined) ?? range.min;
    const currentMax = (localFilters[maxKey] as number | undefined) ?? range.max;

    return (
      <FilterSection title={title}>
        <div className="space-y-4">
          <Slider
            min={range.min}
            max={range.max}
            step={step}
            value={[currentMin, currentMax]}
            // Added explicit type 'number[]' to fix the implicit 'any' error
            onValueChange={([min, max]: number[]) =>
              setLocalFilters((prev) => ({ ...prev, [minKey]: min, [maxKey]: max }))
            }
          />
          <div className="flex justify-between text-sm text-textSecondary">
            <span>{formatter(currentMin)}</span>
            <span>{formatter(currentMax)}</span>
          </div>
        </div>
      </FilterSection>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl bg-backgroundSecondary text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-[70vh]">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Standardized property access to camelCase */}
              {filterOptions?.makes && filterOptions.makes.length > 0 && (
                <FilterSection title="Make">
                  {renderChecklist('makes', filterOptions.makes)}
                </FilterSection>
              )}
              {filterOptions?.models && filterOptions.models.length > 0 && (
                <FilterSection title="Model">
                  {renderChecklist('models', filterOptions.models)}
                </FilterSection>
              )}
              {/* Add other checklist sections here using the same pattern */}

              <div className="md:col-span-2 space-y-4">
                {/* Assuming filterOptions has these properties */}
                {renderRangeSlider(
                  'Price',
                  'minPrice',
                  'maxPrice',
                  (filterOptions as any)?.prices,
                  1000,
                  (val) => `$${val.toLocaleString()}`
                )}
                {renderRangeSlider(
                  'Year',
                  'minYear',
                  'maxYear',
                  (filterOptions as any)?.years
                )}
                {renderRangeSlider(
                  'Mileage',
                  'minMileage',
                  'maxMileage',
                  (filterOptions as any)?.mileages,
                  5000,
                  (val) => `${val.toLocaleString()} km`
                )}
              </div>
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
