import {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from 'react';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface ImagePreview {
  file?: File;
  preview: string;
  isExisting: boolean;
}

interface ImageUploadProps {
  existingImageUrls?: string[];
  maxFiles?: number;
}

export interface ImageUploadRef {
  getImageState: () => { newFiles: File[]; deletedUrls: string[] };
  validate: () => boolean;
}

export const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(
  ({ existingImageUrls = [], maxFiles = 10 }, ref) => {
    const [images, setImages] = useState<ImagePreview[]>(
      existingImageUrls.map((url) => ({ preview: url, isExisting: true }))
    );
    const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
    const errorRef = useRef<HTMLParagraphElement>(null);

    // This effect handles cleaning up the object URLs to prevent memory leaks.
    useEffect(() => {
      // This is the cleanup function that will run when the component unmounts.
      return () => {
        images.forEach((image) => {
          if (!image.isExisting) {
            URL.revokeObjectURL(image.preview);
          }
        });
      };
    }, [images]);

    const validate = () => {
      if (images.length === 0) {
        toast.error('Please upload at least one image.');
        if (errorRef.current) {
          errorRef.current.textContent = 'At least one image is required.';
        }
        return false;
      }
      if (errorRef.current) {
        errorRef.current.textContent = '';
      }
      return true;
    };

    useImperativeHandle(ref, () => ({
      getImageState: () => ({
        newFiles: images
          .filter((img) => !img.isExisting && img.file)
          .map((img) => img.file as File),
        deletedUrls: deletedUrls,
      }),
      validate,
    }));

    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        if (images.length + acceptedFiles.length > maxFiles) {
          toast.error(`You can only upload a maximum of ${maxFiles} images.`);
          return;
        }

        const newImages = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          isExisting: false,
        }));
        setImages((prev) => [...prev, ...newImages]);
        if (errorRef.current) {
          errorRef.current.textContent = '';
        }
      },
      [images, maxFiles]
    );

    const removeImage = (index: number) => {
      const imageToRemove = images[index];
      if (imageToRemove.isExisting) {
        setDeletedUrls((prev) => [...prev, imageToRemove.preview]);
      } else {
        // The useEffect cleanup will handle revoking this URL.
      }
      setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    return (
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
           ${
             isDragActive
               ? 'border-primary bg-primary/10'
               : 'border-gray-300 hover:border-primary'
           }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
            <UploadCloud className="w-12 h-12" />
            <p className="font-semibold">
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag & drop images here, or click to select'}
            </p>
            <p className="text-sm">
              PNG, JPG, WEBP up to 5MB. Max {maxFiles} images.
            </p>
          </div>
        </div>
        <p ref={errorRef} className="text-sm text-red-500 h-4"></p>
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={image.preview}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';
