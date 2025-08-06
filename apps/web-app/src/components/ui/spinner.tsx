import React from 'react';
import { LoaderCircle, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

// The component's props now extend LucideProps for full compatibility
// with the underlying icon library, allowing for size, strokeWidth, etc.
export interface SpinnerProps extends LucideProps {}

/**
 * A reusable spinner component for indicating loading states.
 * It uses the LoaderCircle icon from the lucide-react library.
 */
const Spinner: React.FC<SpinnerProps> = ({ className, ...props }) => {
  return (
    <LoaderCircle
      className={cn('animate-spin text-primary', className)}
      {...props}
    />
  );
};
Spinner.displayName = 'Spinner';

export { Spinner };
