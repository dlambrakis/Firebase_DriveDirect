import React from 'react';
import { useVehicleSearch } from '@directdrive/hooks';
// Corrected to be a named import
import { ListingCard } from '../ListingCard';
import { VehicleSearchResult } from '@directdrive/core-types';

const DiscoverSection = () => {
  // Pass an empty object to fetch initial, unfiltered listings
  const { data, isLoading } = useVehicleSearch({});

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">
        Discover Listings
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* This is a great pattern for loading skeletons */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Added explicit type for 'listing' */}
          {data.map((listing: VehicleSearchResult) => (
            <ListingCard
              // Corrected key from 'id' to 'listing_id'
              key={listing.listing_id}
              // Corrected prop name from 'listing' to 'vehicle'
              vehicle={listing}
              // Added the required 'viewMode' prop
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-16 text-muted-foreground">
          No listings found.
        </p>
      )}
    </div>
  );
};

export default DiscoverSection;
