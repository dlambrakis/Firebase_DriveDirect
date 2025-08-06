import React, { useState, useEffect } from 'react';
import { useVehicleSearch, useDebounce } from '@directdrive/hooks';
import { useUrlFilters } from '../hooks/useUrlFilters';
import { Button } from '@directdrive/ui';
import { FilterModal } from '../components/FilterModal';
import { VehicleFilters, VehicleSearchResult } from '@directdrive/core-types';
import { SearchHeader } from '../components/SearchHeader';
import { ListingCard } from '../components/ListingCard';
import { Link } from 'react-router-dom';

/**
 * The main search page for browsing vehicle listings.
 * It supports keyword search, advanced filtering, and pagination.
 */
export const SearchPage: React.FC = () => {
  const [filters, setFilters] = useUrlFilters();
  const [localSearchTerm, setLocalSearchTerm] = useState(
    filters.searchTerm || ''
  );

  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  useEffect(() => {
    // Update URL filters when the debounced search term changes
    if (debouncedSearchTerm !== (filters.searchTerm || '')) {
      setFilters({
        ...filters,
        searchTerm: debouncedSearchTerm || undefined,
        pageNumber: 1,
      });
    }
  }, [debouncedSearchTerm, filters, setFilters]);

  useEffect(() => {
    // Sync local search term if the URL filter changes (e.g., browser back button)
    if (filters.searchTerm !== localSearchTerm) {
      setLocalSearchTerm(filters.searchTerm || '');
    }
  }, [filters.searchTerm, localSearchTerm]);

  // The useVehicleSearch hook returns a standard useQuery result
  const { data: searchResult, isLoading, error } = useVehicleSearch(filters);

  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract vehicles and total count from the search result
  const vehicles = searchResult || [];
  const totalCount = vehicles.length > 0 ? (vehicles[0] as any).total_count || 0 : 0;

  const handleApplyFilters = (newFilters: Partial<VehicleFilters>) => {
    setFilters({ ...newFilters, searchTerm: filters.searchTerm, pageNumber: 1 });
  };

  const handleRemoveFilter = (filterKey: keyof VehicleFilters) => {
    const newFilters = { ...filters };
    if (
      filterKey === 'minPrice' ||
      filterKey === 'maxPrice'
    ) {
      delete newFilters.minPrice;
      delete newFilters.maxPrice;
    } else if (
      filterKey === 'minYear' ||
      filterKey === 'maxYear'
    ) {
      delete newFilters.minYear;
      delete newFilters.maxYear;
    } else if (
      filterKey === 'minMileage' ||
      filterKey === 'maxMileage'
    ) {
      delete newFilters.minMileage;
      delete newFilters.maxMileage;
    } else {
      delete newFilters[filterKey];
    }
    newFilters.pageNumber = 1;
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: filters.pageSize,
      searchTerm: filters.searchTerm,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHeader
        localSearchTerm={localSearchTerm}
        setLocalSearchTerm={setLocalSearchTerm}
        totalCount={totalCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setFilterModalOpen={setFilterModalOpen}
        filters={filters}
        handleRemoveFilter={handleRemoveFilter}
        clearAllFilters={clearAllFilters}
      />

      {isLoading && (
        <div className="text-center text-white py-16">Loading vehicles...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-16">
          Error: {error.message}
        </div>
      )}

      {!isLoading && !error && vehicles.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-white">
            No Vehicles Found
          </h3>
          <p className="text-textSecondary mt-2">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {vehicles.map((vehicle: VehicleSearchResult) => (
              <ListingCard
                key={vehicle.listing_id}
                vehicle={vehicle}
                viewMode={viewMode}
                LinkComponent={Link}
              />
            ))}
          </div>
          {/* Add pagination controls here if needed */}
        </>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
        // filterOptions={filterOptions ?? undefined} // This hook was removed
        isLoading={false} // isLoadingFilters is no longer available
      />
    </div>
  );
};

export default SearchPage;
