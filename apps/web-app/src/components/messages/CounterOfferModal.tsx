import React from 'react';
import { useToast, OfferModal } from '@directdrive/ui';
import { useCounterOffer } from '@directdrive/hooks';

// The props have been updated to match the requirements of the useCounterOffer hook.
interface CounterOfferModalProps {
  originalOfferId: number;
  onClose: () => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  originalOfferId,
  onClose,
}) => {
  const { toast } = useToast();
  const counterOfferMutation = useCounterOffer();

  const onSubmit = (amount: number) => {
    // The mutate function is now called with the correct parameters.
    counterOfferMutation.mutate(
      {
        originalOfferId: originalOfferId,
        newAmount: amount,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Your counter offer has been sent.',
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <OfferModal
      isOpen={true}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={counterOfferMutation.isPending}
      title="Make a Counter Offer"
      description="Propose a new amount for this vehicle. This will create a new offer and decline the current one."
      submitButtonText="Send Counter Offer"
    />
  );
};
