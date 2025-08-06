import React from 'react';
import { Button, Input } from '@directdrive/ui';
import { Filter, List, LayoutGrid, Search as SearchIcon } from 'lucide-react';
import { VehicleFilters } from '@directdrive/core-types';
import { getActiveFilters } from '@directdrive/utils';
import { ActiveFiltersDisplay } from './ActiveFiltersDisplay';

interface SearchHeaderProps {
  localSearchTerm: string;
  setLocalSearchTerm: (term: string) => void;
  totalCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  setFilterModalOpen: (isOpen: boolean) => void;
  filters: Partial<VehicleFilters>;
  handleRemoveFilter: (filterKey: keyof VehicleFilters) => void;
  clearAllFilters: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  localSearchTerm,
  setLocalSearchTerm,
  totalCount,
  viewMode,
  setViewMode,
  setFilterModalOpen,
  filters,
  handleRemoveFilter,
  clearAllFilters,
}) => {
  const activeFiltersCount = getActiveFilters(filters).length;

  return (
    <header className="bg-surface p-6 rounded-lg mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search by make, model, or keyword..."
            value={localSearchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocalSearchTerm(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2"
          />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => setFilterModalOpen(true)}
          className="gap-2"
        >
          <Filter size={16} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-textSecondary">
            {totalCount.toLocaleString()} Results
          </span>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid size={20} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={20} />
          </Button>
        </div>
      </div>
      <ActiveFiltersDisplay
        filters={filters}
        handleRemoveFilter={handleRemoveFilter}
        clearAllFilters={clearAllFilters}
      />
    </header>
  );
};
