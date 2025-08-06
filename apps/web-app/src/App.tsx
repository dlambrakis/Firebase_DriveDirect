import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@directdrive/ui';

// Layout and Protected Route
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import DashboardPage from './pages/DashboardPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import SearchPage from './pages/SearchPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import MessagesPage from './pages/MessagesPage';
import ConversationView from './components/messages/ConversationView';
import MyListingsPage from './pages/MyListingsPage';
import SavedVehiclesPage from './pages/SavedVehiclesPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient();

/**
 * The root component of the application. It sets up all the providers (Auth, QueryClient, etc.)
 * and defines the application's routing structure.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
              {/* Use Layout for routes that should have the header and footer */}
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<HomePage />} /> {/* Use index route for the root path */}
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="update-password" element={<UpdatePasswordPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="vehicle/:listingId" element={<VehicleDetailPage />} />

                {/* Protected Routes */}
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="create-listing"
                  element={
                    <ProtectedRoute>
                      <CreateListingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit-listing/:listingId"
                  element={
                    <ProtectedRoute>
                      <EditListingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="my-listings"
                  element={
                    <ProtectedRoute>
                      <MyListingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="saved-vehicles"
                  element={
                    <ProtectedRoute>
                      <SavedVehiclesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="edit-profile"
                  element={
                    <ProtectedRoute>
                      <EditProfilePage />
                    </ProtectedRoute>
                  }
                />
                {/* Nested Routes for Messaging */}
                <Route
                  path="messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    path=":conversationId"
                    element={<ConversationView />}
                  />
                </Route>
              </Route> {/* Close the Layout route */}

              {/* Catch-all 404 Route (outside the Layout route) */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
