import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  useProfile,
  useUpdateProfile,
  useProvinces,
  useCities,
  useSuburbs,
} from '@directdrive/hooks';
import { Database, Profile } from '@directdrive/core-types';
import { Colors, Typography } from '@directdrive/theme';
import { Save } from 'lucide-react-native';
import StyledSelect from '@/components/form/StyledSelect';

// Corrected Enums to match database schema
type LocationType = Database['public']['Enums']['location_type_enum'];
type ResidentialType = Database['public']['Enums']['residential_type_enum'];

const locationTypes: LocationType[] = ['Urban', 'Rural', 'Suburban'];
const residentialTypes: ResidentialType[] = ['House', 'Apartment', 'Complex', 'Estate'];

export default function EditProfileScreen() {
  // Centralized hooks for data fetching and mutations
  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  // Local state for form management
  const [profile, setProfile] = useState<Partial<Profile>>({});

  // Location data hooks
  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const { data: cities, isLoading: isLoadingCities } = useCities(profile.province_id);
  const { data: suburbs, isLoading: isLoadingSuburbs } = useSuburbs(profile.city_id);

  // Effect to sync fetched profile data into local form state
  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  const handleProfileChange = (name: keyof Profile, value: any) => {
    const updatedValue = value === '' ? null : value;
    setProfile(prev => {
      const newProfile = { ...prev, [name]: updatedValue };
      // Reset dependent dropdowns when a parent dropdown changes
      if (name === 'province_id') {
        newProfile.city_id = null;
        newProfile.suburb_id = null;
      }
      if (name === 'city_id') {
        newProfile.suburb_id = null;
      }
      return newProfile;
    });
  };

  const handleSubmit = () => {
    // Exclude fields that should not be sent in the update payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, user_id, public_id, created_at, updated_at, ...profileUpdateData } = profile;

    updateProfile(profileUpdateData, {
      onSuccess: () => {
        Alert.alert('Success', 'Profile updated successfully!');
      },
      onError: (error) => {
        Alert.alert('Error', `Failed to update profile: ${error.message}`);
      },
    });
  };

  if (isLoadingProfile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  const renderInput = (label: string, value: string | null | undefined, onChangeText: (text: string) => void, placeholder: string, keyboardType: 'default' | 'numeric' = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value ?? ''}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.tertiary}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {renderInput('Display Name', profile.display_name, (text) => handleProfileChange('display_name', text), 'e.g. John D.')}
        {renderInput('First Name', profile.first_name, (text) => handleProfileChange('first_name', text), 'e.g. John')}
        {renderInput('Last Name', profile.last_name, (text) => handleProfileChange('last_name', text), 'e.g. Doe')}
        {renderInput('Contact Number', profile.contact_number, (text) => handleProfileChange('contact_number', text), 'e.g. 0821234567', 'numeric')}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <StyledSelect
          label="Location Type"
          selectedValue={profile.location_type}
          onValueChange={(value) => handleProfileChange('location_type', value)}
          options={[{ label: 'Select type...', value: null }, ...locationTypes.map(t => ({ label: t, value: t }))]}
        />

        <StyledSelect
          label="Residential Type"
          selectedValue={profile.residential_type}
          onValueChange={(value) => handleProfileChange('residential_type', value)}
          options={[{ label: 'Select type...', value: null }, ...residentialTypes.map(t => ({ label: t, value: t }))]}
        />

        {(profile.residential_type === 'Complex' || profile.residential_type === 'Estate') && (
          <>
            {renderInput('Complex/Estate Name', profile.complex_or_estate_name, (text) => handleProfileChange('complex_or_estate_name', text), 'e.g. The Oaks')}
            {renderInput('Unit Number', profile.unit_number, (text) => handleProfileChange('unit_number', text), 'e.g. 12B')}
          </>
        )}

        {renderInput('Street Number', profile.street_number, (text) => handleProfileChange('street_number', text), 'e.g. 123')}
        {renderInput('Street Name', profile.street_name, (text) => handleProfileChange('street_name', text), 'e.g. Main Road')}

        <StyledSelect
          label="Province"
          selectedValue={profile.province_id}
          onValueChange={(value) => handleProfileChange('province_id', value)}
          options={[{ label: isLoadingProvinces ? 'Loading...' : 'Select province...', value: null }, ...(provinces || []).map(p => ({ label: p.name, value: p.id }))]}
          disabled={isLoadingProvinces}
        />

        <StyledSelect
          label="City"
          selectedValue={profile.city_id}
          onValueChange={(value) => handleProfileChange('city_id', value)}
          options={[{ label: isLoadingCities ? 'Loading...' : 'Select city...', value: null }, ...(cities || []).map(c => ({ label: c.name, value: c.id }))]}
          disabled={!profile.province_id || isLoadingCities}
        />

        <StyledSelect
          label="Suburb"
          selectedValue={profile.suburb_id}
          onValueChange={(value) => handleProfileChange('suburb_id', value)}
          options={[{ label: isLoadingSuburbs ? 'Loading...' : 'Select suburb...', value: null }, ...(suburbs || []).map(s => ({ label: s.name, value: s.id }))]}
          disabled={!profile.city_id || isLoadingSuburbs}
        />

        {renderInput('Postcode', profile.postcode, (text) => handleProfileChange('postcode', text), 'e.g. 2000', 'numeric')}
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, styles.primaryButton, { opacity: pressed || isSaving ? 0.8 : 1 }]}
        onPress={handleSubmit}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Save color={Colors.white} size={20} />
            <Text style={[styles.buttonText, { color: Colors.white }]}>Save Changes</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
  },
  contentContainer: {
    padding: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.DEFAULT,
  },
  section: {
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    ...Typography.body.sm,
    fontFamily: 'Inter_500Medium',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    ...Typography.body.md,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    color: Colors.text.primary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  buttonText: {
    ...Typography.body.md,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 12,
  },
});
