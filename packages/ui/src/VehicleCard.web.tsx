import React from 'react';
import { VehicleWithImages } from '@directdrive/core-types';
import { Button } from './button.tsx';
import { Tag, Fuel, Gauge, GitMerge, MapPin, Heart } from 'lucide-react';
import { useAuth } from '@directdrive/hooks';
import { useFetchSavedVehicleListings, useToggleSaveVehicle } from '@directdrive/hooks';
import { formatPrice, formatMileage } from '@directdrive/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.tsx';

interface VehicleCardProps {
  vehicle: VehicleWithImages;
  LinkComponent: React.ElementType;
  viewMode?: 'grid' | 'list';
}

const InfoItem: React.FC<{ icon: React.ElementType; label: string | undefined }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-sm text-textSecondary">
    <Icon size={16} className="text-primary" />
    <span>{label}</span>
  </div>
);

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, LinkComponent, viewMode = 'grid' }) => {
  // If essential data is missing, don't render the card to prevent errors.
  if (!vehicle || vehicle.listing_id == null) {
    return null;
  }

  const { user } = useAuth();
  const { data: savedVehiclesSet } = useFetchSavedVehicleListings(user?.id);
  const { mutate: toggleSave, isPending: isTogglingSave } = useToggleSaveVehicle();

  const isSaved = savedVehiclesSet?.has(vehicle.listing_id) || false;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleSave({
        listingId: vehicle.listing_id, // Safe due to the null check at the start
        isSaved,
      });
    }
  };

  const SaveButton = () => (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10"
            onClick={handleSaveClick}
            disabled={!user || isTogglingSave}
            aria-label={isSaved ? 'Unsave vehicle' : 'Save vehicle'}
          >
            <Heart size={20} className={isSaved ? 'fill-red-500 text-red-500' : 'text-white'} />
          </Button>
        </TooltipTrigger>
        {!user && (
          <TooltipContent>
            <p>Log in to save vehicles</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  if (viewMode === 'list') {
    return (
      <LinkComponent to={`/vehicle/${vehicle.listing_id}`} className="block bg-backgroundSecondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="flex">
          <div className="w-1/3 relative">
            <img
              src={vehicle.images?.[0] || 'https://placehold.co/400x300/1a1a1a/ffffff?text=No+Image'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <SaveButton />
          </div>
          <div className="w-2/3 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <p className="text-xl font-semibold text-primary">{formatPrice(vehicle.price ?? 0)}</p>
              </div>
              <p className="text-sm text-textSecondary mb-4">{vehicle.variant}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                <InfoItem icon={Gauge} label={formatMileage(vehicle.mileage ?? 0)} />
                <InfoItem icon={GitMerge} label={vehicle.transmission} />
                <InfoItem icon={Fuel} label={vehicle.fuel_type} />
                <InfoItem icon={MapPin} label={vehicle.location} />
              </div>
            </div>
          </div>
        </div>
      </LinkComponent>
    );
  }

  return (
    <LinkComponent to={`/vehicle/${vehicle.listing_id}`} className="block bg-backgroundSecondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img
          src={vehicle.images?.[0] || 'https://placehold.co/400x300/1a1a1a/ffffff?text=No+Image'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-48 object-cover"
        />
        <SaveButton />
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-4">
          <h3 className="text-lg font-bold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
          <p className="text-sm text-gray-300 truncate">{vehicle.variant}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-primary">{formatPrice(vehicle.price ?? 0)}</p>
          <div className="flex items-center gap-2 text-sm text-textSecondary">
            <Tag size={16} className="text-primary" />
            <span>{vehicle.body_type}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <InfoItem icon={Gauge} label={formatMileage(vehicle.mileage ?? 0)} />
          <InfoItem icon={GitMerge} label={vehicle.transmission} />
          <InfoItem icon={Fuel} label={vehicle.fuel_type} />
          <InfoItem icon={MapPin} label={vehicle.location} />
        </div>
      </div>
    </LinkComponent>
  );
};
