import React from 'react';
import { LoaderCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-10">
      <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
};

export default LoadingSpinner;
