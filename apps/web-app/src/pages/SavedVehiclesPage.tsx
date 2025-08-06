import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useFetchSavedVehicleListings } from '@directdrive/hooks';
import { ListingCard } from '../components/ListingCard';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from '@directdrive/ui';
import { Loader2, HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VehicleListingDetailed } from '@directdrive/core-types';

/**
 * A page that displays all the vehicle listings a user has saved.
 */
const SavedVehiclesPage: React.FC = () => {
  const { user } = useAuth();
  const {
    data: vehicles,
    isLoading,
    isError,
    error,
  } = useFetchSavedVehicleListings(user?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem fetching your saved vehicles. Please try again
            later.
            <pre className="mt-2 text-xs">{error.message}</pre>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Saved Vehicles</h1>
      {vehicles && vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle: VehicleListingDetailed) => (
            <ListingCard
              key={vehicle.listing_id}
              vehicle={vehicle}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-backgroundSecondary rounded-lg">
          <HeartOff size={48} className="text-textSecondary mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Saved Vehicles Yet</h2>
          <p className="text-textSecondary mb-6">
            Start browsing and click the heart icon on any listing to save it
            here.
          </p>
          <Button asChild>
            <Link to="/search">Find Your Next Car</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedVehiclesPage;
