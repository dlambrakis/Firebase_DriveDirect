import React from 'react';
import { Link } from 'react-router-dom';
import { VehicleWithDetails } from '@directdrive/core-types';
import { formatPrice, formatMileage } from '@directdrive/utils';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  Badge,
} from '@directdrive/ui';
// NOTE: The custom ImageCarousel component was not found during the build.
// This has been replaced with a simple image display. You may need to create this component.
import {
  Tag,
  Calendar,
  Gauge,
  MapPin,
  User,
  Edit,
  ShoppingCart,
  Phone,
} from 'lucide-react';

interface VehicleDetailCardProps {
  vehicle: VehicleWithDetails;
  isOwner: boolean;
  onMakeOffer: () => void;
  onContactSeller: () => void;
}

const VehicleDetailCard: React.FC<VehicleDetailCardProps> = ({
  vehicle,
  isOwner,
  onMakeOffer,
  onContactSeller,
}) => {
  // NOTE: The 'formatRelativeDate' utility was not found.
  // Replaced with a standard date format.
  const formattedDate = new Date(
    vehicle.created_at || ''
  ).toLocaleDateString();

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        {/* Replaced missing ImageCarousel with a simple image */}
        <img
          src={
            vehicle.images?.[0] ||
            'https://placehold.co/600x400/EEE/31343C?text=No+Image'
          }
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="row-start-1 md:row-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</CardTitle>
            <p className="text-2xl font-semibold text-primary">
              {formatPrice(vehicle.price ?? 0)}
            </p>
            {vehicle.status === 'SOLD' && (
              <Badge className="w-fit bg-red-600 text-white">SOLD</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {/* Corrected to use 'province_name' from the detailed view type */}
              <span>{vehicle.province_name || 'N/A'}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Listed {formattedDate}</span>
            </div>
            <Separator />
            {isOwner ? (
              <Button asChild className="w-full">
                {/* Corrected to use 'listing_id' for the link */}
                <Link to={`/my-listings/edit/${vehicle.listing_id}`}>
                  <Edit className="w-4 h-4 mr-2" /> Edit Listing
                </Link>
              </Button>
            ) : (
              <div className="space-y-2">
                <Button onClick={onMakeOffer} className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Make an Offer
                </Button>
                <Button
                  onClick={onContactSeller}
                  className="w-full"
                  variant="outline"
                >
                  <Phone className="w-4 h-4 mr-2" /> Contact Seller
                </Button>
              </div>
            )}
            {/* Corrected to use 'user_id' for the profile link */}
            <Link to={`/profile/${vehicle.user_id}`} className="block pt-2">
              <div className="flex items-center space-x-3 mt-2 p-3 bg-muted rounded-lg transition-colors hover:bg-accent">
                <User className="w-8 h-8 text-muted-foreground" />
                <div>
                  {/* 'seller_username' is not in the type, using a placeholder */}
                  <p className="font-semibold text-sm">Seller Profile</p>
                  <p className="text-xs text-muted-foreground">View Profile</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {vehicle.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Gauge className="w-4 h-4 mr-2 text-primary" />
                <strong>Mileage:</strong>
                <span className="ml-2">{formatMileage(vehicle.mileage ?? 0)}</span>
              </div>
              {/* The detailed view includes 'variant', but not individual specs. */}
              {vehicle.variant && (
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-primary" />
                  <strong>Variant:</strong>
                  <span className="ml-2">{vehicle.variant}</span>
                </div>
              )}
            </div>
            {/* The 'features' property is a JSON array of strings */}
            {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.length > 0 && (
              <>
                <Separator className="my-6" />
                <h3 className="text-lg font-semibold mb-4">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {/* Added explicit 'string' type to the feature parameter */}
                  {vehicle.features.map((feature: string) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleDetailCard;
