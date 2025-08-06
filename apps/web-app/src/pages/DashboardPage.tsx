import React from 'react';
import { useAuth, useDashboardData } from '@directdrive/hooks';
import { DashboardData } from '@directdrive/core-types';
import { Skeleton, Card, CardHeader, CardTitle, CardContent, Button } from '@directdrive/ui';
import QuickActions from '@/components/dashboard/QuickActions';
import SummaryStats from '@/components/dashboard/SummaryStats';
import RecentListings from '@/components/dashboard/RecentListings';
import RecentConversations from '@/components/dashboard/RecentConversations';
import RecentOffers from '@/components/dashboard/RecentOffers';
import { Link } from 'react-router-dom';

/**
 * The main dashboard page for authenticated users, displaying a summary of their
 * activity, recent items, and quick actions.
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboardData();

  const getFirstName = () => {
    if (!user?.user_metadata?.full_name) return 'there';
    return user.user_metadata.full_name.split(' ')[0];
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="container-px py-8">
        <Skeleton className="h-10 w-1/2 mb-8" />
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const { summary, recent_listings, recent_conversations, recent_offers } =
    dashboardData;

  return (
    <div className="bg-background text-text-primary animate-fade-in">
      <div className="container-px py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-heading-2 md:text-heading-1">
            Welcome back, {getFirstName()}!
          </h1>
          <p className="text-body-lg text-text-secondary mt-2">
            Here's a summary of your activity.
          </p>
        </div>

        <div className="space-y-12">
          <SummaryStats summary={summary} />

          <div>
            <h2 className="text-heading-3 mb-4">Recent Activity</h2>
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
              <RecentListings listings={recent_listings} />
              <RecentConversations conversations={recent_conversations} />
              <RecentOffers offers={recent_offers} />
            </div>
          </div>

          <div>
            <h2 className="text-heading-3 mb-4">Quick Actions</h2>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
