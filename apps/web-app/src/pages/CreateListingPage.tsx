import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVehicleListing, useS3Upload } from '@directdrive/hooks';
import { VehicleFormValues } from '@directdrive/core-types';
import { VehicleForm } from '../components/forms/VehicleForm';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@directdrive/ui';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const createVehicleMutation = useCreateVehicleListing();
  const { uploadFiles, isUploading } = useS3Upload();

  const handleSubmit = async (
    formData: VehicleFormValues,
    newImages: File[]
  ) => {
    if (newImages.length === 0) {
      toast.error('Images Required', {
        description: 'You must upload at least one image for your listing.',
      });
      return;
    }

    try {
      // Step 1: Upload the new images to your storage bucket.
      const uploadedImageUrls = await uploadFiles(newImages);

      // Step 2: Combine the new image URLs with the form data.
      const finalFormData: VehicleFormValues = {
        ...formData,
        images: uploadedImageUrls, // The schema expects an array of strings (URLs)
      };

      // Step 3: Call the mutation to create the vehicle listing in the database.
      createVehicleMutation.mutate(finalFormData, {
        onSuccess: (newListingId) => {
          toast.success('Listing Created!', {
            description: 'Your vehicle has been successfully listed.',
          });
          // The RPC function returns the new listing ID.
          navigate(`/vehicle/${newListingId}`);
        },
        onError: (error) => {
          toast.error('Error Creating Listing', {
            description:
              error.message || 'An unexpected error occurred. Please try again.',
          });
        },
      });
    } catch (error) {
      toast.error('Error Uploading Images', {
        description:
          (error as Error).message ||
          'Could not upload images. Please try again.',
      });
    }
  };

  const isSubmitting = isUploading || createVehicleMutation.isPending;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create a New Listing
          </CardTitle>
          <CardDescription>
            Fill out the details below to put your car on the market.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText={
              isUploading
                ? 'Uploading Images...'
                : isSubmitting
                ? 'Creating Listing...'
                : 'Create Listing'
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateListingPage;
