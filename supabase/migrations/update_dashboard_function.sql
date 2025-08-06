/*
      # Enhance User Dashboard Data Fetching

      This migration replaces the `get_user_dashboard_summary` function with a new, more comprehensive function named `get_user_dashboard_data`. The previous function only returned aggregate counts, requiring multiple additional client-side requests to populate the dashboard with recent activity.

      1.  **Problem**: The dashboard needed to make at least four separate API calls to fetch summary stats, recent listings, recent messages, and recent offers. This is inefficient, increases page load time, and complicates client-side state management.

      2.  **Solution**: The new `get_user_dashboard_data` function consolidates all required data into a single database call. It returns a unified JSON object containing summary counts and arrays of recent items.

      3.  **Key Improvements**:
          - **Performance**: Reduces the number of network requests for the dashboard from 4+ to just 1.
          - **UX**: Enables a faster, richer dashboard experience by providing all data at once.
          - **Simplicity**: Simplifies client-side logic by removing the need to orchestrate multiple data-fetching hooks.
          - **Consistency**: Ensures all data displayed on the dashboard is from a single, consistent snapshot.

      4.  **Dropped Function**:
          - `public.get_user_dashboard_summary`

      5.  **New Function**:
          - `public.get_user_dashboard_data(p_user_id uuid, p_limit INT)`: Takes a user ID and a limit for the number of recent items to return.
    */

    -- Drop the old summary-only function
    DROP FUNCTION IF EXISTS public.get_user_dashboard_summary(uuid);

    -- Create the new, comprehensive dashboard data function
    CREATE OR REPLACE FUNCTION public.get_user_dashboard_data(p_user_id uuid, p_limit INT DEFAULT 3)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      summary json;
    BEGIN
      SELECT json_build_object(
        'summary', (
          SELECT json_build_object(
            'active_listings_count', (SELECT COUNT(*) FROM public.listings WHERE seller_id = p_user_id AND status = 'AVAILABLE' AND is_sold = false),
            'unread_messages_count', (SELECT COUNT(*) FROM public.conversations WHERE (participant1_id = p_user_id OR participant2_id = p_user_id) AND last_message_read = false AND last_message_sender_id != p_user_id),
            'active_offers_count', (SELECT COUNT(*) FROM public.offers WHERE (sender_id = p_user_id OR recipient_id = p_user_id) AND status = 'PENDING')
          )
        ),
        'recent_listings', (
          SELECT COALESCE(json_agg(listings_data ORDER BY created_at DESC), '[]'::json)
          FROM (
            SELECT
              listing_id,
              title,
              price,
              default_image_url,
              city,
              province,
              status,
              created_at
            FROM public.listings
            WHERE seller_id = p_user_id
            ORDER BY created_at DESC
            LIMIT p_limit
          ) AS listings_data
        ),
        'recent_conversations', (
          SELECT COALESCE(json_agg(conversations_data ORDER BY updated_at DESC), '[]'::json)
          FROM (
            SELECT
              c.id,
              c.listing_id,
              l.title as listing_title,
              l.default_image_url as listing_image_url,
              c.last_message,
              c.last_message_read,
              c.last_message_sender_id,
              c.updated_at,
              CASE
                WHEN c.participant1_id = p_user_id THEN p2.full_name
                ELSE p1.full_name
              END as other_participant_name,
              CASE
                WHEN c.participant1_id = p_user_id THEN p2.avatar_url
                ELSE p1.avatar_url
              END as other_participant_avatar_url
            FROM public.conversations c
            JOIN public.listings l ON c.listing_id = l.listing_id
            JOIN public.profiles p1 ON c.participant1_id = p1.id
            JOIN public.profiles p2 ON c.participant2_id = p2.id
            WHERE (c.participant1_id = p_user_id OR c.participant2_id = p_user_id)
            ORDER BY c.updated_at DESC
            LIMIT p_limit
          ) AS conversations_data
        ),
        'recent_offers', (
          SELECT COALESCE(json_agg(offers_data ORDER BY created_at DESC), '[]'::json)
          FROM (
            SELECT
              o.id,
              o.listing_id,
              l.title as listing_title,
              l.default_image_url as listing_image_url,
              o.amount,
              o.status,
              o.created_at,
              o.sender_id,
              o.recipient_id
            FROM public.offers o
            JOIN public.listings l ON o.listing_id = l.listing_id
            WHERE (o.sender_id = p_user_id OR o.recipient_id = p_user_id)
            ORDER BY o.created_at DESC
            LIMIT p_limit
          ) AS offers_data
        )
      ) INTO summary;

      RETURN summary;
    END;
    $$;

    GRANT EXECUTE ON FUNCTION public.get_user_dashboard_data(uuid, INT) TO authenticated;
