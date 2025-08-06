import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useVehicleDetails,
  useCreateConversation,
  useToggleSaveVehicle,
} from '@directdrive/hooks';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Textarea,
  Button,
  Alert,
  AlertDescription,
  AlertTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@directdrive/ui';
import { useAuth } from '../providers/AuthProvider';
import { formatCurrency, formatMileage } from '@/lib/utils';
import { Heart, Loader2, MessageSquare, Pencil, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { VehicleListingDetailed } from '@directdrive/core-types';

/**
 * A page that displays the full details of a single vehicle listing.
 * It provides actions for the owner (edit) and potential buyers (save, contact).
 */
export const VehicleDetailPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: vehicle,
    isLoading,
    error,
  } = useVehicleDetails(listingId, user?.id);
  const { mutate: createConversation, isPending: isCreatingConversation } =
    useCreateConversation();
  const { mutate: toggleSave, isPending: isTogglingSave } =
    useToggleSaveVehicle();

  const [message, setMessage] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Vehicle not found.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleToggleSave = () => {
    if (!user || !vehicle.listing_id) {
      toast.error('Authentication Error', {
        description: 'You must be logged in to save vehicles.',
      });
      return;
    }
    toggleSave({ listingId: vehicle.listing_id });
  };

  const handleSendMessage = () => {
    if (!user) {
      toast.error('Authentication Error', {
        description: 'You must be logged in to send a message.',
      });
      return;
    }
    if (!message.trim()) {
      toast.error('Empty Message', {
        description: 'Please enter a message to send.',
      });
      return;
    }
    if (vehicle.listing_id && vehicle.user_id) {
      createConversation(
        {
          listingId: vehicle.listing_id,
          sellerId: vehicle.user_id,
          messageContent: message,
        },
        {
          onSuccess: (conversationId) => {
            navigate(`/messages/${conversationId}`);
          },
          onError: (err) => {
            toast.error('Error sending message', {
              description: err.message,
            });
          },
        }
      );
    }
  };

  const isOwner = user?.id === vehicle.user_id;

  const vehicleAttributes = [
    { label: 'VIN', value: vehicle.vin },
    {
      label: 'Mileage',
      value: vehicle.mileage ? formatMileage(vehicle.mileage) : 'N/A',
    },
    // Add other attributes from the detailed view as needed
    { label: 'Variant', value: vehicle.variant || 'N/A' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Carousel className="w-full">
            <CarouselContent>
              {vehicle.images?.length > 0 ? (
                vehicle.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`${vehicle.make} ${vehicle.model} ${index + 1}`}
                      className="w-full h-auto object-cover rounded-lg aspect-video"
                    />
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="w-full h-auto bg-secondary rounded-lg aspect-video flex items-center justify-center">
                    <p className="text-muted-foreground">No Image Available</p>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{vehicle.description}</p>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {(vehicle.features as string[])?.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</CardTitle>
                  <p className="text-xl text-muted-foreground">
                    {vehicle.variant}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {isOwner && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/edit-listing/${vehicle.listing_id}`}>
                              <Pencil className="h-6 w-6" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Listing</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleToggleSave}
                          disabled={isTogglingSave || !user || isOwner}
                        >
                          <Heart
                            className={cn(
                              'h-6 w-6',
                              (vehicle as any).is_saved
                                ? 'text-red-500 fill-current'
                                : 'text-gray-500'
                            )}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {!user
                            ? 'Log in to save'
                            : isOwner
                            ? 'This is your listing'
                            : (vehicle as any).is_saved
                            ? 'Unsave vehicle'
                            : 'Save vehicle'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <p className="text-3xl font-bold text-primary mt-2">
                {formatCurrency(vehicle.price || 0)}
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {vehicleAttributes.map((attr) => (
                    <TableRow key={attr.label}>
                      <TableCell className="font-medium">
                        {attr.label}
                      </TableCell>
                      <TableCell>{attr.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!isOwner && user && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Contact Seller</h3>
                  <Textarea
                    placeholder="Hi, I'm interested in this vehicle..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button
                    className="w-full mt-2"
                    onClick={handleSendMessage}
                    disabled={isCreatingConversation}
                  >
                    {isCreatingConversation ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="mr-2 h-4 w-4" />
                    )}
                    Send Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
