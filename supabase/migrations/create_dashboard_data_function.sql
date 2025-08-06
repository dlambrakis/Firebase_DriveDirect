/*
      # Create Unified Dashboard Data Function

      This migration introduces a single, comprehensive PostgreSQL function `get_user_dashboard_data` to efficiently fetch all data required for the user dashboard in one call. This replaces the previous, limited `get_user_dashboard_summary` function.

      ## 1. Changes
        - **DROP Function**: The old `get_user_dashboard_summary(uuid)` function is removed as it is now redundant.
        - **DROP Function**: The target function `get_user_dashboard_data(uuid, int)` is dropped first to ensure the script is idempotent and avoids signature conflicts with any previously existing versions.
        - **CREATE Function**: A new function `get_user_dashboard_data(p_user_id uuid, p_limit int)` is created.

      ## 2. New Function: `get_user_dashboard_data`
        - **Purpose**: Acts as a single data source for the user dashboard, improving performance by reducing network requests from many to one.
        - **Parameters**:
          - `p_user_id`: The UUID of the user.
          - `p_limit`: An integer to limit the number of recent items returned for listings, conversations, and offers.
        - **Returns**: A single JSON object containing four keys:
          - `summary`: An object with counts for `active_listings_count`, `unread_messages_count`, and `active_offers_count`.
          - `recent_listings`: A JSON array of the user's most recent listings.
          - `recent_conversations`: A JSON array of the user's most recent conversations, including details about the listing and the other participant.
          - `recent_offers`: A JSON array of the user's most recent offers.

      ## 3. Security
        - The function is defined with `SECURITY DEFINER` for efficient cross-table querying.
        - Execute permission is granted to the `authenticated` role.
    */

    -- Drop the old, limited summary function if it exists
    DROP FUNCTION IF EXISTS get_user_dashboard_summary(uuid);

    -- Drop the target function if it exists to avoid signature conflicts
    DROP FUNCTION IF EXISTS get_user_dashboard_data(uuid, int);

    -- Create the new, comprehensive function to fetch all dashboard data in one call
    CREATE OR REPLACE FUNCTION get_user_dashboard_data(p_user_id uuid, p_limit int)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      RETURN (
        WITH summary_data AS (
          SELECT
            (SELECT COUNT(*) FROM listings WHERE seller_id = p_user_id AND status = 'AVAILABLE') AS active_listings_count,
            (SELECT COUNT(*) FROM conversations WHERE (participant1_id = p_user_id OR participant2_id = p_user_id) AND last_message_read = false AND last_message_sender_id != p_user_id) AS unread_messages_count,
            (SELECT COUNT(*) FROM offers WHERE (sender_id = p_user_id OR recipient_id = p_user_id) AND status = 'PENDING') AS active_offers_count
        ),
        listings_data AS (
          SELECT json_agg(rl) FROM (
            SELECT
              l.listing_id,
              l.title,
              l.price,
              l.default_image_url,
              l.city,
              l.province,
              l.status,
              l.created_at
            FROM listings l
            WHERE l.seller_id = p_user_id
            ORDER BY l.created_at DESC
            LIMIT p_limit
          ) rl
        ),
        conversations_data AS (
          SELECT json_agg(rc) FROM (
            SELECT
              c.id,
              c.listing_id,
              l.title AS listing_title,
              l.default_image_url AS listing_image_url,
              c.last_message,
              c.last_message_read,
              c.last_message_sender_id,
              c.updated_at,
              p.full_name AS other_participant_name,
              p.avatar_url AS other_participant_avatar_url
            FROM conversations c
            JOIN listings l ON c.listing_id = l.listing_id
            JOIN profiles p ON p.id = (CASE WHEN c.participant1_id = p_user_id THEN c.participant2_id ELSE c.participant1_id END)
            WHERE c.participant1_id = p_user_id OR c.participant2_id = p_user_id
            ORDER BY c.updated_at DESC
            LIMIT p_limit
          ) rc
        ),
        offers_data AS (
          SELECT json_agg(ro) FROM (
            SELECT
              o.id,
              o.listing_id,
              l.title AS listing_title,
              l.default_image_url AS listing_image_url,
              o.amount,
              o.status,
              o.created_at,
              o.sender_id,
              o.recipient_id
            FROM offers o
            JOIN listings l ON o.listing_id = l.listing_id
            WHERE (o.sender_id = p_user_id OR o.recipient_id = p_user_id)
            ORDER BY o.created_at DESC
            LIMIT p_limit
          ) ro
        )
        SELECT json_build_object(
          'summary', (SELECT to_json(summary_data) FROM summary_data),
          'recent_listings', COALESCE((SELECT * FROM listings_data), '[]'::json),
          'recent_conversations', COALESCE((SELECT * FROM conversations_data), '[]'::json),
          'recent_offers', COALESCE((SELECT * FROM offers_data), '[]'::json)
        )
      );
    END;
    $$;

    GRANT EXECUTE ON FUNCTION get_user_dashboard_data(uuid, int) TO authenticated;
