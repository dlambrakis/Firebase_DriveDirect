import { Link } from 'react-router-dom';
import { useAuth, useUserListings } from '@directdrive/hooks';
import { Button } from '@directdrive/ui';
// Corrected to be a named import
import { ListingCard } from '../ListingCard';
import { PlusCircle } from 'lucide-react';
import { VehicleListingDetailed } from '@directdrive/core-types';

const UserListingsSection = () => {
  const { user } = useAuth();
  const { data: listings, isLoading } = useUserListings(user?.id, {
    limit: 3,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight">My Listings</h2>
        <Button asChild variant="ghost">
          <Link to="/my-listings">View All &rarr;</Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-96 bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing: VehicleListingDetailed) => (
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
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-muted-foreground">
            You haven't listed any vehicles yet.
          </h3>
          <Button asChild className="mt-4">
            <Link to="/create-listing">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Listing
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserListingsSection;
