import React from 'react';
import { useAuth, useDashboardData } from '@directdrive/hooks';
import SummaryStats from '@/components/dashboard/SummaryStats';
import UserListingsSection from '@/components/dashboard/UserListingsSection';
import RecentConversationsSection from '@/components/dashboard/RecentConversationsSection';
import DiscoverSection from '@/components/dashboard/DiscoverSection';
import { Link } from 'react-router-dom';
import { Button, Skeleton } from '@directdrive/ui';

/**
 * A component that renders the main dashboard view for an authenticated user.
 * It fetches and displays summary stats and recent activity.
 */
const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading: isLoadingDashboard } =
    useDashboardData();

  const getFirstName = () => {
    if (!user?.user_metadata?.full_name) return 'there';
    return user.user_metadata.full_name.split(' ')[0];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {getFirstName()}!
        </p>
      </div>

      <div className="space-y-8">
        {isLoadingDashboard || !dashboardData ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : (
          <SummaryStats summary={dashboardData.summary} />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UserListingsSection />
          </div>
          <div>
            <RecentConversationsSection />
          </div>
        </div>
        <DiscoverSection />
      </div>
    </div>
  );
};

/**
 * A component that renders the public-facing landing page for unauthenticated users.
 */
const PublicLandingPage: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center py-24">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to DirectDrive
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The best place to buy and sell vehicles directly.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    </div>
    <DiscoverSection />
  </div>
);

/**
 * The main home page component. It acts as a router, displaying either the
 * user dashboard or the public landing page based on the user's authentication state.
 */
const HomePage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-full animate-pulse bg-muted" />;
  }

  return user ? <UserDashboard /> : <PublicLandingPage />;
};

export default HomePage;
