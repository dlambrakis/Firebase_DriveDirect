import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@directdrive/ui';
import { VehicleListingDetailed } from '@directdrive/core-types';
import { Link } from 'react-router-dom';
import { Car, MapPin } from 'lucide-react';
import { formatPrice, formatMileage } from '@directdrive/utils';

interface ListingCardProps {
  // The component should expect the detailed listing type to have all necessary info.
  vehicle: VehicleListingDetailed;
  viewMode: 'grid' | 'list';
  LinkComponent?: typeof Link; // Made optional for easier use in different contexts
}

export const ListingCard: React.FC<ListingCardProps> = ({
  vehicle,
  viewMode,
  LinkComponent = Link, // Default to standard Link if not provided
}) => {
  // Construct a dynamic title from the available data.
  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  // Use the first image from the 'images' array.
  const imageUrl =
    vehicle.images?.[0] ||
    'https://placehold.co/600x400/EEE/31343C?text=No+Image';

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md w-full">
        <LinkComponent
          to={`/listing/${vehicle.listing_id}`}
          className="block group"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 aspect-video sm:aspect-auto overflow-hidden">
              <img
                src={imageUrl}
                alt={vehicleTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="sm:w-2/3 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl mb-2 leading-tight group-hover:text-primary transition-colors">
                  {vehicleTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(vehicle.price ?? 0)}
                </p>
                <div className="text-sm text-muted-foreground mt-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {/* Use the available province_name field */}
                  {vehicle.province_name || 'Location not available'}
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <span>{vehicle.year}</span>
                  <span>{formatMileage(vehicle.mileage ?? 0)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button>View Details</Button>
              </CardFooter>
            </div>
          </div>
        </LinkComponent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <LinkComponent
        to={`/listing/${vehicle.listing_id}`}
        className="block group flex flex-col flex-grow"
      >
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <img
              src={imageUrl}
              alt={vehicleTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg mb-2 leading-tight group-hover:text-primary transition-colors">
            {vehicleTitle}
          </CardTitle>
          <p className="text-xl font-bold text-primary">
            {formatPrice(vehicle.price ?? 0)}
          </p>
          <div className="text-sm text-muted-foreground mt-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5" />
            {vehicle.province_name || 'Location not available'}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
          <Badge variant="secondary">
            {formatMileage(vehicle.mileage ?? 0)}
          </Badge>
          <div className="flex items-center">
            <Car className="w-4 h-4 mr-1.5" />
            {vehicle.year}
          </div>
        </CardFooter>
      </LinkComponent>
    </Card>
  );
};
