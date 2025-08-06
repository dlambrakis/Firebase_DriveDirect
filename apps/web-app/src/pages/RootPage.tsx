import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import LandingPage from './LandingPage';
import DashboardPage from './DashboardPage';
import LoadingSpinner from '@/components/LoadingSpinner';

/**
 * The root page of the application, which acts as a router.
 * It displays a loading spinner during the initial authentication check,
 * then renders either the main DashboardPage for authenticated users
 * or the LandingPage for unauthenticated users.
 */
const RootPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return user ? <DashboardPage /> : <LandingPage />;
};

export default RootPage;
