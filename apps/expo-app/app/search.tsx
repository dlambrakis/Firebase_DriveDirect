import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { useVehicleSearch, useDebounce } from '@directdrive/hooks';
import { Colors, Spacing, Typography } from '@directdrive/theme';
import { VehicleCard } from '@/components/VehicleCard';
import { Search, Filter } from 'lucide-react-native';
import { Button } from '@/components/Button';
import FilterModal from '@/components/FilterModal';
import { VehicleFilters } from '@directdrive/core-types';
import { ActiveFiltersDisplay } from '@/components/ActiveFiltersDisplay';
import { getActiveFilters } from '@directdrive/utils';

export default function SearchScreen() {
  const [filters, setFilters] = useState<Partial<VehicleFilters>>({ pageSize: 10, pageNumber: 1 });
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm: debouncedSearchTerm || undefined, pageNumber: 1 }));
  }, [debouncedSearchTerm]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVehicleSearch(filters);

  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const vehicles = data?.pages.flatMap(page => page.data) || [];
  const totalCount = data?.pages?.[0]?.count || 0;
  const activeFilterCount = getActiveFilters(filters).length;

  const handleApplyFilters = useCallback((newFilters: Partial<VehicleFilters>) => {
    setFilters(prev => ({ ...newFilters, searchTerm: prev.searchTerm, pageNumber: 1 }));
    setFilterModalOpen(false);
  }, []);

  const handleRemoveFilter = useCallback((filterKey: keyof VehicleFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (filterKey === 'minPrice' || filterKey === 'maxPrice') {
        delete newFilters.minPrice;
        delete newFilters.maxPrice;
      } else if (filterKey === 'minYear' || filterKey === 'maxYear') {
        delete newFilters.minYear;
        delete newFilters.maxYear;
      } else if (filterKey === 'minMileage' || filterKey === 'maxMileage') {
        delete newFilters.minMileage;
        delete newFilters.maxMileage;
      } else {
        delete newFilters[filterKey];
      }
      newFilters.pageNumber = 1;
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(prev => ({ pageNumber: 1, pageSize: prev.pageSize, searchTerm: prev.searchTerm }));
  }, []);

  const renderItem = ({ item }) => <VehicleCard vehicle={item} />;

  const renderListFooter = () => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.footer}>
        <Button
          title={isFetchingNextPage ? 'Loading...' : 'Load More'}
          onPress={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No vehicles found.</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search or filter criteria.</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search by make, model..."
            placeholderTextColor={Colors.text.secondary}
            value={localSearchTerm}
            onChangeText={setLocalSearchTerm}
          />
        </View>
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalOpen(true)}>
            <Filter size={16} color={Colors.text.primary} />
            <Text style={styles.filterButtonText}>Filters</Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.resultsText}>{totalCount.toLocaleString()} Results</Text>
        </View>
        <ActiveFiltersDisplay
          filters={filters}
          handleRemoveFilter={handleRemoveFilter}
          clearAllFilters={clearAllFilters}
        />
      </View>

      {isLoading && vehicles.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderItem}
          keyExtractor={(item) => item.listing_id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmptyComponent}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
        />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  header: {
    backgroundColor: Colors.card,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.DEFAULT,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body.md,
    color: Colors.text.primary,
    height: 44,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonText: {
    ...Typography.body.md,
    color: Colors.text.primary,
    marginLeft: Spacing.sm,
    fontWeight: '500',
  },
  filterCountBadge: {
    backgroundColor: Colors.primary.DEFAULT,
    borderRadius: 10,
    marginLeft: Spacing.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterCountText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultsText: {
    ...Typography.body.sm,
    color: Colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...Typography.body.lg,
    color: Colors.danger.DEFAULT,
  },
  footer: {
    paddingVertical: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
  },
  emptySubtext: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
});
