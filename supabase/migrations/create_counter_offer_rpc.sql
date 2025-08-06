/*
      # Create counter_offer RPC Function

      This migration introduces a new RPC function `counter_offer` to handle the business logic for making a counter-offer in a negotiation.

      1. New Functions
        - `counter_offer(p_original_offer_id uuid, p_new_amount numeric)`
          - This function provides an atomic way to make a counter-offer.
          - It ensures that the original offer is declined and a new offer is created in a single transaction.

      2. Logic
        - Fetches the original offer.
        - Validates that the caller is the recipient of the original offer.
        - Validates that the original offer is still in a 'PENDING' state.
        - Updates the original offer's status to 'DECLINED'.
        - Inserts a new offer record with the counter-offer details, swapping the sender and recipient.
        - Returns the newly created offer.

      3. Security
        - The function runs with the permissions of the user who defines it (`security definer`), but internally checks `auth.uid()` to ensure only the intended recipient can perform the action. This prevents unauthorized users from countering offers.
    */
    create or replace function public.counter_offer(p_original_offer_id uuid, p_new_amount numeric)
    returns offers
    language plpgsql
    security definer
    set search_path = public
    as $$
    declare
      original_offer record;
      new_offer offers;
    begin
      -- 1. Fetch the original offer
      select * into original_offer from public.offers where id = p_original_offer_id;

      if not found then
        raise exception 'Original offer not found.';
      end if;

      -- 2. Check if the caller is the recipient of the original offer
      if original_offer.recipient_id != auth.uid() then
        raise exception 'Only the recipient can counter an offer.';
      end if;

      -- 3. Check if the offer is still pending
      if original_offer.status != 'PENDING' then
          raise exception 'Can only counter a pending offer.';
      end if;

      -- 4. Decline the original offer
      update public.offers
      set status = 'DECLINED'
      where id = p_original_offer_id;

      -- 5. Create the new counter offer
      insert into public.offers (conversation_id, amount, sender_id, recipient_id, vehicle_id)
      values (original_offer.conversation_id, p_new_amount, auth.uid(), original_offer.sender_id, original_offer.vehicle_id)
      returning * into new_offer;

      return new_offer;
    end;
    $$;
