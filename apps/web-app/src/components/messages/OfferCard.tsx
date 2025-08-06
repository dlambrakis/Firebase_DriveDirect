import React from 'react';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Badge } from '@directdrive/ui';
import { Offer } from '@directdrive/core-types';
import { formatPrice } from '@directdrive/utils';
import { Check, X, Repeat } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onCounterOffer: (id: number) => void;
  isMyOffer: boolean;
  canRespond: boolean;
  isResponding: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onAccept,
  onDecline,
  onCounterOffer,
  isMyOffer,
  canRespond,
  isResponding,
}) => {
  const getStatusVariant = (status: Offer['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
      case 'COUNTERED':
        return 'destructive';
      case 'PENDING':
      default:
        return 'default';
    }
  };

  const offerContextText = isMyOffer ? 'You sent an offer' : 'You received an offer';

  return (
    <div className={`flex justify-center my-4 ${isMyOffer ? 'ml-auto' : 'mr-auto'}`}>
      <Card className="w-full max-w-sm border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{offerContextText}</CardTitle>
            <Badge variant={getStatusVariant(offer.status)}>{offer.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-center text-primary">
            {formatPrice(offer.amount)}
          </p>
        </CardContent>
        {canRespond && (
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCounterOffer(offer.id)}
              disabled={isResponding}
            >
              <Repeat className="w-4 h-4 mr-2" />
              Counter
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDecline(offer.id)}
              disabled={isResponding}
            >
              <X className="w-4 h-4 mr-2" />
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => onAccept(offer.id)}
              disabled={isResponding}
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default OfferCard;
