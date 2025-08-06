/*
  # Deprecate `get_vehicle_filter_counts` Function

  This migration removes the old `get_vehicle_filter_counts` SQL function.

  1.  **Reasoning**: This function has been superseded by the more advanced and context-aware `get_vehicle_filter_options` function.
  2.  **Impact**: The mobile application's filter modal has been refactored to use the new function via the shared `useFilterOptions` hook. This old function is no longer called by any part of the application.
  3.  **Action**: Drop the function to reduce code redundancy and simplify database maintenance.
*/

DROP FUNCTION IF EXISTS public.get_vehicle_filter_counts(
    text,
    integer,
    integer,
    character varying,
    character varying,
    integer,
    integer,
    integer,
    integer,
    character varying,
    character varying,
    character varying,
    character varying
);
