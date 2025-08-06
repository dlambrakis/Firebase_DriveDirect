import { Tables } from './database.types';

export type OfferStatus = Tables<'offers'>['status'];

export type CreateOfferPayload = {
  conversationId: string;
  amount: number;
  recipientId: string;
};

export type CounterOfferPayload = {
  originalOfferId: string;
  newAmount: number;
};
