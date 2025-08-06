import React from 'react';
import { Link } from 'react-router-dom';
import { VehicleListingDetailed, ListingStatus } from '@directdrive/core-types';
import { formatPrice, formatMileage } from '@directdrive/utils';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Badge } from './badge';
import { Edit, Trash2, Eye, Tag, RotateCcw } from 'lucide-react';

interface MyListingCardProps {
  listing: VehicleListingDetailed;
  onDelete: (listingId: number) => void;
  isDeleting: boolean;
  onUpdateStatus: (listingId: number, status: ListingStatus) => void;
  isUpdatingStatus: boolean;
}

export const MyListingCard: React.FC<MyListingCardProps> = ({
  listing,
  onDelete,
  isDeleting,
  onUpdateStatus,
  isUpdatingStatus,
}) => {
  const isSold = listing.status === 'SOLD';

  const handleUpdateStatus = (status: ListingStatus) => {
    if (listing.listing_id === null) return;
    onUpdateStatus(listing.listing_id, status);
  };

  const handleDelete = () => {
    if (listing.listing_id === null) return;
    onDelete(listing.listing_id);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative aspect-w-16 aspect-h-9 mb-4">
          <img
            src={
              listing.images?.[0] ||
              'https://placehold.co/600x400/EEE/31343C?text=No+Image'
            }
            alt={`${listing.make} ${listing.model}`}
            className={`object-cover w-full h-full rounded-md ${
              isSold ? 'opacity-50' : ''
            }`}
          />
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
              <Badge
                variant="destructive"
                className="text-lg font-bold px-6 py-2 transform -rotate-12"
              >
                SOLD
              </Badge>
            </div>
          )}
        </div>
        <CardTitle className="text-xl">{`${listing.year} ${listing.make} ${listing.model}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-semibold text-primary mb-2">
          {formatPrice(listing.price ?? 0)}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatMileage(listing.mileage ?? 0)}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2">
        <Button variant="ghost" size="sm" asChild disabled={!listing.listing_id}>
          <Link to={`/vehicle/${listing.listing_id}`}>
            <Eye className="mr-2 h-4 w-4" /> View
          </Link>
        </Button>

        {isSold ? (
          <Button
            variant="outline"
            size="sm"
            // Corrected 'ACTIVE' to 'AVAILABLE' to match the ListingStatus type
            onClick={() => handleUpdateStatus('AVAILABLE')}
            disabled={isUpdatingStatus || !listing.listing_id}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {/* Updated button text for consistency */}
            {isUpdatingStatus ? 'Updating...' : 'Mark as Available'}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateStatus('SOLD')}
            disabled={isUpdatingStatus || isDeleting || !listing.listing_id}
          >
            <Tag className="mr-2 h-4 w-4" />
            {isUpdatingStatus ? 'Updating...' : 'Mark as Sold'}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={isSold || isUpdatingStatus || !listing.listing_id}
        >
          <Link to={`/edit-listing/${listing.listing_id}`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={
                isDeleting || isSold || isUpdatingStatus || !listing.listing_id
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />{' '}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                listing and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
