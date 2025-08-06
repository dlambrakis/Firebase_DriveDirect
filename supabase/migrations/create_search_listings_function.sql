/*
      # Create Search Listings Function

      This migration introduces a new RPC function `search_listings` to enable advanced searching and filtering of vehicle listings.

      1.  **New Function**
          - `search_listings(p_search_text, p_make_ids, ...)`: A PostgreSQL function that allows filtering listings by various criteria like make, model, price, year, mileage, and other vehicle attributes. It also supports sorting and pagination.

      2.  **Functionality**
          - **Dynamic Filtering**: The function dynamically builds a query based on the provided parameters. Null or default parameters are ignored.
          - **Full-Text Search**: Includes a basic text search across make, model, and variant.
          - **Sorting**: Allows sorting results by price, mileage, year, or creation date.
          - **Pagination**: Supports `limit` and `offset` for paginating through results.
          - **Total Count**: Efficiently returns the total number of matching records for UI pagination display.

      3.  **Return Type**
          - The function returns a table of listings with a structure that matches the `VehicleWithImages` type, including aggregated image URLs and the total count.
    */

    CREATE OR REPLACE FUNCTION search_listings(
        p_search_text TEXT DEFAULT NULL,
        p_make_ids INT[] DEFAULT NULL,
        p_model_ids INT[] DEFAULT NULL,
        p_min_price INT DEFAULT NULL,
        p_max_price INT DEFAULT NULL,
        p_min_year INT DEFAULT NULL,
        p_max_year INT DEFAULT NULL,
        p_min_mileage INT DEFAULT NULL,
        p_max_mileage INT DEFAULT NULL,
        p_body_type_ids INT[] DEFAULT NULL,
        p_transmission_type_ids INT[] DEFAULT NULL,
        p_fuel_type_ids INT[] DEFAULT NULL,
        p_drivetrain_ids INT[] DEFAULT NULL,
        p_sort_by TEXT DEFAULT 'created_at_desc',
        p_limit INT DEFAULT 20,
        p_offset INT DEFAULT 0
    )
    RETURNS TABLE (
        listing_id INT,
        make TEXT,
        model TEXT,
        variant TEXT,
        year INT,
        price INT,
        mileage INT,
        body_type TEXT,
        fuel_type TEXT,
        transmission TEXT,
        location TEXT,
        created_at TIMESTAMPTZ,
        images JSONB,
        total_count BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
        WITH listing_images AS (
            SELECT
                li.listing_id,
                jsonb_agg(jsonb_build_object('image_url', li.image_url) ORDER BY li.id) AS images
            FROM listing_images li
            GROUP BY li.listing_id
        )
        SELECT
            l.id,
            ma.name AS make,
            mo.name AS model,
            l.variant,
            l.year,
            l.price,
            l.mileage,
            bt.name AS body_type,
            ft.name AS fuel_type,
            tt.name AS transmission,
            p.city || ', ' || pr.name AS location,
            l.created_at,
            COALESCE(li.images, '[]'::jsonb),
            COUNT(*) OVER() as total_count
        FROM listings l
        JOIN makes ma ON l.make_id = ma.id
        JOIN models mo ON l.model_id = mo.id
        JOIN body_types bt ON l.body_type_id = bt.id
        JOIN transmission_types tt ON l.transmission_type_id = tt.id
        JOIN fuel_types ft ON l.fuel_type_id = ft.id
        JOIN drivetrains dt ON l.drivetrain_id = dt.id
        JOIN profiles p ON l.seller_id = p.id
        JOIN provinces pr ON p.province_id = pr.id
        LEFT JOIN listing_images li ON l.id = li.listing_id
        WHERE l.status = 'available'
          AND (p_search_text IS NULL OR (ma.name ILIKE '%' || p_search_text || '%' OR mo.name ILIKE '%' || p_search_text || '%' OR l.variant ILIKE '%' || p_search_text || '%'))
          AND (p_make_ids IS NULL OR l.make_id = ANY(p_make_ids))
          AND (p_model_ids IS NULL OR l.model_id = ANY(p_model_ids))
          AND (p_min_price IS NULL OR l.price >= p_min_price)
          AND (p_max_price IS NULL OR l.price <= p_max_price)
          AND (p_min_year IS NULL OR l.year >= p_min_year)
          AND (p_max_year IS NULL OR l.year <= p_max_year)
          AND (p_min_mileage IS NULL OR l.mileage >= p_min_mileage)
          AND (p_max_mileage IS NULL OR l.mileage <= p_max_mileage)
          AND (p_body_type_ids IS NULL OR l.body_type_id = ANY(p_body_type_ids))
          AND (p_transmission_type_ids IS NULL OR l.transmission_type_id = ANY(p_transmission_type_ids))
          AND (p_fuel_type_ids IS NULL OR l.fuel_type_id = ANY(p_fuel_type_ids))
          AND (p_drivetrain_ids IS NULL OR l.drivetrain_id = ANY(p_drivetrain_ids))
        ORDER BY
            CASE WHEN p_sort_by = 'price_asc' THEN l.price END ASC,
            CASE WHEN p_sort_by = 'price_desc' THEN l.price END DESC,
            CASE WHEN p_sort_by = 'mileage_asc' THEN l.mileage END ASC,
            CASE WHEN p_sort_by = 'mileage_desc' THEN l.mileage END DESC,
            CASE WHEN p_sort_by = 'year_desc' THEN l.year END DESC,
            CASE WHEN p_sort_by = 'year_asc' THEN l.year END ASC,
            l.created_at DESC -- Default sort
        LIMIT p_limit
        OFFSET p_offset;
    END;
    $$;
