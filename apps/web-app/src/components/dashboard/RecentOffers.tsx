import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@directdrive/ui';
// The specific 'RecentOffer' type is not defined; using the base 'Offer' type is more robust.
import { Offer } from '@directdrive/core-types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/providers/AuthProvider';
import { formatPrice } from '@directdrive/utils';

interface RecentOffersProps {
  // Use the base 'Offer' type from core-types
  offers: Offer[];
}

const RecentOffers: React.FC<RecentOffersProps> = ({ offers }) => {
  const { user } = useAuth();

  // This function now correctly compares the user's string UUID with the offer's user_id
  const getOfferContext = (offer: Offer) => {
    // Note: The base 'Offer' type does not contain the other participant's name.
    // This logic assumes you might add it to a more detailed type later.
    if (offer.sender_id === user?.id) {
      return { text: 'Offer Sent', direction: 'to' };
    }
    return { text: 'Offer Received', direction: 'from' };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Offers</CardTitle>
        <Button asChild variant="link" className="text-sm">
          <Link to="/offers">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {offers.length > 0 ? (
            offers.map((offer) => (
              // The 'Offer' type doesn't have listing details, so this links to the conversation.
              <Link
                to={`/messages/${offer.conversation_id}`}
                key={offer.id}
                className="flex items-center space-x-4 group"
              >
                {/* Placeholder for an image, as the base offer doesn't include it */}
                <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {formatPrice(offer.amount)}
                  </p>
                  <p className="text-sm text-text-secondary truncate">
                    {/* Placeholder for listing title */}
                    Vehicle Offer
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {getOfferContext(offer).text} •{' '}
                    {formatDistanceToNow(new Date(offer.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Badge
                  variant={offer.status === 'PENDING' ? 'default' : 'secondary'}
                >
                  {offer.status}
                </Badge>
              </Link>
            ))
          ) : (
            <p className="text-text-secondary text-center py-4">
              You have no recent offers.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOffers;
