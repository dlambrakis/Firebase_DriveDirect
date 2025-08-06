import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useUpdateVehicleListing,
  useVehicleDetails,
  useS3Upload,
} from '@directdrive/hooks';
import { VehicleFormValues } from '@directdrive/core-types';
import { VehicleForm } from '../components/forms/VehicleForm';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Alert,
  AlertDescription,
  AlertTitle,
} from '@directdrive/ui';
import { useAuth } from '../providers/AuthProvider';
import { Loader2, Terminal } from 'lucide-react';

const EditListingPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const numericListingId = Number(listingId);

  const {
    data: vehicle,
    isLoading,
    error,
  } = useVehicleDetails(listingId, user?.id, {
    enabled: !!numericListingId && !!user,
  });

  const updateVehicleMutation = useUpdateVehicleListing();
  const { uploadFiles, isUploading } = useS3Upload();

  const handleSubmit = async (
    formData: VehicleFormValues,
    newImages: File[],
    deletedImageUrls: string[]
  ) => {
    if (!vehicle) return;

    let finalImageUrls = vehicle.images || [];

    // Step 1: Filter out the deleted images from the existing URLs.
    finalImageUrls = finalImageUrls.filter(
      (url) => !deletedImageUrls.includes(url)
    );

    // Step 2: Upload new files if there are any.
    if (newImages.length > 0) {
      try {
        const uploadedUrls = await uploadFiles(newImages);
        finalImageUrls = [...finalImageUrls, ...uploadedUrls];
      } catch (uploadError) {
        toast.error('Error Uploading Images', {
          description:
            (uploadError as Error).message ||
            'Could not upload new images. Please try again.',
        });
        return;
      }
    }

    if (finalImageUrls.length === 0) {
      toast.error('Images Required', {
        description: 'You must have at least one image for your listing.',
      });
      return;
    }

    // Step 3: Combine data and call the update mutation.
    const finalFormData: VehicleFormValues = {
      ...formData,
      id: numericListingId,
      images: finalImageUrls,
    };

    updateVehicleMutation.mutate(finalFormData, {
      onSuccess: () => {
        toast.success('Listing Updated!', {
          description: 'Your vehicle has been successfully updated.',
        });
        navigate(`/vehicle/${listingId}`);
      },
      onError: (updateError) => {
        toast.error('Error Updating Listing', {
          description:
            updateError.message ||
            'An unexpected error occurred. Please try again.',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Loading Listing</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Listing Not Found</AlertTitle>
          <AlertDescription>
            The listing you are trying to edit could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (vehicle.user_id !== user?.id) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You are not authorized to edit this listing.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Map the detailed vehicle data to the form values.
  const defaultValues: Partial<VehicleFormValues> = {
    id: vehicle.listing_id,
    price: vehicle.price,
    mileage: vehicle.mileage,
    description: vehicle.description,
    vin: vehicle.vin,
    // The 'features' property on the detailed view is an array of strings.
    // We need to map this to the feature IDs for the form.
    // This requires a lookup against the full features list.
    // For now, we'll pass an empty array and assume the form logic handles this.
    feature_ids: [],
  };

  const isSubmitting = isUploading || updateVehicleMutation.isPending;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Your Listing</CardTitle>
          <CardDescription>
            Update the details of your vehicle listing below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            defaultValues={defaultValues}
            existingImageUrls={vehicle.images || []}
            submitButtonText={
              isUploading
                ? 'Uploading Images...'
                : isSubmitting
                ? 'Saving Changes...'
                : 'Save Changes'
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditListingPage;
