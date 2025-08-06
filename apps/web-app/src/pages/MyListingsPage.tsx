import React from 'react';
import { useUserListings, useVehicleMutations } from '@directdrive/hooks';
import { Link } from 'react-router-dom';
import {
  Button,
  Alert,
  AlertDescription,
  AlertTitle,
  MyListingCard,
} from '@directdrive/ui';
import { ListingStatus, VehicleListingDetailed } from '@directdrive/core-types';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';

/**
 * A page for users to view and manage all of their vehicle listings.
 * It provides functionality to edit, delete, and change the status of each listing.
 */
const MyListingsPage: React.FC = () => {
  const { data: listings, isLoading, isError, error } = useUserListings();
  const { deleteVehicle, updateListingStatus } = useVehicleMutations();
  const { toast } = useToast();

  const handleDelete = (listingId: number) => {
    deleteVehicle.mutate(listingId, {
      onSuccess: () => {
        toast({
          title: 'Listing Deleted',
          description: 'Your vehicle listing has been successfully removed.',
        });
      },
      onError: (err) => {
        toast({
          title: 'Deletion Failed',
          description: err.message,
          variant: 'destructive',
        });
      },
    });
  };

  const handleUpdateStatus = (listingId: number, status: ListingStatus) => {
    updateListingStatus.mutate(
      { listingId, status },
      {
        onSuccess: () => {
          toast({
            title: 'Status Updated',
            description: `Your listing has been marked as ${status.toLowerCase()}.`,
          });
        },
        onError: (err) => {
          toast({
            title: 'Update Failed',
            description: err.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Listings</AlertTitle>
          <AlertDescription>
            {error?.message || 'An unexpected error occurred.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
        <Button asChild>
          <Link to="/create-listing">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>

      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: VehicleListingDetailed) => (
            <MyListingCard
              key={listing.listing_id}
              listing={listing}
              onDelete={handleDelete}
              isDeleting={
                deleteVehicle.isPending &&
                deleteVehicle.variables === listing.listing_id
              }
              onUpdateStatus={handleUpdateStatus}
              isUpdatingStatus={
                updateListingStatus.isPending &&
                updateListingStatus.variables?.listingId === listing.listing_id
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No listings yet!</h2>
          <p className="text-muted-foreground mt-2">
            Get started by adding your first vehicle.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/create-listing">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a Listing
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
