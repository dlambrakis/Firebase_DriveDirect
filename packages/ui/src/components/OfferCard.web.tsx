import { Offer, OfferStatus } from '@directdrive/core-types';

    interface OfferCardProps {
      offer: Offer;
      isRecipient: boolean;
      onCounterOffer: (offerId: string) => void;
      onAccept: (offerId: string) => void;
      onDecline: (offerId: string) => void;
      isLoading: boolean;
      isNegotiationConcluded: boolean;
    }

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    const statusStyles: Record<OfferStatus, { container: string; badge: string }> = {
      PENDING: { container: 'bg-warning-muted border-warning-border', badge: 'bg-warning-border text-warning-text' },
      ACCEPTED: { container: 'bg-success-muted border-success-border', badge: 'bg-success-border text-success-text' },
      DECLINED: { container: 'bg-danger-muted border-danger-border', badge: 'bg-danger-border text-danger-text' },
      COUNTER_OFFERED: { container: 'bg-info-muted border-info-border', badge: 'bg-info-border text-info-text' },
      CANCELLED: { container: 'bg-danger-muted border-danger-border', badge: 'bg-danger-border text-danger-text' },
    };

    export const OfferCard = ({ offer, isRecipient, onCounterOffer, onAccept, onDecline, isLoading, isNegotiationConcluded }: OfferCardProps) => {
      const styles = statusStyles[offer.status] || statusStyles.PENDING;
      const showButtons = isRecipient && offer.status === 'PENDING' && !isNegotiationConcluded;

      return (
        <div className={`p-4 my-4 mx-auto rounded-lg w-full max-w-lg shadow-subtle border ${styles.container}`}>
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-2xl text-text-primary">{formatPrice(Number(offer.amount))}</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
              {offer.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-text-secondary mb-4">
            Offer sent: {new Date(offer.created_at).toLocaleString()}
          </p>

          {showButtons && (
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onAccept(offer.id)}
                disabled={isLoading}
                className="w-full sm:flex-1 px-4 py-2 bg-success-DEFAULT text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-disabled-background disabled:cursor-not-allowed transition-all shadow-button"
              >
                {isLoading ? 'Processing...' : 'Accept'}
              </button>
              <button
                onClick={() => onCounterOffer(offer.id)}
                disabled={isLoading}
                className="w-full sm:flex-1 px-4 py-2 bg-info-DEFAULT text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-disabled-background disabled:cursor-not-allowed transition-all shadow-button"
              >
                {isLoading ? 'Processing...' : 'Counter'}
              </button>
              <button
                onClick={() => onDecline(offer.id)}
                disabled={isLoading}
                className="w-full sm:flex-1 px-4 py-2 bg-danger-DEFAULT text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-disabled-background disabled:cursor-not-allowed transition-all shadow-button"
              >
                {isLoading ? 'Processing...' : 'Decline'}
              </button>
            </div>
          )}
        </div>
      );
    };
