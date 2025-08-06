import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, useLocations } from '@directdrive/hooks';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@directdrive/ui';
import { User, MapPin, Pencil } from 'lucide-react';

/**
 * A page that displays the current user's profile information.
 * It fetches the user's profile and the names of their saved locations.
 */
const ProfilePage: React.FC = () => {
  const { data: profile, isLoading: isLoadingProfile, error } = useProfile();
  const navigate = useNavigate();

  // Fetch location names based on IDs from the profile
  const { data: provinces } = useLocations('provinces');
  const { data: cities } = useLocations('cities', profile?.province_id);
  const { data: suburbs } = useLocations('suburbs', profile?.city_id);

  const provinceName = provinces?.find((p) => p.id === profile?.province_id)?.name;
  const cityName = cities?.find((c) => c.id === profile?.city_id)?.name;
  const suburbName = suburbs?.find((s) => s.id === profile?.suburb_id)?.name;

  const labelClasses = 'block text-sm font-medium text-text-secondary mb-1';
  const valueClasses = 'text-base text-text-primary';
  const infoItemClasses = 'py-4';

  const formatAddress = () => {
    if (!profile) return 'No address information provided.';
    const parts = [
      profile.complex_or_estate_name
        ? `${profile.unit_number || ''} ${profile.complex_or_estate_name}`.trim()
        : null,
      `${profile.street_number || ''} ${profile.street_name || ''}`.trim(),
      suburbName,
      cityName,
      provinceName,
      profile.postcode,
      'South Africa', // Assuming this is constant
    ];
    return parts.filter(Boolean).join(', ');
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading profile: {error.message}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Profile Not Found
        </h2>
        <p className="text-text-secondary mb-6">
          We couldn't find your profile. Please complete it.
        </p>
        <Button onClick={() => navigate('/edit-profile')}>Create Profile</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
        <Button onClick={() => navigate('/edit-profile')} className="gap-2">
          <Pencil size={16} />
          Edit Profile
        </Button>
      </div>

      {/* Personal Information Card */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <User className="w-8 h-8 text-primary" />
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 divide-y md:divide-y-0">
          <div className={infoItemClasses}>
            <label className={labelClasses}>Display Name</label>
            <p className={valueClasses}>{profile.display_name || 'N/A'}</p>
          </div>
          <div className={infoItemClasses}>
            <label className={labelClasses}>Full Name</label>
            <p className={valueClasses}>
              {`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A'}
            </p>
          </div>
          <div className={infoItemClasses}>
            <label className={labelClasses}>Contact Number</label>
            <p className={valueClasses}>{profile.contact_number || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Address Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <MapPin className="w-8 h-8 text-primary" />
          <CardTitle className="text-xl">Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 divide-y md:divide-y-0">
            <div className={infoItemClasses}>
              <label className={labelClasses}>Location Type</label>
              <p className={valueClasses}>{profile.location_type || 'N/A'}</p>
            </div>
            <div className={infoItemClasses}>
              <label className={labelClasses}>Residential Type</label>
              <p className={valueClasses}>{profile.residential_type || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <label className={labelClasses}>Full Address</label>
            <p className={valueClasses}>{formatAddress()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
