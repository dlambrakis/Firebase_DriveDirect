import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@directdrive/ui';
import { VehicleListingDetailed } from '@directdrive/core-types';
import { formatDistanceToNow } from 'date-fns';
import { formatPrice } from '@directdrive/utils';

interface RecentListingsProps {
  listings: VehicleListingDetailed[];
}

const RecentListings: React.FC<RecentListingsProps> = ({ listings }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Listings</CardTitle>
        <Button asChild variant="link" className="text-sm">
          <Link to="/my-listings">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {listings.length > 0 ? (
            listings.map((listing) => {
              // Construct a dynamic title and get the primary image URL
              const vehicleTitle = `${listing.year} ${listing.make} ${listing.model}`;
              const imageUrl =
                listing.images?.[0] ||
                'https://placehold.co/600x400/EEE/31343C?text=No+Image';

              return (
                <Link
                  to={`/listing/${listing.listing_id}`}
                  key={listing.listing_id}
                  className="flex items-center space-x-4 group"
                >
                  <img
                    src={imageUrl}
                    alt={vehicleTitle}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                      {vehicleTitle}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {formatPrice(listing.price ?? 0)}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {listing.created_at
                        ? formatDistanceToNow(new Date(listing.created_at), {
                            addSuffix: true,
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <Badge
                    variant={listing.status === 'AVAILABLE' ? 'default' : 'secondary'}
                  >
                    {listing.status}
                  </Badge>
                </Link>
              );
            })
          ) : (
            <p className="text-text-secondary text-center py-4">
              You have no active listings.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentListings;
