import React, { useCallback } from 'react';
import { useDropzone, DropzoneOptions, FileRejection } from 'react-dropzone';
import { cn } from '../lib/utils';

interface DropzoneProps extends DropzoneOptions {
  onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  className?: string;
  children?: React.ReactNode;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onDrop, className, children, ...options }) => {
  const onDropCallback = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    onDrop(acceptedFiles, fileRejections);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    ...options,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-input p-8 text-center transition-colors',
        isDragActive ? 'border-primary bg-muted' : 'hover:border-primary/50',
        className
      )}
    >
      <input {...getInputProps()} />
      {children ? (
        children
      ) : isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};
