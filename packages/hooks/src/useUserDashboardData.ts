import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { useAuth } from './useAuth';
import { Offer, VehicleListingDetailed } from '@directdrive/core-types';

export interface DashboardSummary {
  active_listings_count: number;
  unread_messages_count: number;
  active_offers_count: number;
}

export interface RecentListing {
  listing_id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  province_name: string;
  status: string;
  created_at: string;
}

export interface RecentConversation {
  id: string;
  listing_id: number | null;
  last_message_preview: string | null;
  last_message_at: string | null;
  last_message_sender_id: number | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_image: string | null;
  other_user_name: string | null;
  other_user_avatar: string | null;
  unread_count: number;
}

export interface RecentOffer {
  id: string;
  listing_id: number;
  amount: number;
  status: Offer['status'];
  created_at: string;
  sender_id: number | null;
  recipient_id: number | null;
  listing_title: string | null;
  listing_image_url: string | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  recent_listings: RecentListing[];
  recent_conversations: RecentConversation[];
  recent_offers: RecentOffer[];
}

export const useUserDashboardData = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const userId = user?.id;

  const fetchDashboardData = async (): Promise<DashboardData | null> => {
    if (!userId) return null;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Dashboard Error: Could not fetch user profile.', profileError);
      throw new Error('Could not fetch user profile for dashboard.');
    }
    const profileId = profile.id;

    const [
      listingsSummary,
      offersSummary,
      conversationsResult,
      recentListingsResult,
      recentOffersResult,
    ] = await Promise.all([
      supabase.from('vehicle_listings').select('listing_id', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'AVAILABLE'),
      supabase.from('offers').select('id', { count: 'exact', head: true }).eq('recipient_id', profileId).eq('status', 'PENDING'),
      supabase.rpc('get_conversations_for_user', { p_user_id: userId }),
      supabase.from('vehicle_listings_detailed').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
      supabase.from('offers').select('*, conversation:conversations(listing:vehicle_listings_detailed(*))').or(`recipient_id.eq.${profileId},sender_id.eq.${profileId}`).order('created_at', { ascending: false }).limit(3)
    ]);

    const errors = [listingsSummary.error, offersSummary.error, conversationsResult.error, recentListingsResult.error, recentOffersResult.error].filter(Boolean);
    if (errors.length > 0) {
      console.error('Error fetching dashboard data parts:', errors);
      throw new Error('One or more dashboard queries failed.');
    }

    const conversations = conversationsResult.data || [];
    const summary: DashboardSummary = {
      active_listings_count: listingsSummary.count ?? 0,
      unread_messages_count: conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0),
      active_offers_count: offersSummary.count ?? 0,
    };

    const recent_listings: RecentListing[] = (recentListingsResult.data as VehicleListingDetailed[] || []).map(l => ({
      listing_id: l.listing_id!,
      make: l.make!,
      model: l.model!,
      year: l.year!,
      price: l.price!,
      images: l.images || [],
      province_name: l.province_name!,
      status: l.status!,
      created_at: l.created_at!,
    }));

    const recent_conversations: RecentConversation[] = conversations.slice(0, 3).map((c: any) => ({
      id: c.id,
      listing_id: null, // The RPC does not provide this.
      last_message_preview: c.last_message_preview,
      last_message_at: c.last_message_at,
      last_message_sender_id: c.last_message_sender_id ? parseInt(c.last_message_sender_id, 10) : null,
      vehicle_make: c.vehicle_make,
      vehicle_model: c.vehicle_model,
      vehicle_image: c.vehicle_image,
      other_user_name: c.other_user_name,
      other_user_avatar: c.other_user_avatar,
      unread_count: c.unread_count,
    }));

    const recent_offers: RecentOffer[] = (recentOffersResult.data || []).map((o: any) => {
      const listing = o.conversation?.listing;
      return {
        id: o.public_id,
        listing_id: listing?.listing_id ?? 0,
        amount: o.amount,
        status: o.status,
        created_at: o.created_at,
        sender_id: o.sender_id,
        recipient_id: o.recipient_id,
        listing_title: listing ? `${listing.year} ${listing.make} ${listing.model}` : 'Listing details unavailable',
        listing_image_url: listing?.images?.[0] ?? null,
      };
    });

    return { summary, recent_listings, recent_conversations, recent_offers };
  };

  return useQuery<DashboardData | null, Error>({
    queryKey: ['dashboardData', userId],
    queryFn: fetchDashboardData,
    enabled: !!userId,
  });
};
